# Eurisko S.r.l. — Sito ufficiale

Sito statico multi-sezione per **Eurisko S.r.l.**, società di consulenza SAP italiana con sede a Cascinette d'Ivrea (TO). Bilingue italiano/inglese, GDPR-compliant, WCAG 2.1 AA, zero framework, zero build step.

## 📁 Struttura del progetto

```
eurisko/
├── index.html                    → Homepage IT
├── azienda.html                  → Chi siamo IT
├── consulenza.html               → Consulenza SAP IT
├── soluzioni.html                → Soluzioni ERP IT
├── migrazione-s4hana.html        → Landing dedicata S/4HANA IT
├── portfolio.html                → Clienti e case study IT
├── lavora-con-noi.html           → Careers IT
├── contatti.html                 → Form + info contatti IT
├── privacy.html                  → Privacy Policy IT (GDPR)
├── cookie-policy.html            → Cookie Policy IT
├── note-legali.html              → Note Legali IT
├── accessibilita.html            → Dichiarazione di accessibilità IT
├── grazie.html                   → Thank-you page post submit IT
├── en/
│   ├── index.html                → Homepage EN
│   ├── company.html              → About EN
│   ├── sap-consulting.html       → SAP Consulting EN
│   ├── solutions.html            → Solutions EN
│   ├── s4hana-migration.html     → SAP S/4HANA Migration EN
│   ├── portfolio.html            → Clients & case studies EN
│   ├── careers.html              → Careers EN
│   ├── contact.html              → Contact form EN
│   ├── privacy.html              → Privacy Policy EN
│   ├── cookie-policy.html        → Cookie Policy EN
│   ├── legal-notice.html         → Legal Notice EN
│   ├── accessibility.html        → Accessibility Statement EN
│   └── thank-you.html            → Thank-you EN
├── styles.css                    → Sorgente design system
├── styles.min.css                → Versione minificata (referenziata dagli HTML)
├── script.js                     → Sorgente JS (interazioni + cookie banner + form)
├── script.min.js                 → Versione minificata (referenziata dagli HTML)
├── _minify.py                    → Script di build per generare le versioni .min
├── sitemap.xml                   → Sitemap completa (24 URL con hreflang)
├── robots.txt                    → Direttive crawler
├── og-image.svg                  → Open Graph 1200×630 (vettoriale)
├── og-image.html                 → Generator HTML per og-image.png (opzionale)
├── logo-eurisko-WR.png              → Logo bianco su scuro
├── logo-eurisko-color.png        → Logo colorato (sfondi chiari)
├── logo-eurisko-mondo.png        → Solo globo rosso
├── favicon-64.png                → Favicon
├── ACCESSIBILITY-REPORT.md       → Report autovalutazione WCAG 2.1
└── README.md
```

## 🌐 Internazionalizzazione (IT / EN)

