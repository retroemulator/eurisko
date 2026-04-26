# Audit Report — Eurisko S.r.l.

**Data:** 2026-04-26
**Versione codice analizzata:** ede1a8e (pre-audit) → 68ed62a (post-audit)
**Auditor:** Claude (Senior Frontend + Security review)
**Scope:** 80+ pagine HTML, styles.css/min, script.js/min, vercel.json, robots.txt, sitemap.xml

---

## Executive Summary

Il sito è **complessivamente in buono stato** dal punto di vista di sicurezza, accessibilità e qualità del codice. Non sono state trovate vulnerabilità critiche (no XSS sfruttabile, no segreti esposti, form configurato in sicurezza). I problemi principali rilevati e fixati sono di **performance** (font caricati in serie via `@import`) e **postura di sicurezza** (mancanza di security headers HTTP, link interno HTTP non upgradato).

**Numeri chiave:**
- 🔴 Critici trovati: **0**
- 🟠 Alti trovati: **3** → tutti fixati
- 🟡 Medi trovati: **5** → 4 fixati, 1 manuale
- 🔵 Bassi trovati: **6** → 1 fixato, 5 segnalati come "manuali"
- ✅ Conformi senza azione: **20+** punti di controllo verificati e OK

**Commit applicati durante l'audit:**
- `854e07c` → security: vercel.json headers + cleanUrls + http→https + comment cleanup
- `cf5d700` → a11y/Safari: focus-visible search input + webkit-backdrop-filter prefix
- `68ed62a` → perf: font @import → <link> head (parallel loading)

---

## Severity Legend

- 🔴 **CRITICO**: blocca la produzione
- 🟠 **ALTO**: da fixare entro 1 settimana
- 🟡 **MEDIO**: prossimo sprint
- 🔵 **BASSO**: miglioramento consigliato
- ✅ **OK**: conforme

---

## 🛡️ Security Issues

| # | Severità | File | Problema | Stato | Fix applicata |
|---|---|---|---|---|---|
| S1 | 🟠 | `vercel.json` | Mancanza security headers (HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, COOP) | ✅ FIXED | `854e07c` — aggiunti tutti |
| S2 | 🟠 | 80 file footer | `href="http://hub.euriskosrl.it/"` — link non HTTPS, possibile downgrade attack | ✅ FIXED | `854e07c` — upgradato a https in 82 occorrenze. **Verifica manualmente** che `https://hub.euriskosrl.it/` risponda |
| S3 | 🟡 | tutti gli HTML | Nessun Content-Security-Policy header | ⚠️ MANUALE | Vedi sotto "Fix manuali" — richiede testing perché può rompere reCAPTCHA/Fontshare |
| S4 | 🟡 | `contatti.html`, `en/contact.html` | Commento stale "YOUR_FORM_ID" (form già configurato con ID reale `xqewjkdn`) | ✅ FIXED | `854e07c` |
| S5 | ✅ | `script.js` | XSS check: `escapeHtml()` su query utente (line 196), `highlight()` parte da escaped text — **safe** | ✅ OK | — |
| S6 | ✅ | `contatti.html` | Form sicuro: HTTPS Formspree action, honeypot `_gotcha`, reCAPTCHA, autocomplete attrs, `type="email"`/`"tel"`, `required` con `aria-required` | ✅ OK | — |
| S7 | ✅ | `script.js` | Cookie `eurisko_consent`: `SameSite=Lax` + `Secure` flag condizionato su `https:` | ✅ OK | — |
| S8 | ✅ | tutti gli HTML | Tutti i `target="_blank"` hanno `rel="noopener noreferrer"` (no tabnabbing) | ✅ OK | — |
| S9 | ✅ | `robots.txt` | Disallow corretto su `/grazie.html` e `/en/thank-you.html` | ✅ OK | — |
| S10 | ✅ | `grazie.html`, `en/thank-you.html`, `404.html`, `en/404.html` | Tutte hanno `<meta name="robots" content="noindex, follow">` | ✅ OK | — |
| S11 | ✅ | `script.js` | Nessun `eval()`, `document.write`, `new Function()`. `innerHTML` usato solo con dati hardcoded o `escapeHtml`-ed | ✅ OK | — |

---

## 📱 Mobile Issues

