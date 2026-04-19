// Shared UI — nav, footer, CCTV dispatch widget
(function () {

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
      h('span', {}, 'DISPATCH 24/7'),
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
          <p style="margin-top:16px; color:var(--fg-dark-dim); font-size:14px; line-height:1.6; max-width:34ch;">
            Sisteme integrate de securitate, operând din Bacău din 2006. Proiectare, instalare, mentenanță — fără ferestre oarbe.
          </p>
        </div>
        <div class="footer__col">
          <div class="footer__col-label">Sediu</div>
          <p>Bacău<br/>Str. Nufărului Nr. 10<br/>Bl. 10, Sc. B, Et. 3, Ap. 7</p>
        </div>
        <div class="footer__col">
          <div class="footer__col-label">Dispatch</div>
          <a href="tel:0334401092">0334 401 092</a>
          <a href="tel:0728030268">0728 030 268</a>
          <a href="tel:0234571178">0234 571 178</a>
        </div>
        <div class="footer__col">
          <div class="footer__col-label">Contact</div>
          <a href="mailto:office@dasitrade.ro">office@dasitrade.ro</a>
          <a href="mailto:tehnic@dasitrade.ro">tehnic@dasitrade.ro</a>
          <a href="mailto:service@dasitrade.ro">service@dasitrade.ro</a>
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
        <span>© 2006–2026 Dasitrade SRL · CUI RO 18802465</span>
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
    const el = h('div', { class: 'dispatch dispatch--collapsed', 'data-dispatch': '' });
    el.innerHTML = `
      <div class="dispatch__head">
        <span><span class="dispatch__head-dot"></span>LIVE · DISPATCH</span>
        <span data-dispatch-toggle>[ EXPAND ]</span>
      </div>
      <div class="dispatch__grid">
        <div class="dispatch__cell">
          <span class="dispatch__cell-label">CAM-01 · SEDIU</span>
          <span class="dispatch__cell-status"></span>
          <div class="dispatch__cell-fig"></div>
          <div class="dispatch__cell-scan"></div>
        </div>
        <div class="dispatch__cell">
          <span class="dispatch__cell-label">CAM-02 · ACCES</span>
          <span class="dispatch__cell-status"></span>
          <div class="dispatch__cell-fig"></div>
          <div class="dispatch__cell-scan" style="animation-delay:-1.5s"></div>
        </div>
        <div class="dispatch__cell">
          <span class="dispatch__cell-label">CAM-03 · PERIMETRU</span>
          <span class="dispatch__cell-status"></span>
          <div class="dispatch__cell-fig"></div>
          <div class="dispatch__cell-scan" style="animation-delay:-2.8s"></div>
        </div>
        <div class="dispatch__cell">
          <span class="dispatch__cell-label">CAM-04 · INTERIOR</span>
          <span class="dispatch__cell-status"></span>
          <div class="dispatch__cell-fig"></div>
          <div class="dispatch__cell-scan" style="animation-delay:-3.4s"></div>
        </div>
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
      const overlay = h('div', {}, []);
      overlay.style.cssText = `
        position: fixed; inset: 0; z-index: 9999;
        background: #000;
        opacity: 1;
        transition: opacity 500ms ease;
      `;
      const iframe = h('iframe', {
        src: 'intro.html',
        style: 'width:100%;height:100%;border:0;display:block;',
      });
      overlay.appendChild(iframe);
      document.body.appendChild(overlay);
      // 1.5s intro + 0.2s buffer, then fade
      setTimeout(() => {
        overlay.style.opacity = '0';
        setTimeout(() => {
          overlay.remove();
          sessionStorage.setItem('dasitrade_splash_seen', '1');
        }, 500);
      }, 3900);
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

  globalThis.DasitradeSite = {
    init({ current, navVariant = 'dark' } = {}) {
      maybeSplash();
      mountNav(current, navVariant);
      mountFooter();
      mountDispatch();
      mountReveal();
      mountCookieBanner();
      mountWhatsApp();
    }
  };
})();
