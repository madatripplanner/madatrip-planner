/**
 * MadaTrip Planner - Main JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // ==================== AOS INIT ====================
    AOS.init({
        duration: 800,
        once: true,
        offset: 100,
        easing: 'ease-out-quad'
    });
    
    // ==================== SWIPER INIT ====================
    const testimonialSwiper = new Swiper('.testimonial-swiper', {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        autoplay: { delay: 5000, disableOnInteraction: false },
        pagination: { el: '.swiper-pagination', clickable: true },
        breakpoints: { 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }
    });
    
    // ==================== NAVBAR SCROLL EFFECT ====================
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('backToTop');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Back to top button
        if (window.scrollY > 500) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
        
        // Scroll progress
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        const progressBar = document.getElementById('scrollProgress');
        if (progressBar) progressBar.style.width = scrolled + '%';
    });
    
    // ==================== BACK TO TOP ====================
    backToTop.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    // ==================== MOBILE MENU ====================
    const menuBtn = document.getElementById('menuBtn');
    const closeMenu = document.getElementById('closeMenu');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (menuBtn) {
        menuBtn.addEventListener('click', function() {
            mobileMenu.classList.remove('-translate-x-full');
            document.body.style.overflow = 'hidden';
        });
    }
    
    if (closeMenu) {
        closeMenu.addEventListener('click', function() {
            mobileMenu.classList.add('-translate-x-full');
            document.body.style.overflow = '';
        });
    }
    
    // Close mobile menu on link click
    const mobileLinks = mobileMenu ? mobileMenu.querySelectorAll('a') : [];
    mobileLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.add('-translate-x-full');
            document.body.style.overflow = '';
        });
    });
    
    // ==================== ACTIVE PAGE DETECTION ====================
    const currentPage = window.location.pathname.split('/').pop().replace('.html', '') || 'index';
    document.querySelectorAll(`.nav-link[data-page="${currentPage}"]`).forEach(link => {
        link.classList.add('text-primary');
    });
    
    // ==================== COUNTER ANIMATION ====================
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        let current = 0;
        const increment = target / 50;
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.round(current);
                setTimeout(updateCounter, 20);
            } else {
                counter.textContent = target;
            }
        };
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) { updateCounter(); observer.disconnect(); }
        });
        observer.observe(counter);
    });
    
    // ==================== GALLERY LIGHTBOX ====================
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const imgSrc = this.querySelector('img').src;
            const lightbox = document.createElement('div');
            lightbox.className = 'fixed inset-0 bg-black/95 z-[1000] flex items-center justify-center cursor-pointer transition-opacity duration-300 opacity-0';
            lightbox.innerHTML = `<img src="${imgSrc}" class="max-w-[90vw] max-h-[90vh] object-contain rounded-lg"><button class="absolute top-6 right-6 text-white text-3xl hover:text-primary transition">&times;</button>`;
            document.body.appendChild(lightbox);
            document.body.style.overflow = 'hidden';
            setTimeout(() => lightbox.style.opacity = '1', 10);
            lightbox.addEventListener('click', function(e) {
                if (e.target === lightbox || e.target.tagName === 'BUTTON') {
                    lightbox.style.opacity = '0';
                    setTimeout(() => { lightbox.remove(); document.body.style.overflow = ''; }, 300);
                }
            });
        });
    });
    
    // ==================== FORM VALIDATION ====================
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            let isValid = true;
            const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
            inputs.forEach(input => {
                if (!input.value.trim()) { isValid = false; input.style.borderColor = '#ef4444'; }
                else { input.style.borderColor = ''; }
            });
            if (isValid) {
                showNotification('Votre message a été envoyé avec succès !', 'success');
                form.reset();
            } else {
                showNotification('Veuillez remplir tous les champs requis.', 'error');
            }
        });
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('focus', function() { this.style.borderColor = ''; });
        });
    });
    
    // ==================== NOTIFICATION SYSTEM ====================
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `fixed top-24 right-6 z-50 px-6 py-4 rounded-xl shadow-lg transform transition-all duration-300 translate-x-full ${type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white font-medium`;
        notification.innerHTML = `<div class="flex items-center gap-3"><i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} text-xl"></i><span>${message}</span></div>`;
        document.body.appendChild(notification);
        setTimeout(() => notification.classList.remove('translate-x-full'), 100);
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    // ==================== GALLERY FILTERS ====================
    const filterBtns = document.querySelectorAll('.gallery-filter');
    const galleryGrid = document.querySelector('.gallery-grid');
    
    if (filterBtns.length && galleryGrid) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                filterBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                const filter = this.getAttribute('data-filter');
                const items = galleryGrid.querySelectorAll('.gallery-item');
                items.forEach(item => {
                    if (filter === 'all' || item.getAttribute('data-category') === filter) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }
});

// Ajoutez ces fonctions à la fin du fichier main.js existant

// ==================== GALLERY FILTERS ====================
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

if (filterBtns.length && galleryItems.length) {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            galleryItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// ==================== FAQ ACCORDION ====================
const faqItems = document.querySelectorAll('.faq-item');

if (faqItems.length) {
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            // Close other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            // Toggle current item
            item.classList.toggle('active');
        });
    });
}

// ==================== CIRCUIT FILTERS ====================
const circuitFilterBtns = document.querySelectorAll('.filter-btn[data-filter]');
const circuitCards = document.querySelectorAll('.circuit-card-full');

if (circuitFilterBtns.length && circuitCards.length) {
    circuitFilterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            circuitFilterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            circuitCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'grid';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 10);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// ==================== BOOKING FORM HANDLER ====================
const bookingForm = document.getElementById('bookingForm');
if (bookingForm) {
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(bookingForm);
        const data = Object.fromEntries(formData);
        
        // Validate required fields
        let isValid = true;
        const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'circuit', 'startDate', 'travelers'];
        
        requiredFields.forEach(field => {
            const input = document.getElementById(field);
            if (!data[field] || data[field] === '') {
                isValid = false;
                input.style.borderBottomColor = '#ef4444';
            } else {
                input.style.borderBottomColor = '#ddd';
            }
        });
        
        if (!isValid) {
            showNotification('Veuillez remplir tous les champs obligatoires.', 'error');
            return;
        }
        
        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            showNotification('Veuillez entrer une adresse email valide.', 'error');
            return;
        }
        
        // Show success message
        showNotification('Votre demande a été envoyée avec succès ! Nous vous contacterons sous 24h.', 'success');
        bookingForm.reset();
        
        // You can add AJAX call here to send data to server
        console.log('Form data:', data);
    });
}

// ==================== CONTACT FORM HANDLER ====================
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        let isValid = true;
        const requiredFields = ['name', 'email', 'subject', 'message'];
        
        requiredFields.forEach(field => {
            const input = document.getElementById(field);
            if (!data[field] || data[field] === '') {
                isValid = false;
                input.style.borderBottomColor = '#ef4444';
            } else {
                input.style.borderBottomColor = '#ddd';
            }
        });
        
        if (!isValid) {
            showNotification('Veuillez remplir tous les champs obligatoires.', 'error');
            return;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            showNotification('Veuillez entrer une adresse email valide.', 'error');
            return;
        }
        
        showNotification('Votre message a été envoyé ! Nous vous répondrons rapidement.', 'success');
        contactForm.reset();
        console.log('Contact data:', data);
    });
}

// ==================== DATE PICKER MIN DATE ====================
const dateInputs = document.querySelectorAll('input[type="date"]');
if (dateInputs.length) {
    const today = new Date().toISOString().split('T')[0];
    dateInputs.forEach(input => {
        input.min = today;
    });
}

// ==================== COUNTER ANIMATION IMPROVEMENT ====================
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counter = entry.target;
            const target = parseInt(counter.getAttribute('data-target'));
            let current = 0;
            const increment = target / 50;
            
            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    counter.textContent = Math.round(current);
                    setTimeout(updateCounter, 20);
                } else {
                    counter.textContent = target;
                }
            };
            
            updateCounter();
            observer.unobserve(counter);
        }
    });
}, observerOptions);

document.querySelectorAll('.counter').forEach(counter => {
    observer.observe(counter);
});

// ==================== SMOOTH SCROLL FOR ANCHOR LINKS ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href !== '') {
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
});

// ==================== PRELOADER (OPTIONAL) ====================
window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }, 500);
    }
});

// ==================== DYNAMIC YEAR IN FOOTER ====================
const yearElement = document.querySelector('.footer-bottom p');
if (yearElement) {
    const currentYear = new Date().getFullYear();
    yearElement.innerHTML = yearElement.innerHTML.replace('2025', currentYear);
}

// ==================== PARAM EXTRACTION FROM URL ====================
function getUrlParameter(name) {
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
    const results = regex.exec(window.location.href);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

// Pre-fill circuit in booking form if parameter exists
const circuitParam = getUrlParameter('circuit');
if (circuitParam && bookingForm) {
    const circuitSelect = document.getElementById('circuit');
    if (circuitSelect) {
        for (let i = 0; i < circuitSelect.options.length; i++) {
            if (circuitSelect.options[i].value === circuitParam) {
                circuitSelect.selectedIndex = i;
                break;
            }
        }
    }
}