- **Approccio SEO-first**: pagine duplicate in `/en/`, no dipendenza da JS.
- Ogni pagina ha `<link rel="alternate" hreflang="it|en|x-default">` reciproci.
- Language switcher minimale `IT | EN` nella navbar (lingua corrente in grassetto, l'altra è link).
- Traduzione professionale (non automatica) di titoli, body, meta description, OG, Twitter, alt, aria-label.
- Cookie banner e validazione form: testi auto-detect via `document.documentElement.lang`.

## 🎨 Sistema di design — NAVY DARK MODE

- **Navy profondissimo** `#0A1628` — sfondo principale
- **Navy medio** `#0F1D33` — sezioni alternate
- **Navy elevato** `#15253F` — card, hover
- **Off-white caldo** `#F5F1E8` — testo principale
- **Rosso corporate** `#A01729` — accento (background bottoni, hover)
- **Rosso AA-text** `#FF3A5C` — variante per testi rossi (contrasto 5.5:1 su navy)
- **Rosso brillante** `#C41E3A` — hover stati attivi
- **Font**: Switzer via Fontshare (subset 200–900 + 401)
- **Loghi**: PNG originali in navbar + footer (boost brightness per contrasto su navy)
- **Texture**: grain SVG soft-light overlay per profondità editoriale

Le grandezze h1/h2 sono state ridotte del 25% rispetto alla baseline iniziale (es. `.display`: clamp(39px, 6.75vw, 111px)).

## 🔒 GDPR & Privacy

- **Cookie banner vanilla JS** GDPR-compliant: 3 pulsanti (Accetta tutti / Rifiuta tutti / Personalizza), pannello toggle per categorie (Tecnici sempre attivi / Analitici / Marketing). Cookie `eurisko_consent` 12 mesi.
- Conforme alle linee guida del **Garante italiano** (no antipattern del solo "Accetta").
- **Privacy Policy** completa ai sensi del **Regolamento UE 2016/679 (GDPR)**: titolare, finalità, base giuridica, periodo di conservazione, diritti dell'interessato, trasferimenti extra-UE.
- **Cookie Policy** con elenco cookie tecnici/terze parti.
- **Note Legali** con dati societari, copyright, condizioni d'uso, foro competente.
- **Form contatti** con checkbox privacy obbligatoria + redirect custom a `grazie.html` / `thank-you.html` post invio.

## ♿ Accessibilità — WCAG 2.1 AA

Implementazione mirata a livello AA con target AAA dove fattibile. Vedi [`ACCESSIBILITY-REPORT.md`](ACCESSIBILITY-REPORT.md) per la tabella contrasti e l'esito dei 4 test (tastiera, zoom 200%, contrasto, lettura DOM).

Caratteristiche chiave:

- Skip link "Vai al contenuto principale" come primo elemento focalizzabile.
- Focus visibile (2px solid rosso brillante, offset 3px) su tutti gli elementi interattivi.
- Gerarchia heading rigorosa (un solo H1 per pagina, sottolivelli senza salti).
- Landmark HTML5: `<header>`, `<nav>`, `<main id="main-content">`, `<footer>`, `<article>`.
- Form etichettati con `<label for>`, errori via `aria-invalid` + `aria-describedby`.
- Cookie banner accessibile: `role="dialog"`, focus trap, chiusura con `Esc`.
- Lingua dichiarata: `<html lang>` + `<span lang="en">` su porzioni in lingua diversa.
- Acronimi SAP avvolti in `<abbr title="…">` alla prima occorrenza per pagina (ERP, MES, CRM, ICT, KPI, GDPR, ECC).
- `prefers-reduced-motion` rispettato (animazioni decorative attenuate).
- Font-size in `rem` per supportare zoom utente.

> ⚠️ **Scelta deliberata**: NON utilizziamo widget di accessibilità tipo overlay (AccessiWay, UserWay, EqualWeb). [Numerosi esperti hanno dimostrato](https://overlayfactsheet.com/) che questi strumenti spesso non rendono effettivamente accessibili i siti. L'accessibilità si ottiene **nel codice sorgente**.

## 🚀 SEO

- Meta `<title>`, `description`, `keywords`, `author`, `robots` su ogni pagina.
- Open Graph e Twitter Card con `og-image.svg` 1200×630.
- `<link rel="canonical">` + hreflang IT/EN/x-default.
- JSON-LD `Organization` (homepage IT/EN), `BreadcrumbList` (pagine interne), `Service` (S/4HANA), `ContactPage` (contatti).
- `sitemap.xml` con 24 URL e hreflang.
- `robots.txt` permissivo, esclude solo `/grazie.html` e `/en/thank-you.html`.
- Preconnect a Fontshare per ottimizzare load fonts.

Le keyword sono mappate secondo i 6 cluster definiti nel brief interno (consultare il file `KEYWORD-STRATEGY-EURISKO.md` se disponibile localmente — non è committato nel repo).

## ⚡ Performance

- `loading="lazy"` su tutte le img below-the-fold (loghi footer, ecc.).
- `width` e `height` espliciti per evitare CLS.
- `<link rel="preload" as="image">` per il logo nav (LCP candidate).
- CSS minificato: `styles.min.css` (-24%) generato da `styles.css` via `python _minify.py`.
- JS minificato: `script.min.js` (-7.5%, conservativo per evitare problemi ASI).
- Nessuna dipendenza esterna oltre ai font Fontshare.

## 🛠️ Workflow di build (manuale, una volta dopo modifiche)

```bash
python _minify.py
# Output:
# styles.css   43970 -> styles.min.css   33350 bytes (24.2% saved)
# script.js    16734 -> script.min.js    15485 bytes (7.5% saved)
```

Gli HTML referenziano già i `.min`. Modifiche ai sorgenti `.css/.js` richiedono di rigenerare i `.min` e committare entrambi.

## 🚀 Deploy (workflow GitHub + Vercel + Formspree)

### 1. Push su GitHub

Il repo è già configurato:

```bash
git remote -v
# origin  https://github.com/retroemulator/eurisko.git
```

Push:

```bash
git push origin main
```

### 2. Collega Vercel

- Vai su [vercel.com](https://vercel.com)
- "New Project" → importa il repo `retroemulator/eurisko`
- Framework Preset: **Other** (sito statico puro)
- Deploy → online in 30 secondi

### 3. Attiva Formspree per il form contatti

1. Vai su [formspree.io](https://formspree.io), accedi (o crea l'account gratuito)
2. **New Form** → nome "Eurisko Contatti"
3. Copia l'ID (es. `xabcd1234`)
4. Sostituisci `YOUR_FORM_ID` in `contatti.html` E `en/contact.html`:

```bash
sed -i 's|formspree.io/f/YOUR_FORM_ID|formspree.io/f/xabcd1234|g' contatti.html en/contact.html
```

5. Push → Vercel deploya automaticamente.

## 📝 Cosa personalizzare prima del go-live

- [ ] **`contatti.html` e `en/contact.html`**: sostituire `YOUR_FORM_ID` con ID Formspree reale.
- [ ] **`note-legali.html` e `en/legal-notice.html`**: inserire valori reali per **Numero REA**, **Capitale sociale**, **PEC** (attualmente placeholder `[Da compilare]`).
- [ ] **`accessibilita.html` e `en/accessibility.html`**: inserire nome del **responsabile dell'accessibilità** interno.
- [ ] **`og-image.svg`** è pronto. In alternativa generare `og-image.png` aprendo `og-image.html` in browser e facendo screenshot 1200×630.
- [ ] **Loghi WebP**: per ottimizzare ulteriormente, generare versioni WebP via `cwebp -q 85 logo-eurisko-WR.png -o logo-eurisko.webp` e wrappare nei `<picture>`.
- [ ] **Verifica numeri statistiche** in homepage: 20 anni / 50+ clienti Top Tier / 1500+ progetti (da confermare con management).

## 🌍 Domini

Il sito usa `https://euriskosrl.it` come dominio di default in tutti i meta tag, canonical e sitemap. Per cambiare:

```bash
# Tutti i .html, sitemap.xml, robots.txt
grep -rl 'https://euriskosrl.it' --include='*.html' --include='*.xml' --include='*.txt' . | xargs sed -i 's|https://euriskosrl.it|https://NUOVO-DOMINIO|g'
```

## 🛠️ Dipendenze

- **Nessuna dipendenza NPM**.
- **Nessun framework CSS/JS** (no Bootstrap/Tailwind/Bulma/jQuery/React/Vue/Alpine).
- **Font** caricati via Fontshare CDN.
- **Build step opzionale**: `python _minify.py` per rigenerare `.min.css` e `.min.js`.
- Il sito **funziona aprendo `index.html` direttamente da filesystem** (cookie banner non appare ma il resto è completamente funzionale).
- Il sito **funziona con JavaScript disabilitato** (graceful degradation): tutti i link, contenuti, form HTML5 sono operativi.

## 📦 Serie storica delle modifiche

Vedi `git log` per la storia completa. Riepilogo dei commit principali:

- `chore` — setup repo, .gitignore
- `feat(design)` — riduzione titoli -25%, focus WCAG, rem, prefers-reduced-motion
- `feat(content)` — aggiornamento stat ufficiali (20 anni / 50+ / 1500+)
- `feat(i18n+seo+a11y)` — completamento 7 pagine IT con tutto
- `feat(legal)` — pagine legali IT (privacy/cookie/note legali/accessibilità/grazie)
- `feat(i18n+s4hana)` — versione EN completa + landing S/4HANA
- `feat(cookie)` — cookie consent banner GDPR
- `feat(seo)` — sitemap, robots.txt, og-image
- `perf` — minify CSS/JS, lazy loading

## 📞 Contatti

**Eurisko S.r.l.**  
Via Burolo, 1 — 10010 Cascinette d'Ivrea (TO)  
P. IVA: IT08407400012  
[info@euriskosrl.it](mailto:info@euriskosrl.it) · [+39 348 156 5772](tel:+393481565772) · [LinkedIn](https://www.linkedin.com/company/euriskosrl)

---

© Eurisko S.r.l. — P. IVA 08407400012
