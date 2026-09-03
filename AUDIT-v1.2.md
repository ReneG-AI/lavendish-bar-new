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
- Los cambios visuales sobre la página comercial se limitan al footer, enlaces legales, acceso a la carta catalana y metadatos.

### Responsive

- Se mantienen los breakpoints y protecciones de viewport existentes.
- No se introducen nuevos wrappers dentro de hero o mojitos.
- El nuevo footer pasa de tres columnas en escritorio a una sola columna en móvil.
- Las páginas legales utilizan `css/legal.css`, aislado del CSS de la web comercial.
- La carta catalana utiliza una capa adicional aislada (`css/carta-ca.css`).

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

### Correo electrónico

El canal de privacidad utiliza una dirección `@gmail.com`. La política identifica por ello Google/Gmail como proveedor tecnológico del correo, sin atribuirle a LAVENDISH tratamientos de seguimiento que no realiza.

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

- https://www.aepd.es/guias/guia-cookies.pdf
- https://www.aepd.es/preguntas-frecuentes/17-internet-y-redes-sociales/FAQ-1707-importancia-de-las-cookies-en-la-proteccion-de-datos

## 5. Aviso legal

Se ha completado `aviso-legal.html` con:

- nombre comercial;
- titular;
- NIF/NIE;
- domicilio;
- correo electrónico;
- teléfono de contacto como canal adicional de comunicación directa y efectiva;
- objeto del sitio;
- condiciones de acceso y uso;
- naturaleza informativa de la carta;
- propiedad intelectual e industrial;
- enlaces externos;
- disponibilidad y responsabilidad;
- privacidad y cookies;
- legislación aplicable y resolución de conflictos;
- fecha de actualización.

Los datos identificativos incorporados proceden de documentación facilitada por el negocio. El teléfono no aparece en la página comercial ni en el footer principal; queda limitado al Aviso Legal.

No se han inventado datos de Registro Mercantil ni autorizaciones administrativas. Solo deben añadirse si realmente resultan aplicables y se dispone de la información correcta.

Referencia principal:

- Ley 34/2002 (LSSI-CE), especialmente artículo 10: https://www.boe.es/buscar/act.php?id=BOE-A-2002-13758
- TJUE C-298/07, sobre contacto rápido, directo y efectivo: https://curia.europa.eu/

## 6. Política de privacidad

`privacidad.html` incluye los puntos esenciales exigibles para una información transparente y adaptada al funcionamiento real de esta web:

- identidad y contacto del responsable;
- alcance de la política;
- categorías de datos tratados;
- explicación del alojamiento en GitHub Pages;
- datos facilitados voluntariamente por correo;
- carácter voluntario del contacto y consecuencias de no facilitar datos mínimos de respuesta;
- finalidades;
- bases jurídicas según el tratamiento;
- destinatarios y proveedores tecnológicos;
- GitHub Pages y Google/Gmail identificados;
- posible tratamiento internacional por proveedores globales;
- criterios de conservación;
- derechos de los interesados;
- retirada del consentimiento cuando un tratamiento se base en él;
- canal para ejercer derechos;
- derecho a reclamar ante la AEPD;
- ausencia de perfilado y decisiones automatizadas;
- menores;
- seguridad;
- obligación de revisar la política cuando cambie la web.

Referencias oficiales:

- RGPD, artículo 13: https://eur-lex.europa.eu/eli/reg/2016/679/oj
- LOPDGDD: https://www.boe.es/buscar/act.php?id=BOE-A-2018-16673
- AEPD, derecho de información: https://www.aepd.es/derechos-y-deberes/conoce-tus-derechos/derecho-de-informacion

### Importante fuera de la web

Estas páginas cubren la presencia web actual. No sustituyen las obligaciones internas del negocio respecto de otros tratamientos que puedan existir fuera de Internet, como empleados, proveedores, facturación, videovigilancia o bases de datos de clientes. Esos tratamientos, si existen, deben gestionarse por separado con sus bases jurídicas, información, contratos, registro de actividades y medidas de seguridad correspondientes.

## 7. Derechos lingüísticos y carta en catalán

La revisión específica para un bar de Lleida detectó un punto importante del Código de consumo de Cataluña: las cartas de comidas y bebidas deben estar a disposición de la clientela al menos en catalán, y la información comercial dirigida a consumidores debe respetar los derechos lingüísticos aplicables.

Para reforzar este punto sin duplicar ni reescribir la web principal:

- se añade `carta-catala.html`;
- reproduce exactamente la selección de platos publicada en la web, sin inventar productos o precios;
- se enlaza desde la navegación de categorías de la Carta y desde el footer;
- ofrece vuelta directa a `index.html#carta`;
- incorpora un aviso claro para personas con alergias o intolerancias.

Referencias oficiales:

