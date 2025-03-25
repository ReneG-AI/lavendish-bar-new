// Header scroll effect
const header = document.querySelector('.header');
const backToTop = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
        backToTop.classList.add('visible');
    } else {
        header.classList.remove('scrolled');
        backToTop.classList.remove('visible');
    }
});

// DOM Elements
const navbar = document.querySelector('.navbar');
const burger = document.querySelector('.burger');
const navLinks = document.querySelector('.nav-links');
const links = document.querySelectorAll('.nav-links a');

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu toggle
burger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    burger.setAttribute('aria-expanded', 
        burger.getAttribute('aria-expanded') === 'true' ? 'false' : 'true'
    );
});

// Close mobile menu when clicking a link
links.forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        burger.setAttribute('aria-expanded', 'false');
    });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Intersection Observer for fade-in animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements for fade-in animation
document.querySelectorAll('.feature-card, .about-content').forEach(el => {
    observer.observe(el);
});

// Newsletter form submission
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('newsletter-email').value;
        const privacy = document.getElementById('newsletter-privacy').checked;

        if (!privacy) {
            alert('Please agree to the privacy policy');
            return;
        }

        // Here you would typically send the email to your server
        console.log('Newsletter subscription:', email);
        alert('Thank you for subscribing to our newsletter!');
        newsletterForm.reset();
    });
}

// Testimonials slider
const testimonials = document.querySelector('.testimonials-slider');
if (testimonials) {
    let currentSlide = 0;
    const slides = testimonials.querySelectorAll('.testimonial-item');
    const totalSlides = slides.length;

    function showSlide(index) {
        slides.forEach(slide => slide.style.display = 'none');
        slides[index].style.display = 'block';
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        showSlide(currentSlide);
    }

    // Show first slide
    showSlide(0);

    // Auto-advance slides every 5 seconds
    setInterval(nextSlide, 5000);
}

// Form validation for contact form
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Basic form validation
        const name = contactForm.querySelector('[name="name"]').value;
        const email = contactForm.querySelector('[name="email"]').value;
        const message = contactForm.querySelector('[name="message"]').value;
        
        if (!name || !email || !message) {
            showNotification('Please fill in all fields', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        // Here you would typically send the form data to a server
        showNotification('Message sent successfully!', 'success');
        contactForm.reset();
    });
}

// Email validation helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Trigger reflow
    notification.offsetHeight;
    
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Galería de imágenes
const galleryImages = document.querySelectorAll('.gallery-image');
if (galleryImages.length > 0) {
    galleryImages.forEach(image => {
        image.addEventListener('click', () => {
            // Crear modal
            const modal = document.createElement('div');
            modal.classList.add('modal');
            
            // Crear imagen en el modal
            const modalImg = document.createElement('img');
            modalImg.src = image.src;
            modalImg.alt = image.alt;
            
            // Agregar imagen al modal
            modal.appendChild(modalImg);
            
            // Agregar modal al body
            document.body.appendChild(modal);
            
            // Cerrar modal al hacer clic
            modal.addEventListener('click', () => {
                modal.remove();
            });
        });
    });
}

// Actualizar año en el footer
document.querySelector('.footer-bottom p').innerHTML = 
    `&copy; ${new Date().getFullYear()} Lavendish Bar. Todos los derechos reservados.`;

// Lazy loading for images
document.addEventListener('DOMContentLoaded', () => {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
});

// Google Maps initialization
function initMap() {
    const mapElement = document.getElementById('map');
    if (mapElement) {
        const location = { lat: 41.6167, lng: 0.6222 }; // Lleida coordinates
        const map = new google.maps.Map(mapElement, {
            zoom: 15,
            center: location,
            styles: [
                {
                    "featureType": "all",
                    "elementType": "geometry",
                    "stylers": [{"color": "#242f3e"}]
                },
                {
                    "featureType": "all",
                    "elementType": "labels.text.stroke",
                    "stylers": [{"lightness": -80}]
                },
                {
                    "featureType": "administrative",
                    "elementType": "labels.text.fill",
                    "stylers": [{"color": "#746855"}]
                },
                {
                    "featureType": "road",
                    "elementType": "geometry",
                    "stylers": [{"color": "#2b3544"}]
                },
                {
                    "featureType": "road",
                    "elementType": "labels.text.fill",
                    "stylers": [{"color": "#9ca5b3"}]
                },
                {
                    "featureType": "road.highway",
                    "elementType": "geometry",
                    "stylers": [{"color": "#746855"}]
                },
                {
                    "featureType": "road.highway",
                    "elementType": "labels.text.fill",
                    "stylers": [{"color": "#f3d19c"}]
                },
                {
                    "featureType": "water",
                    "elementType": "geometry",
                    "stylers": [{"color": "#17263c"}]
                },
                {
                    "featureType": "water",
                    "elementType": "labels.text.fill",
                    "stylers": [{"color": "#515c6d"}]
                },
                {
                    "featureType": "water",
                    "elementType": "labels.text.stroke",
                    "stylers": [{"color": "#17263c"}]
                }
            ]
        });

        const marker = new google.maps.Marker({
            position: location,
            map: map,
            title: 'Lavendish Bar'
        });
    }
}

