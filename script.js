/* ============================================
   PORTFOLIO 2025 - JavaScript
   ============================================ */

// ===== CONFIGURATION =====
const CONFIG = {
    // Datos de contacto
    whatsappNumber: '5491130489378', // Pelados Labs WhatsApp
    calendlyUrl: 'https://calendly.com/juancruzmiguelchakal/presentacion-de-ideas',
    email: 'peladoslabs@gmail.com',

    // Precios base para calculadora (en ARS )
    prices: {
        landingPage: 50000,
        webMultipagina: 100000,
        desarrolloCompleto: 180000,
        tiendaOnline: 250000,
        sistemaMedida: 300000,
        landingCampana: 35000,
        integraciones: 25000,
        optimizacionVelocidad: 30000,
        seoBasico: 20000,
        altaGoogle: 15000,
        mantenimiento: 20000,
        seguridad: 15000,
        backups: 10000,
        actualizaciones: 12000,
        cambiosSimples: 8000
    }
};

// ===== DOM READY =====
document.addEventListener('DOMContentLoaded', function () {
    initNavbar();
    initMobileMenu();
    initAccordions();
    initCalculator();
    initAOS();
    initSmoothScroll();
    initScrollSpy();
    initThemeToggle();
    initExpandingCards();
    handleInitialScroll();
});

// ===== NAVBAR =====
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// ===== MOBILE MENU =====
function initMobileMenu() {
    const toggle = document.querySelector('.nav-toggle');
    const menu = document.querySelector('.nav-menu');

    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        menu.classList.toggle('active');
        document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking a link
    menu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            menu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

// ===== HANDLE INITIAL SCROLL =====
function handleInitialScroll() {
    if (window.location.hash) {
        const hash = window.location.hash;
        const targetId = hash.startsWith('#') ? hash : '#' + hash;
        
        // Wait for page to fully load and animations to stabilize
        setTimeout(() => {
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const navHeight = document.querySelector('.navbar')?.offsetHeight || 0;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight - 30;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // If it's a category bubble, trigger the interaction
                if (targetElement.classList.contains('category-bubble')) {
                    const mouseEnterEvent = new MouseEvent('mouseenter', {
                        bubbles: true,
                        cancelable: true,
                        view: window
                    });
                    targetElement.dispatchEvent(mouseEnterEvent);
                }
            } else if (targetId === '#services' || targetId === '#desarrollo' || targetId === '#diseno' || targetId === '#mensuales' || targetId === '#adicionales') {
                // If the element doesn't exist yet (maybe it's injected by JS), scroll to #services
                const servicesSection = document.getElementById('services');
                if (servicesSection) {
                    const navHeight = document.querySelector('.navbar')?.offsetHeight || 0;
                    const targetPosition = servicesSection.offsetTop - navHeight - 20;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });

                    // Try to find the bubble again after a short delay
                    setTimeout(() => {
                        const bubble = document.querySelector(targetId);
                        if (bubble && bubble.classList.contains('category-bubble')) {
                            bubble.dispatchEvent(new MouseEvent('mouseenter'));
                        }
                    }, 300);
                }
            }
        }, 800);
    }
}

// ===== ACCORDIONS (FAQ) =====
function initAccordions() {
    const accordionItems = document.querySelectorAll('.accordion-item');

    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');

        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all other accordions
            accordionItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });

            // Toggle current accordion
            item.classList.toggle('active', !isActive);
        });
    });
}

