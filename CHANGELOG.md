# Changelog

## 1.4.0 — 2026-09-09

- Integrada en la home la experiencia inmersiva de Piña Colada controlada por scroll.
- El montaje visual se divide en cinco fases: Cristal, Hielo, Mezcla, Espuma y Acabado.
- Añadidos perspectiva CSS 3D, profundidad, rotación, hielo, líquido, espuma, garnish, partículas y transición final al asset fotográfico real.
- Añadido CTA final “Seguir a Mojitos”.
- El módulo vive aislado en `js/pina-3d.js` y `css/pina-3d.css`; no se han modificado los assets de Mojitos, Carta, footer, legales ni los CSS responsive estables.
- Añadido `IntersectionObserver` y `requestAnimationFrame` para limitar trabajo de render.
- El parallax de puntero solo se activa en dispositivos compatibles y se desactiva con `Save-Data` o memoria muy limitada.
- Añadido fallback completo para `prefers-reduced-motion`.
- Validación automatizada realizada en 1440×900, 1024×768, 768×1024, 430×932, 390×844 y 320×700, sin overflow horizontal ni errores JavaScript en el fixture de prueba.
- GitHub Pages build y deploy completados correctamente.
- Añadidos `EXPERIMENTS.md`, `TESTING-3D-v0.2.md` y preview aislada `preview-pina-3d.html` con `noindex,nofollow`.
- Conservados backups `backup/stable-v1.3.0` y `backup/pre-3d-home-v1.3`.

## 1.3.0 — 2026-09-03

- Añadida capa final de accesibilidad visual aislada en `style-08.css`.
- Mejorado el menú con focus trap, `Escape`, devolución de foco e `inert` para el fondo.
- Desactivada la navegación de Mojitos por teclado mientras el menú está abierto.
- Precarga diferida de sabores para no competir con el hero.
- Añadido soporte explícito para `prefers-reduced-motion`.
- Añadida página `404.html` de marca.
- Añadidos estados `focus-visible` consistentes.
- Mejorados Open Graph, Twitter Card y JSON-LD `BarOrPub` con `hasMenu`.
- Preservada la versión anterior en `backup/stable-v1.2.0`.

## 1.2.0 — 2026-09-03

- Añadidos Aviso legal, Política de privacidad y Política de cookies.
- Documentada la situación real de cookies y alojamiento en GitHub Pages.
- Añadida Carta en catalán y aviso de alergias/intolerancias.
- Rediseñado el footer con acceso permanente a ubicación y páginas legales.
- Añadidos `NOTICE.md`, auditoría y checklist de cumplimiento.

## 1.1.1 — 2026-09-03

- Corregido el desplazamiento horizontal al cambiar de mojito en móvil.
- Sustituido `scrollIntoView()` por scroll interno controlado del rail.
- Mojito activo absolutamente centrado dentro de un stage estable.
- Reservado espacio de copy para evitar saltos verticales.
- Reforzado responsive 320–760 px.
- Carta rediseñada sobre superficie cálida clara y una columna en móvil.

## 1.1.0 — 2026-09-03

- Rediseñado el showcase de Mojitos con composición editorial premium.
- Mojito activo renderizado como `<img>` transparente real.
- Iluminación adaptativa por sabor en capas independientes.
- Añadidos controles anterior/siguiente, teclado y rail táctil de 14 sabores.
- Menú compacto rehecho en JavaScript vanilla.
- Responsive reforzado para móvil, tablet y escritorio.
- Eliminados de producción los render heredados que podían provocar cuadrados detrás del vaso.

## 1.0.0 — 2026-09-03

- Primera versión oficial single-page de LAVENDISH.
- Hero con Piña Colada.
- Selector de Mojitos.
- Carta simplificada.
- Identidad responsive.
- SEO básico, Open Graph, datos estructurados, robots y sitemap.
