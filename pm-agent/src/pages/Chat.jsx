import React, { useState, useEffect, useRef } from 'react';
import { Box, Container, Typography, Paper, Button, Grid, Menu, MenuItem, IconButton, CircularProgress } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DescriptionIcon from '@mui/icons-material/Description';
import SettingsIcon from '@mui/icons-material/Settings';
import ChatInput from '../components/ChatInput';
import ChatMessage from '../components/ChatMessage';
import FileUploadModal from '../components/FileUploadModal';
import { useAuth } from '../contexts/AuthContext';
import { signOut } from '../utils/firebaseUtils';
import { useNavigate } from 'react-router-dom';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadModalTitle, setUploadModalTitle] = useState('');
  const [uploadFolder, setUploadFolder] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Handle settings menu
  const handleSettingsClick = (event) => setAnchorEl(event.currentTarget);
  const handleSettingsClose = () => setAnchorEl(null);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
    handleSettingsClose();
  };

  // Initial AI greeting message
  useEffect(() => {
    setMessages([{
      text: "Hello! I'm your AI project management assistant. I can help you track progress, analyze weekly updates, and manage your projects. How can I assist you today?",
      timestamp: new Date().getTime(),
      isUser: false,
    }]);
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send message to FastAPI backend
  const handleSendMessage = async (messageText) => {
    const uid = currentUser?.uid || localStorage.getItem('user_id');
    if (!uid) {
      setMessages((prev) => [
        ...prev,
        { text: 'You must be logged in to chat.', isUser: false, timestamp: Date.now() },
      ]);
      return;
    }

    const userMessage = { text: messageText, isUser: true, timestamp: new Date().getTime() };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const token = localStorage.getItem('access_token');
      const payload = { user_id: uid, message: messageText, thread_id: 3 };

      const res = await fetch('http://localhost:8000/chat/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || 'Failed to get response from chat API');
      }

      const data = await res.json();
      const aiMessage = { text: data.response, isUser: false, timestamp: new Date().getTime() };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { text: 'Error: ' + error.message, isUser: false, timestamp: new Date().getTime() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Open modal for weekly update upload
  const handleWeeklyUpdate = () => {
    setUploadModalTitle('Upload Weekly Update');
    setUploadFolder('weekly-updates');
    setUploadModalOpen(true);
  };

  // Open modal for solution document upload
  const handleSolutionDoc = () => {
    setUploadModalTitle('Upload Solution Document');
    setUploadFolder('solution-docs');
    setUploadModalOpen(true);
  };

  // Handle successful file upload
  const handleUploadSuccess = (fileData) => {
    // Show file info in chat
    const fileMessage = {
      text: `Uploaded file: ${fileData.name}\nType: ${fileData.type}\nSize: ${(fileData.size / 1024).toFixed(2)} KB`,
      timestamp: new Date().getTime(),
      isUser: true
    };
    setMessages((prev) => [...prev, fileMessage]);

    // Simulate AI response to file upload
    setTimeout(() => {
      let responseText = '';
      if (uploadFolder === 'weekly-updates') {
        responseText = `I've received your weekly update file "${fileData.name}".\n\nWould you like me to extract key information from this document or help you track specific tasks from it?`;
      } else if (uploadFolder === 'solution-docs') {
        responseText = `I've received your solution document "${fileData.name}".\n\nI can help you analyze this document or create additional documentation based on its contents. What would you like to do next?`;
      } else {
        responseText = `I've received your file "${fileData.name}".\n\nHow would you like me to help you with this file?`;
      }
      const aiResponse = { text: responseText, timestamp: new Date().getTime(), isUser: false };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  return (
    <Box
      sx={{
        backgroundColor: '#0A1929',
        height: '100vh',
        width: '100%',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          padding: '12px 24px',
          width: '100%',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box
            sx={{
              backgroundColor: '#1976d2',
              borderRadius: '6px',
              padding: '6px',
              mr: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography sx={{ fontWeight: 'bold', color: 'white' }}>PM</Typography>
          </Box>
          <Typography variant="h6">Project Manager</Typography>
        </Box>
        <IconButton 
          onClick={handleSettingsClick}
          sx={{ color: 'white' }}
        >
          <SettingsIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleSettingsClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Box>

      {/* Chat Container */}
      <Container 
        maxWidth="md" 
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          height: 'calc(100vh - 64px)',
          padding: '16px',
          overflow: 'hidden',
        }}
      >
        {/* Messages Area */}
        <Paper
          elevation={0}
          sx={{
            flex: 1,
            width: '100%',
            backgroundColor: 'transparent',
            overflow: 'auto',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            marginBottom: '16px',
            height: 'calc(100% - 120px)',
          }}
          className="chat-scrollable"
        >
          {messages.map((message, index) => (
            <ChatMessage
              key={index}
              message={message}
              isAI={!message.isUser}
            />
          ))}
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
              <CircularProgress size={28} sx={{ color: '#1976d2' }} />
            </Box>
          )}
          <div ref={messagesEndRef} />
        </Paper>

        {/* Action Buttons */}
        <Grid container spacing={2} justifyContent="center" sx={{ mb: 2 }}>
          <Grid item>
            <Button
              variant="outlined"
              startIcon={<CalendarTodayIcon />}
              onClick={handleWeeklyUpdate}
              sx={{
                color: '#2196f3',
                borderColor: '#2196f3',
                '&:hover': {
                  borderColor: '#1976d2',
                  backgroundColor: 'rgba(33, 150, 243, 0.08)',
                },
              }}
            >
              Weekly Update
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              startIcon={<DescriptionIcon />}
              onClick={handleSolutionDoc}
              sx={{
                color: '#2196f3',
                borderColor: '#2196f3',
                '&:hover': {
                  borderColor: '#1976d2',
                  backgroundColor: 'rgba(33, 150, 243, 0.08)',
                },
              }}
            >
              Solution Document
            </Button>
          </Grid>
        </Grid>

        {/* Chat Input */}
        <Box sx={{ width: '100%', marginTop: 'auto' }}>
          <ChatInput onSendMessage={handleSendMessage} />
        </Box>

        {/* File Upload Modal */}
        <FileUploadModal
          open={uploadModalOpen}
          onClose={() => setUploadModalOpen(false)}
          title={uploadModalTitle}
          folder={uploadFolder}
          onUploadSuccess={handleUploadSuccess}
        />
      </Container>
    </Box>
  );
};

export default Chat;