// ===== CALCULATOR =====
function initCalculator() {
    const calculatorBox = document.querySelector('.calculator-box');
    if (!calculatorBox) return;
 
    // --- ELEMENTS ---
    const categoryBtns = calculatorBox.querySelectorAll('.category-btn');
    const serviceOptions = calculatorBox.querySelectorAll('.calc-option');
    const priceValueEl = document.getElementById('priceValue');
    const priceDetailEl = document.getElementById('priceDetail');
    const complexitySelect = document.getElementById('complexity'); // Puede ser null
    const complexityDescription = document.getElementById('complexityDescription'); // Puede ser null
    const extraSectionsInput = document.getElementById('extraSections'); // Puede ser null
    const sectionsRow = document.getElementById('sectionsRow'); // Puede ser null
    const hostingRow = document.getElementById('hostingRow'); // Puede ser null
    const complexityRow = document.getElementById('complexityRow');
    const extrasRow = document.getElementById('extrasRow');
    const hostingPlanSelect = document.getElementById('hostingPlan');
    const domainPlanSelect = document.getElementById('domainPlan');
    const contractDurationSelect = document.getElementById('contractDuration'); 
    const extraCheckboxes = document.querySelectorAll('.checkbox-item input'); // Puede ser null

    const complexityInfo = {
        "basico": "Diseño estándar, plantilla base. (Precio Mínimo)",
        "intermedio": "Diseño personalizado, funcionalidades a medida. (Precio Intermedio)",
        "avanzado": "Solución Premium, diseño único, avanzado. (Precio Máximo)"
    };

    // --- STATE (moved to be accessible) ---
    window.calculatorState = {
        selectedService: { name: '', minPrice: 0, maxPrice: 0, type: '', category: 'web' }
    };
    // --- FUNCTIONS ---
    function selectCategory(cat, btn) {
        const isAlreadySelected = btn.classList.contains('selected');

        // Ocultar todos los grupos y deseleccionar todos los botones primero
        document.querySelectorAll('.service-category-group').forEach(el => el.style.display = 'none');
        categoryBtns.forEach(b => b.classList.remove('selected'));

        if (isAlreadySelected) {
            // Si ya estaba seleccionado, lo cerramos y reseteamos
            window.calculatorState.selectedService.category = '';
            window.calculatorState.selectedService = { name: '', minPrice: 0, maxPrice: 0, type: '', category: '' };
            serviceOptions.forEach(el => el.classList.remove('selected'));
            updateTotal();
        } else {
            // Si no estaba seleccionado, lo abrimos

            // Visual update
            btn.classList.add('selected');

            // Show/Hide Service Groups
            document.getElementById(`cat-${cat}`).style.display = 'block';

            // Show/Hide Hosting Logic
            if (hostingRow) {
                hostingRow.style.display = (cat === 'web') ? 'block' : 'none';
                if (cat !== 'web') {
                    if (hostingPlanSelect) hostingPlanSelect.value = 0;
                    if (domainPlanSelect) domainPlanSelect.value = 0;
                }
            }
            window.calculatorState.selectedService = { name: '', minPrice: 0, maxPrice: 0, type: '', category: cat };
            serviceOptions.forEach(el => el.classList.remove('selected'));
            updateTotal();
        }
    }

    function selectService(element, id, minPrice, maxPrice, type) {
        const isAlreadySelected = element.classList.contains('selected');

        // Deseleccionar todo primero
        serviceOptions.forEach(el => el.classList.remove('selected'));

        if (isAlreadySelected) {
            // Si ya estaba seleccionado, lo deseleccionamos y reseteamos
            window.calculatorState.selectedService = { name: '', minPrice: 0, maxPrice: 0, type: '', category: window.calculatorState.selectedService.category };
            if (sectionsRow) sectionsRow.style.display = 'none';
            if (extraSectionsInput) extraSectionsInput.value = 0;
            // Restore visibility of optional rows
            if (complexityRow) complexityRow.style.display = 'block';
            if (hostingRow && window.calculatorState.selectedService.category === 'web') hostingRow.style.display = 'block';
            if (extrasRow) extrasRow.style.display = 'block';
        } else {
            // Si no estaba seleccionado, lo seleccionamos
            element.classList.add('selected');
            window.calculatorState.selectedService = {
                name: element.querySelector('.calc-option-title').innerText,
                minPrice: minPrice,
                maxPrice: maxPrice,
                type: type,
                category: window.calculatorState.selectedService.category
            };

            const isCustomQuote = minPrice < 0;

            // Show/hide optional rows based on whether it's a custom quote
            if (complexityRow) complexityRow.style.display = isCustomQuote ? 'none' : 'block';
            if (hostingRow) {
                const isWebCategory = window.calculatorState.selectedService.category === 'web';
                hostingRow.style.display = (isWebCategory && !isCustomQuote) ? 'block' : 'none';
            }
            if (extrasRow) extrasRow.style.display = isCustomQuote ? 'none' : 'block';
            
            if (sectionsRow) {
                sectionsRow.style.display = (type === 'web_multi' && !isCustomQuote) ? 'block' : 'none';
                if (type !== 'web_multi' && extraSectionsInput) extraSectionsInput.value = 0;
            }
        }

        updateTotal();
    }

    function updateTotal() {
        if (!window.calculatorState.selectedService.name) {
            priceValueEl.innerText = '$0';
            priceDetailEl.innerText = 'Seleccioná un servicio';
            return;
        }

        // Handle "A cotizar" services
        if (window.calculatorState.selectedService.minPrice < 0) {
            priceValueEl.innerText = 'A cotizar';
            priceDetailEl.innerText = 'La cotización se define en una reunión con el cliente.';
            return;
        }

        let total = 0;
        let basePrice = window.calculatorState.selectedService.minPrice;

        if (complexitySelect) {
            const complexityLevel = complexitySelect.value;
            switch (complexityLevel) {
                case 'intermedio':
                    basePrice = (window.calculatorState.selectedService.minPrice + window.calculatorState.selectedService.maxPrice) / 2;
                    break;
                case 'avanzado':
                    basePrice = window.calculatorState.selectedService.maxPrice;
                    break;
                case 'basico':
                default:
                    basePrice = window.calculatorState.selectedService.minPrice;
            }
            if (complexityDescription) complexityDescription.innerText = complexityInfo[complexitySelect.value];
        }
        total += basePrice;

        if (extraSectionsInput && sectionsRow && sectionsRow.style.display !== 'none') {
            const extraSec = parseInt(extraSectionsInput.value) || 0;
            total += (extraSec * 100000);
        }

        if (hostingRow && hostingRow.style.display !== 'none') {
            let hostingTotal = 0;
            let domainTotal = 0;

            const duration = parseInt(contractDurationSelect.value) || 1;
            const hostingMonthly = parseInt(hostingPlanSelect.value) || 0;
            const domainAnnual = parseInt(domainPlanSelect.value) || 0;

            let discount = 0;
            if (duration === 2) discount = 0.05;
            if (duration === 3) discount = 0.10;
            if (duration === 4) discount = 0.15;

            hostingTotal = (hostingMonthly * 12 * duration);
            domainTotal = (domainAnnual * duration);

            hostingTotal = hostingTotal * (1 - discount);
            domainTotal = domainTotal * (1 - discount);

            total += (hostingTotal + domainTotal);
        }

        extraCheckboxes.forEach(cb => {
            if (cb.checked) {
                total += parseInt(cb.value);
            }
        });

        priceValueEl.innerText = formatPrice(total);
        priceDetailEl.innerText = `${window.calculatorState.selectedService.name} + Extras/Complejidad`;
    }

    // --- INITIALIZATION ---
    categoryBtns.forEach(btn => {
        const onclickAttr = btn.getAttribute('onclick');
        if (!onclickAttr) return;
        const catMatch = onclickAttr.match(/'([^']+)'/);
        if (catMatch) {
            const cat = catMatch[1];
            btn.addEventListener('click', () => selectCategory(cat, btn));
        }
        btn.removeAttribute('onclick');
    });

    serviceOptions.forEach(option => {
        const onclickAttr = option.getAttribute('onclick');
        if (!onclickAttr) return;
        // Regex to capture selectService() arguments, including negative numbers for prices
        const paramsMatch = onclickAttr.match(/selectService\(this, '([^']*)', (-?\d+), (-?\d+), '([^']*)'\)/);
        if (!paramsMatch) return; // Skip if it doesn't match the new format
        const [, id, minPriceStr, maxPriceStr, type] = paramsMatch;
        const minPrice = parseInt(minPriceStr);
        const maxPrice = parseInt(maxPriceStr);
        option.addEventListener('click', () => selectService(option, id, minPrice, maxPrice, type));
        // Guardamos los datos del onclick para usarlos después, ya que el atributo se va a borrar
        option.setAttribute('onclick_data', onclickAttr);
        option.removeAttribute('onclick');
    });

    document.querySelectorAll('.checkbox-item').forEach(item => {
        const onclickAttr = item.getAttribute('onclick');
        if (onclickAttr) {
            item.addEventListener('click', () => toggleCheckbox(item));
            item.removeAttribute('onclick');
        }
    });

    // Re-bind global functions that might have been removed
    const quoteButton = document.querySelector('.btn-whatsapp.btn-lg');
    if (quoteButton) {
        quoteButton.setAttribute('onclick', 'sendCalculatedQuote()');
    }
    const calendlyButtons = document.querySelectorAll('[onclick*="openCalendly"]');
    calendlyButtons.forEach(btn => {
        if (!btn.getAttribute('onclick')) {
            btn.setAttribute('onclick', 'openCalendly()');
        }
    });

    if (complexitySelect) complexitySelect.addEventListener('change', updateTotal);
    if (extraSectionsInput) extraSectionsInput.addEventListener('input', updateTotal);
    if (hostingPlanSelect) hostingPlanSelect.addEventListener('change', updateTotal);
    if (domainPlanSelect) domainPlanSelect.addEventListener('change', updateTotal);
    if (contractDurationSelect) contractDurationSelect.addEventListener('change', updateTotal);

    function toggleCheckbox(element) {
        element.classList.toggle('selected');
        const checkbox = element.querySelector('input');
        checkbox.checked = !checkbox.checked;
        updateTotal();
    }

    // Initial state: reset everything on load for a clean start.
    selectCategory('web', document.querySelector('.category-btn'));
}

