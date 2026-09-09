(() => {
  'use strict';

  if (document.querySelector('[data-pc3d]')) return;

  const hero = document.querySelector('#inicio');
  const mojitos = document.querySelector('#mojitos');
  if (!hero || !mojitos) return;

  const motionQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)');
  const reducedMotion = motionQuery?.matches ?? false;
  const finePointer = window.matchMedia?.('(pointer:fine)').matches ?? false;
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const constrainedDevice = Boolean(connection?.saveData) || (navigator.deviceMemory && navigator.deviceMemory <= 2);

  if (!document.querySelector('link[data-pc3d-style]')) {
    const style = document.createElement('link');
    style.rel = 'stylesheet';
    style.href = 'css/pina-3d.css?v=0.4.0';
    style.dataset.pc3dStyle = '';
    document.head.appendChild(style);
  }

  const productSrc = 'assets/pina-colada.webp?v=1.1.1';

  const section = document.createElement('section');
  section.className = 'pcfilm-scroll';
  section.id = 'pina-experience';
  section.dataset.pc3d = '';
  section.setAttribute('aria-labelledby', 'pcfilm-title');
  section.innerHTML = `
    <div class="pcfilm-sticky">
      <div class="pcfilm-grain" aria-hidden="true"></div>
      <div class="pcfilm-glow" aria-hidden="true" data-film-glow></div>
      <div class="pcfilm-word" aria-hidden="true">PIÑA COLADA</div>

      <div class="pcfilm-grid">
        <div class="pcfilm-copy">
          <div class="pcfilm-kicker">Signature serve · LAVENDISH</div>
          <h2 id="pcfilm-title">De cero a<br><strong>Piña Colada.</strong></h2>
          <p class="pcfilm-lead">Fría, cremosa y tropical. Baja despacio y mira cómo aparece hasta quedar lista para el primer sorbo.</p>

          <ol class="pcfilm-steps" aria-label="Secuencia de la Piña Colada">
            <li class="pcfilm-step is-active" data-film-step="0"><span>01</span>Aparece</li>
            <li class="pcfilm-step" data-film-step="1"><span>02</span>Se llena</li>
            <li class="pcfilm-step" data-film-step="2"><span>03</span>Acabado tropical</li>
            <li class="pcfilm-step" data-film-step="3"><span>04</span>Lista para servir</li>
          </ol>
        </div>

        <div class="pcfilm-viewport" data-film-viewport>
          <div class="pcfilm-floor" aria-hidden="true"></div>

          <div class="pcfilm-product" data-film-product aria-hidden="true">
            <div class="pcfilm-layer pcfilm-ghost" data-film-ghost>
              <img src="${productSrc}" width="900" height="1125" alt="" decoding="async">
            </div>

            <div class="pcfilm-layer pcfilm-fill" data-film-fill>
              <img src="${productSrc}" width="900" height="1125" alt="" decoding="async">
            </div>

            <div class="pcfilm-reveal-edge" data-film-edge></div>

            <div class="pcfilm-layer pcfilm-final" data-film-final>
              <img src="${productSrc}" width="900" height="1125" alt="" decoding="async">
            </div>

            <div class="pcfilm-reflection" data-film-reflection>
              <img src="${productSrc}" width="900" height="1125" alt="" decoding="async">
            </div>
          </div>

          <div class="pcfilm-caption" data-film-caption>Baja para verla aparecer</div>
        </div>
      </div>

      <div class="pcfilm-outro" data-film-outro>
        <p>Fría. Cremosa. <strong>Irresistible.</strong></p>
        <a href="#mojitos">Descubrir Mojitos <span aria-hidden="true">↓</span></a>
      </div>

      <div class="pcfilm-progress" aria-hidden="true"><span data-film-progress></span></div>
    </div>`;

  mojitos.before(section);

  const downCue = hero.querySelector('.down-cue');
  if (downCue) {
    downCue.href = '#pina-experience';
    downCue.setAttribute('aria-label', 'Descubrir nuestra Piña Colada');
  }

  const product = section.querySelector('[data-film-product]');
  const viewport = section.querySelector('[data-film-viewport]');
  const ghost = section.querySelector('[data-film-ghost]');
  const fillLayer = section.querySelector('[data-film-fill]');
  const revealEdge = section.querySelector('[data-film-edge]');
  const finalLayer = section.querySelector('[data-film-final]');
  const reflection = section.querySelector('[data-film-reflection]');
  const glow = section.querySelector('[data-film-glow]');
  const caption = section.querySelector('[data-film-caption]');
  const outro = section.querySelector('[data-film-outro]');
  const progressBar = section.querySelector('[data-film-progress]');
  const steps = Array.from(section.querySelectorAll('[data-film-step]'));

  if (!product || !fillLayer || !finalLayer || !progressBar) return;

  let sectionTop = 0;
  let scrollRange = 1;
  let targetProgress = reducedMotion ? 1 : 0;
  let currentProgress = reducedMotion ? 1 : 0;
  let pointerX = 0;
  let pointerY = 0;
  let raf = 0;
  let viewportWidth = window.innerWidth;

  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
  const lerp = (a, b, t) => a + (b - a) * t;
  const smoothstep = (t) => {
    const x = clamp(t);
    return x * x * (3 - 2 * x);
  };
  const seg = (p, start, end) => smoothstep((p - start) / (end - start));

  function measure() {
    viewportWidth = window.innerWidth;
    sectionTop = section.getBoundingClientRect().top + window.scrollY;
    scrollRange = Math.max(1, section.offsetHeight - window.innerHeight);
  }

  function setStep(p) {
    const index = p < .20 ? 0 : p < .62 ? 1 : p < .84 ? 2 : 3;
    steps.forEach((step, i) => step.classList.toggle('is-active', i === index));
  }

  function applyFrame(p) {
    const reveal = seg(p, .04, .78);
    const finish = seg(p, .74, .95);
    const heroMoment = seg(p, .88, 1);

    const revealPercent = lerp(0, 100, reveal);
    const insetTop = 100 - revealPercent;
    const clip = `inset(${insetTop.toFixed(2)}% 0 0 0)`;

    fillLayer.style.clipPath = clip;
    fillLayer.style.webkitClipPath = clip;
    fillLayer.style.opacity = String(lerp(.30, 1, reveal));

    if (revealEdge) {
      revealEdge.style.opacity = String(reveal > .02 && reveal < .985 ? lerp(.24, .72, 1 - Math.abs(.5 - reveal) * 2) : 0);
      revealEdge.style.top = `${insetTop.toFixed(2)}%`;
    }

    if (ghost) {
      ghost.style.opacity = String(lerp(.15, .045, reveal) * (1 - finish));
      ghost.style.transform = `translate3d(0,${lerp(22, 0, reveal).toFixed(1)}px,-24px) scale(${lerp(.97, 1, reveal).toFixed(3)})`;
    }

    finalLayer.style.opacity = finish.toFixed(3);
    finalLayer.style.transform = `translate3d(0,${lerp(12, 0, finish).toFixed(1)}px,54px) scale(${lerp(.992, 1, finish).toFixed(3)})`;

    const motionScale = viewportWidth < 760 ? .24 : viewportWidth < 1100 ? .50 : 1;
    const rx = (lerp(1.5, -.5, p) - pointerY * 1.25) * motionScale;
    const ry = (lerp(-3.2, 1.3, p) + pointerX * 2.3) * motionScale;
    const y = lerp(26, -5, p);
    const scale = lerp(.94, 1.025, heroMoment);
    product.style.transform = `translate3d(0,${y.toFixed(2)}px,0) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) scale(${scale.toFixed(4)})`;

    if (reflection) {
      const reflectionOpacity = constrainedDevice ? 0 : finish * .15;
      reflection.style.opacity = reflectionOpacity.toFixed(3);
      reflection.style.transform = 'translate3d(0,0,0) scaleY(-.22) scaleX(.94)';
    }

    if (glow) glow.style.opacity = String(lerp(.28, .92, Math.max(reveal, finish)));

    progressBar.style.transform = `scaleY(${p.toFixed(4)})`;
    setStep(p);

    if (caption) {
      if (p < .20) caption.textContent = 'Baja para verla aparecer';
      else if (p < .72) caption.textContent = 'Se está llenando…';
      else if (p < .90) caption.textContent = 'Últimos detalles…';
      else caption.textContent = 'Lista para servir.';
      caption.classList.toggle('is-final', p > .90);
    }

    if (outro) outro.classList.toggle('is-visible', p > .91);
    section.classList.toggle('is-finished', p > .97);
  }

  function tick() {
    raf = 0;
    const delta = targetProgress - currentProgress;
    currentProgress += delta * (reducedMotion ? 1 : .18);

    if (Math.abs(delta) < .0004) currentProgress = targetProgress;
    applyFrame(currentProgress);

    if (currentProgress !== targetProgress) raf = requestAnimationFrame(tick);
  }

  function schedule() {
    if (!raf) raf = requestAnimationFrame(tick);
  }

  function updateFromScroll() {
    if (reducedMotion) return;
    targetProgress = clamp((window.scrollY - sectionTop) / scrollRange);
    schedule();
  }

  function onResize() {
    measure();
    updateFromScroll();
  }

  const sectionObserver = 'IntersectionObserver' in window
    ? new IntersectionObserver((entries) => {
        const visible = entries.some((entry) => entry.isIntersecting);
        document.documentElement.classList.toggle('pc3d-active', visible);
        if (visible) updateFromScroll();
      }, { rootMargin: '12% 0px 12% 0px', threshold: 0 })
    : null;
  sectionObserver?.observe(section);

  if (finePointer && !reducedMotion && !constrainedDevice && viewport) {
    viewport.addEventListener('pointermove', (event) => {
      const rect = viewport.getBoundingClientRect();
      pointerX = clamp(((event.clientX - rect.left) / rect.width) * 2 - 1, -1, 1);
      pointerY = clamp(((event.clientY - rect.top) / rect.height) * 2 - 1, -1, 1);
      schedule();
    }, { passive: true });

    viewport.addEventListener('pointerleave', () => {
      pointerX = 0;
      pointerY = 0;
      schedule();
    }, { passive: true });
  }

  window.addEventListener('scroll', updateFromScroll, { passive: true });
  window.addEventListener('resize', onResize, { passive: true });
  window.addEventListener('orientationchange', onResize, { passive: true });

  if (motionQuery?.addEventListener) {
    motionQuery.addEventListener('change', () => window.location.reload());
  }

  requestAnimationFrame(() => {
    measure();
    if (reducedMotion) {
      currentProgress = targetProgress = 1;
      applyFrame(1);
    } else {
      targetProgress = clamp((window.scrollY - sectionTop) / scrollRange);
      currentProgress = targetProgress;
      applyFrame(currentProgress);
    }
  });
})();