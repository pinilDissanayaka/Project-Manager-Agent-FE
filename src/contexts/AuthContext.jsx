import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../config/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const saveUserToFirestore = async (user) => {
    if (!user) return;

    try {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || '',
          photoURL: user.photoURL || '',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      } else {
        await setDoc(userRef, {
          updatedAt: serverTimestamp(),
        }, { merge: true });
      }
    } catch (error) {
      console.error('Error saving user to Firestore:', error);
      setError(error.message);
    }
  };

  useEffect(() => {
    // Check for existing session before Firebase auth state
    const checkExistingSession = () => {
      const token = localStorage.getItem('access_token');
      const expiry = localStorage.getItem('session_expiry');
      const userId = localStorage.getItem('user_id');
      
      if (token && expiry && userId) {
        const now = Date.now();
        if (now < parseInt(expiry)) {
          // Session is still valid, create a minimal user object
          setCurrentUser({
            uid: userId,
            email: userId.includes('@') ? userId : null,
            displayName: '',
          });
          setLoading(false);
          return true;
        } else {
          // Session expired, clear localStorage
          localStorage.removeItem('access_token');
          localStorage.removeItem('user_id');
          localStorage.removeItem('thread_id');
          localStorage.removeItem('session_expiry');
        }
      }
      return false;
    };

    // First check for existing session
    const hasValidSession = checkExistingSession();
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          // Get the ID token to ensure authentication is valid
          await user.getIdToken(true);
          setCurrentUser(user);
          await saveUserToFirestore(user);
        } else if (!hasValidSession) {
          // Only set to null if we don't have a valid session
          setCurrentUser(null);
        }
      } catch (error) {
        console.error('Auth state change error:', error);
        setError(error.message);
        setCurrentUser(null);
      } finally {
        if (!hasValidSession) {
          setLoading(false);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    loading,
    error,
    setCurrentUser, // <-- Add this so Login.jsx can update user after login
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};



export default AuthContext;