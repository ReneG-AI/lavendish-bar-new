# LAVENDISH — Official Website

Sitio web oficial de **LAVENDISH**, bar / cocktail bar en Lleida.

**Live:** https://reneg-ai.github.io/lavendish-bar-new/

## Estado

**Versión candidata:** 1.3.0  
**Rama estable actual:** `main` → v1.2.0  
**Rama de trabajo:** `polish/premium-v1.3`  
**Backup estable:** `backup/stable-v1.2.0`  
**Hosting:** GitHub Pages  
**Arquitectura:** HTML + CSS + JavaScript vanilla, sin framework ni proceso de build.

La versión 1.3 es una capa de acabado técnico y de accesibilidad sobre la base visual ya aprobada en v1.2. No rediseña el hero, la carta, el showcase de mojitos ni la geometría responsive estable.

## Dirección visual

La web sigue una estética editorial de hospitality premium:

- fondo carbón / negro cinematográfico;
- tipografía serif de alto contraste para titulares;
- acentos dorados cálidos y contenidos;
- Piña Colada como protagonista del hero;
- showcase editorial de 14 mojitos;
- iluminación atmosférica adaptativa por sabor;
- navegación anterior / siguiente junto al vaso;
- selector de sabores táctil con scroll horizontal seguro;
- menú compacto superior derecho;
- transiciones cortas y soporte para `prefers-reduced-motion`;
- carta sobre superficie cálida clara para garantizar legibilidad;
- footer editorial con ubicación y acceso permanente a la información legal;
- página 404 propia y coherente con la identidad visual.

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

No se publican precios en la web y no existe contratación a distancia desde esta versión.

La información comercial de esta selección está disponible también en catalán mediante `carta-catala.html`, con acceso directo desde la propia Carta y desde el footer.

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
├── 404.html
├── carta-catala.html
├── aviso-legal.html
├── privacidad.html
├── cookies.html
├── robots.txt
├── sitemap.xml
├── .nojekyll
├── VERSION
├── README.md
├── CHANGELOG.md
├── NOTICE.md
├── AUDIT-v1.2.md
├── COMPLIANCE-CHECKLIST.md
├── js/
│   └── app.js                 # menú accesible + selector de mojitos
├── css/
│   ├── style-00.css           # base histórica
│   ├── style-01.css
│   ├── style-02.css
│   ├── style-03.css
│   ├── style-04.css
│   ├── style-05.css           # legado 1.0, no cargado
│   ├── assets-physical.css    # legado 1.0, no cargado
│   ├── style-06.css           # dirección visual oficial 1.1
│   ├── style-07.css           # estabilidad responsive, carta, menú y footer
│   ├── style-08.css           # foco, reduced motion y acabado accesible 1.3
│   ├── legal.css              # diseño aislado para páginas legales
│   ├── carta-ca.css           # estilo aislado de la carta en catalán
│   └── 404.css                # página de error de marca
└── assets/
    ├── favicon.png
    ├── lavendish-logo.webp
    ├── lavendish-storefront.webp
    ├── pina-colada.webp
    ├── icons/                 # 14 iconos físicos independientes
    └── mojitos/               # 14 mojitos WebP transparentes
