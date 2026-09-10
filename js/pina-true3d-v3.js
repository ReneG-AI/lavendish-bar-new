import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const root = document.querySelector('[data-p3d]');
if (!root) throw new Error('LAVENDISH v3 root not found.');

const canvas = root.querySelector('[data-canvas]');
const terrace = root.querySelector('[data-terrace]');
const haze = root.querySelector('[data-haze]');
const introCopy = root.querySelector('[data-intro-copy]');
const finalCopy = root.querySelector('[data-final-copy]');
const progressBar = root.querySelector('[data-progress]');
const actLabel = root.querySelector('[data-act]');
const status = root.querySelector('[data-status]');
const statusTitle = root.querySelector('[data-status-title]');
const statusCopy = root.querySelector('[data-status-copy]');

const MODEL_URL = 'assets/3d/pina-colada-v3.glb';
const FALLBACK_URL = 'preview-cinematic-v2.html';

const motionQuery = matchMedia('(prefers-reduced-motion: reduce)');
const reducedMotion = motionQuery.matches;
const saveData = navigator.connection?.saveData === true;
const mobile = matchMedia('(max-width: 899px)').matches;
const rawFrame = new URLSearchParams(location.search).get('frame');
const parsedFrame = rawFrame === null ? NaN : Number(rawFrame);
const debugFrame = Number.isFinite(parsedFrame) ? THREE.MathUtils.clamp(parsedFrame, 0, 1) : null;

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const mix = THREE.MathUtils.lerp;
const smooth = (v) => {
  const x = clamp(v);
  return x * x * (3 - 2 * x);
};
const smoother = (v) => {
  const x = clamp(v);
  return x * x * x * (x * (x * 6 - 15) + 10);
};
const seg = (p, start, end, ease = smooth) => ease((p - start) / (end - start));

const showStatus = (title, copy, mode = 'asset-pending') => {
  document.body.dataset.p3dMode = mode;
  status.hidden = false;
  statusTitle.textContent = title;
  statusCopy.textContent = copy;
};

const fallback = (reason) => {
  showStatus('Usando fallback cinematográfico', reason, 'fallback');
  status.querySelector('a').href = FALLBACK_URL;
};

if (saveData) {
  fallback('El navegador tiene Save-Data activo. La versión 3D no se fuerza en este dispositivo.');
  throw new Error('Save-Data fallback');
}

let renderer;
try {
  renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: !mobile,
    powerPreference: 'high-performance',
    stencil: false
  });
} catch (error) {
  fallback('WebGL no se ha podido inicializar. Se mantiene disponible la experiencia v2.');
  throw error;
}

renderer.setPixelRatio(Math.min(devicePixelRatio || 1, mobile ? 1.25 : 1.75));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = mobile ? 1.02 : 1.08;
renderer.shadowMap.enabled = !mobile;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(mobile ? 34 : 31, 1, 0.02, 100);
camera.position.set(0, mobile ? 0.1 : 0.18, mobile ? 5.7 : 5.25);

const pmrem = new THREE.PMREMGenerator(renderer);
const roomEnvironment = new RoomEnvironment();
scene.environment = pmrem.fromScene(roomEnvironment, 0.04).texture;
roomEnvironment.dispose();
pmrem.dispose();

scene.add(new THREE.HemisphereLight(0x8796b8, 0x19110d, mobile ? 0.95 : 0.8));

const key = new THREE.SpotLight(0xc9d8ff, mobile ? 24 : 34, 12, Math.PI / 5.2, 0.48, 1.5);
key.position.set(-2.7, 4.4, 3.9);
key.target.position.set(0, 0.8, 0);
key.castShadow = !mobile;
scene.add(key, key.target);

const warm = new THREE.SpotLight(0xffbd74, mobile ? 14 : 20, 11, Math.PI / 4.5, 0.55, 1.3);
warm.position.set(3.2, 1.8, 3.2);
warm.target.position.set(0, 0.5, 0);
scene.add(warm, warm.target);

const rim = new THREE.DirectionalLight(0xd8e2ff, mobile ? 1.3 : 1.8);
rim.position.set(2.8, 3.2, -3);
scene.add(rim);

