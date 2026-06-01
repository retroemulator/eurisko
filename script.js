// ============================================
// Eurisko — Shared interactions (vanilla JS)
// Tutto è opzionale: il sito funziona anche senza JavaScript.
// ============================================

(function () {
  'use strict';

  // -------- 1. Navbar — scroll-aware shape-shifting (WOW) --------
  // States:
  //   .scrolled   → after 24px: stronger backdrop & smaller padding
  //   .floating   → after 100px (desktop): contracts to centered pill
  //   .hidden     → on scroll-down past 200px: slides out of viewport
  // Re-shows on scroll-up. Never hides while burger menu is open or any
  // descendant is focused (keyboard nav).
  const nav = document.querySelector('.nav');
  const heroScroll = document.querySelector('.hero__scroll');
  if (nav) {
    let lastY = window.scrollY;
    let ticking = false;
    let direction = 'down';
    const SHRINK = 24;
    const FLOAT = 100;
    const DELTA = 6;
    // Soglia di hide dinamica: una viewport intera (= opacity raggiunge 0)
    const getHideAfter = () => window.innerHeight || document.documentElement.clientHeight || 800;

    const update = () => {
      const y = window.scrollY;
      const dy = y - lastY;
      const hideAfter = getHideAfter();

      nav.classList.toggle('scrolled', y > SHRINK);
      nav.classList.toggle('floating', y > FLOAT);

      // Track scroll direction (con DELTA threshold per ignorare micro-scroll)
      if (Math.abs(dy) > DELTA) {
        if (dy > 0) direction = 'down';
        else if (dy < 0) direction = 'up';
      }

      // Calcolo opacity progressiva.
      // - Scroll-down dopo FLOAT (100px): opacity decade linearmente da 1 a 0
      //   raggiungendo 0 alla soglia hideAfter (= viewport height).
      // - Scroll-up: opacity istantanea a 1 (snap-back).
      // - Burger menu aperto: sempre opacity 1.
      let opacity = 1;
      if (direction === 'down' && y > FLOAT && !nav.classList.contains('open')) {
        const prog = Math.min(1, Math.max(0, (y - FLOAT) / (hideAfter - FLOAT)));
        opacity = 1 - prog;
      }
      nav.style.setProperty('--nav-opacity', opacity.toFixed(3));

      // Hero scroll-down indicator: identico comportamento del nav (fade su scroll-down
      // dopo FLOAT=100px raggiungendo 0 alla viewport height, snap-back istantaneo su scroll-up).
      if (heroScroll) {
        let hsOpacity = 1;
        if (direction === 'down' && y > FLOAT) {
          const prog = Math.min(1, Math.max(0, (y - FLOAT) / (hideAfter - FLOAT)));
          hsOpacity = 1 - prog;
        }
        heroScroll.style.setProperty('--hero-scroll-opacity', hsOpacity.toFixed(3));
      }

      lastY = y;
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
    update();
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

  // -------- 2b. Nav dropdown: accordion mobile + navigazione --------
  // Click sul chevron: toggle accordion (mai naviga).
  // Click sul testo del link con accordion chiuso: apre l'accordion.
  // Click sul testo con accordion gia aperto: naviga al link (default).
  document.querySelectorAll('.nav__dropdown-trigger').forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      if (!nav || !nav.classList.contains('open')) return;
      const dd = trigger.closest('.nav__dropdown');
      if (!dd) return;
      const isChevron = e.target.classList && e.target.classList.contains('nav__dropdown-chevron');
      const isAccordionOpen = dd.classList.contains('open');
      if (isChevron) {
        e.preventDefault();
        dd.classList.toggle('open');
        trigger.setAttribute('aria-expanded', String(!isAccordionOpen));
      } else if (!isAccordionOpen) {
        e.preventDefault();
        dd.classList.add('open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // -------- 2c. Split hero titles in parole per word mask-reveal WOW --------
  // Esegue PRIMA dell'IntersectionObserver così le parole sono già avvolte
  // quando parte la transizione .is-in.
  document.querySelectorAll('.hero__title.reveal, .page-hero__title.reveal, .section-header h2:not(.visually-hidden), .cta-block__title').forEach((el) => {
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

  // -------- 3b. WOW: stat count-up animato on scroll --------
  const statNums = document.querySelectorAll('.stat__num');
  if (statNums.length) {
    // Parse numero + suffisso (+, %, etc.) e azzera il display iniziale
    statNums.forEach((el) => {
      if (el.dataset.countPrepared) return;
      const raw = el.textContent.trim();
      const m = raw.match(/^(\d+)(.*)$/);
      if (!m) return;
      el.dataset.target = m[1];
      el.dataset.suffix = m[2] || '';
      el.dataset.countPrepared = '1';
      if (!prefersReducedMotion) {
        el.textContent = '0' + (m[2] || '');
      }
    });
    if (!prefersReducedMotion && 'IntersectionObserver' in window) {
      const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
      const statObs = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target;
          if (el.dataset.counted) return;
          el.dataset.counted = '1';
          // Skip elementi senza target numerico (es. 'Tutte', 'All') per evitare NaN
          if (!el.dataset.target) return;
          const target = parseInt(el.dataset.target, 10);
          const suffix = el.dataset.suffix || '';
          const duration = 1800;
          const startTs = performance.now();
          const tick = (now) => {
            const t = Math.min(1, (now - startTs) / duration);
            const val = Math.round(target * easeOutCubic(t));
            el.textContent = val + suffix;
            if (t < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          statObs.unobserve(el);
        });
      }, { threshold: 0.4 });
      statNums.forEach((el) => statObs.observe(el));
    }
  }

  // -------- 3c-bis. WOW: footer particles wordmark --------
  // ~400 puntini bianchi compongono "EURISKO". Al passaggio del cursore i puntini
  // vicini si allontanano (repulsione magnetica) e tornano elastici alla forma.
  // Solo desktop con (hover: hover) and (pointer: fine). Su mobile/touch e
  // prefers-reduced-motion mostra il fallback testo statico (gestito via CSS).
  const fp = document.querySelector('.footer-particles');
  if (fp && !prefersReducedMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const canvas = fp.querySelector('.footer-particles__canvas');
    const inner = fp.querySelector('.footer-particles__inner');
    if (canvas && canvas.getContext && inner) {
      const ctx = canvas.getContext('2d');
      let particles = [];
      let mouseX = -10000, mouseY = -10000;
      let dpr = Math.min(window.devicePixelRatio || 1, 2);
      let raf = 0;
      let started = false;
      let cssW = 0, cssH = 0;

      const setup = () => {
        const rect = inner.getBoundingClientRect();
        cssW = rect.width;
        cssH = rect.height;
        canvas.width = Math.round(cssW * dpr);
        canvas.height = Math.round(cssH * dpr);
        canvas.style.width = cssW + 'px';
        canvas.style.height = cssH + 'px';
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dpr, dpr);

        // Off-screen render of "EURISKO" to sample
        const off = document.createElement('canvas');
        off.width = Math.max(2, Math.round(cssW));
        off.height = Math.max(2, Math.round(cssH));
        const octx = off.getContext('2d');
        // Font size: tries to fill width, capped by height
        const fontSize = Math.min(cssW / 5.2, cssH * 0.92);
        octx.font = '700 ' + fontSize.toFixed(0) + "px 'Switzer', system-ui, -apple-system, sans-serif";
        octx.textAlign = 'left';
        octx.textBaseline = 'middle';
        octx.fillStyle = '#fff';
        octx.fillText('EURISKO', 0, off.height / 2);

        const data = octx.getImageData(0, 0, off.width, off.height).data;
        particles = [];
        // Step più piccolo = stelline più dense. Desktop 3 (~3x densità), tablet 4
        const step = cssW > 900 ? 3 : (cssW > 600 ? 4 : 6);
        for (let y = 0; y < off.height; y += step) {
          for (let x = 0; x < off.width; x += step) {
            const idx = (y * off.width + x) * 4 + 3;
            if (data[idx] > 128) {
              particles.push({
                bx: x,
                by: y,
                x: x + (Math.random() - 0.5) * 200,
                y: y + (Math.random() - 0.5) * 200,
                vx: 0,
                vy: 0,
                // Size leggermente più piccola così le stelline non si fondono
                size: 0.9 + Math.random() * 0.6
              });
            }
          }
        }
      };

      const REPULSE_RADIUS = 90;
      const R2 = REPULSE_RADIUS * REPULSE_RADIUS;

      const draw = () => {
        ctx.clearRect(0, 0, cssW, cssH);
        ctx.fillStyle = 'rgba(245, 241, 232, 0.95)';
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          const dx = p.x - mouseX;
          const dy = p.y - mouseY;
          const d2 = dx * dx + dy * dy;
          if (d2 < R2) {
            const dist = Math.sqrt(d2) || 1;
            const force = (REPULSE_RADIUS - dist) / dist;
            p.vx += dx * force * 0.04;
            p.vy += dy * force * 0.04;
          }
          p.vx += (p.bx - p.x) * 0.04;
          p.vy += (p.by - p.y) * 0.04;
          p.vx *= 0.82;
          p.vy *= 0.82;
          // Speed factor 0.75 = animazione 25% più lenta del default
          p.x += p.vx * 0.75;
          p.y += p.vy * 0.75;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
        raf = requestAnimationFrame(draw);
      };

      const start = () => {
        if (started) return;
        started = true;
        fp.classList.add('is-active');
        setup();
        draw();
      };

      const initWhenReady = () => {
        if ('IntersectionObserver' in window) {
          const obs = new IntersectionObserver((entries) => {
            if (entries.some((e) => e.isIntersecting)) {
              start();
              obs.disconnect();
            }
          }, { threshold: 0.05 });
          obs.observe(fp);
        } else {
          start();
        }
      };
      // Aspetta i font (Switzer) per misurare correttamente la larghezza testo
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(initWhenReady, initWhenReady);
      } else {
        initWhenReady();
      }

      fp.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
      });
      fp.addEventListener('mouseleave', () => {
        mouseX = -10000;
        mouseY = -10000;
      });

      let resizeT = 0;
      window.addEventListener('resize', () => {
        clearTimeout(resizeT);
        resizeT = setTimeout(() => { if (started) setup(); }, 200);
      });
    }
  }

  // -------- 3c. WOW: magnetic CTA buttons (solo dispositivi con pointer fine) --------
  if (!prefersReducedMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const strength = 0.28;
    document.querySelectorAll('.btn').forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const dx = (e.clientX - (rect.left + rect.width / 2)) * strength;
        const dy = (e.clientY - (rect.top + rect.height / 2)) * strength;
        btn.style.setProperty('--mx', dx.toFixed(2) + 'px');
        btn.style.setProperty('--my', dy.toFixed(2) + 'px');
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.setProperty('--mx', '0px');
        btn.style.setProperty('--my', '0px');
      });
    });
  }

  // -------- 3d. Site-wide search (overlay full-screen + live filtering) --------
  const searchTrigger = document.querySelector('.nav__search');
  if (searchTrigger) {
    const isEN = (document.documentElement.lang || 'it').toLowerCase().startsWith('en');
    const t = isEN
      ? { placeholder: 'Search the Eurisko site…', hint: 'Press', empty: 'No results for' }
      : { placeholder: 'Cerca nel sito Eurisko…', hint: 'Premi', empty: 'Nessun risultato per' };

    let searchIndex = null;
    let renderTimer = null;

    const overlay = document.createElement('div');
    overlay.className = 'site-search';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.innerHTML = ''
      + '<div class="site-search__backdrop" aria-hidden="true"></div>'
      + '<div class="site-search__panel" role="dialog" aria-modal="true" aria-label="Search">'
      +   '<button class="site-search__close" aria-label="' + (isEN ? 'Close search' : 'Chiudi ricerca') + '">&times;</button>'
      +   '<div class="site-search__input-wrap">'
      +     '<svg class="site-search__icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>'
      +     '<input type="search" class="site-search__input" placeholder="' + t.placeholder + '" autocomplete="off" spellcheck="false" />'
      +   '</div>'
      +   '<div class="site-search__hint">' + t.hint + ' <kbd>ESC</kbd> ' + (isEN ? 'to close' : 'per chiudere') + ' · <kbd>Ctrl</kbd>+<kbd>' + (isEN ? 'Click' : 'Clic') + '</kbd> ' + (isEN ? 'to open in new tab' : 'per aprire in nuova scheda') + '</div>'
      +   '<div class="site-search__results" role="list" aria-live="polite"></div>'
      + '</div>';
    document.body.appendChild(overlay);

    const inputEl = overlay.querySelector('.site-search__input');
    const resultsEl = overlay.querySelector('.site-search__results');
    const closeBtn = overlay.querySelector('.site-search__close');
    const backdrop = overlay.querySelector('.site-search__backdrop');

    const escapeHtml = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const highlight = (text, tokens) => {
      let out = escapeHtml(text);
      tokens.forEach((tok) => {
        const re = new RegExp('(' + escapeRegex(tok) + ')', 'gi');
        out = out.replace(re, '<mark>$1</mark>');
      });
      return out;
    };
    const snippet = (text, tokens, max) => {
      if (!text) return '';
      if (text.length <= max) return highlight(text, tokens);
      const lower = text.toLowerCase();
      let pos = -1;
      tokens.forEach((tok) => {
        const i = lower.indexOf(tok);
        if (i >= 0 && (pos === -1 || i < pos)) pos = i;
      });
      if (pos === -1) return highlight(text.slice(0, max) + '…', tokens);
      const start = Math.max(0, pos - 40);
      const end = Math.min(text.length, start + max);
      return (start > 0 ? '…' : '') + highlight(text.slice(start, end), tokens) + (end < text.length ? '…' : '');
    };

    const ensureIndex = async () => {
      if (searchIndex) return searchIndex;
      try {
        const res = await fetch('/search-index.json', { cache: 'force-cache' });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        searchIndex = await res.json();
      } catch (err) {
        console.error('search index fetch failed', err);
        searchIndex = [];
      }
      return searchIndex;
    };

    const render = (query) => {
      const q = (query || '').toLowerCase().trim();
      if (!q) { resultsEl.innerHTML = ''; return; }
      const tokens = q.split(/\s+/).filter((tok) => tok.length > 1);
      if (!tokens.length || !searchIndex) { resultsEl.innerHTML = ''; return; }

      const langPref = isEN ? 'en' : 'it';
      const scored = [];
      searchIndex.forEach((entry) => {
        const titleLow = (entry.title || '').toLowerCase();
        const descLow = (entry.description || '').toLowerCase();
        const contentLow = (entry.content || '').toLowerCase();
        let score = 0;
        let allMatch = true;
        for (let i = 0; i < tokens.length; i += 1) {
          const tok = tokens[i];
          let hits = 0;
          if (titleLow.includes(tok)) { score += 10; hits += 10; }
          if (descLow.includes(tok)) { score += 4; hits += 4; }
          if (contentLow.includes(tok)) { score += 1; hits += 1; }
          if (!hits) { allMatch = false; break; }
        }
        if (allMatch && score > 0) {
          if ((entry.lang || 'it').toLowerCase().startsWith(langPref)) score *= 2;
          scored.push({ entry: entry, score: score });
        }
      });
      scored.sort((a, b) => b.score - a.score);
      const top = scored.slice(0, 12);

      if (!top.length) {
        resultsEl.innerHTML = '<div class="site-search__empty">' + t.empty + ' "' + escapeHtml(query) + '"</div>';
        return;
      }
      resultsEl.innerHTML = top.map(function (item, i) {
        const e = item.entry;
        const desc = snippet(e.description, tokens, 160);
        return ''
          + '<a class="site-search__result" href="' + e.url + '" style="animation-delay:' + (i * 30) + 'ms">'
          +   '<span class="site-search__result-title">' + highlight(e.title, tokens) + '</span>'
          +   (desc ? '<span class="site-search__result-desc">' + desc + '</span>' : '')
          +   '<span class="site-search__result-arrow" aria-hidden="true">&rarr;</span>'
          + '</a>';
      }).join('');
    };

    const open = () => {
      overlay.classList.add('open');
      overlay.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      ensureIndex().then(() => { /* index pronto */ });
      setTimeout(() => inputEl.focus(), 80);
    };
    const close = () => {
      overlay.classList.remove('open');
      overlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      inputEl.value = '';
      resultsEl.innerHTML = '';
    };

    searchTrigger.addEventListener('click', open);
    closeBtn.addEventListener('click', close);
    backdrop.addEventListener('click', close);

    inputEl.addEventListener('input', () => {
      clearTimeout(renderTimer);
      renderTimer = setTimeout(() => render(inputEl.value), 80);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('open')) close();
      if ((e.key === 'k' || e.key === 'K') && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        if (overlay.classList.contains('open')) close(); else open();
      }
    });
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
      // reCAPTCHA v2: verifica che l'utente abbia spuntato 'non sono un robot'
      if (typeof grecaptcha !== 'undefined' && contactForm.querySelector('.g-recaptcha')) {
        const token = grecaptcha.getResponse();
        if (!token) {
          e.preventDefault();
          setStatus(isEN ? 'Please confirm you are not a robot.' : 'Conferma di non essere un robot.', 'error');
          return;
        }
      }
      setStatus(t.sending, '');
    });
  }

  // ==================================================
  // 8. COOKIE CONSENT BANNER (GDPR) — RIMOSSO
  // ==================================================
  // Il vecchio sistema cookie consent (cookie HTTP `eurisko_consent`,
  // banner full-width con 3 categorie tecniche/analytics/marketing,
  // pannello "Personalizza" con toggle, focus-trap, bottone
  // "Impostazioni cookie" iniettato in `.footer__meta`) e' stato
  // ELIMINATO. Il nuovo banner e' gestito interamente da `cookie-banner.js`
  // (linkato esplicitamente dalle pagine HTML) + Consent Mode v2 (GA4).

  // -------- 9. Hero video — slow down playback + loop fluido --------
  // Sorgente 1280x720 @30fps: a 0.32x si vedevano ~9.6 fps reali (scatti).
  // File ora 60fps (frame interpolati): a 0.4x = ~24 fps reali = fluido e lento.
  document.querySelectorAll('.hero__bg-video').forEach((v) => {
    const setRate = () => { v.playbackRate = 0.4; };
    if (v.readyState >= 1) setRate();
    else v.addEventListener('loadedmetadata', setRate);
    // Rewind manuale prima del loop nativo: evita lo scatto pause-seek-play
    // del loop con playbackRate != 1 (stesso fix dei page-hero video).
    v.addEventListener('timeupdate', () => {
      if (v.duration && v.currentTime >= v.duration - 0.1) {
        v.currentTime = 0;
      }
    });
  });

  // -------- 11. Page-hero media — cinematic reveal + 3D tilt parallax al mouse --------
  const phWraps = document.querySelectorAll('.page-hero__media-wrap--reveal');
  if (phWraps.length) {
    if (prefersReducedMotion) {
      phWraps.forEach((w) => w.classList.add('is-revealed'));
    } else {
      if ('IntersectionObserver' in window) {
        const revealObs = new IntersectionObserver((entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add('is-revealed');
              revealObs.unobserve(e.target);
            }
          });
        }, { threshold: 0.3 });
        phWraps.forEach((w) => revealObs.observe(w));
      } else {
        phWraps.forEach((w) => w.classList.add('is-revealed'));
      }
      phWraps.forEach((w) => {
        const media = w.querySelector('.page-hero__media');
        if (!media) return;
        w.addEventListener('mouseenter', () => w.classList.add('is-hovered'));
        w.addEventListener('mousemove', (e) => {
          const rect = w.getBoundingClientRect();
          const px = (e.clientX - rect.left) / rect.width - 0.5;
          const py = (e.clientY - rect.top) / rect.height - 0.5;
          media.style.setProperty('--tilt-x', (px * 16).toFixed(2) + 'deg');
          media.style.setProperty('--tilt-y', (-py * 16).toFixed(2) + 'deg');
        });
        w.addEventListener('mouseleave', () => {
          w.classList.remove('is-hovered');
          media.style.setProperty('--tilt-x', '0deg');
          media.style.setProperty('--tilt-y', '0deg');
        });
      });
    }
  }

  // -------- 12. Case study cards — video on hover (desktop), first frame static (mobile) --------
  const caseVideos = document.querySelectorAll('.case--has-video .case__video');
  if (caseVideos.length) {
    const isHoverCapable = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    caseVideos.forEach((v) => {
      // Pre-carico il primo frame: mostra il poster naturale del video
      v.pause();
      try { v.currentTime = 0.05; } catch (_) {}
      if (prefersReducedMotion || !isHoverCapable) return;
      const card = v.closest('.case');
      if (!card) return;
      let playPromise = null;
      const enter = () => {
        try { v.currentTime = 0; } catch (_) {}
        playPromise = v.play();
        if (playPromise && typeof playPromise.catch === 'function') playPromise.catch(() => {});
      };
      const leave = () => {
        const reset = () => {
          v.pause();
          try { v.currentTime = 0; } catch (_) {}
        };
        if (playPromise && typeof playPromise.then === 'function') {
          playPromise.then(reset, reset);
        } else {
          reset();
        }
      };
      card.addEventListener('mouseenter', enter);
      card.addEventListener('mouseleave', leave);
      card.addEventListener('focusin', enter);
      card.addEventListener('focusout', leave);
    });
  }

  // -------- 10. Page-hero video — slow down 25%, smooth loop, pause off-screen, prefers-reduced-motion --------
  const phVideos = document.querySelectorAll('.page-hero__video');
  if (phVideos.length) {
    phVideos.forEach((v) => {
      const setRate = () => { v.playbackRate = 0.75; };
      if (v.readyState >= 1) setRate();
      else v.addEventListener('loadedmetadata', setRate);
      // Anticipo il rewind manualmente prima del browser-native loop point
      // per evitare lo scatto pause-seek-play causato dal loop nativo con playbackRate != 1
      v.addEventListener('timeupdate', () => {
        if (v.duration && v.currentTime >= v.duration - 0.1) {
          v.currentTime = 0;
        }
      });
    });
    if (prefersReducedMotion) {
      phVideos.forEach((v) => { v.removeAttribute('autoplay'); v.pause(); });
    } else if ('IntersectionObserver' in window) {
      const phObs = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          const v = e.target;
          if (e.isIntersecting) v.play().catch(() => {});
          else v.pause();
        });
      }, { threshold: 0.1 });
      phVideos.forEach((v) => phObs.observe(v));
    }
  }

})();

