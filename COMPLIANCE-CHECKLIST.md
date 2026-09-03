# LAVENDISH — compliance checklist

Fecha de revisión: 2026-09-03

Este documento acompaña a la web y sirve como checklist de mantenimiento. No sustituye una revisión jurídica individualizada del negocio ni las obligaciones operativas que deban cumplirse físicamente en el establecimiento.

## Web — cubierto en v1.2

- [x] Aviso legal accesible permanentemente desde el footer.
- [x] Identificación del titular, NIF/NIE, domicilio, email y canal adicional de contacto directo en el aviso legal.
- [x] Política de privacidad adaptada a los tratamientos reales conocidos de la web.
- [x] Política de cookies adaptada a una web sin analítica, publicidad o perfilado propios.
- [x] Sin banner de consentimiento mientras no se incorporen tecnologías no exentas.
- [x] GitHub Pages identificado como infraestructura de alojamiento y documentado su registro de IP con fines de seguridad.
- [x] Gmail identificado como proveedor del canal de correo de privacidad.
- [x] Enlaces externos abiertos con `noopener noreferrer` cuando corresponde.
- [x] Separación entre licencia del código y derechos sobre marca/activos mediante `NOTICE.md`.
- [x] Información de la selección de carta disponible también en catalán.
- [x] Aviso de alergias/intolerancias en la versión catalana de la carta web.
- [x] No hay compra, reserva, pago, newsletter, cuenta de usuario ni formulario en esta versión.

## Por qué hay una carta en catalán

La Agència Catalana del Consum indica que las cartas de comidas y bebidas de bares y restaurantes deben estar a disposición de la clientela al menos en catalán, y que la información comercial dirigida a consumidores en Cataluña debe cumplir los derechos lingüísticos aplicables.

La web principal permanece en castellano, pero la información comercial de la selección de carta tiene acceso directo a `carta-catala.html` desde la propia carta y desde el footer.

Referencias:

- https://consum.gencat.cat/ca/detalls/article/Bars-i-restaurants-00003
- https://consum.gencat.cat/ca/empreses/requisits-obligatoris/obligacions-generals-per-a-les-empreses/
- Ley 22/2010, Código de consumo de Cataluña: https://www.boe.es/buscar/act.php?id=BOE-A-2010-13115

## Cookies — regla de despliegue

Antes de añadir Google Analytics, Google Tag Manager, Meta Pixel, publicidad, remarketing, vídeos/mapas embebidos u otra tecnología que pueda almacenar o recuperar información del dispositivo:

1. identificar exactamente la tecnología, proveedor, finalidad y duración;
2. determinar si está exenta de consentimiento;
3. si no lo está, bloquearla antes del consentimiento;
4. ofrecer **Aceptar** y **Rechazar** al mismo nivel y con visibilidad equivalente;
5. ofrecer configuración granular cuando proceda;
6. actualizar `cookies.html` y `privacidad.html` antes de producción.

Referencias:

- AEPD, Guía de cookies: https://www.aepd.es/guias/guia-cookies.pdf
- LSSI, art. 22.2: https://www.boe.es/buscar/act.php?id=BOE-A-2002-13758

## Privacidad — regla de despliegue

Antes de añadir cualquier formulario, reservas, newsletter, base de datos de clientes o cuentas de usuario, documentar previamente:

- responsable;
- finalidad;
- base jurídica;
- campos estrictamente necesarios;
- destinatarios y encargados;
- transferencias internacionales, si las hay;
- plazo de conservación;
- ejercicio de derechos;
- información por capas en el punto de recogida;
- medidas de seguridad;
- contrato de encargado cuando corresponda.

Referencias:

- RGPD, artículo 13: https://eur-lex.europa.eu/eli/reg/2016/679/oj
- AEPD, derecho/deber de información: https://www.aepd.es/derechos-y-deberes/conoce-tus-derechos/derecho-de-informacion

## Restauración / establecimiento — comprobar fuera de la web

Estas obligaciones no se resuelven únicamente creando páginas web y deben verificarse en el local:

### Información de alérgenos

Los bares y restaurantes deben facilitar información sobre los alimentos que pueden provocar alergias o intolerancias. Si se informa oralmente, el establecimiento debe disponer de la información documentada y del aviso correspondiente.

- [ ] Comprobar ficha o matriz de alérgenos actualizada para todos los platos ofertados.
- [ ] Comprobar que el personal sabe dónde consultarla.
- [ ] Comprobar el cartel/aviso para personas con alergias o intolerancias.

Referencia: https://consum.gencat.cat/ca/empreses/requisits-obligatoris/obligacions-generals-per-a-les-empreses/

### Carta, idioma y precios del local

- [ ] Carta de comidas y bebidas disponible al menos en catalán.
- [ ] Los precios que se exhiban en el establecimiento deben ser totales, con impuestos incluidos.
- [ ] Cualquier suplemento o diferencia de precio por barra/mesa/terraza debe informarse claramente si existe.

Referencia: https://consum.gencat.cat/ca/detalls/article/Bars-i-restaurants-00003

### Hojas de reclamación

- [ ] Disponer de hojas oficiales de queja/reclamación/denuncia cuando resulte exigible.
- [ ] Exhibir el cartel informativo correspondiente.

Referencia: https://consum.gencat.cat/ca/empreses/requisits-obligatoris/descarrega-de-cartells-i-documents/

### Horario

- [ ] Comprobar que el horario de apertura está informado de forma visible desde el exterior, también cuando el establecimiento está cerrado, conforme a la normativa aplicable.

### Otros tratamientos de datos del negocio

Si existen, deben revisarse separadamente de esta web:

- [ ] personal/empleados;
- [ ] proveedores y facturación;
- [ ] cámaras de videovigilancia;
- [ ] Wi-Fi de clientes;
- [ ] bases de datos o listas de clientes;
- [ ] promociones o sorteos;
- [ ] reservas por teléfono, mensajería o plataformas de terceros.

## Accesibilidad

La versión actual no ofrece contratación electrónica ni comercio electrónico desde la propia web. Se han mantenido, no obstante, buenas prácticas de accesibilidad: HTML semántico, navegación por teclado, foco visible, `prefers-reduced-motion`, textos alternativos, contraste reforzado y responsive.

Si la web empieza a prestar servicios de comercio electrónico, debe hacerse una revisión específica de accesibilidad antes del despliegue. La Ley 11/2023 incluye los servicios de comercio electrónico dentro de su ámbito y contempla exenciones para microempresas prestadoras de servicios, pero la situación concreta debe verificarse en ese momento.

Referencia: https://www.boe.es/buscar/act.php?id=BOE-A-2023-11022

## Regla final

Ninguna nueva integración de marketing, analítica, reservas, pagos, mapas embebidos o formularios debe subirse directamente a `main`. Primero debe pasar por una rama de revisión técnica, privacidad, cookies, accesibilidad y responsive.
