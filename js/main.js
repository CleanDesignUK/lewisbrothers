(() => {

  'use strict';


  /* =========================================================
     COOKIE SETTINGS
     ========================================================= */

  const COOKIE_NAME =
    'lb_cookie_consent';


  const COOKIE_MAX_AGE =
    60 * 60 * 24 * 365;



  /* =========================================================
     COOKIE HELPERS
     ========================================================= */

  const setCookie = (
    name,
    value,
    maxAge = COOKIE_MAX_AGE
  ) => {

    document.cookie =
      `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`;

  };


  const getCookie = (name) => {

    const match =
      document.cookie
        .split('; ')
        .find(
          (row) =>
            row.startsWith(`${name}=`)
        );


    return match
      ? decodeURIComponent(
          match
            .split('=')
            .slice(1)
            .join('=')
        )
      : null;

  };


  const readConsent = () => {

    try {

      const raw =
        getCookie(COOKIE_NAME) ||
        localStorage.getItem(
          COOKIE_NAME
        );


      return raw
        ? JSON.parse(raw)
        : null;


    } catch (_) {

      return null;

    }

  };


  const writeConsent = (
    preferences
  ) => {

    const payload =
      JSON.stringify({

        necessary:
          true,

        analytics:
          Boolean(
            preferences.analytics
          ),

        marketing:
          Boolean(
            preferences.marketing
          ),

        updatedAt:
          new Date().toISOString()

      });


    setCookie(
      COOKIE_NAME,
      payload
    );


    try {

      localStorage.setItem(
        COOKIE_NAME,
        payload
      );

    } catch (_) {}


    applyConsent(
      JSON.parse(payload)
    );

  };


  const applyConsent = (
    preferences
  ) => {

    window.LBRCookieConsent =
      preferences;


    window.dispatchEvent(
      new CustomEvent(
        'lbr:cookie-consent',
        {
          detail:
            preferences
        }
      )
    );

  };



  /* =========================================================
     COOKIE BANNER
     Works with the banner that actually exists
     in your current index.html.
     ========================================================= */

  const initCookies = () => {

    const banner =
      document.getElementById(
        'cookieBanner'
      );


    const acceptButton =
      document.getElementById(
        'acceptCookies'
      );


    const rejectButton =
      document.getElementById(
        'rejectCookies'
      );


    if (!banner) {
      return;
    }


    const consent =
      readConsent();


    if (consent) {

      applyConsent(
        consent
      );


      banner.classList.remove(
        'is-visible'
      );

    } else {

      banner.classList.add(
        'is-visible'
      );

    }


    acceptButton?.addEventListener(
      'click',
      () => {

        writeConsent({

          analytics: true,

          marketing: true

        });


        banner.classList.remove(
          'is-visible'
        );

      }
    );


    rejectButton?.addEventListener(
      'click',
      () => {

        writeConsent({

          analytics: false,

          marketing: false

        });


        banner.classList.remove(
          'is-visible'
        );

      }
    );

  };



  /* =========================================================
     GENERIC MOBILE SCROLLERS

     Retains your existing data-scroller support.
     ========================================================= */

  const initMobileScrollers = () => {

    document
      .querySelectorAll(
        '[data-scroller-wrap]'
      )
      .forEach((wrap) => {

        const scroller =
          wrap.querySelector(
            '[data-scroller]'
          );


        const prev =
          wrap.querySelector(
            '[data-scroll-prev]'
          );


        const next =
          wrap.querySelector(
            '[data-scroll-next]'
          );


        if (
          !scroller ||
          !prev ||
          !next
        ) {
          return;
        }


        const getStep = () => {

          const item =
            scroller.querySelector(
              '.scroll-item'
            );


          if (!item) {

            return (
              scroller.clientWidth *
              0.85
            );

          }


          const styles =
            getComputedStyle(
              scroller
            );


          const gap =
            parseFloat(
              styles.columnGap ||
              styles.gap ||
              '16'
            );


          return (
            item
              .getBoundingClientRect()
              .width +
            gap
          );

        };


        prev.addEventListener(
          'click',
          () => {

            scroller.scrollBy({

              left:
                -getStep(),

              behavior:
                'smooth'

            });

          }
        );


        next.addEventListener(
          'click',
          () => {

            scroller.scrollBy({

              left:
                getStep(),

              behavior:
                'smooth'

            });

          }
        );

      });

  };



  /* =========================================================
     SMOOTH ANCHORS
     ========================================================= */

  const initSmoothAnchors = () => {

    document
      .querySelectorAll(
        'a[href^="#"]'
      )
      .forEach((link) => {

        link.addEventListener(
          'click',
          (event) => {

            const targetId =
              link.getAttribute(
                'href'
              );


            if (
              !targetId ||
              targetId === '#'
            ) {
              return;
            }


            const target =
              document.querySelector(
                targetId
              );


            if (!target) {
              return;
            }


            event.preventDefault();


            target.scrollIntoView({

              behavior:
                'smooth',

              block:
                'start'

            });

          }
        );

      });

  };



  /* =========================================================
     FAQ ACCORDION
     ========================================================= */

  const initFAQs = () => {

    document
      .querySelectorAll(
        '[data-faq-section]'
      )
      .forEach(
        (
          section,
          sectionIndex
        ) => {

          const items =
            section.querySelectorAll(
              '[data-faq-item]'
            );


          items.forEach(
            (
              item,
              itemIndex
            ) => {

              const button =
                item.querySelector(
                  '[data-faq-button]'
                );


              const panel =
                item.querySelector(
                  '[data-faq-panel]'
                );


              if (
                !button ||
                !panel
              ) {
                return;
              }


              /*
               * Accessibility IDs.
               */

              const questionId =
                `faq-question-${sectionIndex + 1}-${itemIndex + 1}`;


              const answerId =
                `faq-answer-${sectionIndex + 1}-${itemIndex + 1}`;


              button.id =
                button.id ||
                questionId;


              panel.id =
                panel.id ||
                answerId;


              button.setAttribute(
                'aria-controls',
                panel.id
              );


              panel.setAttribute(
                'aria-labelledby',
                button.id
              );


              panel.setAttribute(
                'role',
                'region'
              );


              button.setAttribute(
                'aria-expanded',
                item.classList.contains(
                  'is-open'
                )
                  ? 'true'
                  : 'false'
              );


              /*
               * Prevent the same button receiving
               * duplicate listeners if components
               * initialise again.
               */

              if (
                button.dataset.faqReady ===
                'true'
              ) {
                return;
              }


              button.dataset.faqReady =
                'true';


              button.addEventListener(
                'click',
                () => {

                  const isAlreadyOpen =
                    item.classList.contains(
                      'is-open'
                    );


                  /*
                   * Close every other FAQ in this
                   * particular FAQ section.
                   */

                  items.forEach(
                    (otherItem) => {

                      if (
                        otherItem ===
                        item
                      ) {
                        return;
                      }


                      otherItem
                        .classList
                        .remove(
                          'is-open'
                        );


                      const otherButton =
                        otherItem
                          .querySelector(
                            '[data-faq-button]'
                          );


                      otherButton
                        ?.setAttribute(
                          'aria-expanded',
                          'false'
                        );

                    }
                  );


                  /*
                   * Toggle clicked item.
                   */

                  item
                    .classList
                    .toggle(
                      'is-open',
                      !isAlreadyOpen
                    );


                  button.setAttribute(
                    'aria-expanded',
                    String(
                      !isAlreadyOpen
                    )
                  );

                }
              );

            }
          );

        }
      );

  };



  /* =========================================================
     GENERATE FAQ SCHEMA FROM VISIBLE FAQ CONTENT
     ========================================================= */

  const updateFAQSchema = () => {

    const faqSection =
      document.querySelector(
        '[data-faq-section][data-faq-schema="true"]'
      );


    if (!faqSection) {
      return;
    }


    const entities = [];


    faqSection
      .querySelectorAll(
        '[data-faq-item]'
      )
      .forEach((item) => {

        const button =
          item.querySelector(
            '[data-faq-button]'
          );


        const answer =
          item.querySelector(
            '[data-faq-panel]'
          );


        if (
          !button ||
          !answer
        ) {
          return;
        }


        /*
         * Clone question so plus-icon spans
         * don't interfere with text.
         */

        const questionClone =
          button.cloneNode(true);


        questionClone
          .querySelectorAll(
            '.global-faq-icon'
          )
          .forEach(
            (icon) =>
              icon.remove()
          );


        const questionText =
          questionClone
            .textContent
            .replace(
              /\s+/g,
              ' '
            )
            .trim();


        const answerText =
          answer
            .textContent
            .replace(
              /\s+/g,
              ' '
            )
            .trim();


        if (
          !questionText ||
          !answerText
        ) {
          return;
        }


        entities.push({

          '@type':
            'Question',

          name:
            questionText,

          acceptedAnswer: {

            '@type':
              'Answer',

            text:
              answerText

          }

        });

      });


    if (
      entities.length === 0
    ) {
      return;
    }


    /*
     * Remove previously generated copy.
     */

    document
      .querySelector(
        '#generatedFaqSchema'
      )
      ?.remove();


    const script =
      document.createElement(
        'script'
      );


    script.id =
      'generatedFaqSchema';


    script.type =
      'application/ld+json';


    script.textContent =
      JSON.stringify({

        '@context':
          'https://schema.org',

        '@type':
          'FAQPage',

        mainEntity:
          entities

      });


    document.head.appendChild(
      script
    );

  };



  /* =========================================================
     CURRENT YEAR
     ========================================================= */

  const updateCurrentYear = () => {

    document
      .querySelectorAll(
        '[data-current-year]'
      )
      .forEach((element) => {

        element.textContent =
          new Date()
            .getFullYear();

      });

  };



  /* =========================================================
     GLOBAL SITE
     ========================================================= */

  const initGlobalSite = () => {

    updateCurrentYear();

    initCookies();

    initMobileScrollers();

    initSmoothAnchors();

    initFAQs();

    updateFAQSchema();

  };



  /* =========================================================
     COMPONENT LOADER SUPPORT
     ========================================================= */

  Promise
    .resolve(
      window.LEWIS_COMPONENTS_READY
    )
    .then(
      initGlobalSite
    );

})();