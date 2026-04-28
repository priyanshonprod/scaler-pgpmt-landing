// =========================================================
// Scaler PGPMT v2 — Interactions
// =========================================================

// ---------- House of Scaler: stacked-deck scroll effect ----------
// As each card scrolls under the next sticky card, it gets a subtle
// scale-down + opacity dim, so the topmost card always feels frontmost.
(function () {
  const cards = document.querySelectorAll('.hos-card');
  if (!cards.length) return;

  const update = () => {
    const vh = window.innerHeight;
    cards.forEach((card, i) => {
      const rect = card.getBoundingClientRect();
      const stickyTop = 80 + i * 16; // matches CSS

      // distance the card has scrolled past its pinned position
      const overlap = stickyTop - rect.top;

      if (overlap > 0) {
        // start dimming + scaling once card is being covered
        const progress = Math.min(overlap / (vh * 0.6), 1);
        const scale = 1 - progress * 0.04;     // up to -4%
        const opacity = 1 - progress * 0.25;   // up to -25%
        card.style.transform = `scale(${scale})`;
        card.style.opacity = opacity.toFixed(3);
      } else {
        card.style.transform = '';
        card.style.opacity = '';
      }
    });
  };

  let raf = null;
  const onScroll = () => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = null;
      update();
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
})();


// ---------- Curriculum tab switcher ----------
(function () {
  const tabs = document.querySelectorAll('.curriculum__tab');
  const panels = document.querySelectorAll('.curriculum__panel');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-cv');

      tabs.forEach((t) => t.classList.remove('is-active'));
      panels.forEach((p) => p.classList.remove('is-active'));

      tab.classList.add('is-active');
      const panel = document.getElementById(target);
      if (panel) panel.classList.add('is-active');
    });
  });
})();

// ---------- Modal open / close ----------
const modalEl = document.getElementById('modal');
const modalEyebrow = document.getElementById('modal-eyebrow');
const modalTitle = document.getElementById('modal-title');
const modalSub = document.getElementById('modal-sub');

const MODAL_PRESETS = {
  apply: {
    eyebrow: 'Apply',
    title: 'Find Your AI Path',
    sub: 'Tell us where you are. A senior counselor will reach out within 48 hours — a real person, not a call center.',
  },
  callback: {
    eyebrow: 'Callback',
    title: 'Request a Callback',
    sub: 'Drop your details. A senior counselor will call you within 24 hours.',
  },
  brochure: {
    eyebrow: 'Brochure',
    title: 'Download the program guide',
    sub: 'Detailed curriculum, mentor list, capstone briefs, and pricing — sent to your email.',
  },
};

function openModal(kind) {
  const preset = MODAL_PRESETS[kind] || MODAL_PRESETS.apply;
  if (modalEyebrow) modalEyebrow.textContent = preset.eyebrow;
  if (modalTitle) modalTitle.textContent = preset.title;
  if (modalSub) modalSub.textContent = preset.sub;
  if (modalEl) {
    modalEl.classList.add('is-open');
    modalEl.setAttribute('aria-hidden', 'false');
  }
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  if (modalEl) {
    modalEl.classList.remove('is-open');
    modalEl.setAttribute('aria-hidden', 'true');
  }
  document.body.style.overflow = '';
}

// expose for inline onclick on the close button
window.closeModal = closeModal;

// click overlay to close
if (modalEl) {
  modalEl.addEventListener('click', (e) => {
    if (e.target === modalEl) closeModal();
  });
}

// escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

// wire up all triggers
document.querySelectorAll('[data-modal]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const kind = btn.getAttribute('data-modal');
    openModal(kind);
  });
});

// form submit
const form = document.getElementById('modal-form');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    if (btn) {
      btn.textContent = 'Submitting…';
      btn.disabled = true;
    }
    setTimeout(() => {
      if (btn) {
        btn.textContent = 'Got it. We will be in touch.';
      }
      setTimeout(() => {
        closeModal();
        form.reset();
        if (btn) {
          btn.textContent = 'Book my call';
          btn.disabled = false;
        }
      }, 1500);
    }, 600);
  });
}
