/* ==========================================================================
   Live GitHub stats

   Pages ship hand-written star/fork counts so they render correctly with
   JavaScript off or the API unreachable; this refreshes them in the browser,
   which is what keeps the deployed site current without a rebuild.

   Two things keep us inside GitHub's unauthenticated limits: one search
   request covers every repo on the page no matter how many there are, and a
   short-lived cache means a visitor clicking between pages only pays for the
   first one.
   ========================================================================== */

const CACHE_KEY = 'repo-stats-v1';
const CACHE_TTL = 15 * 60 * 1000;

function format(n) {
  if (n < 1000) return String(n);
  const k = n / 1000;
  // 4.5k reads better than 5k; 47k reads better than 47.0k
  return (k >= 10 ? Math.round(k) : k.toFixed(1).replace(/\.0$/, '')) + 'k';
}

function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { at, data } = JSON.parse(raw);
    return Date.now() - at < CACHE_TTL ? data : null;
  } catch {
    return null;
  }
}

function writeCache(data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), data }));
  } catch {
    /* Private mode or a full quota - the fetch still worked, skip caching. */
  }
}

function paint(nodes, data) {
  nodes.forEach(node => {
    const entry = data[node.dataset.repo.toLowerCase()];
    if (!entry) return;
    const stars = node.querySelector('[data-stat="stars"]');
    const forks = node.querySelector('[data-stat="forks"]');
    if (stars) stars.textContent = format(entry.stars);
    if (forks) forks.textContent = format(entry.forks);
  });
}

export function initRepoStats() {
  const nodes = document.querySelectorAll('[data-repo]');
  if (!nodes.length) return;

  const repos = [...new Set([...nodes].map(n => n.dataset.repo))];

  const cached = readCache();
  if (cached && repos.every(r => cached[r.toLowerCase()])) {
    paint(nodes, cached);
    return;
  }

  const query = repos.map(r => `repo:${r}`).join('+');
  const url = `https://api.github.com/search/repositories?q=${query}&per_page=${repos.length}`;

  fetch(url)
    .then(res => (res.ok ? res.json() : Promise.reject(new Error(res.status))))
    .then(payload => {
      const data = {};
      (payload.items || []).forEach(item => {
        data[item.full_name.toLowerCase()] = {
          stars: item.stargazers_count,
          forks: item.forks_count,
        };
      });
      paint(nodes, data);
      writeCache(data);
    })
    .catch(() => {
      /* Rate-limited or offline - the numbers baked into the HTML stay. */
    });
}
