import React, { useState, useEffect, useRef } from 'react';
import { Box, Container, Typography, Paper, Button, Grid, Menu, MenuItem, IconButton } from '@mui/material';
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
  const messagesEndRef = useRef(null);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Handle settings menu
  const handleSettingsClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSettingsClose = () => {
    setAnchorEl(null);
  };

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
    const welcomeMessage = {
      text: "Hello! I'm your AI project management assistant. I can help you track progress, analyze weekly updates, and manage your projects. How can I assist you today?",
      timestamp: new Date().getTime(),
    };
    setMessages([welcomeMessage]);
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (messageText) => {
    // Add user message
    const userMessage = {
      text: messageText,
      timestamp: new Date().getTime(),
      isUser: true,
    };
    setMessages((prev) => [...prev, userMessage]);

    // Simulate AI response (in a real app, you would call an API)
    setTimeout(() => {
      const aiResponse = {
        text: `I'm analyzing your request: "${messageText}".\n\nI'll help you with this task. What additional details can you provide?`,
        timestamp: new Date().getTime(),
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  const handleWeeklyUpdate = () => {
    setUploadModalTitle('Upload Weekly Update');
    setUploadFolder('weekly-updates');
    setUploadModalOpen(true);
  };

  const handleSolutionDoc = () => {
    setUploadModalTitle('Upload Solution Document');
    setUploadFolder('solution-docs');
    setUploadModalOpen(true);
  };

  const handleUploadSuccess = (fileData) => {
    // Create message with file info
    const fileMessage = {
      text: `Uploaded file: ${fileData.name}\nType: ${fileData.type}\nSize: ${(fileData.size / 1024).toFixed(2)} KB`,
      timestamp: new Date().getTime(),
      isUser: true,
      fileData: fileData,
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
      
      const aiResponse = {
        text: responseText,
        timestamp: new Date().getTime(),
      };
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
        overflow: 'hidden', // Prevent outer scrolling
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
          height: 'calc(100vh - 64px)', // Subtract header height
          padding: '16px',
          overflow: 'hidden', // Prevent container scrolling
        }}
      >
        {/* Messages Area */}
        <Paper
          elevation={0}
          sx={{
            flex: 1,
            width: '100%',
            backgroundColor: 'transparent',
            overflow: 'auto', // Make messages area scrollable
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            marginBottom: '16px',
            height: 'calc(100% - 120px)', // Reserve space for buttons and input
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