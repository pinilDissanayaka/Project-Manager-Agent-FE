import React, { useState, useEffect, useRef } from 'react';
import { Box, Container, Typography, Paper, Button, Grid, Menu, MenuItem, IconButton, CircularProgress } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DescriptionIcon from '@mui/icons-material/Description';
import SettingsIcon from '@mui/icons-material/Settings';
import AddIcon from '@mui/icons-material/Add';
import ChatInput from '../components/ChatInput';
import ChatMessage from '../components/ChatMessage';
import FileUploadModal from '../components/FileUploadModal';
import { useAuth } from '../contexts/AuthContext';
import { signOut } from '../utils/firebaseUtils';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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

  // Handle new chat - creates new thread ID and clears messages
  const handleNewChat = () => {
    // Generate new random thread ID
    const newThreadId = Math.floor(Math.random() * 100000000);
    localStorage.setItem('thread_id', newThreadId);
    
    // Clear current messages and add initial AI greeting
    setMessages([{
      text: "Hello! I'm your AI project management assistant. I can help you track progress, analyze weekly updates, and manage your projects. How can I assist you today?",
      timestamp: new Date().getTime(),
      isUser: false,
    }]);
    
    console.log('New chat started with Thread ID:', newThreadId);
  };

  const handleLogout = async () => {
    try {
      // Clear local storage first
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_id');
      localStorage.removeItem('thread_id');
      localStorage.removeItem('session_expiry');
      
      // Sign out from Firebase
      await signOut();
      
      // Navigate to login page
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Error signing out:', error);
      // Even if signOut fails, clear storage and redirect
      localStorage.clear();
      navigate('/login', { replace: true });
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
    // Determine user ID: use Firebase UID or fallback to stored backend user_id
    const uid = currentUser?.uid || localStorage.getItem('user_id');
    if (!uid) {
      setMessages((prev) => [
        ...prev,
        { text: 'You must be logged in to chat.', isUser: false, timestamp: Date.now() },
      ]);
      return;
    }

    // Add user message to UI
    const userMessage = {
      text: messageText,
      isUser: true,
      timestamp: new Date().getTime(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const token = localStorage.getItem('access_token');
      // Read per-session thread ID from localStorage
      const threadId = parseInt(localStorage.getItem('thread_id') || '0', 10);
      console.log('Sending message:', messageText, 'User ID:', uid, 'Thread ID:', threadId);
      const payload = {
        user_id: uid,
        message: messageText,
        thread_id: threadId,
      };

      const res = await fetch(`${API_BASE_URL}/chat/`, {
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
        responseText = `I've received your weekly update file "${fileData.name}".\n`;
      } else if (uploadFolder === 'solution-docs') {
        responseText = `I've received your solution document "${fileData.name}".\n`;
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
          backgroundColor: '#000000ff',
          minHeight: '100vh',
          width: '100%',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          overflow: 'hidden',
        }}
      >
      {/* Header */}
      <Box
        sx={{
          padding: '12px 24px',
          width: '100%',
          borderBottom: '1px solid rgba(42, 110, 122, 0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              background: 'linear-gradient(135deg, rgba(0,0,0,0.6), rgba(0,0,0,0.4))',
              borderRadius: '8px',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 18px rgba(0,0,0,0.6)'
            }}
          >
            <img src="/rise.svg" alt="Logo" style={{ width: 44, height: 'auto' }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>THE RISE TECH</Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>Project Management Assistant</Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton 
            onClick={handleNewChat} 
            sx={{ 
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              }
            }}
            title="New Chat"
          >
            <AddIcon />
          </IconButton>

          <IconButton onClick={handleSettingsClick} sx={{ color: 'white' }}>
            <SettingsIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleSettingsClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            PaperProps={{
              sx: {
                backgroundColor: '#000000',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                mt: 1,
              }
            }}
          >
            <MenuItem 
              onClick={handleLogout}
              sx={{
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Box>

      {/* Chat Container */}
      <Container 
        maxWidth={false}
        disableGutters
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          width: '100%',
          height: 'calc(100vh - 64px)',
          padding: '12px 16px',
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
              <CircularProgress size={28} sx={{ color: '#ffffff' }} />
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
                  color: '#ffffff',
                  borderColor: 'rgba(255,255,255,0.08)',
                  '&:hover': {
                    borderColor: 'rgba(255,255,255,0.16)',
                    backgroundColor: 'rgba(24, 175, 221, 0.02)',
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
                color: '#ffffff',
                borderColor: 'rgba(255,255,255,0.08)',
                '&:hover': {
                  borderColor: 'rgba(255,255,255,0.16)',
                  backgroundColor: 'rgba(255,255,255,0.02)',
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




