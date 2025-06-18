import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBQsw5wJJb88jrnXFR6wQ7EFFar7Mm6FCM",
  authDomain: "riseagenticpm-adb60.firebaseapp.com",
  projectId: "riseagenticpm-adb60",
  storageBucket: "riseagenticpm-adb60.appspot.com",
  messagingSenderId: "426563797009",
  appId: "1:426563797009:web:f23095d654013b18bf71b0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Enable offline persistence
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
  } else if (err.code === 'unimplemented') {
    console.warn('The current browser does not support persistence.');
  }
});

export default app; 