# Configurare Firebase pentru OrderFlow PWA

## Configurare Rapidă (Recomandat)

Aplicația OrderFlow funcționează **fără Firebase** folosind localStorage pentru stocare locală. Aceasta este configurația implicită și recomandată pentru început.

## Configurare Firebase (Opțional)

Dacă dorești să folosești Firebase pentru sincronizare în cloud, urmează acești pași:

### 1. Creează un proiect Firebase

1. Mergi la [Firebase Console](https://console.firebase.google.com/)
2. Apasă "Add project"
3. Introdu numele proiectului (ex: "orderflow-pwa")
4. Urmărește pașii de configurare

### 2. Activează Firestore Database

1. În Firebase Console, mergi la "Firestore Database"
2. Apasă "Create database"
3. Alege "Start in test mode" (pentru început)
4. Selectează o locație pentru baza de date

### 3. Obține configurația

1. Mergi la "Project Settings" (iconița de roată)
2. Scroll jos la "Your apps"
3. Apasă "Add app" și alege "Web" (iconița `</>`)
4. Introdu numele aplicației (ex: "OrderFlow PWA")
5. Copiază configurația Firebase

### 4. Configurează variabilele de mediu

Creează un fișier `.env` în directorul rădăcină:

```env
# Firebase Configuration
VITE_FIREBASE_CONFIG={"apiKey":"your-api-key","authDomain":"your-project.firebaseapp.com","projectId":"your-project","storageBucket":"your-project.appspot.com","messagingSenderId":"123456789","appId":"1:123456789:web:abcdef123456"}

# App ID pentru identificarea aplicației
VITE_APP_ID=orderflow-pwa

# Token de autentificare inițial (opțional)
# VITE_INITIAL_AUTH_TOKEN=your-custom-token-here
```

### 5. Regulile de securitate Firestore

În Firebase Console, mergi la "Firestore Database" > "Rules" și înlocuiește cu:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permite accesul la toate documentele pentru simplitate
    // În producție, configurează reguli mai stricte
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

### 6. Restart aplicația

```bash
npm run dev
```

## Funcționalități

### Cu Firebase
- ✅ Sincronizare în cloud
- ✅ Backup automat
- ✅ Acces multiplu utilizatori
- ✅ Funcționare offline cu sincronizare

### Fără Firebase (localStorage)
- ✅ Funcționare completă offline
- ✅ Stocare locală sigură
- ✅ Performanță optimă
- ✅ Fără configurare necesară

## Depanare

### Eroarea "Firebase config is missing"
- Aplicația va folosi automat localStorage
- Nu este o problemă, funcționează normal

### Probleme de conectivitate
- Aplicația funcționează offline
- Datele se sincronizează când se restabilește conexiunea

### Reset date
Pentru a reseta toate datele (localStorage):
```javascript
// Rulează în consolă browser
localStorage.clear();
location.reload();
```

## Suport

Pentru probleme tehnice, verifică:
1. Console-ul browser pentru erori
2. Configurația Firebase (dacă folosești)
3. Conexiunea la internet (pentru sincronizare)