const floor = new THREE.Mesh(
  new THREE.CircleGeometry(2.2, 64),
  new THREE.ShadowMaterial({ color: 0x000000, opacity: mobile ? 0 : 0.26 })
);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -1.68;
floor.receiveShadow = !mobile;
scene.add(floor);

const productRoot = new THREE.Group();
scene.add(productRoot);

const state = {
  sectionTop: 0,
  scrollRange: 1,
  target: debugFrame ?? (reducedMotion ? 1 : 0),
  current: debugFrame ?? (reducedMotion ? 1 : 0),
  raf: 0,
  active: true,
  model: null,
  modelBaseY: -0.05,
  nodes: null,
  initial: new Map()
};

function remember(object) {
  state.initial.set(object, {
    position: object.position.clone(),
    quaternion: object.quaternion.clone(),
    scale: object.scale.clone()
  });
}

function restore(object) {
  const initial = state.initial.get(object);
  if (!initial) return;
  object.position.copy(initial.position);
  object.quaternion.copy(initial.quaternion);
  object.scale.copy(initial.scale);
  object.visible = true;
}

function tuneMaterial(material, nodeName) {
  if (!material) return;
  material.envMapIntensity = Math.max(material.envMapIntensity ?? 1, 1.15);

  if (/glass/i.test(nodeName)) {
    material.transparent = true;
    material.depthWrite = false;
    material.metalness = 0;
    material.roughness = Math.min(material.roughness ?? 0.12, 0.16);
    if ('transmission' in material) material.transmission = Math.max(material.transmission ?? 0, 0.86);
    if ('ior' in material) material.ior = 1.45;
    if ('thickness' in material) material.thickness = Math.max(material.thickness ?? 0, 0.08);
  } else if (/ice/i.test(nodeName)) {
    material.transparent = true;
    material.metalness = 0;
    material.roughness = Math.min(material.roughness ?? 0.24, 0.28);
    if ('transmission' in material) material.transmission = Math.max(material.transmission ?? 0, 0.52);
  } else if (/liquid/i.test(nodeName)) {
    material.metalness = 0;
    material.roughness = Math.max(material.roughness ?? 0.3, 0.22);
  } else if (/foam/i.test(nodeName)) {
    material.metalness = 0;
    material.roughness = Math.max(material.roughness ?? 0.55, 0.5);
  }
  material.needsUpdate = true;
}

function normalizeModel(model) {
  const box = new THREE.Box3().setFromObject(model);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const targetHeight = mobile ? 3.75 : 4.05;
  const scale = targetHeight / Math.max(size.y, 0.001);
  model.scale.setScalar(scale);
  model.position.set(-center.x * scale, -center.y * scale + state.modelBaseY, -center.z * scale);
  model.updateMatrixWorld(true);
}

function collectNodes(model) {
  const exact = {};
  const ice = [];
  model.traverse((object) => {
    if (!object.name) return;
    if (/^Ice_\d+$/i.test(object.name)) ice.push(object);
    else exact[object.name] = object;

    if (object.isMesh) {
      object.castShadow = !mobile;
      object.receiveShadow = !mobile;
      const mats = Array.isArray(object.material) ? object.material : [object.material];
      mats.forEach((material) => tuneMaterial(material, object.name));
    }
  });

  const required = ['Glass', 'Liquid', 'Foam', 'Straw', 'Pineapple', 'Cherry'];
  const missing = required.filter((name) => !exact[name]);
  if (!ice.length) missing.push('Ice_01...Ice_N');
  if (missing.length) {
    throw new Error(`GLB node contract failed. Missing: ${missing.join(', ')}`);
  }

  ice.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
  const nodes = { ...exact, Ice: ice };
  [exact.Glass, exact.Liquid, exact.Foam, exact.Straw, exact.Pineapple, exact.Cherry, ...ice].forEach(remember);
  return nodes;
}

function fitRenderer() {
  const w = root.clientWidth;
  const h = window.visualViewport?.height || innerHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / Math.max(h, 1);
  camera.updateProjectionMatrix();
  state.sectionTop = root.getBoundingClientRect().top + scrollY;
  state.scrollRange = Math.max(1, root.offsetHeight - h);
}

