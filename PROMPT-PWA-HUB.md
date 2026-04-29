# Prompt per Claude Code — PWA install + link capture su hub.euriskosrl.it

Prompt da passare all'agente Claude Code che lavora sul progetto `hub.euriskosrl.it`.

Obiettivo: configurare la PWA in modo che, una volta installata sul device dell'utente, i click su link `https://hub.euriskosrl.it/*` da siti esterni (es. footer di euriskosrl.it) aprano direttamente l'app installata invece del browser.

---

```
Devi configurare hub.euriskosrl.it come PWA installabile, in modo che quando un utente la
installa sul proprio device (Android, iOS, Windows), un click su un link che punta a
https://hub.euriskosrl.it/* da qualsiasi sito esterno apra direttamente l'app
installata invece del browser. Questo si chiama "OS-level link capture / PWA handoff".

## Contesto

L'app gira su Vercel, dominio https://hub.euriskosrl.it. Il sito principale
euriskosrl.it ha un link footer "Area Riservata" che punta a hub e oggi apre
sempre il browser, anche se l'utente ha installato la PWA. Vogliamo che apra
l'app installata.

## Cosa devi fare

### 1. Crea /public/manifest.json (o equivalente per il tuo framework)

```json
{
  "name": "Eurisko Hub",
  "short_name": "Hub Eurisko",
  "id": "/",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "display_override": ["standalone", "minimal-ui"],
  "orientation": "portrait",
  "background_color": "#0A1628",
  "theme_color": "#0A1628",
  "lang": "it",
  "dir": "ltr",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-maskable-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"
    }
  ],
  "capture_links": "existing-client-navigate",
  "launch_handler": {
    "client_mode": "navigate-existing"
  }
}
```

Campi critici:
- `scope: "/"` rende TUTTI gli URL hub.euriskosrl.it/* di "proprietà" della PWA
  (necessario per il link capture).
- `display: "standalone"` (NON "browser") perché solo standalone abilita il handoff OS.
- `capture_links: "existing-client-navigate"` istruisce Chromium a deviare i link
  alla PWA esistente.
- `launch_handler.client_mode: "navigate-existing"` riusa la finestra app già aperta.

### 2. Genera le 3 icone se non esistono

Servono 3 PNG: 192x192, 512x512 (purpose "any"), 512x512 (purpose "maskable").
La maskable deve avere padding di sicurezza ~20% intorno al logo, perché Android la
crop dinamicamente. Genera o chiedi all'utente.

### 3. Crea /public/sw.js (service worker minimo, OBBLIGATORIO per installabilità)

```js
const CACHE = 'hub-v1';
const ASSETS = ['/', '/manifest.json'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((r) => r || fetch(event.request))
  );
});
```

### 4. Registra il service worker

In un componente caricato a livello root (layout/_app/root):

```js
if ('serviceWorker' in navigator && location.protocol === 'https:') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(() => {});
  });
}
```

### 5. Aggiungi tag PWA al <head> di TUTTE le pagine

Idealmente nel layout/template comune:

```html
<link rel="manifest" href="/manifest.json">
<meta name="theme-color" content="#0A1628">

<!-- iOS Safari NON legge molti campi del manifest, servono questi tag legacy -->
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Hub Eurisko">
<link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon-180.png">
```

### 6. Configura headers Vercel per non cachare il manifest aggressivamente

Aggiungi a vercel.json:

```json
{
  "headers": [
    {
      "source": "/manifest.json",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=0, must-revalidate" },
        { "key": "Content-Type", "value": "application/manifest+json" }
      ]
    },
    {
      "source": "/sw.js",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=0, must-revalidate" }
      ]
    }
  ]
}
```

## Acceptance criteria

L'implementazione è corretta solo se TUTTI questi check passano:

- [ ] `curl -s https://hub.euriskosrl.it/manifest.json` restituisce JSON valido
      con tutti i campi sopra
- [ ] Chrome DevTools > Application > Manifest non mostra warning rossi
- [ ] Chrome DevTools > Application > Service Workers mostra
      "activated and running"
- [ ] Chrome DevTools > Application > Service Workers > scope = "/"
- [ ] Lighthouse audit categoria PWA: punteggio >= 90
- [ ] Su Chrome desktop: appare l'icona "Installa app" nell'address bar
- [ ] Su Android Chrome: appare "Aggiungi a schermata Home" nel menu
- [ ] Test reale: installare PWA, chiuderla, aprire da un altro browser/app un link
      a https://hub.euriskosrl.it/qualsiasi-path -> deve aprire la PWA, non Chrome
- [ ] iOS Safari 16.4+: dopo "Aggiungi a Home", click su link a hub.euriskosrl.it
      da Mail/Messaggi/altre app -> apre la PWA installata

## Cose da NON fare

- NON usare `display: "browser"` (annulla il handoff)
- NON dimenticare l'icona maskable (Chrome blocca install senza)
- NON mettere `scope` più stretto di quello che vuoi catturare
- NON cachare manifest.json a lunga durata (impedisce update)
- NON registrare il service worker con scope diverso da quello del manifest

## Quando hai finito

Conferma che tutti gli acceptance criteria passano e mandami:
1. Lighthouse PWA score
2. Output di `curl -s https://hub.euriskosrl.it/manifest.json`
3. Risultato del test mobile reale (installare app + click su link esterno)
```

---

## Note di contesto per chi gira il prompt

- Il dominio `hub.euriskosrl.it` è separato da `euriskosrl.it` (sito vetrina)
- Il sito vetrina ha un link footer "Area Riservata" che punta a `https://hub.euriskosrl.it/`
  con `target="_blank"` — eventualmente da rimuovere lato vetrina dopo che hub è
  configurato come PWA, per massimizzare il handoff
- Una volta confermato che hub è una PWA installabile correttamente, si testa il
  flusso completo: install → close → tap su link da euriskosrl.it footer → app si apre
