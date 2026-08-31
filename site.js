(() => {
  'use strict';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const header = document.querySelector('[data-header]');
  const sentinel = document.querySelector('[data-header-sentinel]');
  if (header && sentinel && 'IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => header.classList.toggle('is-compact', !entry.isIntersecting), {threshold:0}).observe(sentinel);
  }

  const links = [...document.querySelectorAll('[data-category-link]')];
  const sections = [...document.querySelectorAll('[data-menu-section]')];
  if (links.length && sections.length && 'IntersectionObserver' in window) {
    const map = new Map(links.map(link => [link.getAttribute('href').slice(1), link]));
    const io = new IntersectionObserver(entries => {
      const visible = entries.filter(e => e.isIntersecting).sort((a,b) => Math.abs(a.boundingClientRect.top)-Math.abs(b.boundingClientRect.top));
      if (!visible.length) return;
      const id = visible[0].target.id;
      links.forEach(link => link.removeAttribute('aria-current'));
      const active = map.get(id);
      if (active) {
        active.setAttribute('aria-current','true');
        active.scrollIntoView({behavior: reduced ? 'auto' : 'smooth', block:'nearest', inline:'center'});
      }
    }, {rootMargin:'-28% 0px -58% 0px', threshold:0});
    sections.forEach(section => io.observe(section));
  }

  const reveal = document.querySelector('[data-reveal]');
  if (reveal) {
    if (reduced || !('IntersectionObserver' in window)) reveal.classList.add('is-visible');
    else new IntersectionObserver(([entry], obs) => { if(entry.isIntersecting){ entry.target.classList.add('is-visible'); obs.disconnect(); } }, {threshold:.18}).observe(reveal);
  }
})();