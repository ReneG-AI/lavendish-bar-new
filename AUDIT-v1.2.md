# LAVENDISH — auditoría de producción y legal v1.2

Fecha: 2026-09-03

## Seguridad de la versión estable

La rama `audit/legal-v1.2` parte exactamente del commit estable de `main`:

`69a62fae25df88268df7c7bbbe7f38b6ad140e00`

No se modifica `main` durante esta auditoría.

## Revisado

### UI / interacción

- El menú superior derecho conserva la implementación estable basada en `html.menu-open`.
- No se modifica `js/app.js` en esta rama.
- No se modifica la lógica del selector de mojitos.
- No se modifican assets de mojitos ni iconos.
- No se modifica la composición responsive de la sección de mojitos salvo el estilo discreto de enlaces legales del footer.
- La carta mantiene la capa de contraste claro introducida en v1.1.1.

### Responsive

- Se conserva el sistema actual de breakpoints para móvil, tablet y escritorio.
- La rama no introduce nuevos contenedores dentro de las secciones hero, mojitos o carta.
- Las páginas legales usan CSS independiente (`css/legal.css`) para evitar interferencias con la web principal.

### Privacidad y cookies

Búsqueda realizada en el repositorio actual:

- sin `document.cookie`;
- sin Google Analytics / `gtag`;
- sin Meta Pixel;
- sin `localStorage` o `sessionStorage` destinados a tracking;
- sin formularios;
- sin newsletter;
- sin registro de usuarios;
- sin reservas o pagos online;
- Google Maps se abre como enlace externo, no como iframe embebido.

Conclusión técnica actual: no se necesita un banner de consentimiento mientras la web siga sin incorporar cookies o tecnologías equivalentes sujetas a consentimiento. La política de cookies debe revisarse si se añade analítica, publicidad o contenido embebido de terceros.

### SEO / estructura

La producción ya incluye:

- `lang="es"`;
- title y meta description;
- canonical;
- Open Graph;
- Twitter Card;
- JSON-LD `BarOrPub`;
- `robots.txt`;
- `sitemap.xml`;
- HTTPS mediante GitHub Pages;
- `.nojekyll`.

Las páginas legales se mantienen con `noindex,follow` mientras se revisa la rama. No se añaden al sitemap por ahora.

### Accesibilidad básica

La web ya contiene:

- enlace de salto a la carta;
- labels accesibles en navegación y controles principales;
- estados ARIA en el selector de sabores;
- soporte `prefers-reduced-motion`;
- textos alternativos en imágenes informativas;
- cierre de menú con `Escape`.

## Añadido en esta rama

- `aviso-legal.html`
- `privacidad.html`
- `cookies.html`
- `css/legal.css`
- enlaces legales discretos en el footer de `index.html`

Las páginas legales son deliberadamente independientes del CSS y JS principal para reducir el riesgo de regresiones.

## Identificación legal incorporada

A partir de la documentación facilitada por el negocio se han incorporado:

- Titular: Jiayi Huangzheng.
- NIF/NIE: X7471573T.
- Domicilio del establecimiento: Av. de Balmes, 21 · 25006 Lleida.
- Correo de contacto legal/privacidad: jiayi19733@gmail.com.

El teléfono no se publica porque la web pública había decidido expresamente no mostrarlo y no es necesario para esta implementación.

No se han añadido datos registrales porque no constan en la documentación facilitada; solo deben incorporarse si realmente proceden.

## Recomendaciones no bloqueantes

- Usar en el futuro un dominio propio de LAVENDISH en lugar del subdominio `github.io` para reforzar marca y confianza.
- Revisar la licencia MIT del repositorio: actualmente es muy abierta. Conviene decidir expresamente si logotipo, fotografías y demás activos de marca quedan fuera de esa licencia.
- Mantener la regla permanente de mojitos: imagen transparente como `<img>` y efectos de luz siempre en capas hermanas.
- Si se incorpora analítica o cualquier servicio de terceros, realizar revisión de privacidad/cookies antes del despliegue.

## Criterio para fusionar a `main`

Antes de fusionar esta rama:

- revisar una última vez el texto legal;
- comprobar enlaces legales desde footer en móvil y escritorio;
- confirmar que menú, mojitos y carta se comportan exactamente igual que en el commit estable de partida;
- decidir si se mantiene `noindex` en las páginas legales o se permite su indexación;
- decidir cómo se separan los activos de marca de la licencia MIT del código.
