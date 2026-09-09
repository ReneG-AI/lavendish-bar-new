# Experimental features

Production visual experiments must remain isolated from the stable home until they pass responsive, interaction and performance checks.

Current experiment:

- Piña Colada scroll-build experience (`preview-pina-3d.html`, `css/pina-3d.css`, `js/pina-3d.js`).
- The preview is intentionally excluded from indexing.
- The stable home does not load the experiment until a reviewed integration branch is merged.

Rollback branches are retained before every experimental promotion to `main`.
