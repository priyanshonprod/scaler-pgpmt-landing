// ===== SCALER PGPMT — LANDING PAGE JS (v4) =====


// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

  // Trigger hero elements immediately
  setTimeout(() => {
    document.querySelectorAll('#hero .fade-in').forEach(el => el.classList.add('visible'));
  }, 100);
}

// ===== HEADER SCROLL =====
function initHeader() {
  window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    if (window.scrollY > 80) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

// ===== SECTION NAVIGATOR =====
function initSectionNav() {
  const nav = document.getElementById('section-nav');
  if (!nav) return;

  const navItems = nav.querySelectorAll('.nav-item');
  const sections = [];

  navItems.forEach(item => {
    const href = item.getAttribute('href');
    if (href && href.startsWith('#')) {
      const section = document.getElementById(href.slice(1));
      if (section) sections.push({ el: section, link: item });
    }
  });

  // Highlight active section on scroll
  let scrollTimeout;
  window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      const scrollY = window.scrollY + 120;
      let current = sections[0];
      for (const s of sections) {
        if (s.el.offsetTop <= scrollY) current = s;
      }
      navItems.forEach(item => item.classList.remove('active'));
      if (current) current.link.classList.add('active');

      // Show nav only after scrolling past the hero
      const heroSection = document.getElementById('hero');
      const heroBottom = heroSection ? heroSection.offsetTop + heroSection.offsetHeight : 600;
      if (window.scrollY > heroBottom - 100) {
        nav.classList.add('visible');
      } else {
        nav.classList.remove('visible');
      }
    }, 50);
  });

  // Smooth scroll on click
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const href = item.getAttribute('href');
      const target = document.querySelector(href);
      if (target) {
        const offset = 120; // header + nav height
        const top = target.offsetTop - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

// ===== COUNTDOWN TIMER =====
function initCountdown() {
  function update() {
    const target = new Date('2026-06-01T23:59:59');
    const now = new Date();
    const diff = target - now;

    if (diff <= 0) {
      ['cd-days', 'cd-hours', 'cd-mins'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = '00';
      });
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    const dEl = document.getElementById('cd-days');
    const hEl = document.getElementById('cd-hours');
    const mEl = document.getElementById('cd-mins');
    if (dEl) dEl.textContent = String(days).padStart(2, '0');
    if (hEl) hEl.textContent = String(hours).padStart(2, '0');
    if (mEl) mEl.textContent = String(mins).padStart(2, '0');
  }

  update();
  setInterval(update, 60000);
}

// ===== FAQ ACCORDION =====
function initFAQ() {
  document.querySelectorAll('.faq-q').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.parentElement;
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
}

// ===== CURRICULUM ACCORDION =====
function initCurriculum() {
  document.querySelectorAll('.phase-header').forEach(h => {
    h.addEventListener('click', () => {
      const phase = h.parentElement;
      const isOpen = phase.classList.contains('open');
      document.querySelectorAll('.phase').forEach(p => p.classList.remove('open'));
      if (!isOpen) phase.classList.add('open');
    });
  });
}

// ===== MODAL =====
function openModal(type) {
  const modal = document.getElementById('modal');
  const eyebrow = document.getElementById('modal-eyebrow');
  const title = document.getElementById('modal-title');
  const sub = document.getElementById('modal-sub');
  const submitBtn = document.getElementById('modal-submit-btn');
  const formWrap = document.getElementById('modal-form-wrap');
  const success = document.getElementById('modal-success');

  formWrap.style.display = 'block';
  success.style.display = 'none';

  if (type === 'apply') {
    eyebrow.textContent = 'Cohort 2 — Apply Now';
    title.textContent = 'Reserve Your Seat';
    sub.textContent = 'Submit 4 fields. A counselor reaches out within 48 hours — to answer questions, not to push you.';
    submitBtn.textContent = 'Submit Application';
  } else if (type === 'curriculum') {
    eyebrow.textContent = 'Curriculum';
    title.textContent = 'Download the Full Curriculum';
    sub.textContent = '48 pages. Complete module breakdown, schedule, and faculty overview.';
    submitBtn.textContent = 'Send Me the Curriculum';
  } else {
    eyebrow.textContent = 'Program Guide';
    title.textContent = 'Download the Program Guide';
    sub.textContent = "48 pages. No commitment. We'll deliver it instantly — and a counselor will reach out within 48 hours.";
    submitBtn.textContent = 'Send Me the Program Guide';
  }

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modal').classList.remove('open');
  document.body.style.overflow = '';
}

function initModal() {
  const modal = document.getElementById('modal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  const form = document.querySelector('#modal form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      document.getElementById('modal-form-wrap').style.display = 'none';
      document.getElementById('modal-success').style.display = 'block';
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-modal]');
    if (trigger) {
      e.preventDefault();
      openModal(trigger.dataset.modal);
    }
  });
}