/* ===== Portfolio: ticker scorrevole solo CLIENTI (light-body, solo /portfolio).
   Desktop: UNA riga, box grandi (come griglia partnership/settori).
   Mobile: DUE righe a scorrimento opposto, clienti divisi a meta' (nessun
   cliente ripetuto tra le due righe), box piccoli, velocita' dimezzata.
   Si clona solo il necessario a coprire il viewport (nastro corto, sotto il
   limite di texture). reduced-motion: griglia originale. ===== */
(function () {
  var GAP = 12, COLS_D = 5, COLS_M = 2.5;
  var SPEED_D = 120, MIN_D = 20;   // desktop: px/s, durata minima
  var SPEED_M = 60,  MIN_M = 40;   // mobile: meta' velocita' del desktop
  if (!document.body || !document.body.classList.contains('light-body')) return;
  if (!/\/portfolio(\.html)?$/i.test(location.pathname)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var desktop = window.matchMedia('(min-width: 1024px)');

  function clientGrids() {
    return Array.prototype.filter.call(
      document.querySelectorAll('.logos-grid[aria-label]'),
      function (g) { return !/partner/i.test(g.getAttribute('aria-label') || ''); }
    );
  }
  function removeClones(track) {
    Array.prototype.slice.call(track.querySelectorAll('[data-mq-clone]')).forEach(function (c) {
      c.parentNode.removeChild(c);
    });
  }
  function fillTrack(track, wrap, cols, speed, minDur) {
    removeClones(track);
    var w = wrap.clientWidth;
    if (!w) return;
    var cw = (w - (cols - 1) * GAP) / cols;
    var step = cw + GAP;
    var originals = Array.prototype.slice.call(track.children);
    var n = originals.length;
    if (!n) return;
    track.style.setProperty('--logo-cell-w', cw.toFixed(2) + 'px');
    track.style.setProperty('--logo-cell-h', (cw * 2 / 3).toFixed(2) + 'px');
    var dist = n * step;
    track.style.setProperty('--mq-dist', dist.toFixed(2) + 'px');
    track.style.animationDuration = Math.max(minDur, dist / speed).toFixed(1) + 's';
    var need = Math.ceil(w / step) + 1;
    for (var i = 0; i < need; i++) {
      var clone = originals[i % n].cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      clone.setAttribute('data-mq-clone', '');
      clone.querySelectorAll('a').forEach(function (a) { a.setAttribute('tabindex', '-1'); });
      track.appendChild(clone);
    }
  }
  function buildSingle(grid, wrap) {
    grid.classList.add('logos-marquee__track');
    wrap.appendChild(grid);
    fillTrack(grid, wrap, COLS_D, SPEED_D, MIN_D);
  }
  var PXF_M = 1; // px/frame (~60px/s a 60fps): meta' velocita', come prima
  function fillScroll(track, wrap, cols) {
    removeClones(track);
    var w = wrap.clientWidth;
    if (!w) return 0;
    var cw = (w - (cols - 1) * GAP) / cols;
    track.style.setProperty('--logo-cell-w', cw.toFixed(2) + 'px');
    track.style.setProperty('--logo-cell-h', (cw * 2 / 3).toFixed(2) + 'px');
    var originals = Array.prototype.slice.call(track.children);
    var n = originals.length;
    if (!n) return 0;
    var setW = n * (cw + GAP);
    var sets = Math.max(2, Math.ceil((w * 2) / setW) + 1);
    for (var s = 1; s < sets; s++) {
      originals.forEach(function (li) {
        var clone = li.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        clone.setAttribute('data-mq-clone', '');
        clone.querySelectorAll('a').forEach(function (a) { a.setAttribute('tabindex', '-1'); });
        track.appendChild(clone);
      });
    }
    return setW;
  }
  function startEngine(wrap, rows) {
    var paused = false, rt = null, raf = null;
    rows.forEach(function (r) { r.pos = (r.dir < 0) ? r.setW : 0; r.el.scrollLeft = r.pos; });
    function step() {
      if (!paused) {
        rows.forEach(function (r) {
          if (!r.setW) return;
          r.pos += r.dir * PXF_M;
          if (r.pos >= r.setW) r.pos -= r.setW;
          else if (r.pos < 0) r.pos += r.setW;
          r.el.scrollLeft = r.pos;
        });
      }
      raf = window.requestAnimationFrame(step);
    }
    function pause() { paused = true; if (rt) { clearTimeout(rt); rt = null; } }
    function resume() {
      if (rt) clearTimeout(rt);
      rt = setTimeout(function () {
        rows.forEach(function (r) { r.pos = r.el.scrollLeft; });
        paused = false;
      }, 1400);
    }
    rows.forEach(function (r) {
      r.el.addEventListener('touchstart', pause, { passive: true });
      r.el.addEventListener('touchend', resume, { passive: true });
      r.el.addEventListener('touchcancel', resume, { passive: true });
    });
    raf = window.requestAnimationFrame(step);
    wrap._mqEngine = {
      stop: function () {
        if (raf) window.cancelAnimationFrame(raf);
        if (rt) clearTimeout(rt);
        rows.forEach(function (r) {
          r.el.removeEventListener('touchstart', pause);
          r.el.removeEventListener('touchend', resume);
          r.el.removeEventListener('touchcancel', resume);
        });
      }
    };
  }
  function buildRows(grid, wrap) {
    wrap.classList.add('logos-marquee--rows');
    var originals = Array.prototype.slice.call(grid.children);
    var half = Math.ceil(originals.length / 2);
    var row1 = document.createElement('div'); row1.className = 'logos-marquee__row';
    var row2 = document.createElement('div'); row2.className = 'logos-marquee__row';
    var track2 = document.createElement('ul');
    track2.className = 'logos-grid logos-marquee__track logos-marquee__track--rev';
    track2.setAttribute('data-mq-row2', '');
    originals.slice(half).forEach(function (li) { track2.appendChild(li); });
    grid.classList.add('logos-marquee__track');
    row1.appendChild(grid);
    row2.appendChild(track2);
    wrap.appendChild(row1);
    wrap.appendChild(row2);
    var sw1 = fillScroll(grid, wrap, COLS_M);
    var sw2 = fillScroll(track2, wrap, COLS_M);
    startEngine(wrap, [
      { el: row1, dir: 1, setW: sw1, pos: 0 },
      { el: row2, dir: -1, setW: sw2, pos: 0 }
    ]);
  }
  function build(grid) {
    if (grid.closest('.logos-marquee')) return;
    grid.classList.add('is-in'); // la grid ha .reveal (opacity:0): garantiamo la visibilita'
    var wrap = document.createElement('div');
    wrap.className = 'logos-marquee';
    grid.parentNode.insertBefore(wrap, grid);
    if (desktop.matches) buildSingle(grid, wrap);
    else buildRows(grid, wrap);
  }
  function teardown(grid) {
    var wrap = grid.closest('.logos-marquee');
    if (!wrap) return;
    if (wrap._mqEngine) { wrap._mqEngine.stop(); wrap._mqEngine = null; }
    removeClones(grid);
    var t2 = wrap.querySelector('[data-mq-row2]');
    if (t2) {
      removeClones(t2);
      Array.prototype.slice.call(t2.children).forEach(function (li) { grid.appendChild(li); });
    }
    grid.classList.remove('logos-marquee__track');
    ['--logo-cell-w', '--logo-cell-h', '--mq-dist'].forEach(function (p) { grid.style.removeProperty(p); });
    grid.style.animationDuration = '';
    grid.style.animation = '';
    wrap.parentNode.insertBefore(grid, wrap);
    wrap.parentNode.removeChild(wrap);
  }
  function apply() {
    clientGrids().forEach(function (grid) {
      teardown(grid);
      build(grid);
    });
  }
  function init() {
    apply();
    if (desktop.addEventListener) desktop.addEventListener('change', apply);
    else if (desktop.addListener) desktop.addListener(apply);
    var rt;
    window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(apply, 200); });
  }
  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);
})();

/* ===== Case study (home): su mobile/touch i video partono quando entrano in
   vista e si fermano quando escono (desktop usa l'hover, gestito sopra).
   preload=metadata: il file si carica solo quando serve. Rispetta reduced-motion. ===== */
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  if (!('IntersectionObserver' in window)) return;
  function init() {
    var vids = document.querySelectorAll('.case--has-video .case__video');
    if (!vids.length) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var v = e.target;
        if (e.isIntersecting) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
        else { v.pause(); }
      });
    }, { threshold: 0.6 });
    vids.forEach(function (v) { io.observe(v); });
  }
  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);
})();
