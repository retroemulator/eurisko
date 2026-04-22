# Eurisko S.r.l. — Sito ufficiale

Sito statico multi-sezione per Eurisko S.r.l., ispirato all'approccio editoriale di Accenture ma con identità visiva propria.

## 📁 Struttura del progetto

```
eurisko/
├── index.html           → Homepage
├── azienda.html         → Chi siamo, valori, team
├── consulenza.html      → Consulenza SAP (3 servizi dettagliati)
├── soluzioni.html       → Soluzioni ERP e approccio (5 fasi)
├── portfolio.html       → Clienti e case studies
├── lavora-con-noi.html  → Careers e posizioni aperte
├── contatti.html        → Form + info + mappa
├── styles.css           → Design system completo
└── script.js            → Interazioni (nav, reveal, marquee, mobile menu)
```

## 🎨 Sistema di design

Basato sui **colori sociali del logo Eurisko**:

- **Blu corporate** `#0A3D7D` — accent principale (dal "EURISK" del logo)
- **Rosso cremisi** `#C41E3A` — accent secondario (dal globo del logo)
- **Nero profondo** `#0D0D0D` — colore primario del testo
- **Off-white caldo** `#EFEDE5` — sfondo delle pagine
- **Font**: Bricolage Grotesque (display) + Fraunces (momenti editoriali italic)
- **Logo reale**: integrato nel footer (versione PNG originale)
- **Responsive**: desktop, tablet, mobile
- **Accessibilità**: markup semantico, `aria-label`, `aria-current`, focus states

## 🚀 Deploy (workflow GitHub + Vercel + Formspree)

### 1. Push su GitHub (tramite Claude Code)

Apri Claude Code nella cartella del progetto e scrivi:

```
inizializza git, aggiungi tutti i file e fai push su
https://github.com/TUO-USERNAME/eurisko-sito
```

### 2. Collega Vercel

- Vai su [vercel.com](https://vercel.com)
- "New Project" → importa il repo appena creato
- Framework Preset: **Other** (è un sito statico puro)
- Deploy → sarà online in 30 secondi

### 3. Attiva Formspree per il form contatti

1. Vai su [formspree.io](https://formspree.io), accedi (se non hai l'account lo crei gratis)
2. **New Form** → nome "Eurisko Contatti"
3. Copia l'ID (es. `xabcd1234`)
4. In Claude Code scrivi:

```
sostituisci YOUR_FORM_ID con xabcd1234 in contatti.html
```

5. Push delle modifiche → Vercel rilascia aggiornato in automatico

## 📝 Cosa personalizzare

Prima di andare in produzione ricorda di aggiornare:

- `contatti.html` → sostituire `YOUR_FORM_ID` con ID Formspree reale
- `contatti.html` → link LinkedIn (attualmente `#`)
- Footer di tutte le pagine → link a Privacy/Cookie/Note Legali (attualmente `#`)
- Statistiche nella homepage (18+ anni, 40+ clienti, ecc.) → verificare che i numeri siano quelli reali

## 🛠️ Modifiche future

Il sito è in **HTML/CSS/JS puro**, quindi:
- Per cambiare testi → edita direttamente gli `.html`
- Per cambiare colori/font → `styles.css` (variabili CSS in cima al file)
- Per aggiungere pagine → duplica un `.html` esistente, modifica `<title>` e contenuti, aggiorna la nav in tutti i file

## 📦 Dipendenze

- **Nessuna dipendenza NPM**. Font caricati via Google Fonts.
- **Nessun build step**. File pronti al deploy.

---

© Eurisko S.r.l. — P. IVA 08407400012
