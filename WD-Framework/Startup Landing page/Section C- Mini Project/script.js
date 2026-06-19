/**
 * VENTUREFLOW - MULTI-PAGE WEBSITE JAVASCRIPT
 * Interactive features, form validation, and accessibility enhancements
 */

document.addEventListener('DOMContentLoaded', function() {
  console.log('%cVentureFlow', 'font-size: 24px; font-weight: bold; color: #2563EB;');
  console.log('%cStartup Framework Integration Platform', 'font-size: 12px; color: #6B7280;');

  // Initialize AOS (Animate on Scroll)
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }

  // Initialize features
  initNavbarScroll();
  initContactForm();
  initSmoothScroll();
  initKeyboardNavigation();
});

// ===================================================================
// NAVBAR SCROLL EFFECT
// ===================================================================

function initNavbarScroll() {
  const navbar = document.getElementById('mainNavbar');
  if (!navbar) return;

  window.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > 100) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    updateActiveNavLink();
  });
}

// ===================================================================
// UPDATE ACTIVE NAV LINK
// ===================================================================

function updateActiveNavLink() {
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  let current = '';

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;

    if (pageYOffset >= (sectionTop - 200)) {
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

// ===================================================================
// CONTACT FORM VALIDATION & SUBMISSION
// ===================================================================

function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;

  const formFields = {
    fullName: contactForm.querySelector('#fullName'),
    email: contactForm.querySelector('#email'),
    company: contactForm.querySelector('#company'),
    subject: contactForm.querySelector('#subject'),
    message: contactForm.querySelector('#message'),
    agreeTerms: contactForm.querySelector('#agreeTerms')
  };

  // Real-time validation
  Object.keys(formFields).forEach(key => {
    const field = formFields[key];
    if (!field) return;

    if (field.type === 'checkbox') {
      field.addEventListener('change', () => validateField(field));
    } else {
      field.addEventListener('blur', () => validateField(field));
      field.addEventListener('input', () => {
        if (field.classList.contains('is-invalid')) {
          validateField(field);
        }
      });
    }
  });

  // Form submission
  contactForm.addEventListener('submit', handleFormSubmit);
}

/**
 * Validate individual form field
 */
function validateField(field) {
  const fieldValue = field.type === 'checkbox' ? field.checked : field.value.trim();
  let isValid = true;
  let errorMessage = '';

  switch (field.id) {
    case 'fullName':
      if (!fieldValue) {
        isValid = false;
        errorMessage = 'Full name is required';
      } else if (fieldValue.length < 2) {
        isValid = false;
        errorMessage = 'Name must be at least 2 characters';
      }
      break;

    case 'email':
      if (!fieldValue) {
        isValid = false;
        errorMessage = 'Email is required';
      } else if (!isValidEmail(fieldValue)) {
        isValid = false;
        errorMessage = 'Please enter a valid email address';
      }
      break;

    case 'company':
      if (!fieldValue) {
        isValid = false;
        errorMessage = 'Company name is required';
      }
      break;

    case 'subject':
      if (!fieldValue) {
        isValid = false;
        errorMessage = 'Please select a subject';
      }
      break;

    case 'message':
      if (!fieldValue) {
        isValid = false;
        errorMessage = 'Message is required';
      } else if (fieldValue.length < 10) {
        isValid = false;
        errorMessage = 'Message must be at least 10 characters';
      }
      break;

    case 'agreeTerms':
      if (!field.checked) {
        isValid = false;
        errorMessage = 'You must agree to the terms';
      }
      break;
  }

  // Update field styling
  if (isValid) {
    field.classList.remove('is-invalid');
    const feedback = field.nextElementSibling;
    if (feedback && feedback.classList.contains('invalid-feedback')) {
      feedback.textContent = '';
    }
  } else {
    field.classList.add('is-invalid');
    const feedback = field.nextElementSibling;
    if (feedback && feedback.classList.contains('invalid-feedback')) {
      feedback.textContent = errorMessage;
    }
  }

  return isValid;
}

/**
 * Validate email format
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate entire form
 */
function validateForm() {
  const contactForm = document.getElementById('contactForm');
  const fields = contactForm.querySelectorAll('[required]');
  let isFormValid = true;

  fields.forEach(field => {
    if (!validateField(field)) {
      isFormValid = false;
    }
  });

  return isFormValid;
}

/**
 * Handle form submission
 */
function handleFormSubmit(event) {
  event.preventDefault();

  const contactForm = document.getElementById('contactForm');
  const formAlert = document.getElementById('formAlert');
  const successBox = document.getElementById('successBox');

  // Validate form
  if (!validateForm()) {
    showAlert(formAlert, 'Please fix the errors above', 'danger');
    return;
  }

  // Collect form data
  const formData = {
    fullName: contactForm.querySelector('#fullName').value,
    email: contactForm.querySelector('#email').value,
    company: contactForm.querySelector('#company').value,
    subject: contactForm.querySelector('#subject').value,
    message: contactForm.querySelector('#message').value,
    timestamp: new Date().toISOString()
  };

  // Log form data (in production, send to server)
  console.log('Form submitted:', formData);

  // Show success message
  if (successBox) {
    successBox.classList.remove('d-none');
  } else {
    showAlert(formAlert, '✓ Message sent successfully! We\'ll get back to you soon.', 'success');
  }

  // Reset form
  setTimeout(() => {
    contactForm.reset();
    contactForm.querySelectorAll('.is-invalid').forEach(field => {
      field.classList.remove('is-invalid');
    });
    if (formAlert) {
      formAlert.classList.add('d-none');
    }
    if (successBox) {
      successBox.classList.add('d-none');
    }
  }, 3000);
}

/**
 * Show alert message
 */
function showAlert(alertElement, message, type) {
  if (!alertElement) return;

  alertElement.innerHTML = message;
  alertElement.className = `alert alert-${type} d-block`;
  alertElement.setAttribute('role', 'alert');

  setTimeout(() => {
    alertElement.classList.add('d-none');
  }, 5000);
}

// ===================================================================
// SMOOTH SCROLLING FOR ANCHOR LINKS
// ===================================================================

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');

      if (href === '#') {
        return;
      }

      e.preventDefault();

      const target = document.querySelector(href);
      if (!target) return;

      // Close navbar if open
      const navbar = document.querySelector('.navbar-collapse');
      if (navbar && navbar.classList.contains('show')) {
        const toggle = document.querySelector('.navbar-toggler');
        toggle.click();
      }

      // Scroll to target
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    });
  });
}

