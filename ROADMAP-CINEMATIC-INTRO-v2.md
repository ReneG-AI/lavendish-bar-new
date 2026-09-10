# LAVENDISH — Cinematic Piña Colada Intro v2

Branch: `feature/pina-cinematic-intro-v2`

## Goal

Create a premium cinematic opening sequence where the Piña Colada is the protagonist from the first interaction:

1. Begin in a dark, elegant starry night sky with soft clouds.
2. As the user scrolls, the Piña Colada emerges gradually from darkness and atmosphere.
3. The drink becomes the dominant hero object, large, appetising and photorealistic.
4. The environment transitions from sky to a dreamlike night bar terrace.
5. The Piña Colada settles naturally onto a terrace table.
6. Only then does the normal LAVENDISH website begin.

Existing production homepage files must not be modified until the experiment is approved.

---

## Non-negotiable visual rules

- The drink must always use the real `assets/pina-colada.webp` product asset.
- No CSS-drawn fake ice, foam, garnish, glass or fruit.
- No fake geometric cocktail reconstruction.
- No cheap reveal that simply colours the image.
- The Piña Colada must feel like a premium beverage advertisement.
- Motion must be scroll-synchronised, cinematic and smooth.
- The drink remains visually central and dominant.
- Mobile must retain the idea but reduce expensive motion.
- `prefers-reduced-motion` receives a beautiful static final composition.
- No changes to Mojitos, Carta, menu, footer, legal pages or existing stable responsive styles during the experiment.

---

## Architecture

The experiment stays isolated in new files:

- `preview-cinematic-v2.html`
- `css/cinematic-v2.css`
- `css/cinematic-v2-photoreal.css`
- `js/cinematic-v2.js`
- `TESTING-CINEMATIC-v2.md`
- `ASSET-BRIEF-CINEMATIC-v2.md`
- `ASSET-SOURCES-CINEMATIC-v2.md`

Existing production files are not edited during Phases 0–4.

For real-device visual review, an unlinked/noindex preview-only snapshot of the four runtime preview files is allowed on `main` after an explicit user request. Before publishing that snapshot we created `backup/pre-cinematic-v2-live-preview`. This does not load the cinematic intro from `index.html` and does not alter the production homepage.

When approved, integration will happen in a separate final branch with a minimal loader/change set.

The preview module supports deterministic art-direction frames with `?frame=0.00` through `?frame=1.00`. This is preview-only and is used to inspect exact timeline moments without changing scroll behavior in the future production integration.

---

## Scene structure

### ACT I — NIGHT SKY
Progress: `0.00 → 0.20`

- Deep blue-black photographic night sky.
- Natural star density from a real sky plate, with only subtle procedural star accents.
- Three atmospheric cloud depths plus central haze.
- Subtle warm light begins below the clouds.
- Piña Colada is initially hidden in haze/darkness.

### ACT II — DISCOVERY
Progress: `0.10 → 0.39`

- The drink emerges from the cloud layer without a crop or colour-fill trick.
- Visibility is created with atmospheric clearing, focus, brightness and camera motion.
- The product rises from below and resolves progressively into full photographic clarity.
- Front, middle and back clouds separate at different rates to create depth.

### ACT III — HERO DRINK
Progress: `0.29 → 0.69`

- Piña Colada reaches full clarity and becomes the dominant object.
- Camera makes a controlled push-in and then holds briefly.
- Product glow tightens behind the glass.
- Desktop receives subtle pointer parallax; mobile receives none.

### ACT IV — TERRACE TRANSITION
Progress: `0.58 → 0.86`

- Night sky rises and fades.
- A real photographic outdoor hospitality environment appears behind the drink.
- The current Phase 3 plate provides genuine warm lighting and real furniture/table material.
- The previous CSS-drawn tabletop is disabled in the photoreal override.
- Product landing is evaluated against the photographed environment rather than a fake geometric table.

### ACT V — LANDING / WEBSITE START
Progress: `0.75 → 1.00`

- Product movement changes from floating camera motion to a calculated landing target.
- Pointer movement is progressively removed during the landing.
- A final settle phase adds a subtle compression and downward contact movement.
- Contact shadow tightens as the glass reaches the photographed table zone.
- Final copy appears only after the landing is almost complete.
- User exits the sticky scene into the normal LAVENDISH page.

---

## Phase plan

### Phase 0 — Safety and planning ✅
- [x] Create isolated branch from stable `main`.
- [x] Create this roadmap.
- [x] Freeze production sections during experiment.

