import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const apiUrl = `${API_BASE_URL}/auth/google`;  // Your FastAPI backend URL

const handleLoginSuccess = (response) => {
  // Send the Google token to the FastAPI backend for verification
  axios
    .post(apiUrl, { credential: response.credential })
    .then((res) => {
      console.log('Login successful:', res.data);
      // Store the access token in localStorage for subsequent requests
      localStorage.setItem('access_token', res.data.access_token);
    })
    .catch((error) => {
      console.error('Login error:', error);
    });
};

const handleLoginFailure = (error) => {
  console.error('Google Login Failed:', error);
};

return (
  <div>
    <h1>Google Login in React with FastAPI Backend</h1>
    <GoogleLogin
      onSuccess={handleLoginSuccess}
      onError={handleLoginFailure}
    />
  </div>
);
