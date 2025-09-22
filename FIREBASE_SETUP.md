# Firebase Setup pentru OrderFlow PWA

## 1. Creare Proiect în Google Firebase

1. Accesează [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" sau "Add project"
3. Numele proiectului: `order-flow-28c1b`
4. Activează Google Analytics (opțional)
5. Alege regiunea (preferabil Europa pentru GDPR)

## 2. Configurare Authentication

1. În Firebase Console → Authentication
2. Click "Get started"
3. Tab "Sign-in method"
4. Activează "Anonymous" (implicit)
5. Click "Save"

## 3. Configurare Cloud Firestore

1. În Firebase Console → Firestore Database
2. Click "Create database"
3. Alege "Start in production mode"
4. Alege regiunea (preferabil `europe-west1`)

## 4. Deploy Firestore Rules

1. Instalează Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Inițializează proiectul: `firebase init firestore`
4. Deploy rules: `firebase deploy --only firestore:rules`

## 5. Configurare Environment Variables

Creează fișierul `.env.local` în root-ul proiectului:

```env
VITE_FIREBASE_API_KEY=AIzaSyBM4X0As-EWrtT_vB4x2QzTj5cGNbQjAFQ
VITE_FIREBASE_AUTH_DOMAIN=order-flow-28c1b.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=order-flow-28c1b
VITE_FIREBASE_STORAGE_BUCKET=order-flow-28c1b.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=1010218778659
VITE_FIREBASE_APP_ID=1:1010218778659:web:e325c41bae8c2c284df196
VITE_FIREBASE_MEASUREMENT_ID=G-NCGV5RTL86
VITE_APP_ID=order-flow-28c1b
VITE_INITIAL_AUTH_TOKEN=
```

## 6. Testare Local

```bash
npm run dev
```

Verifică în browser console că nu apar erori Firebase.

## 7. Structura Colecțiilor Firestore

Aplicația va crea automat următoarele colecții:

- `/artifacts/order-flow-28c1b/public/data/customers`
- `/artifacts/order-flow-28c1b/public/data/products`
- `/artifacts/order-flow-28c1b/public/data/orders`
- `/artifacts/order-flow-28c1b/public/data/payments`
- `/artifacts/order-flow-28c1b/public/data/dayClosings`

## 8. Securitate

- Toate datele sunt protejate prin Firestore Rules
- Doar utilizatorii autentificați pot accesa datele
- Regulile sunt restrictive și permit doar accesul la path-ul specificat
