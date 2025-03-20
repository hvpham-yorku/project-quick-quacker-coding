// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBujdwsjRa1XTsuhgGtMUCX-c0wTNz7FCI",
  authDomain: "quick-quacker.firebaseapp.com",
  projectId: "quick-quacker",
  storageBucket: "quick-quacker.firebasestorage.app",
  messagingSenderId: "317713086750",
  appId: "1:317713086750:web:3fd0a06bea23973cac310f",
  measurementId: "G-CC93V25X8M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);