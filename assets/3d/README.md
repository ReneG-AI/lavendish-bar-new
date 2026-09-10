# Piña Colada v3 3D asset slot

Expected approved asset path:

`assets/3d/pina-colada-v3.glb`

The preview deliberately does **not** synthesize a replacement cocktail if this file is missing.

Required semantic nodes:
- `Glass`
- `Ice_01...Ice_N`
- `Liquid`
- `Foam`
- `Straw`
- `Pineapple`
- `Cherry`

Reference images belong in `assets/3d/reference-v3/` after they are generated and approved.

Before committing a GLB:
1. run `node scripts/validate-pina-glb-v3.mjs assets/3d/pina-colada-v3.glb`;
2. inspect hero-distance materials in the isolated preview;
3. record source/generation settings and iteration notes;
4. do not merge into production from this experimental branch.
