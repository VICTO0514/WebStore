async function loadFeatured() {
  const root = document.getElementById('featured-grid');
  if (!root) return;
  UI.skeleton(root, 4);
  try {
    const page = await api.featured();
    root.innerHTML = '';
    (page.content || []).forEach((p) => {
      root.appendChild(productCard(p));
    });
    if (typeof AOS !== 'undefined') AOS.refresh();
  } catch (e) {
    root.innerHTML = `<p class="muted">Could not load products. Is the API running?</p>`;
  }
}

function productCard(p) {
  const el = document.createElement('article');
  el.className = 'card-product';
  el.setAttribute('data-aos', 'fade-up');
  const img = p.thumbnailUrl || p.imageUrl || '';
  const effective = p.effectivePrice ?? p.price;
  const priceHtml =
    p.discountedPrice != null
      ? `<span class="price"><del>${UI.formatMoney(p.price)}</del>${UI.formatMoney(effective)}</span>`
      : `<span class="price">${UI.formatMoney(effective)}</span>`;
  el.innerHTML = `
    ${p.badge ? `<span class="badge">${p.badge}</span>` : ''}
    <a href="product-details.html?id=${p.id}"><img src="${img}" alt="${p.name}" loading="lazy" width="300" height="300" /></a>
    <h3 style="margin:0.75rem 0 0.35rem;font-size:1rem;">${p.name}</h3>
    <p class="muted" style="margin:0;font-size:0.85rem;line-height:1.35;">${(p.description || '').slice(0, 80)}${p.description && p.description.length > 80 ? '…' : ''}</p>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-top:0.75rem;gap:0.5rem;">
      ${priceHtml}
      <button type="button" class="btn btn--accent btn--sm btn-add" data-id="${p.id}">Add</button>
    </div>`;
  el.querySelector('.btn-add').addEventListener('click', async () => {
    const token = api.token();
    if (!token) {
      UI.toast('Please login to add items.', 'error');
      location.href = 'login.html';
      return;
    }
    try {
      await api.cartAdd(p.id, 1);
      UI.toast('Added to cart');
      window.dispatchEvent(new Event('cart-updated'));
    } catch (err) {
      UI.toast(err.message, 'error');
    }
  });
  return el;
}

window.addEventListener('DOMContentLoaded', loadFeatured);
