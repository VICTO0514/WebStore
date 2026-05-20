(function () {
  function injectHeaderFooter() {
    const headerSlot = document.querySelector('[data-include="header"]');
    const footerSlot = document.querySelector('[data-include="footer"]');
    const shop = window.__shopName || '{{SHOP_NAME}}';

    if (headerSlot) {
      headerSlot.innerHTML = `
      <header class="glass-nav">
        <div class="nav-inner">
          <a href="index.html" class="logo"><span class="logo-dot"></span>${shop}</a>
          <nav class="nav-links">
            <a href="index.html" data-i18n="nav_home">Home</a>
            <a href="products.html" data-i18n="nav_shop">Shop</a>
            <a href="about.html" data-i18n="nav_about">About</a>
            <a href="contact.html" data-i18n="nav_contact">Contact</a>
          </nav>
          <div class="nav-actions">
            <button type="button" class="icon-btn" id="btn-theme" aria-label="Toggle theme">◑</button>
            <select id="lang-select" class="lang-select" aria-label="Language">
              <option value="en">EN</option>
              <option value="ta">தமிழ்</option>
            </select>
            <a href="cart.html" class="cart-badge" id="nav-cart"><span data-i18n="nav_cart">Cart</span><em id="cart-count">0</em></a>
            <a href="login.html" class="btn btn--ghost btn--sm" id="nav-auth" data-i18n="nav_login">Login</a>
          </div>
        </div>
      </header>`;
    }

    if (footerSlot) {
      footerSlot.innerHTML = `
      <footer class="site-footer glass-panel">
        <div class="footer-grid">
          <div>
            <strong>${shop}</strong>
            <p class="muted" id="footer-tag">Fresh · Fast · Fair</p>
          </div>
          <div>
            <a href="faq.html">FAQ</a>
            <a href="privacy.html">Privacy</a>
            <a href="terms.html">Terms</a>
          </div>
          <div>
            <a href="reviews.html">Reviews</a>
            <a href="order-tracking.html">Track order</a>
          </div>
        </div>
        <p class="footer-copy">&copy; ${new Date().getFullYear()} ${shop}</p>
      </footer>`;
    }

    document.getElementById('btn-theme')?.addEventListener('click', () => UI.themeToggle());
    const ls = document.getElementById('lang-select');
    if (ls) {
      ls.value = localStorage.getItem('lang') || 'en';
      ls.addEventListener('change', () => I18n.setLang(ls.value));
    }

    const token = localStorage.getItem('auth_token');
    const authLink = document.getElementById('nav-auth');
    if (authLink) {
      if (token) {
        authLink.textContent = 'Account';
        authLink.href = 'order-tracking.html';
      }
    }

    window.dispatchEvent(new Event('i18n-change'));
    updateCartBadge();
  }

  async function updateCartBadge() {
    const el = document.getElementById('cart-count');
    if (!el) return;
    if (!api.token()) {
      el.textContent = '0';
      return;
    }
    try {
      const c = await api.cart();
      el.textContent = (c.items && c.items.length) || 0;
    } catch {
      el.textContent = '0';
    }
  }

  window.addEventListener('cart-updated', updateCartBadge);

  async function hydrateShopName() {
    try {
      const s = await api.settings();
      window.__shopName = s['shop.name'] || 'Vimal Store';
      document.title = document.title.replace('{{SHOP_NAME}}', window.__shopName);
      injectHeaderFooter();
      updateCartBadge();
      const wa = document.getElementById('whatsapp-float');
      if (wa && s['shop.phone']) {
        const num = String(s['shop.phone']).replace(/\D/g, '');
        wa.href = `https://wa.me/${num}`;
      }
    } catch {
      window.__shopName = 'Vimal Store';
      injectHeaderFooter();
      updateCartBadge();
    }
  }

  window.addEventListener('DOMContentLoaded', () => {
    hydrateShopName();
  });
})();
