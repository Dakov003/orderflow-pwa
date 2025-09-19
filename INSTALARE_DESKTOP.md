# 🖥️ Instalare OrderFlow pe Desktop - Ghid Vizual

## 📋 Pași de Instalare

### 1. Pregătirea Mediului
```bash
# Deschide Command Prompt (cmd) ca Administrator
# Navighează la folderul proiectului
cd "D:\cursor backup\orderflow-pwa"

# Verifică că Node.js este instalat
node --version
npm --version
```

### 2. Instalarea Dependențelor
```bash
# Instalează toate dependențele necesare
npm install
```

### 3. Pornirea Aplicației
```bash
# Pornește aplicația în mod development
npm run dev
```

**Aplicația se va deschide automat la:** `http://localhost:5173`

### 4. Instalarea PWA

#### În Chrome/Edge:
1. **Caută iconița de instalare** în bara de adresă (dreapta sus)
   - Arată ca un icon de download cu o săgeată
   - Poate apărea după câteva secunde

2. **Apasă pe iconița de instalare**
   - Sau pe butonul "Instalează" care apare

3. **Confirmă instalarea**
   - Apasă "Instalează" în dialogul care apare

#### În Firefox:
1. **Apasă pe meniul hamburger** (3 linii orizontale) din dreapta sus
2. **Selectează "Instalează"** din meniu
3. **Confirmă instalarea** în dialogul care apare

### 5. Verificarea Instalării

După instalare, aplicația va apărea:
- **În meniul Start** (Windows) - caută "OrderFlow"
- **Pe desktop** - cu propriul icon
- **Ca aplicație separată** - se deschide fără browser

## 🔧 Depanare Rapidă

### Iconița de instalare nu apare?
1. **Reîncarcă pagina** (F5)
2. **Așteaptă câteva secunde** - iconița poate apărea cu întârziere
3. **Verifică că folosești Chrome/Edge** (nu Internet Explorer)
4. **Verifică că aplicația rulează pe localhost**

### Aplicația nu se instalează?
1. **Verifică că ai conexiune la internet** la prima vizită
2. **Șterge cache-ul browser-ului** (Ctrl+Shift+Delete)
3. **Restart aplicația** (`npm run dev`)

### Aplicația nu apare în meniul Start?
1. **Caută "OrderFlow"** în meniul Start
2. **Verifică că instalarea s-a completat** cu succes
3. **Reinstalează aplicația** dacă este necesar

## ✅ Verificare Finală

Aplicația este instalată corect dacă:
- ✅ Apare în meniul Start cu numele "OrderFlow"
- ✅ Se deschide ca aplicație separată (nu în browser)
- ✅ Funcționează offline după prima încărcare
- ✅ Are propriul icon și fereastră

## 🚀 Gata de Folosit!

Aplicația OrderFlow este acum instalată pe desktop și poate fi folosită:
- **Offline** - fără conexiune la internet
- **Ca aplicație nativă** - din meniul Start
- **Cu toate funcționalitățile** - gestiune comenzi, clienți, produse, rapoarte

**Succes! 🎉**
