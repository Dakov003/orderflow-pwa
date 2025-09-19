import { firebaseConfig } from './firebase-config.js';

export function injectEnvToWindow() {
  try {
    // Use the Firebase config from the imported file
    if (typeof window !== "undefined") {
      window.__firebase_config = JSON.stringify(firebaseConfig);
      window.__app_id = 'order-flow-28c1b'; // Use the project ID as app ID
      // Keep the initial auth token from environment if available
      if (import.meta.env.VITE_INITIAL_AUTH_TOKEN) {
        window.__initial_auth_token = import.meta.env.VITE_INITIAL_AUTH_TOKEN;
      }
    }
  } catch (e) {
    console.error("ENV bridge error:", e);
  }
}
