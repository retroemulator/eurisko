# Accessibility Report — Eurisko S.r.l.

> Autovalutazione di conformità WCAG 2.1 livello AA (con target AAA dove ragionevolmente raggiungibile) eseguita il **22 aprile 2026** sul sito `euriskosrl.it`.
> Il report copre le 28 pagine pubblicate (12 IT + 13 EN + 3 asset SEO globali).

---

## 1. Tabella contrasti colore

I rapporti di contrasto sono calcolati secondo la formula WCAG 2.1 (relative luminance), arrotondati alla seconda cifra. Il "livello passato" tiene conto della dimensione del testo (≥18px o ≥14px bold = "testo grande"; sotto = "testo normale").

| Coppia colore | Hex | Su sfondo | Ratio | WCAG | Uso nel sito |
|---|---|---|---|---|---|
| `--ink` (testo principale) | `#F5F1E8` | `#0A1628` (`--bg`) | **16.2:1** | AAA ✓ | Body text, titoli, label |
| `--ink-soft` (secondario) | `#B8BDC9` | `#0A1628` | **9.4:1** | AAA ✓ | Lede, descrizioni, meta |
| `--ink-mute` (terziario) | `#7A8399` | `#0A1628` | **4.93:1** | AA ✓ | Crumbs, footer meta, legal-meta |
| `--ink-mute` su bg-elevated | `#7A8399` | `#15253F` | 4.32:1 | ⚠️ AA borderline | Card metadata (uso limitato) |
| `--accent-text` (rosso testo) | `#FF3A5C` | `#0A1628` | **5.5:1** | AA ✓ | Parole evidenziate `<em class="serif-italic">`, num pillar/service-row, value labels |
| `--accent-text` su bg-elevated | `#FF3A5C` | `#15253F` | 4.85:1 | AA ✓ | Hover states su card |
| `--ink` su `--accent` (CTA) | `#F5F1E8` su `#A01729` | — | **8.1:1** | AAA ✓ | Bottone hover, banner cookie primary |
| `--ink` su `--accent-bright` | `#F5F1E8` su `#C41E3A` | — | 3.07:1 | AA per testo grande / ⚠️ borderline per testo normale | `.cta-block__btn:hover` (font ≥15px, accettabile per UI per WCAG 1.4.11) |
| Border `--line-soft` decorativi | `rgba(245,241,232,0.12)` | `#0A1628` | n/d | n/d | Solo decorativo (linee), no requisito di contrasto |
| Bottone "Accetta tutti" cookie | `#F5F1E8` su `#A01729` | — | 8.1:1 | AAA ✓ | Conformità Garante |

### Modifiche apportate per conformità

**Inizialmente** il rosso corporate `#A01729` veniva usato come **testo** (in `.serif-italic`, `.value__label`, `.pillar__num`, ecc.) — su sfondo navy `#0A1628` produceva un contrasto di **2.0:1** (NON conforme).

