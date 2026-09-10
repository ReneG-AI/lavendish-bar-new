# LAVENDISH — True 3D Piña Colada Asset Brief v3

Branch: `feature/pina-true3d-v3`

## Purpose

Create the hero Piña Colada as a genuine 3D product asset for a close-camera, scroll-scrubbed beverage-commercial sequence. The product must withstand full-screen rendering on desktop without looking synthetic, low-poly, flat, or like a CSS reconstruction.

The current `assets/pina-colada.webp` remains the visual identity reference for the drink. It is not the final 3D implementation.

## Art direction

The drink must read as:
- premium, realistic and desirable;
- creamy and refreshing rather than cartoonish;
- physically plausible at close range;
- compatible with cool night ambient light and warm terrace practicals;
- elegant enough to remain the only dominant object for several seconds.

No beach, sea, resort, palm-beach or vacation-club styling.

## Required multi-view reference set

Create the SAME cocktail from every view. Do not regenerate seven loosely related cocktails.

Required files:
- `front.png`
- `left.png`
- `right.png`
- `left-front-45.png`
- `right-front-45.png`
- `top.png`
- optional `back.png`

Reference rules:
- one cocktail only;
- fully visible with garnish inside frame;
- neutral seamless light-gray background;
- soft, even studio lighting;
- same camera focal character across side/45° views;
- minimal perspective distortion;
- same glass silhouette and proportions;
- same straw material, diameter, angle and insertion point;
- same pineapple cut, thickness and placement;
- same cherry size and placement;
- same creamy liquid level and tone;
- same foam height/profile;
- no text, logo, props, hands, bar, beach or scenery.

For reconstruction quality, the cocktail should occupy roughly 70–85% of image height.

## Reference-generation workflow

Preferred reference editor: high-fidelity image-to-image model.

Canonical pass:
1. Start from `assets/pina-colada.webp`.
2. Produce a clean front reconstruction reference.
3. Use BOTH the original product image and the accepted clean front view as references for every subsequent angle.
4. Generate one view at a time and reject any view that changes garnish, glass silhouette, straw or liquid level.
5. Only send a mutually consistent set to 3D generation.

Suggested editing prompt core:

> Preserve the exact same LAVENDISH Piña Colada design shown in the references. Do not redesign the drink. Render one isolated cocktail from [VIEW], centered, fully visible, on a seamless neutral light-gray studio background, with soft even product lighting and minimal perspective distortion. Keep identical glass proportions, creamy liquid level, foam profile, straw style/angle, pineapple garnish geometry/placement and cherry placement. No environment, props, text or logo. This is a photogrammetry-style image-to-3D reference, so prioritize readable silhouette and stable geometry over dramatic lighting.

## Preferred 3D generation

Current preferred Fal endpoint:
`fal-ai/hunyuan-3d/v3.1/pro/image-to-3d`

Why:
- accepts dedicated front, left, right, left-front 45°, right-front 45°, top and optional back views;
- exports GLB;
- supports PBR generation;
- supports high face-count reconstruction for the first quality pass.

First-pass target:
- `generate_type: Normal`
- `enable_pbr: true`
- `face_count: 300000–500000`

Do not optimize aggressively before visual approval. First establish shape/material quality, then reduce.

## Component / node contract

Preferred final single-GLB node names:
- `Glass`
- `Ice_01...Ice_N`
- `Liquid`
- `Foam`
- `Straw`
- `Pineapple`
- `Cherry`
- optional `Condensation`

Hard requirement:
- a single merged cocktail mesh is rejected for the assembly sequence.

Acceptable intermediate alternative:
- several component GLBs loaded into one Three.js product root, provided they preserve the same coordinate system and are authored from the same master reference set.

## Component authoring notes

### Glass
- real wall thickness;
- smooth silhouette;
- clean lip;
- no faceted low-poly contour at hero distance;
- transparent/refraction-ready material;
- target IOR near ordinary glass in runtime rather than baked fake reflections.

### Ice
- irregular, rounded, translucent pieces;
- no identical cube repetition;
- enough separation for individual assembly;
- avoid noisy micro-geometry that inflates file size.

### Liquid
- volumetric mesh fitted inside glass;
- clean top surface;
- pivot/origin at or near the bottom for fill animation;
- creamy off-white/yellow tone without opaque-plastic appearance.

### Foam
- distinct mesh from liquid;
- soft, slightly uneven crown;
- believable thickness;
- no whipped-cream caricature.

### Straw
- smooth circular section;
- sufficient radial segments for close camera;
- exact reference angle and depth.

### Pineapple
- dimensional wedge;
- readable fibrous flesh and rind;
- no flat billboard.

### Cherry
- dimensional, glossy but not plastic;
- stable placement relative to pineapple/straw.

## PBR/material expectations

Do not bake lighting into albedo where avoidable.

Target maps/material data:
- base color;
- roughness;
- normal;
- transmission/refraction-ready glass where practical;
- optional ambient occlusion;
- metallic should remain near zero for drink components.

Textures:
- authoring pass may use up to 2K where detail requires it;
- web-delivery target should prefer KTX2/Basis after approval;
- avoid multiple redundant 4K maps.

## Web delivery targets

Initial approved-quality target:
- final optimized GLB ideally <= 8 MB;
- hard investigation threshold: 12 MB;
- <= ~120k visible triangles preferred after optimization;
- 1K–2K effective texture resolution;
- avoid excessive draw calls;
- no hidden duplicate geometry.

These are delivery targets, not first-generation limits.

## Current status — 2026-09-10

Fal was available and the correct multi-view 3D endpoint was identified. The first reference-image generation request could not start because the connected Fal account returned HTTP 403: `Exhausted balance`.

No GLB has been generated yet. Do not mark Phase 1 complete until a real model is inspected.
