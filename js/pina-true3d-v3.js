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
const mobile = matchMedia('(max-width: 899px)').matches;
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const saveData = navigator.connection?.saveData === true;
const rawFrame = new URLSearchParams(location.search).get('frame');
const parsedFrame = rawFrame === null ? NaN : Number(rawFrame);
const debugFrame = Number.isFinite(parsedFrame) ? THREE.MathUtils.clamp(parsedFrame, 0, 1) : null;

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const mix = THREE.MathUtils.lerp;
const smooth = (v) => { const x = clamp(v); return x * x * (3 - 2 * x); };
const smoother = (v) => { const x = clamp(v); return x * x * x * (x * (x * 6 - 15) + 10); };
const seg = (p, start, end, ease = smooth) => ease((p - start) / (end - start));

function showStatus(title, copy, mode = 'asset-pending') {
  document.body.dataset.p3dMode = mode;
  status.hidden = false;
  statusTitle.textContent = title;
  statusCopy.textContent = copy;
  const link = status.querySelector('a');
  if (link) link.href = FALLBACK_URL;
}

function fallback(reason) {
  showStatus('Usando fallback cinematográfico', reason, 'fallback');
}

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
renderer.toneMappingExposure = mobile ? 1.04 : 1.10;
renderer.shadowMap.enabled = !mobile;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(mobile ? 36 : 32, 1, 0.02, 100);
const cameraStartZ = mobile ? 6.8 : 6.5;
const cameraHeroZ = mobile ? 6.35 : 5.95;
camera.position.set(0, mobile ? 0.12 : 0.18, cameraStartZ);

const pmrem = new THREE.PMREMGenerator(renderer);
const roomEnvironment = new RoomEnvironment();
scene.environment = pmrem.fromScene(roomEnvironment, 0.035).texture;
roomEnvironment.dispose();
pmrem.dispose();

scene.add(new THREE.HemisphereLight(0x8fa4cb, 0x1a120f, mobile ? 0.88 : 0.76));

const key = new THREE.SpotLight(0xd5e2ff, mobile ? 21 : 30, 14, Math.PI / 5.1, 0.48, 1.45);
key.position.set(-2.9, 4.5, 4.2);
key.target.position.set(0, 0.75, 0);
key.castShadow = !mobile;
if (!mobile) {
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.bias = -0.00025;
}
scene.add(key, key.target);

const warm = new THREE.SpotLight(0xffbd74, mobile ? 13 : 18, 12, Math.PI / 4.4, 0.55, 1.25);
warm.position.set(3.3, 1.9, 3.5);
warm.target.position.set(0, 0.45, 0);
scene.add(warm, warm.target);

const rim = new THREE.DirectionalLight(0xdce7ff, mobile ? 1.0 : 1.55);
rim.position.set(2.4, 3.8, -3.5);
scene.add(rim);

const floorY = -1.68;
const floor = new THREE.Mesh(
  new THREE.CircleGeometry(1.65, 64),
  new THREE.ShadowMaterial({ color: 0x000000, opacity: mobile ? 0 : 0.28 })
);
floor.rotation.x = -Math.PI / 2;
floor.position.y = floorY;
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
  nodes: null,
  initial: new Map(),
  heroBottom: mobile ? -1.10 : -1.22,
  landingOffset: 0
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
  material.envMapIntensity = Math.max(material.envMapIntensity ?? 1, 1.18);

  if (/glass/i.test(nodeName)) {
    material.transparent = true;
    material.depthWrite = false;
    material.metalness = 0;
    material.roughness = Math.min(material.roughness ?? 0.08, 0.11);
    if ('transmission' in material) material.transmission = Math.max(material.transmission ?? 0, 0.96);
    if ('ior' in material) material.ior = 1.45;
    if ('thickness' in material) material.thickness = Math.max(material.thickness ?? 0, 0.055);
    material.envMapIntensity = Math.max(material.envMapIntensity, 1.38);
  } else if (/ice/i.test(nodeName)) {
    material.transparent = true;
    material.depthWrite = false;
    material.metalness = 0;
    material.roughness = Math.min(material.roughness ?? 0.16, 0.22);
    if ('transmission' in material) material.transmission = Math.max(material.transmission ?? 0, 0.72);
    if ('ior' in material) material.ior = 1.31;
  } else if (/condensation/i.test(nodeName)) {
    material.transparent = true;
    material.depthWrite = false;
    if ('transmission' in material) material.transmission = Math.max(material.transmission ?? 0, 0.88);
  } else if (/liquid/i.test(nodeName)) {
    material.metalness = 0;
    material.roughness = Math.max(0.24, Math.min(material.roughness ?? 0.3, 0.36));
    material.envMapIntensity = Math.max(material.envMapIntensity, 1.05);
  } else if (/foam/i.test(nodeName)) {
    material.metalness = 0;
    material.roughness = Math.max(material.roughness ?? 0.6, 0.58);
  }
  material.needsUpdate = true;
}

function normalizeModel(model) {
  const box = new THREE.Box3().setFromObject(model);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const targetHeight = mobile ? 3.55 : 3.18;
  const s = targetHeight / Math.max(size.y, 0.001);

  model.scale.setScalar(s);
  model.position.set(
    -center.x * s,
    state.heroBottom - box.min.y * s,
    -center.z * s
  );
  model.updateMatrixWorld(true);
  state.landingOffset = floorY - state.heroBottom;
}