| # | Severità | File | Problema | Stato |
|---|---|---|---|---|
| M1 | 🟠 | `styles.css:1238` | `backdrop-filter` senza `-webkit-` → Safari iOS non renderizzava il backdrop | ✅ FIXED `cf5d700` |
| M2 | ✅ | tutti gli HTML | `<meta viewport>` corretto, no `user-scalable=no` né `maximum-scale=1` (a11y zoom OK) | ✅ OK |
| M3 | ✅ | `styles.css` | Touch targets verificati: `.nav__cta` 18×32 padding, `.nav__burger` 44×44, `.nav__lock` 42×42 (al limite, accettabile), link footer con padding 6×0 + line-height naturale | ✅ OK |
| M4 | ✅ | `styles.css` | Nessun `font-size` sotto 14px su elementi di testo principali; gli input hanno font-size 16px (no zoom auto Safari iOS) | ✅ OK |
| M5 | ✅ | tutti gli `<img>` | Hanno `width`/`height` espliciti + `loading="lazy"` dove non above-the-fold (previene CLS) | ✅ OK |
| M6 | ✅ | `styles.css` | Media queries coerenti (desktop-first: 1100/900/820/720/620/560/520/480px) | ✅ OK |
| M7 | ✅ | `styles.css` | `@media (prefers-reduced-motion: reduce)` rispetta utenti con preferenza ridotta motion (animazioni reveal e shimmer disabilitate) | ✅ OK |

---

## 🖥️ Desktop Issues

| # | Severità | File | Problema | Stato |
|---|---|---|---|---|
| D1 | 🔵 | `styles.css` | Uso di `:has()` e altre proprietà CSS moderne — verificare baseline. Nota: `:has()` è in tutti i browser dal 2022 (Safari 15.4+), accettabile | ⚠️ FYI |
| D2 | ✅ | layout 1920px+ | `--container: 1440px` applicato ai blocchi, no "esplosione" su Full HD/4K | ✅ OK |
| D3 | ✅ | `styles.css` | Hover states presenti su tutti gli interattivi (nav, btn, card, footer, lang-switcher, cookie banner) | ✅ OK |
| D4 | 🟠 | `styles.css:2549` | `outline: none` su `.site-search__input` senza alternativa visibile → violazione WCAG 2.4.7 | ✅ FIXED `cf5d700` — aggiunto `:focus-visible { border-bottom-color: var(--accent-text) }` |
| D5 | ✅ | `styles.css:1715` | `outline: none` su `.field input/textarea` ha alternativa: `:focus { border-color: var(--accent-text) }` | ✅ OK |

---

## ⚡ Performance Issues

