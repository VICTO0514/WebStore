const params = new URLSearchParams(location.search);
let page = Number(params.get('page') || 0);
const category = params.get('category') || '';

async function loadCategories() {
  const chips = document.getElementById('cat-chips');
  const wrap = document.getElementById('swiper-cats');
  const cats = await api.categories();
  chips.innerHTML = `<a href="products.html" class="trust-pill" style="text-decoration:none;color:inherit">All</a>`;
  cats.forEach((c) => {
    const a = document.createElement('a');
    a.href = `products.html?category=${encodeURIComponent(c.slug)}`;
    a.className = 'trust-pill';
    a.style.cssText = 'text-decoration:none;color:inherit';
    a.textContent = c.name;
    chips.appendChild(a);

    const slide = document.createElement('div');
    slide.className = 'swiper-slide';
    slide.innerHTML = `<article class="card-product" style="min-height:160px;background-image:linear-gradient(145deg,rgba(30,157,92,.25),rgba(37,99,235,.2));display:flex;align-items:flex-end;padding:1rem">
      <a href="products.html?category=${encodeURIComponent(c.slug)}" style="color:inherit;text-decoration:none;font-weight:800">${c.name}</a>
    </article>`;
    wrap.appendChild(slide);
  });
  new Swiper('.cat-swiper', { slidesPerView: 1.2, spaceBetween: 16, breakpoints: { 768: { slidesPerView: 3 } } });
}

async function loadProducts() {
  const grid = document.getElementById('grid');
  UI.skeleton(grid, 6);
  const q = document.getElementById('q').value.trim();
  const sort = document.getElementById('sort').value;
  try {
    const data = await api.products({
      page,
      size: 12,
      category: category || undefined,
      q: q || undefined,
      sort,
    });
    grid.innerHTML = '';
    (data.content || []).forEach((p) => grid.appendChild(productCardCatalog(p)));
    document.getElementById('prev').disabled = data.first;
    document.getElementById('next').disabled = data.last;
  } catch (e) {
    grid.innerHTML = `<p class="muted">${e.message}</p>`;
  }
}

function productCardCatalog(p) {
  const el = document.createElement('article');
  el.className = 'card-product';
  const img = p.thumbnailUrl || p.imageUrl || '';
  const effective = p.effectivePrice ?? p.price;
  const priceHtml =
    p.discountedPrice != null
      ? `<span class="price"><del>${UI.formatMoney(p.price)}</del>${UI.formatMoney(effective)}</span>`
      : `<span class="price">${UI.formatMoney(effective)}</span>`;
  el.innerHTML = `
    ${p.badge ? `<span class="badge">${p.badge}</span>` : ''}
    <a href="product-details.html?id=${p.id}"><img src="${img}" alt="${p.name}" loading="lazy" width="220" height="220"/></a>
    <h3 style="margin:0.75rem 0 0.35rem;font-size:1rem">${p.name}</h3>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-top:0.75rem">
      ${priceHtml}
      <button type="button" class="btn btn--accent btn--sm c-add" data-id="${p.id}">Add</button>
    </div>`;
  el.querySelector('.c-add').addEventListener('click', async () => {
    if (!api.token()) {
      UI.toast('Login required', 'error');
      location.href = 'login.html';
      return;
    }
    try {
      await api.cartAdd(p.id, 1);
      UI.toast('Added');
      window.dispatchEvent(new Event('cart-updated'));
    } catch (e) {
      UI.toast(e.message, 'error');
    }
  });
  return el;
}

window.addEventListener('DOMContentLoaded', async () => {
  await loadCategories();
  document.getElementById('q').value = params.get('q') || '';
  await loadProducts();
  document.getElementById('sort').addEventListener('change', () => {
    page = 0;
    loadProducts();
  });
  document.getElementById('q').addEventListener(
    'input',
    debounce(() => {
      page = 0;
      loadProducts();
    }, 400)
  );
  document.getElementById('prev').onclick = () => {
    page = Math.max(0, page - 1);
    loadProducts();
  };
  document.getElementById('next').onclick = () => {
    page++;
    loadProducts();
  };
});

function debounce(fn, ms) {
  let t;
  return () => {
    clearTimeout(t);
    t = setTimeout(fn, ms);
  };
}
