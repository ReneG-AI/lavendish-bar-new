(() => {
  'use strict';

  const root = document.querySelector('[data-cin2]');
  if (!root) return;

  const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  const productWrap = root.querySelector('[data-product-wrap]');
  const product = root.querySelector('[data-product]');
  const productGlow = root.querySelector('[data-product-glow]');
  const productShadow = root.querySelector('[data-product-shadow]');
  const table = root.querySelector('[data-table]');
  const finalCopy = root.querySelector('[data-final-copy]');
  const progressBar = root.querySelector('[data-progress]');
  const scrollLabel = root.querySelector('[data-scroll-label]');
  const sky = root.querySelector('.cin2-sky');
  const starsA = root.querySelector('.cin2-stars-a');
  const starsB = root.querySelector('.cin2-stars-b');
  const cloudsBack = root.querySelector('.cin2-clouds-back');
  const cloudsFront = root.querySelector('.cin2-clouds-front');
  const terrace = root.querySelector('.cin2-terrace');
  const introCopy = root.querySelector('.cin2-copy-intro');

  let sectionTop = 0;
  let range = 1;
  let target = reducedMotion ? 1 : 0;
  let current = reducedMotion ? 1 : 0;
  let raf = 0;
  let active = true;
  let pointerX = 0;
  let pointerY = 0;
  let viewportWidth = innerWidth;

  const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));
  const mix = (a, b, t) => a + (b - a) * t;
  const smooth = (t) => {
    const x = clamp(t);
    return x * x * (3 - 2 * x);
  };
  const seg = (p, start, end) => smooth((p - start) / (end - start));

  function measure() {
    viewportWidth = innerWidth;
    sectionTop = root.getBoundingClientRect().top + scrollY;
    range = Math.max(1, root.offsetHeight - innerHeight);
  }

  function frame(p) {
    const nightOut = seg(p, .56, .90);
    const introOut = seg(p, .12, .31);
    const reveal = seg(p, .12, .45);
    const hero = seg(p, .35, .64);
    const terraceIn = seg(p, .57, .82);
    const tableIn = seg(p, .68, .88);
    const landing = seg(p, .78, .94);
    const finale = seg(p, .86, .985);

    if (sky) {
      sky.style.opacity = String(1 - nightOut * .82);
      sky.style.transform = `translate3d(0,${mix(0,-50,nightOut).toFixed(1)}px,0) scale(${mix(1,1.04,nightOut).toFixed(3)})`;
    }
    if (starsA) starsA.style.transform = `translate3d(${mix(0,-18,p).toFixed(1)}px,${mix(0,-42,p).toFixed(1)}px,0)`;
    if (starsB) starsB.style.transform = `translate3d(${mix(0,12,p).toFixed(1)}px,${mix(0,-26,p).toFixed(1)}px,0)`;

    if (cloudsBack) {
      cloudsBack.style.opacity = String(mix(.72,.18,nightOut));
      cloudsBack.style.transform = `translate3d(${mix(0,-36,p).toFixed(1)}px,${mix(0,-118,p).toFixed(1)}px,0) scale(${mix(1,1.08,p).toFixed(3)})`;
    }
    if (cloudsFront) {
      cloudsFront.style.opacity = String(mix(1,.08,seg(p,.42,.84)));
      cloudsFront.style.transform = `translate3d(${mix(0,48,p).toFixed(1)}px,${mix(0,-185,p).toFixed(1)}px,0) scale(${mix(1,1.13,p).toFixed(3)})`;
    }

    if (introCopy) {
      introCopy.style.opacity = String(1 - introOut);
      const mobile = viewportWidth < 900;
      introCopy.style.transform = mobile
        ? `translate(-50%,${mix(0,-16,introOut).toFixed(1)}px)`
        : `translateY(calc(-50% + ${mix(0,-18,introOut).toFixed(1)}px))`;
    }

    if (terrace) {
      terrace.style.opacity = terraceIn.toFixed(3);
      terrace.style.transform = `translate3d(0,${mix(46,0,terraceIn).toFixed(1)}px,0) scale(${mix(1.06,1,terraceIn).toFixed(3)})`;
    }

    if (table) {
      table.style.opacity = tableIn.toFixed(3);
      table.style.transform = `translate3d(0,${mix(0,-28,tableIn).toFixed(1)}svh,0)`;
    }

    if (productWrap && product) {
      const mobile = viewportWidth < 900;
      const baseScale = mobile ? mix(.72,1.06,hero) : mix(.68,1.10,hero);
      const settleScale = mix(baseScale, mobile ? .95 : .97, landing);
      const xMotion = (pointerX * (mobile ? 0 : 8)) * (1 - landing);
      const yMotion = (pointerY * (mobile ? 0 : 6)) * (1 - landing);
      const rise = mix(118,-16,reveal);
      const settleY = mix(rise, mobile ? 63 : 78, landing);
      const rotateY = (pointerX * 1.7 + mix(-2.5,1.2,hero)) * (mobile ? .25 : 1) * (1 - landing);
      const rotateX = (-pointerY * 1.2 + mix(1.8,-.5,hero)) * (mobile ? .2 : 1) * (1 - landing);

      productWrap.style.opacity = reveal.toFixed(3);
      productWrap.style.transform = `translate(calc(-50% + ${xMotion.toFixed(1)}px),calc(-50% + ${settleY.toFixed(1)}px + ${yMotion.toFixed(1)}px)) scale(${settleScale.toFixed(4)}) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;

      const blur = mix(12,0,reveal);
      const brightness = mix(.48,1.02,reveal);
      product.style.opacity = reveal.toFixed(3);
      product.style.filter = `blur(${blur.toFixed(2)}px) brightness(${brightness.toFixed(3)}) drop-shadow(0 38px 56px rgba(0,0,0,.58)) drop-shadow(0 0 28px rgba(222,181,93,.14))`;
    }

    if (productGlow) {
      productGlow.style.opacity = String(mix(.08,.74,hero) * mix(1,.86,landing));
      productGlow.style.transform = `translate(-50%,-50%) scale(${mix(.75,1.08,hero).toFixed(3)})`;
    }

    if (productShadow) {
      productShadow.style.opacity = String(landing * .72);
      productShadow.style.transform = `translateX(-50%) scale(${mix(.65,1,landing).toFixed(3)})`;
    }

    if (finalCopy) {
      finalCopy.style.opacity = finale.toFixed(3);
      if (viewportWidth < 900) {
        finalCopy.style.transform = `translate(-50%,${mix(18,0,finale).toFixed(1)}px)`;
      } else {
        finalCopy.style.transform = `translateY(${mix(18,0,finale).toFixed(1)}px)`;
      }
    }

    if (progressBar) progressBar.style.transform = `scaleY(${p.toFixed(4)})`;
    if (scrollLabel) scrollLabel.style.opacity = String(1 - seg(p,.72,.92));
  }

  function tick() {
    raf = 0;
    const delta = target - current;
    current += delta * .115;
    if (Math.abs(delta) < .00045) current = target;
    frame(current);
    if (current !== target) raf = requestAnimationFrame(tick);
  }

  function schedule() {
    if (!raf) raf = requestAnimationFrame(tick);
  }

  function update() {
    if (reducedMotion || !active) return;
    target = clamp((scrollY - sectionTop) / range);
    schedule();
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      active = entries[0]?.isIntersecting ?? true;
      if (active) update();
    }, { rootMargin: '20% 0px 20% 0px' });
    observer.observe(root);
  }

  if (!reducedMotion && window.matchMedia?.('(pointer:fine)').matches) {
    root.addEventListener('pointermove', (event) => {
      pointerX = clamp((event.clientX / innerWidth) * 2 - 1,-1,1);
      pointerY = clamp((event.clientY / innerHeight) * 2 - 1,-1,1);
      schedule();
    }, { passive:true });
    root.addEventListener('pointerleave', () => {
      pointerX = 0;
      pointerY = 0;
      schedule();
    }, { passive:true });
  }

  addEventListener('scroll', update, { passive:true });
  addEventListener('resize', () => { measure(); update(); }, { passive:true });
  addEventListener('orientationchange', () => { measure(); update(); }, { passive:true });

  measure();
  if (reducedMotion) frame(1);
  else {
    update();
    frame(0);
  }
})();
