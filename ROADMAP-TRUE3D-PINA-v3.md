# LAVENDISH — True 3D Piña Colada Assembly v3

Branch: `feature/pina-true3d-v3`

## Goal

Replace the current 2.5D cinematic experiment with a genuinely 3D, scroll-scrubbed Piña Colada assembly sequence that feels like a premium beverage commercial.

The intended experience:

1. Starry night and cloud atmosphere.
2. A real 3D glass enters the scene.
3. Ice assembles inside the glass.
4. Piña Colada liquid fills the glass.
5. Foam / creamy top settles.
6. Pineapple garnish, cherry and straw assemble.
7. The complete cocktail receives a short hero moment.
8. The scene transitions into a dreamlike night terrace.
9. The fully assembled cocktail lands on the table.
10. The normal LAVENDISH website begins.

`main` remains the stable production homepage. This branch is experimental and disposable until explicit approval.

## Non-negotiable quality rules

- True WebGL 3D rendering, not CSS fake-3D.
- No flat image reveal as the core assembly mechanic.
- Glass must use physically plausible transparent/refractive material.
- Ice must look translucent, irregular and individually lit.
- Liquid must read as creamy tropical Piña Colada, not a flat opaque cylinder.
- Garnish must be volumetric.
- Lighting must feel like premium product photography.
- Scroll controls animation progression smoothly.
- Mobile gets a reduced-but-still-3D path where hardware allows it.
- Low-power / Save-Data / WebGL failure receives the existing 2.5D cinematic fallback.
- No production integration until QA + user approval.

## Architecture

### Runtime stack

- Three.js/WebGL for true 3D rendering.
- GLB/glTF for final product geometry where possible.
- PBR materials (`MeshPhysicalMaterial` / glTF metallic-roughness workflow).
- Scroll-driven deterministic timeline in vanilla JavaScript.
- Existing 2.5D v2 remains fallback and visual reference.

### Planned experimental files

- `preview-pina-true3d-v3.html`
- `css/pina-true3d-v3.css`
- `js/pina-true3d-v3.js`
- `assets/3d/pina-colada-v3.glb`
- `TESTING-TRUE3D-v3.md`

## Required 3D node structure

The final GLB should expose independently animatable nodes:

- `Glass`
- `Ice_01...Ice_N`
- `Liquid`
- `Foam`
- `Straw`
- `Pineapple`
- `Cherry`
- optional `Condensation`

A single merged cocktail mesh is not sufficient for the assembly effect. If generation produces a merged mesh, it must be re-authored/split before final integration.

## Scroll timeline

### ACT I — ATMOSPHERE `0.00 → 0.12`
Starry night, clouds and subtle product rim light.

### ACT II — GLASS `0.10 → 0.25`
The empty glass resolves first with believable refraction/highlights.

### ACT III — ICE `0.20 → 0.42`
Ice pieces assemble with staggered art-directed transforms. No uncontrolled physics simulation in production.

### ACT IV — LIQUID `0.34 → 0.58`
Piña Colada fills visibly from bottom to top inside the glass using a real 3D liquid mesh and clipping/scale strategy.

### ACT V — FOAM + GARNISH `0.52 → 0.72`
Foam settles; straw, pineapple and cherry assemble.

### ACT VI — HERO `0.70 → 0.82`
Fully assembled drink holds large on screen with a restrained camera push/orbit and premium lighting accent.

### ACT VII — TERRACE `0.80 → 1.00`
Environment becomes the dream terrace; the product lands physically on the table and the normal site begins.

## Performance strategy

Desktop capable devices:
- DPR capped around 1.5–2 depending on GPU.
- bounded light count.
- compressed textures where available.

Mobile:
- lower DPR cap.
- reduced expensive transmission/refraction if required.
- no pointer parallax.
- keep the assembly story intact.

Fallback triggers:
- WebGL unavailable.
- severe renderer initialization failure.
- Save-Data enabled.
- optionally constrained hardware after measurement.

Fallback target: the current cinematic v2 experience rather than a blank section.

## Phase plan

### Phase 0 — Safety ✅
- [x] Keep current production homepage unchanged.
- [x] Keep cinematic v2 available as reference/fallback.
- [x] Create `feature/pina-true3d-v3`.
- [x] Create this roadmap.

### Phase 1 — 3D asset acquisition / authoring — NEXT
- [ ] Generate or author a high-quality Piña Colada GLB.
- [ ] Verify close-camera geometry and material quality.
- [ ] Ensure independent assembly nodes.
- [ ] Optimise polygon and texture budget.

### Phase 2 — True 3D technical prototype
- [ ] Create isolated WebGL preview.
- [ ] Load model and environment lighting.
- [ ] Implement deterministic scroll timeline.
- [ ] Implement glass / ice / liquid / garnish assembly.
- [ ] Add fallback route.

### Phase 3 — Art direction
- [ ] Product-lighting pass.
- [ ] Camera choreography.
- [ ] Cloud-to-terrace transition.
- [ ] Final table landing.
- [ ] Mobile-specific composition.

### Phase 4 — QA
- [ ] Chromium desktop/mobile matrix.
- [ ] Safari/iOS real-device test.
- [ ] Firefox + Edge sanity tests.
- [ ] WebGL fallback test.
- [ ] Save-Data/constrained-device behavior.
- [ ] Reduced-motion validation.
- [ ] Memory/FPS/main-thread sanity checks.

### Phase 5 — Controlled integration
- [ ] Create a separate integration branch from approved current `main`.
- [ ] Keep rollback branch.
- [ ] Integrate only approved intro/fallback loader.
- [ ] Regression test menu, Mojitos, Carta, footer and legal pages.
- [ ] Merge only after explicit approval.

## Critical dependency

A realistic 3D asset is the critical path. We should not fake it again with crude procedural geometry.

Preferred route: generate/author an initial 3D model externally, evaluate it, then integrate and optimise the resulting GLB. The Fal connector is useful because it supports 3D generation workflows. If the generated asset is not good enough, the quality target remains fixed and the fallback path is dedicated Blender authoring rather than lowering realism.