window.sendCalculatedQuote = function() {
    const selectedOption = document.querySelector('.calc-option.selected');
    if (!selectedOption || !window.calculatorState || !window.calculatorState.selectedService.name) return alert('Por favor, seleccioná un servicio primero.');

    const serviceName = selectedOption.querySelector('.calc-option-title').innerText;
    const serviceType = window.calculatorState.selectedService.type;
    const isCustomQuote = window.calculatorState.selectedService.minPrice < 0;

    if (isCustomQuote) {
        let message = `Hola! Quiero cotizar un servicio personalizado:%0A`;
        message += `🔹 Servicio: *${serviceName}*%0A`;
        message += `Me gustaría agendar una reunión para discutir los detalles.`;
        openWhatsApp(message);
        return;
    }

    const finalPrice = document.getElementById('priceValue').innerText;
    let message = `Hola! Quiero confirmar un presupuesto estimado desde la web:%0A`;
    message += `🔹 Servicio: *${serviceName}*%0A`;

    // Complexity
    const complexityRow = document.getElementById('complexityRow');
    if (complexityRow && complexityRow.style.display !== 'none') {
        const complexitySelect = document.getElementById('complexity');
        const complexityText = complexitySelect.options[complexitySelect.selectedIndex].text;
        message += `🔹 Complejidad: ${complexityText}%0A`;
    }

    // Extra Sections
    const extraSections = document.getElementById('extraSections').value;
    if (serviceType === 'web_multi' && extraSections > 0) {
        message += `🔹 Secciones Extra: ${extraSections}%0A`;
    }

    // Hosting & Domain
    const selectedCategoryBtn = document.querySelector('.category-btn.selected');
    const currentCategory = window.calculatorState.selectedService.category;
    const hostingRow = document.getElementById('hostingRow');
    if (currentCategory === 'web' && hostingRow && hostingRow.style.display !== 'none') {
        const duration = document.getElementById('contractDuration').options[document.getElementById('contractDuration').selectedIndex].text;
        const hosting = document.getElementById('hostingPlan').options[document.getElementById('hostingPlan').selectedIndex].text;
        const domain = document.getElementById('domainPlan').options[document.getElementById('domainPlan').selectedIndex].text;

        if (document.getElementById('hostingPlan').value != 0) message += `🔹 Hosting: ${hosting}%0A`;
        if (document.getElementById('domainPlan').value != 0) message += `🔹 Dominio: ${domain}%0A`;
        if (document.getElementById('hostingPlan').value != 0 || document.getElementById('domainPlan').value != 0) {
             message += `🔹 Contrato: ${duration}%0A`;
        }
    }

    // Extras
    const extrasRow = document.getElementById('extrasRow');
    if (extrasRow && extrasRow.style.display !== 'none') {
        const extras = Array.from(document.querySelectorAll('.checkbox-item input:checked'))
            .map(cb => cb.getAttribute('data-name')).join(', ');
        if (extras) message += `🔹 Extras: ${extras}%0A`;
    }
    message += `💰 *Presupuesto Estimado: ${finalPrice}*`;

    openWhatsApp(message);
}


