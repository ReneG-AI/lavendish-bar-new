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
    style.href = 'css/pina-3d.css?v=0.3.0';
    style.dataset.pc3dStyle = '';
    document.head.appendChild(style);
  }

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
          <p class="pcfilm-lead">Fría, cremosa y tropical. Desliza y mira cómo toma forma hasta quedar lista para el primer sorbo.</p>

          <ol class="pcfilm-steps" aria-label="Secuencia de la Piña Colada">
            <li class="pcfilm-step is-active" data-film-step="0"><span>01</span>Entra en escena</li>
            <li class="pcfilm-step" data-film-step="1"><span>02</span>Cobra cuerpo</li>
            <li class="pcfilm-step" data-film-step="2"><span>03</span>Acabado tropical</li>
            <li class="pcfilm-step" data-film-step="3"><span>04</span>Lista para servir</li>
          </ol>
        </div>

        <div class="pcfilm-viewport" data-film-viewport>
          <div class="pcfilm-floor" aria-hidden="true"></div>
          <div class="pcfilm-product" data-film-product aria-hidden="true">
            <div class="pcfilm-layer pcfilm-ghost" data-film-ghost>
              <img src="assets/pina-colada.webp?v=1.1.1" width="900" height="1125" alt="" decoding="async">
            </div>
            <div class="pcfilm-layer pcfilm-base" data-film-base>
              <img src="assets/pina-colada.webp?v=1.1.1" width="900" height="1125" alt="" decoding="async">
            </div>
            <div class="pcfilm-layer pcfilm-body" data-film-body>
              <img src="assets/pina-colada.webp?v=1.1.1" width="900" height="1125" alt="" decoding="async">
            </div>
            <div class="pcfilm-layer pcfilm-top" data-film-top>
              <img src="assets/pina-colada.webp?v=1.1.1" width="900" height="1125" alt="" decoding="async">
            </div>
            <div class="pcfilm-layer pcfilm-final" data-film-final>
              <img src="assets/pina-colada.webp?v=1.1.1" width="900" height="1125" alt="" decoding="async">
            </div>
            <div class="pcfilm-reflection" data-film-reflection>
              <img src="assets/pina-colada.webp?v=1.1.1" width="900" height="1125" alt="" decoding="async">
            </div>
          </div>
          <div class="pcfilm-caption" data-film-caption>Desliza para verla aparecer</div>
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
  const base = section.querySelector('[data-film-base]');
  const body = section.querySelector('[data-film-body]');
  const top = section.querySelector('[data-film-top]');
  const finalLayer = section.querySelector('[data-film-final]');
  const reflection = section.querySelector('[data-film-reflection]');
  const glow = section.querySelector('[data-film-glow]');
  const caption = section.querySelector('[data-film-caption]');
  const outro = section.querySelector('[data-film-outro]');
  const progressBar = section.querySelector('[data-film-progress]');
  const steps = Array.from(section.querySelectorAll('[data-film-step]'));

  if (!product || !base || !body || !top || !finalLayer || !progressBar) return;

  let sectionTop = 0;
  let scrollRange = 1;
  let targetProgress = reducedMotion ? 1 : 0;
  let currentProgress = reducedMotion ? 1 : 0;
  let pointerX = 0;
  let pointerY = 0;
  let raf = 0;
  let active = true;
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
    const index = p < .25 ? 0 : p < .52 ? 1 : p < .78 ? 2 : 3;
    steps.forEach((step, i) => step.classList.toggle('is-active', i === index));
  }

  function applyFrame(p) {
    const intro = seg(p, .00, .18);
    const bodyIn = seg(p, .14, .52);
    const topIn = seg(p, .42, .76);
    const finish = seg(p, .72, .97);
    const heroMoment = seg(p, .86, 1);

    const motionScale = viewportWidth < 760 ? .34 : viewportWidth < 1100 ? .62 : 1;
    const rx = (lerp(2.2, -.8, p) - pointerY * 1.6) * motionScale;
    const ry = (lerp(-5.5, 2.4, p) + pointerX * 3.2) * motionScale;
    const y = lerp(34, -8, p);
    const scale = lerp(.91, 1.03, heroMoment);

    product.style.transform = `translate3d(0,${y.toFixed(2)}px,0) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) scale(${scale.toFixed(4)})`;

    if (ghost) {
      ghost.style.opacity = String(lerp(.08, .18, intro) * (1 - finish * .9));
      ghost.style.transform = `translate3d(0,${lerp(26, 0, intro).toFixed(1)}px,-22px) scale(${lerp(.95,1,intro).toFixed(3)})`;
    }

    base.style.opacity = intro.toFixed(3);
    base.style.transform = `translate3d(0,${lerp(88, 0, intro).toFixed(1)}px,12px) scale(${lerp(.92,1,intro).toFixed(3)})`;

    body.style.opacity = bodyIn.toFixed(3);
    body.style.transform = `translate3d(${lerp(-26, 0, bodyIn).toFixed(1)}px,${lerp(52, 0, bodyIn).toFixed(1)}px,28px) scale(${lerp(.96,1,bodyIn).toFixed(3)})`;
    body.style.setProperty('--film-reveal', `${lerp(12, 100, bodyIn).toFixed(1)}%`);

    top.style.opacity = topIn.toFixed(3);
    top.style.transform = `translate3d(${lerp(42, 0, topIn).toFixed(1)}px,${lerp(-78, 0, topIn).toFixed(1)}px,44px) rotateZ(${lerp(3.2,0,topIn).toFixed(2)}deg) scale(${lerp(.94,1,topIn).toFixed(3)})`;

    finalLayer.style.opacity = finish.toFixed(3);
    finalLayer.style.transform = `translate3d(0,${lerp(16,0,finish).toFixed(1)}px,62px) scale(${lerp(.985,1,finish).toFixed(3)})`;

    if (reflection) {
      const reflectionOpacity = constrainedDevice ? 0 : finish * .17;
      reflection.style.opacity = reflectionOpacity.toFixed(3);
      reflection.style.transform = `translate3d(0,${lerp(-10,0,finish).toFixed(1)}px,0) scaleY(-.24) scaleX(.94)`;
    }

    if (glow) glow.style.opacity = String(lerp(.28, .92, Math.max(bodyIn, finish)));
    progressBar.style.transform = `scaleY(${p.toFixed(4)})`;
    setStep(p);

    if (caption) {
      caption.textContent = p > .82 ? 'Lista para servir.' : 'Desliza para verla aparecer';
      caption.classList.toggle('is-final', p > .82);
    }

    if (outro) outro.classList.toggle('is-visible', p > .90);
    section.classList.toggle('is-finished', p > .965);
  }

  function tick() {
    raf = 0;
    const delta = targetProgress - currentProgress;
    currentProgress += delta * (reducedMotion ? 1 : .13);

    if (Math.abs(delta) < .0005) currentProgress = targetProgress;
    applyFrame(currentProgress);

    if (currentProgress !== targetProgress && !raf) raf = requestAnimationFrame(tick);
  }

  function schedule() {
    if (!raf) raf = requestAnimationFrame(tick);
  }

  function updateFromScroll() {
    if (reducedMotion || !active) return;
    targetProgress = clamp((window.scrollY - sectionTop) / scrollRange);
    schedule();
  }

  function onResize() {
    measure();
    updateFromScroll();
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      active = entry.isIntersecting;
      document.documentElement.classList.toggle('pc3d-active', entry.intersectionRatio > .08);
      if (active) updateFromScroll();
    }, { rootMargin: '25% 0px 25% 0px', threshold: [0, .08, .2] });
    observer.observe(section);
  }

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

  measure();
  if (reducedMotion) {
    currentProgress = targetProgress = 1;
    applyFrame(1);
  } else {
    updateFromScroll();
    applyFrame(currentProgress);
  }
})();