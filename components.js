/* ==========================================================================
   Shared Layout Components
   Renders masthead, sidebar, footer shared across all pages.
   ========================================================================== */

function getCurrentPage() {
  let path = window.location.pathname;
  if (path.endsWith('/')) path = path.slice(0, -1);
  if (path === '' || path.endsWith('/index.html')) return '/';
  return path;
}

export function renderMasthead() {
  const current = getCurrentPage();
  const items = [
    { label: 'Home', href: '/', lg: true, icon: 'fas fa-home' },
    { label: 'Open-source', href: '/open-source.html', icon: 'fab fa-github' },
    { label: 'Publications', href: '/publications.html', icon: 'fas fa-file-alt' },
    { label: 'Honors', href: '/honors.html', icon: 'fas fa-award' },
    { label: 'Experiences', href: '/experiences.html', icon: 'fas fa-briefcase' },
  ];

  const links = items.map(item => {
    const isActive = (item.href === '/' && current === '/') ||
                     (item.href !== '/' && current === item.href);
    const cls = item.lg
      ? 'masthead__menu-item masthead__menu-item--lg'
      : 'masthead__menu-item';
    return `<li class="${cls}"><a href="${item.href}"${isActive ? ' class="active"' : ''}><i class="${item.icon}"></i>${item.label}</a></li>`;
  }).join('');

  return `<div class="masthead">
    <div class="masthead__inner-wrap">
      <div class="masthead__menu">
        <nav id="site-nav" class="greedy-nav">
          <button class="nav-toggle" aria-label="Toggle navigation">
            <div class="navicon"></div>
          </button>
          <ul class="visible-links">${links}</ul>
          <ul class="hidden-links hidden"></ul>
        </nav>
        <div class="control-buttons">
          <button id="theme-toggle" class="control-btn" aria-label="Toggle theme" title="Toggle theme">
            <i class="fas fa-sun" id="theme-icon"></i>
          </button>
        </div>
      </div>
    </div>
  </div>`;
}

export function renderSidebar() {
  if (getCurrentPage() !== '/') return '';

  return `<div class="sidebar">
    <div class="profile_box" itemscope itemtype="http://schema.org/Person">
      <div class="author__avatar">
        <img src="/figs/profile.jpg" alt="Bingxi Zhao" class="author__avatar">
      </div>
      <div class="author__content">
        <h3 class="author__name">Bingxi Zhao</h3>
        <p class="author__bio">Frank</p>
      </div>
      <div class="author__urls-wrapper">
        <ul class="author__urls social-icons">
          <li><i class="fas fa-fw fa-map-marker-alt" aria-hidden="true"></i> Beijing, China</li>
          <li><a href="mailto:bingxizhao39@gmail.com"><i class="fas fa-fw fa-envelope" aria-hidden="true"></i> Email</a></li>
          <li><a href="https://github.com/pancacake" target="_blank"><i class="fab fa-fw fa-github" aria-hidden="true"></i> Github</a></li>
          <li><a href="https://scholar.google.com/citations?user=-844YT0AAAAJ&hl=zh-CN" target="_blank"><i class="fas fa-fw fa-graduation-cap" aria-hidden="true"></i> Google Scholar</a></li>
        </ul>
        <div class="author__urls_sm">
          <a href="mailto:bingxizhao39@gmail.com"><i class="fas fa-fw fa-envelope"></i></a>
          <a href="https://github.com/pancacake" target="_blank"><i class="fab fa-fw fa-github"></i></a>
          <a href="https://scholar.google.com/citations?user=-844YT0AAAAJ&hl=zh-CN" target="_blank"><i class="fas fa-fw fa-graduation-cap"></i></a>
        </div>
      </div>
    </div>
    <div class="globe-container" id="globe-container"></div>
  </div>`;
}

export function renderFooter() {
  const isHome = getCurrentPage() === '/';
  const pvHtml = isHome
    ? `<p class="visitor-count"><i class="fas fa-eye"></i> Page views: <span id="busuanzi_value_page_pv">--</span></p>`
    : '';

  return `<footer class="page__footer">
    <div class="page__footer-content">
      <p>© 2026 Bingxi Zhao · Last updated: May 2026</p>
      ${pvHtml}
    </div>
  </footer>`;
}

export function initLayout() {
  const masthead = document.getElementById('masthead-container');
  const sidebar = document.getElementById('sidebar-container');
  const footer = document.getElementById('footer-container');

  if (masthead) masthead.outerHTML = renderMasthead();
  if (sidebar) {
    const sidebarHtml = renderSidebar();
    if (sidebarHtml) {
      sidebar.outerHTML = sidebarHtml;
    } else {
      sidebar.remove();
      document.getElementById('main')?.classList.add('no-sidebar');
    }
  }
  if (footer) footer.outerHTML = renderFooter();

  loadExternalScripts();
}

function loadExternalScripts() {
  const isHome = getCurrentPage() === '/';

  if (isHome) {
    const bs = document.createElement('script');
    bs.src = '//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js';
    bs.async = true;
    document.body.appendChild(bs);
  }

  const gc = document.getElementById('globe-container');
  if (gc) {
    const gs = document.createElement('script');
    gs.type = 'text/javascript';
    gs.id = 'clstr_globe';
    gs.src = '//clustrmaps.com/globe.js?d=Vv68Mj15jzD70lhzgY-DSkCaXBRXohx2t2tIe7SJ5Xo';
    gc.appendChild(gs);
  }
}
