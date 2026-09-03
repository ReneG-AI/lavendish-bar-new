# LAVENDISH — auditoría de producción y legal v1.2

Fecha: 2026-09-03

## 1. Protección de la versión estable

La rama `audit/legal-v1.2` parte exactamente del commit estable de `main`:

`69a62fae25df88268df7c7bbbe7f38b6ad140e00`

`main` no se ha modificado durante esta auditoría. La PR #8 permanece separada hasta la aprobación final.

## 2. Alcance revisado

### UI / interacción

- El menú superior derecho conserva la implementación estable basada en `html.menu-open`.
- `js/app.js` no se modifica en v1.2.
- No se modifica la lógica del selector de mojitos.
- No se modifican los assets de mojitos ni sus iconos.
- La carta conserva la capa clara y el contraste introducidos en v1.1.1.
- El único cambio visual sobre la página comercial, aparte de metadatos, es el footer y su acceso legal.

### Responsive

- Se mantienen los breakpoints y protecciones de viewport existentes.
- No se introducen nuevos wrappers dentro de hero, mojitos o carta.
- El nuevo footer pasa de tres columnas en escritorio a una sola columna en móvil.
- Las páginas legales utilizan `css/legal.css`, aislado del CSS de la web comercial.

### Accesibilidad básica

Se mantienen o refuerzan:

- enlace de salto a la carta;
- controles con labels accesibles;
- estados ARIA del selector de sabores;
- navegación por teclado;
- cierre del menú mediante `Escape`;
- soporte `prefers-reduced-motion`;
- contraste alto en carta y páginas legales;
- estados de foco visibles en los enlaces legales;
- estructura semántica con `main`, `nav`, `section`, `article`, tablas y listas cuando corresponde.

No se declara una certificación formal WCAG porque no se ha realizado una auditoría externa de conformidad completa.

## 3. Revisión técnica de privacidad

Búsqueda y revisión del código actual:

- sin `document.cookie`;
- sin Google Analytics / `gtag`;
- sin Google Tag Manager;
- sin Meta Pixel;
- sin publicidad o remarketing;
- sin `localStorage` o `sessionStorage` destinados a seguimiento;
- sin formularios;
- sin newsletter;
- sin registro de usuarios;
- sin reservas o pagos online;
- Google Maps se abre como enlace externo y no como iframe embebido.

### GitHub Pages

La documentación de GitHub Pages indica que la dirección IP del visitante se registra y almacena con fines de seguridad al visitar un sitio alojado en Pages. Esta circunstancia se explica ahora en `privacidad.html` y `cookies.html`.

Referencia oficial:

- https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages
- https://docs.github.com/es/site-policy/privacy-policies/github-general-privacy-statement

## 4. Cookies y consentimiento

### Estado actual

No se han detectado tecnologías propias de analítica, publicidad o perfilado que requieran un consentimiento previo antes de cargarse.

Por tanto, la versión actual no incorpora un banner de cookies intrusivo. La política explica que este criterio debe revisarse antes de añadir cualquier tecnología no exenta.

### Regla de mantenimiento

Si se añaden analítica, publicidad, remarketing, mapas o vídeos embebidos que instalen cookies no exentas, o cualquier tecnología equivalente:

1. bloquear su carga previa;
2. informar de su finalidad;
3. ofrecer aceptar y rechazar en condiciones equivalentes;
4. permitir configuración cuando corresponda;
5. actualizar la tabla de cookies y terceros antes del despliegue.

Referencias oficiales de la AEPD:

- https://www.aepd.es/es/documento/guia-cookies.pdf
- https://www.aepd.es/prensa-y-comunicacion/notas-de-prensa/aepd-actualiza-guia-cookies-para-adaptarla-a-nuevas-directrices-cepd

## 5. Aviso legal

Se ha completado `aviso-legal.html` con:

- nombre comercial;
- titular;
- NIF/NIE;
- domicilio;
- correo electrónico de contacto;
- objeto del sitio;
- condiciones de acceso y uso;
- naturaleza informativa de la carta;
- propiedad intelectual e industrial;
- enlaces externos;
- disponibilidad y responsabilidad;
- privacidad y cookies;
- legislación aplicable y resolución de conflictos;
- fecha de actualización.

Los datos identificativos incorporados proceden de documentación facilitada por el negocio. No se publica el teléfono.

No se han inventado datos de Registro Mercantil ni autorizaciones administrativas. Solo deben añadirse si realmente resultan aplicables y se dispone de la información correcta.

Referencia principal:

- Ley 34/2002 (LSSI-CE), especialmente artículo 10: https://www.boe.es/buscar/act.php?id=BOE-A-2002-13758

## 6. Política de privacidad

`privacidad.html` incluye ahora los puntos esenciales exigibles para una información transparente y adaptada al funcionamiento real de esta web:

