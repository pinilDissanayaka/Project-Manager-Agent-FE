import React, { useState, useRef } from 'react';
import { Button, CircularProgress } from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { uploadFile } from '../utils/firebaseUtils';

const UploadButton = ({ onUploadSuccess, folder = 'documents' }) => {
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      const userId = 'user123'; // Replace with actual user ID from auth
      const timestamp = new Date().getTime();
      const filePath = `${folder}/${userId}_${timestamp}_${file.name}`;
      
      const downloadURL = await uploadFile(file, filePath);
      
      if (onUploadSuccess) {
        onUploadSuccess({
          name: file.name,
          url: downloadURL,
          type: file.type,
          size: file.size,
          path: filePath,
          uploadedAt: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      // Here you might want to add error handling logic
    } finally {
      setLoading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleUpload}
        style={{ display: 'none' }}
      />
      <Button
        variant="contained"
        component="span"
        onClick={triggerFileInput}
        disabled={loading}
        startIcon={loading ? <CircularProgress size={20} /> : <AttachFileIcon />}
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          color: 'white',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
          }
        }}
      >
        {loading ? 'Uploading...' : 'Upload File'}
      </Button>
    </>
  );
};

export default UploadButton; 