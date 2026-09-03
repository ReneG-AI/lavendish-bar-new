# Changelog

## 1.2.0 — 2026-09-03

- Añadido Aviso legal completo con identificación del titular, NIF/NIE, domicilio, correo legal, teléfono de contacto, condiciones de uso, propiedad intelectual, enlaces, responsabilidad y legislación aplicable.
- Añadida Política de privacidad adaptada a la web real: sin formularios, cuentas, reservas, pagos ni analítica propia; tratamiento de consultas por correo y explicación del alojamiento en GitHub Pages.
- Añadida Política de cookies específica para la configuración actual, sin analítica ni publicidad y sin banner de consentimiento mientras no se incorporen tecnologías no exentas.
- Documentado que GitHub Pages registra direcciones IP con fines de seguridad según su documentación pública.
- Añadida versión accesible de la información de carta en catalán (`carta-catala.html`), enlazada directamente desde la carta y el footer, para reforzar el cumplimiento de los derechos lingüísticos de consumo en Cataluña.
- Añadido aviso visible en la carta catalana para que las personas con alergias o intolerancias consulten la información correspondiente antes de pedir.
- Añadido diseño editorial propio para las páginas legales, coherente con la identidad negra, marfil y dorada de LAVENDISH.
- Rediseñado el footer principal para mejorar jerarquía, legibilidad, ubicación, CTA y acceso permanente a Aviso legal, Privacidad, Cookies y Carta en català.
- Añadido `meta referrer` con política `strict-origin-when-cross-origin`.
- Añadido `NOTICE.md` para separar expresamente la licencia del código de los derechos sobre marca, logo, fotografías e ilustraciones de LAVENDISH.
- Actualizado el cache-busting de `style-07.css` a `1.2.0`.
- La rama no modifica `js/app.js`, la lógica del menú, el selector de mojitos ni los assets de bebidas.

## 1.1.1 — 2026-09-03

- Corregido el desplazamiento horizontal del viewport al cambiar de mojito en móvil.
- Sustituido `scrollIntoView()` por scroll controlado únicamente dentro del rail de sabores para evitar el bug de iOS Safari.
- El mojito activo queda ahora absolutamente centrado dentro de un stage estable, independientemente de las dimensiones intrínsecas de cada asset.
- Reservado espacio fijo para nombre y descripción de sabor para evitar saltos verticales entre sabores.
- Añadidas protecciones de overflow y anchura para 320–760 px.
- Precarga ligera de los 14 mojitos para cambios más estables y sin reflow visual.
- Carta rediseñada sobre una superficie cálida clara con contraste explícito para títulos, platos, navegación y texto descriptivo.
- Mejorada la carta en móvil con una sola columna, espaciado y tamaños de lectura más cómodos.
- Nuevo `style-07.css` como capa de corrección responsive y accesibilidad visual.
- Cache-busting actualizado a 1.1.1.

## 1.1.0 — 2026-09-03

- Rediseñado el showcase de Mojitos con composición editorial premium inspirada en la referencia visual definitiva.
- Nuevo titular “Tu mojito. Tu sabor.” con jerarquía, tipografía y espaciado refinados.
- Mojito activo renderizado como `<img>` físico transparente, eliminando la dependencia del sprite/background heredado.
- Nuevo sistema de iluminación adaptativa por sabor con glow central, bloom ambiental, streak vertical, niebla baja y partículas sutiles en capas independientes.
- Añadidos controles anterior / siguiente junto al vaso con loop continuo.
- Añadida navegación por teclado con `ArrowLeft` y `ArrowRight` cuando la sección está visible.
- Rail de 14 sabores más compacto, táctil, centrado y con padding seguro para no recortar Original ni Uva.
- Selector de sabores actualizado con estado ARIA, transición de imagen, nombre y descriptor.
- Menú compacto rehecho con JavaScript vanilla para abrir/cerrar de forma fiable, cerrar al seleccionar, al pulsar Escape y al hacer clic fuera.
- Refinados hero, header, tipografía, fondos y microinteracciones para coherencia visual.
- Responsive reforzado para 320, 375, 390, 430, 768, 1024 y escritorios grandes.
- `style-05.css` y `assets-physical.css` dejan de cargarse en producción; se conservan únicamente como legado 1.0.
- README ampliado con arquitectura, reglas de assets y documentación de la corrección permanente del fondo cuadrado.
- Cache-busting y metadatos actualizados a 1.1.0.

## 1.0.0 — 2026-09-03

- Nueva web single-page de LAVENDISH.
- Nueva identidad visual responsive para móvil y escritorio.
- Hero con Piña Colada.
- Carta simplificada para compartir.
- Selector CSS de 14 sabores de mojito.
- Assets físicos para mojitos e iconos.
- Corrección permanente del rectángulo/fondo visible en los mojitos.
- Eliminados teléfono y email de la web pública.
- SEO básico, Open Graph, datos estructurados, robots y sitemap.
- Limpieza de previews y automatizaciones temporales.
