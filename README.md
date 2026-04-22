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

## 🎨 Sistema di design — NAVY DARK MODE

Dark mode premium con sfondo navy profondo e accento rosso corporate:

- **Navy profondissimo** `#0A1628` — sfondo principale (richiama il blu del logo)
- **Navy medio** `#0F1D33` — sezioni alternate
- **Navy elevato** `#15253F` — card, hover states
- **Off-white caldo** `#F5F1E8` — testo principale
- **Rosso corporate** `#A01729` — unico accent
- **Rosso brillante** `#C41E3A` — stati hover/attivi
- **Rosso profondo** `#6B0F1C` — shadow, gradient depths
- **Font**: Switzer (Graphik-like, stile Accenture)
- **Logo reale**: PNG originale integrato in navbar + footer (boost brightness per contrasto ottimale su navy)
- **Mondo rosso**: favicon e decorativo nell'hero
- **Grain overlay**: texture sottilissima per profondità editoriale
- **Responsive**: desktop, tablet, mobile
- **Accessibilità**: markup semantico, focus states

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
