/* ========================================
   JavaScript - Portfolio Website
   Interactive Features & Animations
   ======================================== */

'use strict';

// ========================================
// Document Ready
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// ========================================
// Initialize Application
// ========================================

function initializeApp() {
    console.log('Portfolio Website Initialized');
    
    try {
        // Initialize all features
        setupNavigation();
        setupSmoothScroll();
        setupFormValidation();
        setupScrollAnimations();
        setupProgressBars();
        setupCounters();
        setupLazyLoading();
        setupThemeToggle();
        setupAccessibility();
        setupScrollToTop();
        setupNewsletter();
    } catch (error) {
        console.error('Error initializing app:', error);
    }
}

// ========================================
// Navigation Setup
// ========================================

function setupNavigation() {
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const navToggler = document.querySelector('.navbar-toggler');

    // Close navbar when link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navToggler && navToggler.offsetParent !== null) {
                navToggler.click();
            }
        });
    });

    // Update active link on scroll
    window.addEventListener('scroll', () => {
        updateActiveNavLink();
    });

    // Highlight current page
    highlightCurrentPage();
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
}

function highlightCurrentPage() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// ========================================
// Smooth Scrolling
// ========================================

function setupSmoothScroll() {
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    
    smoothScrollLinks.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just '#'
            if (href === '#') {
                return;
            }
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ========================================
// Form Validation
// ========================================

function setupFormValidation() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) {
        return;
    }
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm(this)) {
            showFormSuccess();
            this.reset();
            setTimeout(() => {
                hideFormSuccess();
            }, 3000);
        }
    });

    // Real-time validation
    const inputs = contactForm.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });

        input.addEventListener('input', function() {
            if (this.classList && this.classList.contains('is-invalid')) {
                validateField(this);
            }
        });
    });
}

function validateForm(form) {
    let isValid = true;
    const fields = form.querySelectorAll('input[required], textarea[required], select[required]');

    fields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });

    return isValid;
}

function validateField(field) {
    let isValid = true;
    const value = field.value ? field.value.trim() : '';

    // Remove previous error state
    if (field.classList) {
        field.classList.remove('is-invalid');
    }

    // Validation rules
    if (field.type === 'email') {
        isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    } else if (field.type === 'tel') {
        isValid = value === '' || /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/.test(value);
    } else if (field.type === 'url') {
        isValid = value === '' || /^https?:\/\/.+/.test(value);
    } else if (field.hasAttribute('required')) {
        isValid = value.length > 0;
    }

    if (!isValid) {
        if (field.classList) {
            field.classList.add('is-invalid');
        }
        showFieldError(field);
    } else {
        removeFieldError(field);
    }

    return isValid;
}

function showFieldError(field) {
    // Check if error message already exists
    const existingError = field.parentNode ? field.parentNode.querySelector('.error-message') : null;
    if (existingError) {
        return;
    }

    const errorMsg = document.createElement('div');
    errorMsg.className = 'error-message text-danger small mt-1';
    
    let message = 'This field is required.';
    if (field.type === 'email') {
        message = 'Please enter a valid email address.';
    } else if (field.type === 'tel') {
        message = 'Please enter a valid phone number.';
    } else if (field.type === 'url') {
        message = 'Please enter a valid URL.';
    }

    errorMsg.textContent = message;
    if (field.parentNode) {
        field.parentNode.appendChild(errorMsg);
    }
}

function removeFieldError(field) {
    if (!field.parentNode) {
        return;
    }
    
    const errorMsg = field.parentNode.querySelector('.error-message');
    if (errorMsg) {
        errorMsg.remove();
    }
}

