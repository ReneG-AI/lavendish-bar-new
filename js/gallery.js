// Datos de la galería
const galleryData = [
    {
        id: 1,
        src: '../images/gallery/ambiente-1.jpg',
        alt: 'Ambiente del bar por la noche',
        category: 'ambiente'
    },
    {
        id: 2,
        src: '../images/gallery/bebidas-1.jpg',
        alt: 'Cóctel Mojito',
        category: 'bebidas'
    },
    {
        id: 3,
        src: '../images/gallery/eventos-1.jpg',
        alt: 'Noche de Jazz en Lavendish',
        category: 'eventos'
    },
    {
        id: 4,
        src: '../images/gallery/comida-1.jpg',
        alt: 'Tapas variadas',
        category: 'comida'
    },
    {
        id: 5,
        src: '../images/gallery/ambiente-2.jpg',
        alt: 'Terraza exterior',
        category: 'ambiente'
    },
    {
        id: 6,
        src: '../images/gallery/bebidas-2.jpg',
        alt: 'Cóctel especial Lavendish',
        category: 'bebidas'
    },
    {
        id: 7,
        src: '../images/gallery/eventos-2.jpg',
        alt: 'Fiesta temática 80s',
        category: 'eventos'
    },
    {
        id: 8,
        src: '../images/gallery/comida-2.jpg',
        alt: 'Bocadillos gourmet',
        category: 'comida'
    }
];

// Variables globales
let currentFilter = 'all';
let currentImageIndex = 0;

// Elementos del DOM
const galleryGrid = document.querySelector('.gallery-grid');
const filterButtons = document.querySelectorAll('.filter-button');
const modal = document.getElementById('galleryModal');
const modalImage = document.getElementById('modalImage');
const modalCaption = document.getElementById('modalCaption');
const closeModal = document.querySelector('.close-modal');
const prevButton = document.querySelector('.modal-prev');
const nextButton = document.querySelector('.modal-next');

// Funciones
function createGalleryItem(item) {
    const div = document.createElement('div');
    div.className = 'gallery-item';
    div.setAttribute('data-category', item.category);
    
    const img = document.createElement('img');
    img.src = item.src;
    img.alt = item.alt;
    img.loading = 'lazy';
    
    div.appendChild(img);
    return div;
}

function filterGallery(category) {
    const items = document.querySelectorAll('.gallery-item');
    items.forEach(item => {
        if (category === 'all' || item.getAttribute('data-category') === category) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

function openModal(imageIndex) {
    currentImageIndex = imageIndex;
    const item = galleryData[imageIndex];
    modalImage.src = item.src;
    modalCaption.textContent = item.alt;
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModalHandler() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function navigateGallery(direction) {
    currentImageIndex = (currentImageIndex + direction + galleryData.length) % galleryData.length;
    const item = galleryData[currentImageIndex];
    modalImage.src = item.src;
    modalCaption.textContent = item.alt;
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Cargar imágenes en la galería
    galleryData.forEach(item => {
        const galleryItem = createGalleryItem(item);
        galleryItem.addEventListener('click', () => openModal(item.id - 1));
        galleryGrid.appendChild(galleryItem);
    });

    // Filtros
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentFilter = button.getAttribute('data-filter');
            filterGallery(currentFilter);
        });
    });

    // Modal
    closeModal.addEventListener('click', closeModalHandler);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModalHandler();
    });

    // Navegación del modal
    prevButton.addEventListener('click', () => navigateGallery(-1));
    nextButton.addEventListener('click', () => navigateGallery(1));

    // Navegación con teclado
    document.addEventListener('keydown', (e) => {
        if (modal.style.display === 'block') {
            if (e.key === 'ArrowLeft') navigateGallery(-1);
            if (e.key === 'ArrowRight') navigateGallery(1);
            if (e.key === 'Escape') closeModalHandler();
        }
    });
}); 