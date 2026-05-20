(function () {
  window.UI = {
    toast(msg, type = 'info') {
      let el = document.getElementById('toast-root');
      if (!el) {
        el = document.createElement('div');
        el.id = 'toast-root';
        el.className = 'toast-root';
        document.body.appendChild(el);
      }
      const t = document.createElement('div');
      t.className = `toast toast--${type}`;
      t.textContent = msg;
      el.appendChild(t);
      requestAnimationFrame(() => t.classList.add('toast--show'));
      setTimeout(() => {
        t.classList.remove('toast--show');
        setTimeout(() => t.remove(), 400);
      }, 3200);
    },
    themeInit() {
      const saved = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const dark = saved ? saved === 'dark' : prefersDark;
      document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    },
    themeToggle() {
      const cur = document.documentElement.getAttribute('data-theme') === 'dark';
      const next = cur ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
    },
    formatMoney(n) {
      const x = Number(n);
      return `₹${x.toFixed(x % 1 === 0 ? 0 : 2)}`;
    },
    skeleton(el, lines = 3) {
      el.innerHTML = `<div class="skeleton-wrap">${Array.from({ length: lines })
        .map(() => '<div class="skeleton-line"></div>')
        .join('')}</div>`;
    },
  };
  UI.themeInit();
})();
