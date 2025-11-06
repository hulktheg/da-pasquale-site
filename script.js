// Jahr im Footer
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Mobile Menü
const nav = document.querySelector('.nav');
const toggle = document.querySelector('.menu-toggle');
const links = document.getElementById('nav-links');

if (toggle && nav && links) {
  const closeMenu = () => {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  };
  toggle.addEventListener('click', () => {
    const open = !nav.classList.contains('open');
    nav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
  });
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  window.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
}

// Reservierungsformular (Demo)
const form = document.getElementById('reserveForm');
const msg = document.getElementById('reserveMsg');
if (form && msg) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const date = data.get('date');
    const time = data.get('time');
    const people = data.get('people');
    const name = data.get('name');
    const phone = data.get('phone');

    if (!date || !time || !people || !name || !phone) {
      msg.textContent = 'Bitte alle Felder ausfüllen.';
      msg.style.color = '#b45309';
      return;
    }
    msg.textContent = `Danke, ${name}! Wir prüfen Ihre Anfrage am ${date} um ${time} für ${people} Personen und melden uns telefonisch.`;
    msg.style.color = '#166534';
    form.reset();
  });
}

// ===== Carousel mit Autoplay + smarter Swipe =====
(() => {
  const carousel = document.querySelector('.carousel');
  if (!carousel) return;

  const track = carousel.querySelector('.car-track');
  const slides = Array.from(carousel.querySelectorAll('.car-slide'));
  const btnPrev = carousel.querySelector('.car-btn.prev');
  const btnNext = carousel.querySelector('.car-btn.next');
  const dots = Array.from(carousel.querySelectorAll('.car-dot'));

  let index = 0;
  const AUTOPLAY_MS = 4000;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let timer = null;

  const update = (i) => {
    index = (i + slides.length) % slides.length;
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, j) => {
      d.classList.toggle('is-active', j === index);
      d.setAttribute('aria-selected', String(j === index));
    });
  };
  const stop = () => { if (timer) clearInterval(timer); timer = null; };
  const start = () => { if (!prefersReduced) { stop(); timer = setInterval(() => update(index + 1), AUTOPLAY_MS); } };

  // Buttons
  btnPrev?.addEventListener('click', () => { update(index - 1); start(); });
  btnNext?.addEventListener('click', () => { update(index + 1); start(); });
  dots.forEach((d, i) => d.addEventListener('click', () => { update(i); start(); }));

  // Keyboard (wenn Carousel fokussiert)
  carousel.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { update(index - 1); start(); }
    if (e.key === 'ArrowRight'){ update(index + 1); start(); }
  });

  // Touch: nur horizontale Swipes auswerten
  let sx = 0, sy = 0, dx = 0, dy = 0, touching = false;
  const SWIPE_THRESHOLD = 50;

  const onStart = (x, y) => { touching = true; sx = x; sy = y; dx = 0; dy = 0; stop(); };
  const onMove  = (x, y) => { if (!touching) return; dx = x - sx; dy = y - sy; };
  const onEnd   = () => {
    if (!touching) return;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > SWIPE_THRESHOLD) {
      update(index + (dx < 0 ? 1 : -1));
      start();
    } else {
      start();
    }
    touching = false; sx = sy = dx = dy = 0;
  };

  track.addEventListener('touchstart', (e) => onStart(e.touches[0].clientX, e.touches[0].clientY), {passive:true});
  track.addEventListener('touchmove',  (e) => onMove(e.touches[0].clientX,  e.touches[0].clientY),  {passive:true});
  track.addEventListener('touchend',   onEnd, {passive:true});

  // Pause bei Hover/Focus + Tab unsichtbar
  carousel.addEventListener('mouseenter', stop);
  carousel.addEventListener('mouseleave', start);
  carousel.addEventListener('focusin', stop);
  carousel.addEventListener('focusout', start);
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));

  update(0);
  start();
})();

// --- Google-Map-Interaktion aktivieren (unter Kontakt) ---
(() => {
  const card = document.querySelector('.map-card');
  if (!card) return;
  let timer;
  const activate = () => {
    card.classList.add('active');
    clearTimeout(timer);
    timer = setTimeout(() => card.classList.remove('active'), 8000);
  };
  const deactivate = () => card.classList.remove('active');
  card.addEventListener('click', activate);
  card.addEventListener('touchstart', activate, {passive:true});
  card.addEventListener('mouseleave', deactivate);
})();
