// ============================================
// Eurisko — Shared interactions (vanilla JS)
// Tutto è opzionale: il sito funziona anche senza JavaScript.
// ============================================

(function () {
  'use strict';

  // -------- 1. Navbar scroll state --------
  const nav = document.querySelector('.nav');
  if (nav) {
    const onScroll = () => {
      if (window.scrollY > 24) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // -------- 2. Mobile burger --------
  const burger = document.querySelector('.nav__burger');
  if (burger && nav) {
    burger.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      burger.setAttribute('aria-expanded', String(isOpen));
      burger.setAttribute('aria-label', isOpen ? 'Chiudi menu di navigazione' : 'Apri menu di navigazione');
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        nav.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        burger.focus();
      }
    });
  }

  // -------- 2b. Nav dropdown: toggle come accordion dentro il burger mobile --------
  document.querySelectorAll('.nav__dropdown-trigger').forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      if (nav && nav.classList.contains('open')) {
        e.preventDefault();
        const dd = trigger.closest('.nav__dropdown');
        if (!dd) return;
        const isOpen = dd.classList.toggle('open');
        trigger.setAttribute('aria-expanded', String(isOpen));
      }
    });
  });

  // -------- 2b2. WOW: nav link char-slide hover wrap --------
  // Avvolge il testo di ogni link principale in span.nav__link-text[data-text]
  // > span.nav__link-text__inner così il ::after può duplicare il testo in rosso
  // e far scorrere l'originale in alto al hover. Gestisce anche i trigger con
  // chevron (mantiene la freccia dopo il wrap).
  document.querySelectorAll('.nav__links > a, .nav__links > .nav__dropdown > a.nav__dropdown-trigger').forEach((a) => {
    if (a.dataset.slideDone) return;
    const firstText = Array.from(a.childNodes).find((n) => n.nodeType === 3 && n.nodeValue.trim());
    if (!firstText) return;
    const trimmed = firstText.nodeValue.trim();
    if (!trimmed) return;
    const wrap = document.createElement('span');
    wrap.className = 'nav__link-text';
    wrap.setAttribute('data-text', trimmed);
    const inner = document.createElement('span');
    inner.className = 'nav__link-text__inner';
    inner.textContent = trimmed;
    wrap.appendChild(inner);
    const parent = firstText.parentNode;
    parent.insertBefore(wrap, firstText);
    // Se c'era uno spazio finale (prima del chevron), preservalo
    if (/\s+$/.test(firstText.nodeValue)) {
      parent.insertBefore(document.createTextNode(' '), firstText);
    }
    parent.removeChild(firstText);
    a.dataset.slideDone = '1';
  });

  // -------- 2c. Split hero titles in parole per word mask-reveal WOW --------
  // Esegue PRIMA dell'IntersectionObserver così le parole sono già avvolte
  // quando parte la transizione .is-in.
  document.querySelectorAll('.hero__title.reveal, .page-hero__title.reveal').forEach((el) => {
    if (el.dataset.splitDone) return;
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    let tn;
    while ((tn = walker.nextNode())) textNodes.push(tn);
    let wordIndex = 0;
    textNodes.forEach((node) => {
      if (!node.nodeValue.trim()) return;
      const frag = document.createDocumentFragment();
      node.nodeValue.split(/(\s+)/).forEach((part) => {
        if (part === '') return;
        if (/^\s+$/.test(part)) {
          frag.appendChild(document.createTextNode(part));
        } else {
          const outer = document.createElement('span');
          outer.className = 'word';
          const inner = document.createElement('span');
          inner.className = 'word__inner';
          inner.textContent = part;
          inner.style.transitionDelay = (wordIndex * 70) + 'ms';
          wordIndex += 1;
          outer.appendChild(inner);
          frag.appendChild(outer);
        }
      });
      node.parentNode.replaceChild(frag, node);
    });
    el.dataset.splitDone = '1';
    el.classList.add('split-reveal');
  });

  // -------- 3. Scroll-reveal (rispetta prefers-reduced-motion) --------
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealEls = document.querySelectorAll('.reveal');
  if (prefersReducedMotion) {
    revealEls.forEach((el) => el.classList.add('is-in'));
  } else if ('IntersectionObserver' in window && revealEls.length) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach((el) => obs.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-in'));
  }

  // -------- 4. Marquee: duplicate track for seamless loop --------
  document.querySelectorAll('.marquee__track').forEach((track) => {
    track.innerHTML += track.innerHTML;
  });

  // -------- 5. Current year in footer --------
  document.querySelectorAll('[data-year]').forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  // -------- 6. i18n helper --------
  const isEN = (document.documentElement.lang || 'it').toLowerCase().startsWith('en');

  // -------- 7. Form contatti — validazione client-side --------
  const contactForm = document.querySelector('form.contact');
  if (contactForm) {
    const t = isEN
      ? {
          required: 'This field is required.',
          email: 'Please enter a valid email address.',
          minlength: (n) => `Please enter at least ${n} characters.`,
          privacy: 'You must accept the privacy policy.',
          sending: 'Sending…',
        }
      : {
          required: 'Questo campo è obbligatorio.',
          email: 'Inserisci un indirizzo email valido.',
          minlength: (n) => `Inserisci almeno ${n} caratteri.`,
          privacy: 'Devi accettare la privacy policy.',
          sending: 'Invio in corso…',
        };

    const status = contactForm.querySelector('.form-status');
    const setStatus = (text, state) => {
      if (!status) return;
      status.textContent = text || '';
      if (state) status.dataset.state = state;
      else delete status.dataset.state;
    };

    const showError = (field, message) => {
      field.setAttribute('aria-invalid', 'true');
      const errorEl = document.getElementById(field.id + '-error');
      if (errorEl) {
        errorEl.textContent = message;
        errorEl.hidden = false;
        field.setAttribute('aria-describedby', errorEl.id);
      }
    };
    const clearError = (field) => {
      field.removeAttribute('aria-invalid');
      const errorEl = document.getElementById(field.id + '-error');
      if (errorEl) {
        errorEl.textContent = '';
        errorEl.hidden = true;
      }
    };

    const validateField = (field) => {
      const value = (field.value || '').trim();
      if (field.hasAttribute('required') && field.type !== 'checkbox' && !value) {
        showError(field, t.required);
        return false;
      }
      if (field.type === 'email' && value) {
        const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        if (!ok) { showError(field, t.email); return false; }
      }
      const min = parseInt(field.getAttribute('minlength') || '0', 10);
      if (min > 0 && value && value.length < min) {
        showError(field, t.minlength(min));
        return false;
      }
      clearError(field);
      return true;
    };

    contactForm.querySelectorAll('input, textarea, select').forEach((field) => {
      if (field.type === 'hidden' || field.name === '_gotcha') return;
      if (field.type !== 'checkbox') {
        field.addEventListener('blur', () => validateField(field));
        field.addEventListener('input', () => {
          if (field.getAttribute('aria-invalid') === 'true') validateField(field);
        });
      }
    });

    contactForm.addEventListener('submit', (e) => {
      let allValid = true;
      let firstInvalid = null;
      contactForm.querySelectorAll('input, textarea, select').forEach((field) => {
        if (field.type === 'hidden' || field.name === '_gotcha') return;
        if (field.type === 'checkbox') {
          if (field.required && !field.checked) {
            allValid = false;
            if (!firstInvalid) firstInvalid = field;
            setStatus(t.privacy, 'error');
          }
          return;
        }
        const ok = validateField(field);
        if (!ok) {
          allValid = false;
          if (!firstInvalid) firstInvalid = field;
        }
      });
      if (!allValid) {
        e.preventDefault();
        if (firstInvalid) firstInvalid.focus();
        return;
      }
      setStatus(t.sending, '');
    });
  }

  // ==================================================
  // 8. COOKIE CONSENT BANNER (GDPR)
  // ==================================================
  const COOKIE_NAME = 'eurisko_consent';
  const COOKIE_DAYS = 365;

  const cookieI18n = isEN
    ? {
        title: 'We value your privacy',
        text: 'We use technical cookies necessary to operate the site. With your consent we may use additional cookies. Read the <a href="cookie-policy.html">Cookie Policy</a> and the <a href="privacy.html">Privacy Policy</a>.',
        accept: 'Accept all',
        reject: 'Reject all',
        custom: 'Customize',
        save: 'Save preferences',
        techName: 'Technical (always active)',
        techDesc: 'Necessary for the proper functioning of the site. Cannot be disabled.',
        analyticsName: 'Analytics',
        analyticsDesc: 'Help us understand how visitors use the site, in aggregate and anonymous form.',
        marketingName: 'Marketing',
        marketingDesc: 'Used to show personalized content. Currently not active.',
        reopen: 'Cookie settings',
        bannerLabel: 'Cookie consent',
      }
    : {
        title: 'Rispettiamo la tua privacy',
        text: 'Utilizziamo cookie tecnici necessari al funzionamento del sito. Con il tuo consenso possiamo utilizzare cookie aggiuntivi. Leggi la <a href="cookie-policy.html">Cookie Policy</a> e la <a href="privacy.html">Privacy Policy</a>.',
        accept: 'Accetta tutti',
        reject: 'Rifiuta tutti',
        custom: 'Personalizza',
        save: 'Salva preferenze',
        techName: 'Tecnici (sempre attivi)',
        techDesc: 'Necessari al corretto funzionamento del sito. Non disattivabili.',
        analyticsName: 'Analitici',
        analyticsDesc: 'Ci aiutano a capire come i visitatori usano il sito, in forma aggregata e anonima.',
        marketingName: 'Marketing',
        marketingDesc: 'Utilizzati per mostrare contenuti personalizzati. Attualmente non attivi.',
        reopen: 'Impostazioni cookie',
        bannerLabel: 'Consenso cookie',
      };

  function getCookie(name) {
    const match = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()\[\]\\\/+^])/g, '\\$1') + '=([^;]*)'));
    return match ? decodeURIComponent(match[1]) : null;
  }
  function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + days * 86400000);
    const secure = location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + d.toUTCString() + '; path=/; SameSite=Lax' + secure;
  }
  function readConsent() {
    try {
      const raw = getCookie(COOKIE_NAME);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) { return null; }
  }
  function saveConsent(consent) {
    setCookie(COOKIE_NAME, JSON.stringify(Object.assign({ ts: Date.now(), v: 1 }, consent)), COOKIE_DAYS);
    // Future hook: enable scripts based on consent here
    // if (consent.analytics) { /* load analytics */ }
  }

  let bannerEl = null;
  let lastFocusedBeforeBanner = null;

  function buildBanner() {
    const banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.id = 'cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-modal', 'false');
    banner.setAttribute('aria-labelledby', 'cookie-banner-title');
    banner.setAttribute('aria-describedby', 'cookie-banner-text');
    banner.setAttribute('aria-label', cookieI18n.bannerLabel);
    banner.innerHTML = `
      <h2 class="cookie-banner__title" id="cookie-banner-title">${cookieI18n.title}</h2>
      <p class="cookie-banner__text" id="cookie-banner-text">${cookieI18n.text}</p>
      <div class="cookie-banner__actions">
        <button type="button" class="cookie-banner__btn cookie-banner__btn--ghost" data-cookie-action="custom">${cookieI18n.custom}</button>
        <button type="button" class="cookie-banner__btn cookie-banner__btn--secondary" data-cookie-action="reject">${cookieI18n.reject}</button>
        <button type="button" class="cookie-banner__btn cookie-banner__btn--primary" data-cookie-action="accept">${cookieI18n.accept}</button>
      </div>
      <div class="cookie-banner__panel" id="cookie-banner-panel" hidden>
        <div class="cookie-banner__category">
          <div class="cookie-banner__category-info">
            <span class="cookie-banner__category-name">${cookieI18n.techName}</span>
            <p class="cookie-banner__category-desc">${cookieI18n.techDesc}</p>
          </div>
          <label class="cookie-toggle" aria-label="${cookieI18n.techName}">
            <input type="checkbox" checked disabled aria-checked="true" data-category="technical">
            <span class="cookie-toggle__track"></span>
          </label>
        </div>
        <div class="cookie-banner__category">
          <div class="cookie-banner__category-info">
            <span class="cookie-banner__category-name">${cookieI18n.analyticsName}</span>
            <p class="cookie-banner__category-desc">${cookieI18n.analyticsDesc}</p>
          </div>
          <label class="cookie-toggle" aria-label="${cookieI18n.analyticsName}">
            <input type="checkbox" data-category="analytics" aria-checked="false">
            <span class="cookie-toggle__track"></span>
          </label>
        </div>
        <div class="cookie-banner__category">
          <div class="cookie-banner__category-info">
            <span class="cookie-banner__category-name">${cookieI18n.marketingName}</span>
            <p class="cookie-banner__category-desc">${cookieI18n.marketingDesc}</p>
          </div>
          <label class="cookie-toggle" aria-label="${cookieI18n.marketingName}">
            <input type="checkbox" data-category="marketing" aria-checked="false">
            <span class="cookie-toggle__track"></span>
          </label>
        </div>
        <div class="cookie-banner__actions" style="margin-top: 16px;">
          <button type="button" class="cookie-banner__btn cookie-banner__btn--primary" data-cookie-action="save">${cookieI18n.save}</button>
        </div>
      </div>
    `;
    return banner;
  }

  function getFocusable(root) {
    return Array.from(root.querySelectorAll('button:not([disabled]), [href], input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])'));
  }

  function trapFocus(e) {
    if (!bannerEl || e.key !== 'Tab') return;
    const focusables = getFocusable(bannerEl);
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  function onKeydown(e) {
    if (!bannerEl) return;
    if (e.key === 'Escape') {
      hideBanner();
    } else {
      trapFocus(e);
    }
  }

  function showBanner() {
    if (bannerEl) return;
    lastFocusedBeforeBanner = document.activeElement;
    bannerEl = buildBanner();
    document.body.appendChild(bannerEl);

    bannerEl.addEventListener('click', onBannerClick);
    document.addEventListener('keydown', onKeydown);

    // Sync toggle aria-checked on change
    bannerEl.querySelectorAll('.cookie-toggle input').forEach((cb) => {
      cb.addEventListener('change', () => {
        cb.setAttribute('aria-checked', String(cb.checked));
      });
    });

    // Focus first action
    const firstBtn = bannerEl.querySelector('button[data-cookie-action="accept"]');
    if (firstBtn) firstBtn.focus();
  }

  function hideBanner() {
    if (!bannerEl) return;
    bannerEl.removeEventListener('click', onBannerClick);
    document.removeEventListener('keydown', onKeydown);
    bannerEl.remove();
    bannerEl = null;
    if (lastFocusedBeforeBanner && typeof lastFocusedBeforeBanner.focus === 'function') {
      lastFocusedBeforeBanner.focus();
    }
  }

  function onBannerClick(e) {
    const target = e.target.closest('[data-cookie-action]');
    if (!target) return;
    const action = target.dataset.cookieAction;
    if (action === 'accept') {
      saveConsent({ technical: true, analytics: true, marketing: true });
      hideBanner();
    } else if (action === 'reject') {
      saveConsent({ technical: true, analytics: false, marketing: false });
      hideBanner();
    } else if (action === 'custom') {
      const panel = bannerEl.querySelector('#cookie-banner-panel');
      if (panel) {
        const wasHidden = panel.hasAttribute('hidden');
        if (wasHidden) panel.removeAttribute('hidden');
        else panel.setAttribute('hidden', '');
        target.setAttribute('aria-expanded', String(wasHidden));
      }
    } else if (action === 'save') {
      const consent = { technical: true, analytics: false, marketing: false };
      bannerEl.querySelectorAll('.cookie-toggle input[data-category]').forEach((cb) => {
        consent[cb.dataset.category] = cb.checked;
      });
      saveConsent(consent);
      hideBanner();
    }
  }

  function reopenBanner() {
    if (bannerEl) return;
    showBanner();
    // Pre-fill panel from existing consent
    const consent = readConsent();
    if (consent && bannerEl) {
      const panel = bannerEl.querySelector('#cookie-banner-panel');
      if (panel) {
        panel.removeAttribute('hidden');
        const customBtn = bannerEl.querySelector('[data-cookie-action="custom"]');
        if (customBtn) customBtn.setAttribute('aria-expanded', 'true');
      }
      bannerEl.querySelectorAll('.cookie-toggle input[data-category]').forEach((cb) => {
        const category = cb.dataset.category;
        if (category in consent) {
          cb.checked = !!consent[category];
          cb.setAttribute('aria-checked', String(cb.checked));
        }
      });
    }
  }

  // Add a "Cookie settings" reopen button to footer__meta
  function injectCookieReopenLink() {
    const metaContainer = document.querySelector('.footer__meta');
    if (!metaContainer) return;
    // The footer meta has the legal links container as last direct child; append button there.
    const linksContainer = metaContainer.lastElementChild;
    if (!linksContainer || linksContainer.tagName !== 'SPAN') return;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'cookie-reopen';
    btn.textContent = cookieI18n.reopen;
    btn.addEventListener('click', reopenBanner);
    linksContainer.appendChild(btn);
  }

  // Initialize on load
  if (!readConsent()) {
    // Show banner on first visit (small delay so it's not the first thing painted)
    setTimeout(showBanner, 400);
  }
  injectCookieReopenLink();

  // -------- 9. Hero video — slow down playback to ~70% --------
  document.querySelectorAll('.hero__bg-video').forEach((v) => {
    const setRate = () => { v.playbackRate = 0.52; };
    if (v.readyState >= 1) setRate();
    else v.addEventListener('loadedmetadata', setRate);
  });

})();