// ===== ANIMATED COUNTERS =====
function initCounters() {
  const counters = document.querySelectorAll('.counter');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
        entry.target.classList.add('counted');
        const target = parseFloat(entry.target.dataset.target);
        const suffix = entry.target.dataset.suffix || '';
        const prefix = entry.target.dataset.prefix || '';
        const decimals = (target % 1 !== 0) ? 1 : 0;
        const duration = 2000;
        const startTime = performance.now();

        function update(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = target * eased;
          entry.target.textContent = prefix + current.toFixed(decimals) + suffix;
          if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

// ===== ROI CALCULATOR =====
function initROICalculator() {
  const slider = document.getElementById('ctc-slider');
  if (!slider) return;

  const ctcDisplay = document.getElementById('ctc-display');
  const premiumDisplay = document.getElementById('premium-display');
  const paybackDisplay = document.getElementById('payback-display');
  const gainDisplay = document.getElementById('five-year-gain');
  const paybackBar = document.getElementById('payback-bar');

  function calculate() {
    const ctc = parseInt(slider.value);
    const premium = ctc * 0.4;
    const programFee = 325000;
    const paybackMonths = Math.ceil(programFee / (premium / 12));
    const fiveYearGain = (premium * 5) - programFee;

    if (ctcDisplay) ctcDisplay.textContent = '₹' + (ctc / 100000).toFixed(0) + 'L';
    if (premiumDisplay) premiumDisplay.textContent = '₹' + (premium / 100000).toFixed(1) + 'L/yr';
    if (paybackDisplay) paybackDisplay.textContent = paybackMonths + ' mo';
    if (gainDisplay) gainDisplay.textContent = '₹' + (fiveYearGain / 100000).toFixed(1) + 'L';

    if (paybackBar) {
      const pct = Math.min((paybackMonths / 12) * 100, 100);
      paybackBar.style.width = pct + '%';
    }

    const pct = ((ctc - 1000000) / (6000000 - 1000000)) * 100;
    slider.style.background = `linear-gradient(to right, #0055FF ${pct}%, #D7DDE8 ${pct}%)`;
  }

  slider.addEventListener('input', calculate);
  calculate();
}

// ===== ROI SKILLS GRAPH =====
function initROISkills() {
  const bars = document.querySelectorAll('.roi-skill-fill');
  if (!bars.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fills = entry.target.querySelectorAll('.roi-skill-fill');
        fills.forEach((fill, i) => {
          setTimeout(() => {
            fill.style.width = fill.dataset.width + '%';
          }, i * 150);
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  const container = document.querySelector('.roi-skills');
  if (container) observer.observe(container);
}

// ===== WALL OF PROBLEMS =====
function initWallOfProblems() {
  const tabs = document.querySelectorAll('.problem-tab');
  const panels = document.querySelectorAll('.problem-panel');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const target = document.getElementById(tab.dataset.target);
      if (target) target.classList.add('active');
    });
  });

  if (tabs[0] && !document.querySelector('.problem-tab.active')) {
    tabs[0].click();
  }
}

// ===== INTERACTIVE BROCHURE CAROUSEL =====
function initBrochureCarousel() {
  const track = document.getElementById('brochure-track');
  const dots = document.querySelectorAll('.brochure-dot');
  const prev = document.getElementById('brochure-prev');
  const next = document.getElementById('brochure-next');
  if (!track) return;

  let currentSlide = 0;
  const totalSlides = dots.length;

  function goTo(index) {
    currentSlide = Math.max(0, Math.min(index, totalSlides - 1));
    const card = track.children[currentSlide];
    if (card) {
      track.scrollTo({ left: card.offsetLeft - track.offsetLeft, behavior: 'smooth' });
    }
    dots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));
  }

  if (prev) prev.addEventListener('click', () => goTo(currentSlide - 1));
  if (next) next.addEventListener('click', () => goTo(currentSlide + 1));
  dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));
}

// ===== AI TOOLS BY FUNCTION =====
function initToolsGrid() {
  const pills = document.querySelectorAll('.function-pill');
  const details = document.querySelectorAll('.function-detail');
  if (!pills.length) return;

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      const isActive = pill.classList.contains('active');
      pills.forEach(p => p.classList.remove('active'));
      details.forEach(d => { d.style.maxHeight = '0'; d.classList.remove('active'); });
      if (!isActive) {
        pill.classList.add('active');
        const target = document.getElementById(pill.dataset.function);
        if (target) {
          target.classList.add('active');
          target.style.maxHeight = target.scrollHeight + 'px';
        }
      }
    });
  });
}

// ===== MASTERCLASS REGISTRATION =====
function initMCForm() {
  const btn = document.getElementById('mc-submit');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const form = document.getElementById('mc-form');
    const inputs = form.querySelectorAll('.mc-input');
    let valid = true;
    inputs.forEach(inp => {
      if (!inp.value.trim()) {
        valid = false;
        inp.style.border = '1px solid #EF4444';
      } else {
        inp.style.border = 'none';
      }
    });

    if (valid) {
      const success = document.getElementById('mc-success');
      if (success) {
        success.style.display = 'block';
        btn.textContent = 'Registered!';
        btn.disabled = true;
        btn.style.opacity = '0.6';
      }
    }
  });
}

// ===== MOBILE STICKY BAR =====
function initMobileStickyBar() {
  const bar = document.getElementById('mobile-sticky-bar');
  const hero = document.getElementById('hero');
  const footer = document.getElementById('footer');
  if (!bar || !hero) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.target === hero) {
        bar.classList.toggle('visible', !entry.isIntersecting);
      }
      if (entry.target === footer && entry.isIntersecting) {
        bar.classList.remove('visible');
      }
    });
  }, { threshold: 0 });

  observer.observe(hero);
  if (footer) observer.observe(footer);
}

// ===== VIDEO PLACEHOLDERS =====
function initVideoPlaceholders() {
  document.querySelectorAll('.video-placeholder').forEach(v => {
    v.addEventListener('click', () => {
      if (!v.classList.contains('clicked')) {
        v.classList.add('clicked');
        // In production: embed actual YouTube/Vimeo iframe here
      }
    });
  });
}

// ===== INIT ALL =====
// Note: initConstellation, initCareerTool, initAnnotationToggle are handled
// by inline IIFEs in index.html — do not duplicate here.
document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
  initHeader();
  initSectionNav();
  initCountdown();
  initFAQ();
  initCurriculum();
  initModal();
  initCounters();
  initBrochureCarousel();
  initToolsGrid();
  initMCForm();
  initMobileStickyBar();
  initVideoPlaceholders();
});
