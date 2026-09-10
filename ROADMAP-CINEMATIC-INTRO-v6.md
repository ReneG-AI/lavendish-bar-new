# LAVENDISH — Cinematic Intro V6 AAA Roadmap

## Objective
Create a short, elegant, cinematic intro that feels premium and natural rather than mechanical. The sequence must last only a few seconds, begin in a refined night sky, briefly feature the real Piña Colada, and resolve smoothly into LAVENDISH / the bar experience.

## Non-negotiable rules
- `main` stays untouched until explicit approval.
- Work only on `feature/cinematic-intro-v6-aaa`.
- No GLB, fake 3D, procedural cocktail, cubes, assembly mechanics, or scroll-driven choreography.
- Use the real Piña Colada photography already in the repository.
- Motion must be subtle: opacity, very small scale, very small translation only.
- No looping hero animation after the intro.
- Total cinematic duration target: 3.4–4.0 seconds.
- Mobile first-class support.
- `prefers-reduced-motion` must skip/reduce motion safely.
- Each phase has a review gate. Do not advance past a gate without visual approval.

## Visual direction
Premium hospitality / cocktail-bar language:
- deep navy-black night palette;
- real photographic sky, restrained haze, no fantasy overload;
- real product photography as the focal point;
- soft cross-dissolve into LAVENDISH;
- minimal typography;
- no progress bar, no technical UI, no debug chrome in the cinematic itself;
- movement should feel camera-like rather than element-like.

## Timeline target
Approximate cinematic timing:
- 0.00–0.60 s — night sky fades in from black.
- 0.55–1.90 s — Piña Colada appears gently; subtle 1–2% camera push only.
- 1.75–3.20 s — bar/LAVENDISH image cross-dissolves under the drink.
- 2.35–3.55 s — drink dissolves away; LAVENDISH lockup becomes visible.
- 3.55–3.80 s — intro is complete and normal interaction begins.

## Phase 0 — Safety and clean baseline
Status: COMPLETE
- Create clean branch from current `main`.
- Do not inherit experimental V3/V4/V5 implementation.
- Confirm production remains unchanged.

Gate: branch exists from current `main` and contains no production integration.

## Phase 1 — Micro-intro motion prototype
Status: IMPLEMENTED — PENDING VISUAL APPROVAL
Deliverables:
- `preview-cinematic-v6.html`
- `css/cinematic-v6.css`
- `js/cinematic-v6.js`

Implemented:
- one viewport only;
- automatic playback;
- no scrolling required;
- no progress UI;
- one unobtrusive Skip control;
- deterministic controller with one completion clock;
- critical-image preload/decode handling;
- graceful timeout/failure behavior;
- reduced-motion support;
- photographic night-sky layer;
- real Piña Colada layer;
- soft cross-dissolve to LAVENDISH;
- minimal final lockup only.

Gate: user approves the overall rhythm and transition style.

## Phase 2 — Final sky / bar art direction
Status: NOT STARTED
- Replace temporary/reference sky if needed with a final locally hosted asset.
- Verify crop and focal point on desktop + mobile.
- Confirm the final transition target: storefront, interior/bar photo, or actual website hero.
- Tune tonal grade so sky → product → LAVENDISH feels like one photographic sequence.

Gate: visual assets and grading approved.

## Phase 3 — Production-quality polish
Status: NOT STARTED
- Tune timing in 50–100 ms increments.
- Eliminate visible layout shifts.
- Confirm image decoding/preload order.
- Test iOS Safari, Chrome mobile, desktop Chromium/WebKit class behavior.
- Confirm no repeated intro in the same session if that behavior is desired.

Gate: no obvious jank, abrupt cuts, flashes, or blocking load states.

## Phase 4 — Controlled integration
Status: NOT STARTED
- Create a separate integration branch from then-current `main`.
- Rebase/reconcile production changes first.
- Integrate only approved cinematic files/logic.
- Keep a kill switch / fallback to normal home.

Gate: explicit user approval before merge.

## Current review question
Does the V6 micro-intro feel elegant, short, fluid and premium enough to keep this direction? If not, adjust Phase 1 only; do not add more complexity.
