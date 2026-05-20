(function () {
  const DICT = {
    en: {
      nav_home: 'Home',
      nav_shop: 'Shop',
      nav_cart: 'Cart',
      nav_login: 'Login',
      nav_about: 'About',
      nav_contact: 'Contact',
      hero_title: 'Farm-fresh groceries to your door',
      hero_sub: 'Delivered within 10 km · Trusted local store',
      shop_cta: 'Shop now',
      fresh: 'Fresh',
      trust_pay: 'Secure pay',
      fast: 'Fast delivery',
      radius_warn: 'Sorry, delivery is available only within 10 km.',
      lang: 'Language',
    },
    ta: {
      nav_home: 'முகப்பு',
      nav_shop: 'கடை',
      nav_cart: 'கூடை',
      nav_login: 'உள்நுழை',
      nav_about: 'எங்களைப் பற்றி',
      nav_contact: 'தொடர்பு',
      hero_title: 'புதிய காய்கறிகள் உங்கள் வீட்டிற்கே',
      hero_sub: '10 கிமீ குள் விநியோகம் · நம்பிக்கையான கடை',
      shop_cta: 'இப்போது வாங்க',
      fresh: 'புதுமை',
      trust_pay: 'பாதுகாப்பான கட்டணம்',
      fast: 'விரைவு விநியோகம்',
      radius_warn: 'மன்னிக்கவும், விநியோகம் 10 கிமீ குள் மட்டுமே.',
      lang: 'மொழி',
    },
  };

  function lang() {
    return localStorage.getItem('lang') || 'en';
  }

  window.I18n = {
    t(key) {
      const l = lang();
      return (DICT[l] && DICT[l][key]) || DICT.en[key] || key;
    },
    setLang(l) {
      localStorage.setItem('lang', l);
      document.documentElement.setAttribute('lang', l === 'ta' ? 'ta' : 'en');
      window.dispatchEvent(new Event('i18n-change'));
    },
    initAttr() {
      document.documentElement.setAttribute('lang', lang() === 'ta' ? 'ta' : 'en');
      window.addEventListener('i18n-change', () => {
        document.querySelectorAll('[data-i18n]').forEach((el) => {
          const k = el.getAttribute('data-i18n');
          el.textContent = I18n.t(k);
        });
      });
    },
  };
  I18n.initAttr();
})();
