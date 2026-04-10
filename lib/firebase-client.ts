// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBZnTaBg6Ou9u3b3wHkSxqcdKI8P_rMlTc",
  authDomain: "amdproject-78f48.firebaseapp.com",
  projectId: "amdproject-78f48",
  storageBucket: "amdproject-78f48.firebasestorage.app",
  messagingSenderId: "694524114107",
  appId: "1:694524114107:web:68b6a86f97d539294b259e",
  measurementId: "G-91EMJVYMYW"
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Analytics conditionally (only in browser)
export const initAnalytics = async () => {
  if (typeof window !== "undefined" && (await isSupported())) {
    return getAnalytics(app);
  }
  return null;
};

export { app };