function formatPrice(amount) {
    if (isNaN(amount)) { // Safety check
        return '$0';
    }
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

// ===== AOS (Animate On Scroll) =====
function initAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 100,
            easing: 'ease-out-cubic'
        });
    }
}

// ===== SMOOTH SCROLL =====
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const navHeight = document.querySelector('.navbar')?.offsetHeight || 0;
                const targetPosition = targetElement.offsetTop - navHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== SCROLL SPY =====
function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    if (sections.length === 0 || navLinks.length === 0) return;

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${entry.target.id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '-100px 0px -50% 0px'
    });

    sections.forEach(section => observer.observe(section));
}

// ===== WHATSAPP HELPERS =====
function openWhatsApp(message = '') {
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${CONFIG.whatsappNumber}?text=${encodedMessage}`, '_blank');
}

// ===== CALENDLY =====
function openCalendly() {
    if (typeof Calendly !== 'undefined') {
        Calendly.initPopupWidget({ url: CONFIG.calendlyUrl });
    } else {
        window.open(CONFIG.calendlyUrl, '_blank');
    }
    return false;
}

// ===== FORM SUBMISSION HELPER =====
function handleFormSubmit(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    // Add timestamp
    data._timestamp = new Date().toISOString();

    return data;
}

// ===== UTILITY FUNCTIONS =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ===== SCROLL PROGRESS BAR =====
function initScrollProgress() {
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = scrollTop / docHeight;
        document.body.style.setProperty('--scroll', scrollPercent);

        // Update the progress bar
        const progressBar = document.body;
        if (progressBar) {
            progressBar.style.setProperty('--scroll-progress', scrollPercent);
        }
    });

    // Add CSS for scroll progress
    const style = document.createElement('style');
    style.textContent = `
        body::before {
            transform: scaleX(var(--scroll-progress, 0));
        }
    `;
    document.head.appendChild(style);
}

// ===== 3D TILT EFFECT FOR CARDS =====
function initTiltEffect() {
    const tiltElements = document.querySelectorAll('.card:not(.no-tilt), .accordion-item');

    tiltElements.forEach(element => {
        element.addEventListener('mousemove', (e) => {
            if (window.innerWidth < 1024) return; // Desactivar en móvil

            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 25; // Aumentamos el divisor para un efecto más sutil
            const rotateY = (centerX - x) / 25;

            element.style.transition = 'transform 0.1s ease-out';
            element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });

        element.addEventListener('mouseleave', () => {
            element.style.transition = 'transform 0.5s ease-in-out';
            element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });
}

// ===== MAGNETIC BUTTON EFFECT =====
function initMagneticButtons() {
    const buttons = document.querySelectorAll('.btn-primary, .btn-whatsapp');

    buttons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });
}

// ===== PARALLAX EFFECT FOR HERO =====
function initParallax() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const heroContent = hero.querySelector('.hero-content');
        if (heroContent && scrolled < window.innerHeight) {
            heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
            heroContent.style.opacity = 1 - (scrolled / (window.innerHeight * 0.8));
        }
    });
}

// ===== RADIAL MAP COMPONENT =====
const SERVICES_DATA = [
    {
        id: 'desarrollo',
        icon: 'fa-solid fa-code',
        title: 'Desarrollo Digital',
        color: '#00897B', // Teal
        services: [
            { name: 'Landing Page', price: '$150k - $250k', desc: 'Página única para conversión.' },
            { name: 'Sitio Multipágina', price: '$400k - $650k', desc: 'Web completa (4 secciones).' },
            { name: 'E-commerce', price: '$350k+', desc: 'Tienda online completa.' },
            { name: 'Portafolio', price: '$150k - $300k', desc: 'Muestra tu trabajo.' },
            { name: 'Blog', price: '$200k - $450k', desc: 'Plataforma de contenido.' },
            { name: 'Rediseño Landing', price: '$110k - $198k', desc: 'Renovación visual.' },
            { name: 'Rediseño Web', price: '$165k - $330k', desc: 'Actualización completa.' },
            { name: 'Rediseño Tienda', price: '$220k - $660k', desc: 'Mejora de tienda.' },
            { name: 'Sistemas', price: 'A cotizar', desc: 'Software a medida.' },
            { name: 'Apps Móviles', price: 'A cotizar', desc: 'iOS y Android.' }
        ]
    },
    {
        id: 'diseno',
        icon: 'fa-solid fa-palette',
        title: 'Diseño',
        color: '#0288D1', // Light Blue (Agency Theme)
        services: [
            { name: 'Logo (Desde cero)', price: '$66k - $110k', desc: 'Identidad única.' },
            { name: 'Logo (Rediseño)', price: '$44k - $77k', desc: 'Actualización de marca.' },
            { name: 'Flyer Digital', price: '$11k - $27.5k', desc: 'Para redes/eventos.' },
            { name: 'Banner', price: '$13.2k - $33k', desc: 'Publicidad digital.' },
            { name: 'Tarjetas', price: '$11k - $22k', desc: 'Presentación profesional.' },
            { name: 'Edición Video', price: '$22k - $66k', desc: 'Para redes/YouTube.' },
            { name: 'Edición Fotos', price: '$8.8k - $27.5k', desc: 'Retoque profesional.' },
            { name: 'Posts Redes', price: '$5.5k - $13.2k', desc: 'Diseño para feed.' }
        ]
    },
    {
        id: 'mensuales',
        icon: 'fa-solid fa-calendar-check',
        title: 'Mensuales',
        color: '#00897B', // Teal (Standard Agency)

        services: [
            { name: 'Mantenimiento', price: '$15k - $100k/mes', desc: 'Seguridad y updates.' },
            { name: 'Gestión Redes', price: '$90k - $400k/mes', desc: 'Community management.' },
            { name: 'Hosting', price: '$20k - $35k/mes', desc: 'Alojamiento web.' },
            { name: 'Dominio', price: '$40k - $60k/anual', desc: 'Registro .com/.com.ar' }
        ]
    },
    {
        id: 'adicionales',
        icon: 'fa-solid fa-plus-circle',
        title: 'Adicionales',
        color: '#F59E0B', // Amber
        services: [
            { name: 'SEO Básico', price: '$30k - $70k', desc: 'Posicionamiento Google.' },
            { name: 'Velocidad', price: '$30k - $80k', desc: 'Optimización de carga.' },
            { name: 'Copywriting', price: '$30k - $60k', desc: 'Textos persuasivos.' },
            { name: 'Publicidades', price: 'A discutir', desc: 'Contacto funcional.' },
            { name: 'Integraciones', price: '$25k - $50k', desc: 'WhatsApp, APIs, etc.' }
        ]
    }
];

// ===== CURSOR GLOW EFFECT =====
function initCursorGlow() {
    const glow = document.createElement('div');
    glow.className = 'cursor-glow';
    document.body.appendChild(glow);

    const style = document.createElement('style');
    style.textContent = `
        .cursor-glow {
            position: fixed;
            width: 200px;
            height: 200px;
            background: radial-gradient(circle, rgba(0, 137, 123, 0.12) 0%, transparent 60%);
            border-radius: 50%;
            pointer-events: none;
            transform: translate(-50%, -50%);
            z-index: 0;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        body:hover .cursor-glow {
            opacity: 1;
        }
    `;
    document.head.appendChild(style);

    document.addEventListener('mousemove', (e) => {
        glow.style.left = e.clientX + 'px';
        glow.style.top = e.clientY + 'px';
    });
}

// ===== TEXT TYPING EFFECT =====
function initTypingEffect() {
    const elements = document.querySelectorAll('.typing-effect');

    elements.forEach(el => {
        const text = el.textContent;
        el.textContent = '';
        el.style.opacity = '1';

        let i = 0;
        const typing = setInterval(() => {
            if (i < text.length) {
                el.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(typing);
            }
        }, 50);
    });
}

// ===== COUNTER ANIMATION =====
function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number');

    const animateCounter = (counter) => {
        const target = parseInt(counter.getAttribute('data-target') || counter.textContent);
        const duration = 2000;
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current) + (counter.textContent.includes('+') ? '+' : '');
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target + (counter.getAttribute('data-suffix') || '');
            }
        };

        updateCounter();
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

// ===== STAGGERED REVEAL ON SCROLL =====
function initStaggeredReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, index * 100);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.card, .grid > *').forEach(el => {
        el.classList.add('stagger-reveal');
        observer.observe(el);
    });

    // Add reveal styles
    const style = document.createElement('style');
    style.textContent = `
        .stagger-reveal {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .stagger-reveal.revealed {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);
}

// ===== RADIAL MAP COMPONENT =====
function initRadialMap() {
    const container = document.getElementById('radial-map');
    const mobileList = document.getElementById('mobile-services-list');
    if (!container || !mobileList) return;

    // --- DESKTOP RADIAL MAP ---
    let centerX = container.offsetWidth / 2;
    let centerY = container.offsetHeight / 2;
    let categoryRadius = Math.min(centerX, centerY) * 0.6; // Dynamic radius

    // Function to render/layout bubbles
    const layoutBubbles = () => {
        // Update dimensions
        centerX = container.offsetWidth / 2;
        centerY = container.offsetHeight / 2;
        categoryRadius = Math.min(centerX, centerY) * 0.6;

        // Clean up desktop bubbles only
        container.querySelectorAll('.category-bubble, .service-bubble').forEach(el => el.remove());

        // Render Categories
        SERVICES_DATA.forEach((cat, index) => {
            const totalCats = SERVICES_DATA.length;
            const angle = (index / totalCats) * 2 * Math.PI - Math.PI / 2; // Start top
            const x = centerX + Math.cos(angle) * categoryRadius;
            const y = centerY + Math.sin(angle) * categoryRadius;

            const catBubble = document.createElement('div');
            catBubble.className = 'category-bubble';
            catBubble.id = cat.id; // Assign ID for navigation
            catBubble.style.left = `${x}px`;
            catBubble.style.top = `${y}px`;
            catBubble.style.transform = 'translate(-50%, -50%)';

            catBubble.innerHTML = `
                <i class="${cat.icon}"></i>
                <span>${cat.title}</span>
            `;

            container.appendChild(catBubble);

            // Render Sub-services (Initially Hidden)
            // They start at the category center
            const subBubbles = [];
            cat.services.forEach((service) => {
                const serviceBubble = document.createElement('div');
                serviceBubble.className = 'service-bubble';
                serviceBubble.innerHTML = `
                    <div>${service.name}</div>
                    <div class="service-tooltip">
                        <strong>${service.price}</strong><br>
                        ${service.desc}
                    </div>
                `;
                // Start position at category center
                serviceBubble.style.left = `${x}px`;
                serviceBubble.style.top = `${y}px`;
                serviceBubble.style.transform = 'translate(-50%, -50%)';

                container.appendChild(serviceBubble);
                subBubbles.push(serviceBubble);
            });

            // Interaction
            catBubble.addEventListener('mouseenter', () => {
                // Active state
                document.querySelectorAll('.category-bubble').forEach(b => b.classList.remove('active'));
                catBubble.classList.add('active');

                // Update Center
                const centerContent = container.querySelector('.center-content');
                if (centerContent) {
                    centerContent.innerHTML = `
                        <i class="${cat.icon}" style="background: ${cat.color}; -webkit-background-clip: text; -webkit-text-fill-color: transparent;"></i>
                        <h2 style="color:var(--text-primary)">${cat.title}</h2>
                        <p style="color:var(--text-secondary)">${cat.services.length} servicios disponibles</p>
                    `;
                }

                // Show Sub-services
                document.querySelectorAll('.service-bubble').forEach(b => b.classList.remove('visible'));

                // Calculate fan-out positions
                const catAngle = Math.atan2(y - centerY, x - centerX);
                const spread = Math.PI * 1.2; // Increased spread to ~216 degrees
                const startAngle = catAngle - spread / 2;

                subBubbles.forEach((bubble, i) => {
                    const step = subBubbles.length > 1 ? spread / (subBubbles.length - 1) : 0;
                    const subAngle = startAngle + (step * i);

                    // Dynamic radius based on item count to prevent crowding
                    const baseRadius = 180;
                    const orbitRadius = subBubbles.length > 6 ? baseRadius + 30 : baseRadius;

                    const subX = x + Math.cos(subAngle) * orbitRadius;
                    const subY = y + Math.sin(subAngle) * orbitRadius;

                    bubble.style.left = `${subX}px`;
                    bubble.style.top = `${subY}px`;

                    setTimeout(() => bubble.classList.add('visible'), i * 30);
                });
            });
        });
    };

    // Attach MouseLeave Listener ONCE
    container.addEventListener('mouseleave', () => {
        document.querySelectorAll('.category-bubble').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.service-bubble').forEach(b => b.classList.remove('visible'));
        const centerContent = container.querySelector('.center-content');
        if (centerContent) {
            centerContent.innerHTML = `
                 <i class="fa-solid fa-wand-magic-sparkles"></i>
                 <h2>Servicios</h2>
                 <p>Explorá todo lo que ofrecemos</p>
             `;
        }
    });

    // --- MOBILE LIST VIEW (Render once) ---
    mobileList.innerHTML = '';
    SERVICES_DATA.forEach(cat => {
        const catSection = document.createElement('div');
        catSection.className = 'mobile-category';

        let servicesHtml = '';
        cat.services.forEach(s => {
            servicesHtml += `
                <div class="mobile-service-item">
                    <div class="mobile-service-info">
                        <h4>${s.name}</h4>
                        <p>${s.desc}</p>
                    </div>
                    <div class="mobile-service-price">${s.price}</div>
                </div>
            `;
        });

        catSection.innerHTML = `
            <h3><i class="${cat.icon}"></i> ${cat.title}</h3>
            <div class="mobile-services-grid">
                ${servicesHtml}
            </div>
        `;
        mobileList.appendChild(catSection);
    });

    // Initialize Layout
    layoutBubbles();

    // Resize Handler
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth > 768) {
                layoutBubbles();
            }
        }, 200);
    });
}

