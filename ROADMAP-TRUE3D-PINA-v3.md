# LAVENDISH — True 3D Piña Colada Assembly v3

Branch: `feature/pina-true3d-v3`  
PR: #16 — `experiment: true 3D Piña Colada assembly v3`

## Goal

Build a genuinely 3D, scroll-scrubbed Piña Colada assembly sequence that feels like a premium beverage commercial and transitions naturally into the existing LAVENDISH website.

The production homepage on `main` remains untouched until explicit approval.

## Experience target

1. Elegant starry night and atmospheric haze.
2. Real 3D glass resolves first.
3. Individually addressable ice assembles.
4. Real 3D Piña Colada liquid fills the glass.
5. Separate foam / creamy top settles.
6. Straw, pineapple and cherry assemble.
7. Short product hero hold with premium lighting.
8. Environment transitions into a refined night terrace.
9. Fully assembled product lands physically on the table.
10. Normal LAVENDISH website begins.

## Non-negotiable art direction

- LAVENDISH in Lleida, not a beach club.
- No beach, sea, tropical resort, palm-beach vacation look or ocean horizon.
- Premium urban hospitality atmosphere.
- Dark night sky, restrained stars, haze and warm practical lights.
- Aspirational but believable terrace mood.
- Piña Colada is the protagonist.
- Product must withstand a close hero camera.

## Non-negotiable technical rules

- Core product is real WebGL/Three.js 3D.
- No flat-image reveal as the assembly mechanic.
- No CSS cocktail reconstruction.
- No primitive placeholder cocktail in the approval preview.
- No single merged final cocktail mesh.
- Glass, ice, liquid, foam, straw, pineapple and cherry must be independently addressable.
- Deterministic scroll timeline.
- Mobile-safe DPR / lighting path.
- Reduced-motion and low-capability fallback.
- Existing cinematic v2 remains the fallback/reference path.
- Production `index.html` stays unchanged on this branch.

## Source-of-truth reuse from cinematic v2

Keep:
- the cinematic night-to-terrace story;
- deterministic `?frame=` inspection;
- viewport-aware sticky behavior;
- restrained camera motion;
- physical landing concept;
- current reference night-sky and outdoor-hospitality plates during prototyping;
- v2 as fallback.

Do not keep:
- flat product image as the core hero implementation;
- image masking/reveal as assembly;
- pseudo-3D product reconstruction.

## Runtime architecture

### Browser stack

- Three.js/WebGL.
- GLB/glTF 2.0 product geometry.
- PBR materials.
- `GLTFLoader`.
- ACES filmic tone mapping.
- environment lighting + bounded key/fill/rim lights.
- deterministic vanilla-JS scroll timeline.
- no uncontrolled real-time rigid-body physics.

The isolated preview currently pins Three.js `0.186.0`.

### Experimental files

- `preview-pina-true3d-v3.html`
- `css/pina-true3d-v3.css`
- `js/pina-true3d-v3.js`
- `ASSET-BRIEF-TRUE3D-PINA-v3.md`
- `TESTING-TRUE3D-v3.md`
- `scripts/validate-pina-glb-v3.mjs`
- `assets/3d/README.md`
- `assets/3d/reference-v3/README.md`
- future approved model: `assets/3d/pina-colada-v3.glb`

## Required 3D node contract

Preferred final GLB:
- `Glass`
- `Ice_01...Ice_N`
- `Liquid`
- `Foam`
- `Straw`
- `Pineapple`
- `Cherry`
- optional `Condensation`

A merged single-mesh cocktail fails Gate A and is not accepted for the assembly sequence.

For early authoring, several synchronized component GLBs are acceptable if they share one coordinate system and can later be packed into a clean final asset.

## Reference-set pipeline

The SAME drink must be represented from:
- front;
- left;
- right;
- left-front 45°;
- right-front 45°;
- top;
- optional back.

Reference source:
`assets/pina-colada.webp`

Rules and exact prompts are documented in `ASSET-BRIEF-TRUE3D-PINA-v3.md`.

## Preferred 3D generation pipeline

Preferred Fal endpoint identified:
`fal-ai/hunyuan-3d/v3.1/pro/image-to-3d`

Relevant capability:
- dedicated front input;
- left/right;
- left-front/right-front 45°;
- top;
- optional back;
- GLB output;
- PBR generation;
- configurable face count.

First quality pass:
- `generate_type: Normal`
- `enable_pbr: true`
- `face_count: 300000–500000`

Then:
1. visually inspect shape and materials;
2. reject bad reconstruction rather than lowering quality bar;
3. split/re-author components if merged;
4. optimize only after shape approval;
5. validate final GLB structure;
6. profile actual runtime.

## Scroll timeline

### ACT I — ATMOSPHERE `0.00 → 0.12`
Starry night, clouds/haze and restrained cool product rim light.

### ACT II — GLASS `0.10 → 0.25`
Glass resolves first with real transparency/refraction-ready material.

### ACT III — ICE `0.20 → 0.42`
Individual pieces assemble with deterministic art-directed offsets and rotations.

### ACT IV — LIQUID `0.34 → 0.58`
Liquid fills from bottom to top using the real `Liquid` mesh. Preferred authoring places the liquid origin near the base to avoid a fake center-scale fill.

### ACT V — FOAM + GARNISH `0.52 → 0.72`
Foam settles, then straw, pineapple and cherry assemble.

### ACT VI — HERO `0.70 → 0.82`
Restrained camera push/orbit and lighting accent. No excessive spin.