// ===================================================================
// KEYBOARD NAVIGATION
// ===================================================================

function initKeyboardNavigation() {
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-nav');
    }
  });

  document.addEventListener('click', function() {
    document.body.classList.remove('keyboard-nav');
  });

  // Button keyboard support
  document.querySelectorAll('.btn, .card').forEach(element => {
    element.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        if (this.tagName === 'A') {
          e.preventDefault();
          this.click();
        }
      }
    });
  });
}

// ===================================================================
// PREFERS REDUCED MOTION
// ===================================================================

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion) {
  document.documentElement.style.scrollBehavior = 'auto';
  const style = document.createElement('style');
  style.textContent = `
    * {
      animation: none !important;
      transition: none !important;
    }
  `;
  document.head.appendChild(style);
}

// ===================================================================
// UTILITY FUNCTIONS
// ===================================================================

/**
 * Debounce function
 */
function debounce(func, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

/**
 * Throttle function
 */
function throttle(func, delay) {
  let lastCallTime = 0;
  return function(...args) {
    const now = Date.now();
    if (now - lastCallTime >= delay) {
      func(...args);
      lastCallTime = now;
    }
  };
}

// ===================================================================
// ERROR HANDLING
// ===================================================================

window.addEventListener('error', function(e) {
  console.error('Error:', e.error);
});

window.addEventListener('unhandledrejection', function(e) {
  console.error('Unhandled promise rejection:', e.reason);
});

// ===================================================================
// PERFORMANCE MONITORING
// ===================================================================

if (window.performance && window.performance.timing) {
  window.addEventListener('load', function() {
    const perfData = window.performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
    console.log('Page load time: ' + pageLoadTime + 'ms');
  });
}