// Initialize all animation effects
document.addEventListener('DOMContentLoaded', function () {
    // Wait a bit for other scripts to load
    setTimeout(() => {
        initScrollProgress();
        initTiltEffect();
        initMagneticButtons();
        initParallax();
        initCursorGlow();
        initCounterAnimation();
        initRadialMap(); // Include Radial Map init
        // initStaggeredReveal(); // Disabled to avoid conflict with AOS
    }, 100);
});

// ===== EXPORT FOR GLOBAL ACCESS =====
window.PortfolioApp = {
    openWhatsApp,
    sendCalculatedQuote,
    openCalendly,
    CONFIG,
    initRadialMap
};

// ===== NEW FEATURES LOGIC =====

// --- CONTRACTS TABS ---
window.switchContract = function (type) {
    // Hide all
    document.querySelectorAll('.contract-template').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.timeline-btn').forEach(btn => btn.classList.remove('active'));

    // Show selected
    const selectedTemplate = document.getElementById(`contract-${type}`);
    if (selectedTemplate) selectedTemplate.classList.add('active');

    // Highlight button (this simple logic assumes buttons call this function)
    const btns = document.querySelectorAll('.timeline-btn');
    // Find the button that called this... slightly hacky without event, but we can loop to find matching onclick or just generic index logic.
    // Better: update generic logic.
    // For now, let's just re-query by attribute if needed, OR just trust the user click updates UI via loop below if we passed 'this'.
    // Since we didn't pass 'this', let's manually find the button with the matching onclick value text
    btns.forEach(btn => {
        if (btn.getAttribute('onclick').includes(`'${type}'`)) {
            btn.classList.add('active');
        }
    });
}

