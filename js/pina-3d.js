(() => {
  'use strict';

  if (document.querySelector('[data-pc3d]')) return;

  const motionQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)');
  const reducedMotion = motionQuery?.matches ?? false;
  const finePointer = window.matchMedia?.('(pointer:fine)').matches ?? false;
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const constrainedDevice = Boolean(connection?.saveData) || (navigator.deviceMemory && navigator.deviceMemory <= 2);

  const hero = document.querySelector('#inicio');
  const mojitos = document.querySelector('#mojitos');
  if (!hero || !mojitos) return;

  if (!document.querySelector('link[data-pc3d-style]')) {
    const style = document.createElement('link');
    style.rel = 'stylesheet';
    style.href = 'css/pina-3d.css?v=0.2.0';
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
      <div class="pc3d-atmosphere" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div>
      <div class="pc3d-word" aria-hidden="true">PIÑA COLADA</div>
      <div class="pc3d-orbit" aria-hidden="true"></div>

      <div class="pc3d-grid">
        <div class="pc3d-copy">
          <div class="pc3d-kicker">Signature serve · LAVENDISH</div>
          <h2 id="pc3d-title">No se prepara.<strong>Se construye.</strong></h2>
          <p class="pc3d-lead">Cristal, hielo, mezcla tropical, espuma y el último detalle. Baja despacio y mira cómo toma forma nuestra Piña Colada.</p>

          <ol class="pc3d-steps" aria-label="Montaje de la Piña Colada">
            <li class="pc3d-step is-active" data-pc-step="0"><span>01</span>Cristal</li>
            <li class="pc3d-step" data-pc-step="1"><span>02</span>Hielo</li>
            <li class="pc3d-step" data-pc-step="2"><span>03</span>Mezcla</li>
            <li class="pc3d-step" data-pc-step="3"><span>04</span>Espuma</li>
            <li class="pc3d-step" data-pc-step="4"><span>05</span>Acabado</li>
          </ol>
        </div>

        <div class="pc3d-viewport" aria-hidden="true" data-pc-viewport>
          <div class="pc3d-halo" data-pc-halo></div>
          <div class="pc3d-floor"></div>
          <div class="pc3d-guide"><i></i><i></i><i></i></div>

          <div class="pc3d-scene" data-pc-scene>
            <div class="pc3d-procedural" data-pc-procedural>
              <div class="pc3d-glass-shadow" data-pc-shadow></div>
              <div class="pc3d-glass-shell" data-pc-glass>
                <div class="pc3d-glass-shine"></div>
                <div class="pc3d-liquid" data-pc-liquid><i></i><b></b></div>
              </div>

              <div class="pc3d-ice">
                <i class="pc3d-cube" data-pc-cube data-x="-150" data-y="-190" data-z="160" data-r="-38"></i>
                <i class="pc3d-cube" data-pc-cube data-x="165" data-y="-138" data-z="135" data-r="42"></i>
                <i class="pc3d-cube" data-pc-cube data-x="-178" data-y="72" data-z="125" data-r="28"></i>
                <i class="pc3d-cube" data-pc-cube data-x="160" data-y="126" data-z="115" data-r="-46"></i>
                <i class="pc3d-cube" data-pc-cube data-x="-86" data-y="188" data-z="150" data-r="55"></i>
              </div>

              <div class="pc3d-foam" data-pc-foam><i></i><i></i><i></i><i></i></div>
              <div class="pc3d-straw" data-pc-straw></div>
              <div class="pc3d-pineapple" data-pc-pineapple></div>
              <div class="pc3d-cherry" data-pc-cherry></div>
            </div>

            <div class="pc3d-final" data-pc-final>
              <img src="assets/pina-colada.webp?v=1.1.1" width="900" height="1125" loading="lazy" decoding="async" alt="">
            </div>
          </div>

          <div class="pc3d-caption" data-pc-caption>Desliza para construir la copa</div>
        </div>
      </div>

      <div class="pc3d-outro" data-pc-outro>
        <p>Ahora sí. <strong>Piña Colada.</strong></p>
        <a href="#mojitos">Seguir a Mojitos <span aria-hidden="true">↓</span></a>
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
  const shadow = section.querySelector('[data-pc-shadow]');
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
  const caption = section.querySelector('[data-pc-caption]');
  const outro = section.querySelector('[data-pc-outro]');
  const steps = Array.from(section.querySelectorAll('[data-pc-step]'));

  if (!scene || !glass || !liquid || !procedural || !final || !progressBar) return;

  let sectionTop = 0;
  let scrollRange = 1;
  let progress = reducedMotion ? 1 : 0;
  let pointerX = 0;
  let pointerY = 0;
  let frame = 0;
  let nearViewport = true;
  let viewportWidth = window.innerWidth;

  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
  const lerp = (a, b, t) => a + (b - a) * t;
  const easeOut = (t) => 1 - Math.pow(1 - clamp(t), 3);
  const easeInOut = (t) => {
    const x = clamp(t);
    return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  };
  const segment = (value, start, end, easing = easeOut) => easing((value - start) / (end - start));

  function measure() {
    viewportWidth = window.innerWidth;
    sectionTop = section.getBoundingClientRect().top + window.scrollY;
    scrollRange = Math.max(1, section.offsetHeight - window.innerHeight);
  }

  function setActiveStep(value) {
    const index = value < .18 ? 0 : value < .36 ? 1 : value < .56 ? 2 : value < .72 ? 3 : 4;
    steps.forEach((step, stepIndex) => step.classList.toggle('is-active', stepIndex === index));
  }

  function render() {
    frame = 0;

    const p = reducedMotion ? 1 : progress;
    const g = segment(p, .00, .18, easeInOut);
    const ice = segment(p, .14, .38, easeInOut);
    const mix = segment(p, .30, .58, easeInOut);
    const top = segment(p, .50, .70, easeInOut);
    const garnish = segment(p, .62, .84, easeInOut);
    const cherryT = segment(p, .68, .86, easeOut);
    const photo = segment(p, .80, .985, easeInOut);
    const proceduralFade = 1 - segment(p, .82, .96, easeInOut);
    const heroMoment = segment(p, .88, 1, easeOut);

    const motionScale = viewportWidth < 768 ? .42 : viewportWidth < 1024 ? .68 : 1;
    const orbitY = (lerp(-6.5, 5.2, p) + pointerX * 3.6) * motionScale;
    const orbitX = (lerp(2.8, -1.8, p) - pointerY * 2.3) * motionScale;
    const rise = lerp(26, -7, p);
    const finalScale = lerp(.90, 1.025, heroMoment);

    scene.style.transform = `translate3d(0,${rise.toFixed(2)}px,0) rotateY(${orbitY.toFixed(2)}deg) rotateX(${orbitX.toFixed(2)}deg) scale(${finalScale.toFixed(4)})`;

    glass.style.opacity = g.toFixed(3);
    glass.style.transform = `translateX(-50%) translate3d(0,${lerp(118, 0, g).toFixed(1)}px,0) rotateX(${lerp(12, 0, g).toFixed(1)}deg) scale(${lerp(.87, 1, g).toFixed(3)})`;

    if (shadow) {
      shadow.style.opacity = String(lerp(0, .68, g));
      shadow.style.transform = `translateX(-50%) scale(${lerp(.55, 1, g).toFixed(3)})`;
    }

    liquid.style.opacity = mix.toFixed(3);
    liquid.style.transform = `scaleY(${Math.max(.018, mix).toFixed(3)})`;
    liquid.style.setProperty('--wave', `${lerp(7, 0, mix).toFixed(2)}px`);

    cubes.forEach((cube, index) => {
      const local = segment(ice, index * .045, .56 + index * .055, easeInOut);
      const fromX = Number(cube.dataset.x || 0);
      const fromY = Number(cube.dataset.y || 0);
      const fromZ = Number(cube.dataset.z || 120);
      const fromR = Number(cube.dataset.r || 0);
      const settleY = index % 2 === 0 ? 3 : -2;
      cube.style.opacity = local.toFixed(3);
      cube.style.transform = `translate3d(${lerp(fromX, 0, local).toFixed(1)}px,${lerp(fromY, settleY, local).toFixed(1)}px,${lerp(fromZ, 18 + index * 5, local).toFixed(1)}px) rotateX(${lerp(fromR, 16 - index * 3, local).toFixed(1)}deg) rotateY(${lerp(-fromR * .72, -15 + index * 7, local).toFixed(1)}deg) rotateZ(${lerp(fromR * .38, -8 + index * 4, local).toFixed(1)}deg)`;
    });

    if (foam) {
      foam.style.opacity = top.toFixed(3);
      foam.style.transform = `translate3d(0,${lerp(-78, 0, top).toFixed(1)}px,32px) scale(${lerp(.58, 1, top).toFixed(3)})`;
    }

    if (straw) {
      straw.style.opacity = garnish.toFixed(3);
      straw.style.transform = `translate3d(${lerp(100, 0, garnish).toFixed(1)}px,${lerp(-170, 0, garnish).toFixed(1)}px,70px) rotate(${lerp(31, 11, garnish).toFixed(1)}deg)`;
    }

    if (pineapple) {
      pineapple.style.opacity = garnish.toFixed(3);
      pineapple.style.transform = `translate3d(${lerp(178, 0, garnish).toFixed(1)}px,${lerp(-112, 0, garnish).toFixed(1)}px,90px) rotate(${lerp(55, 9, garnish).toFixed(1)}deg) scale(${lerp(.64, 1, garnish).toFixed(3)})`;
    }

    if (cherry) {
      cherry.style.opacity = cherryT.toFixed(3);
      cherry.style.transform = `translate3d(${lerp(120, 0, cherryT).toFixed(1)}px,${lerp(-94, 0, cherryT).toFixed(1)}px,105px) scale(${lerp(.45, 1, cherryT).toFixed(3)})`;
    }

    procedural.style.opacity = proceduralFade.toFixed(3);
    final.style.opacity = photo.toFixed(3);
    final.style.transform = `translate3d(0,${lerp(24, 0, photo).toFixed(1)}px,46px) scale(${lerp(.90, 1, photo).toFixed(3)})`;
    if (finalImage) finalImage.style.transform = `rotate(${lerp(-1.1, 0, photo).toFixed(2)}deg)`;
    if (halo) halo.style.opacity = String(lerp(.36, .96, Math.max(mix, photo)));

    progressBar.style.transform = `scaleY(${p.toFixed(4)})`;
    setActiveStep(p);

    if (caption) {
      caption.textContent = p > .86 ? 'Nuestra Piña Colada, llevada al detalle.' : 'Desliza para construir la copa';
      caption.classList.toggle('is-final', p > .86);
    }

    if (outro) outro.classList.toggle('is-visible', p > .90);
    section.classList.toggle('is-finished', p > .965);
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
    }, { rootMargin: '30% 0px 30% 0px', threshold: [0, .08, .2] });
    observer.observe(section);
  }

  if (finePointer && !reducedMotion && !constrainedDevice && viewport) {
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

  if (constrainedDevice) section.classList.add('pc3d-lite');

  if (reducedMotion) {
    section.classList.add('is-finished');
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
