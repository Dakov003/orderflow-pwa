// Firebase configuration for OrderFlow PWA
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyBM4X0As-EWrtT_vB4x2QzTj5cGNbQjAFQ",
  authDomain: "order-flow-28c1b.firebaseapp.com",
  projectId: "order-flow-28c1b",
  storageBucket: "order-flow-28c1b.firebasestorage.app",
  messagingSenderId: "1010218778659",
  appId: "1:1010218778659:web:e325c41bae8c2c284df196",
  measurementId: "G-NCGV5RTL86"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Initialize Analytics only in browser environment
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

// Export the app instance for other uses
export default app;
