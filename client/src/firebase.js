// Import the initializeApp function from the 'firebase/app' module
// This function is used to initialize the Firebase app
import { initializeApp } from 'firebase/app';

// web app's Firebase configuration
const firebaseConfig = {
  // The API key for the Firebase project
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  // The authentication domain for the Firebase project
  authDomain: 'mern-blog-d16dd.firebaseapp.com',
  // The project ID for the Firebase project
  projectId: 'mern-blog-d16dd',
  // The storage bucket for the Firebase project
  storageBucket: 'mern-blog-d16dd.appspot.com',
  // The messaging sender ID for the Firebase project
  messagingSenderId: '149332250394',
  // The app ID for the Firebase project
  appId: '1:149332250394:web:09fb254726a5653f44a6a3'
};

// Initialize the Firebase app using the configuration
export const app = initializeApp(firebaseConfig);