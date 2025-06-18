import React, { useState, useRef } from 'react';
import { 
  Modal, 
  Box, 
  Typography, 
  Button, 
  CircularProgress, 
  IconButton, 
  Paper 
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';
import { uploadFile } from '../utils/firebaseUtils';

const FileUploadModal = ({ open, onClose, title, folder, onUploadSuccess }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  
  // Handle drag events
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };
  
  // Handle file selection
  const handleFileSelect = (file) => {
    setSelectedFile(file);
  };
  
  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelect(e.target.files[0]);
    }
  };
  
  // Handle file upload
  const handleUpload = async () => {
    if (!selectedFile) return;
    
    try {
      setLoading(true);
      const userId = 'user123'; // Replace with actual user ID from auth context
      const timestamp = new Date().getTime();
      const filePath = `${folder}/${userId}_${timestamp}_${selectedFile.name}`;
      
      const downloadURL = await uploadFile(selectedFile, filePath);
      
      if (onUploadSuccess) {
        onUploadSuccess({
          name: selectedFile.name,
          url: downloadURL,
          type: selectedFile.type,
          size: selectedFile.size,
          path: filePath,
          uploadedAt: new Date().toISOString()
        });
      }
      
      onClose();
    } catch (error) {
      console.error('Error uploading file:', error);
      // Show error message to user
    } finally {
      setLoading(false);
    }
  };
  
  // Open file dialog
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <Modal 
      open={open} 
      onClose={loading ? null : onClose}
      aria-labelledby="upload-modal-title"
    >
      <Paper 
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: 500 },
          bgcolor: '#132f4c',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          outline: 'none',
          color: 'white',
        }}
      >
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography id="upload-modal-title" variant="h6" component="h2">
            {title || 'Upload File'}
          </Typography>
          {!loading && (
            <IconButton onClick={onClose} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          )}
        </Box>
        
        {/* Drag & Drop Area */}
        <Box 
          className={`dropzone ${isDragging ? 'active' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={triggerFileInput}
          sx={{ 
            mb: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 150,
          }}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInputChange}
            style={{ display: 'none' }}
          />
          
          {loading ? (
            <CircularProgress sx={{ mb: 2 }} />
          ) : (
            <CloudUploadIcon sx={{ fontSize: 48, color: '#1976d2', mb: 2 }} />
          )}
          
          <Typography variant="body1" mb={1}>
            {selectedFile ? selectedFile.name : 'Drag & drop file here or click to browse'}
          </Typography>
          
          {selectedFile && (
            <Typography variant="caption" color="text.secondary">
              {(selectedFile.size / 1024).toFixed(2)} KB
            </Typography>
          )}
        </Box>
        
        {/* Action Buttons */}
        <Box display="flex" justifyContent="flex-end" gap={2}>
          <Button 
            onClick={onClose} 
            disabled={loading}
            sx={{ color: 'white' }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleUpload} 
            disabled={!selectedFile || loading}
            startIcon={loading && <CircularProgress size={20} />}
          >
            {loading ? 'Uploading...' : 'Upload'}
          </Button>
        </Box>
      </Paper>
    </Modal>
  );
};

export default FileUploadModal; 