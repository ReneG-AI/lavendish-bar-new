# LAVENDISH — Official Website

Sitio web oficial de **LAVENDISH**, bar / cocktail bar en Lleida. La rama `main` contiene la web de producción publicada en GitHub Pages.

**Live:** https://reneg-ai.github.io/lavendish-bar-new/

## Estado

**Versión:** 1.1.0  
**Rama de publicación:** `main`  
**Hosting:** GitHub Pages  
**Arquitectura:** HTML + CSS + JavaScript vanilla, sin framework ni proceso de build.

## v1.1 — dirección visual

La versión 1.1 refina la base estable 1.0 hacia una estética editorial de hospitality premium:

- fondo carbón / negro cinematográfico;
- tipografía serif de alto contraste para titulares;
- acentos dorados cálidos y contenidos;
- Piña Colada como bebida protagonista del hero;
- showcase editorial de **14 mojitos**;
- iluminación atmosférica adaptativa por sabor;
- navegación anterior / siguiente junto al vaso;
- selector de sabores táctil, centrado y con scroll horizontal seguro;
- menú compacto superior derecho con cierre por selección, botón, Escape y clic exterior;
- transiciones cortas y soporte para `prefers-reduced-motion`.

## Contenido real publicado

### Carta

- Patatas bravas
- Calamares a la romana
- Croquetas de jamón · 4 uds.
- Croquetas de pollo · 4 uds.
- Rollitos crujientes · 4 uds.
- Gyozas de pollo · 5 uds.
- Gyozas de gamba · 5 uds.
- Alitas de pollo · 8 uds.
- Yakisoba
- Yakisoba con pollo

No se publican precios en la web.

### Mojitos

1. Original · menta y lima
2. Fresa
3. Frutos del bosque
4. Piña
5. Coco
6. Piña colada
7. Maracuyá
8. Mango
9. Frambuesa
10. Melocotón
11. Sandía
12. Cereza
13. Manzana verde
14. Uva

## Estructura

```text
lavendish-bar-new/
├── index.html
├── robots.txt
├── sitemap.xml
├── .nojekyll
├── VERSION
├── README.md
├── CHANGELOG.md
├── js/
│   └── app.js                 # menú + selector de mojitos
├── css/
│   ├── style-00.css           # base histórica estable
│   ├── style-01.css
│   ├── style-02.css
│   ├── style-03.css
│   ├── style-04.css
│   ├── style-05.css           # legado 1.0, ya no se carga en producción
│   ├── assets-physical.css    # legado 1.0, ya no se carga en producción
│   └── style-06.css           # capa visual oficial v1.1
└── assets/
    ├── favicon.png
    ├── lavendish-logo.webp
    ├── lavendish-storefront.webp
    ├── pina-colada.webp
    ├── icons/                 # 14 archivos físicos independientes
    └── mojitos/               # 14 mojitos WebP transparentes
```

## Arquitectura del showcase de mojitos

Cada sabor usa un **archivo WebP físico** de `assets/mojitos/` y un icono físico independiente de `assets/icons/`. La selección se controla desde `js/app.js`, que cambia la fuente del elemento `<img class="mojito-image">`, actualiza el texto, el estado ARIA y la variable CSS `--flavor-rgb`.

No se usa sprite sheet ni `background-image` para renderizar el vaso activo en producción.

### Iluminación

La iluminación se compone mediante capas HTML/CSS separadas detrás del vaso:

```text
mojito-stage-v11
├── mojito-light-wide
├── mojito-light-core
├── mojito-light-streak
├── mojito-mist
├── mojito-particles
├── mojito-image              # bitmap transparente, sin efectos de fondo
└── controles prev / next
```

El color ambiental cambia por sabor mediante `--flavor-rgb`. La saturación se mantiene contenida para evitar una estética de neón.

## Corrección permanente: rectángulo / cuadrado detrás del mojito

### Causa raíz

La implementación 1.0 había acumulado un render heredado basado en `.mojito-sprite` y una imagen embebida en CSS. Aunque `assets-physical.css` reemplazaba después la fuente por WebP físicos, el uso de una capa de background para la bebida hacía demasiado fácil que un fondo, filtro, pseudo-elemento o glow aplicado al mismo lienzo revelase los límites rectangulares del bitmap.

