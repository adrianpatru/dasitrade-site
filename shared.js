// Shared UI — nav, footer, CCTV dispatch widget
(function () {
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
    brand.innerHTML = `
      <svg viewBox="0 0 260 48" aria-hidden="true">
        <rect x="2" y="8" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.5"/>
        <rect x="10" y="16" width="16" height="16" fill="currentColor"/>
        <line x1="2" y1="24" x2="34" y2="24" stroke="currentColor" stroke-width="1" opacity="0.4"/>
        <text x="48" y="31" font-family="'JetBrains Mono', ui-monospace, monospace" font-size="17" font-weight="500" letter-spacing="4" fill="currentColor">DASITRADE</text>
      </svg>
    `;
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
          <div class="footer__brand">Dasitrade</div>
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
      <div class="footer__bottom">
        <span>© 2006–2026 Dasitrade SRL · CUI RO 18802465</span>
        <a href="gdpr.html" style="color:var(--fg-dark-dim);font-size:12px;font-family:var(--mono);letter-spacing:0.12em;">Politica de confidențialitate</a>
      </div>
    `;
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
      }, 1600);
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
    }
  };
})();
