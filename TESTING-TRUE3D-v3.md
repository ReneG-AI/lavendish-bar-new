# LAVENDISH — True 3D Piña Colada v3 Testing

Branch: `feature/pina-true3d-v3`

## Status

This document defines the gate for the isolated v3 prototype. It does not imply that the 3D asset is approved.

## Gate A — Asset integrity

Run:

```bash
node scripts/validate-pina-glb-v3.mjs assets/3d/pina-colada-v3.glb
```

Required:
- valid GLB header;
- parseable glTF JSON chunk;
- nodes include `Glass`, `Liquid`, `Foam`, `Straw`, `Pineapple`, `Cherry`;
- at least one `Ice_XX` node;
- more than one mesh overall;
- no obvious merged-single-mesh failure;
- file size reported and reviewed.

Preferred:
- PBR material data present;
- textures embedded or intentionally external;
- sensible node count;
- no duplicate cameras/lights from authoring unless deliberate.

## Gate B — Close-camera visual review

Inspect at deterministic frames:
- `?frame=0.16` — glass;
- `?frame=0.30` — ice assembly;
- `?frame=0.48` — liquid fill;
- `?frame=0.64` — foam/garnish;
- `?frame=0.76` — hero hold;
- `?frame=0.92` — terrace landing;
- `?frame=1` — final state.

Reject if:
- glass edges look faceted;
- liquid looks like an opaque plastic cylinder;
- ice is visibly duplicated/identical;
- garnish is flat or distorted;
- straw clips through garnish/glass incorrectly;
- product floats at landing;
- model silhouette materially diverges from reference;
- textures visibly smear/stretch at hero scale.

## Gate C — Runtime behavior

Desktop:
- 1440×900;
- 1920×1080;
- 1024×768.

Mobile emulation:
- 430×932;
- 390×844;
- 375×812;
- 320×700.

Check:
- no horizontal overflow;
- sticky scene equals visual viewport height;
- drink remains fully visible;
- scroll progress is monotonic;
- no uncontrolled physics;
- final landing remains on table zone;
- no layout jump when GLB finishes loading;
- loader/error state is understandable.

## Gate D — Performance

Record:
- GLB transfer size;
- decoded texture memory;
- triangle count;
- draw calls;
- renderer DPR;
- average FPS during scroll;
- worst long task;
- peak JS heap where available.

Targets:
- desktop: visually stable 55–60 FPS on a representative modern machine;
- mobile: visually stable >= 45 FPS on a representative recent phone;
- DPR capped rather than blindly using device DPR;
- no unbounded animation loop when preview is off-screen;
- no autoplay video required.

Do not lower visual quality solely to hit a synthetic benchmark before profiling the actual bottleneck.

## Gate E — Accessibility / graceful degradation

Verify:
- `prefers-reduced-motion: reduce` resolves to a stable composed final scene;
- Save-Data routes to the established v2 fallback;
- WebGL initialization failure routes to fallback;
- 3D asset 404 does not show a fake primitive replacement;
- keyboard focus remains usable;
- status copy is not required to understand the production experience.

## Gate F — Browser validation before approval

Required before production integration:
- Safari on a real iPhone;
- Safari desktop;
- Firefox desktop;
- Edge sanity pass;
- Chromium desktop/mobile matrix.

## Production integration rule

Even after this preview passes, do not edit the production homepage directly from this branch.

Create a separate integration branch from the then-current approved `main`, preserve a rollback ref, integrate the approved loader/intro only, and regression-test menu, Mojitos, Carta, footer and legal pages.
