# Lavendish Bar - Sitio Web

Este es el sitio web oficial de Lavendish Bar, un bar juvenil ubicado en Lleida con ambiente moderno y desenfadado.

## Características

- Diseño moderno, juvenil y responsivo
- Interfaz en español con código en inglés 
- Galería de imágenes integrada en la página principal
- Menú completo con categorías (bebidas, cócteles, tapas)
- Formulario de contacto para eventos
- Integración con redes sociales
- Soporte para modo oscuro
- Optimizado para todo tipo de dispositivos

## Tecnologías Utilizadas

- HTML5
- CSS3 (con variables CSS, Flexbox y Grid)
- JavaScript (Vanilla)
- Font Awesome para iconos
- Google Fonts (Poppins y Playfair Display)

## Estructura del Proyecto

```
lavendish-bar-new/
├── css/
│   ├── style.css          # Estilos principales
│   ├── responsive.css     # Media queries para responsividad
│   └── pages.css          # Estilos específicos de páginas
├── js/
│   ├── main.js            # JavaScript principal
│   └── gallery.js         # Funcionalidad de la galería
├── images/
│   ├── gallery/           # Imágenes para la galería (12 imágenes)
│   │   ├── ambiente-1.jpg
│   │   ├── ambiente-2.jpg
│   │   ├── ambiente-3.jpg
│   │   ├── ambiente-4.jpg
│   │   ├── bebidas-1.jpg
│   │   ├── bebidas-2.jpg
│   │   ├── bebidas-3.jpg
│   │   ├── bebidas-4.jpg
│   │   ├── tapas-1.jpg
│   │   ├── tapas-2.jpg
│   │   ├── tapas-3.jpg
│   │   └── tapas-4.jpg
│   ├── hero-bg.jpg        # Imagen de fondo para el hero
│   ├── cta-bg.jpg         # Imagen para sección CTA
│   ├── logo.png           # Logo del bar
│   └── favicon.ico        # Favicon
├── pages/
│   ├── menu.html          # Página de menú
│   └── contacto.html      # Página de contacto y eventos
└── index.html             # Página principal
```

## Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/tu-usuario/lavendish-bar-new.git
```

2. Navega al directorio del proyecto:
```bash
cd lavendish-bar-new
```

3. Abre el archivo `index.html` en tu navegador o utiliza un servidor local.

## Personalización

### Imágenes de la Galería

El sitio está configurado para mostrar 12 imágenes en la galería principal, organizadas en 3 categorías:
- **Ambiente**: 4 imágenes (ambiente-1.jpg, ambiente-2.jpg, ambiente-3.jpg, ambiente-4.jpg)
- **Bebidas**: 4 imágenes (bebidas-1.jpg, bebidas-2.jpg, bebidas-3.jpg, bebidas-4.jpg)
- **Tapas**: 4 imágenes (tapas-1.jpg, tapas-2.jpg, tapas-3.jpg, tapas-4.jpg)

Para reemplazar estas imágenes, simplemente coloca tus propias imágenes en la carpeta `images/gallery/` manteniendo los mismos nombres.

### Colores y Estilos

Los colores principales están definidos como variables CSS en el archivo `css/style.css`. Puedes modificarlos fácilmente cambiando los valores en la sección `:root`.

## Características de Accesibilidad

- Estructura HTML semántica
- Atributos ARIA para mejorar la accesibilidad
- Soporte para lectores de pantalla
- Navegación por teclado
- Contraste de colores adecuado
- Soporte para preferencias de reducción de movimiento

## Optimización

- Imágenes optimizadas y lazy loading
- CSS y JavaScript eficientes
- Soporte para dispositivos de alta densidad de píxeles
- Estilos de impresión optimizados

## Contacto

Para cualquier consulta o sugerencia, contacta con:
- Email: Info@lavendish.es
- Teléfono: +34 642 98 85 94
- Dirección: Avinguda de Balmes, 21, 25006 Lleida 