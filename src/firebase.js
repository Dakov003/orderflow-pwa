import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { firebaseConfig, APP_ID, INITIAL_AUTH_TOKEN, isFirebaseConfigValid } from './config/firebase.js';

// Initialize Firebase
let app = null;
let db = null;
let auth = null;

export const initializeFirebase = () => {
  if (!isFirebaseConfigValid()) {
    console.error('Firebase config is missing or invalid');
    return { app: null, db: null, auth: null };
  }

  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    return { app, db, auth };
  } catch (error) {
    console.error('Firebase initialization error:', error);
    return { app: null, db: null, auth: null };
  }
};

export const ensureAuth = async () => {
  if (!auth) {
    console.error('Auth not initialized');
    return null;
  }

  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        unsubscribe();
        resolve(user);
      } else {
        try {
          if (INITIAL_AUTH_TOKEN) {
            await signInWithCustomToken(auth, INITIAL_AUTH_TOKEN);
          } else {
            await signInAnonymously(auth);
          }
        } catch (error) {
          console.error('Auth sign-in error:', error);
          unsubscribe();
          resolve(null);
        }
      }
    });
  });
};

export { db, auth, APP_ID };
