/* ===================================
   Document Ready & Initialization
   =================================== */

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contactForm");
  const dataTable = document.getElementById("dataTable");
  const successMsg = document.getElementById("successMsg");
  const errorMsg = document.getElementById("errorMsg");
  const noDataMsg = document.getElementById("noDataMsg");

  // Initialize data from localStorage
  loadStoredData();

  // Form submission handler
  if (form) {
    form.addEventListener("submit", handleFormSubmit);
  }

  // Blog specific functionality
  initializeBlogFeatures();

  // About page animations
  initializeAboutPageAnimations();

  // Update active nav link
  updateActiveNavLink();

  // Add accessibility enhancements
  addAccessibilityFeatures();

  // Initialize smooth scroll behavior
  initializeSmoothScroll();

  /* ===================================
     Form Submission Handler
     =================================== */

  function handleFormSubmit(event) {
    event.preventDefault();

    // Reset message displays
    hideMessages();

    // Validate form
    if (!validateForm()) {
      showError("Please fill in all required fields correctly.");
      return;
    }

    // Get form data
    const formData = getFormData();

    // Save to localStorage
    saveToLocalStorage(formData);

    // Add to table
    addDataToTable(formData);

    // Show success message
    showSuccess("Message sent successfully!");

    // Reset form
    form.reset();

    // Clear validation styles
    clearValidationStyles();

    // Scroll to table
    setTimeout(() => {
      dataTable?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 500);
  }

  /* ===================================
     Form Validation
     =================================== */

  function validateForm() {
    const form = document.getElementById("contactForm");

    // Check Bootstrap validation
    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      return false;
    }

    // Custom email validation
    const email = document.getElementById("email").value;
    if (!isValidEmail(email)) {
      showError("Please enter a valid email address.");
      return false;
    }

    // Custom phone validation
    const phone = document.getElementById("phone").value;
    if (!isValidPhone(phone)) {
      showError("Please enter a valid phone number.");
      return false;
    }

    return true;
  }

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function isValidPhone(phone) {
    const phoneRegex = /^[\d\s\-\(\)\+]{10,}$/;
    return phoneRegex.test(phone.replace(/\s/g, ""));
  }

  function clearValidationStyles() {
    const form = document.getElementById("contactForm");
    form.classList.remove("was-validated");
  }

  /* ===================================
     Form Data Management
     =================================== */

  function getFormData() {
    return {
      name: document.getElementById("name").value.trim(),
      email: document.getElementById("email").value.trim(),
      phone: document.getElementById("phone").value.trim(),
      service: document.getElementById("service").value || "Not specified",
      message: document.getElementById("message").value.trim(),
      timestamp: new Date().toLocaleString()
    };
  }

  function saveToLocalStorage(formData) {
    let submissions = JSON.parse(localStorage.getItem("submissions")) || [];
    submissions.push(formData);
    localStorage.setItem("submissions", JSON.stringify(submissions));
  }

  function loadStoredData() {
    let submissions = JSON.parse(localStorage.getItem("submissions")) || [];

    if (submissions.length === 0) {
      if (noDataMsg) {
        noDataMsg.style.display = "block";
      }
      return;
    }

    if (noDataMsg) {
      noDataMsg.style.display = "none";
    }

    submissions.forEach(submission => {
      addDataToTable(submission);
    });
  }

  /* ===================================
     Table Data Display
     =================================== */

  function addDataToTable(formData) {
    if (!dataTable) return;

    // Hide no data message
    if (noDataMsg) {
      noDataMsg.style.display = "none";
    }

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>
        <div class="d-flex align-items-center">
          <div class="avatar me-2" style="width: 35px; height: 35px; background: linear-gradient(135deg, #0d6efd 0%, #0860ca 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 0.8rem;">
            ${formData.name.charAt(0).toUpperCase()}
          </div>
          <span>${escapeHtml(formData.name)}</span>
        </div>
      </td>
      <td>
        <a href="mailto:${escapeHtml(formData.email)}">${escapeHtml(formData.email)}</a>
      </td>
      <td>
        <a href="tel:${formData.phone.replace(/\D/g, '')}">${escapeHtml(formData.phone)}</a>
      </td>
      <td>
        <span class="badge bg-info">${escapeHtml(formData.service)}</span>
      </td>
      <td>
        <p class="mb-0 text-truncate" title="${escapeHtml(formData.message)}">
          ${escapeHtml(formData.message)}
        </p>
      </td>
    `;

    dataTable.insertBefore(row, dataTable.firstChild);

    // Add animation
    row.style.animation = "slideIn 0.3s ease-in-out";
  }

  /* ===================================
     Message Display Functions
     =================================== */

  function showSuccess(message) {
    if (successMsg) {
      successMsg.style.display = "block";
      successMsg.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  function showError(message) {
    if (errorMsg) {
      errorMsg.style.display = "block";
      errorMsg.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  function hideMessages() {
    if (successMsg) successMsg.style.display = "none";
    if (errorMsg) errorMsg.style.display = "none";
  }

  /* ===================================
     Blog Features
     =================================== */

  function initializeBlogFeatures() {
    // Blog search functionality
    const searchInput = document.querySelector(".input-group input[placeholder='Search articles...']");
    if (searchInput) {
      searchInput.addEventListener("input", handleBlogSearch);
    }

    // Blog category filters
    const categoryButtons = document.querySelectorAll(".d-flex.gap-2 .btn");
    categoryButtons.forEach(button => {
      button.addEventListener("click", handleCategoryFilter);
    });

    // Newsletter form
    const newsletterForm = document.querySelector(".newsletter-form");
    if (newsletterForm) {
      newsletterForm.addEventListener("submit", handleNewsletterSubmit);
    }

    // Add read time animation
    animateReadTime();
  }

  function handleBlogSearch(event) {
    const searchTerm = event.target.value.toLowerCase();
    const blogCards = document.querySelectorAll(".blog-card");

    blogCards.forEach(card => {
      const title = card.querySelector("h5").textContent.toLowerCase();
      const description = card.querySelector("p").textContent.toLowerCase();

      if (title.includes(searchTerm) || description.includes(searchTerm)) {
        card.parentElement.style.display = "";
        card.style.animation = "fadeInUp 0.5s ease-in-out";
      } else {
        card.parentElement.style.display = "none";
      }
    });
  }

  function handleCategoryFilter(event) {
    const button = event.target.closest(".btn");
    const category = button.textContent.trim();

    // Update active state
    document.querySelectorAll(".d-flex.gap-2 .btn").forEach(btn => {
      btn.classList.remove("active");
    });
    button.classList.add("active");

    // Filter blog posts
    const blogCards = document.querySelectorAll(".blog-card");
    blogCards.forEach(card => {
      const badge = card.querySelector(".badge-category");
      const badgeText = badge ? badge.textContent.trim() : "";

      if (category === "All Posts" || badgeText === category) {
        card.parentElement.style.display = "";
        card.style.animation = "fadeInUp 0.5s ease-in-out";
      } else {
        card.parentElement.style.display = "none";
      }
    });
  }

  function handleNewsletterSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const emailInput = form.querySelector('input[type="email"]');
    const email = emailInput.value;

    if (isValidEmail(email)) {
      // Store newsletter subscription
      let subscribers = JSON.parse(localStorage.getItem("newsletter_subscribers")) || [];
      if (!subscribers.includes(email)) {
        subscribers.push(email);
        localStorage.setItem("newsletter_subscribers", JSON.stringify(subscribers));
      }

      // Show success message
      const button = form.querySelector("button");
      const originalText = button.innerHTML;
      button.innerHTML = '<i class="bi bi-check-circle"></i> Subscribed!';
      button.classList.add("disabled");

      emailInput.value = "";

      setTimeout(() => {
        button.innerHTML = originalText;
        button.classList.remove("disabled");
      }, 3000);
    }
  }

  function animateReadTime() {
    const readTimeElements = document.querySelectorAll(".blog-meta-small");
    readTimeElements.forEach((element, index) => {
      setTimeout(() => {
        element.style.animation = `fadeInUp 0.5s ease-in-out`;
      }, index * 50);
    });
  }

  /* ===================================
     About Page Animations
     =================================== */

  function initializeAboutPageAnimations() {
    // Animate value cards on scroll
    const valueCards = document.querySelectorAll(".value-card");
    observeElements(valueCards);

    // Animate team member cards on scroll
    const teamCards = document.querySelectorAll(".team-member-card");
    observeElements(teamCards);

    // Animate timeline items on scroll
    const timelineItems = document.querySelectorAll(".timeline-item");
    observeElements(timelineItems);

    // Animate why-choose cards on scroll
    const whyChooseCards = document.querySelectorAll(".why-choose-card");
    observeElements(whyChooseCards);

    // Add counter animation for stats
    animateCounters();
  }

  function observeElements(elements) {
    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    elements.forEach((element) => {
      element.style.opacity = "0";
      element.style.transform = "translateY(20px)";
      element.style.transition = "opacity 0.6s ease-in-out, transform 0.6s ease-in-out";
      observer.observe(element);
    });
  }

  function animateCounters() {
    const stats = document.querySelectorAll(".stat-card h3");

    stats.forEach(stat => {
      const target = parseInt(stat.textContent);
      const finalText = stat.textContent;

      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          animateValue(stat, 0, target, 2000, finalText);
          observer.unobserve(stat);
        }
      });

      observer.observe(stat);
    });

    function animateValue(element, start, end, duration, finalText) {
      const startTime = performance.now();

      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const current = Math.floor(start + (end - start) * progress);

        element.textContent = current + (finalText.replace(/[0-9]/g, ""));

        if (progress < 1) {
          requestAnimationFrame(update);
        }
      }

      requestAnimationFrame(update);
    }
  }

  /* ===================================
     Utility Functions
     =================================== */

  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  function updateActiveNavLink() {
    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    const navLinks = document.querySelectorAll(".nav-link");

    navLinks.forEach(link => {
      const href = link.getAttribute("href");
      if (href === currentPage || (currentPage === "" && href === "index.html")) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }

  function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener("click", function (e) {
        const href = this.getAttribute("href");
        if (href !== "#" && document.querySelector(href)) {
          e.preventDefault();
          const target = document.querySelector(href);
          target.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        }
      });
    });
  }

  function addAccessibilityFeatures() {
    // Keyboard navigation for form fields
    const formInputs = document.querySelectorAll(".form-control, .form-select");
    formInputs.forEach((input, index) => {
      input.addEventListener("keypress", function (e) {
        if (e.key === "Enter" && this.type !== "textarea") {
          const nextInput = formInputs[index + 1];
          if (nextInput) {
            nextInput.focus();
          }
        }
      });
    });

    // Add focus trap for modals
    const modals = document.querySelectorAll(".modal");
    modals.forEach(modal => {
      modal.addEventListener("shown.bs.modal", function () {
        const focusableElements = modal.querySelectorAll("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])");
        const firstElement = focusableElements[0];
        if (firstElement) firstElement.focus();
      });
    });

    // Add skip to main content link
    addSkipLink();
  }

  function addSkipLink() {
    if (document.querySelector(".skip-to-main")) return;

    const skipLink = document.createElement("a");
    skipLink.href = "#main-content";
    skipLink.className = "skip-to-main";
    skipLink.textContent = "Skip to main content";
    skipLink.style.cssText = `
      position: absolute;
      top: -40px;
      left: 0;
      background: var(--primary-color);
      color: white;
      padding: 8px;
      text-decoration: none;
      z-index: 100;
    `;

    skipLink.addEventListener("focus", () => {
      skipLink.style.top = "0";
    });

    skipLink.addEventListener("blur", () => {
      skipLink.style.top = "-40px";
    });

    document.body.insertBefore(skipLink, document.body.firstChild);
  }

  /* ===================================
     Performance Optimization
     =================================== */

  // Lazy load images
  if ("IntersectionObserver" in window) {
    const images = document.querySelectorAll("img[data-src]");
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute("data-src");
          imageObserver.unobserve(img);
        }
      });
    });
    images.forEach(img => imageObserver.observe(img));
  }

  /* ===================================
     Add CSS Animations
     =================================== */

  addAnimationStyles();

  function addAnimationStyles() {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translateX(-20px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }

      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      @keyframes slideDown {
        from {
          opacity: 0;
          transform: translateY(-20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .service-card {
        animation: fadeInUp 0.6s ease-in-out;
      }

      .blog-card {
        animation: fadeInUp 0.6s ease-in-out;
      }

      .value-card {
        animation: fadeInUp 0.6s ease-in-out;
      }

      .team-member-card {
        animation: fadeInUp 0.6s ease-in-out;
      }

      .skip-to-main {
        transition: top 0.3s ease-in-out;
      }
    `;
    document.head.appendChild(style);
  }

  /* ===================================
     Form Bootstrap Validation
     =================================== */

  const forms = document.querySelectorAll("form[novalidate]");
  Array.from(forms).forEach(form => {
    form.addEventListener("submit", function (event) {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }
      form.classList.add("was-validated");
    }, false);
  });

  /* ===================================
     Mobile Menu Handler
     =================================== */

  const navbarToggler = document.querySelector(".navbar-toggler");
  const navbarCollapse = document.querySelector(".navbar-collapse");

  if (navbarToggler) {
    navbarToggler.addEventListener("click", function() {
      document.body.style.overflow = navbarCollapse.classList.contains("show") ? "auto" : "hidden";
    });

    // Close menu on link click
    document.querySelectorAll(".nav-link").forEach(link => {
      link.addEventListener("click", function() {
        if (navbarCollapse.classList.contains("show")) {
          navbarToggler.click();
          document.body.style.overflow = "auto";
        }
      });
    });
  }

  /* ===================================
     Parallax Effect (Optional)
     =================================== */

  function initializeParallax() {
    const parallaxElements = document.querySelectorAll("[data-parallax]");
    if (!parallaxElements.length) return;

    window.addEventListener("scroll", () => {
      const scrollPosition = window.pageYOffset;

      parallaxElements.forEach(element => {
        const speed = element.getAttribute("data-parallax") || 0.5;
        element.style.transform = `translateY(${scrollPosition * speed}px)`;
      });
    });
  }

  initializeParallax();

});

/* ===================================
   Global Utility Functions (Outside DOMContentLoaded)
   =================================== */

// Track page view analytics (optional)
function trackPageView(pageName) {
  const pageViews = JSON.parse(localStorage.getItem("page_views")) || {};
  pageViews[pageName] = (pageViews[pageName] || 0) + 1;
  localStorage.setItem("page_views", JSON.stringify(pageViews));
}

// Initialize on page load
window.addEventListener("load", () => {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  trackPageView(currentPage);
});

// Handle network status
window.addEventListener("online", () => {
  console.log("Network connection restored");
  document.body.classList.remove("offline");
});

window.addEventListener("offline", () => {
  console.log("Network connection lost");
  document.body.classList.add("offline");
});
