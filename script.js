(function () {
  const root = document.documentElement;
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mobileMenu = document.querySelector('.mobile-menu');
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = document.querySelector('[data-theme-icon]');
  const contactForm = document.getElementById('contact-form');
  const yearEl = document.getElementById('year');
  const skills = document.querySelectorAll('.skill[data-level]');
  const projectCards = document.querySelectorAll('.project');
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
  const loadingScreen = document.getElementById('loading-screen');
  const scrollTopBtn = document.getElementById('scroll-top');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const header = document.querySelector('.portfolio-header');

  function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || (window.matchMedia && window.matchMedia('(max-width: 899px)').matches);
  }

  // Year in footer
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Loading screen
  function hideLoadingScreen() {
    if (loadingScreen) {
      setTimeout(() => {
        loadingScreen.classList.add('hidden');
        setTimeout(() => {
          loadingScreen.style.display = 'none';
          // Trigger hero animation after loading screen is hidden
          const heroInner = document.querySelector('.hero-inner');
          if (heroInner) {
            heroInner.classList.add('animate');
          }
        }, 200); // Reduced to match the faster transition
      }, 1500);
    }
  }

  // Animated counters for hero stats
  function animateHeroCounters() {
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'));
      const suffix = counter.getAttribute('data-suffix') || '';
      const duration = 2000; // 2 seconds
      const startTime = performance.now();
      const startValue = 0;
      
      const updateCounter = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(startValue + (target - startValue) * easeOutQuart);
        
        counter.textContent = current + suffix;
        
        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target + suffix;
        }
      };
      
      requestAnimationFrame(updateCounter);
    });
  }

  // Typing effect for hero title
  function initTypingEffect() {
    const heroTitle = document.querySelector('.hero-copy h1 .accent');
    if (!heroTitle) return;
    
    const text = heroTitle.textContent;
    heroTitle.textContent = '';
    heroTitle.style.borderRight = '2px solid var(--accent)';
    
    let i = 0;
    const typeWriter = () => {
      if (i < text.length) {
        heroTitle.textContent += text.charAt(i);
        i++;
        setTimeout(typeWriter, 100);
      } else {
        setTimeout(() => {
          heroTitle.style.borderRight = 'none';
        }, 1000);
      }
    };
    
    // Start typing after a short delay
    setTimeout(typeWriter, 500);
  }

  // Animated counters for skills
  function animateCounters() {
    const counters = document.querySelectorAll('.skill-level');
    counters.forEach(counter => {
      const target = parseInt(counter.textContent);
      const increment = target / 50;
      let current = 0;
      
      const updateCounter = () => {
        if (current < target) {
          current += increment;
          counter.textContent = Math.ceil(current) + '%';
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target + '%';
        }
      };
      
      updateCounter();
    });
  }

  // Enhanced skill bar animations with hover effects
  function initSkillBars() {
    if (skills.length) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const skill = entry.target;
            const level = Number(skill.getAttribute('data-level')) || 0;
            const fill = skill.querySelector('.skill-bar-fill');
            if (fill) {
              // Animate the fill bar
              fill.style.transition = 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
              requestAnimationFrame(() => {
                fill.style.width = level + '%';
              });
              
              // Add hover effect
              skill.addEventListener('mouseenter', () => {
                fill.style.transform = 'scaleY(1.2)';
                fill.style.transition = 'transform 0.3s ease';
              });
              
              skill.addEventListener('mouseleave', () => {
                fill.style.transform = 'scaleY(1)';
              });
            }
            observer.unobserve(skill);
          }
        });
      }, { threshold: 0.4 });

      skills.forEach((el) => observer.observe(el));
    }
  }

  // Interactive project cards
  function initProjectCards() {
    projectCards.forEach(card => {
      const media = card.querySelector('.card-media');
      const actions = card.querySelector('.card-actions');
      
      if (media && actions) {
        // Hero animations removed — function intentionally left out.
        scrollTopBtn.classList.remove('visible');
      }
    });
    
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // Smooth scroll with enhanced behavior
  function initSmoothScroll() {
    document.addEventListener('click', (e) => {
      const target = e.target;
      if (target && target instanceof HTMLElement && target.closest('a[href^="#"]')) {
        const anchor = target.closest('a[href^="#"]');
        if (!anchor) return;
        const id = anchor.getAttribute('href');
        if (!id || id === '#') return;
        const el = document.querySelector(id);
        if (el) {
          e.preventDefault();
          
          // Add active state to navigation
          navLinks.forEach(link => link.classList.remove('active'));
          anchor.classList.add('active');
          
          // Close mobile menu if open
          if (mobileMenu && mobileMenu.classList.contains('open')) {
            mobileMenu.classList.remove('open');
            if (mobileMenuBtn) {
              mobileMenuBtn.setAttribute('aria-expanded', 'false');
            }
          }
          
          // Smooth scroll with offset for header
          const headerHeight = header ? header.offsetHeight : 72;
          const targetPosition = el.offsetTop - headerHeight - 20;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  }

  // Active navigation highlighting
  function initActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            }
          });
        }
      });
    }, { threshold: 0.3, rootMargin: '-20% 0px -20% 0px' });
    
    sections.forEach(section => observer.observe(section));
  }

  // Enhanced form interactions
  function initEnhancedForm() {
    if (contactForm) {
      const statusEl = contactForm.querySelector('.form-status');
      const fields = Array.from(contactForm.querySelectorAll('input[required], textarea[required]'));
      const submitBtn = contactForm.querySelector('button[type="submit"]');

      function setError(field, message) {
        const container = field.closest('.form-field');
        const errorEl = container ? container.querySelector('.error') : null;
        if (errorEl) {
          errorEl.textContent = message || '';
          errorEl.style.opacity = message ? '1' : '0';
        }
        field.setAttribute('aria-invalid', message ? 'true' : 'false');
        
        // Add visual feedback
        if (message) {
          field.style.borderColor = 'var(--err)';
          field.style.boxShadow = '0 0 0 3px rgba(255, 90, 95, 0.1)';
        } else {
          field.style.borderColor = '';
          field.style.boxShadow = '';
        }
      }

      function validateField(field) {
        const value = String(field.value || '').trim();
        let message = '';
        if (!value) message = 'This field is required.';
        if (!message && field.type === 'email') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) message = 'Please enter a valid email.';
        }
        setError(field, message);
        return !message;
      }

      // Real-time validation with debouncing
      let validationTimeout;
      fields.forEach((field) => {
        field.addEventListener('input', () => {
          clearTimeout(validationTimeout);
          validationTimeout = setTimeout(() => validateField(field), 300);
        });
        
        field.addEventListener('blur', () => validateField(field));
        field.addEventListener('focus', () => {
          field.style.borderColor = 'var(--accent)';
          field.style.boxShadow = '0 0 0 3px rgba(124, 92, 255, 0.1)';
        });
      });

      // Enhanced submit handling
      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const allValid = fields.every(validateField);
        
        if (!allValid) {
          if (statusEl) {
            statusEl.textContent = 'Please fix the errors above.';
            statusEl.style.color = 'var(--err)';
          }
          return;
        }
        
        // Simulate form submission
        if (submitBtn) {
          submitBtn.textContent = 'Sending...';
          submitBtn.disabled = true;
        }
        
        setTimeout(() => {
          if (statusEl) {
            statusEl.textContent = 'Message sent successfully! 🎉';
            statusEl.style.color = 'var(--ok)';
          }
          if (submitBtn) {
            submitBtn.textContent = 'Send Message';
            submitBtn.disabled = false;
          }
          contactForm.reset();
          fields.forEach((f) => setError(f, ''));
        }, 1500);
      });
    }
  }

  // Hero slide-in/out observer
  function initHeroAnimations() {
    const hero = document.getElementById('hero');
    if (!hero) return;

    // Ensure initial state before intersection
    hero.classList.remove('hero--visible', 'hero--hidden');

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          hero.classList.add('hero--visible');
          hero.classList.remove('hero--hidden');
        } else {
          hero.classList.add('hero--hidden');
          hero.classList.remove('hero--visible');
        }
      });
    }, { threshold: 0.1 });

    io.observe(hero);
  }

  // Parallax effect for hero section
  function initParallax() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.5;
      hero.style.transform = `translateY(${rate}px)`;
    });
  }

  // Mobile menu toggle
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      const expanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
      mobileMenuBtn.setAttribute('aria-expanded', String(!expanded));
      mobileMenu.classList.toggle('open');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (mobileMenu.classList.contains('open') && 
          !mobileMenu.contains(e.target) && 
          !mobileMenuBtn.contains(e.target)) {
        mobileMenu.classList.remove('open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }
  
  // Header scroll effect
  function initHeaderScroll() {
    if (!header) return;
    
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;
      
      if (currentScroll > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
      
      lastScroll = currentScroll;
    });
  }

  // Theme toggle with enhanced animations
  const THEME_KEY = 'portfolio-theme';
  const logoImg = document.getElementById('logo-img');
  
  function applyTheme(theme) {
    if (theme === 'light') {
      root.setAttribute('data-theme', 'light');
      if (themeIcon) {
        themeIcon.style.transform = 'rotate(360deg)';
        themeIcon.textContent = '🌞';
      }
      if (logoImg) {
        logoImg.src = 'img/logo.png';
      }
    } else {
      root.removeAttribute('data-theme');
      if (themeIcon) {
        themeIcon.style.transform = 'rotate(0deg)';
        themeIcon.textContent = '🌙';
      }
      if (logoImg) {
        logoImg.src = 'img/dark-logo.png';
      }
    }
  }

  

  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme) {
    applyTheme(savedTheme);
  } else {
    const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
    applyTheme(prefersLight ? 'light' : 'dark');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isLight = root.getAttribute('data-theme') === 'light';
      const next = isLight ? 'dark' : 'light';
      applyTheme(next);
      localStorage.setItem(THEME_KEY, next);
      
      // Add click effect
      themeToggle.style.transform = 'scale(0.95)';
      setTimeout(() => {
        themeToggle.style.transform = '';
      }, 150);
    });
  }

  // Initialize all interactive features
  function init() {
    hideLoadingScreen();
    initHeaderScroll();
    initTypingEffect();
    initSkillBars();
    initProjectCards();
    initProjectFiltering();
    initSmoothScroll();
    initActiveNavigation();
    initEnhancedForm();
    initParallax();
    initScrollToTop();
    
    // Animate counters after skills are visible
    setTimeout(animateCounters, 2000);
    
    // Animate hero counters after hero section appears (loading screen hides at ~1700ms, hero animates for 900ms, so start at ~2600ms)
    setTimeout(animateHeroCounters, 2600);
  }

  // Start initialization when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

document.dispatchEvent(new Event('themechange'));
