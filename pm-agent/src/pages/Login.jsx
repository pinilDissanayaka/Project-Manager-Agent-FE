import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, TextField, Button, Paper, Divider, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { currentUser ,setCurrentUser} = useAuth();
  const navigate = useNavigate();

  // Redirect to /chat if already logged in
  useEffect(() => {
    console.log('Current User:', currentUser);
    if (currentUser) {
      navigate('/chat', { replace: true });
    }
  }, [currentUser, navigate]);

  // Google Login Success
  const handleGoogleLoginSuccess = async (response) => {
    try {
      setError('');
      setLoading(true);

      // Send the Google OAuth token to the backend for validation
      const res = await axios.post('http://localhost:8000/auth/google', {
        credential: response.credential,
      });

      // Store the returned JWT token
      localStorage.setItem('access_token', res.data.access_token);
      setCurrentUser(res.data.user);
      console.log('Login successful:', res.data.user);
      console.log('User data:', currentUser);

      // Redirect to the chat page
      navigate('/chat', { replace: true });
    } catch (error) {
      setError('Failed to sign in with Google: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Google Login Failure
  const handleGoogleLoginFailure = (error) => {
    setError('Google Login Failed: ' + error.message);
  };

  // Email & password login (optional)
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      // Handle email login logic here
      navigate('/chat');
    } catch (error) {
      setError('Failed to sign in: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: '#0A1929',
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            width: '100%',
            maxWidth: '450px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '10px',
            color: 'white',
          }}
        >
          <Box
            sx={{
              backgroundColor: '#1976d2',
              borderRadius: '8px',
              padding: '12px',
              mb: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '50px',
              height: '50px',
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'white' }}>
              PM
            </Typography>
          </Box>

          <Typography variant="h4" component="h1" gutterBottom>
            Project Manager
          </Typography>

          <Typography variant="body1" sx={{ mb: 3, color: 'rgba(255, 255, 255, 0.7)' }}>
            Sign in to access your projects
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Optional: Email/password form */}
          <Box component="form" onSubmit={handleEmailLogin} sx={{ width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{
                '& .MuiInputBase-input': { color: 'white' },
                '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                  '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                  '&.Mui-focused fieldset': { borderColor: '#1976d2' },
                },
              }}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{
                '& .MuiInputBase-input': { color: 'white' },
                '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                  '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                  '&.Mui-focused fieldset': { borderColor: '#1976d2' },
                },
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              Sign In
            </Button>
          </Box>

          <Divider sx={{ width: '100%', my: 2, color: 'rgba(255, 255, 255, 0.5)' }}>OR</Divider>

          {/* Google Login Button */}
          <GoogleLogin
            onSuccess={handleGoogleLoginSuccess}
            onError={handleGoogleLoginFailure}
            useOneTap
            theme="filled_blue"
            shape="pill"
            width="auto"
            size="large"
          >
            Sign In with Google
          </GoogleLogin>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;

