// =============================================
// PRANA HEALTH INTELLIGENCE — Main JS
// =============================================

document.addEventListener('DOMContentLoaded', () => {

  // ---- Navbar scroll state ----
  const navbar = document.getElementById('navbar');
  const handleScroll = () => {
    if (window.scrollY > 40) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  };
  window.addEventListener('scroll', handleScroll, { passive: true });

  // ---- Language Toggle Logic ----
  const langToggle = document.getElementById('lang-toggle');
  let currentLang = 'en';

  const updateLanguage = (lang) => {
    document.documentElement.setAttribute('lang', lang);
    const translatable = document.querySelectorAll('[data-en]');
    
    translatable.forEach(el => {
      el.textContent = el.getAttribute(`data-${lang}`);
    });

    // Update Toggle UI
    const spans = langToggle.querySelectorAll('span:not(.divider)');
    if (lang === 'en') {
      spans[0].classList.add('active');
      spans[1].classList.remove('active');
    } else {
      spans[0].classList.remove('active');
      spans[1].classList.add('active');
    }

    // Custom Micro-copy for Loading
    const pulseText = document.querySelector('.pulse-text');
    if (pulseText) {
      if (lang === 'hi') {
        pulseText.innerHTML = 'प्राण-शक्ति को संतुलित किया जा रहा है...<br/><span>लाइफ-मैप अपडेट</span>';
      } else {
        pulseText.innerHTML = 'Synchronizing Vitality...<br/><span>Mapping your Vitality</span>';
      }
    }
  };

  langToggle.addEventListener('click', () => {
    currentLang = currentLang === 'en' ? 'hi' : 'en';
    updateLanguage(currentLang);
  });

  // ---- Mobile hamburger ----
  const hamburger = document.getElementById('nav-hamburger');
  const navLinks = document.getElementById('nav-links');
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    hamburger.classList.toggle('active');
  });

  // Close nav on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('active');
    });
  });

  // ---- Particle Canvas ----
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animFrame;

  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.radius = Math.random() * 1.5 + 0.5;
      this.alpha = Math.random() * 0.5 + 0.1;
      this.color = Math.random() > 0.5 ? '0, 229, 204' : '108, 99, 255';
      this.life = 0;
      this.maxLife = Math.random() * 300 + 200;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.life++;
      if (this.life > this.maxLife || this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
        this.reset();
      }
    }
    draw() {
      const progress = this.life / this.maxLife;
      const a = this.alpha * Math.sin(progress * Math.PI);
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color}, ${a})`;
      ctx.fill();
    }
  }

  // Create particles
  for (let i = 0; i < 80; i++) particles.push(new Particle());

  // Draw connecting lines
  const drawLines = () => {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          const alpha = (1 - dist / 100) * 0.08;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 229, 204, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  };

  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    animFrame = requestAnimationFrame(animate);
  };
  animate();

  // ---- Scroll Reveal ----
  const revealEls = document.querySelectorAll([
    '.problem-card', '.module-card', '.price-card',
    '.tech-card', '.safety-item', '.roadmap-phase',
    '.section-title', '.section-sub', '.section-badge',
    '.hero-badge', '.hero-stats'
  ].join(', '));

  revealEls.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, 60 * (Array.from(revealEls).indexOf(entry.target) % 5));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => observer.observe(el));

  // ---- Phone module chip interaction ----
  const chips = document.querySelectorAll('.module-chip');
  const visionPulse = document.getElementById('vision-pulse');
  
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      
      // Trigger Pulse loading for Vision-instruct models
      if (chip.id === 'chip-records' || chip.id === 'chip-scan') {
        visionPulse.classList.add('active');
        setTimeout(() => {
          visionPulse.classList.remove('active');
        }, 2500);
      }
    });
  });

  // ---- Waitlist Form ----
  const form = document.getElementById('waitlist-form');
  const successMsg = document.getElementById('wl-success');
  const submitBtn = document.getElementById('wl-submit-btn');
  const btnText = document.getElementById('wl-btn-text');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('wl-name').value.trim();
    const email = document.getElementById('wl-email').value.trim();

    if (!name) {
      shake(document.getElementById('wl-name'));
      return;
    }

    if (!email || !isValidEmail(email)) {
      shake(document.getElementById('wl-email'));
      return;
    }

    // Simulate submission
    btnText.textContent = 'Reserving...';
    submitBtn.disabled = true;

    setTimeout(() => {
      form.style.display = 'none';
      successMsg.style.display = 'block';

      // Store in localStorage for demo
      const waitlisters = JSON.parse(localStorage.getItem('prana_waitlist') || '[]');
      waitlisters.push({
        name,
        email,
        phone: document.getElementById('wl-phone').value,
        tier: document.getElementById('wl-tier').value,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('prana_waitlist', JSON.stringify(waitlisters));
    }, 1800);
  });

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function shake(el) {
    el.style.animation = 'none';
    el.offsetHeight; // reflow
    el.style.animation = 'shake 0.4s ease';
    el.style.borderColor = 'rgba(255,77,109,0.5)';
    setTimeout(() => { el.style.borderColor = ''; }, 2000);
  }

  // Inject shake keyframe
  const shakeStyle = document.createElement('style');
  shakeStyle.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20% { transform: translateX(-6px); }
      40% { transform: translateX(6px); }
      60% { transform: translateX(-4px); }
      80% { transform: translateX(4px); }
    }
  `;
  document.head.appendChild(shakeStyle);

  // ---- Smooth anchor scroll ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ---- Biomarker bar animation ----
  const bioFills = document.querySelectorAll('.bm-fill');
  const bioObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.width = entry.target.style.width || '0%';
        bioObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  bioFills.forEach(el => {
    const targetWidth = el.style.width;
    el.style.width = '0%';
    setTimeout(() => bioObserver.observe(el), 300);
    el.addEventListener('transitionend', () => {}, { once: true });

    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        el.style.width = targetWidth;
        io.disconnect();
      }
    }, { threshold: 0.3 });
    io.observe(el);
  });

  // ---- Pricing card hover glow ----
  document.querySelectorAll('.price-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.boxShadow = '0 20px 60px rgba(0,229,204,0.1), 0 0 0 1px rgba(0,229,204,0.15)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.boxShadow = '';
    });
  });

  // ---- Typing animation for hero title ----
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    heroTitle.style.opacity = '0';
    heroTitle.style.transform = 'translateY(20px)';
    setTimeout(() => {
      heroTitle.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      heroTitle.style.opacity = '1';
      heroTitle.style.transform = 'translateY(0)';
    }, 200);
  }

  // ---- Module card interactive tabs ----
  const moduleCards = document.querySelectorAll('.module-card');
  moduleCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      const num = card.querySelector('.module-number');
      if (num) num.style.color = 'rgba(0,229,204,0.08)';
    });
    card.addEventListener('mouseleave', () => {
      const num = card.querySelector('.module-number');
      if (num) num.style.color = 'rgba(255,255,255,0.05)';
    });
  });

  // ---- Console welcome ----
  console.log('%c🌿 Prana Health Intelligence', 'color:#00E5CC;font-size:20px;font-weight:900;font-family:Outfit');
  console.log('%cHealth OS · Privacy-First · Built on Open Source AI', 'color:#6C63FF;font-size:13px');
  console.log('%c© 2026 Prana Health Intelligence Pvt. Ltd. · Designed by EyE PunE', 'color:#ffffff40;font-size:11px');
});
