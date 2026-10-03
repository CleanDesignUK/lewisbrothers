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
   ABOUT PAGE SERVICE CARD SPREAD
   ========================================================= */

const initAboutServiceSpread = () => {

  const deck =
    document.querySelector(
      '[data-about-spread]'
    );


  if (!deck) {
    return;
  }


  const cards =
    Array.from(
      deck.querySelectorAll(
        '.about-service-card'
      )
    );


  if (cards.length < 2) {
    return;
  }


  const desktopQuery =
    window.matchMedia(
      '(min-width: 900px)'
    );


  const reducedMotion =
    window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    );


  let startOffsets = [];

  let ticking = false;



  /* =======================================================
     MEASURE ORIGINAL GRID
     ======================================================= */

  const measure = () => {

    cards.forEach((card) => {

      card.style.transform = '';

    });


    const firstRect =
      cards[0]
        .getBoundingClientRect();


    startOffsets =
      cards.map(
        (card, index) => {

          if (index === 0) {

            return {
              x: 0,
              y: 0,
              rotate: 0
            };

          }


          const rect =
            card.getBoundingClientRect();


          return {

            /*
             * Cards start almost on top of the
             * first card on the LEFT.
             */

            x:
              firstRect.left -
              rect.left +
              (index * 18),

            y:
              index * 14,

            rotate:
              index === 1
                ? -1.5
                : 1.5

          };

        }
      );

  };



  /* =======================================================
     MUCH LONGER SCROLL RANGE

     Starts while section is still low in viewport.
     Finishes only once deck approaches top.
     ======================================================= */

  const getGlobalProgress = () => {

    const rect =
      deck.getBoundingClientRect();


    const viewportHeight =
      window.innerHeight;


    /*
     * Start animation when the cards are
     * near the bottom of the viewport.
     */

    const start =
      viewportHeight * 0.96;


    /*
     * Finish much later, once the deck has
     * travelled almost to the top.
     */

    const finish =
      viewportHeight * 0.08;


    const raw =
      (
        start -
        rect.top
      ) /
      (
        start -
        finish
      );


    return Math.max(
      0,
      Math.min(
        1,
        raw
      )
    );

  };



  /* =======================================================
     GENTLE EASING
     ======================================================= */

  const easeInOutCubic = (value) => {

    return value < 0.5
      ? 4 * value * value * value
      : 1 -
        Math.pow(
          -2 * value + 2,
          3
        ) / 2;

  };



  /* =======================================================
     CARD-SPECIFIC PROGRESS

     Card 2 moves first.
     Card 3 follows slightly later.
     ======================================================= */

  const getCardProgress = (
    globalProgress,
    index
  ) => {

    if (index === 0) {
      return 1;
    }


    const delay =
      index === 1
        ? 0.03
        : 0.13;


    const available =
      1 - delay;


    const raw =
      (
        globalProgress -
        delay
      ) /
      available;


    const clamped =
      Math.max(
        0,
        Math.min(
          1,
          raw
        )
      );


    return easeInOutCubic(
      clamped
    );

  };



  /* =======================================================
     RENDER
     ======================================================= */

  const render = () => {

    ticking = false;


    if (
      !desktopQuery.matches ||
      reducedMotion.matches
    ) {

      cards.forEach((card) => {

        card.style.transform = '';
        card.style.zIndex = '';

      });


      return;
    }


    const globalProgress =
      getGlobalProgress();


    cards.forEach(
      (card, index) => {

        const offset =
          startOffsets[index];


        if (!offset) {
          return;
        }


        /*
         * First card remains in place.
         */

        if (index === 0) {

          card.style.transform =
            'translate3d(0, 0, 0)';

          card.style.zIndex =
            String(cards.length + 1);

          return;
        }


        const progress =
          getCardProgress(
            globalProgress,
            index
          );


        const remaining =
          1 -
          progress;


        const x =
          offset.x *
          remaining;


        const y =
          offset.y *
          remaining;


        const rotation =
          offset.rotate *
          remaining;


        card.style.transform =
          `
            translate3d(
              ${x}px,
              ${y}px,
              0
            )
            rotate(
              ${rotation}deg
            )
          `;


        card.style.zIndex =
          String(
            cards.length -
            index
          );

      }
    );

  };



  /* =======================================================
     REQUEST ANIMATION FRAME
     ======================================================= */

  const requestRender = () => {

    if (ticking) {
      return;
    }


    ticking = true;


    window.requestAnimationFrame(
      render
    );

  };



  /* =======================================================
     RESIZE
     ======================================================= */

  const resize = () => {

    measure();
    requestRender();

  };



  measure();

  requestRender();



  window.addEventListener(
    'scroll',
    requestRender,
    {
      passive: true
    }
  );


  window.addEventListener(
    'resize',
    resize,
    {
      passive: true
    }
  );


  desktopQuery.addEventListener?.(
    'change',
    resize
  );



  /*
   * Remeasure when images finish loading.
   */

  deck
    .querySelectorAll('img')
    .forEach((image) => {

      if (!image.complete) {

        image.addEventListener(
          'load',
          resize,
          {
            once: true
          }
        );

      }

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
  initAboutServiceSpread();


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

/* =========================================================
   GLOBAL TESTIMONIAL SLIDER
   ========================================================= */

function getTestimonialsTrack() {
  return document.querySelector(
    "[data-testimonials-track]"
  );
}


function getTestimonialScrollDistance(track) {

  const firstCard =
    track.querySelector(
      ".testimonial-review"
    );

  if (!firstCard) {
    return track.clientWidth * 0.85;
  }


  const styles =
    window.getComputedStyle(track);

  const gap =
    parseFloat(styles.columnGap) ||
    parseFloat(styles.gap) ||
    0;


  return firstCard.getBoundingClientRect().width + gap;
}


function moveTestimonials(direction) {

  const track =
    getTestimonialsTrack();


  if (!track) {
    return;
  }


  const distance =
    getTestimonialScrollDistance(track);


  if (!distance) {
    return;
  }


  const maxScroll =
    Math.max(
      0,
      track.scrollWidth -
      track.clientWidth
    );


  const tolerance = 8;

  let target;


  if (direction === "next") {

    if (
      track.scrollLeft >=
      maxScroll - tolerance
    ) {

      target = 0;

    } else {

      target =
        Math.min(
          track.scrollLeft + distance,
          maxScroll
        );

    }

  } else {

    if (
      track.scrollLeft <=
      tolerance
    ) {

      target = maxScroll;

    } else {

      target =
        Math.max(
          track.scrollLeft - distance,
          0
        );

    }

  }


  track.scrollTo({
    left: target,
    behavior: "smooth"
  });

}


/* =========================================================
   TESTIMONIAL READ MORE / LESS
   ========================================================= */

function toggleTestimonial(button) {

  const review =
    button.closest(
      ".testimonial-review"
    );


  if (!review) {
    return;
  }


  const expanded =
    review.classList.toggle(
      "is-expanded"
    );


  button.textContent =
    expanded
      ? "Read less"
      : "Read more";


  button.setAttribute(
    "aria-expanded",
    String(expanded)
  );

}


/* =========================================================
   TESTIMONIAL BUTTON EVENTS
   ========================================================= */

document.addEventListener(
  "click",
  function (event) {

    const previousButton =
      event.target.closest(
        "[data-testimonial-prev]"
      );


    if (previousButton) {

      event.preventDefault();

      moveTestimonials(
        "previous"
      );

      return;

    }


    const nextButton =
      event.target.closest(
        "[data-testimonial-next]"
      );


    if (nextButton) {

      event.preventDefault();

      moveTestimonials(
        "next"
      );

      return;

    }


    const readButton =
      event.target.closest(
        ".testimonial-read-button"
      );


    if (readButton) {

      event.preventDefault();

      toggleTestimonial(
        readButton
      );

    }

  }
);