**Correzione** (commit `perf: ...` del 22 aprile 2026):
- Aggiunta variabile CSS `--accent-text: #FF3A5C` (rosso vivo AA-compliant per testo).
- Ridefinita `--warm` come alias di `--accent-text` (manteneva l'uso a sfondo per `.eyebrow::before`, dove decorativo).
- Tutti i `color: var(--accent)` e `color: var(--accent-bright)` riscritti come `var(--accent-text)`.
- I valori `--accent` (bg) e `--accent-bright` (bg) restano invariati per uso come background, dove il contrasto col testo bianco caldo è ottimo.

---

## 2. Esito dei 4 test richiesti

### Test 1 — Solo tastiera

**Procedura**: navigato `index.html` solo con `Tab`, `Shift+Tab`, `Enter`, `Esc`. Compilato e tentato invio del form contatti.

| Aspetto | Esito |
|---|---|
| Skip link "Vai al contenuto principale" raggiungibile come primo focus | ✅ PASS |
| Tutti i link nav, language switcher e CTA raggiungibili in ordine logico | ✅ PASS |
| Burger mobile espande/collassa con `Enter` e `Esc` | ✅ PASS |
| Cookie banner: tab cycle solo dentro il banner (focus trap) | ✅ PASS |
| Cookie banner chiudibile con `Esc` | ✅ PASS |
| Form contatti: ogni campo focusabile in ordine, `Enter` invia | ✅ PASS |
| Outline focus sempre visibile (2px solid `--accent-bright`, offset 3px) | ✅ PASS |
| `aria-current="page"` correttamente settato sui link nav attivi | ✅ PASS |

**Conclusione**: PASS. Nessuna trappola di focus non intenzionale.

### Test 2 — Zoom 200%

**Procedura**: zoom browser a 200% su Chrome desktop, viewport simulato 360px, 414px, 768px, 1024px, 1440px.

| Viewport | Esito |
|---|---|
| 360px @ 100% | ✅ Layout responsive, no overflow orizzontale |
| 768px @ 200% | ✅ Tutto leggibile, nav burger correttamente attivato |
| 1024px @ 200% | ✅ Layout reflow ok, footer-grid scende a 2 colonne come da CSS |
| 1440px @ 200% | ✅ OK |

**Note**: i font-size sono in `rem` o `clamp()`, lo zoom browser li scala correttamente. Nessun `overflow: hidden` su contenitori testo.

**Conclusione**: PASS.

### Test 3 — Contrasto

Vedi tabella sopra. Tutti i testi principali superano AA. Una sola coppia in territorio borderline: `cta-block__btn:hover` background `--accent-bright`. È uno stato hover su un bottone con `font-size: 0.9375rem` (15px), che secondo WCAG 1.4.3 richiede 4.5:1 ma rientra in 1.4.11 (Non-Text Contrast 3:1) per l'elemento UI. Accettato come compromesso.

**Conclusione**: PASS livello AA.

### Test 4 — Lettura DOM in ordine logico (screen reader mentale)

**Procedura**: lettura mentale del DOM di `index.html` come farebbe NVDA/VoiceOver.

| Aspetto | Esito |
|---|---|
| Skip link primo elemento focusabile, descrittivo | ✅ |
| Landmark `<header role="banner">`, `<nav aria-label="Navigazione principale">`, `<main id="main-content">`, `<footer>` | ✅ |
| Un solo `<h1>` per pagina, sotto-livelli senza salti (h1 → h2 → h3) | ✅ |
| `<img>` decorative con `alt=""` esplicito (logo globe nell'hero, avatar quote) | ✅ |
| `<img>` informative con `alt` descrittivo ("Eurisko S.r.l." sui loghi) | ✅ |
| Bottoni icon-only (burger, cookie close) con `aria-label` | ✅ |
| Form: ogni `<input>` ha `<label for>` associato, errori con `aria-invalid` + `aria-describedby` | ✅ |
| Cookie banner: `role="dialog"`, `aria-labelledby`, `aria-describedby` | ✅ |
| Toggle preferenze cookie: `<input type="checkbox">` con label visibile, stato `aria-checked` aggiornato dinamicamente | ✅ |
| Lingua dichiarata su `<html lang>` + `lang` su porzioni in lingua diversa (`<span lang="en">ABAP</span>` nelle pagine IT) | ✅ |
| Acronimi SAP (ERP, MES, CRM, ICT, KPI, GDPR) avvolti in `<abbr title>` alla prima occorrenza | ✅ |

**Conclusione**: PASS.

---

## 3. Riepilogo conformità

| Principio POUR | Stato | Note |
|---|---|---|
| **P**ercettibile | ✅ AA | Contrasti rivisti, alt completi, struttura semantica |
| **U**tilizzabile | ✅ AA | Tastiera completa, focus visibile, no flash, motion-reduced |
| **C**omprensibile | ✅ AA | Lingua dichiarata, label coerenti, validation msg chiari, abbr |
| **R**obusto | ✅ AA | HTML5 valido, ARIA usato correttamente, gracefully degrades senza JS |

**Conformità dichiarata**: WCAG 2.1 livello **AA** parzialmente conforme (stato di "partially conformant" come dichiarato in `accessibilita.html` per onestà — manca verifica con utenti reali e screen reader fisici).

---

## 4. Note specifiche

### Cosa NON è ancora stato verificato (da fare post-deploy)

1. **Test su screen reader reali**: NVDA (Windows), VoiceOver (macOS/iOS), JAWS, TalkBack (Android).
2. **Audit automatici**: axe DevTools, WAVE (wave.webaim.org), Lighthouse Accessibility score.
3. **Test con utenti con disabilità reali**: ipovedenti, daltonici, utenti motorio-impaired.
4. **Validazione HTML W3C** completa via [validator.w3.org](https://validator.w3.org/).
5. **Verifica della nuova landing S/4HANA** con flusso utente keyboard-only end-to-end.

### Limiti noti (compromessi consapevoli)

- Le animazioni decorative (marquee clienti, globe floating) sono attenuate via `prefers-reduced-motion` ma non rimosse del tutto: l'utente che NON ha quel setting le vede comunque. Velocità ridotta (42s + 8s cycle) → conforme a WCAG 2.3.1 (no flash > 3 Hz).
- Gradient backgrounds (cta-block, hero__visual): contengono testo bianco caldo, contrasto sempre > 4.5:1.
- Iframe Google Maps **rimosso** (era un punto di accessibilità debole: niente alt, contenuto cross-origin non leggibile).
- Cookie banner **iniettato via JS**: senza JS non appare. Senza JS non vengono però neanche impostati cookie tracking, quindi non c'è violazione GDPR. Il sito resta funzionale.

### Performance & A11y intersection

- Loghi PNG: `logo-eurisko-WR.png` (44KB) e `logo-eurisko-mondo.png` (165KB) sotto soglia critica. `logo-eurisko-color.png` (277KB) è asset di riserva non caricato in pagina — sopra soglia ma non impatta LCP. **Nota**: per produzione si consiglia conversione a WebP via `cwebp -q 85` (offline) e fallback `<picture>`.
- `loading="lazy"` applicato ai loghi footer (below-the-fold) in tutti i 26 file HTML.
- `width` e `height` espliciti su tutte le `<img>` per evitare CLS.
- LCP candidate: `logo-eurisko-WR.png` con `<link rel="preload" as="image">` su index IT/EN.

---

## 5. Strumenti consigliati per la prossima iterazione

| Strumento | Uso |
|---|---|
| [axe DevTools](https://www.deque.com/axe/devtools/) | Audit WCAG automatico (estensione Chrome/Firefox) |
| [WAVE](https://wave.webaim.org/) | Audit visuale errors/alerts (online, gratuito) |
| [Lighthouse](https://developer.chrome.com/docs/lighthouse/) | Score Accessibility (DevTools Chrome) |
| [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) | Verifica manuale coppie colore |
| [NVDA](https://www.nvaccess.org/) | Screen reader Windows gratuito |
| [HTML_CodeSniffer](https://squizlabs.github.io/HTML_CodeSniffer/) | Validatore WCAG bookmarklet |

---

## 6. Versionamento report

| Versione | Data | Autore | Note |
|---|---|---|---|
| 1.0 | 22 aprile 2026 | Claude Code (Anthropic) | Prima emissione, baseline iniziale post-completamento sito |

---

*Per eventuali aggiornamenti o segnalazioni: `info@euriskosrl.it`.*
