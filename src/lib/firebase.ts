// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  "projectId": "brandboost-landing",
  "appId": "1:438222875372:web:e38a8a694ebd70496893c9",
  "storageBucket": "brandboost-landing.firebasestorage.app",
  "apiKey": "AIzaSyDwolBRXF_G3eRonaj6-oqalmOl2bYcDIk",
  "authDomain": "brandboost-landing.firebaseapp.com",
  "messagingSenderId": "438222875372"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
