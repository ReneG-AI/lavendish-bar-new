# LAVENDISH — True 3D Piña Colada Assembly v3

Branch: `feature/pina-true3d-v3`  
PR: #16 — `experiment: true 3D Piña Colada assembly v3`

## Goal

Build a genuinely 3D, scroll-scrubbed Piña Colada assembly sequence that feels like a premium beverage commercial and transitions naturally into the existing LAVENDISH website.

`main` remains the stable production homepage and is not modified by this experiment.

## Art direction

- LAVENDISH in Lleida, not a beach club.
- No beach, sea, ocean horizon, tropical resort or palm-beach vacation look.
- Elegant dark night sky, restrained stars and atmospheric haze.
- Refined urban / hospitality terrace atmosphere.
- Warm practical lighting against cool night ambience.
- Aspirational but believable.
- Piña Colada remains the visual protagonist.

## Zero-cost asset strategy

The paid/generated Fal route is no longer the active dependency.

To respect the zero-spend constraint, v3 now uses an authored procedural GLB built entirely from local/open-source tooling:

- Python;
- NumPy;
- trimesh;
- glTF 2.0 / GLB;
- Three.js at runtime.

Reproducible builder:

`scripts/build-pina-procedural-v3.py`

CI workflow:

`.github/workflows/build-pina-true3d-v3.yml`

The workflow builds the model, runs the structural/PBR validator, reports the asset budget and commits the generated GLB back to the experimental branch. No paid API is required.

## Current real 3D asset

Path:

`assets/3d/pina-colada-v3.glb`

Current measured build:

- size: 478,876 bytes (~0.46 MB);
- ~31,104 triangles;
- 65 nodes;
- 57 mesh definitions / mesh nodes;
- 11 materials;
- 7 independently addressable ice nodes;
- no raster texture dependency in the current material-only PBR build.

The asset is intentionally compact. Optimisation is not currently the limiting factor; visual/browser quality is.

## Semantic node contract

The real GLB contains independently animatable groups/nodes:

- `Glass`
  - `Glass_Bowl`
  - `Glass_Stem`
  - `Glass_Foot`
  - `Glass_Knuckle`
- `Liquid`
  - `Liquid_Body`
  - `Liquid_Meniscus`
- `Foam`
- `Ice_01` ... `Ice_07`
- `Straw`
- `Pineapple`
- `Cherry`
- `Condensation`

This satisfies the assembly requirement; the cocktail is not a single merged mesh.

## Physical material contract

The generated GLB declares and uses:

- `KHR_materials_transmission`;
- `KHR_materials_ior`;
- `KHR_materials_volume`;
- `KHR_materials_clearcoat`.

Target runtime behaviour:

- glass: high transmission, IOR ~1.45, low roughness;
- ice: separate translucent irregular pieces, IOR ~1.31;
- liquid: creamy opaque Piña Colada with restrained clearcoat;
- foam: rougher soft material;
- cherry: glossy clearcoat;
- condensation: separate transmissive droplets.

The current asset uses physical material factors rather than baked photographic textures. This is deliberate for the first authored model and keeps the file extremely small.

## Multi-view review

Because the zero-cost route is authored rather than image-to-3D generated, the previous requirement for generated pre-input reference images is no longer a technical dependency.

Instead, the exact same GLB has been inspected from a deterministic multi-view set:

- front;
- left-front 45°;
- left;
- right-front 45°;
- right;
- back;
- top.

The geometry is internally consistent across views. This does not replace the final Three.js/browser material review because the local offscreen renderer does not reproduce WebGL transmission exactly.

## True 3D preview

Isolated page:

`preview-pina-true3d-v3.html`

Current preview version: `0.2.0`.

The preview:

- loads the real `assets/3d/pina-colada-v3.glb`;
- preloads the GLB;
- uses Three.js / WebGL and `GLTFLoader`;
- uses ACES filmic tone mapping;
- uses environment + bounded key/warm/rim lighting;
- validates required semantic nodes at runtime;
- does not draw a primitive substitute cocktail;
- retains cinematic v2 as fallback;
- supports deterministic `?frame=` inspection;
- uses lower DPR / lighting cost on mobile;
- respects reduced motion and Save-Data behaviour.

The production homepage does not load this preview or its runtime.

## Scroll sequence

### ACT I — ATMOSPHERE `0.00 → 0.12`
Dark premium night atmosphere and haze.

### ACT II — GLASS `0.10 → 0.25`
The hurricane-style glass resolves first.

### ACT III — ICE `0.20 → 0.42`
Seven individual irregular ice meshes assemble with deterministic offsets/rotations.

### ACT IV — LIQUID `0.34 → 0.58`
The real `Liquid` group fills bottom-to-top. Its authored origin is at the fill base so Y scaling does not reveal from the centre.

### ACT V — FOAM + GARNISH `0.52 → 0.73`
Foam, straw, pineapple and cherry assemble independently.

### ACT VI — HERO `0.70 → 0.82`
Restrained hero push/orbit and product-lighting accent.

### ACT VII — TERRACE `0.80 → 0.95`
Night atmosphere transitions to the premium outdoor hospitality plate.

### ACT VIII — LANDING `0.82 → 1.00`
The complete product moves from hero framing to calculated table contact and settles before the normal-site handoff.

## Landing correction

The old harness normalised the model around its centre. That approach could push the foot below the table during the landing.

v0.2 instead:

1. scales the model to the viewport target height;
2. places the actual model bottom at a known hero baseline;
3. calculates `landingOffset = floorY - heroBottom`;
4. transitions the complete `productRoot` to that contact position;
5. applies only a small final settle/compression.