- identidad y contacto del responsable;
- alcance de la política;
- categorías de datos tratados;
- explicación del alojamiento en GitHub Pages;
- datos facilitados voluntariamente por correo;
- finalidades;
- bases jurídicas según el tratamiento;
- destinatarios y proveedores tecnológicos;
- posible tratamiento internacional por proveedores globales;
- criterios de conservación;
- derechos de los interesados;
- canal para ejercer derechos;
- derecho a reclamar ante la AEPD;
- ausencia de perfilado y decisiones automatizadas;
- menores;
- seguridad;
- obligación de revisar la política cuando cambie la web.

Referencias oficiales:

- RGPD, artículo 13: https://eur-lex.europa.eu/eli/reg/2016/679/oj
- LOPDGDD: https://www.boe.es/buscar/act.php?id=BOE-A-2018-16673
- AEPD, deber de informar: https://www.aepd.es/preguntas-frecuentes/2-tus-obligaciones-como-responsable-del-tratamiento/6-el-deber-de-informacion/FAQ-0247-como-debo-cumplir-con-el-deber-de-informar
- AEPD Facilita RGPD: https://www.aepd.es/guias-y-herramientas/herramientas/facilita-rgpd

### Importante fuera de la web

Estas páginas cubren la presencia web actual. No sustituyen las obligaciones internas del negocio respecto de otros tratamientos que puedan existir fuera de Internet, como empleados, proveedores, facturación, videovigilancia o bases de datos de clientes. Esos tratamientos, si existen, deben gestionarse por separado con sus bases jurídicas, información, contratos, registro de actividades y medidas de seguridad correspondientes.

## 7. Footer y diseño legal

El footer de producción se ha rediseñado sin modificar la navegación o el JavaScript principal:

- identidad LAVENDISH;
- dirección;
- CTA “Cómo llegar”;
- Aviso legal;
- Privacidad;
- Cookies;
- copyright.

En escritorio utiliza una composición editorial de tres áreas y en móvil se convierte en una columna limpia. Los enlaces legales quedan visibles pero deliberadamente secundarios frente al CTA principal.

Las tres páginas legales comparten:

- fondo carbón;
- marfil y dorado de la marca;
- serif editorial en titulares;
- supporting sans-serif;
- navegación interna por secciones;
- resúmenes rápidos;
- tablas y fichas de datos cuando mejoran la comprensión;
- cabecera sticky y botón de vuelta;
- footer legal consistente.

## 8. Seguridad y navegación externa

- Se ha añadido `strict-origin-when-cross-origin` como política de referrer.
- Los enlaces que abren una pestaña externa incluyen `rel="noopener noreferrer"` cuando se han tocado en esta versión.
- No se añaden librerías, scripts de terceros o dependencias nuevas.
- No se introducen formularios ni endpoints que amplíen la superficie de ataque.

GitHub Pages no permite configurar desde este repositorio todos los encabezados HTTP que permitiría un hosting administrado. No se fuerza una CSP mediante `<meta>` en esta release para evitar bloquear assets o introducir una regresión sin una fase específica de pruebas.

## 9. SEO / estructura

La página comercial mantiene:

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

Las páginas legales se mantienen con `noindex,follow`. No es necesario incluirlas en el sitemap para que sean válidas o accesibles: están enlazadas permanentemente desde el footer.

## 10. Licencias y marca

Se añade `NOTICE.md` para dejar claro que la licencia técnica del código no concede automáticamente derechos sobre:

- marca LAVENDISH;
- logotipo;
- fotografías;
- mojitos e ilustraciones;
- iconos de sabores;
- demás activos creativos de marca.

Esto resuelve la principal ambigüedad detectada en la licencia MIT del repositorio sin modificar la licencia histórica del código.

## 11. Archivos añadidos o modificados en v1.2

- `index.html`
- `aviso-legal.html`
- `privacidad.html`
- `cookies.html`
- `css/legal.css`
- `css/style-07.css`
- `README.md`
- `CHANGELOG.md`
- `VERSION`
- `NOTICE.md`
- `AUDIT-v1.2.md`

No se modifica:

- `js/app.js`;
- assets de mojitos;
- iconos de sabores;
- lógica del selector;
- estructura funcional del menú.

## 12. Criterio antes de fusionar a `main`

La rama es técnicamente candidata a release. Antes de fusionar deben hacerse estas comprobaciones finales:

1. abrir el sitio en escritorio y móvil;
2. comprobar que el menú sigue abriendo y cerrando exactamente como en la versión estable;
3. recorrer varios mojitos y confirmar que el viewport no se desplaza;
4. revisar que la carta se mantiene clara y legible;
5. llegar al footer y comprobar su jerarquía y responsive;
6. abrir Aviso legal, Privacidad y Cookies desde el footer;
7. comprobar sus botones de vuelta, enlaces internos y enlaces externos;
8. verificar que ningún asset da 404 en GitHub Pages;
9. confirmar que `style-07.css?v=1.2.0` evita caché antigua.

Si estas comprobaciones visuales son correctas, la rama puede fusionarse a `main` como **v1.2.0**.