```

## Privacidad y cookies

La versión actual es una web informativa y deliberadamente ligera:

- no contiene formularios;
- no contiene registro de usuarios;
- no contiene reservas o pagos online;
- no incorpora Google Analytics, Google Tag Manager o Meta Pixel;
- no incorpora publicidad comportamental o remarketing;
- no utiliza `localStorage` / `sessionStorage` para seguimiento;
- Google Maps se abre mediante un enlace externo, no mediante iframe embebido.

Por esta razón, mientras se mantenga esta arquitectura no se muestra un banner de consentimiento de cookies. Si se incorpora cualquier tecnología no exenta, debe revisarse `cookies.html` e implantar el consentimiento correspondiente **antes** de cargarla en producción.

GitHub Pages registra la dirección IP de las visitas con fines de seguridad según su documentación pública. Esta circunstancia se explica en `privacidad.html` y `cookies.html`.

### Páginas legales

- `aviso-legal.html`: identificación y contacto del titular, objeto, uso, propiedad intelectual, enlaces, responsabilidad y legislación.
- `privacidad.html`: responsable, datos, finalidades, bases jurídicas, proveedores, conservación y derechos RGPD.
- `cookies.html`: situación técnica actual, tecnologías no utilizadas, GitHub Pages y criterio de consentimiento.

Las páginas legales tienen CSS independiente para que cualquier cambio en ellas no afecte al hero, menú, mojitos o carta.

## Cumplimiento en Cataluña

`COMPLIANCE-CHECKLIST.md` documenta las comprobaciones web y las obligaciones del establecimiento que no se resuelven únicamente con una página web.

Entre las medidas incorporadas en v1.2:

- acceso a la información comercial de la selección de carta también en catalán;
- aviso de alergias/intolerancias en la carta catalana;
- canal de contacto adicional en el Aviso Legal;
- checklist separado para información de alérgenos, carta física, precios, hojas de reclamación, horario y otros tratamientos de datos del negocio.

## Arquitectura del showcase de mojitos

Cada sabor usa un **archivo WebP físico** de `assets/mojitos/` y un icono físico independiente de `assets/icons/`. La selección se controla desde `js/app.js`, que cambia la fuente del elemento `<img class="mojito-image">`, actualiza el texto, el estado ARIA y la variable CSS `--flavor-rgb`.

No se usa sprite sheet ni `background-image` para renderizar el vaso activo en producción.

### Precarga v1.3

El primer mojito se carga normalmente desde el documento. Los sabores secundarios ya no compiten con el hero durante el primer render: `app.js` los precarga al aproximarse a la sección de Mojitos o mediante un fallback posterior a la carga.

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

La implementación 1.0 había acumulado un render heredado basado en `.mojito-sprite` y una imagen embebida en CSS. El uso de una capa de background para la bebida hacía demasiado fácil que un fondo, filtro, pseudo-elemento o glow aplicado al mismo lienzo revelase los límites rectangulares del bitmap.

### Solución permanente

La bebida activa se renderiza como un **`<img>` real y transparente**. El vaso y la iluminación son capas completamente independientes.

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

Todo glow, niebla, partículas o spotlight debe añadirse como **hermano situado detrás del `<img>`**.

## Interacción y accesibilidad

- Flechas laterales: sabor anterior / siguiente con loop continuo.
- `ArrowLeft` / `ArrowRight`: navegación por teclado cuando la sección está visible y el menú está cerrado.
- Iconos: selección directa con estado ARIA.
- Rail móvil: scroll táctil horizontal con padding inicial y final.
- Menú: abre desde el botón superior y cierra al seleccionar, con clic exterior, botón × o `Escape`.
- Al abrir el menú, el foco entra en el panel; `Tab` queda contenido en él hasta cerrar.
- El contenido de fondo se marca como `inert` durante la apertura cuando el navegador lo soporta.
- Los controles principales tienen estados `focus-visible` consistentes.
- `prefers-reduced-motion` elimina transiciones no esenciales sin eliminar funcionalidad.

### Regla crítica del menú

La visibilidad del menú se controla mediante `html.menu-open`. `style-07.css` fuerza el panel a ser visible e interactivo únicamente en ese estado. No eliminar estas reglas sin probar escritorio y Safari/iPhone.

`style-08.css` solo añade acabado accesible. No debe convertirse en una nueva capa de correcciones de layout.

## Responsive

La composición se ha preparado para móvil, tablet, portátil y escritorio grande. Reglas principales:

- no permitir overflow horizontal de la página;
- vaso absolutamente centrado dentro de un stage estable;
- copy de sabor con altura reservada para evitar saltos;
- rail de sabores como único elemento con scroll horizontal;
- carta en una sola columna en móvil;
- footer en tres columnas en escritorio y una columna en móvil;
- páginas legales, carta catalana y 404 con CSS aislado y layout móvil propio.

## Ubicación

**LAVENDISH**  
Av. de Balmes, 21  
25006 Lleida

La página comercial no muestra teléfono ni correo. Los datos de contacto se muestran únicamente en la información legal cuando corresponden a obligaciones de identificación y contacto.

## SEO y producción

Se mantienen:

- canonical;
- Open Graph con tipo, dimensiones y texto alternativo de imagen;
- Twitter Card con texto alternativo;
- JSON-LD `BarOrPub` con enlace a la carta mediante `hasMenu`;
- `robots.txt`;
- `sitemap.xml`;
- HTML semántico y textos alternativos;
- `.nojekyll` para GitHub Pages;
- `strict-origin-when-cross-origin` como política de referrer;
- `404.html` propia para rutas inexistentes.

La URL canónica temporal de producción es `https://reneg-ai.github.io/lavendish-bar-new/`.

Cuando exista dominio propio, deben actualizarse conjuntamente canonical, Open Graph, Twitter, JSON-LD, sitemap, robots y el `<base>` de `404.html`.

## Licencias y activos de marca

El archivo `LICENSE` se aplica al código en los términos indicados allí. `NOTICE.md` aclara expresamente que la publicación del repositorio no concede una licencia general sobre la marca LAVENDISH, logotipo, fotografías, ilustraciones o demás activos gráficos del negocio.

## Desarrollo local

No existe proceso de build. Se puede servir directamente:

```bash
python -m http.server 8080
```

## Checklist antes de publicar

1. Menú abre y cierra correctamente en escritorio y móvil.
2. Al abrir el menú, el foco entra en el panel y `Tab` no escapa al contenido de fondo.
3. `Escape`, × y clic exterior cierran el menú y recuperan el foco cuando corresponde.
4. Mojitos cambian sin desplazar el viewport.
5. Rail de sabores no corta el primer o último icono.
6. No aparece fondo rectangular detrás de ningún mojito.
7. Carta mantiene contraste y lectura cómoda.
8. Enlace `Català` abre la selección correctamente y vuelve a `#carta`.
9. Footer legal se adapta sin solapamientos.
10. Aviso legal, privacidad, cookies y 404 cargan sus estilos y rutas correctamente.
11. `prefers-reduced-motion` mantiene funcionalidad sin animaciones innecesarias.
12. No se ha añadido analítica o tracking sin revisar cookies y privacidad.
13. Todos los assets cargan mediante rutas compatibles con GitHub Pages.

## Principios de mantenimiento

1. `main` contiene siempre la versión publicable.
2. Los cambios con riesgo visual o legal se preparan primero en una rama.
3. Crear una rama `backup/stable-vX.Y.Z` antes de cada release relevante.
4. No inventar platos, precios, datos de negocio o información legal.
5. No volver a sprites para los iconos de sabores.
6. Mantener los mojitos transparentes y la iluminación en capas independientes.
7. No añadir imágenes grandes embebidas en base64 al CSS de producción.
8. Mantener JavaScript pequeño y sin librerías pesadas.
9. Probar visualmente escritorio, tablet y Safari/iPhone tras cambios de layout o assets.
10. Revisar privacidad/cookies antes de añadir formularios, reservas, analítica, publicidad o contenido de terceros.
11. Mantener actualizada la versión catalana de la información comercial cuando cambie la carta publicada.

---

© 2026 LAVENDISH · Lleida