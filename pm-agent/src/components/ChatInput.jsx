import React, { useState } from 'react';
import { Box, TextField, IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const ChatInput = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e) => {
    // Send on Enter, but allow Shift+Enter for new line
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSubmit(e);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        alignItems: 'center',
        padding: '10px 12px',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '30px',
        width: '100%',
        margin: '0',
      }}
    >
      <TextField
        fullWidth
        multiline
        maxRows={3}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message... (Press Enter to send)"
        variant="standard"
        InputProps={{
          disableUnderline: true,
        }}
        sx={{
          '& .MuiInputBase-root': {
            color: 'white',
            padding: '8px 16px',
            fontSize: '15px',
          },
        }}
      />
      <IconButton
        type="submit"
        color="primary"
        sx={{
          backgroundColor: '#2196f3',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          minWidth: '40px',  // Ensure consistent width
          '&:hover': {
            backgroundColor: '#1976d2',
          },
        }}
      >
        <SendIcon sx={{ color: 'white' }} />
      </IconButton>
    </Box>
  );
};

export default ChatInput; 