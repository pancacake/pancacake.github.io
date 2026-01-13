/* ==========================================================================
   Academic Homepage - JavaScript Interactions
   ========================================================================== */

(function() {
  'use strict';

  // ==========================================================================
  // Theme Toggle (Light/Dark)
  // ==========================================================================
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  
  // Check for saved theme preference or default to light
  function getPreferredTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme;
    }
    // Default to light theme
    return 'light';
  }
  
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
  
  // Initialize theme
  setTheme(getPreferredTheme());
  
  // Theme toggle click handler
  if (themeToggle) {
    themeToggle.addEventListener('click', function() {
      const currentTheme = document.documentElement.classList.contains('dark-theme') ? 'dark' : 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
    });
  }

  // ==========================================================================
  // Mobile Navigation Toggle
  // ==========================================================================
  const navToggle = document.querySelector('.nav-toggle');
  const visibleLinks = document.querySelector('.visible-links');
  const hiddenLinks = document.querySelector('.hidden-links');

  if (navToggle && visibleLinks) {
    navToggle.addEventListener('click', function(e) {
      e.preventDefault();
      visibleLinks.classList.toggle('show');
      
      // Toggle aria-expanded for accessibility
      const isExpanded = visibleLinks.classList.contains('show');
      navToggle.setAttribute('aria-expanded', isExpanded);
    });
  }

  // Close mobile nav when clicking outside
  document.addEventListener('click', function(e) {
    if (visibleLinks && visibleLinks.classList.contains('show')) {
      if (!e.target.closest('.greedy-nav')) {
        visibleLinks.classList.remove('show');
        if (navToggle) {
          navToggle.setAttribute('aria-expanded', 'false');
        }
      }
    }
  });

  // ==========================================================================
  // Smooth Scrolling with Offset
  // ==========================================================================
  const scrollOffset = 80; // Account for sticky header

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        e.preventDefault();
        
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = targetPosition - scrollOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
        
        // Close mobile nav if open
        if (visibleLinks && visibleLinks.classList.contains('show')) {
          visibleLinks.classList.remove('show');
          if (navToggle) {
            navToggle.setAttribute('aria-expanded', 'false');
          }
        }
        
        // Update URL hash without jumping
        history.pushState(null, null, targetId);
      }
    });
  });

  // ==========================================================================
  // Active Navigation Link Highlighting
  // ==========================================================================
  const sections = document.querySelectorAll('h1[id], .anchor[id]');
  const navLinks = document.querySelectorAll('.visible-links a[href^="#"]');

  function highlightNavLink() {
    const scrollPosition = window.scrollY + scrollOffset + 50;
    
    let currentSection = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionId = section.getAttribute('id');
      
      if (scrollPosition >= sectionTop) {
        currentSection = sectionId;
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === '#' + currentSection) {
        link.classList.add('active');
      }
    });
    
    // Default to first link if at top
    if (window.scrollY < 100 && navLinks.length > 0) {
      navLinks.forEach(link => link.classList.remove('active'));
      navLinks[0].classList.add('active');
    }
  }

  window.addEventListener('scroll', highlightNavLink);
  document.addEventListener('DOMContentLoaded', highlightNavLink);

  // ==========================================================================
  // Greedy Navigation (Priority+ Pattern)
  // ==========================================================================
  function setupGreedyNav() {
    const nav = document.querySelector('.greedy-nav');
    if (!nav) return;
    
    const visible = nav.querySelector('.visible-links');
    const hidden = nav.querySelector('.hidden-links');
    const toggle = nav.querySelector('.nav-toggle');
    
    if (!visible || !hidden) return;
    
    // Only apply greedy nav on larger screens
    if (window.innerWidth <= 768) return;
    
    const availableSpace = nav.offsetWidth - 50; // Reserve space for toggle
    let totalWidth = 0;
    const visibleItems = visible.querySelectorAll('li');
    
    visibleItems.forEach((item, index) => {
      totalWidth += item.offsetWidth;
      
      if (totalWidth > availableSpace && index > 0) {
        // Move overflow items to hidden menu
        hidden.appendChild(item.cloneNode(true));
        item.style.display = 'none';
        hidden.classList.remove('hidden');
        if (toggle) toggle.style.display = 'block';
      }
    });
  }

  // Run on load and resize
  window.addEventListener('load', setupGreedyNav);
  window.addEventListener('resize', debounce(function() {
    // Reset and recalculate
    const hidden = document.querySelector('.hidden-links');
    const visible = document.querySelector('.visible-links');
    
    if (hidden && visible) {
      hidden.innerHTML = '';
      hidden.classList.add('hidden');
      visible.querySelectorAll('li').forEach(item => {
        item.style.display = '';
      });
    }
    
    setupGreedyNav();
  }, 250));

  // ==========================================================================
  // Utility Functions
  // ==========================================================================
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // ==========================================================================
  // Scroll Reveal Animation
  // ==========================================================================
  function setupScrollReveal() {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe paper boxes and sections
    document.querySelectorAll('.paper-box, h1').forEach(el => {
      el.classList.add('reveal-on-scroll');
      observer.observe(el);
    });
  }

  // Add reveal styles dynamically
  const style = document.createElement('style');
  style.textContent = `
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
  document.head.appendChild(style);

  document.addEventListener('DOMContentLoaded', setupScrollReveal);

  // ==========================================================================
  // Console Easter Egg
  // ==========================================================================
  console.log(
    '%c👋 Hello! %c\n\nWelcome to my academic homepage!\nInterested in AI research? Let\'s connect!\n\n📧 23721035@bjtu.edu.cn\n🐙 github.com/pancacake\n',
    'font-size: 20px; font-weight: bold; color: #224b8d;',
    'font-size: 14px; color: #494e52;'
  );

  // ==========================================================================
  // Handle Initial Hash in URL
  // ==========================================================================
  if (window.location.hash) {
    setTimeout(() => {
      const target = document.querySelector(window.location.hash);
      if (target) {
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = targetPosition - scrollOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, 100);
  }

})();
