import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = () => {
  const { currentUser, loading } = useAuth();
  // Check session expiry (24h) and clear if expired
  if (!loading) {
    const expiry = Number(localStorage.getItem('session_expiry') || '0');
    if (Date.now() > expiry) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_id');
      localStorage.removeItem('thread_id');
      localStorage.removeItem('session_expiry');
      return <Navigate to="/login" replace />;
    }
  }

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundColor: '#0A1929'
        }}
      >
        <CircularProgress sx={{ color: '#1976d2' }} />
      </Box>
    );
  }

  return currentUser ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;