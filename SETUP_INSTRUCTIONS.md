# Instrucțiuni de Configurare - OrderFlow PWA

## ✅ Corecții Implementate

Toate problemele au fost corectate:

1. **Configurația Firebase** - Acum folosește `VITE_FIREBASE_CONFIG` (JSON pe o singură linie)
2. **Autentificarea** - Inițializată în `main.jsx` pentru a evita "User ID: N/A"
3. **Layout-ul** - Sidebar-ul nu mai se suprapune cu conținutul
4. **CSS-ul** - Actualizat pentru Tailwind CSS v4
5. **GitHub Actions** - Actualizate să folosească `FIREBASE_CONFIG`

## 🚀 Pentru Development Local

### 1. Creează fișierul `.env.local` în rădăcina proiectului:

```bash
VITE_FIREBASE_CONFIG={"apiKey":"your-api-key","authDomain":"your-project.firebaseapp.com","projectId":"your-project","storageBucket":"your-project.appspot.com","messagingSenderId":"123456789","appId":"1:123456789:web:abcdef123456","measurementId":"G-XXXXXXXXXX"}
VITE_APP_ID=order-flow-28c1b
VITE_INITIAL_AUTH_TOKEN=
```

**Important:** JSON-ul trebuie să fie pe o singură linie, fără ghilimele în jurul întregii valori.

### 2. Restart aplicația:

```bash
npm run dev
```

### 3. Verifică în consolă (F12):
- Nu mai apare warning-ul "VITE_FIREBASE_CONFIG lipsește"
- "User ID" afișează un UID (anonim) - semn că Auth funcționează
- Nu mai apare "Mod Demo" dacă Firebase e configurat corect

## 🌐 Pentru Producție (GitHub Pages)

### 1. Configurează Secrets în GitHub:
Repo → Settings → Secrets and variables → Actions:

- `FIREBASE_CONFIG` = același JSON pe o singură linie
- `APP_ID` = `order-flow-28c1b`
- `INITIAL_AUTH_TOKEN` = (opțional)

### 2. Push modificările:
```bash
git add .
git commit -m "feat: implement Firebase config and layout fixes"
git push
```

### 3. Verifică Actions:
- Actions → Deploy to GitHub Pages → ar trebui să fie verde
- Site-ul nu mai cade în "demo mode"

## 🎨 Layout Corectat

- **Sidebar**: Nu mai se suprapune cu conținutul
- **Header**: Nu mai e dublat
- **Responsive**: Funcționează corect pe mobile și desktop
- **Spacing**: Icon + text au spațiu corect (`gap-3`)

## ✅ Check-list Final

- [ ] În dev: nu mai vezi "Mod Demo" după setarea `.env.local` și restart
- [ ] "User ID" afișează un UID (anonim) - semn că Auth e ok
- [ ] Pe Pages: Actions e verde și site-ul citește secretul JSON
- [ ] UI: sidebar nu mai stă peste conținut; titlul e o singură linie clară
- [ ] Build-ul funcționează fără erori (`npm run build`)
- [ ] Linting-ul e curat (`npm run lint`)

## 🔧 Comenzi Utile

```bash
# Development
npm run dev

# Build pentru producție
npm run build

# Linting
npm run lint

# Preview build-ul local
npm run preview
```

## 📝 Note Tehnice

- **Tailwind CSS v4**: Folosește `@import "tailwindcss"` în loc de directivele clasice
- **Firebase Config**: Suportă atât JSON string cât și variabile individuale (backward compatibility)
- **Auth Bootstrap**: Se inițializează înainte de render pentru a evita "User ID: N/A"
- **Layout**: Folosește `flex` cu `shrink-0` pentru sidebar și `flex-1` pentru conținut
