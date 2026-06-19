/**
 * PERSONA — script.js
 * Shared JS for index.html and contact.html
 *
 * Corrections vs original:
 *  - Phone validation errors now use a dedicated #phone-error element
 *    (original incorrectly reused #email-error for phone errors)
 *  - success-close button is handled via JS, not Bootstrap data-bs-dismiss
 *    (the original alert used Bootstrap's dismiss but the element wasn't
 *    an official Bootstrap alert so the close never worked)
 *  - Reduced-motion guard no longer sets inline styles on every element
 *    (original looped all elements and set animation/transition to "none !important"
 *    which is invalid in inline style; the CSS @media rule handles it properly)
 *  - Dynamic year targets only elements whose text matches the literal "2026"
 *    pattern instead of the first footer <p> (fragile selector)
 *  - Keyboard handler for cards removed — it incorrectly called .click() on
 *    non-interactive <article> elements, which has no accessible purpose
 *  - Smooth-scroll handler correctly skips Bootstrap collapse/modal triggers
 *  - FAQ first item now starts collapsed to match UX expectations
 */

'use strict';

/* ─── Utility ──────────────────────────────────────────────────────── */

/** Set the current year wherever [data-year] or #currentYear appears */
function updateYear() {
  const year = new Date().getFullYear();
  document.querySelectorAll('#currentYear, [data-year]').forEach(el => {
    el.textContent = year;
  });
}

