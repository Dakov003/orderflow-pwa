# OrderFlow PWA

O aplicație PWA (Progressive Web App) pentru gestionarea comenzilor, construită cu React, Vite, Firebase și Tailwind CSS.

## 🚀 Caracteristici

- **PWA completă** - Instalabilă pe dispozitive mobile și desktop
- **Offline-first** - Funcționează fără conexiune la internet
- **Firebase Backend** - Autentificare și Firestore pentru date
- **Responsive Design** - Optimizată pentru toate dispozitivele
- **Tailwind CSS** - Design modern și consistent

## 📋 Cerințe

- Node.js 20+
- npm sau yarn
- Cont Firebase
- Cont GitHub (pentru deploy)

## 🛠️ Instalare și Configurare

### 1. Clonează repository-ul

```bash
git clone https://github.com/Dakov003/orderflow-pwa.git
cd orderflow-pwa
```

### 2. Instalează dependențele

```bash
npm install
```

### 3. Configurează Firebase

Urmărește instrucțiunile din [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) pentru a configura Firebase.

### 4. Configurează variabilele de mediu

Creează fișierul `.env.local` în root-ul proiectului:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
VITE_APP_ID=order-flow-28c1b
VITE_INITIAL_AUTH_TOKEN=
```

### 5. Rulează aplicația local

```bash
npm run dev
```

Aplicația va fi disponibilă la `http://localhost:5173`

## 🏗️ Build și Deploy

### Build pentru producție

```bash
npm run build
```

### Deploy pe GitHub Pages

1. Configurează secretele în GitHub (Settings → Secrets and variables → Actions):
   - `FIREBASE_API_KEY`
   - `FIREBASE_AUTH_DOMAIN`
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_STORAGE_BUCKET`
   - `FIREBASE_MESSAGING_SENDER_ID`
   - `FIREBASE_APP_ID`
   - `FIREBASE_MEASUREMENT_ID`
   - `APP_ID` (setează la `order-flow-28c1b`)
   - `INITIAL_AUTH_TOKEN` (opțional)

2. Activează GitHub Pages în repository settings (Source: GitHub Actions)

3. Push pe branch-ul `main` va declanșa deploy-ul automat

### Deploy pe Firebase Hosting (opțional)

1. Instalează Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Configurează secretul `FIREBASE_SERVICE_ACCOUNT` în GitHub
4. Deploy-ul se va face automat la push pe `main`

## 📱 PWA Features

- **Manifest** - Aplicația poate fi instalată pe dispozitive
- **Service Worker** - Cache offline și sincronizare
- **Icons** - Iconițe pentru toate dimensiunile
- **Offline Support** - Funcționează fără internet

## 🗂️ Structura Proiectului

```
src/
├── config/
│   └── firebase.js          # Configurația Firebase
├── components/              # Componente React (de adăugat)
├── App.jsx                  # Componenta principală
├── main.jsx                 # Entry point
└── index.css                # Stiluri Tailwind

public/
├── pwa-192x192.png         # Iconiță PWA 192x192
├── pwa-512x512.png         # Iconiță PWA 512x512
├── pwa-512x512-maskable.png # Iconiță maskable
└── robots.txt              # Robots.txt

.github/workflows/
├── pages.yml               # Workflow GitHub Pages
└── firebase-hosting.yml    # Workflow Firebase Hosting

firebase.json               # Configurația Firebase
firestore.rules            # Regulile Firestore
```

## 🔧 Scripturi Disponibile

- `npm run dev` - Rulează în modul development
- `npm run build` - Build pentru producție
- `npm run preview` - Preview build-ul local
- `npm run lint` - Rulează ESLint

## 🐛 Debugging

### Probleme comune

1. **Firebase config missing** - Verifică că toate variabilele de mediu sunt setate
2. **PWA nu se instalează** - Verifică că aplicația rulează pe HTTPS în producție
3. **Service Worker nu se înregistrează** - Verifică console-ul browser-ului

### Logs

- **Development**: Verifică console-ul browser-ului
- **Production**: Verifică Network tab pentru request-uri Firebase

## 📄 Licență

MIT License

## 🤝 Contribuții

Contribuțiile sunt binevenite! Te rog să deschizi un issue sau pull request.

## 📞 Suport

Pentru probleme sau întrebări, deschide un issue pe GitHub.