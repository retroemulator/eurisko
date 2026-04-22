// ============================================
// Eurisko — Shared interactions (vanilla JS)
// Tutto è opzionale: il sito funziona anche senza JavaScript.
// ============================================

// 1. Navbar scroll state
const nav = document.querySelector('.nav');
if (nav) {
  const onScroll = () => {
    if (window.scrollY > 24) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// 2. Mobile burger
const burger = document.querySelector('.nav__burger');
if (burger && nav) {
  burger.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    burger.setAttribute('aria-expanded', String(isOpen));
    burger.setAttribute('aria-label', isOpen ? 'Chiudi menu di navigazione' : 'Apri menu di navigazione');
  });
  // Esc chiude il menu mobile
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('open')) {
      nav.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      burger.focus();
    }
  });
}

// 3. Scroll-reveal on intersection (rispetta prefers-reduced-motion)
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

// 4. Marquee: duplicate track for seamless loop
document.querySelectorAll('.marquee__track').forEach((track) => {
  track.innerHTML += track.innerHTML;
});

// 5. Current year in footer
document.querySelectorAll('[data-year]').forEach((el) => {
  el.textContent = new Date().getFullYear();
});

// 6. Form contatti — validazione lato client (graceful, l'HTML5 required basta senza JS)
const contactForm = document.querySelector('form.contact');
if (contactForm) {
  const lang = document.documentElement.lang || 'it';
  const t = lang.startsWith('en')
    ? {
        required: 'This field is required.',
        email: 'Please enter a valid email address.',
        minlength: (n) => `Please enter at least ${n} characters.`,
        privacy: 'You must accept the privacy policy.',
        sending: 'Sending…',
        error: 'Submission failed. Please try again or write to info@euriskosrl.it.',
      }
    : {
        required: 'Questo campo è obbligatorio.',
        email: 'Inserisci un indirizzo email valido.',
        minlength: (n) => `Inserisci almeno ${n} caratteri.`,
        privacy: 'Devi accettare la privacy policy.',
        sending: 'Invio in corso…',
        error: "Invio fallito. Riprova o scrivi a info@euriskosrl.it.",
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
    if (field.hasAttribute('required') && !value) {
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

  // On blur: validazione singolo campo
  contactForm.querySelectorAll('input, textarea, select').forEach((field) => {
    if (field.type === 'hidden' || field.name === '_gotcha') return;
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      if (field.getAttribute('aria-invalid') === 'true') validateField(field);
    });
  });

  // Submit: validazione totale
  contactForm.addEventListener('submit', (e) => {
    let allValid = true;
    let firstInvalid = null;
    contactForm.querySelectorAll('input, textarea, select').forEach((field) => {
      if (field.type === 'hidden' || field.name === '_gotcha') return;
      if (field.type === 'checkbox' && field.required) {
        if (!field.checked) {
          showError(field.parentElement.querySelector('input'), t.privacy);
          // applica il msg anche al label
          const errorEl = document.getElementById(field.id + '-error');
          if (errorEl) {
            errorEl.textContent = t.privacy;
            errorEl.hidden = false;
          } else {
            // fallback: aggiunge un piccolo messaggio inline
            setStatus(t.privacy, 'error');
          }
          allValid = false;
          if (!firstInvalid) firstInvalid = field;
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