### Phase 1 — Cinematic blocking ✅
- [x] Build isolated preview page.
- [x] Implement sticky scroll timeline.
- [x] Build night sky, cloud layers, terrace transition and table composition.
- [x] Use the real Piña Colada as the only drink visual.
- [x] Add progress interpolation and mobile/reduced-motion behavior.

### Phase 2 — Art direction pass ✅
- [x] Tune scale, camera movement and timing on desktop.
- [x] Tune mobile composition separately.
- [x] Improve cloud depth with three independent cloud planes and central haze.
- [x] Replace generic vertical floating with a calculated landing target tied to viewport geometry.
- [x] Remove pointer parallax progressively during landing so the drink stops feeling weightless.
- [x] Remove fixed `min-height: 640px` behavior that could fight small iOS viewports.
- [x] Re-measure after image decode, font readiness, resize, orientation, pageshow and VisualViewport changes.
- [x] Add deterministic `?frame=` inspection mode for QA.

### Phase 3 — Photoreal environment / contact pass — IN PROGRESS
- [x] Replace the procedural-looking sky as the dominant layer with a real photographic starry-night/cloud plate.
- [x] Replace the storefront placeholder with a real photographed outdoor hospitality/night-table plate.
- [x] Disable the temporary CSS-drawn tabletop in the photoreal override.
- [x] Record source/licensing information in `ASSET-SOURCES-CINEMATIC-v2.md`.
- [x] Add `preconnect`/preload hints for the temporary photographic plates in the isolated preview.
- [x] Retune product landing against the photographed table zone on desktop and mobile.
- [x] Add a final physical settle/contact phase and tighter contact shadow.
- [x] Keep the real Piña Colada asset unchanged as the hero product.
- [x] Publish an isolated live preview snapshot after creating `backup/pre-cinematic-v2-live-preview`.
- [ ] Replace remote reference plates with final local optimised assets before production integration.
- [ ] Decide whether retained final plates are licensed references or dedicated LAVENDISH-specific generated/commissioned plates.
- [ ] Optimise final environment assets to WebP/AVIF.
- [ ] Preload only the first-frame-critical visual and lazy-load the terrace plate before Act IV.

### Phase 4 — QA — PARTIAL ✅
- [x] Chromium automated matrix: 1440×900, 1920×1080, 1024×768, 430×932, 390×844, 320×700.
- [x] Seven deterministic timeline frames per viewport: `0`, `.20`, `.45`, `.68`, `.85`, `.97`, `1`.
- [x] No horizontal overflow in automated matrix.
- [x] Sticky viewport-height check.
- [x] Product/final-copy/table-anchor visibility checks.
- [x] Critical image preload probe.
- [ ] Native Safari/iOS sticky + VisualViewport validation on a real device.
- [ ] Firefox validation.
- [ ] Edge sanity check.
- [ ] Reduced-motion visual inspection on a real browser/device.

### Phase 5 — Controlled integration
- [ ] Create `feature/pina-cinematic-intro-v2-integration` from approved `main`.
- [ ] Integrate only the approved intro module.
- [ ] Preserve a rollback branch before merge.
- [ ] Verify Mojitos, menu, Carta, footer and legal pages unchanged.
- [ ] Merge only after final real-device approval.

---

## Current acceptance criteria

The intro is not considered finished until all of the following are true:

- At first glance, the Piña Colada feels photographic and desirable.
- The scene communicates a transition from night sky to a premium bar terrace without explanation.
- The product is clearly the protagonist at every stage.
- Scrolling feels like controlling a short luxury beverage film, not revealing a webpage mask.
- The landing on the table feels physical rather than like a CSS translation.
- Mobile does not crop the drink, text or table.
- The normal website starts cleanly after the cinematic sequence.
- Existing production homepage files remain unchanged until approval.

---

## Live preview safety

Current live preview URL:

`https://reneg-ai.github.io/lavendish-bar-new/preview-cinematic-v2.html`

The live preview snapshot on `main` consists only of the four isolated preview runtime files. `index.html` does not load them, so the normal homepage remains unchanged. Exact pre-preview `main` is preserved in `backup/pre-cinematic-v2-live-preview`.

---

## Rollback policy

The stable production homepage remains the reference. Experimental integration still lives on this branch and PR #15 remains Draft. The live preview snapshot can be removed or rolled back independently without touching the approved site structure.