window.copyContract = function (elementId) {
    const content = document.getElementById(elementId).innerText;
    navigator.clipboard.writeText(content).then(() => {
        alert('Contrato copiado al portapapeles');
    }).catch(err => {
        console.error('Error al copiar: ', err);
    });
}

// ===== THEME TOGGLE (DARK/LIGHT) =====
function initThemeToggle() {
    const toggleBtn = document.getElementById('theme-toggle');
    if (!toggleBtn) return;

    const icon = toggleBtn.querySelector('i');
    const body = document.body;

    const moonIcon = 'fa-moon';
    const sunIcon = 'fa-sun';

    function enableDarkMode() {
        body.classList.add('dark-mode');
        icon.classList.remove(moonIcon);
        icon.classList.add(sunIcon);
        localStorage.setItem('theme', 'dark');
    }

    function disableDarkMode() {
        body.classList.remove('dark-mode');
        icon.classList.remove(sunIcon);
        icon.classList.add(moonIcon);
        localStorage.setItem('theme', 'light');
    }

    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        enableDarkMode();
    }

    toggleBtn.addEventListener('click', () => {
        body.classList.contains('dark-mode') ? disableDarkMode() : enableDarkMode();
    });
}

class TypeWriter {
    constructor(txtElement, words, wait = 3000) {
        this.txtElement = txtElement;
        this.words = words;
        this.txt = '';
        this.wordIndex = 0;
        this.wait = parseInt(wait, 10);
        this.type();
        this.isDeleting = false;
    }

