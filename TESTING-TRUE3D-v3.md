# LAVENDISH — True 3D Piña Colada v3 Testing

Branch: `feature/pina-true3d-v3`  
Preview: `preview-pina-true3d-v3.html`  
Current preview version: `0.2.1`

## Current verified build

The zero-cost authored model is now generated in CI at:

`assets/3d/pina-colada-v3.glb`

Measured CI build:

- 478,876 bytes (~0.46 MB);
- ~31,104 triangles from the builder report;
- 65 nodes;
- 57 mesh definitions / mesh nodes;
- 11 materials;
- 7 `Ice_XX` nodes;
- material-only PBR: 0 raster textures / 0 image records;
- physical glTF extensions for transmission, IOR, volume and clearcoat.

GitHub Actions run #3 passed:

1. dependency install;
2. procedural GLB build;
3. semantic/PBR validation;
4. asset budget reporting;
5. commit of the generated GLB to the experimental branch.

## Gate A — Asset integrity ✅

Run:

```bash
node scripts/validate-pina-glb-v3.mjs assets/3d/pina-colada-v3.glb
```

Required and currently passing:

- valid GLB v2 header;
- declared/file length match;
- parseable glTF JSON chunk;
- `Glass`, `Liquid`, `Foam`, `Straw`, `Pineapple`, `Cherry` semantic nodes;
- independent `Ice_XX` nodes;
- multiple meshes;
- materials present;
- `KHR_materials_transmission`;
- `KHR_materials_ior`;
- `KHR_materials_volume`;
- `KHR_materials_clearcoat`.

Raster textures are not mandatory for this build. The current asset intentionally uses compact material-factor PBR, so lack of texture/image records is informational rather than a structural failure.

## Gate B — Geometry / multi-view review ✅ for current authored pass

The same exact GLB was inspected offscreen from:

- front;
- left-front 45°;
- left;
- right-front 45°;
- right;
- back;
- top.

Refinements already made from those inspections:

- replaced generic first-pass glass with a hurricane-style bowl + stem + foot;
- corrected straw form and position;
- reduced oversized garnish;
- kept pineapple and cherry independently addressable;
- kept liquid origin at the physical fill base;
- corrected final model/table contact calculation.

Important limitation: the offscreen geometry renderer is useful for silhouette/proportion inspection but does not reproduce Three.js transmission/refraction accurately. Therefore this gate does **not** approve final photoreal materials.

## Gate C — Three.js deterministic visual review — PENDING

Inspect:

- `?frame=0.16` — glass entrance;
- `?frame=0.30` — ice assembly;
- `?frame=0.48` — liquid fill;
- `?frame=0.64` — foam/garnish;
- `?frame=0.76` — hero hold;
- `?frame=0.92` — terrace/landing;
- `?frame=1` — final composition.

Reject/refine if:

- glass reads as grey plastic rather than transparent glass;
- refraction overwhelms product readability;
- ice disappears inside liquid/glass;
- liquid reads as a flat cylinder;
- garnish scale or clipping looks synthetic;
- straw clips incorrectly;
- condensation becomes visual noise;
- foot misses or penetrates table contact;
- hero framing crops the cocktail on any target viewport;
- lighting stops feeling like premium beverage photography.

Current environment limitation:

The execution container has Chromium installed, but its network cannot resolve the external Three.js CDN used by the isolated preview. Therefore no false browser PASS is recorded from this environment. Networked browser review remains required.

## Gate D — Runtime matrix — PENDING

Desktop:

- 1440×900;
- 1920×1080;
- 1024×768.

Mobile:

- 430×932;
- 390×844;
- 375×812;
- 320×700.

Check:

- no horizontal overflow;
- sticky section equals usable viewport height;
- complete cocktail remains visible;
- progress is monotonic;
- semantic component assembly is deterministic;
- no uncontrolled physics;
- final foot contact remains on table zone;
- no layout jump when GLB finishes loading;
- GLB preload does not double-download;
- orientation/VisualViewport resize recomputes correctly.

## Gate E — Performance — PENDING BROWSER PROFILE

Record:

- GLB transfer size — current source asset ~0.46 MB;
- triangles — current builder report ~31.1k;
- draw calls;
- WebGL renderer DPR;
- average/minimum FPS during scrub;
- long tasks;
- GPU/JS memory where available.

Targets:

- desktop: stable premium motion around 55–60 FPS on a representative modern machine;
- mobile: target >=45 FPS on a representative recent phone;
- desktop DPR capped around 1.75;
- mobile DPR capped around 1.25;
- no expensive post stack unless visual benefit justifies measured cost.

The geometry budget is already small enough that premature decimation is not warranted.

## Gate F — Accessibility / graceful degradation — IMPLEMENTED, VISUAL CHECK PENDING

Implementation includes:

- `prefers-reduced-motion` final composition path;
- Save-Data fallback;
- WebGL-init fallback;
- model-load error state;
- cinematic v2 fallback;
- no primitive fake cocktail on failure.

Still test visually in target browsers/devices.

## Gate G — Browser/device validation before approval — PENDING

Required:

- native Safari/iOS;
- Safari desktop where available;
- Chromium desktop/mobile matrix;
- Firefox desktop;
- Edge sanity pass;
- reduced-motion visual pass;
- Save-Data/fallback sanity pass.

## Production integration rule

Do not edit or merge the production homepage from `feature/pina-true3d-v3`.

After visual approval:

1. create a separate integration branch from then-current `main`;
2. preserve a rollback ref;
3. integrate only the approved intro/fallback loader and final local assets;
4. regression-test menu, Mojitos, Carta, footer and legal pages;
5. merge only after explicit approval.