- Agència Catalana del Consum — Bars i restaurants: https://consum.gencat.cat/ca/detalls/article/Bars-i-restaurants-00003
- Obligacions generals per a les empreses: https://consum.gencat.cat/ca/empreses/requisits-obligatoris/obligacions-generals-per-a-les-empreses/
- Código de consumo de Cataluña: https://www.boe.es/buscar/act.php?id=BOE-A-2010-13115

## 8. Alérgenos y otras obligaciones del establecimiento

La web no realiza venta a distancia de alimentos, por lo que no se ha convertido la carta web en una ficha de venta online. Sin embargo, los bares y restaurantes deben disponer y facilitar información sobre los alérgenos de sus alimentos. Si la información se facilita oralmente, debe existir soporte documentado y el correspondiente aviso en el establecimiento.

Se crea `COMPLIANCE-CHECKLIST.md` para que estas obligaciones operativas no queden confundidas con el cumplimiento meramente web. Incluye, entre otros:

- alérgenos;
- carta física en catalán;
- precios totales con impuestos;
- hojas oficiales de reclamación;
- horario visible;
- tratamientos de datos fuera de la web.

Referencia: https://consum.gencat.cat/ca/empreses/requisits-obligatoris/obligacions-generals-per-a-les-empreses/

## 9. Footer y diseño legal

El footer de producción se ha rediseñado sin modificar la navegación o el JavaScript principal:

- identidad LAVENDISH;
- dirección;
- CTA “Cómo llegar”;
- Aviso legal;
- Privacidad;
- Cookies;
- Carta en català;
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

## 10. Seguridad y navegación externa

- Se ha añadido `strict-origin-when-cross-origin` como política de referrer.
- Los enlaces que abren una pestaña externa incluyen `rel="noopener noreferrer"` cuando se han tocado en esta versión.
- No se añaden librerías, scripts de terceros o dependencias nuevas.
- No se introducen formularios ni endpoints que amplíen la superficie de ataque.

GitHub Pages no permite configurar desde este repositorio todos los encabezados HTTP que permitiría un hosting administrado. No se fuerza una CSP mediante `<meta>` en esta release para evitar bloquear assets o introducir una regresión sin una fase específica de pruebas.

## 11. SEO / estructura

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

Las páginas legales y la carta catalana se mantienen con `noindex,follow`. No es necesario incluirlas en el sitemap para que sean accesibles: están enlazadas desde la interfaz.

## 12. Accesibilidad — alcance revisado

La Ley 11/2023 incluye los servicios de comercio electrónico entre los servicios sometidos a requisitos específicos de accesibilidad y contempla una exención para microempresas que presten servicios. La web actual de LAVENDISH no permite celebrar contratos, comprar, pagar o reservar online, por lo que no se presenta como un servicio de comercio electrónico.

No se añade una “declaración de accesibilidad” genérica que pudiera dar a entender una certificación no realizada. Se mantienen buenas prácticas de accesibilidad y se documenta que cualquier futura incorporación de e-commerce debe pasar por una revisión específica.

Referencia: https://www.boe.es/buscar/act.php?id=BOE-A-2023-11022

## 13. Licencias y marca

Se añade `NOTICE.md` para dejar claro que la licencia técnica del código no concede automáticamente derechos sobre:

- marca LAVENDISH;
- logotipo;
- fotografías;
- mojitos e ilustraciones;
- iconos de sabores;
- demás activos creativos de marca.

Esto resuelve la principal ambigüedad detectada en la licencia MIT del repositorio sin modificar la licencia histórica del código.

## 14. Archivos añadidos o modificados en v1.2

- `index.html`
- `carta-catala.html`
- `aviso-legal.html`
- `privacidad.html`
- `cookies.html`
- `css/carta-ca.css`
- `css/legal.css`
- `css/style-07.css`
- `README.md`
- `CHANGELOG.md`
- `VERSION`
- `NOTICE.md`
- `COMPLIANCE-CHECKLIST.md`
- `AUDIT-v1.2.md`

No se modifica:

- `js/app.js`;
- assets de mojitos;
- iconos de sabores;
- lógica del selector;
- estructura funcional del menú.

## 15. Criterio antes de fusionar a `main`

La rama es técnicamente candidata a release. Antes de fusionar deben hacerse estas comprobaciones finales:

1. abrir el sitio en escritorio y móvil;
2. comprobar que el menú sigue abriendo y cerrando exactamente como en la versión estable;
3. recorrer varios mojitos y confirmar que el viewport no se desplaza;
4. revisar que la carta se mantiene clara y legible;
5. comprobar el enlace `Català`, la carta catalana y su vuelta a `#carta`;
6. llegar al footer y comprobar su jerarquía y responsive;
7. abrir Aviso legal, Privacidad y Cookies desde el footer;
8. comprobar sus botones de vuelta, enlaces internos y enlaces externos;
9. verificar que ningún asset da 404 en GitHub Pages;
10. confirmar que `style-07.css?v=1.2.0` evita caché antigua.

Si estas comprobaciones visuales son correctas, la rama puede fusionarse a `main` como **v1.2.0**.
