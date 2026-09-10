# LAVENDISH — Cinematic Intro v2 Asset Brief

This brief defines the Phase 3 visual plates. The product itself is **not regenerated**: `assets/pina-colada.webp` remains the hero drink.

## Plate A — Night sky / cloud environment

Purpose: Acts I–III background.

Required look:
- realistic deep summer-night sky, elegant rather than fantasy-heavy;
- sparse stars with natural variation, no dense galaxy or sci-fi nebula;
- large soft cloud banks occupying the lower third and lower sides;
- dark navy / charcoal palette;
- subtle cool moonlight from upper-right;
- very faint warm glow underneath the clouds, foreshadowing the terrace below;
- central/right negative space reserved for the Piña Colada silhouette;
- no text, people, logos, buildings or drink;
- premium hospitality advertising aesthetic;
- photorealistic, cinematic, plausible cloud texture.

Composition master:
- 16:9 landscape master, minimum 2560×1440;
- keep the visual focus safe inside the central 60% so mobile crops remain usable;
- clouds must have enough separation from the sky to support gentle parallax/crossfade.

Preferred deliverables:
- `assets/cinematic-v2/night-sky.webp`
- optional separate foreground cloud alpha plate: `assets/cinematic-v2/clouds-front.webp`

## Plate B — Dream terrace environment

Purpose: Acts IV–V background and final website-start frame.

Required look:
- aspirational night bar terrace, warm, intimate and elegant;
- premium but believable, not a luxury-hotel cliché;
- dark blue night retained in upper background so the transition from Plate A feels continuous;
- warm amber practical lights and natural bokeh;
- subtle greenery or architectural texture only if it does not compete with the drink;
- a clearly readable terrace table in foreground or a clean landing zone for a separate table plate;
- central/right product space must remain uncluttered;
- left/lower-left space should support the final copy without bright visual noise;
- no people in the immediate foreground;
- no text, logos or visible competing cocktails;
- photorealistic commercial-beverage lighting.

Composition master:
- 16:9 landscape master, minimum 2560×1440;
- table landing zone around 70–77% of viewport height;
- camera roughly seated/standing eye level, avoiding extreme wide-angle distortion;
- product should read naturally at approximately 30–40% of frame height once placed.

Preferred deliverables:
- `assets/cinematic-v2/terrace-night.webp`
- optional separate foreground table alpha plate: `assets/cinematic-v2/table-foreground.webp`

## Product lighting compatibility

The generated environments must support the existing Piña Colada asset rather than forcing recolouring of it.

Target lighting relationship:
- cool/neutral ambient from upper-right during the sky phase;
- warm amber rim/fill increases during terrace transition;
- final landing shadow directly under the glass, soft-edged and not overly black;
- no strong coloured light that makes the creamy drink look green, grey or orange.

## Mobile crop rules

Both plates must remain coherent at:
- 430×932;
- 390×844;
- 375×812;
- 320×700.

Do not put essential lights, architecture or cloud features exclusively at the far left/right edges. The drink must remain the protagonist after center-cropping.

## Performance budget

Targets after optimisation:
- first-frame night plate: ideally <= 300 KB WebP, hard target <= 450 KB;
- terrace plate: ideally <= 350 KB WebP, hard target <= 500 KB;
- optional cloud/table alpha plates: each ideally <= 180 KB;
- no autoplay video in the first implementation;
- no remote CDN dependency.

## Integration rule

Phase 3 assets stay on `feature/pina-cinematic-intro-v2`. They are not referenced from production `main` until the visual direction and Phase 4 QA are approved.
