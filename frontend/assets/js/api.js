const api = {
  base() {
    return window.APP_CONFIG.API_BASE.replace(/\/$/, '');
  },
  token() {
    return localStorage.getItem('auth_token');
  },
  setToken(t) {
    if (t) localStorage.setItem('auth_token', t);
    else localStorage.removeItem('auth_token');
  },
  async req(path, opts = {}) {
    const headers = Object.assign(
      { Accept: 'application/json' },
      opts.headers || {}
    );
    if (!(opts.body instanceof FormData)) {
      headers['Content-Type'] = headers['Content-Type'] || 'application/json';
    }
    const token = api.token();
    if (token) headers.Authorization = `Bearer ${token}`;
    const res = await fetch(`${this.base()}${path}`, {
      ...opts,
      headers,
      body:
        opts.body && !(opts.body instanceof FormData) && typeof opts.body !== 'string'
          ? JSON.stringify(opts.body)
          : opts.body,
    });
    const text = await res.text();
    let data = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text;
    }
    if (!res.ok) {
      const msg = (data && data.error) || res.statusText || 'Request failed';
      throw new Error(msg);
    }
    return data;
  },
  settings() {
    return this.req('/api/v1/settings/public');
  },
  categories() {
    return this.req('/api/v1/categories');
  },
  products(params = {}) {
    const q = new URLSearchParams(params).toString();
    return this.req(`/api/v1/products?${q}`);
  },
  product(id) {
    return this.req(`/api/v1/products/${id}`);
  },
  featured() {
    return this.req('/api/v1/products/featured?page=0&size=8');
  },
  login(body) {
    return this.req('/api/v1/auth/login', { method: 'POST', body });
  },
  register(body) {
    return this.req('/api/v1/auth/register', { method: 'POST', body });
  },
  cart() {
    return this.req('/api/v1/cart');
  },
  cartAdd(productId, quantity) {
    return this.req('/api/v1/cart/items', {
      method: 'POST',
      body: { productId, quantity },
    });
  },
  addresses() {
    return this.req('/api/v1/addresses');
  },
  addressCreate(body) {
    return this.req('/api/v1/addresses', { method: 'POST', body });
  },
  checkoutPreview(addressId, couponCode) {
    const q = new URLSearchParams({ addressId });
    if (couponCode) q.set('couponCode', couponCode);
    return this.req(`/api/v1/checkout/preview?${q}`);
  },
  placeOrder(body) {
    return this.req('/api/v1/checkout/place', { method: 'POST', body });
  },
  orders(page = 0) {
    return this.req(`/api/v1/orders?page=${page}&size=10`);
  },
  order(num) {
    return this.req(`/api/v1/orders/${encodeURIComponent(num)}`);
  },
  deliveryCheck(lat, lng) {
    return this.req(`/api/v1/delivery/check?lat=${lat}&lng=${lng}`);
  },
  nlSearch(q) {
    return this.req(`/api/v1/ai/nl-search?q=${encodeURIComponent(q)}`);
  },
  fbt(productId) {
    return this.req(`/api/v1/ai/recommend/fbt/${productId}`);
  },
  reviews(productId, page = 0) {
    return this.req(`/api/v1/reviews/product/${productId}?page=${page}&size=20`);
  },
};

window.api = api;
