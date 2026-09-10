# LAVENDISH — Cinematic Hero V6 AAA Roadmap

## Objective
Create a short, elegant cinematic arrival that feels like part of the website itself, not a separate intro screen. The user must be able to understand, interact with, and scroll the site immediately while a subtle sky → Piña Colada → LAVENDISH transition happens in the hero background.

## UX principle
**The animation is decoration. The website is available from frame one.**

If the cinematic ever delays navigation, hides the main CTA, captures scroll, requires an “Enter” action, or makes the user feel they are waiting for a splash screen, the implementation is wrong.

## Non-negotiable rules
- `main` stays untouched until explicit approval.
- Work only on `feature/cinematic-intro-v6-aaa`.
- No GLB, fake 3D, procedural cocktail, cubes, assembly mechanics, or scroll-locked choreography.
- Use the real Piña Colada photography already in the repository.
- Motion is limited to cross-dissolve, tiny scale changes and tiny translations.
- No looping hero animation.
- Navigation and primary CTA are interactive immediately.
- Scrolling is never locked.
- Any real user intent (wheel, touch, pointer, keyboard) settles the cinematic immediately without cancelling the intended interaction.
- Returning visits in the same session skip the cinematic.
- `?replay=1` is available only for review/testing so the animation can be replayed on reload.
- `prefers-reduced-motion` resolves directly to the final hero.
- Each phase has a review gate. Do not add complexity to compensate for a failed gate.

## Target experience
The user should perceive one continuous page:
1. LAVENDISH UI is already present.
2. The background begins as an elegant night sky.
3. The real Piña Colada appears briefly and gently.
4. The bar image emerges underneath through a photographic cross-dissolve.
5. The cocktail disappears and the exact same hero remains fully usable.

There is no separate end card and no “Enter” step.

## Timing target
Total decorative motion: approximately **2.5 seconds**.
- 0.00–0.35 s — hero is already usable; sky dominates.
- 0.30–1.20 s — Piña Colada fades in with sub-2% movement.
- 0.75–2.10 s — LAVENDISH/bar image cross-dissolves underneath.
- 1.45–2.45 s — drink dissolves away.
- ~2.55 s — only the final usable hero remains.

If the user interacts at any point, resolve immediately to the final hero.

## Phase 0 — Safety and clean baseline
Status: COMPLETE
- Branch created from current `main`.
- No production integration.
- Experimental V3/V4/V5 implementation not inherited.

Gate: COMPLETE.

## Phase 1A — Separate intro prototype
Status: REJECTED AS UX DIRECTION
Reason:
- visually cleaner than previous versions, but still perceived as a separate intro/splash;
- final lockup + “Entrar” created an unnecessary interaction boundary;
- body was effectively intro-only rather than a real page from frame one.

Decision: do not refine this direction further.

## Phase 1B — Seamless cinematic hero
Status: IMPLEMENTED — PENDING VISUAL/UX APPROVAL
Deliverables:
- `preview-cinematic-v6.html`
- `css/cinematic-v6.css`
- `js/cinematic-v6.js`

Implemented UX requirements:
- real page and hero from the first frame;
- header and “Ver carta” available immediately;
- normal scrolling available immediately;
- no Skip/Enter screen required;
- cinematic runs behind useful content;
- total motion shortened to ~2.55 s;
- interaction intent instantly settles the visual transition;
- same-session repeat visits skip the cinematic;
- `?replay=1` forces replay for review;
- critical asset preload has a strict time budget;
- missing critical imagery falls back to final usable state;
- reduced-motion resolves immediately;
- second content section included to validate uninterrupted scrolling into the site.

### Current refinement — Piña Colada optical motion
Status: IMPLEMENTED — PENDING VISUAL APPROVAL
- The cocktail now has its own nested motion layer instead of relying only on the scene fade.
- Motion is deliberately restrained: about **1.6% camera push**, **~9 px total vertical travel**, and **~3 px horizontal drift** across 1.9 s.
- No rotation, bouncing, looping, mouse-follow, spring physics or 3D effect.
- Motion uses the Web Animations API so it can be cancelled instantly when the user interacts.
- The existing wrapper still controls appearance/disappearance; the image motion only adds subtle depth.
- Reduced-motion users receive no cocktail movement.

Gate:
- user should no longer describe it as “an intro”;
- interaction should feel immediate, fluid and natural;
- cocktail motion should feel like a gentle camera move, not an animated sticker;
- animation should be noticed as polish, not as a task or wait state.

## Phase 2 — Final photographic art direction
Status: NOT STARTED
Only start after Phase 1B UX approval.
- Decide final sky asset.
- Decide final LAVENDISH destination photograph: storefront, actual interior/bar, terrace, or final production hero.
- Match exposure, contrast, focal point and color grade between sky/product/bar.
- Host all final imagery locally.

Gate: imagery feels like one photographic sequence, not three unrelated layers.

## Phase 3 — Interaction polish and performance
Status: NOT STARTED
- Tune timing in 50–100 ms increments.
- Validate first input delay and pointer responsiveness.
- Remove layout shift and visual flash risk.
- Validate mobile viewport/safe-area behavior.
- Test iOS Safari and modern Chromium.
- Verify session behavior and fallback paths.

Gate: no visible jank, blocking, lost input, accidental navigation delay or animation replay annoyance.

## Phase 4 — Controlled production integration
Status: NOT STARTED
- Create a separate integration branch from then-current `main`.
- Reconcile production changes first.
- Integrate only approved hero behavior.
- Keep a straightforward disable/fallback path.

Gate: explicit user approval before merge.

## Current review question
Does Phase 1B now feel like **the website itself coming alive**, with the Piña Colada adding a small amount of premium depth rather than feeling like a separate animated object?

If not, modify Phase 1B only. Do not add more scenes, more effects or more technology.