### ACT VII — TERRACE `0.80 → 0.94`
Night atmosphere transitions into the premium terrace reference.

### ACT VIII — LANDING `0.90 → 1.00`
Product moves from hero framing to table contact, then settles. Normal website begins after the landing.

## Performance strategy

Desktop:
- DPR cap around `1.75` in prototype;
- antialiasing enabled where useful;
- soft shadows only on capable path;
- bounded light count;
- no permanent expensive post stack unless justified by profiling.

Mobile:
- DPR cap around `1.25`;
- lower light/shadow cost;
- no pointer parallax;
- assembly story remains intact.

Web asset delivery targets after optimization:
- ideally <= 8 MB;
- investigate > 12 MB;
- target <= ~120k visible triangles;
- 1K–2K effective textures;
- KTX2/Basis considered after visual approval.

## Fallback strategy

Fallback triggers:
- WebGL initialization failure;
- Save-Data;
- fatal model load failure in production integration;
- measured severe device constraint if justified by testing.

Fallback:
current cinematic v2, never a broken or primitive fake-3D scene.

The isolated v3 preview intentionally shows an explicit diagnostic if the GLB is absent, with a link to v2. It does not synthesize a substitute cocktail.

## Quality gates

### Gate A — Structural GLB
Use:
`node scripts/validate-pina-glb-v3.mjs assets/3d/pina-colada-v3.glb`

Must satisfy node contract and multi-mesh structure.

### Gate B — Hero-distance visual
Glass, ice, liquid, foam and garnish must survive close-camera inspection.

### Gate C — Deterministic timeline
Inspect:
- `?frame=0.16`
- `?frame=0.30`
- `?frame=0.48`
- `?frame=0.64`
- `?frame=0.76`
- `?frame=0.92`
- `?frame=1`

### Gate D — Performance
Measure actual GLB transfer, triangles, draw calls, texture memory and FPS.

### Gate E — Graceful degradation
Reduced motion, Save-Data, WebGL failure and missing asset behavior.

### Gate F — Browser/device
Chromium matrix + native Safari/iOS + Firefox + Edge sanity.

## Phase plan

### Phase 0 — Safety ✅
- [x] Keep production homepage unchanged.
- [x] Keep cinematic v2 available.
- [x] Continue only on `feature/pina-true3d-v3`.
- [x] Keep PR #16 Draft.

### Phase 1A — Reference preparation — SPEC COMPLETE / GENERATION BLOCKED
- [x] Define required consistent multi-view set.
- [x] Define per-view generation rules.
- [x] Keep `assets/pina-colada.webp` as identity reference.
- [x] Identify high-fidelity image-edit path.
- [ ] Generate and visually approve actual front/side/45°/top images.
- [ ] Commit accepted reference images.

Current blocker on 2026-09-10:
the connected Fal account returns HTTP 403 `Exhausted balance`, so the first reference-image generation job cannot start.

### Phase 1B — 3D asset acquisition — BLOCKED BY 1A
- [x] Identify preferred multi-view image-to-3D endpoint.
- [x] Define first-pass PBR/face-count settings.
- [x] Add structural GLB validator.
- [ ] Generate first GLB.
- [ ] Inspect hero-distance geometry/PBR.
- [ ] Reject or iterate as needed.
- [ ] Ensure independent assembly nodes.
- [ ] Optimize approved asset.

No GLB exists yet. Phase 1 is not complete.

### Phase 2 — True 3D technical prototype — HARNESS PREPARED
- [x] Add isolated noindex preview shell.
- [x] Add Three.js scene / GLTFLoader path.
- [x] Add node-contract rejection.
- [x] Add deterministic scroll timeline logic.
- [x] Add assembly transforms for required semantic nodes.
- [x] Add v2 fallback path.
- [x] Add mobile DPR/light reduction.
- [x] Add reduced-motion final composition behavior.
- [ ] Load and validate a real approved GLB.
- [ ] Tune liquid fill to final asset origin.
- [ ] Validate actual glass transmission/refraction.

Important: the harness is not visual approval. It cannot be judged until a real model exists.

### Phase 3 — Art direction — PENDING REAL GLB
- [ ] Product-lighting pass.
- [ ] Camera choreography pass.
- [ ] Model-to-reference silhouette comparison.
- [ ] Cloud-to-terrace transition pass.
- [ ] Table-contact/landing pass.
- [ ] Mobile composition pass.
- [ ] Replace temporary remote reference plates with approved local optimized assets.

### Phase 4 — QA — PARTIAL TOOLING ONLY
- [x] GLB structural validator tested with a synthetic conforming GLB.
- [x] JS modules pass `node --check`.
- [ ] Chromium deterministic-frame matrix with real model.
- [ ] Native Safari/iOS.
- [ ] Firefox.
- [ ] Edge.
- [ ] Save-Data / fallback.
- [ ] reduced-motion visual inspection.
- [ ] FPS/memory/main-thread profile.

### Phase 5 — Controlled integration
- [ ] Obtain explicit visual approval.
- [ ] Create separate integration branch from then-current `main`.
- [ ] Preserve rollback ref.
- [ ] Integrate approved intro/fallback loader only.
- [ ] Regression-test menu, Mojitos, Carta, footer and legal pages.
- [ ] Merge only after explicit approval.

## Current conclusion

The technical direction is ready, but the project is still asset-gated.

Do not call the v3 experience production-ready and do not merge PR #16 while:
- the reference set is not generated/approved;
- a real GLB has not been generated and inspected;
- the required semantic nodes have not been verified;
- real-device QA is incomplete.
