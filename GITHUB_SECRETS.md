# GitHub Secrets Configuration

Pentru a configura deploy-ul automat, trebuie să adaugi următoarele secrete în repository-ul GitHub:

## Configurare Secrete

1. Mergi la repository-ul tău pe GitHub
2. Click pe **Settings** → **Secrets and variables** → **Actions**
3. Click pe **New repository secret** pentru fiecare secret de mai jos

## Secrete Necesare

### Firebase Configuration
- **Nume**: `FIREBASE_API_KEY`
  **Valoare**: `AIzaSyBM4X0As-EWrtT_vB4x2QzTj5cGNbQjAFQ`

- **Nume**: `FIREBASE_AUTH_DOMAIN`
  **Valoare**: `order-flow-28c1b.firebaseapp.com`

- **Nume**: `FIREBASE_PROJECT_ID`
  **Valoare**: `order-flow-28c1b`

- **Nume**: `FIREBASE_STORAGE_BUCKET`
  **Valoare**: `order-flow-28c1b.firebasestorage.app`

- **Nume**: `FIREBASE_MESSAGING_SENDER_ID`
  **Valoare**: `1010218778659`

- **Nume**: `FIREBASE_APP_ID`
  **Valoare**: `1:1010218778659:web:e325c41bae8c2c284df196`

- **Nume**: `FIREBASE_MEASUREMENT_ID`
  **Valoare**: `G-NCGV5RTL86`

### App Configuration
- **Nume**: `APP_ID`
  **Valoare**: `order-flow-28c1b`

- **Nume**: `INITIAL_AUTH_TOKEN`
  **Valoare**: (lasă gol pentru autentificare anonimă)

## Configurare GitHub Pages

1. Mergi la **Settings** → **Pages**
2. La **Source**, selectează **GitHub Actions**
3. Workflow-ul se va declanșa automat la push pe branch-ul `main`

## Verificare Deploy

După ce ai configurat secretele:

1. Fă push pe branch-ul `main`
2. Mergi la **Actions** tab în repository
3. Verifică că workflow-ul "Deploy to GitHub Pages" rulează cu succes
4. Aplicația va fi disponibilă la URL-ul GitHub Pages

## Troubleshooting

### Eroare "Firebase config missing"
- Verifică că toate secretele Firebase sunt setate corect
- Verifică că numele secretelor sunt exacte (case-sensitive)

### Eroare "Build failed"
- Verifică log-urile din Actions tab
- Verifică că toate dependențele sunt instalate corect

### PWA nu se instalează
- Verifică că aplicația rulează pe HTTPS în producție
- Verifică că manifest.webmanifest este valid
