(() => {
  const allowed = new Set(['en', 'sl']);
  const query = new URLSearchParams(location.search).get('lang');
  let stored = null;
  try { stored = localStorage.getItem('therojcapps-language'); } catch {}
  const initial = allowed.has(query) ? query : allowed.has(stored) ? stored : navigator.language.startsWith('sl') ? 'sl' : 'en';
  function choose(lang, remember = false) {
    if (!allowed.has(lang)) return;
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-en][data-sl]').forEach(el => { el.textContent = el.dataset[lang]; });
    document.querySelectorAll('[data-aria-en][data-aria-sl]').forEach(el => {
      el.setAttribute('aria-label', el.dataset[lang === 'sl' ? 'ariaSl' : 'ariaEn']);
    });
    document.querySelectorAll('[data-screen]').forEach(el => {
      el.src = `assets/${lang}/${el.dataset.screen}.png`;
      el.alt = el.dataset[`alt${lang === 'sl' ? 'Sl' : 'En'}`] || '';
    });
    document.querySelectorAll('[data-language]').forEach(el => el.setAttribute('aria-pressed', String(el.dataset.language === lang)));
    document.querySelectorAll('[data-local-link]').forEach(el => {
      const url = new URL(el.getAttribute('href'), location.href);
      url.searchParams.set('lang', lang);
      el.href = url.href;
    });
    if (remember) { try { localStorage.setItem('therojcapps-language', lang); } catch {} }
  }
  choose(initial);
  document.querySelectorAll('[data-language]').forEach(el => el.addEventListener('click', () => choose(el.dataset.language, true)));
  const gallery = document.querySelector('.gallery');
  document.querySelectorAll('[data-gallery-step]').forEach(el => el.addEventListener('click', () => {
    if (!gallery) return;
    const step = Number(el.dataset.galleryStep);
    const card = gallery.querySelector('figure');
    const distance = card ? card.getBoundingClientRect().width + 20 : gallery.clientWidth;
    gallery.scrollBy({ left: step * distance, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  }));
})();
