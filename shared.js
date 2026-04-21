// Shared UI — nav, footer, CCTV dispatch widget
(function () {
  const FORM_TOKEN_COOKIE = 'dasitrade_form_token';
  const ANALYTICS = {
    gtmContainerId: '',
    ga4MeasurementId: '',
  };
  const COMPANY = {
    legalName: 'SC DASITRADE SRL',
    slogan: 'Soluții inteligente în telecomunicații',
    registrationNumber: 'J2006000967048',
    taxId: 'RO 18802465',
    addressHtml: 'Bld. Unirii, Nr. 92 B<br/>Bacău, România',
    callCenterLabel: '0334 401 092',
    callCenterHref: 'tel:0334401092',
    phoneLabel: '0728 030 268',
    phoneHref: 'tel:0728030268',
    officeEmail: 'office@dasitrade.ro',
    officeEmailHref: 'mailto:office@dasitrade.ro',
    primarySiteLabel: 'www.dasitrade.ro',
    primarySiteHref: 'https://www.dasitrade.ro',
    secondarySiteLabel: 'www.sisteme-incendiu.ro',
    secondarySiteHref: 'https://www.sisteme-incendiu.ro',
  };

  // ── Social media links — update these with real account URLs ──────────────
  const SOCIAL = {
    facebook:  'https://www.facebook.com/dasitrade',
    linkedin:  'https://www.linkedin.com/company/dasitrade',
    instagram: 'https://www.instagram.com/dasitrade',
    youtube:   'https://www.youtube.com/@dasitrade',
    whatsapp:  'https://wa.me/40728030268',   // 0728 030 268
  };

  // ── SVG icons (inline, no external dependency) ───────────────────────────
  const ICONS = {
    facebook: `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>`,
    linkedin: `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>`,
    instagram:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>`,
    youtube:  `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.95C5.12 20 12 20 12 20s6.88 0 8.59-.47a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#000"/></svg>`,
    whatsapp: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>`,
  };
  function h(tag, attrs = {}, children = []) {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === 'class') el.className = v;
      else if (k === 'html') el.innerHTML = v;
      else el.setAttribute(k, v);
    }
    (Array.isArray(children) ? children : [children]).forEach(c => {
      if (c == null) return;
      if (typeof c === 'string') el.appendChild(document.createTextNode(c));
      else el.appendChild(c);
    });
    return el;
  }

  function getCookie(name) {
    const cookies = document.cookie ? document.cookie.split('; ') : [];
    for (const cookie of cookies) {
      const [key, ...rest] = cookie.split('=');
      if (key === name) {
        return decodeURIComponent(rest.join('='));
      }
    }
    return '';
  }

  function randomHex(byteLength = 32) {
    const bytes = new Uint8Array(byteLength);
    if (globalThis.crypto?.getRandomValues) {
      globalThis.crypto.getRandomValues(bytes);
      return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
    }

    return Array.from({ length: byteLength * 2 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
  }

  function ensureFormToken() {
    const fields = document.querySelectorAll('input[name="csrf_token"]');
    if (!fields.length) return;

    let token = getCookie(FORM_TOKEN_COOKIE);
    if (!/^[a-f0-9]{64}$/i.test(token)) {
      token = randomHex(32);
      const secure = globalThis.location.protocol === 'https:' ? '; Secure' : '';
      document.cookie = `${FORM_TOKEN_COOKIE}=${encodeURIComponent(token)}; Max-Age=2592000; Path=/; SameSite=Strict${secure}`;
    }

    fields.forEach(field => {
      field.value = token;
      field.setAttribute('value', token);
    });
  }

  function ensureDataLayer() {
    if (!Array.isArray(globalThis.dataLayer)) {
      globalThis.dataLayer = [];
    }

    return globalThis.dataLayer;
  }

  function loadAnalyticsScript(src) {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) return;

    const script = document.createElement('script');
    script.async = true;
    script.src = src;
    document.head.appendChild(script);
  }

  function mountAnalytics() {
    if (globalThis.__dasitradeAnalyticsMounted) return;

    const gtmContainerId = ANALYTICS.gtmContainerId.trim();
    const ga4MeasurementId = ANALYTICS.ga4MeasurementId.trim();

    if (/^GTM-[A-Z0-9]+$/i.test(gtmContainerId)) {
      const dataLayer = ensureDataLayer();
      dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
      loadAnalyticsScript(`https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(gtmContainerId)}`);
      globalThis.__dasitradeAnalyticsMounted = true;
      globalThis.__dasitradeAnalyticsMode = 'gtm';
      return;
    }

    if (/^G-[A-Z0-9]+$/i.test(ga4MeasurementId)) {
      ensureDataLayer();

      if (typeof globalThis.gtag !== 'function') {
        globalThis.gtag = function gtag() {
          globalThis.dataLayer.push(arguments);
        };
      }

      globalThis.gtag('js', new Date());
      globalThis.gtag('config', ga4MeasurementId, {
        send_page_view: true,
        page_path: globalThis.location.pathname || '/',
        page_title: document.title,
      });
      loadAnalyticsScript(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ga4MeasurementId)}`);
      globalThis.__dasitradeAnalyticsMounted = true;
      globalThis.__dasitradeAnalyticsMode = 'ga4';
    }
  }

  function normalizeTrackLabel(trigger) {
    const label = trigger.dataset.trackLabel
      || trigger.getAttribute('aria-label')
      || trigger.textContent
      || trigger.getAttribute('href')
      || trigger.id
      || trigger.name
      || 'unknown';

    return label.replace(/\s+/g, ' ').trim().slice(0, 120);
  }

  function inferTrackEvent(trigger) {
    if (trigger.dataset.track) return trigger.dataset.track;

    const href = (trigger.getAttribute('href') || '').toLowerCase();
    if (href.startsWith('tel:')) return 'click_phone';
    if (href.startsWith('mailto:')) return 'click_email';
    if (href.includes('wa.me') || href.includes('whatsapp')) return 'click_whatsapp';
    if (href.includes('google.com/maps') || href.includes('/maps/search')) return 'click_map';
    if (trigger.classList.contains('btn')) return 'cta_click';

    return '';
  }

  function track(eventName, data = {}) {
    if (!eventName) return;

    const dataLayer = ensureDataLayer();

    const payload = {
      event: eventName,
      page: globalThis.location.pathname || '/',
      timestamp: new Date().toISOString(),
      ...data,
    };

    dataLayer.push(payload);

    if (globalThis.__dasitradeAnalyticsMode === 'ga4' && typeof globalThis.gtag === 'function') {
      const { event, page, timestamp, ...params } = payload;
      globalThis.gtag('event', eventName, {
        page_path: page,
        page_title: document.title,
        event_time: timestamp,
        ...params,
      });
    }

    globalThis.dispatchEvent(new CustomEvent('dasitrade:track', { detail: payload }));
  }

  function mountTracking() {
    if (globalThis.__dasitradeTrackingMounted) return;
    globalThis.__dasitradeTrackingMounted = true;

    document.addEventListener('click', event => {
      const trigger = event.target.closest('a,button');
      if (!trigger) return;
      if (trigger.matches('button[type="submit"]')) return;

      const eventName = inferTrackEvent(trigger);
      if (!eventName) return;

      track(eventName, {
        label: normalizeTrackLabel(trigger),
        href: trigger.getAttribute('href') || '',
        location: trigger.dataset.trackLocation || '',
      });
    });
  }

  const NAV_ITEMS = [
    { href: 'index.html', label: 'Acasă', key: 'home' },
    { href: 'despre.html', label: 'Despre', key: 'despre' },
    { href: 'servicii.html', label: 'Servicii', key: 'servicii' },
    { href: 'portofoliu.html', label: 'Portofoliu', key: 'portofoliu' },
    { href: 'cariere.html', label: 'Cariere', key: 'cariere' },
    { href: 'contact.html', label: 'Contact', key: 'contact' },
  ];

  function mountNav(current, variant = 'dark') {
    const host = document.querySelector('[data-nav]');
    if (!host) return;
    const brand = h('a', { class: 'nav__brand', href: 'index.html' });
    brand.innerHTML = `<img src="assets/logo.jpg" alt="Dasitrade" class="nav__logo"/>`;
    const links = h('nav', { class: 'nav__links' },
      NAV_ITEMS.map(it => h('a', {
        href: it.href,
        class: it.key === current ? 'is-active' : '',
      }, it.label))
    );
    const status = h('div', { class: 'nav__status' }, [
      h('span', { class: 'nav__dot' }),
      h('span', {}, 'CALL-CENTER 24/7'),
    ]);

    const burger = h('button', { class: 'nav__burger', 'aria-label': 'Meniu', 'aria-expanded': 'false' });
    burger.innerHTML = '<span></span><span></span><span></span>';

    const mobileMenu = h('div', { class: 'nav__mobile' },
      NAV_ITEMS.map(it => h('a', {
        href: it.href,
        class: it.key === current ? 'is-active' : '',
      }, it.label))
    );
    document.body.appendChild(mobileMenu);

    burger.addEventListener('click', () => {
      const open = host.classList.toggle('nav--open');
      burger.setAttribute('aria-expanded', String(open));
      mobileMenu.classList.toggle('nav__mobile--open');
      document.body.style.overflow = open ? 'hidden' : '';
    });

    host.className = `nav nav--${variant}`;
    host.appendChild(brand);
    host.appendChild(links);
    host.appendChild(status);
    host.appendChild(burger);
  }

  function mountFooter() {
    const host = document.querySelector('[data-footer]');
    if (!host) return;
    host.className = 'footer';
    host.innerHTML = `
      <div class="footer__grid">
        <div>
          <img src="assets/logo.jpg" alt="Dasitrade" class="footer__logo"/>
          <div class="footer__slogan">${COMPANY.slogan}</div>
          <p class="footer__brand-copy">
            ${COMPANY.legalName} acoperă securitatea electronică, sistemele de incendiu, telecomunicațiile și infrastructura de curenți slabi, de la analiză și proiectare până la mentenanță și call-center 24/7.
          </p>
        </div>
        <div class="footer__col">
          <div class="footer__col-label">Date Firmă</div>
          <p>${COMPANY.legalName}</p>
          <p>CUI ${COMPANY.taxId}</p>
          <p>Reg. Com. ${COMPANY.registrationNumber}</p>
        </div>
        <div class="footer__col">
          <div class="footer__col-label">Sediu & Telefon</div>
          <p>${COMPANY.addressHtml}</p>
          <a href="${COMPANY.callCenterHref}">Call-center: ${COMPANY.callCenterLabel}</a>
          <a href="${COMPANY.phoneHref}">Telefon: ${COMPANY.phoneLabel}</a>
        </div>
        <div class="footer__col">
          <div class="footer__col-label">Email & Web</div>
          <a href="${COMPANY.officeEmailHref}">${COMPANY.officeEmail}</a>
          <a href="${COMPANY.primarySiteHref}" target="_blank" rel="noopener">${COMPANY.primarySiteLabel}</a>
          <a href="${COMPANY.secondarySiteHref}" target="_blank" rel="noopener">${COMPANY.secondarySiteLabel}</a>
        </div>
      </div>
      <div class="footer__social">
        <a href="${SOCIAL.facebook}"  target="_blank" rel="noopener" class="footer__social-link" aria-label="Facebook">${ICONS.facebook}</a>
        <a href="${SOCIAL.linkedin}"  target="_blank" rel="noopener" class="footer__social-link" aria-label="LinkedIn">${ICONS.linkedin}</a>
        <a href="${SOCIAL.instagram}" target="_blank" rel="noopener" class="footer__social-link" aria-label="Instagram">${ICONS.instagram}</a>
        <a href="${SOCIAL.youtube}"   target="_blank" rel="noopener" class="footer__social-link" aria-label="YouTube">${ICONS.youtube}</a>
        <a href="${SOCIAL.whatsapp}"  target="_blank" rel="noopener" class="footer__social-link footer__social-link--wa" aria-label="WhatsApp">${ICONS.whatsapp}</a>
      </div>
      <div class="footer__bottom">
        <span>© 2006–2026 ${COMPANY.legalName} · ${COMPANY.taxId} · ${COMPANY.registrationNumber}</span>
        <a href="gdpr.html" style="color:var(--fg-dark-dim);font-size:12px;font-family:var(--mono);letter-spacing:0.12em;">Politica de confidențialitate</a>
      </div>
    `;
  }

  function mountWhatsApp() {
    const btn = h('a', {
      class: 'wa-fab',
      href: SOCIAL.whatsapp,
      target: '_blank',
      rel: 'noopener',
      'aria-label': 'Contactează-ne pe WhatsApp',
    });
    btn.innerHTML = `${ICONS.whatsapp}<span class="wa-fab__label">WhatsApp</span>`;
    document.body.appendChild(btn);
  }

  function mountFloatingAvoidFooter() {
    const footer = document.querySelector('.footer');
    if (!footer) return;

    let rafId = 0;
    const update = () => {
      rafId = 0;
      const footerRect = footer.getBoundingClientRect();
      const shouldRetreat = footerRect.top < globalThis.innerHeight - 72;
      document.body.classList.toggle('has-footer-overlay-guard', shouldRetreat);
    };
    const scheduleUpdate = () => {
      if (rafId) return;
      rafId = globalThis.requestAnimationFrame(update);
    };

    scheduleUpdate();
    globalThis.addEventListener('scroll', scheduleUpdate, { passive: true });
    globalThis.addEventListener('resize', scheduleUpdate);

    if ('ResizeObserver' in globalThis) {
      const observer = new ResizeObserver(scheduleUpdate);
      observer.observe(footer);
    }
  }

  function mountCookieBanner() {
    try {
      if (localStorage.getItem('dasitrade_cookies_ok') === '1') return;
    } catch {}
    const banner = h('div', { class: 'cookie-banner', role: 'region', 'aria-label': 'Cookie consent' });
    banner.innerHTML = `
      <p>
        Acest site folosește cookie-uri funcționale necesare pentru funcționarea corectă a paginii.
        Nu colectăm date de urmărire sau publicitate fără consimțământul dumneavoastră.
        <a href="gdpr.html">Politica de confidențialitate →</a>
      </p>
      <div class="cookie-banner__actions">
        <button class="btn btn--accent" style="font-size:12px;padding:10px 20px;" data-cookie-accept>Accept</button>
        <a href="gdpr.html" class="btn btn--ghost-dark" style="font-size:12px;padding:10px 20px;">Detalii</a>
      </div>
    `;
    document.body.appendChild(banner);
    banner.querySelector('[data-cookie-accept]').addEventListener('click', () => {
      try { localStorage.setItem('dasitrade_cookies_ok', '1'); } catch {}
      banner.classList.add('cookie-banner--hidden');
    });
  }

  function mountDispatch() {
    if (globalThis.innerWidth < 900) return;
    const prefersReducedMotion = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const cameras = [
      {
        label: 'CAM-01 · SEDIU',
        poster: 'assets/img/hero-contact.jpg',
        video: 'assets/img/dispatch/cam-01-sediu.mp4',
        scanDelay: '0s',
      },
      {
        label: 'CAM-02 · ACCES',
        poster: 'assets/img/svc-06-acces.jpg',
        video: 'assets/img/dispatch/cam-02-acces.mp4',
        scanDelay: '-1.5s',
      },
      {
        label: 'CAM-03 · PERIMETRU',
        poster: 'assets/img/svc-04-efractie.jpg',
        video: 'assets/img/dispatch/cam-03-perimetru.mp4',
        scanDelay: '-2.8s',
      },
      {
        label: 'CAM-04 · INTERIOR',
        poster: 'assets/img/port-06.jpg',
        video: 'assets/img/dispatch/cam-04-interior.mp4',
        scanDelay: '-3.4s',
      },
    ];
    const el = h('div', { class: 'dispatch dispatch--collapsed', 'data-dispatch': '' });
    el.innerHTML = `
      <div class="dispatch__head">
        <span><span class="dispatch__head-dot"></span>LIVE · DISPATCH</span>
        <span data-dispatch-toggle>[ EXPAND ]</span>
      </div>
      <div class="dispatch__grid">
        ${cameras.map(camera => `
        <div class="dispatch__cell">
          <span class="dispatch__cell-label">${camera.label}</span>
          <span class="dispatch__cell-status"></span>
          <div class="dispatch__cell-fig">
            <video class="dispatch__cell-video" ${prefersReducedMotion ? '' : 'autoplay'} muted loop playsinline preload="metadata" poster="${camera.poster}">
              <source src="${camera.video}" type="video/mp4"/>
            </video>
          </div>
          <div class="dispatch__cell-scan" style="animation-delay:${camera.scanDelay}"></div>
        </div>`).join('')}
      </div>
      <div class="dispatch__foot">
        <span>UPTIME <span class="dispatch__foot-val" data-dispatch-uptime>99.98%</span></span>
        <span>LAT <span class="dispatch__foot-val" data-dispatch-lat>14ms</span></span>
        <span class="mono" data-dispatch-clock>--:--:--</span>
      </div>
    `;
    document.body.appendChild(el);
    const head = el.querySelector('.dispatch__head');
    const toggle = el.querySelector('[data-dispatch-toggle]');
    head.addEventListener('click', () => {
      const collapsed = el.classList.toggle('dispatch--collapsed');
      toggle.textContent = collapsed ? '[ EXPAND ]' : '[ MIN ]';
    });
    if (!prefersReducedMotion) {
      el.querySelectorAll('.dispatch__cell-video').forEach(video => {
        const attemptPlay = () => video.play().catch(() => {});
        attemptPlay();
        video.addEventListener('loadedmetadata', attemptPlay, { once: true });
      });
    }
    const clockEl = el.querySelector('[data-dispatch-clock]');
    const latEl = el.querySelector('[data-dispatch-lat]');
    setInterval(() => {
      const d = new Date();
      const p = n => String(n).padStart(2, '0');
      clockEl.textContent = `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
      latEl.textContent = `${12 + Math.floor(Math.random()*6)}ms`;
    }, 1000);
  }

  // Splash intro — show on first visit only
  function maybeSplash() {
    try {
      if (sessionStorage.getItem('dasitrade_splash_seen') === '1') return;
      if (!document.body.dataset.splash) return;
      if (globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
        sessionStorage.setItem('dasitrade_splash_seen', '1');
        return;
      }

      const overlay = h('div', {}, []);
      overlay.style.cssText = `
        position: fixed; inset: 0; z-index: 9999;
        background: #000;
        opacity: 1;
        transition: opacity 500ms ease;
        cursor: pointer;
      `;
      const iframe = h('iframe', {
        src: 'intro.html',
        title: 'Dasitrade secure boot intro',
        'aria-hidden': 'true',
        style: 'width:100%;height:100%;border:0;display:block;',
      });
      overlay.appendChild(iframe);
      document.body.appendChild(overlay);

      let dismissed = false;
      let fallbackTimer = null;

      const dismiss = () => {
        if (dismissed) return;
        dismissed = true;
        overlay.style.opacity = '0';
        setTimeout(() => {
          overlay.remove();
          sessionStorage.setItem('dasitrade_splash_seen', '1');
        }, 500);
        globalThis.removeEventListener('message', onMessage);
        if (fallbackTimer) clearTimeout(fallbackTimer);
      };

      const onMessage = (event) => {
        if (event?.data?.type !== 'dasitrade:intro-complete') return;
        dismiss();
      };

      overlay.addEventListener('click', dismiss);
      globalThis.addEventListener('message', onMessage);
      fallbackTimer = setTimeout(dismiss, 4600);
    } catch {}
  }

  // Reveal on scroll
  function mountReveal() {
    const els = document.querySelectorAll('[data-reveal]');
    if (!els.length || !('IntersectionObserver' in globalThis)) {
      els.forEach(el => el.classList.add('is-revealed'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('is-revealed');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.15 });
    els.forEach(el => io.observe(el));
  }

  function mountMediaGalleries({ selector = '.media-gallery', galleries = {}, autoplayMs = 3600 } = {}) {
    const hosts = document.querySelectorAll(selector);
    if (!hosts.length) return;

    hosts.forEach((host, hostIndex) => {
      const key = host.dataset.galleryKey;
      const items = galleries[key];
      if (!Array.isArray(items) || !items.length) return;

      const outerSlide = host.closest('.svc-slide, .port-slide');
      const label = host.dataset.galleryLabel || `Galerie imagini ${hostIndex + 1}`;
      const normalizedLabel = label.replace(/^Galerie\s*/i, '').trim() || `galerie ${hostIndex + 1}`;
      let current = 0;
      let timer = null;
      let startX = 0;
      let hostInView = !('IntersectionObserver' in globalThis);

      host.innerHTML = '';
      host.setAttribute('role', 'group');
      host.setAttribute('aria-roledescription', 'carousel');
      host.setAttribute('aria-label', label);

      const slidesEl = h('div', { class: 'media-gallery__slides' });
      const controlsEl = h('div', { class: 'media-gallery__chrome' });
      const prevBtn = h('button', {
        class: 'media-gallery__arrow media-gallery__arrow--prev',
        type: 'button',
        'aria-label': 'Imagine anterioara'
      });
      prevBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M12.5 4.5L7 10l5.5 5.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

      const nextBtn = h('button', {
        class: 'media-gallery__arrow media-gallery__arrow--next',
        type: 'button',
        'aria-label': 'Imagine urmatoare'
      });
      nextBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M7.5 4.5L13 10l-5.5 5.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

      const metaEl = h('div', { class: 'media-gallery__meta' });
      const countEl = h('span', { class: 'media-gallery__count' });
      const dotsEl = h('div', { class: 'media-gallery__dots' });
      metaEl.appendChild(countEl);
      metaEl.appendChild(dotsEl);
      controlsEl.appendChild(prevBtn);
      controlsEl.appendChild(metaEl);
      controlsEl.appendChild(nextBtn);

      const images = [];
      const slides = items.map((item, index) => {
        const src = typeof item === 'string' ? item : item.src;
        const fallbackAlt = `${normalizedLabel} · imaginea ${index + 1}`;
        const alt = typeof item === 'string' ? fallbackAlt : (item.alt || fallbackAlt);
        const slide = h('div', {
          class: `media-gallery__slide${index === 0 ? ' is-active' : ''}`,
          'aria-hidden': index === 0 ? 'false' : 'true'
        });
        const img = h('img', {
          class: 'media-gallery__image',
          alt,
          loading: 'lazy',
          'data-src': src,
          decoding: 'async'
        });
        images.push(img);
        slide.appendChild(img);
        slidesEl.appendChild(slide);
        return slide;
      });

      const dots = items.map((_, index) => {
        const dot = h('button', {
          class: `media-gallery__dot${index === 0 ? ' is-active' : ''}`,
          type: 'button',
          'aria-label': `Imagine ${index + 1}`
        });
        dot.addEventListener('click', event => {
          event.stopPropagation();
          goTo(index, true);
        });
        dotsEl.appendChild(dot);
        return dot;
      });

      host.appendChild(slidesEl);
      if (items.length > 1) {
        host.appendChild(controlsEl);
      }

      function isVisible() {
        return !outerSlide || outerSlide.classList.contains('is-active');
      }

      function shouldHydrate() {
        return hostInView && isVisible();
      }

      function loadSlideImage(index, priority = 'auto') {
        const normalizedIndex = ((index % images.length) + images.length) % images.length;
        const img = images[normalizedIndex];
        if (!img) return;

        img.fetchPriority = priority;

        if (!img.getAttribute('src')) {
          img.setAttribute('src', img.dataset.src || '');
        }
      }

      function hydrateAround(index) {
        if (!shouldHydrate()) return;

        loadSlideImage(index, 'high');

        if (images.length > 1) {
          loadSlideImage(index + 1, 'low');
        }

        if (images.length > 2) {
          loadSlideImage(index - 1, 'low');
        }
      }

      function refreshCounter() {
        countEl.textContent = `${String(current + 1).padStart(2, '0')} / ${String(items.length).padStart(2, '0')}`;
      }

      function goTo(index, restartAutoplay = false) {
        slides[current].classList.remove('is-active');
        slides[current].setAttribute('aria-hidden', 'true');
        dots[current].classList.remove('is-active');

        current = ((index % slides.length) + slides.length) % slides.length;

        slides[current].classList.add('is-active');
        slides[current].setAttribute('aria-hidden', 'false');
        dots[current].classList.add('is-active');
        hydrateAround(current);
        refreshCounter();

        if (restartAutoplay) startAutoplay();
      }

      function stopAutoplay() {
        if (timer) {
          clearInterval(timer);
          timer = null;
        }
      }

      function startAutoplay() {
        stopAutoplay();
        if (slides.length < 2) return;
        timer = setInterval(() => {
          if (!isVisible()) return;
          goTo(current + 1);
        }, autoplayMs);
      }

      prevBtn.addEventListener('click', event => {
        event.stopPropagation();
        goTo(current - 1, true);
      });

      nextBtn.addEventListener('click', event => {
        event.stopPropagation();
        goTo(current + 1, true);
      });

      host.addEventListener('mouseenter', stopAutoplay);
      host.addEventListener('mouseleave', startAutoplay);
      host.addEventListener('focusin', stopAutoplay);
      host.addEventListener('focusout', startAutoplay);
      host.addEventListener('touchstart', event => {
        startX = event.touches[0].clientX;
        stopAutoplay();
        event.stopPropagation();
      }, { passive: true });
      host.addEventListener('touchend', event => {
        const dx = event.changedTouches[0].clientX - startX;
        if (Math.abs(dx) > 40) {
          goTo(dx < 0 ? current + 1 : current - 1, true);
        } else {
          startAutoplay();
        }
        event.stopPropagation();
      });

      if ('IntersectionObserver' in globalThis) {
        const hostObserver = new IntersectionObserver(entries => {
          entries.forEach(entry => {
            hostInView = entry.isIntersecting;
            if (shouldHydrate()) {
              hydrateAround(current);
            }
          });
        }, { rootMargin: '240px 0px' });

        hostObserver.observe(host);
      }

      if (outerSlide && 'MutationObserver' in globalThis) {
        const slideObserver = new MutationObserver(() => {
          if (shouldHydrate()) {
            hydrateAround(current);
          }
        });

        slideObserver.observe(outerSlide, { attributes: true, attributeFilter: ['class'] });
      }

      refreshCounter();
      hydrateAround(current);
      startAutoplay();
    });
  }

  globalThis.DasitradeSite = {
    init({ current, navVariant = 'dark' } = {}) {
      ensureFormToken();
      mountAnalytics();
      maybeSplash();
      mountNav(current, navVariant);
      mountFooter();
      mountDispatch();
      mountReveal();
      mountCookieBanner();
      mountWhatsApp();
      mountFloatingAvoidFooter();
      mountTracking();
    },
    mountMediaGalleries(options) {
      mountMediaGalleries(options);
    },
    track(eventName, data) {
      track(eventName, data);
    }
  };
})();