This keeps the glass foot as the physical contact reference.

## Performance strategy

Desktop prototype:

- DPR cap: ~1.75;
- antialiasing enabled;
- bounded light count;
- soft shadow path;
- no heavy post-processing stack.

Mobile prototype:

- DPR cap: ~1.25;
- reduced light/shadow cost;
- no pointer parallax;
- assembly narrative preserved.

Current GLB at ~0.46 MB and ~31k triangles is comfortably inside the original web budget.

## Fallback strategy

Fallback triggers include:

- WebGL initialisation failure;
- Save-Data;
- fatal model load failure during future production integration;
- severe device constraint only if justified by measurement.

Fallback target:

`preview-cinematic-v2.html`

Never substitute a CSS/primitive fake cocktail.

## Quality gates

### Gate A — GLB structure / PBR ✅

Command:

`node scripts/validate-pina-glb-v3.mjs assets/3d/pina-colada-v3.glb`

CI run #3 passed build, validation, budget reporting and generated-asset commit.

Validator requires:

- all core semantic nodes;
- at least one independent `Ice_XX` node;
- multiple mesh nodes;
- materials;
- transmission + IOR + volume + clearcoat physical-material extensions.

Raster textures are not mandatory when the material-only PBR contract is deliberately satisfied.

### Gate B — Geometry / multi-view review ✅ for current authored pass

The same model was reviewed from front, both sides, both 45° views, back and top. Known early issues with generic glass shape, oversized garnish and landing alignment were corrected before this build.

This gate covers geometry consistency, not final browser photorealism.

### Gate C — Deterministic Three.js frames — PENDING

Required inspection frames:

- `?frame=0.16`
- `?frame=0.30`
- `?frame=0.48`
- `?frame=0.64`
- `?frame=0.76`
- `?frame=0.92`
- `?frame=1`

The current execution container includes Chromium but cannot resolve the external Three.js CDN, so an honest WebGL visual pass cannot be completed here. Do not mark this gate passed until the isolated preview is opened in a normal networked browser.

### Gate D — Browser material quality — PENDING

Must specifically inspect:

- glass transmission/refraction;
- ice readability through glass/liquid;
- liquid creaminess;
- garnish proportions;
- condensation subtlety;
- contact shadow;
- hero lighting against both sky and terrace.

### Gate E — Runtime performance — PENDING BROWSER TEST

Measure:

- FPS;
- draw calls;
- GPU/texture memory;
- long tasks/main thread;
- viewport resize/orientation behaviour.

### Gate F — real devices — PENDING

- native Safari/iOS;
- Chromium desktop/mobile viewport matrix;
- Firefox;
- Edge;
- reduced motion;
- Save-Data / fallback.

## Phase status

### Phase 0 — Safety ✅
- [x] Work only on `feature/pina-true3d-v3`.
- [x] Keep `main` unchanged.
- [x] Keep PR #16 Draft.
- [x] Preserve cinematic v2 as fallback/reference.

### Phase 1 — True 3D asset authoring ✅ first viable authored model
- [x] Remove paid-service dependency.
- [x] Create reproducible procedural model builder.
- [x] Author hurricane glass, liquid, foam, ice, straw, pineapple, cherry and condensation separately.
- [x] Add physical glTF material extensions.
- [x] Generate compact GLB.
- [x] Multi-view geometry review and refinement.
- [x] Pass structural/PBR validator in CI.

Status: technically viable asset exists. This is not equivalent to final visual approval.

### Phase 2 — True 3D technical preview ✅ implementation / pending visual browser QA
- [x] Isolated noindex preview.
- [x] Load real GLB.
- [x] Scroll-scrub semantic assembly.
- [x] Correct liquid fill origin strategy.
- [x] Correct physical landing baseline.
- [x] Mobile DPR/light path.
- [x] v2 fallback.
- [x] reduced-motion behaviour.
- [ ] Complete networked Three.js deterministic-frame visual QA.

### Phase 3 — Art direction — IN PROGRESS
- [x] Initial product geometry proportions.
- [x] Initial camera choreography.
- [x] Initial cool/warm product-light relationship.
- [x] Initial landing choreography.
- [ ] Browser-based glass/ice material refinement.
- [ ] Final cloud-to-terrace transition tuning.
- [ ] Final mobile composition tuning.
- [ ] Replace temporary remote sky/terrace plates with final local approved assets before production.

### Phase 4 — QA — PARTIAL
- [x] Reproducible CI asset build.
- [x] Structural/PBR validator.
- [x] Asset budget measurement.
- [x] Local GLB round-trip validation.
- [x] JavaScript syntax validation.
- [x] Multi-view geometry inspection.
- [ ] Chromium visual matrix with Three.js.
- [ ] Safari/iOS.
- [ ] Firefox.
- [ ] Edge.
- [ ] reduced motion visual pass.
- [ ] performance profile.

### Phase 5 — Controlled integration — NOT STARTED
- [ ] User visual approval.
- [ ] Create separate integration branch from then-current `main`.
- [ ] Preserve rollback ref.
- [ ] Integrate approved intro/fallback loader only.
- [ ] Regression-test menu, Mojitos, Carta, footer and legal pages.
- [ ] Merge only after explicit approval.

## Current conclusion

The project is no longer blocked by Fal or any paid 3D-generation service.

A real, compact, independently animatable Piña Colada GLB now exists and the isolated Three.js preview is wired to it. Structural and PBR contracts pass CI.

The remaining critical question is visual quality in the actual Three.js browser renderer. Until that is reviewed and tuned, PR #16 must remain Draft and v3 must not be called production-ready.
