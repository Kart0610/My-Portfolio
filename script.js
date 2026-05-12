/**
 * Portfolio Website - JavaScript
 * Full Stack Java Developer Portfolio
 *
 * Handles: Dark/Light mode toggle, smooth scrolling, mobile menu,
 * scroll animations, contact form, and navbar scroll effect.
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==================== THEME TOGGLE (Dark/Light Mode) ====================
  const themeToggle = document.getElementById('theme-toggle');
  const themeToggleMobile = document.getElementById('theme-toggle-mobile');
  const darkIcon = document.getElementById('theme-toggle-dark-icon');
  const darkIconMobile = document.getElementById('theme-toggle-dark-icon-mobile');
  const lightIcon = document.getElementById('theme-toggle-light-icon');
  const lightIconMobile = document.getElementById('theme-toggle-light-icon-mobile');

  /**
   * Applies the theme and updates toggle button icons
   * @param {boolean} isDark - Whether dark mode should be active
   */
  function setTheme(isDark) {
    if (isDark) {
      document.documentElement.classList.add('dark');
      darkIcon?.classList.add('hidden');
      darkIconMobile?.classList.add('hidden');
      lightIcon?.classList.remove('hidden');
      lightIconMobile?.classList.remove('hidden');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      darkIcon?.classList.remove('hidden');
      darkIconMobile?.classList.remove('hidden');
      lightIcon?.classList.add('hidden');
      lightIconMobile?.classList.add('hidden');
      localStorage.setItem('theme', 'light');
    }
  }

  /**
   * Toggles between dark and light mode
   */
  function toggleTheme() {
    const isDark = document.documentElement.classList.toggle('dark');
    setTheme(isDark);
  }

  // Initialize theme from localStorage or system preference
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    setTheme(true);
  } else {
    setTheme(false);
  }

  // Theme toggle button event listeners
  themeToggle?.addEventListener('click', toggleTheme);
  themeToggleMobile?.addEventListener('click', toggleTheme);

  // ==================== MOBILE MENU ====================
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  mobileMenuBtn?.addEventListener('click', () => {
    mobileMenu?.classList.toggle('hidden');
  });

  // Close mobile menu when a link is clicked
  mobileNavLinks.forEach((link) => {
    link.addEventListener('click', () => {
      mobileMenu?.classList.add('hidden');
    });
  });

  // ==================== NAVBAR SCROLL EFFECT ====================
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  });

  // ==================== ACTIVE NAV LINK ON SCROLL ====================
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateActiveNavLink() {
    const scrollY = window.scrollY;

    sections.forEach((section) => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 100;
      const sectionId = section.getAttribute('id');
      const link = document.querySelector(`.nav-link[href="#${sectionId}"]`);

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach((l) => l.classList.remove('active'));
        link?.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveNavLink);
  updateActiveNavLink(); // Run on load

  // ==================== SCROLL ANIMATIONS (Intersection Observer) ====================
  const animatedElements = document.querySelectorAll(
    '.section-title, .section-subtitle, .about-content, .project-card, .skill-card, .skill-category-card, .training-card, .cert-carousel, .cert-card, .stat-card, .education-card'
  );

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -80px 0px', // Trigger when element is 80px from viewport bottom
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
      }
    });
  }, observerOptions);

  animatedElements.forEach((el) => observer.observe(el));

  // ==================== CERTIFICATIONS CAROUSEL ====================
  const certTrack = document.getElementById('cert-track');
  const certNavButtons = document.querySelectorAll('[data-cert-nav]');

  function getCertScrollAmount() {
    if (!certTrack) return 0;
    const firstCard = certTrack.querySelector('.cert-card');
    if (!firstCard) return 320;
    const cardWidth = firstCard.getBoundingClientRect().width;
    return Math.max(260, Math.round(cardWidth + 16));
  }

  function scrollCert(direction) {
    if (!certTrack) return;
    const amount = getCertScrollAmount();
    certTrack.scrollBy({ left: direction * amount, behavior: 'smooth' });
  }

  certNavButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const dir = btn.getAttribute('data-cert-nav') === 'next' ? 1 : -1;
      scrollCert(dir);
    });
  });

  let certAutoTimer = null;
  function startCertAutoSlide() {
    if (!certTrack) return;
    stopCertAutoSlide();
    certAutoTimer = window.setInterval(() => {
      const maxScrollLeft = certTrack.scrollWidth - certTrack.clientWidth;
      const atEnd = certTrack.scrollLeft >= maxScrollLeft - 5;
      if (atEnd) {
        certTrack.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        scrollCert(1);
      }
    }, 4200);
  }

  function stopCertAutoSlide() {
    if (certAutoTimer) {
      window.clearInterval(certAutoTimer);
      certAutoTimer = null;
    }
  }

  certTrack?.addEventListener('mouseenter', stopCertAutoSlide);
  certTrack?.addEventListener('mouseleave', startCertAutoSlide);
  certTrack?.addEventListener('focusin', stopCertAutoSlide);
  certTrack?.addEventListener('focusout', startCertAutoSlide);

  startCertAutoSlide();

  // ==================== ACHIEVEMENTS COUNTERS ====================
  const counters = document.querySelectorAll('.counter[data-target]');
  const countersObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const el = entry.target;
        const target = Number(el.getAttribute('data-target') || '0');
        if (!Number.isFinite(target) || target <= 0) return;
        if (el.getAttribute('data-animated') === 'true') return;

        el.setAttribute('data-animated', 'true');

        const durationMs = 900;
        const start = performance.now();
        const startValue = 0;

        function tick(now) {
          const t = Math.min(1, (now - start) / durationMs);
          const eased = 1 - Math.pow(1 - t, 3);
          const value = Math.round(startValue + (target - startValue) * eased);
          el.textContent = String(value);
          if (t < 1) requestAnimationFrame(tick);
        }

        requestAnimationFrame(tick);
      });
    },
    { threshold: 0.35 }
  );

  counters.forEach((c) => countersObserver.observe(c));

  // ==================== CONTACT FORM HANDLING ====================
  const contactForm = document.getElementById('contact-form');

  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get form data
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData.entries());

    // In a real application, you would send this to a backend
    // For now, we'll use mailto or show a success message
    console.log('Form submitted:', data);

    // Show success message (you can replace with a proper toast/notification)
    alert(
      'Thank you for your message! I will get back to you soon.\n\n(Note: This is a demo. Connect the form to a backend or service like Formspree for actual functionality.)'
    );

    contactForm.reset();
  });

  // ==================== CURRENT YEAR IN FOOTER ====================
  const yearSpan = document.getElementById('current-year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // ==================== SMOOTH SCROLL FOR ANCHOR LINKS ====================
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    });
  });
});
