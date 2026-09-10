(() => {
  'use strict';

  const root = document.querySelector('[data-cin2]');
  if (!root) return;

  const motionQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)');
  const reducedMotion = motionQuery?.matches ?? false;
  const finePointer = window.matchMedia?.('(pointer:fine)').matches ?? false;
  const frameParam = new URLSearchParams(window.location.search).get('frame');
  const parsedFrame = frameParam === null ? NaN : Number(frameParam);
  const debugFrame = Number.isFinite(parsedFrame) ? Math.min(1, Math.max(0, parsedFrame)) : null;

  const productWrap = root.querySelector('[data-product-wrap]');
  const product = root.querySelector('[data-product]');
  const productGlow = root.querySelector('[data-product-glow]');
  const productShadow = root.querySelector('[data-product-shadow]');
  const sky = root.querySelector('.cin2-sky');
  const starsA = root.querySelector('.cin2-stars-a');
  const starsB = root.querySelector('.cin2-stars-b');
  const haze = root.querySelector('[data-haze]');
  const cloudsBack = root.querySelector('.cin2-clouds-back');
  const cloudsMid = root.querySelector('.cin2-clouds-mid');
  const cloudsFront = root.querySelector('.cin2-clouds-front');
  const terrace = root.querySelector('.cin2-terrace');
  const terraceLights = root.querySelector('[data-terrace-lights]');
  const table = root.querySelector('[data-table]');
  const finalCopy = root.querySelector('[data-final-copy]');
  const introCopy = root.querySelector('.cin2-copy-intro');
  const progressBar = root.querySelector('[data-progress]');
  const scrollLabel = root.querySelector('[data-scroll-label]');

  if (!productWrap || !product || !table) return;

  let sectionTop = 0;
  let scrollRange = 1;
  let viewportWidth = window.innerWidth;
  let viewportHeight = window.visualViewport?.height || window.innerHeight;
  let target = debugFrame ?? (reducedMotion ? 1 : 0);
  let current = debugFrame ?? (reducedMotion ? 1 : 0);
  let raf = 0;
  let active = true;
  let pointerX = 0;
  let pointerY = 0;

  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
  const mix = (a, b, t) => a + (b - a) * t;
  const smooth = (t) => {
    const x = clamp(t);
    return x * x * (3 - (2 * x));
  };
  const smoother = (t) => {
    const x = clamp(t);
    return x * x * x * (x * ((x * 6) - 15) + 10);
  };
  const seg = (p, start, end, easing = smooth) => easing((p - start) / (end - start));

  function measure() {
    viewportWidth = window.innerWidth;
    viewportHeight = window.visualViewport?.height || window.innerHeight;
    sectionTop = root.getBoundingClientRect().top + window.scrollY;
    scrollRange = Math.max(1, root.offsetHeight - viewportHeight);
  }

  function productLandingY(scale) {
    const mobile = viewportWidth < 900;
    const tableTop = viewportHeight * (mobile ? 0.735 : 0.745);
    const productHeight = Math.min(
      viewportWidth < 560 ? 500 : mobile ? 590 : 720,
      viewportHeight * (mobile ? 0.62 : 0.78)
    );
    const visualBottomRatio = mobile ? 0.435 : 0.445;
    const contactOffset = mobile ? 16 : 22;
    return tableTop - (viewportHeight * 0.50) - (productHeight * scale * visualBottomRatio) + contactOffset;
  }

  function frame(progress) {
    const p = clamp(progress);
    const introOut = seg(p, .08, .25);
    const reveal = seg(p, .10, .39, smoother);
    const hero = seg(p, .29, .60, smoother);
    const heroHold = seg(p, .57, .69);
    const nightOut = seg(p, .56, .86, smoother);
    const terraceIn = seg(p, .58, .82, smoother);
    const tableIn = seg(p, .67, .86, smoother);
    const landing = seg(p, .75, .94, smoother);
    const settle = seg(p, .91, .985, smoother);
    const finale = seg(p, .89, .99, smoother);

    if (sky) {
      sky.style.opacity = String(1 - (nightOut * .91));
      sky.style.transform = `translate3d(0,${mix(0, -72, nightOut).toFixed(1)}px,0) scale(${mix(1, 1.055, nightOut).toFixed(4)})`;
    }

    if (starsA) {
      starsA.style.opacity = String(mix(.82, .25, nightOut));
      starsA.style.transform = `translate3d(${mix(0, -24, p).toFixed(1)}px,${mix(0, -52, p).toFixed(1)}px,0) scale(${mix(1, 1.025, p).toFixed(4)})`;
    }
    if (starsB) {
      starsB.style.opacity = String(mix(.48, .08, nightOut));
      starsB.style.transform = `translate3d(${mix(0, 16, p).toFixed(1)}px,${mix(0, -32, p).toFixed(1)}px,0)`;
    }

    if (haze) {
      haze.style.opacity = String(mix(.90, .18, seg(p, .20, .72)));
      haze.style.transform = `translate3d(-50%,${mix(22, -64, p).toFixed(1)}px,0) scale(${mix(.96, 1.12, p).toFixed(4)})`;
    }

    if (cloudsBack) {
      const drift = seg(p, .02, .74);
      cloudsBack.style.opacity = String(mix(.74, .16, seg(p, .42, .84)));
      cloudsBack.style.transform = `translate3d(${mix(0, -78, drift).toFixed(1)}px,${mix(0, -102, drift).toFixed(1)}px,0) scale(${mix(1, 1.10, drift).toFixed(4)})`;
    }
    if (cloudsMid) {
      const drift = seg(p, .05, .70);
      cloudsMid.style.opacity = String(mix(.82, .10, seg(p, .36, .78)));
      cloudsMid.style.transform = `translate3d(${mix(0, 58, drift).toFixed(1)}px,${mix(0, -138, drift).toFixed(1)}px,0) scale(${mix(1, 1.14, drift).toFixed(4)})`;
    }
    if (cloudsFront) {
      const open = seg(p, .10, .58, smoother);
      cloudsFront.style.opacity = String(mix(.98, .04, seg(p, .28, .74)));
      cloudsFront.style.transform = `translate3d(${mix(0, 94, open).toFixed(1)}px,${mix(0, -196, open).toFixed(1)}px,0) scale(${mix(1, 1.18, open).toFixed(4)})`;
    }

    if (introCopy) {
      introCopy.style.opacity = String(1 - introOut);
      if (viewportWidth < 900) {
        introCopy.style.transform = `translate(-50%,${mix(0, -18, introOut).toFixed(1)}px)`;
      } else {
        introCopy.style.transform = `translateY(calc(-50% + ${mix(0, -22, introOut).toFixed(1)}px))`;
      }
    }

    if (terrace) {
      terrace.style.opacity = terraceIn.toFixed(3);
      terrace.style.transform = `translate3d(0,${mix(54, 0, terraceIn).toFixed(1)}px,0) scale(${mix(1.075, 1, terraceIn).toFixed(4)})`;
    }
    if (terraceLights) {
      terraceLights.style.opacity = String(mix(0, .86, terraceIn));
      terraceLights.style.transform = `translate3d(0,${mix(16, 0, terraceIn).toFixed(1)}px,0)`;
    }

    table.style.opacity = tableIn.toFixed(3);
    table.style.transform = `translate3d(0,${mix(34, 0, tableIn).toFixed(2)}svh,0)`;

    const mobile = viewportWidth < 900;
    const pointerStrength = mobile ? 0 : (1 - landing);
    const heroScale = mobile ? mix(.70, 1.09, hero) : mix(.64, 1.16, hero);
    const holdScale = mix(heroScale, mobile ? 1.07 : 1.14, heroHold);
    const finalScale = mobile ? .92 : .96;
    const settleCompression = mix(1, .994, settle);
    const scale = mix(holdScale, finalScale, landing) * settleCompression;

    const startY = mobile ? 118 : 138;
    const heroY = mobile ? -14 : -24;
    const riseY = mix(startY, heroY, reveal);
    const landingY = productLandingY(finalScale);
    const y = mix(riseY, landingY, landing) + mix(0, 3.5, settle);
    const x = pointerX * (mobile ? 0 : 10) * pointerStrength;
    const pointerOffsetY = pointerY * (mobile ? 0 : 7) * pointerStrength;
    const rotateY = ((pointerX * 1.8) + mix(-2.3, .7, hero)) * pointerStrength;
    const rotateX = ((-pointerY * 1.25) + mix(1.5, -.35, hero)) * pointerStrength;

    productWrap.style.opacity = reveal.toFixed(3);
    productWrap.style.transform = `translate(calc(-50% + ${x.toFixed(1)}px),calc(-50% + ${(y + pointerOffsetY).toFixed(1)}px)) scale(${scale.toFixed(4)}) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;

    const blur = mix(11.5, 0, reveal);
    const brightness = mix(.40, 1.04, reveal);
    const saturation = mix(.70, 1.03, reveal);
    product.style.opacity = reveal.toFixed(3);
    product.style.filter = `blur(${blur.toFixed(2)}px) brightness(${brightness.toFixed(3)}) saturate(${saturation.toFixed(3)}) drop-shadow(0 36px 58px rgba(0,0,0,.60)) drop-shadow(0 0 30px rgba(222,181,93,.14))`;

    if (productGlow) {
      const glowStrength = Math.max(reveal * .42, hero * .84) * mix(1, .72, landing);
      productGlow.style.opacity = String(glowStrength);
      productGlow.style.transform = `translate(-50%,-50%) scale(${mix(.72,1.12,hero).toFixed(4)})`;
    }

    if (productShadow) {
      const contact = Math.max(landing * .78, settle * .96);
      productShadow.style.opacity = String(contact);
      productShadow.style.transform = `translateX(-50%) scale(${mix(.52,1.06,contact).toFixed(4)})`;
      productShadow.style.filter = `blur(${mix(16,5.5,contact).toFixed(1)}px)`;
    }

    if (finalCopy) {
      finalCopy.style.opacity = finale.toFixed(3);
      if (mobile) {
        finalCopy.style.transform = `translate(-50%,${mix(20,0,finale).toFixed(1)}px)`;
      } else {
        finalCopy.style.transform = `translateY(${mix(20,0,finale).toFixed(1)}px)`;
      }
    }

    if (progressBar) progressBar.style.transform = `scaleY(${p.toFixed(4)})`;
    if (scrollLabel) scrollLabel.style.opacity = String(1 - seg(p, .68, .86));
    root.classList.toggle('is-landed', p > .92);
  }

  function tick() {
    raf = 0;
    const delta = target - current;
    current += delta * (reducedMotion ? 1 : .12);
    if (Math.abs(delta) < .00045) current = target;
    frame(current);
    if (current !== target) raf = requestAnimationFrame(tick);
  }

  function schedule() {
    if (!raf) raf = requestAnimationFrame(tick);
  }

  function updateFromScroll() {
    if (debugFrame !== null || reducedMotion || !active) return;
    target = clamp((window.scrollY - sectionTop) / scrollRange);
    schedule();
  }

  function remeasure() {
    measure();
    if (debugFrame !== null) {
      current = target = debugFrame;
      frame(debugFrame);
      return;
    }
    if (!reducedMotion) updateFromScroll();
    else frame(1);
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      active = entries[0]?.isIntersecting ?? true;
      if (active) updateFromScroll();
    }, { rootMargin: '25% 0px 25% 0px', threshold: [0, .01, .1] });
    observer.observe(root);
  }

  if (finePointer && !reducedMotion && debugFrame === null) {
    root.addEventListener('pointermove', (event) => {
      pointerX = clamp((event.clientX / window.innerWidth) * 2 - 1, -1, 1);
      pointerY = clamp((event.clientY / window.innerHeight) * 2 - 1, -1, 1);
      schedule();
    }, { passive: true });
    root.addEventListener('pointerleave', () => {
      pointerX = 0;
      pointerY = 0;
      schedule();
    }, { passive: true });
  }

  if (debugFrame === null) {
    window.addEventListener('scroll', updateFromScroll, { passive: true });
  }
  window.addEventListener('resize', remeasure, { passive: true });
  window.addEventListener('orientationchange', remeasure, { passive: true });
  window.addEventListener('pageshow', remeasure, { passive: true });
  window.visualViewport?.addEventListener('resize', remeasure, { passive: true });

  if ('ResizeObserver' in window) {
    const resizeObserver = new ResizeObserver(() => remeasure());
    resizeObserver.observe(root);
  }

  if (product.decode) {
    product.decode().catch(() => {}).finally(remeasure);
  }
  document.fonts?.ready?.then(remeasure).catch(() => {});

  measure();
  frame(current);
  if (debugFrame !== null) {
    root.dataset.debugFrame = debugFrame.toFixed(3);
  } else if (!reducedMotion) {
    updateFromScroll();
  }
})();
