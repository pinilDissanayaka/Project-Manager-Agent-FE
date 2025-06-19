// import React from 'react'
// import ReactDOM from 'react-dom/client'
// import App from './App'
// import './index.css'

// ReactDOM.createRoot(document.getElementById('root')!).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// ) 



// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import { GoogleOAuthProvider } from '@react-oauth/google';  // Import the provider
// import App from './App';

// const root = ReactDOM.createRoot(document.getElementById('root'));

// root.render(
//   <GoogleOAuthProvider clientId="your-google-client-id.apps.googleusercontent.com">
//     <App />
//   </GoogleOAuthProvider>
// );



import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { GoogleOAuthProvider } from '@react-oauth/google'; // Import GoogleOAuthProvider

const root = ReactDOM.createRoot(document.getElementById('root')!);
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

// Wrap your App with GoogleOAuthProvider and provide the Google Client ID
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={googleClientId}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);