function placeNode(object, progress, from) {
  restore(object);
  object.visible = progress > 0.001;
  object.position.x += mix(from.x, 0, progress);
  object.position.y += mix(from.y, 0, progress);
  object.position.z += mix(from.z, 0, progress);
  object.scale.multiplyScalar(Math.max(0.001, progress));
  object.rotation.x += mix(from.rx, 0, progress);
  object.rotation.y += mix(from.ry, 0, progress);
  object.rotation.z += mix(from.rz, 0, progress);
}

function updateActs(p) {
  const label =
    p < .12 ? 'ATMOSPHERE' :
    p < .25 ? 'GLASS' :
    p < .42 ? 'ICE' :
    p < .58 ? 'LIQUID' :
    p < .72 ? 'FOAM · GARNISH' :
    p < .82 ? 'HERO' :
    p < .94 ? 'TERRACE' : 'LANDING';
  if (actLabel.textContent !== label) actLabel.textContent = label;
}

function frame(progress) {
  const p = clamp(progress);
  updateActs(p);
  progressBar.style.transform = `scaleY(${p.toFixed(4)})`;

  const introOut = seg(p, .05, .20);
  introCopy.style.opacity = String(1 - introOut);
  introCopy.style.transform = mobile
    ? `translateX(-50%) translateY(${mix(0, -16, introOut).toFixed(1)}px)`
    : `translateY(calc(-50% + ${mix(0, -20, introOut).toFixed(1)}px))`;

  const terraceIn = seg(p, .80, .95, smoother);
  terrace.style.opacity = terraceIn.toFixed(3);
  terrace.style.transform = `scale(${mix(1.06, 1, terraceIn).toFixed(4)}) translateY(${mix(24, 0, terraceIn).toFixed(1)}px)`;
  haze.style.opacity = String(mix(.68, .22, seg(p, .58, .92)));

  const finalIn = seg(p, .91, .995, smoother);
  finalCopy.style.opacity = finalIn.toFixed(3);
  finalCopy.style.transform = mobile
    ? `translateX(-50%) translateY(${mix(18, 0, finalIn).toFixed(1)}px)`
    : `translateY(${mix(18, 0, finalIn).toFixed(1)}px)`;

  if (!state.nodes || !state.model) {
    renderer.render(scene, camera);
    return;
  }

  const glassP = seg(p, .10, .25, smoother);
  const iceP = seg(p, .20, .42, smoother);
  const liquidP = seg(p, .34, .58, smoother);
  const foamP = seg(p, .52, .66, smoother);
  const garnishP = seg(p, .58, .72, smoother);
  const heroP = seg(p, .70, .82, smoother);
  const landingP = seg(p, .82, .985, smoother);
  const settleP = seg(p, .95, 1, smoother);

  placeNode(state.nodes.Glass, glassP, { x: -.7, y: .45, z: .35, rx: .10, ry: -.22, rz: -.08 });

  state.nodes.Ice.forEach((ice, index) => {
    const n = state.nodes.Ice.length;
    const local = seg(iceP, index / Math.max(n, 1) * .58, Math.min(1, index / Math.max(n, 1) * .58 + .42), smoother);
    const side = index % 2 ? 1 : -1;
    placeNode(ice, local, {
      x: side * (.65 + index * .06),
      y: .9 + (index % 3) * .25,
      z: .25 + (index % 2) * .22,
      rx: side * .55,
      ry: .35 + index * .17,
      rz: side * .38
    });
  });

  restore(state.nodes.Liquid);
  state.nodes.Liquid.visible = liquidP > .001;
  const liquidInitial = state.initial.get(state.nodes.Liquid);
  state.nodes.Liquid.scale.y = liquidInitial.scale.y * Math.max(.002, liquidP);
  state.nodes.Liquid.scale.x = liquidInitial.scale.x * mix(.985, 1, liquidP);
  state.nodes.Liquid.scale.z = liquidInitial.scale.z * mix(.985, 1, liquidP);

  placeNode(state.nodes.Foam, foamP, { x: 0, y: .35, z: .05, rx: 0, ry: .10, rz: 0 });
  placeNode(state.nodes.Straw, garnishP, { x: .35, y: .95, z: .2, rx: -.26, ry: .22, rz: .16 });
  placeNode(state.nodes.Pineapple, garnishP, { x: -.85, y: .48, z: .25, rx: .18, ry: -.35, rz: -.22 });
  placeNode(state.nodes.Cherry, seg(p, .64, .73, smoother), { x: .42, y: .55, z: .4, rx: -.18, ry: .30, rz: .12 });

  const heroOrbit = Math.sin(heroP * Math.PI) * (mobile ? .025 : .045);
  productRoot.rotation.y = heroOrbit;
  productRoot.position.y = mix(0, -1.02, landingP) - mix(0, .035, settleP);
  productRoot.position.z = mix(0, .18, landingP);
  productRoot.scale.setScalar(mix(1, .96, landingP));

  camera.position.z = mix(mobile ? 5.7 : 5.25, mobile ? 5.45 : 4.86, heroP);
  camera.position.x = mix(0, mobile ? 0 : .12, heroP) * (1 - landingP);
  camera.lookAt(0, mix(.10, -.30, landingP), 0);

  key.intensity = mix(mobile ? 24 : 34, mobile ? 20 : 29, terraceIn);
  warm.intensity = mix(mobile ? 14 : 20, mobile ? 23 : 31, terraceIn);

  renderer.render(scene, camera);
}

