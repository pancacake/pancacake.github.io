/* ==========================================================================
   Academic Homepage - JavaScript Interactions (ES Module)
   ========================================================================== */

import { initLayout } from './components.js';

// Apply saved theme immediately before layout injection to prevent flash
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  document.documentElement.classList.add('dark-theme');
}

// Inject shared layout (masthead, sidebar, footer) + load external scripts
initLayout();

// ==========================================================================
// Theme Toggle (Light/Dark)
// ==========================================================================
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');

function setTheme(theme) {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark-theme');
    if (themeIcon) {
      themeIcon.classList.remove('fa-sun');
      themeIcon.classList.add('fa-moon');
    }
  } else {
    document.documentElement.classList.remove('dark-theme');
    if (themeIcon) {
      themeIcon.classList.remove('fa-moon');
      themeIcon.classList.add('fa-sun');
    }
  }
  localStorage.setItem('theme', theme);
}

// Sync icon with current theme state
setTheme(savedTheme || 'light');

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.classList.contains('dark-theme') ? 'dark' : 'light';
    setTheme(current === 'dark' ? 'light' : 'dark');
  });
}

// ==========================================================================
// Mobile Navigation Toggle
// ==========================================================================
const navToggle = document.querySelector('.nav-toggle');
const visibleLinks = document.querySelector('.visible-links');

if (navToggle && visibleLinks) {
  navToggle.addEventListener('click', (e) => {
    e.preventDefault();
    visibleLinks.classList.toggle('show');
    navToggle.setAttribute('aria-expanded', visibleLinks.classList.contains('show'));
  });
}

document.addEventListener('click', (e) => {
  if (visibleLinks && visibleLinks.classList.contains('show')) {
    if (!e.target.closest('.greedy-nav')) {
      visibleLinks.classList.remove('show');
      if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
    }
  }
});

// ==========================================================================
// Greedy Navigation (Priority+ Pattern)
// ==========================================================================
function debounce(func, wait) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

function setupGreedyNav() {
  const nav = document.querySelector('.greedy-nav');
  if (!nav) return;

  const visible = nav.querySelector('.visible-links');
  const hidden = nav.querySelector('.hidden-links');
  const toggle = nav.querySelector('.nav-toggle');

  if (!visible || !hidden || window.innerWidth <= 768) return;

  const availableSpace = nav.offsetWidth;
  let totalWidth = 0;
  const visibleItems = visible.querySelectorAll('li');

  visibleItems.forEach((item, index) => {
    totalWidth += item.offsetWidth;
    if (totalWidth > availableSpace && index > 0) {
      hidden.appendChild(item.cloneNode(true));
      item.style.display = 'none';
      hidden.classList.remove('hidden');
      if (toggle) toggle.style.display = 'block';
    }
  });
}

window.addEventListener('load', setupGreedyNav);
window.addEventListener('resize', debounce(() => {
  const hidden = document.querySelector('.hidden-links');
  const visible = document.querySelector('.visible-links');
  if (hidden && visible) {
    hidden.innerHTML = '';
    hidden.classList.add('hidden');
    visible.querySelectorAll('li').forEach(item => { item.style.display = ''; });
  }
  setupGreedyNav();
}, 250));

// ==========================================================================
// Scroll Reveal Animation
// ==========================================================================
const revealStyle = document.createElement('style');
revealStyle.textContent = `
  .reveal-on-scroll {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.6s ease, transform 0.6s ease;
  }
  .reveal-on-scroll.revealed {
    opacity: 1;
    transform: translateY(0);
  }
`;
document.head.appendChild(revealStyle);

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.paper-box, h1, .opensource-item').forEach(el => {
  el.classList.add('reveal-on-scroll');
  observer.observe(el);
});

// ==========================================================================
// Console Easter Egg
// ==========================================================================
console.log(
  '%c👋 Hello! %c\n\nWelcome to my academic homepage!\nInterested in AI research? Let\'s connect!\n\n📧 bingxizhao39@gmail.com\n🐙 github.com/pancacake\n',
  'font-size: 20px; font-weight: bold; color: #224b8d;',
  'font-size: 14px; color: #494e52;'
);
