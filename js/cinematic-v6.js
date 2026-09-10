(() => {
  'use strict';

  const root = document.querySelector('[data-cinematic-v6]');
  if (!root) return;

  const durationMs = 2550;
  const preloadBudgetMs = 900;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const params = new URLSearchParams(window.location.search);
  const forceReplay = params.get('replay') === '1';
  const sessionKey = 'lavendish-cinematic-v6-seen';
  const drink = root.querySelector('.c6-drink');

  let settled = false;
  let finishTimer = 0;
  let drinkMotion = null;

  const hasSeen = (() => {
    if (forceReplay) return false;
    try {
      return window.sessionStorage.getItem(sessionKey) === '1';
    } catch {
      return false;
    }
  })();

  const remember = () => {
    if (forceReplay) return;
    try {
      window.sessionStorage.setItem(sessionKey, '1');
    } catch {
      // Storage is an enhancement only. Never block the experience.
    }
  };

  const stopDrinkMotion = () => {
    if (!drinkMotion) return;
    drinkMotion.cancel();
    drinkMotion = null;
  };

  const settle = () => {
    if (settled) return;
    settled = true;
    window.clearTimeout(finishTimer);
    stopDrinkMotion();
    root.classList.remove('is-loading', 'is-playing');
    root.classList.add('is-complete');
    root.setAttribute('data-state', 'complete');
    remember();
  };

  const onUserIntent = () => settle();

  const bindIntentExit = () => {
    const passive = { passive: true, once: true };
    window.addEventListener('wheel', onUserIntent, passive);
    window.addEventListener('touchstart', onUserIntent, passive);
    window.addEventListener('pointerdown', onUserIntent, passive);
    window.addEventListener('keydown', onUserIntent, { once: true });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) settle();
    }, { once: true });
  };

  const waitForImage = (image) => {
    if (image.complete) {
      if (image.naturalWidth === 0) return Promise.resolve(false);
      return image.decode ? image.decode().then(() => true).catch(() => true) : Promise.resolve(true);
    }

    return new Promise((resolve) => {
      const loaded = () => resolve(image.naturalWidth > 0);
      image.addEventListener('load', loaded, { once: true });
      image.addEventListener('error', () => resolve(false), { once: true });
    });
  };

  const startDrinkMotion = () => {
    if (!drink || typeof drink.animate !== 'function' || reducedMotion) return;

    drinkMotion = drink.animate([
      {
        transform: 'translate3d(-1px, 4px, 0) scale(.988)',
        transformOrigin: '50% 62%'
      },
      {
        offset: 0.46,
        transform: 'translate3d(1px, -2px, 0) scale(1.004)',
        transformOrigin: '50% 62%'
      },
      {
        transform: 'translate3d(2px, -5px, 0) scale(1.016)',
        transformOrigin: '50% 62%'
      }
    ], {
      duration: 1900,
      easing: 'cubic-bezier(.22,.61,.36,1)',
      fill: 'both'
    });
  };

  const play = () => {
    if (settled) return;

    root.classList.remove('is-loading');
    root.setAttribute('data-state', 'playing');
    bindIntentExit();

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (settled) return;
        root.classList.add('is-playing');
        startDrinkMotion();
        finishTimer = window.setTimeout(settle, durationMs + 80);
      });
    });
  };

  const init = async () => {
    root.classList.add('is-loading');
    root.setAttribute('data-state', 'loading');

    if (reducedMotion || hasSeen || window.scrollY > 4) {
      settle();
      return;
    }

    const criticalImages = Array.from(root.querySelectorAll('img[data-c6-critical]'));
    const results = await Promise.race([
      Promise.all(criticalImages.map(waitForImage)),
      new Promise((resolve) => window.setTimeout(() => resolve(null), preloadBudgetMs))
    ]);

    if (Array.isArray(results) && results.includes(false)) {
      settle();
      return;
    }

    play();
  };

  init().catch(settle);
})();