function tick() {
  state.raf = 0;
  const delta = state.target - state.current;
  state.current += delta * (reducedMotion ? 1 : .115);
  if (Math.abs(delta) < .00045) state.current = state.target;
  frame(state.current);
  if (state.current !== state.target) state.raf = requestAnimationFrame(tick);
}

function schedule() {
  if (!state.raf) state.raf = requestAnimationFrame(tick);
}

function updateFromScroll() {
  if (debugFrame !== null || reducedMotion || !state.active) return;
  state.target = clamp((scrollY - state.sectionTop) / state.scrollRange);
  schedule();
}

async function loadModel() {
  let head;
  try {
    head = await fetch(MODEL_URL, { method: 'HEAD', cache: 'no-store' });
  } catch {
    head = null;
  }
  if (!head?.ok) {
    showStatus(
      '3D asset pendiente',
      'El preview v3 está preparado, pero no existe todavía un GLB aprobado en assets/3d/pina-colada-v3.glb. No se genera una copa falsa para sustituirlo.'
    );
    frame(state.current);
    return;
  }

  const loader = new GLTFLoader();
  loader.load(
    MODEL_URL,
    (gltf) => {
      try {
        state.model = gltf.scene;
        productRoot.add(state.model);
        normalizeModel(state.model);
        state.nodes = collectNodes(state.model);
        root.classList.add('is-loaded');
        document.body.dataset.p3dMode = 'webgl';
        status.hidden = true;
        frame(state.current);
      } catch (error) {
        showStatus('GLB rechazado', error.message);
      }
    },
    undefined,
    (error) => showStatus('Error cargando GLB', error?.message || 'No se pudo cargar el modelo 3D.')
  );
}

if ('IntersectionObserver' in window) {
  new IntersectionObserver((entries) => {
    state.active = entries[0]?.isIntersecting ?? true;
    if (state.active) {
      updateFromScroll();
      schedule();
    }
  }, { rootMargin: '20% 0px', threshold: [0, .01] }).observe(root);
}

window.addEventListener('scroll', updateFromScroll, { passive: true });
window.addEventListener('resize', () => {
  fitRenderer();
  updateFromScroll();
  schedule();
}, { passive: true });
window.visualViewport?.addEventListener('resize', () => {
  fitRenderer();
  updateFromScroll();
  schedule();
}, { passive: true });

fitRenderer();
frame(state.current);

if (debugFrame !== null) {
  root.dataset.debugFrame = debugFrame.toFixed(3);
} else if (reducedMotion) {
  state.current = state.target = 1;
  frame(1);
} else {
  updateFromScroll();
}

loadModel();
