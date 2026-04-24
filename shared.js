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

  const BRAND_LOCKUP = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 48" class="brand-lockup__svg" aria-hidden="true" focusable="false">
      <g fill="none" stroke="currentColor" stroke-width="1.5">
        <rect x="2" y="8" width="32" height="32"></rect>
        <line x1="2" y1="24" x2="34" y2="24" opacity="0.4"></line>
      </g>
      <rect x="10" y="16" width="16" height="16" fill="currentColor"></rect>
      <text x="48" y="31" font-family="'JetBrains Mono', ui-monospace, monospace" font-size="17" font-weight="500" letter-spacing="4" fill="currentColor">DASITRADE</text>
    </svg>`;

  const TECHNICAL_HERO_SYSTEMS = [
    {
      key: 'idsai',
      code: '01 / FIRE-DET',
      label: 'Incendiu',
      title: 'Detecție, alarmare și evacuare',
      body: 'IDSAI, desfumare și stingere într-un singur lanț critic.',
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
      title: 'Video și context operațional',
      body: 'Analitice și audit pentru validare rapidă în exploatare.',
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
      title: 'Perimetru și prealarmă',
      body: 'Detecție corelată cu acces, video și dispecerat.',
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
      title: 'Identitate și traseu auditat',
      body: 'Separă zonele și leagă evenimentul de persoană.',
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
      title: 'Backbone pentru ecosistem',
      body: 'Fibră, cupru și PoE pentru subsistemele critice.',
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
      title: 'Un strat comun de comandă',
      body: 'Integrarea adună stări și scenarii într-un singur punct.',
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
        {
          code: 'FIRE',
          label: 'alarmare',
          title: 'Incendiu tratat ca scenariu complet',
          body: 'Detectie, desfumare, stingere si evacuare vocala intr-un singur flux.',
          href: 'servicii.html#idsai',
          x: '18%',
          y: '20%'
        },
        {
          code: 'CCTV',
          label: 'validare video',
          title: 'Video pentru confirmare rapida',
          body: 'CCTV si analitice care scurteaza decizia in exploatare.',
          href: 'servicii.html#cctv',
          x: '82%',
          y: '26%'
        },
        {
          code: 'ACC',
          label: 'control acces',
          title: 'Acces segmentat si auditabil',
          body: 'Zone, identitate si evenimente urmaribile fara ambiguitate.',
          href: 'servicii.html#acces',
          x: '70%',
          y: '70%'
        },
        {
          code: 'BMS',
          label: 'nucleu comun',
          title: 'Integrare intr-un singur punct de comanda',
          body: 'BMS-ul reduce fragmentarea si ordoneaza exploatarea.',
          href: 'servicii.html#bms',
          x: '24%',
          y: '72%'
        },
      ],
    },
    portofoliu: {
      prefix: 'CAS',
      signalCode: 'CASE / OPS',
      signalTitle: 'Rezultat masurat in exploatare',
      metrics: ['12 selectii', 'NDA ready', 'multi-sistem'],
      nodes: [
        {
          code: 'IND',
          label: 'industrial',
          title: 'Industrial fara loc pentru ambiguitate',
          body: 'Cazuri unde executia si exploatarea au trebuit sa ramana clare.',
          href: 'portofoliu.html#studii-de-caz',
          x: '20%',
          y: '20%'
        },
        {
          code: 'MED',
          label: 'medical',
          title: 'Medical si incendiu sub control',
          body: 'Integrari pentru cladiri unde continuitatea si reactia corecta sunt critice.',
          href: 'portofoliu.html#studii-de-caz',
          x: '82%',
          y: '28%'
        },
        {
          code: 'PUB',
          label: 'public',
          title: 'Cladiri publice cu audit clar',
          body: 'Sisteme care lasa urme verificabile si sustin exploatarea zilnica.',
          href: 'portofoliu.html#studii-de-caz',
          x: '66%',
          y: '72%'
        },
        {
          code: 'DC',
          label: 'camere tehnice',
          title: 'Protectie pentru camere tehnice',
          body: 'Detectie, stingere si integrare pentru zone cu toleranta minima la risc.',
          href: 'portofoliu.html#studii-de-caz',
          x: '24%',
          y: '74%'
        },
      ],
    },
    despre: {
      prefix: 'ORG',
      signalCode: 'ORG / OPS',
      signalTitle: 'Capacitate structurata operational',
      metrics: ['30+ echipa', 'autorizari active', 'service & dispecerat'],
      nodes: [
        {
          code: 'TEAM',
          label: 'executie',
          title: 'Echipe stabile pentru executie',
          body: 'Proiectare, executie si service in acelasi flux.',
          href: 'despre.html#auth-slider',
          x: '18%',
          y: '22%'
        },
        {
          code: 'AUTH',
          label: 'autorizari',
          title: 'Autorizari care sustin lucrarea',
          body: 'Conformitate si trasabilitate tratate ca parte din livrare.',
          href: 'despre.html#auth-slider',
          x: '82%',
          y: '24%'
        },
        {
          code: 'PIF',
          label: 'punere in functiune',
          title: 'Punere in functiune fara improvizatii',
          body: 'Testarea finala transforma sistemul in exploatare reala.',
          href: 'servicii.html',
          x: '70%',
          y: '70%'
        },
        {
          code: 'OPS',
          label: 'raspuns 24/7',
          title: 'Raspuns 24/7 cu context tehnic',
          body: 'Diagnostic, istoric si interventie coordonata.',
          href: 'contact.html',
          x: '26%',
          y: '72%'
        },
      ],
    },
    contact: {
      prefix: 'CNT',
      signalCode: 'LINK / RESPONSE',
      signalTitle: 'Canale tehnice prioritizate',
      metrics: ['oferta in 48h', 'call-center 24/7', 'evaluare teren'],
      nodes: [
        {
          code: 'CALL',
          label: 'urgente',
          title: 'Call-center pentru urgente',
          body: 'Canalul rapid pentru incidente, escaladare si triere.',
          href: 'tel:0334401092',
          x: '18%',
          y: '20%'
        },
        {
          code: 'MAIL',
          label: 'ofertare',
          title: 'Email pentru ofertare si documente',
          body: 'Brief-uri, planuri si clarificari tehnice intr-un fir usor de urmarit.',
          href: 'contact.html#contact-form',
          x: '82%',
          y: '24%'
        },
        {
          code: 'MAP',
          label: 'sediu Bacau',
          title: 'Sediu pentru intalniri si evaluari',
          body: 'Punctul de pornire pentru vizite, acte si discutii tehnice.',
          href: 'contact.html#evaluare',
          x: '66%',
          y: '72%'
        },
        {
          code: 'SITE',
          label: 'rutare publica',
          title: 'Formular care trimite cererea corect',
          body: 'Separati rapid ofertarea, evaluarea si preluarea de sisteme existente.',
          href: 'contact.html#contact-form',
          x: '24%',
          y: '72%'
        },
      ],
    },
    cariere: {
      prefix: 'HRD',
      signalCode: 'CREW / BUILD',
      signalTitle: 'Roluri pentru teren si inginerie',
      metrics: ['3 roluri active', 'raspuns in 5 zile', 'teren + proiectare'],
      nodes: [
        {
          code: 'FIELD',
          label: 'tehnician',
          title: 'Teren pentru oameni care livreaza curat',
          body: 'Cablare, montaj si punere in functiune fara improvizatii.',
          href: 'cariere.html#jobs-list',
          x: '20%',
          y: '20%'
        },
        {
          code: 'DESIGN',
          label: 'proiectare',
          title: 'Proiectare aplicata in teren',
          body: 'Normative, integrare si decizii care rezista in executie.',
          href: 'cariere.html#jobs-list',
          x: '80%',
          y: '24%'
        },
        {
          code: 'PIF',
          label: 'punere in functiune',
          title: 'Punere in functiune cu diagnostic bun',
          body: 'Commissioning pentru sisteme stabile, reglate si documentate.',
          href: 'cariere.html#jobs-list',
          x: '68%',
          y: '72%'
        },
        {
          code: 'TEAM',
          label: 'candidatura',
          title: 'Aplicare cu raspuns clar',
          body: 'Formular scurt, discutie tehnica si decizie rapida.',
          href: 'cariere.html#aplica',
          x: '24%',
          y: '72%'
        },
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

  const PAGE_ROUTE_ORBITS = {
    home: {
      code: 'HOME / ORBIT',
      title: 'Intrare in spatiul tehnic',
      summary: 'Pagina principala ramane scena de orientare. Rutele de mai jos trimit direct in stratul relevant, fara sa repete aceeasi promisiune.',
      sections: [
        { code: 'ATLAS', label: 'capabilitati', meta: 'stack + livrare', href: 'index.html#capabilitati' },
        { code: 'SYS', label: 'servicii', meta: 'ecosistem tehnic', href: 'servicii.html#ecosistem-interactiv' },
        { code: 'CASE', label: 'portofoliu', meta: 'cazuri reale', href: 'portofoliu.html#studii-de-caz' },
        { code: 'LINK', label: 'contact', meta: 'brief tehnic', href: 'contact.html#contact-form' },
      ],
    },
    servicii: {
      code: 'SYS / ROUTE',
      title: 'Rute clare prin ecosistem',
      summary: 'Separarea intre ecosistem, familii, normativ, completari si exploatare face pagina mai usor de parcurs si elimina reluarea aceluiasi mesaj.',
      sections: [
        { code: 'MAP', label: 'ecosistem interactiv', meta: 'legaturi intre sisteme', href: 'servicii.html#ecosistem-interactiv' },
        { code: 'FAM', label: 'familii principale', meta: '10 nuclee tehnice', href: 'servicii.html#idsai' },
        { code: 'LAW', label: 'cadru normativ', meta: 'RO + UE', href: 'servicii.html#cadru-normativ' },
        { code: 'EXT', label: 'sisteme complementare', meta: 'ecosistem complet', href: 'servicii.html#sisteme-complementare' },
        { code: 'OPS', label: 'livrare & mentenanta', meta: 'PIF + service', href: 'servicii.html#livrare-mentenanta' },
      ],
    },
    portofoliu: {
      code: 'CASE / ROUTE',
      title: 'Citire rapida a rezultatelor',
      summary: 'Portofoliul nu mai concureaza intre galerie si argument. Rutele separa selectiile vizuale, studiile de caz si pasul urmator pentru o fisa completa.',
      sections: [
        { code: 'SEL', label: 'selectii proiecte', meta: 'index vizual', href: 'portofoliu.html' },
        { code: 'CASE', label: 'studii de caz', meta: 'problema - sistem - rezultat', href: 'portofoliu.html#studii-de-caz' },
        { code: 'SYS', label: 'servicii corelate', meta: 'stackul tehnic', href: 'servicii.html#ecosistem-interactiv' },
        { code: 'NDA', label: 'fisa sub NDA', meta: 'contact tehnic', href: 'contact.html#contact-form' },
      ],
    },
    despre: {
      code: 'ORG / ROUTE',
      title: 'Organizare citita ca sistem',
      summary: 'Despre nu trebuie sa repete vanzarea. Rutele duc separat catre identitate, structura operationala, autorizari si canalul de lucru cu clientul.',
      sections: [
        { code: 'ORG', label: 'identitate & model', meta: 'structura de baza', href: 'despre.html' },
        { code: 'AUTH', label: 'autorizari', meta: 'documente active', href: 'despre.html#auth-slider' },
        { code: 'OPS', label: 'livrare in teren', meta: 'PIF + service', href: 'servicii.html#livrare-mentenanta' },
        { code: 'LINK', label: 'contact tehnic', meta: 'evaluare si preluare', href: 'contact.html#evaluare' },
      ],
    },
    contact: {
      code: 'LINK / ROUTE',
      title: 'Canalul corect din prima',
      summary: 'Contactul trebuie sa trieze, nu sa repete. Fiecare ruta separa brief-ul, canalele directe, evaluarea pe teren si pasii urmatori.',
      sections: [
        { code: 'FORM', label: 'brief proiect', meta: 'oferta in 48h', href: 'contact.html#contact-form' },
        { code: 'CALL', label: 'canale directe', meta: 'call-center + email', href: 'contact.html' },
        { code: 'SITE', label: 'evaluare pe teren', meta: 'vizita + concept', href: 'contact.html#evaluare' },
        { code: 'JOIN', label: 'cariere', meta: 'roluri deschise', href: 'cariere.html#jobs-list' },
      ],
    },
    cariere: {
      code: 'CREW / ROUTE',
      title: 'Drum scurt prin roluri',
      summary: 'Pagina de cariere trebuie sa se citeasca rapid: de ce conteaza munca, ce roluri sunt deschise si unde trimiti aplicatia fara sa te invarti.',
      sections: [
        { code: 'WHY', label: 'de ce Dasitrade', meta: 'context de lucru', href: 'cariere.html' },
        { code: 'ROLE', label: 'roluri active', meta: 'teren + proiectare', href: 'cariere.html#jobs-list' },
        { code: 'APLY', label: 'formular de aplicare', meta: 'CV + mesaj', href: 'cariere.html#aplica' },
        { code: 'LINK', label: 'canal operational', meta: 'contact direct', href: 'contact.html#contact-form' },
      ],
    },
    gdpr: {
      code: 'DATA / ROUTE',
      title: 'Politica citita fara blocaje',
      summary: 'Pagina legala trebuie sa ramana clara. Rutele separa operatorul, datele, drepturile si canalul de solicitare, fara sa amestece limbajul juridic cu restul site-ului.',
      sections: [
        { code: 'CTRL', label: 'operatorul de date', meta: 'date de identificare', href: 'gdpr.html' },
        { code: 'DATA', label: 'ce date colectam', meta: 'formulare + resurse', href: 'gdpr.html' },
        { code: 'RIGHT', label: 'drepturile tale', meta: 'acces, stergere, opozitie', href: 'gdpr.html' },
        { code: 'MAIL', label: 'solicitare GDPR', meta: 'email direct', href: 'mailto:tehnic@dasitrade.ro?subject=Solicitare%20GDPR' },
      ],
    },
    error: {
      code: 'SAFE / ROUTE',
      title: 'Intoarcere rapida in zona publica',
      summary: 'Pagina 404 nu trebuie sa retina utilizatorul. Rutele de mai jos il duc inapoi in servicii, portofoliu sau contact, fara ramasite de continut redundant.',
      sections: [
        { code: 'HOME', label: 'pagina principala', meta: 'intrare generala', href: 'index.html' },
        { code: 'SYS', label: 'servicii', meta: 'stack tehnic', href: 'servicii.html#ecosistem-interactiv' },
        { code: 'CASE', label: 'portofoliu', meta: 'rezultate reale', href: 'portofoliu.html#studii-de-caz' },
        { code: 'LINK', label: 'contact', meta: 'brief si suport', href: 'contact.html#contact-form' },
      ],
    },
    default: {
      code: 'OPS / ROUTE',
      title: 'Ruteaza clar, nu aglomera',
      summary: 'Fiecare pagina publica trebuie sa indice stratul corect si sa pastreze restul continutului secundar pana cand este necesar.',
      sections: [
        { code: 'HOME', label: 'start', meta: 'pagina principala', href: 'index.html' },
        { code: 'SYS', label: 'servicii', meta: 'familii si ecosistem', href: 'servicii.html#ecosistem-interactiv' },
        { code: 'CASE', label: 'portofoliu', meta: 'studii de caz', href: 'portofoliu.html#studii-de-caz' },
        { code: 'LINK', label: 'contact', meta: 'brief tehnic', href: 'contact.html#contact-form' },
      ],
    },
  };

  const ROUTE_ORBIT_POSITIONS = [
    { x: '16%', y: '62%' },
    { x: '34%', y: '28%' },
    { x: '52%', y: '66%' },
    { x: '72%', y: '30%' },
    { x: '84%', y: '74%' },
    { x: '28%', y: '80%' },
  ];

  const TECHNICAL_NODE_COLORS = [
    'rgba(132, 211, 166, 0.95)',
    'rgba(146, 191, 255, 0.94)',
    'rgba(226, 204, 120, 0.92)',
    'rgba(132, 211, 166, 0.84)',
    'rgba(146, 191, 255, 0.88)',
    'rgba(132, 211, 166, 0.9)',
  ];

  let technicalSceneModulePromise = null;

  const GENERIC_SECTION_CLASSES = new Set(['section', 'page-hero', 'hero', 'cta', 'band']);
  const DEPTH_INTERACTION_SELECTOR = [
    '.home-command-band__card',
    '.intake-card',
    '.capability-atlas__card',
    '.service-page__item',
    '.service-extension-card',
    '.lifecycle-step',
    '.service-assurance__item',
    '.compliance-card',
    '.partner-card',
    '.contact-panel',
    '.contact-ops__card',
    '.contact-evaluation__card',
    '.contact-map__panel',
    '.contact-map__card',
    '.about-panel',
    '.about-certifications__card',
    '.about-market__card',
    '.about-ops-card',
    '.process-card',
    '.faq-item',
    '.job-card',
    '.case-study-card',
    '.systems-map__panel',
    '.route-orbit__panel',
    '.route-orbit__link'
  ].join(', ');

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

  function pickPageRouteOrbit(pageKey) {
    return PAGE_ROUTE_ORBITS[pageKey] || PAGE_ROUTE_ORBITS.default;
  }

  function loadTechnicalSceneModule() {
    if (!technicalSceneModulePromise) {
      technicalSceneModulePromise = import('./assets/technical-scene.js')
        .catch(error => {
          console.error('Dasitrade technical scene failed to load.', error);
          return null;
        });
    }

    return technicalSceneModulePromise;
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
    const brand = h('a', { class: 'nav__brand', href: 'index.html', 'aria-label': 'Dasitrade' });
    brand.innerHTML = `<span class="brand-lockup" aria-hidden="true">${BRAND_LOCKUP}</span>`;
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
          <span class="footer__logo brand-lockup" aria-hidden="true">${BRAND_LOCKUP}</span>
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

    loadTechnicalSceneModule().then(module => {
      const mountTechnicalScene = module?.mountTechnicalScene;

      hosts.forEach(host => {
        if (host.dataset.mounted === 'true') return;
        host.dataset.mounted = 'true';

        const hero = host.closest('.hero');
        const deckHost = hero?.querySelector('[data-hero-command-deck]');
        const canvas = h('canvas', { class: 'technical-hero__canvas', 'aria-hidden': 'true' });
        const nodesLayer = h('div', { class: 'technical-hero__nodes' });
        const panel = h('aside', { class: 'technical-hero__panel' });
        const panelCode = h('div', { class: 'technical-hero__panel-code' });
        const panelTitle = h('h3', { class: 'technical-hero__panel-title' });
        const panelBody = h('p', { class: 'technical-hero__panel-body' });
        let deckCode = null;
        let deckTitle = null;
        let deckBody = null;
        let deckTags = null;
        let deckLink = null;
        const deckButtons = [];
        let activeIndex = 0;
        let stageController = null;

        panel.appendChild(panelCode);
        panel.appendChild(panelTitle);
        panel.appendChild(panelBody);

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
            color: system.color || TECHNICAL_NODE_COLORS[index % TECHNICAL_NODE_COLORS.length],
            button,
            packetOffset: index / TECHNICAL_HERO_SYSTEMS.length,
          };
        });

        function seedButtons() {
          const rect = host.getBoundingClientRect();
          if (!rect.width || !rect.height) return;

          const compact = rect.width < 720;
          const layoutScale = Math.min(1, Math.max(0.52, Math.min(rect.width / 840, rect.height / 520)));
          const centerX = rect.width * (compact ? 0.5 : 0.48);
          const centerY = rect.height * (compact ? 0.52 : 0.56);

          systems.forEach((system, index) => {
            system.button.style.left = `${centerX + system.base.x * layoutScale * 0.72}px`;
            system.button.style.top = `${centerY + system.base.y * layoutScale * 0.72}px`;
            system.button.style.opacity = `${index === activeIndex ? 0.96 : 0.72}`;
            system.button.style.transform = `translate(-50%, -50%) scale(${index === activeIndex ? 0.92 : 0.76})`;
            system.button.style.zIndex = String(100 + index + (index === activeIndex ? 10 : 0));
          });
        }

        function setActive(index) {
          activeIndex = ((index % systems.length) + systems.length) % systems.length;
          const active = systems[activeIndex];

          systems.forEach((system, systemIndex) => {
            system.button.classList.toggle('is-active', systemIndex === activeIndex);
          });

          deckButtons.forEach((button, buttonIndex) => {
            const isActive = buttonIndex === activeIndex;
            button.classList.toggle('is-active', isActive);
            button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
          });

          if (hero) {
            hero.dataset.activeSystem = active.key;
          }

          panelCode.textContent = active.code;
          panelTitle.textContent = active.label;
          panelBody.textContent = active.title;

          if (deckCode) deckCode.textContent = active.code;
          if (deckTitle) deckTitle.textContent = active.title;
          if (deckBody) deckBody.textContent = active.body;
          if (deckLink) deckLink.href = active.href;

          if (deckTags) {
            deckTags.innerHTML = '';
            active.links.forEach(tag => {
              deckTags.appendChild(h('span', { class: 'badge' }, tag));
            });
          }

          if (stageController) {
            stageController.render();
          } else {
            seedButtons();
          }
        }

        if (deckHost && deckHost.dataset.mounted !== 'true') {
          deckHost.dataset.mounted = 'true';

          const rail = h('div', { class: 'hero-command-deck__rail', 'aria-label': 'Familii tehnice active' });
          const display = h('div', { class: 'hero-command-deck__display' });
          const top = h('div', { class: 'hero-command-deck__top' });

          top.appendChild(h('div', { class: 'eyebrow hero-command-deck__eyebrow' }, '§ 00 / Nucleu operational'));
          top.appendChild(h('div', { class: 'hero-command-deck__live' }, 'Sisteme sincronizate'));

          deckCode = h('div', { class: 'hero-command-deck__code' });
          deckTitle = h('h2', { class: 'hero-command-deck__title' });
          deckBody = h('p', { class: 'hero-command-deck__body' });
          deckTags = h('div', { class: 'badge-row hero-command-deck__tags' });
          deckLink = h('a', { class: 'btn btn--ghost-dark hero-command-deck__cta', href: 'servicii.html' }, 'Vezi familia →');

          display.appendChild(top);
          display.appendChild(deckCode);
          display.appendChild(deckTitle);
          display.appendChild(deckBody);
          display.appendChild(deckTags);
          display.appendChild(deckLink);

          systems.forEach((system, index) => {
            const item = h('button', {
              class: 'hero-command-deck__rail-item',
              type: 'button',
              'aria-pressed': 'false'
            });

            item.innerHTML = `
              <span class="hero-command-deck__rail-code">${system.code}</span>
              <span class="hero-command-deck__rail-label">${system.label}</span>
              <span class="hero-command-deck__rail-meta">${system.links[0] || system.title}</span>
            `;

            item.addEventListener('mouseenter', () => setActive(index));
            item.addEventListener('focus', () => setActive(index));
            item.addEventListener('click', () => setActive(index));

            deckButtons.push(item);
            rail.appendChild(item);
          });

          deckHost.appendChild(rail);
          deckHost.appendChild(display);
        }

        host.appendChild(canvas);
        host.appendChild(panel);
        host.appendChild(nodesLayer);

        systems.forEach((system, index) => {
          system.button.addEventListener('mouseenter', () => setActive(index));
          system.button.addEventListener('focus', () => setActive(index));
          system.button.addEventListener('click', () => setActive(index));
        });

        if ('ResizeObserver' in globalThis) {
          const observer = new ResizeObserver(() => {
            if (!stageController) seedButtons();
          });
          observer.observe(host);
        }

        seedButtons();
        setActive(0);

        if (!mountTechnicalScene) return;

        stageController = mountTechnicalScene({
          host,
          canvas,
          items: systems.map(system => ({
            key: system.key,
            color: system.color,
            base: system.base,
            drift: system.drift,
            phase: system.phase,
            packetOffset: system.packetOffset,
            button: system.button,
          })),
          pointerTarget: hero || host,
          mode: 'home',
          reducedMotion,
          getActiveIndex: () => activeIndex,
          onProject: ({ projections }) => {
            const compact = host.clientWidth < 720;
            const maxX = host.clientWidth - (compact ? 56 : 72);
            const maxY = host.clientHeight - (compact ? 44 : 58);

            projections.forEach(({ item, projection }, order) => {
              const button = item.button;
              if (!button) return;

              const isActive = item.key === systems[activeIndex]?.key;
              const clampedX = Math.max(compact ? 56 : 72, Math.min(maxX, projection.x));
              const clampedY = Math.max(compact ? 42 : 54, Math.min(maxY, projection.y));

              button.style.left = `${clampedX}px`;
              button.style.top = `${clampedY}px`;
              button.style.opacity = `${Math.max(compact ? 0.34 : 0.42, projection.alpha * (isActive ? 1 : 0.9))}`;
              button.style.transform = `translate(-50%, -50%) scale(${Math.max(compact ? 0.58 : 0.74, Math.min(compact ? 0.9 : 1.04, projection.scale * (isActive ? 1.08 : 0.96)))})`;
              button.style.zIndex = String(100 + order + (isActive ? 18 : 0));
            });
          },
        });

        if (stageController) {
          setActive(activeIndex);
        }
      });
    });
  }

  function mountPageHeroTelemetry(pageKey) {
    const config = pickPageTelemetry(pageKey);
    const hosts = document.querySelectorAll('.page-hero, .legal-hero');
    if (!hosts.length) return;

    const reducedMotion = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;

    loadTechnicalSceneModule().then(module => {
      const mountTechnicalScene = module?.mountTechnicalScene;

      hosts.forEach(host => {
        if (host.dataset.pageTelemetryMounted === 'true') return;
        host.dataset.pageTelemetryMounted = 'true';
        host.classList.add('page-hero--technical');
        host.dataset.telemetryTone = host.matches('.legal-hero') ? 'light' : 'dark';

        const lightStage = host.matches('.legal-hero');
        const stage = h('div', { class: 'page-hero__technical-stage', 'aria-hidden': 'true' });
        const canvas = h('canvas', { class: 'page-hero__technical-canvas', 'aria-hidden': 'true' });
        const stageGrid = h('div', { class: 'page-hero__technical-grid' });
        const stageCore = h('div', { class: 'page-hero__technical-core' });
        stage.appendChild(canvas);
        stage.appendChild(stageGrid);
        stage.appendChild(stageCore);

        const stageNodes = [];
        let activeIndex = 0;
        let activeCode = null;
        let activeTitle = null;
        let activeBody = null;
        let activeTags = null;
        let activeLink = null;
        let stageController = null;
        const railButtons = [];

        const runtimeNodes = config.nodes.map((node, index) => {
          const item = h('div', {
            class: 'page-hero__technical-node',
            style: `--x:${node.x}; --y:${node.y}; --delay:${index * 140}ms;`
          });
          item.appendChild(h('span', { class: 'page-hero__technical-node-code' }, node.code));
          item.appendChild(h('span', { class: 'page-hero__technical-node-label' }, node.label));
          stageNodes.push(item);
          stage.appendChild(item);

          const x = Math.max(0.08, Math.min(0.92, (parseFloat(node.x) || 50) / 100));
          const y = Math.max(0.12, Math.min(0.88, (parseFloat(node.y) || 50) / 100));

          return {
            ...node,
            color: node.color || TECHNICAL_NODE_COLORS[index % TECHNICAL_NODE_COLORS.length],
            item,
            packetOffset: index / Math.max(1, config.nodes.length),
            phase: index * 1.12 + x,
            base: {
              x: (x - 0.5) * 520,
              y: (y - 0.5) * 300,
              z: (index % 2 === 0 ? 1 : -1) * (72 + Math.abs(0.5 - x) * 160)
            },
            drift: {
              x: 14 + (index % 4) * 3,
              y: 10 + (index % 3) * 2,
              z: 52 + (index % 5) * 10
            }
          };
        });

        function setActive(index) {
          if (!runtimeNodes.length) return;

          activeIndex = ((index % runtimeNodes.length) + runtimeNodes.length) % runtimeNodes.length;
          const active = runtimeNodes[activeIndex];

          stageNodes.forEach((item, itemIndex) => {
            item.classList.toggle('is-active', itemIndex === activeIndex);
          });

          railButtons.forEach((button, buttonIndex) => {
            const isActive = buttonIndex === activeIndex;
            button.classList.toggle('is-active', isActive);
            button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
          });

          host.dataset.activeNode = active.code;

          if (activeCode) activeCode.textContent = active.code;
          if (activeTitle) activeTitle.textContent = active.title || config.signalTitle;
          if (activeBody) activeBody.textContent = active.body || config.signalTitle;
          if (activeLink) activeLink.href = active.href || '#';

          if (activeTags) {
            activeTags.innerHTML = '';
            config.metrics.forEach(metric => {
              activeTags.appendChild(h('span', { class: 'badge' }, metric));
            });
          }

          if (stageController) {
            stageController.render();
          }
        }

        const content = host.matches('.page-hero') ? host.querySelector('.page-hero__content, .container') : null;
        if (content && runtimeNodes.some(node => node.title || node.body || node.href)) {
          const command = h('div', { class: 'page-hero__command' });
          const display = h('div', { class: 'page-hero__command-display' });
          const rail = h('div', { class: 'page-hero__command-rail', 'aria-label': 'Noduri operationale active' });
          const top = h('div', { class: 'page-hero__command-top' });
          activeCode = h('div', { class: 'page-hero__command-code' });
          activeTitle = h('h2', { class: 'page-hero__command-title' });
          activeBody = h('p', { class: 'page-hero__command-body' });
          activeTags = h('div', { class: 'badge-row page-hero__command-tags' });
          activeLink = h('a', { class: 'btn btn--ghost-dark page-hero__command-cta', href: '#' }, 'Vezi detaliu →');

          top.appendChild(h('div', { class: 'eyebrow page-hero__command-eyebrow' }, '§ / Nucleu operational'));
          top.appendChild(h('div', { class: 'page-hero__command-live' }, config.signalCode));

          display.appendChild(top);
          display.appendChild(activeCode);
          display.appendChild(activeTitle);
          display.appendChild(activeBody);
          display.appendChild(activeTags);
          display.appendChild(activeLink);

          runtimeNodes.forEach((node, index) => {
            const button = h('button', {
              class: 'page-hero__command-rail-item',
              type: 'button',
              'aria-pressed': 'false'
            });

            button.innerHTML = `
              <span class="page-hero__command-rail-code">${node.code}</span>
              <span class="page-hero__command-rail-label">${node.label}</span>
              <span class="page-hero__command-rail-meta">${node.title || config.signalTitle}</span>
            `;

            button.addEventListener('mouseenter', () => setActive(index));
            button.addEventListener('focus', () => setActive(index));
            button.addEventListener('click', () => setActive(index));

            railButtons.push(button);
            rail.appendChild(button);
          });

          command.appendChild(display);
          command.appendChild(rail);
          content.appendChild(command);
        }

        host.appendChild(stage);
        setActive(0);

        if (!mountTechnicalScene) return;

        stageController = mountTechnicalScene({
          host: stage,
          canvas,
          items: runtimeNodes.map(node => ({
            key: node.code,
            color: node.color,
            base: node.base,
            drift: node.drift,
            phase: node.phase,
            packetOffset: node.packetOffset,
            item: node.item,
          })),
          pointerTarget: host,
          mode: 'page',
          lightMode: lightStage,
          reducedMotion,
          getActiveIndex: () => activeIndex,
          onProject: ({ projections, core }) => {
            const compact = stage.clientWidth < 360;
            stageCore.style.left = `${core.x}px`;
            stageCore.style.top = `${core.y}px`;

            projections.forEach(({ item, projection }, order) => {
              const nodeEl = item.item;
              if (!nodeEl) return;

              const isActive = item.key === runtimeNodes[activeIndex]?.code;
              nodeEl.style.left = `${projection.x}px`;
              nodeEl.style.top = `${projection.y}px`;
              nodeEl.style.opacity = `${Math.max(compact ? 0.42 : 0.5, projection.alpha * (isActive ? 1 : 0.88))}`;
              nodeEl.style.transform = `translate(-50%, -50%) scale(${Math.max(compact ? 0.6 : 0.72, Math.min(compact ? 0.92 : 1.02, projection.scale * (isActive ? 1.04 : 0.94)))})`;
              nodeEl.style.zIndex = String(100 + order + (isActive ? 12 : 0));
            });
          },
        });

        if (stageController) {
          setActive(activeIndex);
        }
      });
    });
  }

  function mountRouteOrbit(pageKey) {
    const config = pickPageRouteOrbit(pageKey);
    const hero = document.querySelector('.hero, .page-hero, .legal-hero');
    if (!hero || hero.dataset.routeOrbitMounted === 'true') return;

    hero.dataset.routeOrbitMounted = 'true';

    const band = h('section', { class: 'section section--tight route-orbit' });
    const container = h('div', { class: 'container route-orbit__container' });
    const panel = h('div', { class: 'route-orbit__panel' });
    const top = h('div', { class: 'route-orbit__top' });
    const links = h('div', { class: 'route-orbit__links' });
    const constellation = h('div', { class: 'route-orbit__constellation', 'aria-label': 'Harta paginilor principale' });

    top.appendChild(h('div', { class: 'eyebrow route-orbit__eyebrow' }, config.code));
    top.appendChild(h('div', { class: 'route-orbit__live' }, 'Spatial nav'));

    panel.appendChild(top);
    panel.appendChild(h('h2', { class: 'route-orbit__title' }, config.title));
    panel.appendChild(h('p', { class: 'route-orbit__body' }, config.summary));
    constellation.appendChild(h('div', { class: 'route-orbit__constellation-label' }, 'Harta paginilor principale'));

    NAV_ITEMS.forEach((item, index) => {
      const position = ROUTE_ORBIT_POSITIONS[index % ROUTE_ORBIT_POSITIONS.length];
      const tag = item.key === pageKey ? 'span' : 'a';
      const attrs = {
        class: `route-orbit__page${item.key === pageKey ? ' is-active' : ''}`,
        style: `--orbit-x:${position.x}; --orbit-y:${position.y}; --delay:${index * 120}ms;`
      };

      if (tag === 'a') attrs.href = item.href;

      const node = h(tag, attrs);
      node.appendChild(h('span', { class: 'route-orbit__page-code' }, item.key === pageKey ? 'LIVE' : String(index + 1).padStart(2, '0')));
      node.appendChild(h('span', { class: 'route-orbit__page-label' }, item.label));
      node.appendChild(h('span', { class: 'route-orbit__page-meta' }, item.key === pageKey ? 'pagina activa' : 'ruta publica'));
      constellation.appendChild(node);
    });

    panel.appendChild(constellation);

    links.appendChild(h('div', { class: 'route-orbit__links-label' }, 'Rute fara redundanta'));
    config.sections.forEach(section => {
      const link = h('a', { class: 'route-orbit__link', href: section.href });
      link.appendChild(h('span', { class: 'route-orbit__link-code' }, section.code));
      link.appendChild(h('span', { class: 'route-orbit__link-label' }, section.label));
      link.appendChild(h('span', { class: 'route-orbit__link-meta' }, section.meta));
      links.appendChild(link);
    });

    container.appendChild(panel);
    container.appendChild(links);
    band.appendChild(container);
    hero.insertAdjacentElement('afterend', band);
  }

  function mountSectionTelemetry(pageKey) {
    const sections = document.querySelectorAll('section');
    if (!sections.length) return;

    sections.forEach(section => {
      section.classList.add('tech-surface');
      section.dataset.telemetryTone = section.matches('.hero') ? 'dark' : resolveSectionTone(section);
    });
  }

  function mountDepthInteractions() {
    const items = document.querySelectorAll(DEPTH_INTERACTION_SELECTOR);
    if (!items.length) return;

    const reducedMotion = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;

    items.forEach(item => {
      if (item.dataset.depthMounted === 'true') return;
      item.dataset.depthMounted = 'true';
      item.classList.add('depth-card');

      if (reducedMotion) return;

      item.addEventListener('pointermove', event => {
        const rect = item.getBoundingClientRect();
        if (!rect.width || !rect.height) return;

        const offsetX = (event.clientX - rect.left) / rect.width - 0.5;
        const offsetY = (event.clientY - rect.top) / rect.height - 0.5;
        const rotateY = Math.max(-10, Math.min(10, offsetX * 14));
        const rotateX = Math.max(-10, Math.min(10, -offsetY * 14));

        item.style.setProperty('--depth-rotate-x', `${rotateX.toFixed(2)}deg`);
        item.style.setProperty('--depth-rotate-y', `${rotateY.toFixed(2)}deg`);
        item.style.setProperty('--depth-glow-x', `${((offsetX + 0.5) * 100).toFixed(2)}%`);
        item.style.setProperty('--depth-glow-y', `${((offsetY + 0.5) * 100).toFixed(2)}%`);
      });

      item.addEventListener('pointerleave', () => {
        item.style.removeProperty('--depth-rotate-x');
        item.style.removeProperty('--depth-rotate-y');
        item.style.removeProperty('--depth-glow-x');
        item.style.removeProperty('--depth-glow-y');
      });
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
      mountRouteOrbit(pageKey);
      mountSectionTelemetry(pageKey);
      mountTechnicalHeroes();
      mountDepthInteractions();
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
    mountDepthInteractions() {
      mountDepthInteractions();
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
