# LAVENDISH — Official Website

Sitio web oficial de **LAVENDISH**, bar / cocktail bar en Lleida.

**Live:** https://reneg-ai.github.io/lavendish-bar-new/

## Estado

**Versión estable:** 1.4.0  
**Rama de producción:** `main`  
**Backup anterior a la integración 3D:** `backup/pre-3d-home-v1.3`  
**Backup estable v1.3:** `backup/stable-v1.3.0`  
**Hosting:** GitHub Pages  
**Arquitectura:** HTML + CSS + JavaScript vanilla, sin framework ni proceso de build.

La v1.4 mantiene intacta la base aprobada de navegación, Mojitos, Carta, footer y páginas legales, y añade una experiencia inmersiva de **Piña Colada construida por scroll** entre el hero y la sección de Mojitos.

## Dirección visual

La web sigue una estética editorial de hospitality premium:

- negro / carbón cinematográfico;
- marfil y dorado cálido;
- titulares serif de alto contraste;
- composición limpia con profundidad y luz atmosférica;
- Piña Colada como producto protagonista;
- showcase editorial de 14 mojitos;
- Carta clara y legible sobre superficie cálida;
- footer y páginas legales coherentes con la marca;
- motion contenido, con soporte explícito para `prefers-reduced-motion`.

## Experiencia Piña Colada v1.4

La home incorpora `js/pina-3d.js` y `css/pina-3d.css` como módulo aislado. No depende de Three.js, WebGL, CDN ni librerías externas.

La experiencia usa perspectiva CSS 3D y JavaScript sincronizado con scroll para construir visualmente la copa en cinco fases:

1. Cristal
2. Hielo
3. Mezcla
4. Espuma
5. Acabado

Durante el recorrido se animan profundidad, rotación, hielo, nivel de mezcla, espuma, pajita, piña y cereza. Al final se realiza una transición al asset real de Piña Colada para recuperar el acabado fotográfico de marca.

Características técnicas:

- sección `sticky` controlada por scroll;
- `requestAnimationFrame` para agrupar renders;
- `IntersectionObserver` para suspender trabajo fuera del área relevante;
- parallax de puntero solo en dispositivos con puntero fino;
- parallax desactivado con `Save-Data` o memoria de dispositivo muy limitada;
- fallback estático completo para `prefers-reduced-motion`;
- CSS y JS independientes del layout principal;
- CTA final hacia Mojitos;
- el indicador inferior “Ver carta” se oculta durante la experiencia y reaparece después.

El prototipo aislado permanece disponible en `preview-pina-3d.html` con `noindex,nofollow` para pruebas internas.

## Validación v1.4

La experiencia v0.2 se verificó mediante navegador automatizado en:

- 1440×900
- 1024×768
- 768×1024
- 430×932
- 390×844
- 320×700

Comprobaciones realizadas:

- cero overflow horizontal en todas las resoluciones probadas;
- progresión completa de las cinco fases;
- CTA final visible únicamente al terminar;
- fallback `prefers-reduced-motion` funcional;
- sin errores JavaScript en el fixture de navegador;
- build y deploy de GitHub Pages correctos.

Las notas de prueba están documentadas en `TESTING-3D-v0.2.md` y las reglas de aislamiento en `EXPERIMENTS.md`.

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

No se publican precios ni existe contratación a distancia desde esta web.

La selección de Carta también está disponible en catalán mediante `carta-catala.html`.

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

## Estructura principal

```text
lavendish-bar-new/
├── index.html
├── 404.html
├── preview-pina-3d.html
├── carta-catala.html
├── aviso-legal.html
├── privacidad.html
├── cookies.html
├── robots.txt
├── sitemap.xml
├── VERSION
├── README.md
├── CHANGELOG.md
├── NOTICE.md
├── EXPERIMENTS.md
├── TESTING-3D-v0.2.md
├── COMPLIANCE-CHECKLIST.md
├── js/
│   ├── app.js                 # menú + mojitos + loader del módulo 3D
│   └── pina-3d.js             # experiencia Piña Colada por scroll
├── css/
│   ├── style-00.css … style-08.css
│   ├── pina-3d.css            # experiencia 3D aislada
│   ├── legal.css
│   ├── carta-ca.css
│   └── 404.css
└── assets/
    ├── lavendish-logo.webp
    ├── lavendish-storefront.webp
    ├── pina-colada.webp
    ├── icons/
    └── mojitos/
```

## Arquitectura de Mojitos

Cada sabor utiliza un WebP físico de `assets/mojitos/` y un icono físico independiente de `assets/icons/`.

