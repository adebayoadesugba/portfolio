/* ==========================================================================
   Adebayo Adesugba — Portfolio Interactions
   High-Performance, Zero-Jitter JS Engine
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // 1. Year Injection
  const yearEl = document.getElementById('currentYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------------------------------------------------------------
     2. THEME ENGINE (Dark / Light with system fallback & persistence)
  --------------------------------------------------------------------- */
  (function initThemeEngine() {
    const toggleBtn = document.getElementById('themeToggle');
    const stored = localStorage.getItem('site-theme');
    const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

    if (stored) {
      document.body.setAttribute('data-theme', stored);
    } else if (systemPrefersLight) {
      document.body.setAttribute('data-theme', 'light');
    }

    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        const active = document.body.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
        const next = active === 'light' ? 'dark' : 'light';
        document.body.setAttribute('data-theme', next);
        localStorage.setItem('site-theme', next);
      });
    }
  })();

  /* ---------------------------------------------------------------------
     3. MOBILE DRAWER NAVIGATION
  --------------------------------------------------------------------- */
  (function initMobileDrawer() {
    const burger = document.getElementById('burger');
    const drawer = document.getElementById('mobileDrawer');
    if (!burger || !drawer) return;

    function toggleMenu() {
      const isOpen = drawer.classList.toggle('is-open');
      burger.classList.toggle('is-active', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    }

    burger.addEventListener('click', toggleMenu);
    drawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        drawer.classList.remove('is-open');
        burger.classList.remove('is-active');
        document.body.style.overflow = '';
      });
    });
  })();

  /* ---------------------------------------------------------------------
     4. HERO TYPEWRITER EFFECT
  --------------------------------------------------------------------- */
  (function initHeroTypewriter() {
    const target = document.getElementById('heroTypedText');
    if (!target) return;

    const phrases = [
      'reflect your vision.',
      'drive business growth.',
      'deliver real performance.',
      'scale without friction.'
    ];

    let phraseIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    const typeSpeed = 65;
    const eraseSpeed = 30;
    const holdDelay = 1800;

    function runLoop() {
      const current = phrases[phraseIdx % phrases.length];

      if (isDeleting) {
        charIdx--;
        target.textContent = current.substring(0, charIdx);
      } else {
        charIdx++;
        target.textContent = current.substring(0, charIdx);
      }

      let nextTick = isDeleting ? eraseSpeed : typeSpeed;

      if (!isDeleting && charIdx === current.length) {
        nextTick = holdDelay;
        isDeleting = true;
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        phraseIdx++;
        nextTick = 200;
      }

      setTimeout(runLoop, nextTick);
    }

    runLoop();
  })();

  /* ---------------------------------------------------------------------
     5. DYNAMIC PORTFOLIO RENDERING (Direct Links & Fallback Handling)
  --------------------------------------------------------------------- */
  const projects = [
    {
      title: 'Mood Clothings',
      category: 'E-Commerce / Architecture',
      desc: 'Full-stack retail system with real-time stock sync and Paystack payment processing.',
      date: 'Mar 2026',
      img: 'Images/mood.png',
      url: 'https://moodclothings.com'
    },
    {
      title: 'Aether Script',
      category: 'Digital Editorial',
      desc: 'High-speed publication architecture focusing on modern intelligence and engineering systems.',
      date: 'Feb 2026',
      img: 'Images/aether.png',
      url: 'https://aetherscript.netlify.app/'
    },
    {
      title: 'Modern Blogger',
      category: 'Web Design',
      desc: 'Minimalist headless publication platform with typography-first layouts.',
      date: 'Jan 2026',
      img: 'Images/modern.png',
      url: 'https://themodernblogger.netlify.app/'
    },
    {
      title: 'Zonk Coin Platform',
      category: 'Web3 / Frontend',
      desc: 'Interactive token ecosystem web portal featuring reactive animations and fast RPC loading.',
      date: 'Dec 2025',
      img: 'Images/zonk.png',
      url: 'https://thezonkcoin.netlify.app/'
    },
    {
      title: 'Shophubs Platform',
      category: 'Commerce Design',
      desc: 'Responsive retail storefront engineered for seamless customer checkout journeys.',
      date: 'Nov 2025',
      img: 'Images/shophubs.png',
      url: 'https://myshophubs.netlify.app/'
    },
    {
      title: 'ADR Justice Firm',
      category: 'Corporate Legal',
      desc: 'Elevated law consultancy website with custom form handling and trust-centric UX.',
      date: 'Oct 2025',
      img: 'Images/adr.png',
      url: 'https://adebayoadesugba.github.io/ADR-Justice/'
    },
    {
      title: 'TFC Management',
      category: 'Talent Management',
      desc: 'Connecting clients with top film and music talent via an editorial experience.',
      date: 'Sep 2025',
      img: 'Images/tfc.png',
      url: 'https://adebayoadesugba.github.io/TFC-MANAGEMENT/'
    }
  ];

  (function renderPortfolio() {
    const grid = document.getElementById('projectGrid');
    if (!grid) return;

    // Direct anchor cards ensure seamless clicks on both desktop and mobile
    grid.innerHTML = projects.map((p, idx) => `
      <a href="${p.url}" target="_blank" rel="noopener noreferrer" class="case-card scroll-pop is-visible delay-${(idx % 2) + 1}">
        <div class="case-media">
          <img 
            src="${p.img}" 
            alt="${p.title}" 
            loading="lazy" 
            onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=900&auto=format&fit=crop';"
          >
          <span class="case-explore-badge">Visit Site &rarr;</span>
        </div>
        <div class="case-info">
          <div class="case-meta">
            <span>${p.category}</span>
            <span>${p.date}</span>
          </div>
          <h3 class="case-title">${p.title}</h3>
          <p class="case-desc">${p.desc}</p>
        </div>
      </a>
    `).join('');
  })();

  /* ---------------------------------------------------------------------
     6. SCROLL POP & OBSERVER SYSTEM
  --------------------------------------------------------------------- */
  (function initScrollObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -30px 0px'
    });

    document.querySelectorAll('.scroll-pop').forEach(el => observer.observe(el));
  })();

  /* ---------------------------------------------------------------------
     7. 4-BOX 10-LOGO ROTATION (Exact 5-Second Interval)
  --------------------------------------------------------------------- */
  (function initBrandRotation() {
    const brandLogos = [
      'DAYSHIFT',
      'FORTEM PROJECTS',
      'L A V O',
      'X + O STUDIO',
      'DUNE DUBAI',
      'AETHER SCRIPT',
      'ZONK LABS',
      'SHOPHUBS',
      'ADR FIRM',
      'TFC MEDIA'
    ];

    let nextQueueIdx = 4;
    let targetBoxIdx = 0;

    const boxes = [
      document.getElementById('brandBox0'),
      document.getElementById('brandBox1'),
      document.getElementById('brandBox2'),
      document.getElementById('brandBox3')
    ];

    function rotateBox() {
      const box = boxes[targetBoxIdx];
      if (!box) return;

      // 1. Smooth fade out
      box.classList.remove('fade-in');
      box.classList.add('fade-out');

      setTimeout(() => {
        // 2. Swap brand text from 10-logo pool
        const nextBrand = brandLogos[nextQueueIdx % brandLogos.length];
        box.innerHTML = `<span class="brand-name">${nextBrand}</span>`;

        // 3. Drop in with fade-in animation
        box.classList.remove('fade-out');
        box.classList.add('fade-in');

        // Increment target & queue
        nextQueueIdx = (nextQueueIdx + 1) % brandLogos.length;
        targetBoxIdx = (targetBoxIdx + 1) % 4;
      }, 450);
    }

    setInterval(rotateBox, 5000);
  })();

  /* ---------------------------------------------------------------------
     8. NUMERICAL STAT COUNTERS
  --------------------------------------------------------------------- */
  (function initStatCounters() {
    const stats = document.querySelectorAll('.stat-val');
    if (!stats.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = parseInt(entry.target.dataset.target, 10);
          let current = 0;
          const step = Math.ceil(target / 30) || 1;

          const timer = setInterval(() => {
            current += step;
            if (current >= target) {
              entry.target.textContent = target;
              clearInterval(timer);
            } else {
              entry.target.textContent = current;
            }
          }, 35);

          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    stats.forEach(s => observer.observe(s));
  })();

  /* ---------------------------------------------------------------------
     9. EDITORIAL CONTACT FORM
  --------------------------------------------------------------------- */
  (function initContactForm() {
    const form = document.getElementById('contactForm');
    const status = document.getElementById('formStatus');
    const submitBtn = document.getElementById('submitBtn');
    if (!form || !submitBtn) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      submitBtn.disabled = true;
      const originalText = submitBtn.querySelector('span').textContent;
      submitBtn.querySelector('span').textContent = 'SENDING...';

      try {
        const response = await fetch(form.action, {
          method: form.method,
          body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          status.className = 'form-feedback';
          status.textContent = 'Thank you! Your message has been sent successfully.';
          form.reset();
        } else {
          status.className = 'form-feedback error';
          status.textContent = 'Oops! There was a problem submitting your message.';
        }
      } catch (err) {
        status.className = 'form-feedback error';
        status.textContent = 'Network error. Please try again later.';
      } finally {
        submitBtn.disabled = false;
        submitBtn.querySelector('span').textContent = originalText;
      }
    });
  })();
});