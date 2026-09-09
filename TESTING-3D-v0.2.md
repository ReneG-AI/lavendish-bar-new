# LAVENDISH — Piña Colada 3D prototype v0.2 testing

This file documents the isolated prototype validation performed before integrating the experience into the production home page.

## Automated checks performed

The prototype JavaScript was syntax-checked with Node.js (`node --check`).

The CSS was parsed and validated for balanced braces/parentheses before publication.

A headless Chromium test harness then injected the production `pina-3d.js` and `pina-3d.css` into an isolated LAVENDISH-like document and exercised the scroll timeline at multiple progress points.

Viewport profiles tested:

- 1440 × 900 desktop
- 1024 × 768 laptop
- 768 × 1024 tablet
- 430 × 932 mobile
- 390 × 844 mobile
- 320 × 700 small mobile

For every profile the checks verified:

- the 3D section is inserted exactly once;
- all 5 build stages exist;
- stage progression reaches Cristal → Hielo → Mezcla → Espuma → Acabado;
- the final Piña Colada layer reaches full opacity;
- the final CTA appears at the end of the timeline;
- the caption changes at the final stage;
- no JavaScript errors or unhandled rejections are emitted;
- the document produces no horizontal overflow at any sampled scroll state.

The final mobile state was additionally reviewed for text/CTA overlap and the final caption was changed to fade out before the outro controls become dominant.

## Deployment validation

The isolated preview is published at `preview-pina-3d.html` and remains `noindex,nofollow`.

The GitHub Pages deployment for the v0.2 preview completed successfully before home-page integration.

## Rollback rule

The production home must remain recoverable from `backup/stable-v1.3.0` (and later pre-integration backups) until the 3D experience is explicitly promoted to a stable release.
