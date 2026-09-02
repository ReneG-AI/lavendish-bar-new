# LAVENDISH — Website v1.0

Sitio web oficial de **LAVENDISH**, bar en Lleida. Esta versión sustituye por completo el diseño antiguo del repositorio y corresponde a la nueva experiencia single-page diseñada para móvil y escritorio.

**Live:** https://reneg-ai.github.io/lavendish-bar-new/

## Estado

**Versión:** 1.0.0  
**Rama de publicación:** `main`  
**Hosting:** GitHub Pages  
**Arquitectura:** HTML + CSS estático, sin dependencias de JavaScript para la navegación o el selector de mojitos.

## Diseño y experiencia

- Identidad visual oscura, elegante y cinematográfica.
- Piña Colada como bebida protagonista en el hero.
- Carta corta y directa, pensada para compartir.
- Selector visual de **14 sabores de mojito**.
- Navegación compacta y CTA fijo a la carta.
- Diseño responsive con especial atención a Safari/iPhone.
- Animaciones y partículas ligeras con soporte para `prefers-reduced-motion`.
- Navegación accesible mediante HTML semántico y atributos ARIA.
- Sin trackers, analytics ni scripts de terceros.

## Contenido actual

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

### Mojitos

Original · menta y lima, Fresa, Frutos del bosque, Piña, Coco, Piña colada, Maracuyá, Mango, Frambuesa, Melocotón, Sandía, Cereza, Manzana verde y Uva.

## Estructura

```text
lavendish-bar-new/
├── index.html
├── robots.txt
├── sitemap.xml
├── .nojekyll
├── css/
│   ├── style-00.css
│   ├── style-01.css
│   ├── style-02.css
│   ├── style-03.css
│   ├── style-04.css
│   ├── style-05.css
│   └── assets-physical.css
└── assets/
    ├── favicon.png
    ├── lavendish-logo.webp
    ├── lavendish-storefront.webp
    ├── pina-colada.webp
    ├── icons/                 # 14 iconos de sabores
    └── mojitos/               # 14 mojitos WebP
```

## Assets de bebidas

Los mojitos se almacenan como archivos WebP físicos en `assets/mojitos/`. Deben conservar **fondo transparente**. No se debe volver a hornear un rectángulo oscuro detrás del vaso.

Los efectos de luz, glow o ambiente deben vivir en capas CSS independientes. El bitmap de la bebida no debe recibir fondo, `box-shadow`, `filter`, `backdrop-filter` ni `mix-blend-mode` que pueda revelar los límites de su lienzo.

Los iconos del selector se encuentran en `assets/icons/` y se enlazan desde `css/assets-physical.css`.

## Piña Colada

La imagen oficial del hero es:

```text
assets/pina-colada.webp
```

El HTML precarga este asset porque es el elemento visual principal de la primera pantalla.

## Ubicación

**LAVENDISH**  
Av. de Balmes, 21  
25006 Lleida

La web pública no muestra teléfono ni email. El único CTA de contacto publicado es **Cómo llegar**.

## SEO y publicación

La v1.0 incluye metadatos básicos, Open Graph, Twitter Card, `robots.txt`, `sitemap.xml` y datos estructurados de ubicación. La URL canónica actual corresponde a GitHub Pages.

Cuando se conecte un dominio propio, hay que actualizar en una sola pasada:

- `<link rel="canonical">`
- `og:url`
- URLs absolutas de `og:image` / `twitter:image`
- `url` e `image` del JSON-LD
- `robots.txt`
- `sitemap.xml`

## Foto del local

`assets/lavendish-storefront.webp` se mantiene de momento como imagen de la sección final. Está previsto sustituirla cuando se disponga de una fotografía definitiva del local; no es necesario modificar el layout para hacerlo.

## Desarrollo local

No hay proceso de build. Se puede servir directamente con cualquier servidor estático, por ejemplo:

```bash
python -m http.server 8080
```

Después abre `http://localhost:8080`.

## Principios de mantenimiento

1. `main` contiene siempre la versión publicable.
2. No crear carpetas `preview-vXX` dentro del sitio publicado.
3. Mantener una única URL de GitHub Pages.
4. No introducir datos de negocio no confirmados.
5. Optimizar nuevos assets antes de publicarlos.
6. Mantener los mojitos transparentes y los efectos visuales separados de la imagen.
7. Probar cambios visuales tanto en escritorio como en Safari/iPhone.

---

© 2026 LAVENDISH · Lleida
