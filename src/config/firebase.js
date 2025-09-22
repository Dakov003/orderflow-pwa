// Firebase configuration from environment variables
export const firebaseConfig = (() => {
  const configString = import.meta.env.VITE_FIREBASE_CONFIG;
  if (configString) {
    try {
      return JSON.parse(configString);
    } catch (error) {
      console.error('Invalid VITE_FIREBASE_CONFIG JSON:', error);
      return null;
    }
  }
  
  // Fallback to individual env vars for backward compatibility
  return {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  };
})();

export const APP_ID = import.meta.env.VITE_APP_ID || "order-flow-28c1b";
export const INITIAL_AUTH_TOKEN = import.meta.env.VITE_INITIAL_AUTH_TOKEN || "";

// Validate Firebase config
export const isFirebaseConfigValid = () => {
  return firebaseConfig && 
         firebaseConfig.apiKey && 
         firebaseConfig.authDomain && 
         firebaseConfig.projectId && 
         firebaseConfig.appId;
};
