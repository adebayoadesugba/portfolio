/* ==========================================================================
   Adebayo Adesugba — Portfolio interactions
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------------------------------------------------------------------
     1. THEME TOGGLE (dark / light, persisted)
  --------------------------------------------------------------------- */
  (function themeModule(){
    const root = document.body;
    const btn = document.getElementById('themeToggle');
    const stored = localStorage.getItem('ar-theme');
    const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

    if (stored) {
      root.setAttribute('data-theme', stored);
    } else if (prefersLight) {
      root.setAttribute('data-theme', 'light');
    }

    btn.addEventListener('click', () => {
      const current = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      const next = current === 'light' ? 'dark' : 'light';
      root.setAttribute('data-theme', next);
      localStorage.setItem('ar-theme', next);
    });
  })();

  /* ---------------------------------------------------------------------
     2. NAV: scroll shadow + mobile menu
  --------------------------------------------------------------------- */
  (function navModule(){
    const nav = document.getElementById('siteNav');
    const burger = document.getElementById('burger');
    const mobileMenu = document.getElementById('mobileMenu');

    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 30);
    }, { passive: true });

    function closeMenu(){
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      mobileMenu.classList.remove('open');
    }

    burger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      burger.classList.toggle('open', isOpen);
      burger.setAttribute('aria-expanded', String(isOpen));
    });

    document.querySelectorAll('[data-nav]').forEach(link => {
      link.addEventListener('click', closeMenu);
    });
  })();

  /* ---------------------------------------------------------------------
     3. TYPEWRITER — hero eyebrow, line 1, role cycling, subtitle
  --------------------------------------------------------------------- */
  (function typewriterModule(){
    const eyebrowEl = document.getElementById('heroEyebrow');
    const line1El = document.getElementById('heroLine1');
    const typedEl = document.getElementById('typedText');
    const subEl = document.getElementById('heroSub');

    const eyebrowText = "Hey, I'm Adebayo Adesugba";
    const line1Text = "Engineering AI systems that";
    const subText = "Bridge frontier models and production software. I build autonomous AI agents, enterprise RAG systems, and robust web applications designed to perform reliably at scale.";
    
    // Grammatically sound endings to "Engineering AI systems that..."
    const roles = [
      'think in real time.',
      'scale without friction.',
      'reason and automate.',
      'drive business impact.'
    ];

    if (prefersReducedMotion) {
      eyebrowEl.textContent = eyebrowText;
      line1El.textContent = line1Text;
      typedEl.textContent = roles[0];
      subEl.textContent = subText;
      return;
    }

    function typeInto(el, text, speed, callback){
      let i = 0;
      (function step(){
        if (i <= text.length){
          el.textContent = text.slice(0, i);
          i++;
          setTimeout(step, speed);
        } else if (callback) callback();
      })();
    }

    function typeSub(){
      typeInto(subEl, subText, 14);
    }

    function roleLoop(index = 0){
      const word = roles[index % roles.length];
      let i = 0;
      const typeSpeed = 60;
      const holdTime = 1800;
      const deleteSpeed = 30;

      (function typeStep(){
        if (i <= word.length){
          typedEl.textContent = word.slice(0, i);
          i++;
          setTimeout(typeStep, typeSpeed);
        } else {
          setTimeout(deleteStep, holdTime);
        }
      })();

      function deleteStep(){
        if (i >= 0){
          typedEl.textContent = word.slice(0, i);
          i--;
          setTimeout(deleteStep, deleteSpeed);
        } else {
          setTimeout(() => roleLoop(index + 1), 220);
        }
      }
    }

    typeInto(eyebrowEl, eyebrowText, 25, () => {
      typeInto(line1El, line1Text, 28, () => {
        roleLoop(0);
        typeSub();
      });
    });
  })();

  /* ---------------------------------------------------------------------
     4. HERO MOUSE / TOUCH PARALLAX
  --------------------------------------------------------------------- */
  (function heroParallaxModule(){
    const hero = document.getElementById('hero');
    const glow = document.getElementById('heroGlow');
    const content = document.getElementById('heroContent');
    if (prefersReducedMotion) return;

    let targetX = 0, targetY = 0, curX = 0, curY = 0;
    let rafId = null;

    function onMove(clientX, clientY){
      const rect = hero.getBoundingClientRect();
      const relX = (clientX - rect.left) / rect.width - 0.5;
      const relY = (clientY - rect.top) / rect.height - 0.5;
      targetX = relX;
      targetY = relY;
      if (!rafId) rafId = requestAnimationFrame(update);
    }

    function update(){
      curX += (targetX - curX) * 0.08;
      curY += (targetY - curY) * 0.08;

      glow.style.transform = `translate(calc(-50% + ${curX * 90}px), calc(-50% + ${curY * 90}px))`;
      content.style.transform = `translate(${curX * -18}px, ${curY * -12}px)`;

      if (Math.abs(targetX - curX) > 0.001 || Math.abs(targetY - curY) > 0.001){
        rafId = requestAnimationFrame(update);
      } else {
        rafId = null;
      }
    }

    hero.addEventListener('mousemove', (e) => onMove(e.clientX, e.clientY));
    hero.addEventListener('mouseleave', () => { targetX = 0; targetY = 0; if(!rafId) rafId = requestAnimationFrame(update); });
    hero.addEventListener('touchmove', (e) => {
      if (e.touches[0]) onMove(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });
  })();

  /* ---------------------------------------------------------------------
     5. STARFIELD CANVAS
  --------------------------------------------------------------------- */
  (function starfieldModule(){
    const canvas = document.getElementById('starCanvas');
    const ctx = canvas.getContext('2d');
    const hero = document.getElementById('hero');
    let stars = [];
    let w, h, dpr;
    let pointer = { x: -9999, y: -9999, active: false };

    function resize(){
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = hero.clientWidth;
      h = hero.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seedStars();
    }

    function seedStars(){
      const density = (w * h) / 9000;
      const count = Math.max(50, Math.min(180, Math.round(density)));
      stars = new Array(count).fill(0).map(() => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.4 + 0.4,
        baseAlpha: Math.random() * 0.6 + 0.25,
        twinkleSpeed: Math.random() * 0.02 + 0.006,
        twinklePhase: Math.random() * Math.PI * 2,
        driftX: (Math.random() - 0.5) * 0.06,
        driftY: (Math.random() - 0.5) * 0.06,
        vx: 0,
        vy: 0
      }));
    }

    function getStarColor(){
      const theme = document.body.getAttribute('data-theme');
      return theme === 'light' ? '20,25,50' : '255,255,255';
    }

    function draw(t){
      ctx.clearRect(0, 0, w, h);
      const rgb = getStarColor();

      for (const s of stars){
        const tw = Math.sin(t * s.twinkleSpeed + s.twinklePhase) * 0.5 + 0.5;
        const alpha = s.baseAlpha * (0.35 + tw * 0.65);

        s.x += s.driftX + s.vx;
        s.y += s.driftY + s.vy;
        s.vx *= 0.94; s.vy *= 0.94;

        if (pointer.active){
          const dx = s.x - pointer.x;
          const dy = s.y - pointer.y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          const radius = 130;
          if (dist < radius && dist > 0.001){
            const force = (1 - dist / radius) * 1.6;
            s.vx += (dx / dist) * force;
            s.vy += (dy / dist) * force;
          }
        }

        if (s.x < -10) s.x = w + 10;
        if (s.x > w + 10) s.x = -10;
        if (s.y < -10) s.y = h + 10;
        if (s.y > h + 10) s.y = -10;

        ctx.beginPath();
        ctx.fillStyle = `rgba(${rgb},${alpha})`;
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }

      requestAnimationFrame(draw);
    }

    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = true;
    });
    hero.addEventListener('mouseleave', () => { pointer.active = false; });

    hero.addEventListener('touchstart', handleTouch, { passive: true });
    hero.addEventListener('touchmove', handleTouch, { passive: true });
    hero.addEventListener('touchend', () => { pointer.active = false; });

    function handleTouch(e){
      const rect = hero.getBoundingClientRect();
      const touch = e.touches[0];
      if (!touch) return;
      pointer.x = touch.clientX - rect.left;
      pointer.y = touch.clientY - rect.top;
      pointer.active = true;
    }

    window.addEventListener('resize', resize);
    resize();
    requestAnimationFrame(draw);
  })();

  /* ---------------------------------------------------------------------
     6. SCROLL REVEAL & STATS COUNTER
  --------------------------------------------------------------------- */
  (function revealModule(){
    const items = document.querySelectorAll('[data-reveal]');
    if (!items.length) return;

    if (prefersReducedMotion){
      items.forEach(el => el.classList.add('in-view'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting){
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    items.forEach(el => observer.observe(el));
  })();

  (function countersModule(){
    const nums = document.querySelectorAll('.stat-num');
    if (!nums.length) return;

    function animateNum(el){
      const target = parseInt(el.dataset.count, 10);
      const duration = 1400;
      const start = performance.now();

      function step(now){
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting){
          animateNum(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    nums.forEach(el => observer.observe(el));
  })();

  /* ---------------------------------------------------------------------
     7. CONTACT FORM
  --------------------------------------------------------------------- */
  (function contactFormModule(){
    const form = document.getElementById('contactForm');
    if (!form) return;

    const status = document.getElementById('formStatus');
    const nameEl = document.getElementById('cfName');
    const emailEl = document.getElementById('cfEmail');
    const phoneEl = document.getElementById('cfPhone');
    const messageEl = document.getElementById('cfMessage');

    function isValidEmail(value){
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    function showStatus(message, isError){
      status.textContent = message;
      status.classList.toggle('error', !!isError);
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = nameEl.value.trim();
      const email = emailEl.value.trim();
      const phone = phoneEl.value.trim();
      const message = messageEl.value.trim();

      if (!name || !email || !message){
        showStatus('Please fill in your name, email and message.', true);
        return;
      }
      if (!isValidEmail(email)){
        showStatus('Please enter a valid email address.', true);
        return;
      }

      const subject = encodeURIComponent(`Project Inquiry from ${name}`);
      const bodyLines = [
        `Name: ${name}`,
        `Email: ${email}`,
        phone ? `Phone: ${phone}` : null,
        '',
        message
      ].filter(Boolean);
      const body = encodeURIComponent(bodyLines.join('\n'));

      showStatus('Redirecting to your mail client...', false);
      window.location.href = `mailto:hello@alexrivera.dev?subject=${subject}&body=${body}`;

      setTimeout(() => form.reset(), 600);
    });
  })();

  /* ---------------------------------------------------------------------
     8. PROJECTS DATA & DYNAMIC GRID RENDER
  --------------------------------------------------------------------- */
  const projects = [
    {
      title: 'Mood Clothings',
      desc: 'Full-stack e-commerce web platform engineered for real-time inventory management and seamless checkout flows.',
      stack: ['M.E.R.N'],
      img: 'Images/mood.png',
      url: 'https://moodclothings.com'
    },
    {
      title: 'Aether Script',
      desc: 'Technical publication platform centered on cutting-edge AI breakthroughs, agentic architectures, and modern web systems.',
      stack: ['TypeScript',],
      img: 'Images/aether.png',
      url: 'https://aetherscript.netlify.app/'
    },
    {
      title: 'Modern Blog',
      desc: 'High-performance headless blog architecture featuring responsive layouts, semantic search, and fluid transitions.',
      stack: [],
      img: 'Images/modern.png',
      url: 'https://themodernblogger.netlify.app/'
    },
    {
      title: 'Zonk Coin',
      desc: 'A community-powered token built for fun, utility, and innovation.',
      stack: ['React'],
      img: 'Images/zonk.png',
      url: 'https://thezonkcoin.netlify.app/'
    },
    {
      title: 'Shophubs Ecommerce',
      desc: 'A modern e-commerce platform designed for seamless shopping experiences and efficient inventory management.',
      stack: [],
      img: 'Images/shophubs.png',
      url: 'https://myshophubs.netlify.app/'
    },
    {
      title: 'ADR Justice Firm',
      desc: 'A responsive law firm website with interactive elements, smooth animations, and a clean, professional design.',
      stack: [],
      img: 'Images/adr.png',
      url: 'https://adebayoadesugba.github.io/ADR-Justice/'
    },
    {
      title: 'TFC Management',
      desc: 'Specialize in connecting you with your favorite movie stars and music artists',
      stack: [],
      img: 'Images/tfc.png',
      url: 'https://adebayoadesugba.github.io/TFC-MANAGEMENT/'
    },
    {
      title: 'Solace Generative Visuals',
      desc: 'Ambient wellness application featuring calm, procedural particle generators and mindful soundscapes.',
      stack: ['React', 'Framer Motion', 'HTML5 Canvas'],
      img: 'https://images.unsplash.com/photo-1483721310020-03333e577078?q=80&w=900&auto=format&fit=crop',
      url: '#'
    }
  ];

  (function projectGridModule(){
    const grid = document.getElementById('projectGrid');
    if (!grid) return;

    grid.innerHTML = projects.map((p, i) => `
      <article class="project-card" data-index="${i}">
        <img src="${p.img}" alt="${p.title}" loading="lazy">
        <div class="project-overlay"></div>
        <div class="project-info">
          <h3>${p.title}</h3>
          <p class="project-desc">${p.desc}</p>
          <div class="project-tags">${p.stack.map(s => `<span>${s}</span>`).join('')}</div>
          <a class="project-view" href="${p.url}" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation()">
            View Project
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M7 17L17 7M17 7H8M17 7v9"/></svg>
          </a>
        </div>
      </article>
    `).join('');

    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.getElementById('lightboxClose');

    grid.querySelectorAll('.project-card img').forEach((img, i) => {
      img.addEventListener('click', () => {
        lightboxImg.src = projects[i].img;
        lightboxImg.alt = projects[i].title;
        lightbox.classList.add('open');
      });
    });

    function closeLightbox(){ lightbox.classList.remove('open'); }
    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });
  })();

});