// Add CSS for notifications
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 5px;
        color: white;
        transform: translateY(100px);
        opacity: 0;
        transition: all 0.3s ease;
        z-index: 1000;
    }
    
    .notification.show {
        transform: translateY(0);
        opacity: 1;
    }
    
    .notification.success {
        background-color: var(--success-color);
    }
    
    .notification.error {
        background-color: var(--error-color);
    }
    
    .notification.info {
        background-color: var(--accent-color);
    }
    
    .fade-in {
        animation: fadeIn 0.6s ease-out forwards;
    }
`;

document.head.appendChild(style);

// Funcionalidad del menú móvil
document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');

    if (burger) {
        burger.addEventListener('click', () => {
            // Toggle Nav
            nav.classList.toggle('nav-active');
            
            // Burger Animation
            burger.classList.toggle('toggle');
            
            // Animate Links
            navLinks.forEach((link, index) => {
                if (link.style.animation) {
                    link.style.animation = '';
                } else {
                    link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
                }
            });
        });
    }

    // Form Validation
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            let valid = true;
            const requiredFields = form.querySelectorAll('[required]');
            
            // Reset validation messages
            const errorMessages = form.querySelectorAll('.error-message');
            errorMessages.forEach(msg => msg.remove());
            
            // Validate required fields
            requiredFields.forEach(field => {
                field.classList.remove('error');
                
                if (!field.value.trim()) {
                    valid = false;
                    field.classList.add('error');
                    showErrorMessage(field, 'Este campo es obligatorio');
                } else if (field.type === 'email' && field.value.trim()) {
                    // Validate email format
                    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailPattern.test(field.value.trim())) {
                        valid = false;
                        field.classList.add('error');
                        showErrorMessage(field, 'Por favor, introduce un email válido');
                    }
                } else if (field.id === 'phone' && field.value.trim()) {
                    // Validate phone format
                    const phonePattern = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
                    if (!phonePattern.test(field.value.trim())) {
                        valid = false;
                        field.classList.add('error');
                        showErrorMessage(field, 'Por favor, introduce un teléfono válido');
                    }
                }
            });
            
            if (valid) {
                // Show success notification
                showNotification('¡Mensaje enviado correctamente! Nos pondremos en contacto contigo pronto.', 'success');
                form.reset();
            }
        });
    });
    
    function showErrorMessage(field, message) {
        const errorMsg = document.createElement('span');
        errorMsg.className = 'error-message';
        errorMsg.innerText = message;
        field.parentNode.appendChild(errorMsg);
    }
    
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerText = message;
        
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Hide and remove notification
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 5000);
    }

    // Navbar background change on scroll
    const navbar = document.querySelector('.navbar');
    
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.getAttribute('href') !== '#') {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 80;
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu if open
                    if (nav && nav.classList.contains('nav-active')) {
                        nav.classList.remove('nav-active');
                        burger.classList.remove('toggle');
                    }
                }
            }
        });
    });

    // Scroll to top button
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.className = 'scroll-top';
    scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollToTopBtn.setAttribute('aria-label', 'Volver arriba');
    document.body.appendChild(scrollToTopBtn);
    
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollToTopBtn.classList.add('show');
        } else {
            scrollToTopBtn.classList.remove('show');
        }
    });

    // Animation on scroll
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    
    function checkIfInView() {
        const windowHeight = window.innerHeight;
        const windowTopPosition = window.scrollY;
        const windowBottomPosition = windowTopPosition + windowHeight;
        
        animateElements.forEach(element => {
            const elementHeight = element.offsetHeight;
            const elementTopPosition = element.offsetTop;
            const elementBottomPosition = elementTopPosition + elementHeight;
            
            // Check if element is in viewport
            if (
                elementTopPosition < windowBottomPosition - 50 && 
                elementBottomPosition > windowTopPosition + 50
            ) {
                element.classList.add('visible');
            }
        });
    }
    
    // Initialize animations
    checkIfInView();
    window.addEventListener('scroll', checkIfInView);
    window.addEventListener('resize', checkIfInView);
});

// Add animation class to elements
document.addEventListener('DOMContentLoaded', () => {
    const elementsToAnimate = document.querySelectorAll('.features-card, .about-content h2, .about-content p, .cta h2, .cta p, .cta .btn');
    
    elementsToAnimate.forEach(element => {
        element.classList.add('animate-on-scroll');
    });
}); 