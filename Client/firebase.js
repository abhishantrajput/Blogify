

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blogify-project-61026.firebaseapp.com",
  projectId: "mern-blogify-project-61026",
  storageBucket: "mern-blogify-project-61026.appspot.com",
  messagingSenderId: "1063121402787",
  appId: "1:1063121402787:web:31f5cae89b485156e7f816",
  measurementId: "G-0BR6ZXEVJX"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
