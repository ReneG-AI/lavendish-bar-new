(() => {
  'use strict';

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const header = document.querySelector('[data-header]');
  const sentinel = document.querySelector('[data-header-sentinel]');

  if (header && sentinel && 'IntersectionObserver' in window) {
    new IntersectionObserver(
      ([entry]) => header.classList.toggle('is-compact', !entry.isIntersecting),
      { threshold: 0 }
    ).observe(sentinel);
  }

  // Smooth only deliberate anchor navigation. Never repositions the page
  // automatically while the user is scrolling.
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;

    const id = link.getAttribute('href').slice(1);
    if (!id) return;

    const target = document.getElementById(id);
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({
      behavior: reduced ? 'auto' : 'smooth',
      block: 'start'
    });

    if (history.replaceState) {
      history.replaceState(null, '', `#${id}`);
    }
  });
})();
