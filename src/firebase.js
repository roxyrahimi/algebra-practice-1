// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCqTgfz3TSsukOOaXRXBajqovujt0SSVL8",
  authDomain: "algebra-leaderboard.firebaseapp.com",
  projectId: "algebra-leaderboard",
  storageBucket: "algebra-leaderboard.firebasestorage.app",
  messagingSenderId: "1004004329851",
  appId: "1:1004004329851:web:7c2e3469d8caba2d7455de",
  measurementId: "G-8YF786H6JX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