    type() {
        // Índice actual de la palabra
        const current = this.wordIndex % this.words.length;
        // Obtener el texto completo de la palabra actual
        const fullTxt = this.words[current];

        // Comprobar si está borrando
        if (this.isDeleting) {
            // Borrar caracter
            this.txt = fullTxt.substring(0, this.txt.length - 1);
        } else {
            // Agregar caracter
            this.txt = fullTxt.substring(0, this.txt.length + 1);
        }

        // Insertar txt en el elemento
        this.txtElement.innerHTML = `<span class="txt-value">${this.txt}</span>`;

        // Velocidad de escritura inicial
        let typeSpeed = 100; // Equivalente a typingSpeed = 50-100 en React

        if (this.isDeleting) {
            typeSpeed /= 2; // Borrar es más rápido
        }

        // Si la palabra está completa
        if (!this.isDeleting && this.txt === fullTxt) {
            // Pausa al final (pauseDuration)
            typeSpeed = this.wait;
            this.isDeleting = true;
        } else if (this.isDeleting && this.txt === '') {
            this.isDeleting = false;
            // Mover a la siguiente palabra
            this.wordIndex++;
            // Pausa pequeña antes de empezar a escribir la nueva
            typeSpeed = 500;
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

// Inicialización cuando el DOM carga
document.addEventListener('DOMContentLoaded', initTypeWriter);

function initTypeWriter() {
    const txtElement = document.querySelector('.txt-type');
    if (!txtElement) return;

    const words = JSON.parse(txtElement.getAttribute('data-words'));
    const wait = txtElement.getAttribute('data-wait');

    // Iniciar TypeWriter
    new TypeWriter(txtElement, words, wait);
}

function initExpandingCards() {
    const containers = document.querySelectorAll('.expanding-container');

    containers.forEach(container => {
        const cards = container.querySelectorAll('.expanding-card');

        // Evento para resetear cuando el mouse sale de toda la sección
        container.addEventListener('mouseleave', () => {
            cards.forEach(c => c.classList.remove('active'));
        });

        cards.forEach(card => {
            // Mouse entra en una tarjeta
            card.addEventListener('mouseenter', () => {
                // Quitamos active de todas
                cards.forEach(c => c.classList.remove('active'));
                // Ponemos active en la actual (opcional, ya que CSS hace el trabajo visual, 
                // pero útil si quieres mantener lógica JS)
                card.classList.add('active');
            });
            
            // Soporte para touch en móviles (donde no hay hover)
            card.addEventListener('click', () => {
                cards.forEach(c => c.classList.remove('active'));
                card.classList.add('active');
            });
        });
    });
}