# LAVENDISH — Cinematic Intro v2 Testing

Branch: `feature/pina-cinematic-intro-v2`

## Phase 2 validation completed

- JavaScript syntax checked with Node: `node --check js/cinematic-v2.js` — PASS.
- CSS structural validation: opening/closing block counts balanced — PASS.
- Preview HTML parsed with Python's standard HTML parser — PASS.
- Preview asset references remain local to the repository.
- The Piña Colada hero still uses only `assets/pina-colada.webp`.
- No production file is edited by the Phase 2 experiment.
- Preview cache keys bumped to `0.2.0` for both CSS and JS.
- Deterministic QA mode added: append `?frame=0.00` through `?frame=1.00` to inspect a specific cinematic moment.
- iOS-oriented resilience added: VisualViewport resize handling, pageshow re-measurement, image decode re-measurement and removal of the old fixed 640px sticky minimum.

## Timeline checkpoints to inspect in Phase 4

- `?frame=0` — clean starry-night opening, product hidden.
- `?frame=0.20` — clouds opening, product discovery beginning.
- `?frame=0.45` — Piña Colada in full photographic clarity.
- `?frame=0.68` — hero hold / terrace transition begins.
- `?frame=0.85` — table arrival and product landing underway.
- `?frame=0.97` — glass landed, contact shadow visible, final copy present.
- `?frame=1` — final terrace composition before entering the normal site.

## Not yet claimed as passed

Real-browser visual QA is intentionally not marked complete yet. The current execution environment's headless Chromium process was not reliable enough to use as evidence for layout/animation approval. Phase 4 therefore still requires the planned desktop/tablet/mobile and Safari/iOS checks against the final Phase 3 environment assets.

## Safety gate

Do not merge the draft PR into `main` before:

1. Phase 3 photoreal environment plates are complete.
2. Phase 4 viewport/browser QA is complete.
3. The user approves the cinematic direction on a real device.
4. A separate integration branch is created from then-current `main`.
