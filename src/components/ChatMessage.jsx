import React from 'react';
import { Box, Typography, Avatar, Link, Paper } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
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
        marginBottom: '20px',
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
            width: 40, 
            height: 40, 
            marginRight: '12px',
            backgroundColor: '#374151',
            color: '#F3F4F6',
            fontSize: '14px',
            fontWeight: 'bold',
            border: '2px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          AI
        </Avatar>
      )}
      <Box
        sx={{
          backgroundColor: isAI ? 'rgba(255, 255, 255, 0.08)' : '#2D3748',
          borderRadius: '16px',
          padding: '16px 20px',
          maxWidth: '75%',
          boxShadow: isAI ? '0px 4px 12px rgba(0, 0, 0, 0.15)' : '0px 2px 8px rgba(0, 0, 0, 0.1)',
          marginLeft: isAI ? '0' : 'auto',
          marginRight: isAI ? 'auto' : '0',
          border: isAI ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
        }}
      >
        {isAI ? (
          <Box
            sx={{
              color: 'white',
              wordBreak: 'break-word',
              lineHeight: 1.6,
              '& p': { 
                margin: 0, 
                whiteSpace: 'pre-wrap',
                marginBottom: '8px',
                '&:last-child': { marginBottom: 0 }
              },
              '& code': {
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                color: '#E2E8F0',
                padding: '3px 8px',
                borderRadius: '6px',
                fontFamily: 'monospace',
                fontSize: '0.9em',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              },
              '& pre': {
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                padding: '12px',
                borderRadius: '8px',
                overflow: 'auto',
                marginTop: '8px',
                '& code': {
                  backgroundColor: 'transparent',
                  border: 'none',
                  padding: 0,
                },
              },
              '& ul, & ol': {
                marginLeft: '20px',
                marginTop: '8px',
              },
              '& li': {
                marginBottom: '4px',
              },
              '& h1, & h2, & h3, & h4, & h5, & h6': {
                marginTop: '12px',
                marginBottom: '8px',
                color: '#F7FAFC',
              },
              '& blockquote': {
                borderLeft: '3px solid rgba(255, 255, 255, 0.3)',
                paddingLeft: '12px',
                marginLeft: '8px',
                fontStyle: 'italic',
                color: 'rgba(255, 255, 255, 0.8)',
              },
            }}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.text}</ReactMarkdown>
          </Box>
        ) : (
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
        )}

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