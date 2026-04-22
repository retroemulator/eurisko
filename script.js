// ============================================
// Eurisko — Shared interactions
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
    nav.classList.toggle('open');
    const expanded = nav.classList.contains('open');
    burger.setAttribute('aria-expanded', expanded);
  });
}

// 3. Scroll-reveal on intersection
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && revealEls.length) {
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
