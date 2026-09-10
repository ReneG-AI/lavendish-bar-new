# LAVENDISH True 3D v3 assets

This directory belongs only to the isolated `feature/pina-true3d-v3` experiment.

## Current product asset

`pina-colada-v3.glb`

The model is generated reproducibly at zero paid-API cost by:

`scripts/build-pina-procedural-v3.py`

Current CI build:

- ~0.46 MB;
- ~31.1k triangles;
- 65 nodes;
- 57 mesh definitions;
- 11 materials;
- 7 separate `Ice_XX` nodes.

Semantic groups include `Glass`, `Liquid`, `Foam`, `Straw`, `Pineapple`, `Cherry` and `Condensation`.

The physical-material contract uses glTF transmission, IOR, volume and clearcoat extensions. The current model is deliberately material-only PBR rather than texture-heavy.

Validation:

`node scripts/validate-pina-glb-v3.mjs assets/3d/pina-colada-v3.glb`

Do not treat this asset as production-approved until the actual Three.js hero render and mobile/browser matrix are visually reviewed.
