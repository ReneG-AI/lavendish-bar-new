# LAVENDISH — True 3D Piña Colada Asset Brief v3

Branch: `feature/pina-true3d-v3`

## Purpose

Create the hero Piña Colada as a genuine independently animatable 3D product asset for the isolated scroll-driven LAVENDISH intro. The quality bar remains premium beverage advertising; `main` remains untouched until explicit approval.

## Art direction

The drink must read as premium, creamy, refreshing, elegant and physically believable under cool night ambience plus warm hospitality lighting.

No beach, sea, resort, palm-beach or vacation-club styling.

The existing `assets/pina-colada.webp` remains the product identity reference, but the runtime product is now genuine geometry rather than a flat image.

## Active zero-cost authoring route

The Fal/image-to-3D route is no longer required. To keep the experiment zero-cost, the model is authored procedurally with open-source/local tooling and generated reproducibly from:

`scripts/build-pina-procedural-v3.py`

Tooling:

- Python;
- NumPy;
- trimesh;
- glTF 2.0 / GLB;
- Three.js for final browser rendering.

CI reproduction:

`.github/workflows/build-pina-true3d-v3.yml`

## Current model

`assets/3d/pina-colada-v3.glb`

Measured build:

- 478,876 bytes (~0.46 MB);
- ~31,104 triangles;
- 65 nodes;
- 57 mesh definitions;
- 11 materials;
- 7 independent ice nodes.

## Required semantic structure — satisfied by current build

- `Glass`
  - bowl
  - stem
  - foot
  - knuckle
- `Liquid`
  - body
  - meniscus
- `Foam`
- `Ice_01...Ice_07`
- `Straw`
- `Pineapple`
- `Cherry`
- `Condensation`

A single merged cocktail mesh remains unacceptable.

## Component requirements

### Glass

- hurricane-style silhouette;
- real separate bowl/stem/foot geometry;
- smooth hero-distance outline;
- low roughness;
- physical transmission;
- IOR near ordinary glass (~1.45);
- enough wall/volume information for believable WebGL highlights.

### Ice

- individually addressable;
- irregular rather than repeated cubes;
- translucent;
- physically plausible IOR (~1.31);
- limited geometry cost.

### Liquid

- fitted within the glass;
- creamy Piña Colada tone;
- separate meniscus/top surface;
- group/pivot authored at the physical fill base so runtime Y scaling fills bottom-to-top rather than from the centre.

### Foam

- separate from liquid;
- soft crown and small surface irregularity;
- rougher than liquid.

### Straw

- smooth circular geometry;
- restrained premium dark finish with subtle accent;
- independently animatable.

### Pineapple

- volumetric wedge;
- separate rind/flesh details;
- refined scale that does not overpower the glass;
- independently animatable.

### Cherry

- dimensional fruit and stem;
- glossy clearcoat without plastic appearance;
- independently animatable.

### Condensation

- optional secondary detail;
- separate group;
- subtle transmissive droplets;
- must never obscure the silhouette or create visual noise.

## Physical-material contract

Current GLB declares:

- `KHR_materials_transmission`;
- `KHR_materials_ior`;
- `KHR_materials_volume`;
- `KHR_materials_clearcoat`.

The current model intentionally uses material factors/extensions instead of raster texture maps. This keeps the source asset compact and is acceptable as long as the browser render meets the visual target.

If the actual Three.js hero render looks too synthetic, the next refinement should add only the texture detail that materially improves realism—for example subtle pineapple/rind variation or micro-surface detail—rather than adding heavy texture maps by default.

## Multi-view geometry QA

The exact current GLB has been reviewed from:

- front;
- left-front 45°;
- left;
- right-front 45°;
- right;
- back;
- top.

The views remain geometrically consistent because they are renders of the same authored model, not separately generated cocktail images.

Early issues corrected during this review:

- generic first-pass glass silhouette;
- garnish too large;
- straw proportions/placement;
- model/table landing baseline.

## Browser visual acceptance criteria

Do not approve the asset solely from structural validation. In Three.js the final product must satisfy all of the following:

- glass reads as actual clear glass rather than grey plastic;
- glass rim/foot remain legible against dark sky;
- ice remains visible and dimensional through the glass/liquid;
- Piña Colada looks creamy rather than like a beige cylinder;
- foam appears appetising but restrained;
- pineapple and cherry are refined and correctly proportioned;
- straw does not clip awkwardly;
- condensation is subtle;
- completed silhouette feels like a premium cocktail photograph at hero scale;
- final foot contact with the table feels physical.

## Web delivery budget

Current asset is already well below the original limits:

- current ~0.46 MB vs initial ideal <=8 MB;
- current ~31k triangles vs initial preferred <=~120k visible triangles.

Do not decimate further unless profiling shows a reason. Remaining work should prioritize visual quality.

## Current status — 2026-09-10

A real GLB now exists, is generated reproducibly at zero paid-API cost, and passes the repository structural/PBR validator in GitHub Actions.

The remaining approval gate is the actual Three.js/browser material and lighting review, followed by cross-browser/mobile QA. Until that is completed, the asset is technically viable but not production-approved.
