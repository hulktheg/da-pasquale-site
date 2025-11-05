// Jahr im Footer
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Mobile Menü (wir greifen nur auf CSS-Klasse zu; Desktop bleibt unberührt)
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