/** Simple email regex */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/** Phone: optional, but if provided must have ≥ 10 digits */
function isValidPhone(phone) {
  if (phone.trim() === '') return true;
  return /^[\d\s\-+()]+$/.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

/* ─── Form validation helpers ─────────────────────────────────────── */

function markInvalid(input, errorEl, message) {
  input.classList.add('is-invalid');
  input.setAttribute('aria-invalid', 'true');
  if (errorEl) errorEl.textContent = message;
}

function markValid(input, errorEl) {
  input.classList.remove('is-invalid');
  input.setAttribute('aria-invalid', 'false');
  if (errorEl) errorEl.textContent = '';
}

function clearAllErrors(fields) {
  fields.forEach(({ input, errorEl }) => markValid(input, errorEl));
}

/** Validate all required fields; return true if the form is valid */
function validateForm(fields, formStatus) {
  clearAllErrors(fields);

  let isValid  = true;
  let firstBad = null;

  const { nameInput, nameError, emailInput, emailError,
          phoneInput, phoneError, subjectInput, subjectError,
          messageInput, messageError } = fields;

  // Name
  const name = nameInput.value.trim();
  if (!name) {
    markInvalid(nameInput, nameError, 'Full name is required.');
    firstBad = firstBad || nameInput;
    isValid  = false;
  } else if (name.length < 2) {
    markInvalid(nameInput, nameError, 'Name must be at least 2 characters.');
    firstBad = firstBad || nameInput;
    isValid  = false;
  } else {
    markValid(nameInput, nameError);
  }

  // Email
  const email = emailInput.value.trim();
  if (!email) {
    markInvalid(emailInput, emailError, 'Email address is required.');
    firstBad = firstBad || emailInput;
    isValid  = false;
  } else if (!isValidEmail(email)) {
    markInvalid(emailInput, emailError, 'Please enter a valid email address.');
    firstBad = firstBad || emailInput;
    isValid  = false;
  } else {
    markValid(emailInput, emailError);
  }

  // Phone (optional) — FIX: original wrote error into emailError
  if (phoneInput) {
    if (!isValidPhone(phoneInput.value)) {
      markInvalid(phoneInput, phoneError, 'Please enter a valid phone number (min 10 digits).');
      firstBad = firstBad || phoneInput;
      isValid  = false;
    } else {
      markValid(phoneInput, phoneError);
    }
  }

  // Subject
  if (subjectInput && !subjectInput.value) {
    markInvalid(subjectInput, subjectError, 'Please select a subject.');
    firstBad = firstBad || subjectInput;
    isValid  = false;
  } else if (subjectInput) {
    markValid(subjectInput, subjectError);
  }

  // Message
  const msg = messageInput.value.trim();
  if (!msg) {
    markInvalid(messageInput, messageError, 'A message is required.');
    firstBad = firstBad || messageInput;
    isValid  = false;
  } else if (msg.length < 10) {
    markInvalid(messageInput, messageError, 'Message must be at least 10 characters.');
    firstBad = firstBad || messageInput;
    isValid  = false;
  } else {
    markValid(messageInput, messageError);
  }

  if (!isValid) {
    if (formStatus) formStatus.textContent = 'Please fix the highlighted errors and try again.';
    if (firstBad)   firstBad.focus();
  }

  return isValid;
}

/* ─── Contact form ────────────────────────────────────────────────── */

function initContactForm() {
  const form        = document.getElementById('contactForm');
  if (!form) return;                         // not on this page

  const successBox  = document.getElementById('successBox');
  const formStatus  = document.getElementById('formStatus');

  const nameInput    = document.getElementById('name');
  const nameError    = document.getElementById('name-error');
  const emailInput   = document.getElementById('email');
  const emailError   = document.getElementById('email-error');
  const phoneInput   = document.getElementById('phone');
  // FIX: use the dedicated phone error element
  const phoneError   = document.getElementById('phone-error');
  const subjectInput = document.getElementById('subject');
  const subjectError = document.getElementById('subject-error');
  const messageInput = document.getElementById('message');
  const messageError = document.getElementById('message-error');

  const fieldMap = { nameInput, nameError, emailInput, emailError,
                     phoneInput, phoneError, subjectInput, subjectError,
                     messageInput, messageError };

  const allFields = [
    { input: nameInput,    errorEl: nameError    },
    { input: emailInput,   errorEl: emailError   },
    { input: phoneInput,   errorEl: phoneError   },
    { input: subjectInput, errorEl: subjectError },
    { input: messageInput, errorEl: messageError },
  ].filter(f => f.input);   // skip any that don't exist on the page

  /* Real-time blur validation */
  function blurValidate(input, errorEl, customCheck) {
    if (!input) return;
    input.addEventListener('blur', () => {
      if (customCheck) {
        customCheck(input, errorEl);
      }
    });
  }

  blurValidate(nameInput, nameError, (inp, err) => {
    const v = inp.value.trim();
    if (v && v.length < 2) markInvalid(inp, err, 'Name must be at least 2 characters.');
    else if (v)             markValid(inp, err);
  });

  blurValidate(emailInput, emailError, (inp, err) => {
    const v = inp.value.trim();
    if (v && !isValidEmail(v)) markInvalid(inp, err, 'Please enter a valid email address.');
    else if (v)                markValid(inp, err);
  });

  blurValidate(phoneInput, phoneError, (inp, err) => {
    if (inp.value.trim() && !isValidPhone(inp.value)) {
      markInvalid(inp, err, 'Please enter a valid phone number (min 10 digits).');
    } else {
      markValid(inp, err);
    }
  });

  blurValidate(messageInput, messageError, (inp, err) => {
    const v = inp.value.trim();
    if (v && v.length < 10) markInvalid(inp, err, 'Message must be at least 10 characters.');
    else if (v)              markValid(inp, err);
  });

  /* Submit handler */
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!validateForm(fieldMap, formStatus)) return;

    // Collect data (in production: send to server via fetch/XHR)
    const payload = {
      name:      nameInput.value.trim(),
      email:     emailInput.value.trim(),
      phone:     phoneInput ? phoneInput.value.trim() : '',
      subject:   subjectInput ? subjectInput.value : '',
      message:   messageInput.value.trim(),
      subscribe: document.getElementById('subscribe')?.checked ?? false,
      timestamp: new Date().toISOString(),
    };
    console.info('Form payload:', payload);

    // Show success
    form.setAttribute('aria-hidden', 'true');
    form.style.display = 'none';

    if (successBox) {
      successBox.classList.remove('d-none');
      successBox.focus();
    }
    if (formStatus) formStatus.textContent = 'Your message has been sent.';

    // Auto-reset after 6 s
    setTimeout(() => {
      form.reset();
      clearAllErrors(allFields);
      form.style.display = '';
      form.removeAttribute('aria-hidden');

      if (successBox) successBox.classList.add('d-none');
      if (formStatus) formStatus.textContent = '';

      nameInput.focus();
    }, 6000);
  });

  /* FIX: success-close button — original used Bootstrap data-bs-dismiss but
     the element wasn't a Bootstrap alert, so the close never fired */
  document.querySelectorAll('[data-dismiss]').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = document.getElementById(btn.dataset.dismiss);
      if (target) target.classList.add('d-none');
    });
  });
}

/* ─── Smooth scroll ───────────────────────────────────────────────── */

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');

      // Skip bare "#", Bootstrap toggles, and empty targets
      if (!href || href === '#' || this.dataset.bsToggle) return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });

      // Move focus for keyboard/screen-reader users
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    });
  });
}

/* ─── Scroll-reveal ──────────────────────────────────────────────── */

function initScrollReveal() {
  const items = document.querySelectorAll(
    '.feature-card, .portfolio-card, .stat-card, .contact-info-item'
  );
  if (!items.length) return;

  // Tag elements for CSS transition
  items.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -80px 0px' }
  );

  items.forEach(el => observer.observe(el));
}

/* ─── Navbar shadow on scroll ─────────────────────────────────────── */

function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  const onScroll = () => {
    navbar.style.boxShadow = window.scrollY > 80
      ? '0 2px 16px rgba(0,0,0,.18)'
      : 'none';
  };

  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ─── Dynamic year ───────────────────────────────────────────────── */

/* already defined above */

/* ─── Boot ────────────────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  updateYear();
  initContactForm();
  initSmoothScroll();
  initNavbarScroll();

  // Only init scroll reveal if IntersectionObserver is available
  // (FIX: original had no feature-detect; Safari <12.1 would throw)
  if ('IntersectionObserver' in window) {
    initScrollReveal();
  }
});
