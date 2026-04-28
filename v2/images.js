// =========================================================
// Image populator — Brandfetch (logos) + Unsplash (photos)
// Runs once on DOMContentLoaded, walks the page,
// fills every photo / logo placeholder with a real image.
// =========================================================

(function () {
  const BRANDFETCH = (domain, size = 256) =>
    `https://cdn.brandfetch.io/${domain}/w/${size}/h/${size}?c=1id__9rGDsKYr7C`;

  // Unsplash Source — keyword-based lightweight CDN.
  const UNSPLASH = (w, h, keywords, sig) =>
    `https://source.unsplash.com/${w}x${h}/?${encodeURIComponent(keywords)}&sig=${sig}`;

  // Curated portrait photos from Unsplash (stable IDs so the same person doesn't
  // shuffle on every reload). Mix of professional headshots.
  const PORTRAITS = [
    'photo-1573496359142-b8d87734a5a2', // woman professional
    'photo-1560250097-0b93528c311a',    // man suit
    'photo-1580489944761-15a19d654956', // woman smile
    'photo-1599566150163-29194dcaad36', // man professional
    'photo-1494790108377-be9c29b29330', // woman portrait
    'photo-1519085360753-af0119f7cbe7', // man portrait
    'photo-1567532939604-b6b5b0db2604', // woman exec
    'photo-1568602471122-7832951cc4c5', // man exec
    'photo-1573497019940-1c28c88b4f3e', // woman analyst
    'photo-1500648767791-00dcc994a43e', // man analyst
    'photo-1551836022-deb4988cc6c0',    // woman speaker
    'photo-1531123897727-8f129e1688ce', // man founder
    'photo-1438761681033-6461ffad8d80', // woman ceo
    'photo-1507003211169-0a1dd7228f2d', // man ceo
    'photo-1487412720507-e7ab37603c6f', // woman tech
    'photo-1492562080023-ab3db95bfbce', // man tech
    'photo-1544005313-94ddf0286df2',    // woman business
    'photo-1463453091185-61582044d556', // man business
    'photo-1521119989659-a83eee488004', // woman finance
    'photo-1560250097-0b93528c311a',    // man finance
  ];

  const portraitURL = (idx, w = 240, h = 240) => {
    const id = PORTRAITS[idx % PORTRAITS.length];
    return `https://images.unsplash.com/${id}?w=${w}&h=${h}&fit=crop&crop=faces&auto=format&q=80`;
  };

  // Map company names → domains for Brandfetch
  const DOMAIN_MAP = {
    'google': 'google.com',
    'flipkart': 'flipkart.com',
    'razorpay': 'razorpay.com',
    'phonepe': 'phonepe.com',
    'microsoft': 'microsoft.com',
    'swiggy': 'swiggy.com',
    'zepto': 'zeptonow.com',
    'hdfc bank': 'hdfcbank.com',
    'hdfc': 'hdfcbank.com',
    'bajaj': 'bajajfinserv.in',
    'cred': 'cred.club',
    'zomato': 'zomato.com',
    'info edge': 'naukri.com',
    'zerodha': 'zerodha.com',
    'meta': 'meta.com',
    'facebook': 'meta.com',
    'directi': 'directi.com',
    'fab.com': 'fab.com',
    'uber': 'uber.com',
    'kfc': 'kfc.com',
    'icici': 'icicibank.com',
    'oracle': 'oracle.com',
    'mckinsey': 'mckinsey.com',
    'bain': 'bain.com',
    'amazon': 'amazon.com',
    'scaler': 'scaler.com',
    'mint': 'livemint.com',
    'economic times': 'economictimes.indiatimes.com',
    'yourstory': 'yourstory.com',
  };

  const lookupDomain = (name) => {
    if (!name) return null;
    const key = name.trim().toLowerCase();
    if (DOMAIN_MAP[key]) return DOMAIN_MAP[key];
    // last-resort guess
    return key.replace(/\s+/g, '') + '.com';
  };

  const setBg = (el, url) => {
    el.style.backgroundImage = `url("${url}")`;
    el.style.backgroundSize = 'cover';
    el.style.backgroundPosition = 'center';
    el.style.backgroundRepeat = 'no-repeat';
  };

  // ---------- 1. Cohort cards: framed portrait + prominent company logo ----------
  // Brandfetch logo URL — request a wide image so wordmarks render crisp.
  const BRANDFETCH_LOGO = (domain) =>
    `https://cdn.brandfetch.io/${domain}/w/400/h/120?c=1id__9rGDsKYr7C`;

  document.querySelectorAll('.cohort-card').forEach((card, i) => {
    const photoEl = card.querySelector('.cohort-card__photo');
    if (photoEl) setBg(photoEl, portraitURL(i, 480, 480));

    const coEl = card.querySelector('.cohort-card__co');
    if (!coEl) return;
    const key = coEl.getAttribute('data-co');
    const name = coEl.getAttribute('data-co-name') || key;
    const domain = lookupDomain(key);
    if (!domain) {
      coEl.innerHTML = `<span class="cohort-card__co-text">${name}</span>`;
      return;
    }
    const logo = document.createElement('img');
    logo.src = BRANDFETCH_LOGO(domain);
    logo.alt = name;
    logo.loading = 'lazy';
    logo.onerror = () => {
      coEl.innerHTML = `<span class="cohort-card__co-text">${name}</span>`;
    };
    coEl.appendChild(logo);
  });

  // ---------- 2. Quote attribution photos (in cohort + final) ----------
  document.querySelectorAll('.quote').forEach((q, i) => {
    const photoEl = q.querySelector('.quote__photo');
    if (photoEl) setBg(photoEl, portraitURL(i, 88, 88));
  });

  // ---------- 3. Instructor / Mentor / Investor cards ----------
  // Walk every `.person-card` in order. Use the brand text to find the company.
  document.querySelectorAll('.person-card').forEach((card, i) => {
    const photoEl = card.querySelector('.person-card__photo');
    const brandEl = card.querySelector('.person-card__brand');

    if (photoEl) {
      // unique offset per card so faces don't repeat across sections
      setBg(photoEl, portraitURL(i + 3, 280, 280));
    }

    // Replace the strong brand name with a small Brandfetch logo chip.
    if (brandEl) {
      const strong = brandEl.querySelector('strong');
      if (strong) {
        const name = strong.textContent.trim();
        const domain = lookupDomain(name);
        if (domain) {
          const logo = document.createElement('img');
          logo.src = BRANDFETCH(domain, 64);
          logo.alt = name;
          logo.className = 'brand-logo';
          logo.loading = 'lazy';
          logo.onerror = () => { logo.style.display = 'none'; };
          strong.appendChild(document.createTextNode(' '));
          strong.appendChild(logo);
        }
      }
    }
  });

  // ---------- 4. House-of-Scaler poster cards ----------
  // Each program gets a curated topical image (Scaler doesn't expose a photo
  // CDN, so we use Unsplash IDs that visually map to each program's vibe).
  const HOS_IMAGES = {
    academy: 'photo-1573164713988-8665fc963095', // engineers at workstations
    dsml:    'photo-1551288049-bebda4e38f71',    // data viz / analytics
    devops:  'photo-1518770660439-4636190af475', // server / infra
    aiml:    'photo-1620712943543-bcc4688e7485', // AI / neural
    sst:     'photo-1517048676732-d65bc937f952', // students collaborating
    ssb:     'photo-1556761175-5973dc0f32e7',    // business team / pitch
  };

  document.querySelectorAll('.hos-card__poster-bg').forEach((el) => {
    const key = el.getAttribute('data-img-key');
    const id = HOS_IMAGES[key];
    if (id) {
      el.style.backgroundImage = `url("https://images.unsplash.com/${id}?w=1200&h=900&fit=crop&auto=format&q=80")`;
    }
  });

  // ---------- 5. News cards: real news-style photos ----------
  const newsKeywords = [
    'office, ai, india, business',
    'leadership, executives, india',
    'startup, technology, india',
  ];
  document.querySelectorAll('.news-card').forEach((card, i) => {
    const imgEl = card.querySelector('.news-card__img');
    if (imgEl) {
      const kw = newsKeywords[i % newsKeywords.length];
      imgEl.style.backgroundImage = `url("${UNSPLASH(240, 160, kw, i + 1)}")`;
      imgEl.style.backgroundSize = 'cover';
      imgEl.style.backgroundPosition = 'center';
    }
  });

  // ---------- 6. Hero rating-chip avatar ----------
  const heroAvatar = document.querySelector('[data-img-key="hero-avatar"]');
  if (heroAvatar) {
    heroAvatar.style.backgroundImage = `url("${portraitURL(2, 120, 120)}")`;
    heroAvatar.style.backgroundSize = 'cover';
    heroAvatar.style.backgroundPosition = 'center';
  }

  // ---------- 7. Why-now video: same treatment ----------
  const whyVideo = document.querySelector('.why-now__video');
  if (whyVideo) {
    whyVideo.style.backgroundImage = `linear-gradient(135deg, rgba(0,85,255,0.4), rgba(1,24,69,0.7)), url("${UNSPLASH(900, 600, 'ai, technology, professional, india', 88)}")`;
    whyVideo.style.backgroundSize = 'cover';
    whyVideo.style.backgroundPosition = 'center';
  }
})();
