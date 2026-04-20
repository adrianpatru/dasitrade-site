(function () {
  const root = document.getElementById('intro-root');
  const linesHost = document.getElementById('intro-lines');
  const statusEl = document.querySelector('[data-intro-status]');
  const accessEl = document.querySelector('[data-intro-access]');
  const clockEl = document.querySelector('[data-intro-clock]');
  const prefersReducedMotion = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  const lines = [
    { text: '> INITIALIZING SECURE BOOT...', status: '[ OK ]' },
    { text: '> LOADING SYSTEM MATRIX: FIRE / CCTV / ACCESS / BMS', status: '[ OK ]' },
    { text: '> AUTHORIZING DISPATCH CHANNELS 24/7', status: '[ OK ]' },
    { text: '> SYNCING BACAU CORE NODE · READY FOR DEPLOYMENT', status: '[ READY ]' }
  ];

  function updateClock() {
    if (!clockEl) return;
    const date = new Date();
    const pad = (value) => String(value).padStart(2, '0');
    clockEl.textContent = `SYS · ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  }

  function createLine() {
    const row = document.createElement('div');
    row.className = 'intro-log';

    const text = document.createElement('div');
    text.className = 'intro-log__text';

    const status = document.createElement('div');
    status.className = 'intro-log__status';

    row.appendChild(text);
    row.appendChild(status);
    linesHost.appendChild(row);

    requestAnimationFrame(() => row.classList.add('is-visible'));

    return { row, text, status };
  }

  function typeText(node, value, speed) {
    return new Promise((resolve) => {
      let index = 0;
      const timer = setInterval(() => {
        index += 1;
        node.textContent = value.slice(0, index);
        if (index >= value.length) {
          clearInterval(timer);
          resolve();
        }
      }, speed);
    });
  }

  function completeIntro(delay) {
    if (statusEl) statusEl.textContent = 'ONLINE';
    if (accessEl) accessEl.classList.add('is-ready');

    setTimeout(() => {
      globalThis.parent?.postMessage({ type: 'dasitrade:intro-complete' }, '*');
    }, delay);
  }

  async function boot() {
    updateClock();
    setInterval(updateClock, 1000);

    if (prefersReducedMotion) {
      lines.forEach((entry) => {
        const line = createLine();
        line.text.textContent = entry.text;
        line.status.textContent = entry.status;
      });
      completeIntro(900);
      return;
    }

    for (const entry of lines) {
      const line = createLine();
      await typeText(line.text, entry.text, 24);
      await new Promise((resolve) => setTimeout(resolve, 90));
      line.status.textContent = entry.status;
      await new Promise((resolve) => setTimeout(resolve, 180));
    }

    completeIntro(650);
  }

  if (root && linesHost) {
    boot();
  }
})();