### Solución v1.1

La bebida activa se renderiza ahora como un **`<img>` real y transparente**. El vaso y la iluminación son capas completamente independientes.

Regla permanente:

```css
.mojito-image {
  background: transparent;
  box-shadow: none;
  filter: none;
  mix-blend-mode: normal;
}
```

Nunca aplicar al bitmap del mojito:

- `background-color`;
- gradientes de iluminación;
- `box-shadow` como glow;
- `backdrop-filter`;
- `mix-blend-mode`;
- overlays o pseudo-elementos.

Todo glow, niebla, partículas o spotlight debe añadirse como **hermano situado detrás del `<img>`**. Así el efecto no puede pintar un rectángulo siguiendo los límites del archivo.

`style-05.css` y `assets-physical.css` se conservan solo como historia técnica de la base 1.0, pero **ya no se cargan desde `index.html`**.

## Cómo sustituir assets sin romper la web

### Mojito

1. Exportar en WebP con transparencia real.
2. Mantener el nombre `assets/mojitos/mojito-<sabor>-stable.webp` o actualizar `assetFor()` en `js/app.js`.
3. No hornear glow ni fondo oscuro dentro del archivo.
4. Mantener espacio suficiente alrededor del vaso dentro del canvas transparente.
5. Verificar escritorio y móvil antes de publicar.

### Icono de sabor

1. Un archivo por sabor en `assets/icons/`.
2. No usar recortes de sprite sheets.
3. Centrar el arte dentro de un canvas consistente.
4. Comprobar que no hay fragmentos del icono vecino, clipping ni bordes accidentales.

## Interacción

- Flechas laterales: sabor anterior / siguiente con loop continuo.
- `ArrowLeft` / `ArrowRight`: navegación por teclado cuando la sección está visible.
- Iconos: selección directa.
- Rail móvil: scroll táctil horizontal con padding inicial y final para que Original y Uva nunca queden cortados.
- Menú: abre desde el botón superior, cierra al seleccionar, con clic exterior, botón × o `Escape`.

## Responsive

La composición tiene breakpoints específicos y usa tamaños fluidos para conservar jerarquía entre 320 px y escritorios grandes:

- desktop: copy editorial a la izquierda + cocktail a la derecha;
- tablet: misma jerarquía con menor escala;
- móvil: titular → cocktail → controles → nombre / descriptor → rail de sabores.

La sección usa `100svh` cuando conviene, evita scroll horizontal de página y mantiene el rail independiente para pantallas pequeñas.

## Piña Colada

El asset oficial del hero sigue siendo:

```text
assets/pina-colada.webp
```

No debe sustituirse por un mojito.

## Ubicación

**LAVENDISH**  
Av. de Balmes, 21  
25006 Lleida

La web pública no muestra teléfono ni email. El CTA de ubicación es **Cómo llegar**.

## SEO y producción

Se mantienen:

- canonical;
- Open Graph;
- Twitter Card;
- JSON-LD `BarOrPub`;
- `robots.txt`;
- `sitemap.xml`;
- HTML semántico y textos alternativos;
- `.nojekyll` para GitHub Pages.

La URL canónica temporal de producción es `https://reneg-ai.github.io/lavendish-bar-new/`.

## Desarrollo local

No existe proceso de build. Se puede servir directamente:

```bash
python -m http.server 8080
```

## Principios de mantenimiento

1. `main` contiene siempre la versión publicable.
2. No crear carpetas `preview-vXX` ni una segunda web de Pages.
3. No inventar platos, precios, teléfono, email ni información del negocio.
4. No volver a sprites para los iconos de sabores.
5. Mantener los mojitos transparentes y la iluminación en capas independientes.
6. No añadir imágenes grandes embebidas en base64 al CSS de producción.
7. Mantener JavaScript pequeño, sin librerías pesadas.
8. Probar visualmente escritorio, tablet y Safari/iPhone tras cambios de layout o assets.

---

© 2026 LAVENDISH · Lleida
