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

The stable production site on `main` must not be modified until the experiment is approved.

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
- `js/cinematic-v2.js`

Existing production files are not edited during Phases 0–4.

When approved, integration will happen in a separate final branch with a minimal loader/change set.

---

## Scene structure

### ACT I — NIGHT SKY
Progress: `0.00 → 0.20`

- Deep blue-black night sky.
- Sparse realistic-feeling stars, not a busy galaxy texture.
- Large soft cloud masses cross the lower third.
- Subtle warm light begins below the clouds.
- Piña Colada is initially hidden in haze/darkness.

### ACT II — DISCOVERY
Progress: `0.15 → 0.45`

- The drink emerges slowly from the cloud layer.
- First visible elements: rim highlights and silhouette.
- Then the creamy body and garnish resolve.
- Camera makes a subtle push-in.
- Avoid vertical crop/reveal tricks that look synthetic.

### ACT III — HERO DRINK
Progress: `0.40 → 0.68`

- Piña Colada reaches full clarity and becomes very large.
- Atmospheric glow tightens behind the glass.
- Condensation/highlights in the source image remain untouched.
- The drink floats briefly in a controlled hero moment.

### ACT IV — TERRACE TRANSITION
Progress: `0.62 → 0.86`

- Sky moves upward and fades.
- Warm terrace bokeh and architectural light appear behind the drink.
- A tabletop rises into the lower frame.
- Perspective changes subtly to make the drink feel physically placed.

### ACT V — LANDING / WEBSITE START
Progress: `0.82 → 1.00`

- Piña Colada settles on the table with a tiny deceleration.
- Contact shadow/reflection appears.
- Final copy fades in only after the landing.
- User exits the sticky scene into the normal LAVENDISH page.

---

## Phase plan

### Phase 0 — Safety and planning ✅
- [x] Create isolated branch from current stable `main`.
- [x] Create this roadmap.
- [x] Freeze production sections during experiment.

### Phase 1 — Cinematic blocking ✅
- [x] Build isolated preview page.
- [x] Implement sticky scroll timeline.
- [x] Build night sky, cloud layers, terrace transition and table composition.
- [x] Use the real Piña Colada as the only drink visual.
- [x] Add progress interpolation and mobile/reduced-motion behavior.

### Phase 2 — Art direction pass
- [ ] Tune scale, camera movement and timing on desktop.
- [ ] Tune mobile composition separately.
- [ ] Improve cloud depth and atmospheric lighting.
- [ ] Improve table material, contact shadow and final landing.
- [ ] Remove any motion that feels artificial.

### Phase 3 — Photoreal environment assets
- [ ] Replace procedural atmosphere where needed with dedicated local cinematic plates.
- [ ] Produce final night-sky / cloud plate.
- [ ] Produce final dream-terrace plate.
- [ ] Optimise assets to WebP/AVIF and preload only what is necessary.

### Phase 4 — QA
- [ ] Desktop: 1440×900, 1920×1080, ultrawide sanity check.
- [ ] Tablet: landscape + portrait.
- [ ] Mobile: 320, 375/390, 430 widths.
- [ ] Safari/iOS sticky + scroll validation.
- [ ] Chrome/Edge/Firefox validation.
- [ ] No horizontal overflow.
- [ ] No layout jumps after images decode.
- [ ] Reduced-motion validation.

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
- `main` remains unchanged until approval.

---

## Rollback policy

`main` is the stable production source. This branch is disposable until approved. No experimental code should be merged merely to make it easier to preview.
