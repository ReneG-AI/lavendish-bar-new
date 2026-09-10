(() => {
  'use strict';

  const root = document.querySelector('[data-cinematic-v6]');
  if (!root) return;

  const skipButton = root.querySelector('[data-c6-skip]');
  const durationMs = 3800;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let completed = false;
  let finishTimer = null;

  const criticalImages = Array.from(root.querySelectorAll('img[data-c6-critical]'));

  const waitForImage = (image) => {
    if (image.complete && image.naturalWidth > 0) {
      return image.decode ? image.decode().catch(() => undefined) : Promise.resolve();
    }

    return new Promise((resolve) => {
      const done = () => {
        image.removeEventListener('load', done);
        image.removeEventListener('error', done);
        if (image.decode && image.naturalWidth > 0) {
          image.decode().catch(() => undefined).finally(resolve);
        } else {
          resolve();
        }
      };

      image.addEventListener('load', done, { once: true });
      image.addEventListener('error', done, { once: true });
    });
  };

  const complete = () => {
    if (completed) return;
    completed = true;
    window.clearTimeout(finishTimer);
    root.classList.remove('is-loading', 'is-playing');
    root.classList.add('is-complete');
    root.setAttribute('data-state', 'complete');
  };

  const play = () => {
    if (reducedMotion) {
      complete();
      return;
    }

    root.classList.remove('is-loading');
    root.setAttribute('data-state', 'playing');

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        root.classList.add('is-playing');
        finishTimer = window.setTimeout(complete, durationMs + 120);
      });
    });
  };

  const init = async () => {
    root.classList.add('is-loading');
    root.setAttribute('data-state', 'loading');

    await Promise.race([
      Promise.all(criticalImages.map(waitForImage)),
      new Promise((resolve) => window.setTimeout(resolve, 2200))
    ]);

    play();
  };

  if (skipButton) {
    skipButton.addEventListener('click', complete);
  }

  document.addEventListener('keydown', (event) => {
    if (completed) return;
    if (event.key === 'Escape') complete();
  });

  init().catch(complete);
})();