function collectNodes(model) {
  const exact = {};
  const ice = [];

  model.traverse((object) => {
    if (object.name) {
      if (/^Ice_\d+$/i.test(object.name)) ice.push(object);
      else exact[object.name] = object;
    }

    if (object.isMesh) {
      object.castShadow = !mobile;
      object.receiveShadow = !mobile;
      const materials = Array.isArray(object.material) ? object.material : [object.material];
      materials.forEach((material) => tuneMaterial(material, object.name));
    }
  });

  const required = ['Glass', 'Liquid', 'Foam', 'Straw', 'Pineapple', 'Cherry'];
  const missing = required.filter((name) => !exact[name]);
  if (!ice.length) missing.push('Ice_01...Ice_N');
  if (missing.length) throw new Error(`GLB node contract failed. Missing: ${missing.join(', ')}`);

  ice.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
  const nodes = { ...exact, Ice: ice };
  [exact.Glass, exact.Liquid, exact.Foam, exact.Straw, exact.Pineapple, exact.Cherry, exact.Condensation, ...ice]
    .filter(Boolean)
    .forEach(remember);
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

function placeNode(object, progress, from, scaleFrom = 0.2) {
  restore(object);
  object.visible = progress > 0.001;
  object.position.x += mix(from.x, 0, progress);
  object.position.y += mix(from.y, 0, progress);
  object.position.z += mix(from.z, 0, progress);
  object.scale.multiplyScalar(mix(scaleFrom, 1, progress));
  object.rotation.x += mix(from.rx, 0, progress);
  object.rotation.y += mix(from.ry, 0, progress);
  object.rotation.z += mix(from.rz, 0, progress);
}

function updateActs(p) {
  const label = p < .12 ? 'ATMOSPHERE' : p < .25 ? 'GLASS' : p < .42 ? 'ICE' : p < .58 ? 'LIQUID' : p < .72 ? 'FOAM · GARNISH' : p < .82 ? 'HERO' : p < .94 ? 'TERRACE' : 'LANDING';
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
  haze.style.opacity = String(mix(.70, .20, seg(p, .58, .92)));

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
  const cherryP = seg(p, .64, .73, smoother);
  const heroP = seg(p, .70, .82, smoother);
  const landingP = seg(p, .82, .985, smoother);
  const settleP = seg(p, .95, 1, smoother);

  placeNode(state.nodes.Glass, glassP, { x: -.52, y: .34, z: .28, rx: .08, ry: -.20, rz: -.06 }, .82);

  state.nodes.Ice.forEach((ice, index) => {
    const n = state.nodes.Ice.length;
    const start = index / Math.max(n, 1) * .56;
    const local = seg(iceP, start, Math.min(1, start + .44), smoother);
    const side = index % 2 ? 1 : -1;
    placeNode(ice, local, {
      x: side * (.48 + index * .045),
      y: .72 + (index % 3) * .18,
      z: .22 + (index % 2) * .18,
      rx: side * .46,
      ry: .30 + index * .14,
      rz: side * .32
    }, .56);
  });

  restore(state.nodes.Liquid);
  state.nodes.Liquid.visible = liquidP > .001;
  const liquidInitial = state.initial.get(state.nodes.Liquid);
  state.nodes.Liquid.scale.y = liquidInitial.scale.y * Math.max(.001, liquidP);
  state.nodes.Liquid.scale.x = liquidInitial.scale.x * mix(.986, 1, liquidP);
  state.nodes.Liquid.scale.z = liquidInitial.scale.z * mix(.986, 1, liquidP);

  placeNode(state.nodes.Foam, foamP, { x: 0, y: .26, z: .03, rx: 0, ry: .08, rz: 0 }, .72);
  placeNode(state.nodes.Straw, garnishP, { x: .28, y: .72, z: .18, rx: -.18, ry: .18, rz: .12 }, .72);
  placeNode(state.nodes.Pineapple, garnishP, { x: -.62, y: .34, z: .22, rx: .12, ry: -.28, rz: -.17 }, .64);
  placeNode(state.nodes.Cherry, cherryP, { x: -.25, y: .42, z: .30, rx: -.14, ry: .22, rz: .08 }, .58);

  if (state.nodes.Condensation) {
    const condensationP = seg(p, .64, .78, smoother);
    placeNode(state.nodes.Condensation, condensationP, { x: 0, y: .08, z: .04, rx: 0, ry: 0, rz: 0 }, .86);
  }

  const heroOrbit = Math.sin(heroP * Math.PI) * (mobile ? .018 : .036);
  productRoot.rotation.y = heroOrbit * (1 - landingP);
  productRoot.position.y = mix(0, state.landingOffset, landingP) - mix(0, .018, settleP);
  productRoot.position.z = mix(0, .10, landingP);
  const landingScale = mix(1, .985, landingP);
  productRoot.scale.set(landingScale, landingScale * mix(1, .996, settleP), landingScale);

  camera.position.z = mix(cameraStartZ, cameraHeroZ, heroP);
  camera.position.x = mix(0, mobile ? 0 : .10, heroP) * (1 - landingP);
  camera.lookAt(0, mix(.22, -.12, landingP), 0);

  key.intensity = mix(mobile ? 21 : 30, mobile ? 18 : 25, terraceIn);
  warm.intensity = mix(mobile ? 13 : 18, mobile ? 21 : 28, terraceIn);

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
window.addEventListener('resize', () => { fitRenderer(); updateFromScroll(); schedule(); }, { passive: true });
window.visualViewport?.addEventListener('resize', () => { fitRenderer(); updateFromScroll(); schedule(); }, { passive: true });

fitRenderer();
frame(state.current);

if (debugFrame !== null) root.dataset.debugFrame = debugFrame.toFixed(3);
else if (reducedMotion) {
  state.current = state.target = 1;
  frame(1);
} else updateFromScroll();

loadModel();