function showFormSuccess() {
    const form = document.getElementById('contactForm');
    if (!form) {
        return;
    }
    
    const successMsg = document.createElement('div');
    successMsg.className = 'alert alert-success alert-dismissible fade show';
    successMsg.setAttribute('role', 'alert');
    successMsg.innerHTML = `
        <strong>Success!</strong> Your message has been sent successfully. I'll get back to you soon!
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    form.insertAdjacentElement('beforebegin', successMsg);
}

function hideFormSuccess() {
    const alerts = document.querySelectorAll('.alert-success');
    alerts.forEach(alert => {
        alert.style.display = 'none';
    });
}

// ========================================
// Scroll Animations
// ========================================

function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all animated elements
    const selectors = '.content-block, .service-card, .skill-card, .blog-card, .experience-card, .education-card, .process-step, .pricing-card, .contact-info-card';
    const animatedElements = document.querySelectorAll(selectors);

    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Add animation class styling via JavaScript
(function() {
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            animation: slideUp 0.6s ease-out !important;
        }
        
        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    if (document.head) {
        document.head.appendChild(style);
    }
})();

// ========================================
// Progress Bars Animation
// ========================================

function setupProgressBars() {
    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateProgressBar(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const progressBars = document.querySelectorAll('.progress-bar');
    progressBars.forEach(bar => {
        observer.observe(bar);
    });
}

function animateProgressBar(bar) {
    const width = bar.style.width;
    bar.style.width = '0%';
    
    setTimeout(() => {
        bar.style.transition = 'width 1s ease-in-out';
        bar.style.width = width;
    }, 100);
}

// ========================================
// Counter Animation
// ========================================

function setupCounters() {
    const counters = document.querySelectorAll('[data-target]');
    
    if (counters.length === 0) {
        return;
    }

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => {
        observer.observe(counter);
    });
}

function animateCounter(counter) {
    const targetStr = counter.getAttribute('data-target');
    const target = parseInt(targetStr, 10);
    
    if (isNaN(target)) {
        return;
    }
    
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            counter.textContent = target;
            clearInterval(timer);
        } else {
            counter.textContent = Math.floor(current);
        }
    }, 16);
}

// ========================================
// Lazy Loading Images
// ========================================

function setupLazyLoading() {
    if ('IntersectionObserver' in window) {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const dataSrc = img.getAttribute('data-src');
                    if (dataSrc) {
                        img.src = dataSrc;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }
}

// ========================================
// Theme Toggle (Dark/Light Mode)
// ========================================

function setupThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    const savedTheme = localStorage.getItem('theme') || 'light';

    // Set initial theme
    if (html) {
        html.setAttribute('data-theme', savedTheme);
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            if (html) {
                html.setAttribute('data-theme', newTheme);
            }
            localStorage.setItem('theme', newTheme);
            
            updateThemeIcon(newTheme);
        });
    }
}

function updateThemeIcon(theme) {
    const icon = document.querySelector('#themeToggle i');
    if (icon) {
        icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }
}

// ========================================
// Accessibility Features
// ========================================

function setupAccessibility() {
    // Add keyboard navigation to buttons
    const buttons = document.querySelectorAll('button, a.btn');
    buttons.forEach(button => {
        button.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                button.click();
            }
        });
    });

    // Improved focus management
    const focusableElements = document.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    focusableElements.forEach(element => {
        element.addEventListener('focus', () => {
            element.style.outline = '2px solid #007bff';
            element.style.outlineOffset = '2px';
        });

        element.addEventListener('blur', () => {
            element.style.outline = 'none';
        });
    });

    // Announce dynamic content changes for screen readers
    setupAriaLive();
}

function setupAriaLive() {
    const ariaLiveRegion = document.createElement('div');
    ariaLiveRegion.setAttribute('aria-live', 'polite');
    ariaLiveRegion.setAttribute('aria-atomic', 'true');
    ariaLiveRegion.className = 'sr-only';
    ariaLiveRegion.id = 'aria-live-region';
    ariaLiveRegion.style.display = 'none';
    
    if (document.body) {
        document.body.appendChild(ariaLiveRegion);
    }
}

function announceToScreenReader(message) {
    const region = document.getElementById('aria-live-region');
    if (region) {
        region.textContent = message;
    }
}

// ========================================
// Utility Functions
// ========================================

// Debounce function
function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

// Throttle function
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ========================================
// Enhanced Navigation with Scroll Effect
// ========================================

(function() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) {
        return;
    }

    let lastScrollTop = 0;

    window.addEventListener('scroll', throttle(() => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            navbar.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.15)';
        } else {
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
        
        lastScrollTop = scrollTop;
    }, 100));
})();

// ========================================
// Scroll to Top Button
// ========================================

function setupScrollToTop() {
    let scrollTopBtn = document.getElementById('scrollToTopBtn');
    
    if (!scrollTopBtn) {
        const btn = document.createElement('button');
        btn.id = 'scrollToTopBtn';
        btn.className = 'scroll-to-top';
        btn.innerHTML = '<i class="fas fa-arrow-up"></i>';
        btn.setAttribute('aria-label', 'Scroll to top');
        
        if (document.body) {
            document.body.appendChild(btn);
        }

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .scroll-to-top {
                position: fixed;
                bottom: 30px;
                right: 30px;
                width: 50px;
                height: 50px;
                background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
                border: none;
                border-radius: 50%;
                color: white;
                font-size: 20px;
                cursor: pointer;
                display: none;
                z-index: 999;
                transition: all 0.3s ease;
                box-shadow: 0 4px 15px rgba(0, 123, 255, 0.3);
            }

            .scroll-to-top:hover {
                transform: translateY(-3px);
                box-shadow: 0 8px 25px rgba(0, 123, 255, 0.4);
            }

            .scroll-to-top.show {
                display: flex;
                align-items: center;
                justify-content: center;
            }

            @media (max-width: 576px) {
                .scroll-to-top {
                    bottom: 20px;
                    right: 20px;
                    width: 45px;
                    height: 45px;
                    font-size: 18px;
                }
            }
        `;
        if (document.head) {
            document.head.appendChild(style);
        }
        
        scrollTopBtn = document.getElementById('scrollToTopBtn');
    }
    
    if (!scrollTopBtn) {
        return;
    }
    
    window.addEventListener('scroll', throttle(() => {
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
        }
    }, 100));

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ========================================
// Newsletter Subscription
// ========================================

function setupNewsletter() {
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (!newsletterForm) {
        return;
    }

    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const emailInput = this.querySelector('input[type="email"]');
        const email = emailInput ? emailInput.value : '';
        
        if (email) {
            showNotification('Thank you for subscribing!', 'success');
            this.reset();
            announceToScreenReader('Successfully subscribed to newsletter');
        }
    });
}

// ========================================
// Notification System
// ========================================

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show`;
    notification.setAttribute('role', 'alert');
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    const container = document.querySelector('main') || document.body;
    if (container) {
        container.insertAdjacentElement('afterbegin', notification);
    }
    
    setTimeout(() => {
        notification.remove();
    }, 4000);
}

// ========================================
// Export Functions for External Use
// ========================================

window.portfolioApp = {
    showNotification,
    announceToScreenReader,
    validateField,
    debounce,
    throttle
};

// ========================================
// Performance Monitoring
// ========================================

if (window.performance && window.performance.timing) {
    window.addEventListener('load', () => {
        try {
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log('✅ Page Load Time:', pageLoadTime + 'ms');
        } catch (error) {
            console.log('Performance data not available');
        }
    });
}

console.log('✅ Portfolio Website JavaScript loaded successfully');
