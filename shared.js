// Shared UI — nav, footer, and floating actions
(function () {
  const FORM_TOKEN_COOKIE = 'dasitrade_form_token';
  const CONSENT_STORAGE_KEY = 'dasitrade_consent_v1';
  const LEGACY_COOKIE_ACK_KEY = 'dasitrade_cookies_ok';
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
    officeEmail: 'tehnic@dasitrade.ro',
    officeEmailHref: 'mailto:tehnic@dasitrade.ro',
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

  const TECHNICAL_HERO_SYSTEMS = [
    {
      key: 'idsai',
      code: '01 / FIRE-DET',
      label: 'Incendiu',
      title: 'Detecție, alarmare și scenarii de evacuare',
      body: 'IDSAI, desfumare, stingere și evacuare vocală tratate ca un singur lanț critic de comandă.',
      links: ['EN54', 'desfumare', 'stingere'],
      href: 'servicii.html#idsai',
      color: 'rgba(132, 211, 166, 0.95)',
      base: { x: -260, y: -150, z: 170 },
      drift: { x: 20, y: 14, z: 80 },
      phase: 0.15,
    },
    {
      key: 'cctv',
      code: '05 / SEC-CCTV',
      label: 'CCTV',
      title: 'Video, verificare și context operațional',
      body: 'Fluxuri video, analitice și audit pentru validarea incidentelor și decizii rapide în exploatare.',
      links: ['VMS', 'LPR', 'analiză video'],
      href: 'servicii.html#cctv',
      color: 'rgba(146, 191, 255, 0.94)',
      base: { x: 270, y: -135, z: 135 },
      drift: { x: 22, y: 16, z: 78 },
      phase: 1.1,
    },
    {
      key: 'efractie',
      code: '04 / SEC-ELC',
      label: 'Efracție',
      title: 'Perimetru, prealarmă și filtrare evenimente',
      body: 'Detecția la efracție devine utilă când este corelată cu accesul, video-ul și dispeceratul.',
      links: ['grad 2-4', 'partiții', 'dispecerat'],
      href: 'servicii.html#efractie',
      color: 'rgba(132, 211, 166, 0.84)',
      base: { x: -305, y: 56, z: 118 },
      drift: { x: 18, y: 16, z: 60 },
      phase: 2.2,
    },
    {
      key: 'acces',
      code: '06 / SEC-ACC',
      label: 'Control acces',
      title: 'Fluxuri controlate și identitate legată de traseu',
      body: 'Accesul corect proiectat separă zone, reduce ambiguitatea și leagă evenimentul de persoană.',
      links: ['RFID', 'biometrie', 'audit trail'],
      href: 'servicii.html#acces',
      color: 'rgba(226, 204, 120, 0.92)',
      base: { x: 310, y: 52, z: 156 },
      drift: { x: 18, y: 15, z: 76 },
      phase: 3.15,
    },
    {
      key: 'voce-date',
      code: '07 / IT-INF',
      label: 'Voice-data',
      title: 'Backbone-ul pe care rulează restul ecosistemului',
      body: 'Fibră, cupru, PoE, rack-uri și backbone de date care susțin subsistemele critice fără improvizații.',
      links: ['Cat6A', 'fibră', 'PoE'],
      href: 'servicii.html#voce-date',
      color: 'rgba(146, 191, 255, 0.88)',
      base: { x: -215, y: 186, z: 92 },
      drift: { x: 16, y: 14, z: 54 },
      phase: 4.1,
    },
    {
      key: 'bms',
      code: '10 / BMS-INT',
      label: 'BMS & integrare',
      title: 'Un strat comun de comandă pentru exploatare reală',
      body: 'BMS-ul și integrarea adună stări, comenzi și scenarii într-un singur model de operare și mentenanță.',
      links: ['BACnet', 'Modbus', 'dashboard'],
      href: 'servicii.html#bms',
      color: 'rgba(132, 211, 166, 0.9)',
      base: { x: 204, y: 188, z: 118 },
      drift: { x: 20, y: 14, z: 62 },
      phase: 5.2,
    },
  ];

  const PAGE_TELEMETRY = {
    home: {
      prefix: 'HME',
      signalCode: 'CORE / HME',
      signalTitle: 'Capabilitati integrate',
      metrics: ['6 familii corelate', 'livrare cap-coada', '24/7 activ'],
      nodes: [
        { code: 'FIRE', label: 'incendiu', x: '16%', y: '20%' },
        { code: 'VIDEO', label: 'cctv', x: '80%', y: '24%' },
        { code: 'DATA', label: 'voice-data', x: '24%', y: '72%' },
        { code: 'BMS', label: 'integrare', x: '76%', y: '70%' },
      ],
    },
    servicii: {
      prefix: 'SYS',
      signalCode: 'SYS / ORCH',
      signalTitle: 'Familii tratate ca ecosistem',
      metrics: ['10 familii', 'cadru normativ', 'PIF + service'],
      nodes: [
        { code: 'FIRE', label: 'alarmare', x: '18%', y: '20%' },
        { code: 'CCTV', label: 'validare video', x: '82%', y: '26%' },
        { code: 'ACC', label: 'control acces', x: '70%', y: '70%' },
        { code: 'BMS', label: 'nucleu comun', x: '24%', y: '72%' },
      ],
    },
    portofoliu: {
      prefix: 'CAS',
      signalCode: 'CASE / OPS',
      signalTitle: 'Rezultat masurat in exploatare',
      metrics: ['12 selectii', 'NDA ready', 'multi-sistem'],
      nodes: [
        { code: 'IND', label: 'industrial', x: '20%', y: '20%' },
        { code: 'MED', label: 'medical', x: '82%', y: '28%' },
        { code: 'PUB', label: 'public', x: '66%', y: '72%' },
        { code: 'DC', label: 'camere tehnice', x: '24%', y: '74%' },
      ],
    },
    despre: {
      prefix: 'ORG',
      signalCode: 'ORG / OPS',
      signalTitle: 'Capacitate structurata operational',
      metrics: ['30+ echipa', 'autorizari active', 'service & dispecerat'],
      nodes: [
        { code: 'TEAM', label: 'executie', x: '18%', y: '22%' },
        { code: 'AUTH', label: 'autorizari', x: '82%', y: '24%' },
        { code: 'PIF', label: 'punere in functiune', x: '70%', y: '70%' },
        { code: 'OPS', label: 'raspuns 24/7', x: '26%', y: '72%' },
      ],
    },
    contact: {
      prefix: 'CNT',
      signalCode: 'LINK / RESPONSE',
      signalTitle: 'Canale tehnice prioritizate',
      metrics: ['oferta in 48h', 'call-center 24/7', 'evaluare teren'],
      nodes: [
        { code: 'CALL', label: 'urgente', x: '18%', y: '20%' },
        { code: 'MAIL', label: 'ofertare', x: '82%', y: '24%' },
        { code: 'MAP', label: 'sediu Bacau', x: '66%', y: '72%' },
        { code: 'SITE', label: 'rutare publica', x: '24%', y: '72%' },
      ],
    },
    cariere: {
      prefix: 'HRD',
      signalCode: 'CREW / BUILD',
      signalTitle: 'Roluri pentru teren si inginerie',
      metrics: ['3 roluri active', 'raspuns in 5 zile', 'teren + proiectare'],
      nodes: [
        { code: 'FIELD', label: 'tehnician', x: '20%', y: '20%' },
        { code: 'DESIGN', label: 'proiectare', x: '80%', y: '24%' },
        { code: 'PIF', label: 'punere in functiune', x: '68%', y: '72%' },
        { code: 'TEAM', label: 'candidatura', x: '24%', y: '72%' },
      ],
    },
    gdpr: {
      prefix: 'GOV',
      signalCode: 'DATA / GOV',
      signalTitle: 'Date, consimtamant si incarcare la cerere',
      metrics: ['contact & cariere', 'embed explicit', 'raspuns in 30 zile'],
      nodes: [
        { code: 'FORM', label: 'formulare', x: '20%', y: '20%' },
        { code: 'MAP', label: 'maps la cerere', x: '80%', y: '28%' },
        { code: 'CONS', label: 'consimtamant', x: '68%', y: '72%' },
        { code: 'MAIL', label: 'solicitari', x: '24%', y: '74%' },
      ],
    },
    error: {
      prefix: 'ERR',
      signalCode: 'ROUTE / SAFE',
      signalTitle: 'Reintoarcere ghidata in zona publica',
      metrics: ['404 activ', 'rute sigure', 'contact rapid'],
      nodes: [
        { code: 'HOME', label: 'pagina principala', x: '20%', y: '22%' },
        { code: 'SERV', label: 'servicii', x: '80%', y: '24%' },
        { code: 'PORT', label: 'portofoliu', x: '66%', y: '72%' },
        { code: 'CALL', label: 'contact', x: '24%', y: '72%' },
      ],
    },
    default: {
      prefix: 'OPS',
      signalCode: 'OPS / FLOW',
      signalTitle: 'Strat tehnic activ',
      metrics: ['orientare rapida', 'semnal unitar', 'navigare clara'],
      nodes: [
        { code: 'CORE', label: 'nucleu', x: '20%', y: '20%' },
        { code: 'LINK', label: 'rutare', x: '80%', y: '24%' },
        { code: 'AUD', label: 'audit', x: '66%', y: '72%' },
        { code: 'OPS', label: 'operare', x: '24%', y: '72%' },
      ],
    },
  };

  const GENERIC_SECTION_CLASSES = new Set(['section', 'page-hero', 'hero', 'cta', 'band']);

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

  function collapseWhitespace(value = '') {
    return String(value).replace(/\s+/g, ' ').trim();
  }

  function inferPageKey(explicitCurrent = '') {
    if (explicitCurrent) return explicitCurrent;

    const fileName = collapseWhitespace((globalThis.location.pathname || '').split('/').pop()).toLowerCase();
    if (!fileName || fileName === 'index.html') return 'home';
    if (fileName === '404.html') return 'error';
    return fileName.replace(/\.html$/i, '');
  }

  function pickPageTelemetry(pageKey) {
    return PAGE_TELEMETRY[pageKey] || PAGE_TELEMETRY.default;
  }

  function formatTelemetryToken(value = '') {
    return collapseWhitespace(value)
      .replace(/\.[a-z0-9]+$/i, '')
      .replace(/[-_]+/g, ' ')
      .replace(/[^a-z0-9\u00c0-\u024f ]+/gi, ' ')
      .trim();
  }

  function resolvePrimarySectionToken(section) {
    if (section.id) {
      return formatTelemetryToken(section.id) || 'operational layer';
    }

    const token = Array.from(section.classList)
      .map(item => item.replace(/--[a-z-]+$/i, ''))
      .find(item => item && !GENERIC_SECTION_CLASSES.has(item));

    if (token) {
      return formatTelemetryToken(token) || 'operational layer';
    }

    const screenToken = section.dataset.screenLabel ? section.dataset.screenLabel.split('.').pop() : '';
    return formatTelemetryToken(screenToken) || 'operational layer';
  }

  function resolveSectionHeading(section, fallback) {
    const heading = section.querySelector('h1, h2, h3, .eyebrow');
    return collapseWhitespace(heading ? heading.textContent : fallback);
  }

  function resolveSectionTone(section) {
    if (section.matches('.hero, .page-hero, .cta')) return 'dark';
    if (section.matches('.legal-hero, .legal-shell')) return 'light';
    if (/--warm|home-command-band|home-proof|intake-strip|careers-band|clients-section/i.test(section.className)) return 'warm';
    return 'light';
  }

  function getSignalInsertion(section) {
    const container = Array.from(section.children).find(child => child.classList && (child.classList.contains('container') || child.classList.contains('container--narrow')));
    if (container) {
      return { type: 'prepend', parent: container };
    }

    const before = Array.from(section.children).find(child => child.nodeType === 1 && !child.matches('.hero__bg, .hero__img, .page-hero__img, .hero__map, .technical-hero, .grain, .cta__bg'));
    if (before) {
      return { type: 'before', parent: section, before };
    }

    return { type: 'prepend', parent: section };
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

  function normalizeConsent(value = {}) {
    return {
      necessary: true,
      analytics: value.analytics === true,
      decided: value.decided === true,
    };
  }

  function readConsent() {
    try {
      const raw = localStorage.getItem(CONSENT_STORAGE_KEY);
      if (raw) {
        return normalizeConsent(JSON.parse(raw));
      }

      if (localStorage.getItem(LEGACY_COOKIE_ACK_KEY) === '1') {
        const migrated = normalizeConsent({ decided: true, analytics: false });
        localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(migrated));
        return migrated;
      }
    } catch {}

    return normalizeConsent();
  }

  function writeConsent(value) {
    const normalized = normalizeConsent({ ...value, decided: true });

    try {
      localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(normalized));
      localStorage.setItem(LEGACY_COOKIE_ACK_KEY, '1');
    } catch {}

    return normalized;
  }

  function hasAnalyticsConsent() {
    return readConsent().analytics === true;
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
    if (!hasAnalyticsConsent()) return;

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

    const payload = {
      event: eventName,
      page: globalThis.location.pathname || '/',
      timestamp: new Date().toISOString(),
      ...data,
    };

    if (hasAnalyticsConsent()) {
      const dataLayer = ensureDataLayer();
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
        <a href="gdpr.html" class="footer__legal-link">Confidențialitate & mențiuni legale</a>
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
    if (readConsent().decided) return;

    const banner = h('div', { class: 'cookie-banner', role: 'region', 'aria-label': 'Cookie consent' });
    banner.innerHTML = `
      <p>
        Acest site folosește cookie-uri funcționale necesare pentru funcționarea corectă a paginii.
        Statisticile de utilizare rămân inactive până la acordul dumneavoastră explicit.
        <a href="gdpr.html">Confidențialitate & mențiuni legale →</a>
      </p>
      <div class="cookie-banner__actions">
        <button class="btn btn--accent cookie-banner__btn" data-cookie-analytics>Accept statistice</button>
        <button class="btn btn--ghost-dark cookie-banner__btn" data-cookie-essential>Doar esențiale</button>
        <a href="gdpr.html" class="btn btn--ghost-dark cookie-banner__btn">Detalii</a>
      </div>
    `;
    document.body.appendChild(banner);

    banner.querySelector('[data-cookie-analytics]').addEventListener('click', () => {
      writeConsent({ analytics: true });
      mountAnalytics();
      banner.classList.add('cookie-banner--hidden');
    });

    banner.querySelector('[data-cookie-essential]').addEventListener('click', () => {
      writeConsent({ analytics: false });
      banner.classList.add('cookie-banner--hidden');
    });
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
    const els = Array.from(document.querySelectorAll('[data-reveal]'));
    if (!els.length) return;

    const immediateEls = els.filter(el => el.closest('.hero'));
    immediateEls.forEach(el => el.classList.add('is-revealed'));

    const observedEls = els.filter(el => !el.classList.contains('is-revealed'));
    if (!observedEls.length || !('IntersectionObserver' in globalThis)) {
      observedEls.forEach(el => el.classList.add('is-revealed'));
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
    observedEls.forEach(el => io.observe(el));
  }

  function mountMediaGalleries({ selector = '.media-gallery', galleries = {}, autoplayMs = 0 } = {}) {
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

      function autoplayEnabled() {
        return Number.isFinite(autoplayMs) && autoplayMs > 0;
      }

      function startAutoplay() {
        stopAutoplay();
        if (slides.length < 2 || !autoplayEnabled()) return;
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

  function mountSystemMaps() {
    const hosts = document.querySelectorAll('[data-system-map]');
    if (!hosts.length) return;

    hosts.forEach(host => {
      const nodes = Array.from(host.querySelectorAll('[data-system-map-node]'));
      const codeEl = host.querySelector('[data-system-map-code]');
      const titleEl = host.querySelector('[data-system-map-title]');
      const bodyEl = host.querySelector('[data-system-map-body]');
      const linksEl = host.querySelector('[data-system-map-links]');
      const ctaEl = host.querySelector('[data-system-map-cta]');

      if (!nodes.length || !codeEl || !titleEl || !bodyEl || !linksEl || !ctaEl) {
        return;
      }

      function render(node) {
        nodes.forEach(item => item.classList.toggle('is-active', item === node));

        codeEl.textContent = node.dataset.mapCode || '';
        titleEl.textContent = node.dataset.mapTitle || node.textContent.trim();
        bodyEl.textContent = node.dataset.mapBody || '';
        linksEl.innerHTML = '';

        const tags = String(node.dataset.mapLinks || '')
          .split('|')
          .map(tag => tag.trim())
          .filter(Boolean);

        tags.forEach(tag => {
          const badge = document.createElement('span');
          badge.className = 'badge';
          badge.textContent = tag;
          linksEl.appendChild(badge);
        });

        const target = String(node.dataset.serviceTarget || '').trim();
        if (target) {
          ctaEl.href = `#${target}`;
          ctaEl.textContent = 'Vezi familia în detaliu →';
        } else {
          ctaEl.href = 'contact.html';
          ctaEl.textContent = 'Solicită analiză tehnică →';
        }
      }

      nodes.forEach(node => {
        node.addEventListener('mouseenter', () => render(node));
        node.addEventListener('focus', () => render(node));
        node.addEventListener('click', () => {
          render(node);
          const target = String(node.dataset.serviceTarget || '').trim();
          if (target && typeof globalThis.DasitradeSite?.setServiceSlide === 'function') {
            globalThis.DasitradeSite.setServiceSlide(target);
          }
        });
      });

      render(nodes.find(node => node.dataset.default === 'true') || nodes[0]);
    });
  }

  function mountTechnicalHeroes() {
    const hosts = document.querySelectorAll('[data-technical-hero]');
    if (!hosts.length) return;

    const reducedMotion = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;

    hosts.forEach(host => {
      if (host.dataset.mounted === 'true') return;
      host.dataset.mounted = 'true';

      const canvas = h('canvas', { class: 'technical-hero__canvas', 'aria-hidden': 'true' });
      const nodesLayer = h('div', { class: 'technical-hero__nodes' });
      const legend = h('div', { class: 'technical-hero__legend' });
      const legendTitle = h('div', { class: 'technical-hero__legend-title' }, 'Model operațional 3D');
      const legendBody = h('p', { class: 'technical-hero__legend-body' }, 'Privit dintr-o singură perspectivă: incendiu, CCTV, acces, voice-data și BMS corelate într-un singur nucleu de proiectare și exploatare.');
      const legendMetrics = h('div', { class: 'technical-hero__legend-metrics' });

      ['6 subsisteme corelate', 'proiectare -> execuție -> PIF', 'service și intervenție 24/7'].forEach(metric => {
        legendMetrics.appendChild(h('span', { class: 'technical-hero__legend-metric' }, metric));
      });

      legend.appendChild(legendTitle);
      legend.appendChild(legendBody);
      legend.appendChild(legendMetrics);

      const panel = h('aside', { class: 'technical-hero__panel' });
      const panelKicker = h('div', { class: 'technical-hero__panel-kicker' }, 'Sistem activ');
      const panelCode = h('div', { class: 'technical-hero__panel-code' });
      const panelTitle = h('h3', { class: 'technical-hero__panel-title' });
      const panelBody = h('p', { class: 'technical-hero__panel-body' });
      const panelLinks = h('div', { class: 'badge-row technical-hero__panel-links' });
      const panelCta = h('a', { class: 'btn btn--ghost-dark technical-hero__cta', href: 'servicii.html' }, 'Vezi familia în detaliu →');

      panel.appendChild(panelKicker);
      panel.appendChild(panelCode);
      panel.appendChild(panelTitle);
      panel.appendChild(panelBody);
      panel.appendChild(panelLinks);
      panel.appendChild(panelCta);

      const systems = TECHNICAL_HERO_SYSTEMS.map((system, index) => {
        const button = h('button', {
          class: 'technical-hero__node',
          type: 'button',
          'data-system-key': system.key,
        });

        button.innerHTML = `
          <span class="technical-hero__node-code">${system.code}</span>
          <span class="technical-hero__node-label">${system.label}</span>
        `;

        nodesLayer.appendChild(button);

        return {
          ...system,
          button,
          packetOffset: index / TECHNICAL_HERO_SYSTEMS.length,
        };
      });

      host.appendChild(canvas);
      host.appendChild(legend);
      host.appendChild(panel);
      host.appendChild(nodesLayer);

      const context = canvas.getContext('2d');
      if (!context) return;

      let activeIndex = 0;
      let width = 0;
      let height = 0;
      let deviceScale = 1;
      let animationFrame = null;
      let lastSizeKey = '';
      let inView = true;
      const pointer = { currentX: 0, currentY: 0, targetX: 0, targetY: 0 };
      const projectedNodes = new Map();

      function setActive(index) {
        activeIndex = ((index % systems.length) + systems.length) % systems.length;
        const active = systems[activeIndex];

        systems.forEach((system, systemIndex) => {
          system.button.classList.toggle('is-active', systemIndex === activeIndex);
        });

        panelCode.textContent = active.code;
        panelTitle.textContent = active.title;
        panelBody.textContent = active.body;
        panelLinks.innerHTML = '';

        active.links.forEach(tag => {
          panelLinks.appendChild(h('span', { class: 'badge' }, tag));
        });

        panelCta.href = active.href;
      }

      function resize() {
        const rect = host.getBoundingClientRect();
        const nextWidth = Math.max(1, Math.round(rect.width));
        const nextHeight = Math.max(1, Math.round(rect.height));
        const key = `${nextWidth}x${nextHeight}`;
        if (key === lastSizeKey) return;

        lastSizeKey = key;
        width = nextWidth;
        height = nextHeight;
        deviceScale = Math.min(globalThis.devicePixelRatio || 1, 2);

        canvas.width = Math.floor(width * deviceScale);
        canvas.height = Math.floor(height * deviceScale);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        context.setTransform(deviceScale, 0, 0, deviceScale, 0, 0);
      }

      function rotatePoint(point, angleX, angleY) {
        const cosY = Math.cos(angleY);
        const sinY = Math.sin(angleY);
        const x1 = point.x * cosY - point.z * sinY;
        const z1 = point.x * sinY + point.z * cosY;

        const cosX = Math.cos(angleX);
        const sinX = Math.sin(angleX);
        const y2 = point.y * cosX - z1 * sinX;
        const z2 = point.y * sinX + z1 * cosX;

        return { x: x1, y: y2, z: z2 };
      }

      function project(point, centerX, centerY) {
        const perspective = 980;
        const depthShift = point.z + 420;
        const scale = perspective / (perspective + depthShift);
        return {
          x: centerX + point.x * scale,
          y: centerY + point.y * scale,
          scale,
          alpha: Math.max(0.26, Math.min(1, 0.18 + scale * 0.98)),
        };
      }

      function drawGrid(now, angleX, angleY, centerX, centerY, layoutScale) {
        const planeY = 190 * layoutScale;
        const spanX = 440 * layoutScale;
        const spanZStart = -240 * layoutScale;
        const spanZEnd = 320 * layoutScale;
        const stepX = Math.max(56, Math.round(88 * layoutScale));
        const stepZ = Math.max(52, Math.round(72 * layoutScale));
        context.save();
        context.lineWidth = 1;

        for (let x = -spanX; x <= spanX; x += stepX) {
          const from = project(rotatePoint({ x, y: planeY, z: spanZStart }, angleX, angleY), centerX, centerY);
          const to = project(rotatePoint({ x, y: planeY, z: spanZEnd }, angleX, angleY), centerX, centerY);
          context.strokeStyle = 'rgba(132, 211, 166, 0.08)';
          context.beginPath();
          context.moveTo(from.x, from.y);
          context.lineTo(to.x, to.y);
          context.stroke();
        }

        for (let z = -220 * layoutScale; z <= 360 * layoutScale; z += stepZ) {
          const from = project(rotatePoint({ x: -spanX, y: planeY, z }, angleX, angleY), centerX, centerY);
          const to = project(rotatePoint({ x: spanX, y: planeY, z }, angleX, angleY), centerX, centerY);
          context.strokeStyle = z === 68 ? 'rgba(146, 191, 255, 0.13)' : 'rgba(132, 211, 166, 0.07)';
          context.beginPath();
          context.moveTo(from.x, from.y);
          context.lineTo(to.x, to.y);
          context.stroke();
        }

        const sweep = ((now * 0.035) % 1) * width;
        const gradient = context.createLinearGradient(sweep - 220, 0, sweep + 220, 0);
        gradient.addColorStop(0, 'rgba(132, 211, 166, 0)');
        gradient.addColorStop(0.5, 'rgba(132, 211, 166, 0.08)');
        gradient.addColorStop(1, 'rgba(132, 211, 166, 0)');
        context.fillStyle = gradient;
        context.fillRect(0, 0, width, height);
        context.restore();
      }

      function drawCore(now, centerX, centerY, layoutScale) {
        context.save();
        context.translate(centerX, centerY);

        context.strokeStyle = 'rgba(132, 211, 166, 0.34)';
        context.lineWidth = 1;
        for (let ring = 0; ring < 3; ring++) {
          context.beginPath();
          context.arc(0, 0, (72 + ring * 26 + Math.sin(now * 0.0012 + ring) * 3) * layoutScale, 0, Math.PI * 2);
          context.stroke();
        }

        context.fillStyle = 'rgba(132, 211, 166, 0.18)';
        context.beginPath();
        context.arc(0, 0, 42 * layoutScale, 0, Math.PI * 2);
        context.fill();

        context.fillStyle = '#f6f8fb';
        context.beginPath();
        context.arc(0, 0, Math.max(4.5, 7 * layoutScale), 0, Math.PI * 2);
        context.fill();

        context.restore();
      }

      function frame(now) {
        animationFrame = globalThis.requestAnimationFrame(frame);
        if (!inView) return;

        resize();

        pointer.currentX += (pointer.targetX - pointer.currentX) * 0.06;
        pointer.currentY += (pointer.targetY - pointer.currentY) * 0.06;

        context.clearRect(0, 0, width, height);
        projectedNodes.clear();

        const time = reducedMotion ? 0 : now * 0.001;
        const compact = width < 720;
        const layoutScale = Math.min(1, Math.max(0.52, Math.min(width / 840, height / 520)));
        const depthScale = 0.82 + layoutScale * 0.22;
        const centerX = width * (compact ? 0.5 : 0.48);
        const centerY = height * (compact ? 0.52 : 0.56);
        const angleY = pointer.currentX * 0.3 + Math.sin(time * 0.24) * 0.08;
        const angleX = -0.16 + pointer.currentY * 0.16 + Math.cos(time * 0.18) * 0.04;

        drawGrid(now, angleX, angleY, centerX, centerY, layoutScale);

        const coreProjection = { x: centerX, y: centerY };

        const runtimeNodes = systems.map(system => {
          const point = {
            x: (system.base.x + Math.cos(time * 0.82 + system.phase) * system.drift.x) * layoutScale,
            y: (system.base.y + Math.sin(time * 0.76 + system.phase) * system.drift.y) * layoutScale,
            z: (system.base.z + Math.sin(time * 0.58 + system.phase) * system.drift.z) * depthScale,
          };

          const rotated = rotatePoint(point, angleX, angleY);
          const projection = project(rotated, centerX, centerY);

          return { system, point: rotated, projection };
        }).sort((left, right) => left.point.z - right.point.z);

        runtimeNodes.forEach(({ system, projection }) => {
          projectedNodes.set(system.key, projection);

          context.save();
          context.strokeStyle = system.color.replace('0.9', '0.22').replace('0.95', '0.22').replace('0.94', '0.22').replace('0.92', '0.22').replace('0.88', '0.22').replace('0.84', '0.22');
          context.lineWidth = projection.scale > 0.72 ? 1.4 : 1;
          context.beginPath();
          context.moveTo(coreProjection.x, coreProjection.y);
          context.lineTo(projection.x, projection.y);
          context.stroke();

          const packetProgress = (time * 0.22 + system.packetOffset) % 1;
          const packetX = coreProjection.x + (projection.x - coreProjection.x) * packetProgress;
          const packetY = coreProjection.y + (projection.y - coreProjection.y) * packetProgress;
          context.fillStyle = system.color;
          context.beginPath();
          context.arc(packetX, packetY, (2.2 + projection.scale * 1.8) * layoutScale, 0, Math.PI * 2);
          context.fill();

          context.fillStyle = system.color.replace('0.9', '0.12').replace('0.95', '0.12').replace('0.94', '0.12').replace('0.92', '0.12').replace('0.88', '0.12').replace('0.84', '0.12');
          context.beginPath();
          context.arc(projection.x, projection.y, 16 * projection.scale * layoutScale, 0, Math.PI * 2);
          context.fill();

          context.fillStyle = system.color;
          context.beginPath();
          context.arc(projection.x, projection.y, (4.5 + projection.scale * 3.6) * layoutScale, 0, Math.PI * 2);
          context.fill();
          context.restore();
        });

        drawCore(now, centerX, centerY, layoutScale);

        systems.forEach((system, index) => {
          const projection = projectedNodes.get(system.key);
          if (!projection) return;

          system.button.style.left = `${projection.x}px`;
          system.button.style.top = `${projection.y}px`;
          system.button.style.opacity = `${Math.max(compact ? 0.3 : 0.42, projection.alpha * (compact ? 0.76 : 1))}`;
          system.button.style.transform = `translate(-50%, -50%) scale(${Math.max(compact ? 0.58 : 0.74, Math.min(compact ? 0.88 : 1.02, projection.scale * (compact ? 0.86 : 1.04) * layoutScale))})`;
          system.button.style.zIndex = String(100 + Math.round(projection.scale * 40) + (index === activeIndex ? 20 : 0));
        });
      }

      host.addEventListener('pointermove', event => {
        const rect = host.getBoundingClientRect();
        const px = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        const py = ((event.clientY - rect.top) / rect.height) * 2 - 1;
        pointer.targetX = Math.max(-1, Math.min(1, px));
        pointer.targetY = Math.max(-1, Math.min(1, py));
      });

      host.addEventListener('pointerleave', () => {
        pointer.targetX = 0;
        pointer.targetY = 0;
      });

      systems.forEach((system, index) => {
        system.button.addEventListener('mouseenter', () => setActive(index));
        system.button.addEventListener('focus', () => setActive(index));
        system.button.addEventListener('click', () => setActive(index));
      });

      if ('ResizeObserver' in globalThis) {
        const observer = new ResizeObserver(resize);
        observer.observe(host);
      }

      if ('IntersectionObserver' in globalThis) {
        const observer = new IntersectionObserver(entries => {
          entries.forEach(entry => {
            inView = entry.isIntersecting;
          });
        }, { threshold: 0.01 });

        observer.observe(host);
      }

      setActive(0);
      resize();
      animationFrame = globalThis.requestAnimationFrame(frame);
    });
  }

  function mountPageHeroTelemetry(pageKey) {
    const config = pickPageTelemetry(pageKey);
    const hosts = document.querySelectorAll('.page-hero, .legal-hero');
    if (!hosts.length) return;

    hosts.forEach(host => {
      if (host.dataset.pageTelemetryMounted === 'true') return;
      host.dataset.pageTelemetryMounted = 'true';
      host.classList.add('page-hero--technical');
      host.dataset.telemetryTone = host.matches('.legal-hero') ? 'light' : 'dark';

      const content = host.querySelector('.page-hero__content, .container');
      if (content) {
        const signal = h('div', { class: 'page-hero__signal', 'aria-hidden': 'true' });
        signal.appendChild(h('span', { class: 'page-hero__signal-code' }, config.signalCode));
        signal.appendChild(h('span', { class: 'page-hero__signal-title' }, config.signalTitle));

        const metrics = h('div', { class: 'page-hero__signal-metrics' });
        config.metrics.forEach(metric => {
          metrics.appendChild(h('span', { class: 'page-hero__signal-metric' }, metric));
        });
        signal.appendChild(metrics);

        const meta = content.querySelector('.page-hero__meta');
        if (meta && meta.nextSibling) {
          content.insertBefore(signal, meta.nextSibling);
        } else if (meta) {
          meta.insertAdjacentElement('afterend', signal);
        } else {
          content.prepend(signal);
        }
      }

      const stage = h('div', { class: 'page-hero__technical-stage', 'aria-hidden': 'true' });
      stage.appendChild(h('div', { class: 'page-hero__technical-grid' }));
      stage.appendChild(h('div', { class: 'page-hero__technical-core' }));

      config.nodes.forEach((node, index) => {
        const item = h('div', {
          class: 'page-hero__technical-node',
          style: `--x:${node.x}; --y:${node.y}; --delay:${index * 140}ms;`
        });
        item.appendChild(h('span', { class: 'page-hero__technical-node-code' }, node.code));
        item.appendChild(h('span', { class: 'page-hero__technical-node-label' }, node.label));
        stage.appendChild(item);
      });

      host.appendChild(stage);
    });
  }

  function mountSectionTelemetry(pageKey) {
    const config = pickPageTelemetry(pageKey);
    const sections = document.querySelectorAll('section');
    if (!sections.length) return;

    let index = 0;

    sections.forEach(section => {
      if (section.matches('.hero')) {
        section.classList.add('tech-surface');
        section.dataset.telemetryTone = 'dark';
        return;
      }

      section.classList.add('tech-surface');
      section.dataset.telemetryTone = resolveSectionTone(section);

      if (section.matches('.page-hero, .legal-hero')) return;
      if (section.dataset.sectionTelemetryMounted === 'true') return;

      section.dataset.sectionTelemetryMounted = 'true';
      index += 1;

      const token = resolvePrimarySectionToken(section) || 'operational layer';
      const bar = h('div', { class: 'section-signal', 'aria-hidden': 'true' });
      bar.appendChild(h('span', { class: 'section-signal__code' }, `${config.prefix} / ${String(index).padStart(2, '0')}`));
      bar.appendChild(h('span', { class: 'section-signal__label' }, token.toUpperCase()));
      bar.appendChild(h('span', { class: 'section-signal__line' }));
      bar.appendChild(h('span', { class: 'section-signal__meta' }, resolveSectionHeading(section, token)));

      const insertion = getSignalInsertion(section);
      if (insertion.type === 'before' && insertion.before) {
        insertion.parent.insertBefore(bar, insertion.before);
      } else {
        insertion.parent.prepend(bar);
      }
    });
  }

  globalThis.DasitradeSite = {
    init({ current, navVariant = 'dark' } = {}) {
      const pageKey = inferPageKey(current);
      ensureFormToken();
      mountNav(current, navVariant);
      mountFooter();
      mountReveal();
      mountPageHeroTelemetry(pageKey);
      mountSectionTelemetry(pageKey);
      mountTechnicalHeroes();
      mountSystemMaps();
      mountCookieBanner();
      mountAnalytics();
      mountWhatsApp();
      mountFloatingAvoidFooter();
      mountTracking();
    },
    mountMediaGalleries(options) {
      mountMediaGalleries(options);
    },
    mountSystemMaps() {
      mountSystemMaps();
    },
    mountTechnicalHeroes() {
      mountTechnicalHeroes();
    },
    mountPageHeroTelemetry(current) {
      mountPageHeroTelemetry(inferPageKey(current));
    },
    mountSectionTelemetry(current) {
      mountSectionTelemetry(inferPageKey(current));
    },
    track(eventName, data) {
      track(eventName, data);
    }
  };
})();
