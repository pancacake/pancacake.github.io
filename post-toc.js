/* ==========================================================================
   Post table of contents
   Builds the sidebar index from the post's own headings and tracks which
   section is on screen. Ids are slugs rather than indices so an anchor stays
   valid when a section is added or reordered.
   ========================================================================== */

const SCROLL_OFFSET = 80; // clears the sticky masthead

function slug(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

export function initPostToc() {
  const toc = document.getElementById('post-toc');
  if (!toc) return;

  const headings = [...document.querySelectorAll('.page__content h2, .page__content h3')];
  if (headings.length < 3) {
    toc.remove();
    return;
  }

  const used = new Set();
  const links = headings.map(h => {
    let id = h.id || slug(h.textContent);
    while (used.has(id)) id += '-2';
    used.add(id);
    h.id = id;

    const a = document.createElement('a');
    a.href = `#${id}`;
    a.textContent = h.textContent.trim();
    a.className = h.tagName === 'H3' ? 'toc-h3' : 'toc-h2';
    a.addEventListener('click', e => {
      e.preventDefault();
      window.scrollTo({
        top: h.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET,
        behavior: 'smooth',
      });
      history.replaceState(null, '', `#${id}`);
    });
    return a;
  });

  const title = document.createElement('p');
  title.className = 'post-toc__title';
  title.textContent = 'Contents';
  toc.append(title, ...links);

  // Track the heading nearest the top of the viewport rather than the first
  // one intersecting, so scrolling back up highlights the section you land in.
  const byId = new Map(links.map(a => [a.getAttribute('href').slice(1), a]));
  let active = null;

  const sync = () => {
    let current = headings[0];
    for (const h of headings) {
      if (h.getBoundingClientRect().top - SCROLL_OFFSET - 20 <= 0) current = h;
      else break;
    }
    const link = byId.get(current.id);
    if (link === active) return;
    if (active) active.classList.remove('is-active');
    link.classList.add('is-active');
    active = link;
  };

  let queued = false;
  const onScroll = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      sync();
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  sync();
}