La bebida activa se renderiza como un `<img>` real y transparente. El glow, niebla, partículas y focos son capas independientes colocadas detrás del bitmap.

### Regla permanente contra el fondo rectangular

No aplicar directamente al bitmap del mojito:

- `background-color`;
- gradientes;
- `box-shadow` usado como glow;
- `backdrop-filter`;
- `mix-blend-mode`;
- overlays o pseudo-elementos.

El render del vaso debe permanecer transparente y aislado de las capas de iluminación. Esta regla evita la reaparición del antiguo rectángulo / cuadrado detrás de los mojitos.

## Menú y accesibilidad

El menú superior derecho conserva la implementación estable de v1.3:

- apertura mediante botón con `aria-expanded`;
- cierre con ×, `Escape`, selección o clic fuera;
- focus trap mientras permanece abierto;
- devolución del foco al cerrar;
- contenido de fondo `inert` cuando el navegador lo soporta.

La visibilidad del menú depende de `html.menu-open`. No modificar esa regla sin volver a probar móvil y Safari/iPhone.

## Responsive

Principios de layout:

- no permitir overflow horizontal de la página;
- Mojitos siempre centrados dentro de un stage estable;
- rail de sabores como único scroll horizontal intencionado;
- Carta a una columna en móvil;
- footer apilado en móvil;
- módulo Piña Colada con menor recorrido, perspectiva y movimiento en pantallas pequeñas;
- páginas legales, carta catalana y 404 con CSS aislado.

## Privacidad y cookies

La web continúa siendo informativa y deliberadamente ligera:

- sin formularios;
- sin cuentas de usuario;
- sin reservas o pagos online;
- sin Google Analytics, GTM o Meta Pixel;
- sin publicidad comportamental;
- sin tracking mediante `localStorage` / `sessionStorage`;
- Google Maps se abre mediante enlace externo.

Por esta razón no se muestra banner de consentimiento mientras no se incorporen tecnologías no exentas. Si se añade analítica, embeds de terceros, publicidad, reservas u otras tecnologías, deben revisarse primero `privacidad.html` y `cookies.html`.

Páginas legales:

- `aviso-legal.html`
- `privacidad.html`
- `cookies.html`

## Producción y SEO

Se mantienen:

- canonical;
- Open Graph y Twitter Card;
- JSON-LD `BarOrPub` con `hasMenu`;
- `robots.txt` y `sitemap.xml`;
- `.nojekyll`;
- página 404 propia;
- política `strict-origin-when-cross-origin`.

La URL canónica temporal es `https://reneg-ai.github.io/lavendish-bar-new/`.

Cuando exista dominio propio, deben actualizarse conjuntamente canonical, Open Graph, Twitter, JSON-LD, sitemap, robots y el `<base>` de `404.html`.

## Desarrollo local

No existe proceso de build:

```bash
python -m http.server 8080
```

## Checklist antes de futuras releases

1. Menú abre/cierra correctamente en escritorio y móvil.
2. `Tab`, `Escape` y devolución de foco funcionan en el menú.
3. La experiencia Piña Colada no genera overflow ni corta contenido.
4. `prefers-reduced-motion` muestra una experiencia estática completa.
5. Mojitos cambian sin desplazar el viewport.
6. El primer y último icono del rail permanecen accesibles.
7. No reaparece ningún fondo rectangular detrás de los mojitos.
8. Carta mantiene contraste y legibilidad.
9. Footer y páginas legales no se solapan.
10. Todas las rutas funcionan bajo GitHub Pages.
11. No se incorpora tracking sin revisar privacidad y cookies.
12. Build y deploy de GitHub Pages deben finalizar correctamente.

## Principios de mantenimiento

1. `main` contiene siempre una versión publicable.
2. Cambios visuales de riesgo se prueban primero en rama y/o preview aislada.
3. Crear backup antes de releases relevantes.
4. Mantener módulos experimentales en archivos separados del layout estable.
5. No inventar platos, precios o datos de negocio.
6. No volver a sprites para Mojitos.
7. Mantener assets de bebida transparentes y glow en capas separadas.
8. Evitar dependencias pesadas si no aportan una mejora perceptible.
9. Probar escritorio, tablet y móvil tras cambios de layout.
10. Mantener actualizada la información legal y la Carta en catalán.

## Licencias y marca

`LICENSE` regula el código según sus propios términos. `NOTICE.md` aclara que la marca LAVENDISH, logotipo, fotografías, ilustraciones y demás activos gráficos no quedan liberados automáticamente por la licencia del código.

---

© 2026 LAVENDISH · Lleida
