(() => {
  'use strict';

  const flavors = [
    { id: 'original', name: 'Original · menta y lima', description: 'Fresco. Clásico. Inconfundible.', rgb: '111,139,55' },
    { id: 'fresa', name: 'Fresa', description: 'Dulce, fresco y vibrante.', rgb: '165,66,68' },
    { id: 'frutos-bosque', name: 'Frutos del bosque', description: 'Intenso, profundo y afrutado.', rgb: '95,45,64' },
    { id: 'pina', name: 'Piña', description: 'Tropical, luminoso y refrescante.', rgb: '180,139,55' },
    { id: 'coco', name: 'Coco', description: 'Suave, cremoso y delicado.', rgb: '190,176,145' },
    { id: 'pina-colada', name: 'Piña colada', description: 'Tropical, suave y envolvente.', rgb: '188,151,74' },
    { id: 'maracuya', name: 'Maracuyá', description: 'Exótico, fresco y con carácter.', rgb: '184,112,46' },
    { id: 'mango', name: 'Mango', description: 'Redondo, tropical y jugoso.', rgb: '197,116,43' },
    { id: 'frambuesa', name: 'Frambuesa', description: 'Fresco, intenso y afrutado.', rgb: '157,52,72' },
    { id: 'melocoton', name: 'Melocotón', description: 'Suave, afrutado y ligero.', rgb: '193,126,91' },
    { id: 'sandia', name: 'Sandía', description: 'Ligero, fresco y muy fácil de beber.', rgb: '177,73,69' },
    { id: 'cereza', name: 'Cereza', description: 'Profundo, dulce y elegante.', rgb: '119,42,48' },
    { id: 'manzana-verde', name: 'Manzana verde', description: 'Crujiente, fresco y vivaz.', rgb: '91,143,65' },
    { id: 'uva', name: 'Uva', description: 'Aromático, suave y distinto.', rgb: '91,61,115' }
  ];

  const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  const section = document.querySelector('[data-mojito-section]');
  const image = document.querySelector('[data-mojito-image]');
  const nameNode = document.querySelector('[data-flavor-name]');
  const descriptionNode = document.querySelector('[data-flavor-description]');
  const chips = Array.from(document.querySelectorAll('[data-flavor]'));
  const rail = document.querySelector('[data-flavor-rail]');
  const prev = document.querySelector('[data-mojito-prev]');
  const next = document.querySelector('[data-mojito-next]');
  let activeIndex = 0;
  let swapTimer = 0;
  let assetsWarmed = false;

  function assetFor(id) {
    return `assets/mojitos/mojito-${id}-stable.webp?v=1.1.1`;
  }

  function warmFlavorAssets() {
    if (assetsWarmed) return;
    assetsWarmed = true;

    flavors.forEach((flavor, index) => {
      if (index === 0) return;
      const preload = new Image();
      preload.decoding = 'async';
      preload.src = assetFor(flavor.id);
    });
  }

  if (section && 'IntersectionObserver' in window) {
    const preloadObserver = new IntersectionObserver((entries, observer) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      warmFlavorAssets();
      observer.disconnect();
    }, { rootMargin: '0px' });
    preloadObserver.observe(section);
  } else {
    window.setTimeout(warmFlavorAssets, 1200);
  }

  window.addEventListener('load', () => window.setTimeout(warmFlavorAssets, 2600), { once: true });

  function centerChipInRail(chip, behavior = reducedMotion ? 'auto' : 'smooth') {
    if (!rail || !chip || rail.scrollWidth <= rail.clientWidth) return;

    const railRect = rail.getBoundingClientRect();
    const chipRect = chip.getBoundingClientRect();
    const current = rail.scrollLeft;
    const chipCenterInsideRail = (chipRect.left - railRect.left) + (chipRect.width / 2);
    const target = current + chipCenterInsideRail - (rail.clientWidth / 2);
    const max = Math.max(0, rail.scrollWidth - rail.clientWidth);

    rail.scrollTo({
      left: Math.max(0, Math.min(max, target)),
      behavior
    });
  }

  function setFlavor(index, options = {}) {
    if (!section || !image || !nameNode || !descriptionNode || !chips.length) return;

    warmFlavorAssets();
    activeIndex = (index + flavors.length) % flavors.length;
    const flavor = flavors[activeIndex];
    const activeChip = chips.find((chip) => chip.dataset.flavor === flavor.id);

    section.style.setProperty('--flavor-rgb', flavor.rgb);
    image.classList.add('is-changing');
    nameNode.style.opacity = '0';
    descriptionNode.style.opacity = '0';

    window.clearTimeout(swapTimer);
    swapTimer = window.setTimeout(() => {
      image.src = assetFor(flavor.id);
      image.alt = `Mojito ${flavor.name}`;
      nameNode.textContent = flavor.name;
      descriptionNode.textContent = flavor.description;

      chips.forEach((chip) => {
        const selected = chip.dataset.flavor === flavor.id;
        chip.classList.toggle('is-active', selected);
        chip.setAttribute('aria-selected', String(selected));
        chip.tabIndex = selected ? 0 : -1;
      });

      requestAnimationFrame(() => {
        image.classList.remove('is-changing');
        nameNode.style.opacity = '1';
        descriptionNode.style.opacity = '1';

        if (options.scrollChip !== false && activeChip && rail) {
          centerChipInRail(activeChip);
        }
      });
    }, reducedMotion ? 0 : 165);
  }

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const index = flavors.findIndex((flavor) => flavor.id === chip.dataset.flavor);
      if (index >= 0) setFlavor(index);
    });
  });

  prev?.addEventListener('click', () => setFlavor(activeIndex - 1));
  next?.addEventListener('click', () => setFlavor(activeIndex + 1));

  document.addEventListener('keydown', (event) => {
    if (!section || document.documentElement.classList.contains('menu-open')) return;
    const rect = section.getBoundingClientRect();
    const visible = rect.bottom > 0 && rect.top < window.innerHeight;
    if (!visible) return;

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      setFlavor(activeIndex - 1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      setFlavor(activeIndex + 1);
    }
  });

  const trigger = document.querySelector('[data-menu-trigger]');
  const layer = document.querySelector('[data-menu-layer]');
  const dismiss = document.querySelector('[data-menu-dismiss]');
  const closeButton = document.querySelector('[data-menu-close]');
  const card = layer?.querySelector('.lav-nav-card') ?? null;
  const menuLinks = layer ? Array.from(layer.querySelectorAll('nav a')) : [];
  const main = document.querySelector('main');
  const bottomCta = document.querySelector('.bottom-cta');
  const footer = document.querySelector('footer');
  let previouslyFocused = null;

  layer?.setAttribute('role', 'dialog');
  layer?.setAttribute('aria-modal', 'true');
  layer?.setAttribute('aria-label', 'Menú de navegación');
  if (dismiss) {
    dismiss.tabIndex = -1;
    dismiss.setAttribute('aria-hidden', 'true');
  }

  function setBackgroundInert(state) {
    [main, bottomCta, footer].forEach((node) => {
      if (node && 'inert' in node) node.inert = state;
    });
  }

  function menuFocusables() {
    if (!card) return [];
    return Array.from(card.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'))
      .filter((node) => !node.hidden && node.getAttribute('aria-hidden') !== 'true');
  }

  function openMenu() {
    if (!trigger || !layer) return;
    previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : trigger;
    layer.hidden = false;
    trigger.setAttribute('aria-expanded', 'true');
    document.documentElement.classList.add('menu-open');
    setBackgroundInert(true);

    requestAnimationFrame(() => {
      const target = closeButton || menuFocusables()[0];
      target?.focus({ preventScroll: true });
    });
  }

  function closeMenu({ restoreFocus = true } = {}) {
    if (!trigger || !layer) return;
    layer.hidden = true;
    trigger.setAttribute('aria-expanded', 'false');
    document.documentElement.classList.remove('menu-open');
    setBackgroundInert(false);

    if (restoreFocus) {
      const target = previouslyFocused?.isConnected ? previouslyFocused : trigger;
      target?.focus({ preventScroll: true });
    }
  }

  trigger?.addEventListener('click', () => {
    const open = trigger.getAttribute('aria-expanded') === 'true';
    open ? closeMenu({ restoreFocus: false }) : openMenu();
  });
  dismiss?.addEventListener('click', () => closeMenu());
  closeButton?.addEventListener('click', () => closeMenu());
  menuLinks.forEach((link) => link.addEventListener('click', () => closeMenu()));

  document.addEventListener('keydown', (event) => {
    const menuOpen = trigger?.getAttribute('aria-expanded') === 'true';
    if (!menuOpen) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      closeMenu();
      return;
    }

    if (event.key !== 'Tab' || !card) return;
    const focusables = menuFocusables();
    if (!focusables.length) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = document.activeElement;

    if (!card.contains(active)) {
      event.preventDefault();
      first.focus();
    } else if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  });

  document.addEventListener('pointerdown', (event) => {
    if (!layer || layer.hidden || !trigger || !card) return;
    if (!card.contains(event.target) && !trigger.contains(event.target) && event.target !== dismiss) {
      closeMenu();
    }
  });

  chips.forEach((chip, index) => {
    chip.tabIndex = index === 0 ? 0 : -1;
  });
})();
