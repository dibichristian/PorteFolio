// ============ Preferences mouvement reduit ============
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ============ Theme toggle (persiste dans localStorage) ============
const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');

const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  root.setAttribute('data-theme', savedTheme);
  themeToggle.textContent = savedTheme === 'light' ? '☀️' : '🌙';
}

themeToggle.addEventListener('click', () => {
  const isLight = root.getAttribute('data-theme') === 'light';
  const next = isLight ? 'dark' : 'light';
  root.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  themeToggle.textContent = next === 'light' ? '☀️' : '🌙';
});

// ============ Menu burger (mobile) ============
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
burger.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach((link) =>
  link.addEventListener('click', () => navLinks.classList.remove('open'))
);

// ============ Barre de progression scroll ============
const progress = document.getElementById('scrollProgress');
const onScroll = () => {
  const h = document.documentElement;
  const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
  progress.style.width = pct + '%';
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ============ Reveal au scroll (avec cascade) ============
const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
if (reduceMotion) {
  revealEls.forEach((el) => el.classList.add('in'));
} else {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14, rootMargin: '0px 0px -40px 0px' }
  );
  revealEls.forEach((el) => io.observe(el));
}

// ============ Effet machine a ecrire (roles) ============
const roles = [
  'Developpeur Python & Odoo',
  'Ingenieur DevOps',
  'Specialiste ERP',
  'Automatisation & CI/CD',
];
const twEl = document.getElementById('typewriter');
if (twEl) {
  if (reduceMotion) {
    twEl.textContent = roles[0];
  } else {
    let ri = 0, ci = 0, deleting = false;
    const type = () => {
      const word = roles[ri];
      twEl.textContent = word.slice(0, ci);
      if (!deleting && ci < word.length) {
        ci++;
        setTimeout(type, 75);
      } else if (!deleting && ci === word.length) {
        deleting = true;
        setTimeout(type, 1600);
      } else if (deleting && ci > 0) {
        ci--;
        setTimeout(type, 38);
      } else {
        deleting = false;
        ri = (ri + 1) % roles.length;
        setTimeout(type, 300);
      }
    };
    type();
  }
}

// ============ Compteurs animes ============
const counters = document.querySelectorAll('.stat__num');
const animateCount = (el) => {
  const target = parseInt(el.dataset.count, 10);
  const suffix = el.dataset.suffix || '';
  if (reduceMotion) { el.textContent = target + suffix; return; }
  const dur = 1400;
  const start = performance.now();
  const step = (now) => {
    const p = Math.min((now - start) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(target * eased) + suffix;
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
};
const countIO = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        countIO.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.6 }
);
counters.forEach((c) => countIO.observe(c));

// ============ Glow curseur + tilt 3D (desktop, souris fine) ============
const finePointer = window.matchMedia('(pointer: fine)').matches;
if (finePointer && !reduceMotion) {
  const glow = document.getElementById('cursorGlow');
  window.addEventListener('mousemove', (e) => {
    glow.style.opacity = '1';
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  });
  window.addEventListener('mouseleave', () => (glow.style.opacity = '0'));

  document.querySelectorAll('.tilt').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const rx = ((y / r.height) - 0.5) * -7;
      const ry = ((x / r.width) - 0.5) * 7;
      card.style.transition = 'transform 0.08s ease-out';
      card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
      card.style.setProperty('--mx', x + 'px');
      card.style.setProperty('--my', y + 'px');
    });
    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.4s ease';
      card.style.transform = '';
    });
  });
}
