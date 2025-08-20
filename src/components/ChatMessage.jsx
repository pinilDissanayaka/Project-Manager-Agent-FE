import React from 'react';
import { Box, Typography, Avatar, Link, Paper } from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import ImageIcon from '@mui/icons-material/Image';

const ChatMessage = ({ message, isAI = false }) => {
  // Determine which icon to use based on file type
  const getFileIcon = (type) => {
    if (type.startsWith('image/')) {
      return <ImageIcon />;
    } else if (type === 'application/pdf') {
      return <PictureAsPdfIcon />;
    } else {
      return <InsertDriveFileIcon />;
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        marginBottom: '16px',
        alignItems: 'flex-start',
        width: '100%',
        justifyContent: isAI ? 'flex-start' : 'flex-end',
      }}
    >
      {isAI && (
        <Avatar
          src="/ai-avatar.png" 
          alt="AI"
          sx={{ 
            width: 36, 
            height: 36, 
            marginRight: '10px',
            backgroundColor: '#1976d2' 
          }}
        >
          AI
        </Avatar>
      )}
      <Box
        sx={{
          backgroundColor: isAI ? 'rgba(255, 255, 255, 0.08)' : '#1976d2',
          borderRadius: '12px',
          padding: '12px 16px',
          maxWidth: '70%',
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
          marginLeft: isAI ? '0' : 'auto',
          marginRight: isAI ? 'auto' : '0',
        }}
      >
        <Typography
          variant="body1"
          sx={{
            color: 'white',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        >
          {message.text}
        </Typography>

        {/* File attachment if present */}
        {message.fileData && (
          <Paper
            elevation={0}
            sx={{
              mt: 1,
              p: 1,
              borderRadius: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {getFileIcon(message.fileData.type)}
            <Link
              href={message.fileData.url}
              target="_blank"
              rel="noopener"
              sx={{
                color: 'white',
                ml: 1,
                textDecoration: 'underline',
                wordBreak: 'break-all',
                '&:hover': {
                  color: 'rgba(255, 255, 255, 0.8)',
                },
              }}
            >
              {message.fileData.name}
            </Link>
          </Paper>
        )}

        {message.timestamp && (
          <Typography
            variant="caption"
            sx={{
              color: 'rgba(255, 255, 255, 0.6)',
              display: 'block',
              textAlign: 'right',
              marginTop: '4px',
            }}
          >
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default ChatMessage; 