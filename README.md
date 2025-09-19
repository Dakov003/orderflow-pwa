# 🚀 OrderFlow PWA - Gestiune Comenzi

O aplicație PWA (Progressive Web App) modernă pentru gestiunea comenzilor, clienților și produselor, dezvoltată cu React, TypeScript și Vite.

## ✨ Funcționalități

- 📱 **PWA Completă** - Instalabilă pe desktop și mobile
- 🔄 **Funcționare Offline** - Folosește localStorage pentru date locale
- 📊 **Dashboard** - Statistici și rapoarte în timp real
- 👥 **Gestiune Clienți** - CRUD complet pentru clienți
- 📦 **Gestiune Produse** - Catalog de produse cu prețuri
- 💰 **Sistem Plăți** - Urmărire plăți și datorii
- 📈 **Rapoarte** - Export CSV și rapoarte detaliate
- 🔒 **Siguranță** - Datele rămân pe dispozitivul tău

## 🛠️ Tehnologii

- **Frontend:** React 18 + TypeScript
- **Build Tool:** Vite
- **UI:** Tailwind CSS
- **PWA:** Vite PWA Plugin + Workbox
- **State Management:** React Hooks
- **Icons:** Lucide React

## 🚀 Instalare Locală

### Cerințe
- Node.js 18+
- npm sau yarn

### Pași de instalare

1. **Clonează repository-ul:**
   ```bash
   git clone https://github.com/TU_USERNAME/orderflow-pwa.git
   cd orderflow-pwa
   ```

2. **Instalează dependențele:**
   ```bash
   npm install
   ```

3. **Pornește aplicația:**
   ```bash
   npm run dev
   ```

4. **Deschide în browser:**
   - Development: `http://localhost:5173`
   - Preview: `http://localhost:4173` (după `npm run build`)

## 📱 Instalare PWA

### Pe Desktop (Windows/Mac/Linux):
1. Deschide aplicația în Chrome/Edge/Firefox
2. Caută iconița de instalare în bara de adresă
3. Apasă "Instalează" și confirmă
4. Aplicația va apărea în meniul Start/Applications

### Pe Android:
1. Deschide aplicația în Chrome
2. Așteaptă notificarea "Instalează aplicația"
3. Apasă "Instalează" și confirmă
4. Aplicația va apărea în lista de aplicații

### Pe iOS:
1. Deschide aplicația în Safari
2. Apasă pe butonul de partajare (□↗)
3. Selectează "Adaugă la ecranul principal"

## 🌐 Deployment

Aplicația este configurată pentru deployment pe GitHub Pages:

1. **Fork** acest repository
2. **Activează GitHub Pages** în Settings → Pages
3. **Alege "GitHub Actions"** ca sursă
4. **Push** modificările - deployment-ul se face automat

URL-ul aplicației va fi: `https://TU_USERNAME.github.io/orderflow-pwa/`

## 📊 Scripturi Disponibile

```bash
# Development
npm run dev          # Pornește server de development

# Build
npm run build        # Construiește pentru producție
npm run preview      # Preview build-ul de producție

# Linting
npm run lint         # Verifică codul cu ESLint
```

## 🔧 Configurare

### Variabile de Mediu (Opțional)

Creează un fișier `.env` pentru configurare Firebase:

```env
VITE_FIREBASE_CONFIG={"apiKey":"...","authDomain":"...","projectId":"...","storageBucket":"...","messagingSenderId":"...","appId":"..."}
VITE_APP_ID=orderflow-pwa
```

**Notă:** Aplicația funcționează perfect fără Firebase, folosind localStorage.

## 📁 Structura Proiectului

```
src/
├── components/          # Componente React
│   ├── InstallPrompt.jsx
│   └── OfflineIndicator.jsx
├── hooks/              # Custom hooks
│   └── usePWAInstall.js
├── App.jsx             # Componenta principală
├── main.jsx            # Entry point
└── index.css           # Stiluri globale

public/
├── icons/              # Iconițe PWA
├── manifest.webmanifest # Manifest PWA
└── index.html          # Template HTML

.github/workflows/      # GitHub Actions
└── deploy.yml          # Workflow deployment
```

## 🧪 Testare

Aplicația include teste comprehensive:

- **Teste PWA:** Instalare, offline, service worker
- **Teste UI:** Componente, responsive design
- **Teste Firebase:** CRUD operations, sincronizare
- **Teste Performance:** Load time, memory usage

## 📱 Compatibilitate

### Browsere Suportate:
- ✅ Chrome 80+
- ✅ Edge 80+
- ✅ Firefox 58+
- ✅ Safari 11.1+

### Dispozitive:
- ✅ Windows 10/11
- ✅ macOS 10.14+
- ✅ Android 5.0+
- ✅ iOS 11.1+

## 🤝 Contribuții

1. Fork repository-ul
2. Creează o branch pentru feature (`git checkout -b feature/AmazingFeature`)
3. Commit modificările (`git commit -m 'Add some AmazingFeature'`)
4. Push la branch (`git push origin feature/AmazingFeature`)
5. Deschide un Pull Request

## 📄 Licență

Acest proiect este licențiat sub MIT License - vezi fișierul [LICENSE](LICENSE) pentru detalii.

## 🆘 Suport

Pentru probleme sau întrebări:

1. Verifică [Issues](https://github.com/TU_USERNAME/orderflow-pwa/issues)
2. Creează un nou issue cu detalii despre problema
3. Include informații despre browser și sistemul de operare

## 🎯 Roadmap

- [ ] Notificări push
- [ ] Sincronizare în cloud
- [ ] Multi-user support
- [ ] Export PDF
- [ ] Integrare plăți online
- [ ] Mobile app (React Native)

---

**Dezvoltat cu ❤️ pentru business-uri mici și mijlocii**