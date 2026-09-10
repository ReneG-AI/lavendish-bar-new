# Piña Colada v3 — multi-view QA

The active zero-cost route no longer depends on separately generated image-to-3D reference views.

Instead, the exact authored `assets/3d/pina-colada-v3.glb` is inspected from deterministic camera views so every angle is guaranteed to represent the same cocktail geometry:

- front;
- left-front 45°;
- left;
- right-front 45°;
- right;
- back;
- top.

This multi-view pass is used to catch silhouette, garnish scale, straw placement and clipping problems before browser integration.

The existing `assets/pina-colada.webp` remains the drink identity/art-direction reference.

Important: offscreen multi-view geometry review does not replace final Three.js material review. Glass transmission, ice readability and premium beverage lighting must still be approved in the actual WebGL renderer.
