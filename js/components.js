/* =========================================================
   LEWIS BROTHERS
   GLOBAL COMPONENT LOADER

   Loads:
   - components/navbar.html
   - components/footer.html

   Also replaces {{TOKENS}} using config.js
   ========================================================= */

(() => {

  'use strict';


  /* =======================================================
     CONFIG
     ======================================================= */

  const config =
    window.LEWIS_BROTHERS_CONFIG || {};


  /* =======================================================
     DERIVED VALUES
     ======================================================= */

  const address = [
    config.addressLine1,
    config.town,
    config.postcode
  ]
    .filter(Boolean)
    .join(', ');


  const phoneHref =
    config.phoneE164
      ? `tel:${config.phoneE164}`
      : '#';


  const emailHref =
    config.email
      ? `mailto:${config.email}`
      : '#';


  const whatsappHref =
    config.phoneE164
      ? (
          'https://wa.me/' +
          config.phoneE164.replace(/\D/g, '') +
          '?text=' +
          encodeURIComponent(
            config.whatsappMessage ||
            "Hi Lewis Brothers, I'd like to ask about roofing or plastering work."
          )
        )
      : '#';


  /* =======================================================
     TEMPLATE VALUES
     ======================================================= */

  const templateValues = {

    BUSINESS_NAME:
      config.businessName || '',

    SHORT_NAME:
      config.shortName || '',

    PHONE_DISPLAY:
      config.phoneDisplay || '',

    PHONE_E164:
      config.phoneE164 || '',

    PHONE_HREF:
      phoneHref,

    EMAIL:
      config.email || '',

    EMAIL_HREF:
      emailHref,

    ADDRESS:
      address,

    ADDRESS_LINE_1:
      config.addressLine1 || '',

    TOWN:
      config.town || '',

    POSTCODE:
      config.postcode || '',

    SERVICE_AREA:
      config.serviceArea || '',

    DOMAIN:
      config.domain || '',

    FACEBOOK:
      config.facebook || '#',

    INSTAGRAM:
      config.instagram || '#',

    GOOGLE_BUSINESS:
      config.googleBusiness || '#',

    WHATSAPP_HREF:
      whatsappHref

  };


  /* =======================================================
     REPLACE {{TOKENS}}
     ======================================================= */

  const replaceTemplateTokens = (html) => {

    let output =
      String(html || '');


    Object.entries(
      templateValues
    ).forEach(
      ([key, value]) => {

        const token =
          `{{${key}}}`;


        output =
          output
            .split(token)
            .join(
              String(value ?? '')
            );

      }
    );


    return output;

  };


  /* =======================================================
     LOAD COMPONENT
     ======================================================= */

  const loadComponent = async (
    selector,
    path
  ) => {

    const target =
      document.querySelector(
        selector
      );


    if (!target) {

      return false;

    }


    try {

      const response =
        await fetch(
          path,
          {
            cache: 'no-cache'
          }
        );


      if (!response.ok) {

        throw new Error(
          `Could not load ${path}. HTTP ${response.status}`
        );

      }


      const html =
        await response.text();


      target.innerHTML =
        replaceTemplateTokens(
          html
        );


      return true;


    } catch (error) {

      console.error(
        `Lewis Brothers component error: ${path}`,
        error
      );


      return false;

    }

  };


  /* =======================================================
     GET CURRENT PAGE
     ======================================================= */

  const getCurrentPage = () => {

    const pathname =
      window.location.pathname;


    const filename =
      pathname
        .split('/')
        .pop();


    return (
      filename ||
      'index.html'
    );

  };


  /* =======================================================
     ACTIVE NAVIGATION
     ======================================================= */

  const setActiveNavigation = () => {

    const currentPage =
      getCurrentPage();


    /*
     * Remove any previous active states.
     */

    document
      .querySelectorAll(
        '[data-global-header] .nav-link'
      )
      .forEach((link) => {

        link.classList.remove(
          'active'
        );


        link.removeAttribute(
          'aria-current'
        );

      });


    /*
     * Home / About / Contact
     *
     * Your navbar already uses data-nav-page.
     */

    document
      .querySelectorAll(
        '[data-nav-page]'
      )
      .forEach((link) => {

        const page =
          link.getAttribute(
            'data-nav-page'
          );


        if (
          page === currentPage
        ) {

          link.classList.add(
            'active'
          );


          link.setAttribute(
            'aria-current',
            'page'
          );

        }

      });


    /*
     * Service pages.
     *
     * Highlight the main Services navigation item whenever
     * the visitor is on any service-related page.
     */

    const servicePages = [

      'roofing-plastering-services-anglesey-north-wales.html',

      'roofing-plastering-services-anglesey.html',

      'epdm-rubber-flat-roofing-anglesey.html',

      'roofing-services-anglesey.html',

      'plastering-services-anglesey.html',

      'plastering-rendering-llangefni-anglesey.html'

    ];


    if (
      servicePages.includes(
        currentPage
      )
    ) {

      const servicesLink =
        document.querySelector(
          '[data-nav-services]'
        );


      if (servicesLink) {

        servicesLink.classList.add(
          'active'
        );


        servicesLink.setAttribute(
          'aria-current',
          'page'
        );

      }

    }

  };


  /* =======================================================
     LOAD NAVBAR + FOOTER

     IMPORTANT:
     Your navbar file is navbar.html.
     It is NOT header.html.
     ======================================================= */

  const initialiseComponents =
    async () => {

      await Promise.all([

        loadComponent(
          '[data-global-header]',
          'components/navbar.html'
        ),

        loadComponent(
          '[data-global-footer]',
          'components/footer.html'
        )

      ]);


      setActiveNavigation();


      /*
       * Notify other JS that the global components now exist.
       */

      document.dispatchEvent(
        new CustomEvent(
          'lewis:components-ready'
        )
      );

  };


  /* =======================================================
     COMPONENT READY PROMISE

     main.js can wait for this before initialising anything
     that depends on the navbar/footer.
     ======================================================= */

  window.LEWIS_COMPONENTS_READY =
    initialiseComponents();

})();