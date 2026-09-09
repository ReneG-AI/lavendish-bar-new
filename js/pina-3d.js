(() => {
  'use strict';

  if (document.querySelector('[data-pc3d]')) return;

  const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  const finePointer = window.matchMedia?.('(pointer:fine)').matches ?? false;
  const hero = document.querySelector('#inicio');
  const mojitos = document.querySelector('#mojitos');
  if (!hero || !mojitos) return;

  if (!document.querySelector('link[data-pc3d-style]')) {
    const style = document.createElement('link');
    style.rel = 'stylesheet';
    style.href = 'css/pina-3d.css?v=0.1.0';
    style.dataset.pc3dStyle = '';
    document.head.appendChild(style);
  }

  const section = document.createElement('section');
  section.className = 'pc3d-scroll';
  section.id = 'pina-experience';
  section.dataset.pc3d = '';
  section.setAttribute('aria-labelledby', 'pc3d-title');
  section.innerHTML = `
    <div class="pc3d-sticky">
      <div class="pc3d-word" aria-hidden="true">PIÑA COLADA</div>
      <div class="pc3d-orbit" aria-hidden="true"></div>
      <div class="pc3d-grid">
        <div class="pc3d-copy">
          <div class="pc3d-kicker">Signature serve · LAVENDISH</div>
          <h2 id="pc3d-title">No se prepara.<strong>Se construye.</strong></h2>
          <p class="pc3d-lead">Cristal, hielo, mezcla tropical y el último detalle. Baja despacio y mira cómo toma forma nuestra Piña Colada.</p>
          <ol class="pc3d-steps" aria-label="Montaje de la Piña Colada">
            <li class="pc3d-step is-active" data-pc-step="0"><span>01</span>Cristal</li>
            <li class="pc3d-step" data-pc-step="1"><span>02</span>Hielo</li>
            <li class="pc3d-step" data-pc-step="2"><span>03</span>Mezcla</li>
            <li class="pc3d-step" data-pc-step="3"><span>04</span>Acabado</li>
          </ol>
        </div>

        <div class="pc3d-viewport" aria-hidden="true" data-pc-viewport>
          <div class="pc3d-halo" data-pc-halo></div>
          <div class="pc3d-floor"></div>
          <div class="pc3d-guide"><i></i><i></i><i></i></div>
          <div class="pc3d-scene" data-pc-scene>
            <div class="pc3d-procedural" data-pc-procedural>
              <div class="pc3d-glass-shell" data-pc-glass>
                <div class="pc3d-liquid" data-pc-liquid></div>
              </div>
              <div class="pc3d-ice">
                <i class="pc3d-cube" data-pc-cube data-x="-145" data-y="-190" data-r="-38"></i>
                <i class="pc3d-cube" data-pc-cube data-x="160" data-y="-130" data-r="42"></i>
                <i class="pc3d-cube" data-pc-cube data-x="-170" data-y="80" data-r="28"></i>
                <i class="pc3d-cube" data-pc-cube data-x="150" data-y="120" data-r="-46"></i>
                <i class="pc3d-cube" data-pc-cube data-x="-80" data-y="180" data-r="55"></i>
              </div>
              <div class="pc3d-foam" data-pc-foam><i></i><i></i><i></i></div>
              <div class="pc3d-straw" data-pc-straw></div>
              <div class="pc3d-pineapple" data-pc-pineapple></div>
              <div class="pc3d-cherry" data-pc-cherry></div>
            </div>
            <div class="pc3d-final" data-pc-final>
              <img src="assets/pina-colada.webp?v=1.1.1" width="900" height="1125" loading="lazy" decoding="async" alt="">
            </div>
          </div>
          <div class="pc3d-caption">Desliza para construir la copa</div>
        </div>
      </div>
      <div class="pc3d-progress" aria-hidden="true"><span data-pc-progress></span></div>
    </div>`;

  mojitos.before(section);

  const downCue = hero.querySelector('.down-cue');
  if (downCue) {
    downCue.href = '#pina-experience';
    downCue.setAttribute('aria-label', 'Descubrir cómo se construye nuestra Piña Colada');
  }

  const scene = section.querySelector('[data-pc-scene]');
  const viewport = section.querySelector('[data-pc-viewport]');
  const procedural = section.querySelector('[data-pc-procedural]');
  const glass = section.querySelector('[data-pc-glass]');
  const liquid = section.querySelector('[data-pc-liquid]');
  const cubes = Array.from(section.querySelectorAll('[data-pc-cube]'));
  const foam = section.querySelector('[data-pc-foam]');
  const straw = section.querySelector('[data-pc-straw]');
  const pineapple = section.querySelector('[data-pc-pineapple]');
  const cherry = section.querySelector('[data-pc-cherry]');
  const final = section.querySelector('[data-pc-final]');
  const finalImage = final?.querySelector('img');
  const halo = section.querySelector('[data-pc-halo]');
  const progressBar = section.querySelector('[data-pc-progress]');
  const steps = Array.from(section.querySelectorAll('[data-pc-step]'));

  if (!scene || !glass || !liquid || !procedural || !final || !progressBar) return;

  let sectionTop = 0;
  let scrollRange = 1;
  let progress = reducedMotion ? 1 : 0;
  let pointerX = 0;
  let pointerY = 0;
  let frame = 0;
  let nearViewport = true;

  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
  const lerp = (a, b, t) => a + (b - a) * t;
  const ease = (t) => 1 - Math.pow(1 - clamp(t), 3);
  const segment = (value, start, end) => ease((value - start) / (end - start));

  function measure() {
    sectionTop = section.getBoundingClientRect().top + window.scrollY;
    scrollRange = Math.max(1, section.offsetHeight - window.innerHeight);
  }

  function setActiveStep(value) {
    const index = value < .26 ? 0 : value < .49 ? 1 : value < .72 ? 2 : 3;
    steps.forEach((step, stepIndex) => step.classList.toggle('is-active', stepIndex === index));
  }

  function render() {
    frame = 0;

    const p = reducedMotion ? 1 : progress;
    const g = segment(p, .02, .19);
    const ice = segment(p, .18, .46);
    const mix = segment(p, .34, .60);
    const top = segment(p, .48, .68);
    const garnish = segment(p, .58, .79);
    const photo = segment(p, .78, .96);
    const proceduralFade = 1 - segment(p, .80, .94);

    const orbitY = lerp(-7, 6, p) + pointerX * 4.2;
    const orbitX = lerp(3, -2.2, p) - pointerY * 2.8;
    const rise = lerp(28, -8, p);
    scene.style.transform = `translate3d(0,${rise.toFixed(2)}px,0) rotateY(${orbitY.toFixed(2)}deg) rotateX(${orbitX.toFixed(2)}deg)`;

    glass.style.opacity = g.toFixed(3);
    glass.style.transform = `translateX(-50%) translate3d(0,${lerp(125, 0, g).toFixed(1)}px,0) rotateX(${lerp(13, 0, g).toFixed(1)}deg) scale(${lerp(.86, 1, g).toFixed(3)})`;

    liquid.style.opacity = mix.toFixed(3);
    liquid.style.transform = `scaleY(${Math.max(.02, mix).toFixed(3)})`;

    cubes.forEach((cube, index) => {
      const local = segment(ice, index * .055, .55 + index * .055);
      const fromX = Number(cube.dataset.x || 0);
      const fromY = Number(cube.dataset.y || 0);
      const fromR = Number(cube.dataset.r || 0);
      cube.style.opacity = local.toFixed(3);
      cube.style.transform = `translate3d(${lerp(fromX, 0, local).toFixed(1)}px,${lerp(fromY, 0, local).toFixed(1)}px,${lerp(120, 18 + index * 4, local).toFixed(1)}px) rotateX(${lerp(fromR, 17 - index * 3, local).toFixed(1)}deg) rotateY(${lerp(-fromR * .7, -14 + index * 7, local).toFixed(1)}deg) rotateZ(${lerp(fromR * .35, -8 + index * 4, local).toFixed(1)}deg)`;
    });

    if (foam) {
      foam.style.opacity = top.toFixed(3);
      foam.style.transform = `translate3d(0,${lerp(-90, 0, top).toFixed(1)}px,32px) scale(${lerp(.55, 1, top).toFixed(3)})`;
    }

    if (straw) {
      straw.style.opacity = garnish.toFixed(3);
      straw.style.transform = `translate3d(${lerp(110, 0, garnish).toFixed(1)}px,${lerp(-190, 0, garnish).toFixed(1)}px,70px) rotate(${lerp(32, 11, garnish).toFixed(1)}deg)`;
    }

    if (pineapple) {
      pineapple.style.opacity = garnish.toFixed(3);
      pineapple.style.transform = `translate3d(${lerp(190, 0, garnish).toFixed(1)}px,${lerp(-120, 0, garnish).toFixed(1)}px,90px) rotate(${lerp(58, 9, garnish).toFixed(1)}deg) scale(${lerp(.62, 1, garnish).toFixed(3)})`;
    }

    if (cherry) {
      const cherryT = segment(p, .65, .82);
      cherry.style.opacity = cherryT.toFixed(3);
      cherry.style.transform = `translate3d(${lerp(125, 0, cherryT).toFixed(1)}px,${lerp(-100, 0, cherryT).toFixed(1)}px,105px) scale(${lerp(.4, 1, cherryT).toFixed(3)})`;
    }

    procedural.style.opacity = proceduralFade.toFixed(3);
    final.style.opacity = photo.toFixed(3);
    final.style.transform = `translate3d(0,${lerp(18, 0, photo).toFixed(1)}px,42px) scale(${lerp(.92, 1, photo).toFixed(3)})`;
    if (finalImage) finalImage.style.transform = `rotate(${lerp(-1.4, 0, photo).toFixed(2)}deg)`;
    if (halo) halo.style.opacity = String(lerp(.42, .95, Math.max(mix, photo)));
    progressBar.style.transform = `scaleY(${p.toFixed(4)})`;
    setActiveStep(p);
  }

  function updateFromScroll() {
    if (reducedMotion || !nearViewport) return;
    progress = clamp((window.scrollY - sectionTop) / scrollRange);
    if (!frame) frame = requestAnimationFrame(render);
  }

  function onResize() {
    measure();
    updateFromScroll();
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      nearViewport = entry.isIntersecting;
      document.documentElement.classList.toggle('pc3d-active', entry.intersectionRatio > .08);
      if (nearViewport) updateFromScroll();
    }, { rootMargin: '35% 0px 35% 0px', threshold: [0, .08, .2] });
    observer.observe(section);
  }

  if (finePointer && !reducedMotion && viewport) {
    viewport.addEventListener('pointermove', (event) => {
      const rect = viewport.getBoundingClientRect();
      pointerX = clamp(((event.clientX - rect.left) / rect.width) * 2 - 1, -1, 1);
      pointerY = clamp(((event.clientY - rect.top) / rect.height) * 2 - 1, -1, 1);
      if (!frame) frame = requestAnimationFrame(render);
    }, { passive: true });
    viewport.addEventListener('pointerleave', () => {
      pointerX = 0;
      pointerY = 0;
      if (!frame) frame = requestAnimationFrame(render);
    }, { passive: true });
  }

  if (reducedMotion) {
    document.documentElement.classList.remove('pc3d-active');
    render();
  } else {
    window.addEventListener('scroll', updateFromScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    requestAnimationFrame(() => {
      measure();
      updateFromScroll();
      render();
    });
  }
})();