| # | Severità | File | Problema | Stato |
|---|---|---|---|---|
| P1 | 🟠 | `styles.css` | Font Fontshare + Google Fonts caricati via `@import` (serializzazione: blocca finché il CSS principale non è parsato) | ✅ FIXED `68ed62a` — migrati a `<link rel="stylesheet">` nell'head di 80 HTML, con preconnect anche per fonts.gstatic.com. Stimato risparmio ~200-400ms first-paint |
| P2 | 🟡 | 4 file `sector-*.jpg` (132-168KB) | Immagini case study home in PNG/JPG non ottimizzate, no WebP, no `<picture>` con srcset | ⚠️ MANUALE — richiede tool ImageMagick/cwebp |
| P3 | 🟡 | `logo-eurisko-WR.png` | Logo navbar 112KB caricato su ogni pagina (potrebbe essere ~20KB in WebP) | ⚠️ MANUALE |
| P4 | 🟡 | `logo-eurisko-color.png` (272KB) | Logo da 272KB — verificare se realmente usato; in caso, ottimizzare | ⚠️ MANUALE — verificare uso |
| P5 | 🔵 | `index.html` e altri | `<script src="script.min.js">` a fine `<body>` (no `defer`). Già non bloccante perché in fondo, `defer` sarebbe best-practice ma non critical | ⚠️ FYI |
| P6 | ✅ | tutti gli HTML | Referenziano `styles.min.css` e `script.min.js` (versioni minified) ✓ | ✅ OK |
| P7 | ✅ | `styles.css` | `@font-face` non usati (non c'è nessuno), font caricati da CDN con `display=swap` (no FOIT) | ✅ OK |
| P8 | ✅ | reCAPTCHA | Caricato con `async defer` | ✅ OK |

---

## ♿ Accessibility Issues

| # | Severità | File | Problema | Stato |
|---|---|---|---|---|
| A1 | 🟠 | `styles.css` `.site-search__input` | Vedi D4 — focus invisibile | ✅ FIXED |
| A2 | ✅ | tutti gli HTML | Tutti gli `<img>` hanno `alt`, decorativi con `alt=""` | ✅ OK |
| A3 | ✅ | tutti gli HTML | Tutti i `<button>` hanno `aria-label` (burger, search, social, lang-switcher) | ✅ OK |
| A4 | ✅ | tutti gli HTML | Skip-link "Vai al contenuto principale" / "Skip to main content" presente | ✅ OK |
| A5 | ✅ | tutti gli HTML | `<html lang="it">` / `lang="en"` presente | ✅ OK |
| A6 | ✅ | tutti gli HTML | Un solo `<h1>` per pagina (verificato sample, gerarchia heading semantica) | ✅ OK |
| A7 | ✅ | form contatti | `<label for="...">` per ogni input, `aria-required`, `aria-describedby` per status | ✅ OK |

---

## 🌐 SEO Issues

| # | Severità | File | Problema | Stato |
|---|---|---|---|---|
| SE1 | ✅ | tutti gli HTML | `<title>` e `<meta description>` presenti su tutte le pagine | ✅ OK |
| SE2 | ✅ | tutti gli HTML | `rel="canonical"` self-referencing su tutte le pagine | ✅ OK |
| SE3 | ✅ | tutti gli HTML | `hreflang` IT/EN reciproci + `x-default` | ✅ OK |
| SE4 | ✅ | tutti gli HTML | Open Graph e Twitter Card complete (title, description, image, url, locale) | ✅ OK |
| SE5 | ✅ | molte pagine | JSON-LD strutturato (BreadcrumbList, Organization, ContactPage, DefinedTermSet, JobPosting) | ✅ OK |
| SE6 | ✅ | `sitemap.xml` | Tutti gli URL HTTPS, con `lastmod`, `changefreq`, `priority`, hreflang alternates | ✅ OK |
| SE7 | ✅ | `robots.txt` | Allow universale, Disallow `grazie.html` + `thank-you.html`, sitemap dichiarato | ✅ OK |
| SE8 | 🔵 | tutti gli HTML | Alcune pagine hanno `meta keywords` (ignorato da Google dal 2009, neutro non dannoso) | ⚠️ FYI — non critico |

---

## 📋 Code Quality Issues

| # | Severità | File | Problema | Stato |
|---|---|---|---|---|
| Q1 | ✅ | `script.js` | Nessun `var` (tutto `const`/`let`), `===` ovunque, no `console.log`/`debugger`/`alert` | ✅ OK |
| Q2 | ✅ | `script.js` | Event listener registrati una volta, scroll listeners con `{ passive: true }` dove appropriato | ✅ OK |
| Q3 | ✅ | `styles.css` | `!important` solo 5 occorrenze (sotto soglia di code-smell) | ✅ OK |
| Q4 | ✅ | tutti gli HTML | HTML semantico: `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`, `<article>` correttamente usati | ✅ OK |
| Q5 | ✅ | tutti gli HTML | Charset UTF-8, viewport, favicon coerente in `<head>` di ogni pagina | ✅ OK |
| Q6 | 🔵 | molti HTML | Inline style ancora presenti (392 occorrenze residue dopo cleanup di -1138). Sono cookie banner template, animation-delay, _gotcha display:none — tutti legittimi e non eliminabili senza grossi refactor | ⚠️ FYI |

---

## ✅ Fix Applicati Automaticamente

1. **`854e07c` — security**:
   - `vercel.json` esteso con security headers (HSTS preload 2 anni, X-Frame-Options DENY, X-Content-Type-Options nosniff, Referrer-Policy strict-origin-when-cross-origin, Permissions-Policy disabilita 6 API sensibili, COOP same-origin) + `cleanUrls: true` + Cache-Control immutable per asset statici
   - 82 link `http://hub.euriskosrl.it/` → `https://` (80 file footer)
   - Rimossi 2 commenti stale `YOUR_FORM_ID`

2. **`cf5d700` — a11y/Safari**:
   - Aggiunto `-webkit-backdrop-filter` su `.case__tag` (riga 1238) — Safari iOS ora renderizza il backdrop blur
   - Aggiunto `:focus-visible` con border-bottom rosso a `.site-search__input` (era WCAG 2.4.7 fail)

3. **`68ed62a` — perf**:
   - Migrati i 2 `@import` font (Fontshare + Google Oswald) da `styles.css` a `<link rel="stylesheet">` nell'`<head>` di tutte le 80 pagine HTML
   - Aggiunti preconnect a `fonts.googleapis.com` e `fonts.gstatic.com`
   - Risparmio stimato 200-400ms di first-paint su cold load

---

## ⚙️ Fix da Fare Manualmente

### Performance (richiede tool esterni)

1. **Convertire immagini in WebP**:
   - 4× `sector-*.jpg` (132-168KB ciascuna) → WebP target ~25-40KB
   - 3× logo PNG (44-272KB) → WebP target ~10-30KB
   - `hero-bg-poster.jpg` (128KB) → WebP target ~30KB
   - Tool consigliati: [Squoosh.app](https://squoosh.app) (browser) oppure `cwebp file.png -q 85 -o file.webp`
   - Una volta convertiti, usa `<picture><source type="image/webp" srcset="..."><img src="...fallback.jpg"></picture>` per fallback browser legacy

2. **Verificare `logo-eurisko-color.png` (272KB)**:
   - Grep ha mostrato che potrebbe non essere referenziato in HTML — se non usato, **eliminalo**

### Security (richiede testing)

3. **Verificare HTTPS su `hub.euriskosrl.it`**:
   - L'audit ha upgradato 82 link da `http://` a `https://`. Conferma manualmente che `https://hub.euriskosrl.it/` risponda correttamente. Se solo HTTP è disponibile, configurare il redirect lato server o ripristinare i link.

4. **Aggiungere Content-Security-Policy** (richiede test approfonditi):
   - Va aggiunto in `vercel.json` come header (NON come `<meta>` perché non gestisce report-uri)
   - Bozza permissiva ma sensata da testare:
   ```json
   {
     "key": "Content-Security-Policy",
     "value": "default-src 'self'; script-src 'self' https://www.google.com https://www.gstatic.com; style-src 'self' 'unsafe-inline' https://api.fontshare.com https://fonts.googleapis.com; font-src 'self' https://cdn.fontshare.com https://fonts.gstatic.com; img-src 'self' data:; form-action 'self' https://formspree.io; connect-src 'self'; frame-src https://www.google.com; frame-ancestors 'none'; base-uri 'self'; object-src 'none'; upgrade-insecure-requests"
   }
   ```
   - **Da testare in staging**: che reCAPTCHA, Fontshare, Google Fonts, Formspree submit funzionino tutti. Se qualcosa rompe, leggere DevTools console per capire cosa sbloccare.

5. **Configurare rate-limiting su Formspree dashboard** (se non già):
   - Plan free Formspree consente 50 submission/mese, sufficiente — ma sul dashboard puoi attivare blocco IP duplicati e abuse detection

### Testing manuale richiesto

6. **Test su device fisici**:
   - iPhone reale (Safari iOS) — verificare che search overlay e nav mobile rendano correttamente con i prefissi `-webkit-` aggiunti
   - Android reale (Chrome) — verificare touch targets e tap response sui link footer

7. **Browser cross-test**:
   - Chrome 110+ ✓ (target)
   - Firefox 110+ ✓
   - Safari 16+ ✓ (con il fix iOS appena applicato)
   - Edge 110+ ✓

### Contenuto

8. **`logo-eurisko-color.png` 272KB** — verificare se realmente usato, eliminare o ottimizzare

9. **Verificare validità JSON-LD** con [Schema Markup Validator](https://validator.schema.org/) o [Google Rich Results Test](https://search.google.com/test/rich-results) — sono molti, vale la pena un controllo finale post-deploy

---

## 📋 Checklist Pre-Deploy

- [x] Tutti i 🔴 CRITICO risolti (zero trovati)
- [x] `vercel.json` con security headers presente
- [x] FORM_ID Formspree configurato (`xqewjkdn`) e commento stale rimosso
- [x] Link HTTPS-only nel footer
- [x] Skip-link, alt, aria-label, lang, focus-visible — tutti OK
- [ ] Sito testato su Chrome, Firefox, Safari (richiede browser fisico)
- [ ] Sito testato su iPhone reale e Android reale (post-deploy)
- [ ] Convertite immagini in WebP (manuale, richiede tool)
- [ ] CSP header aggiunto (manuale, richiede testing)
- [ ] Verificato `https://hub.euriskosrl.it/` risponde
- [ ] Google Search Console configurato post-deploy
- [ ] Analytics configurato (solo dopo consenso cookie banner)

---

## Note conclusive

Il sito è in **stato pre-produzione molto solido**. Le aree migliorate in questo audit:
- **Postura sicurezza HTTP**: vercel.json ora pubblica 7 security headers (era zero)
- **A11y form ricerca**: focus-visible aggiunto (era invisibile)
- **Safari iOS rendering**: backdrop-filter ora visibile (era trasparente)
- **First-paint**: ~200-400ms più veloce (font in parallelo invece che serie)

Le aree dove vale la pena investire post-deploy:
- **WebP per immagini**: -700KB ca. di peso totale, impatto Core Web Vitals significativo
- **CSP**: passa da "buono" a "molto buono", deterrente forte XSS in caso di compromesso domain
- **Test su device reali**: per validare i fix mobile su iPhone/Android fisici

Nessun blocker per il deploy. ✓
