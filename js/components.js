(() => {
  const config = window.LEWIS_BROTHERS_CONFIG;

  if (!config) {
    console.error('Lewis Brothers config was not loaded before components.js');
    window.LEWIS_COMPONENTS_READY = Promise.resolve();
    return;
  }

  const phoneHref = `tel:${config.phoneE164}`;
  const whatsappHref = `https://wa.me/${config.phoneE164.replace(/\D/g, '')}?text=${encodeURIComponent('Hi Lewis Brothers, I would like to ask about roofing or plastering work.')}`;

  const tokens = {
    BUSINESS_NAME: config.businessName,
    PHONE_HREF: phoneHref,
    PHONE_DISPLAY: config.phoneDisplay,
    WHATSAPP_HREF: whatsappHref,
    EMAIL: config.email,
    ADDRESS: `${config.addressLine1}, ${config.town}, ${config.postcode}`,
    SERVICE_AREA: config.serviceArea,
    FACEBOOK: config.facebook,
    GOOGLE_BUSINESS: config.googleBusiness
  };

  const interpolate = (html) => html.replace(/\{\{([A-Z0-9_]+)\}\}/g, (_, key) => tokens[key] ?? '');

  const loadComponent = async (selector, path) => {
    const target = document.querySelector(selector);
    if (!target) return;

    const response = await fetch(path, { cache: 'no-cache' });
    if (!response.ok) throw new Error(`Unable to load ${path}`);
    target.innerHTML = interpolate(await response.text());
  };

  const setActiveNavigation = () => {
    const currentPage = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
    document.querySelectorAll('[data-nav-page]').forEach((link) => {
      const active = link.dataset.navPage.toLowerCase() === currentPage;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'page');
    });

    const servicePages = new Set([
      'services.html',
      'epdm-rubber-roofing.html',
      'roofing-services.html',
      'plastering-services.html'
    ]);

    const servicesLink = document.querySelector('[data-nav-services]');
    if (servicesLink && servicePages.has(currentPage)) {
      servicesLink.classList.add('active');
      servicesLink.setAttribute('aria-current', 'page');
    }
  };

  window.LEWIS_COMPONENTS_READY = Promise.all([
    loadComponent('[data-global-header]', 'components/navbar.html'),
    loadComponent('[data-global-footer]', 'components/footer.html')
  ])
    .then(() => {
      setActiveNavigation();
      document.querySelectorAll('[data-current-year]').forEach((el) => {
        el.textContent = new Date().getFullYear();
      });
      document.dispatchEvent(new CustomEvent('lewis:components-ready'));
    })
    .catch((error) => {
      console.error(error);
      document.querySelectorAll('[data-global-header], [data-global-footer]').forEach((target) => {
        if (!target.innerHTML.trim()) {
          target.innerHTML = '<div class="component-load-error">Please preview this site through a local web server (for example VS Code Live Server) so the global components can load.</div>';
        }
      });
    });
})();
