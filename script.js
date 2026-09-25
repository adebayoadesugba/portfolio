/* ==========================================================================
   Alex Rivera — Portfolio interactions
   Stars canvas, hero parallax, typewriter, theme toggle, scroll-zoom about,
   reveal-on-scroll, project grid render, lightbox.
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
    const line1Text = "I Build A.I Powered Software that";
    const subText = "Foundational models meet production engineering. I build custom LLMs, RAG architectures, and AI-powered interfaces that reason in real time.";
    const roles = ['I build A.I Powered Softwares.', 'is Intelligent.', 'react to you.', 'Accelerates your workflow.', 'is alive.'];

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
      typeInto(subEl, subText, 12);
    }

    function roleLoop(index = 0){
      const word = roles[index % roles.length];
      let i = 0;
      const typeSpeed = 65;
      const holdTime = 1500;
      const deleteSpeed = 35;

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
          setTimeout(() => roleLoop(index + 1), 200);
        }
      }
    }

    typeInto(eyebrowEl, eyebrowText, 28, () => {
      typeInto(line1El, line1Text, 32, () => {
        roleLoop(0);
        typeSub();
      });
    });
  })();

  /* ---------------------------------------------------------------------
     4. HERO MOUSE / TOUCH PARALLAX (tilt glow + content toward cursor)
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
      const relX = (clientX - rect.left) / rect.width - 0.5;   // -0.5 to 0.5
      const relY = (clientY - rect.top) / rect.height - 0.5;
      targetX = relX;
      targetY = relY;
      if (!rafId) rafId = requestAnimationFrame(update);
    }

    function update(){
      curX += (targetX - curX) * 0.08;
      curY += (targetY - curY) * 0.08;

      glow.style.transform = `translate(calc(-50% + ${curX * 90}px), calc(-50% + ${curY * 90}px))`;
      content.style.transform = `translate(${curX * -22}px, ${curY * -14}px)`;

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
     5. TWINKLING STARFIELD — canvas, touch/mouse reactive
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
        // twinkle
        const tw = Math.sin(t * s.twinkleSpeed + s.twinklePhase) * 0.5 + 0.5;
        const alpha = s.baseAlpha * (0.35 + tw * 0.65);

        // gentle drift
        s.x += s.driftX + s.vx;
        s.y += s.driftY + s.vy;
        s.vx *= 0.94; s.vy *= 0.94;

        // repel from pointer (mouse or touch)
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

        // wrap around edges
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
     6. SCROLL REVEAL — fade/slide elements with [data-reveal]
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

  /* ---------------------------------------------------------------------
     7. ANIMATED COUNTERS — about stats
  --------------------------------------------------------------------- */
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
     8. CONTACT FORM — validation + mailto submit
     NOTE: This is a static site, so there's no server to send email from.
     On submit it validates the fields, then opens the visitor's email app
     with everything pre-filled. To send silently in the background instead,
     swap the code inside handleSubmit() for a call to a service like
     Formspree, EmailJS or your own backend endpoint.
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
        showStatus('That email address doesn\'t look right.', true);
        return;
      }

      const subject = encodeURIComponent(`New project inquiry from ${name}`);
      const bodyLines = [
        `Name: ${name}`,
        `Email: ${email}`,
        phone ? `Phone: ${phone}` : null,
        '',
        message
      ].filter(Boolean);
      const body = encodeURIComponent(bodyLines.join('\n'));

      showStatus('Opening your email app to send this…', false);
      window.location.href = `mailto:hello@alexrivera.dev?subject=${subject}&body=${body}`;

      setTimeout(() => {
        form.reset();
      }, 600);
    });
  })();

  /* ---------------------------------------------------------------------
     9. PROJECT DATA + GRID RENDER
  --------------------------------------------------------------------- */
  const projects = [
    {
      title: 'Nebula Studio',
      desc: 'A WebGL-driven agency site with a real-time particle hero.',
      stack: ['Three.js', 'React', 'GSAP'],
      img: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=900&auto=format&fit=crop',
      url: '#'
    },
    {
      title: 'Pulse Finance',
      desc: 'Fintech dashboard redesign with animated data storytelling.',
      stack: ['Next.js', 'D3.js', 'Framer Motion'],
      img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=900&auto=format&fit=crop',
      url: '#'
    },
    {
      title: 'Aurora Wearables',
      desc: 'Product launch site with a 3D configurator built in Three.js.',
      stack: ['Three.js', 'WebGL', 'Blender'],
      img: 'https://images.unsplash.com/photo-1526178613658-3f1622045557?q=80&w=900&auto=format&fit=crop',
      url: '#'
    },
    {
      title: 'Faro Records',
      desc: 'Audio-reactive visualizer synced to a label\'s new releases.',
      stack: ['Web Audio API', 'Canvas', 'GLSL'],
      img: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=900&auto=format&fit=crop',
      url: '#'
    },
    {
      title: 'Halo Health',
      desc: 'Accessible design system for a telehealth platform.',
      stack: ['React', 'TypeScript', 'Storybook'],
      img: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=900&auto=format&fit=crop',
      url: '#'
    },
    {
      title: 'Drift Coffee',
      desc: 'Playful e-commerce experience with scroll-triggered motion.',
      stack: ['Shopify', 'GSAP', 'Liquid'],
      img: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=900&auto=format&fit=crop',
      url: '#'
    },
    {
      title: 'Vertex Gaming',
      desc: 'Esports org site with a real-time 3D trophy showcase.',
      stack: ['Three.js', 'Vite', 'Blender'],
      img: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=900&auto=format&fit=crop',
      url: '#'
    },
    {
      title: 'Solace Studio',
      desc: 'Meditation app landing page with ambient generative visuals.',
      stack: ['React', 'Canvas', 'Framer Motion'],
      img: 'https://images.unsplash.com/photo-1483721310020-03333e577078?q=80&w=900&auto=format&fit=crop',
      url: '#'
    }
  ];

  (function projectGridModule(){
    const grid = document.getElementById('projectGrid');
    if (!grid) return;

    grid.innerHTML = projects.map((p, i) => `
      <article class="project-card" data-index="${i}">
        <img src="${p.img}" alt="${p.title} preview" loading="lazy">
        <div class="project-overlay"></div>
        <div class="project-info">
          <h3>${p.title}</h3>
          <p class="project-desc">${p.desc}</p>
          <div class="project-tags">${p.stack.map(s => `<span>${s}</span>`).join('')}</div>
          <a class="project-view" href="${p.url}" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation()">
            View project
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M7 17L17 7M17 7H8M17 7v9"/></svg>
          </a>
        </div>
      </article>
    `).join('');

    // Click card image opens quick preview lightbox
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