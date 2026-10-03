(() => {

  'use strict';



  /* =========================================================
     ELEMENTS
     ========================================================= */

  const lightbox =
    document.getElementById(
      'epdmLightbox'
    );


  const lightboxImage =
    document.getElementById(
      'epdmLightboxImage'
    );


  const lightboxCaption =
    document.getElementById(
      'epdmLightboxCaption'
    );


  const galleryItems =
    Array.from(
      document.querySelectorAll(
        '[data-gallery-item]'
      )
    );


  const closeButtons =
    document.querySelectorAll(
      '[data-lightbox-close]'
    );


  const previousButton =
    document.querySelector(
      '[data-lightbox-prev]'
    );


  const nextButton =
    document.querySelector(
      '[data-lightbox-next]'
    );


  let currentGalleryIndex = 0;



  /* =========================================================
     GALLERY
     ========================================================= */

  const getGalleryData = (
    index
  ) => {

    const item =
      galleryItems[index];


    if (!item) {

      return null;

    }


    const image =
      item.querySelector(
        'img'
      );


    return {

      full:
        item.dataset.full ||
        image?.src ||
        '',

      alt:
        image?.alt ||
        '',

      caption:
        item.dataset.caption ||
        image?.alt ||
        ''

    };

  };



  /* =========================================================
     UPDATE LIGHTBOX
     ========================================================= */

  const renderLightboxImage = () => {

    const data =
      getGalleryData(
        currentGalleryIndex
      );


    if (
      !data ||
      !lightboxImage
    ) {

      return;

    }


    lightboxImage.src =
      data.full;


    lightboxImage.alt =
      data.alt;


    if (
      lightboxCaption
    ) {

      lightboxCaption.textContent =
        data.caption;

    }

  };



  /* =========================================================
     OPEN
     ========================================================= */

  const openLightbox = (
    index
  ) => {

    if (
      !lightbox ||
      galleryItems.length === 0
    ) {

      return;

    }


    currentGalleryIndex =
      index;


    renderLightboxImage();


    lightbox.classList.add(
      'is-open'
    );


    lightbox.setAttribute(
      'aria-hidden',
      'false'
    );


    document.body.classList.add(
      'epdm-lightbox-open'
    );


    const closeButton =
      lightbox.querySelector(
        '.epdm-lightbox-close'
      );


    window.setTimeout(
      () => {

        closeButton
          ?.focus();

      },
      20
    );

  };



  /* =========================================================
     CLOSE
     ========================================================= */

  const closeLightbox = () => {

    if (!lightbox) {

      return;

    }


    lightbox.classList.remove(
      'is-open'
    );


    lightbox.setAttribute(
      'aria-hidden',
      'true'
    );


    document.body.classList.remove(
      'epdm-lightbox-open'
    );


    const item =
      galleryItems[
        currentGalleryIndex
      ];


    window.setTimeout(
      () => {

        item
          ?.focus();

      },
      20
    );

  };



  /* =========================================================
     NEXT
     ========================================================= */

  const nextImage = () => {

    if (
      galleryItems.length === 0
    ) {

      return;

    }


    currentGalleryIndex =
      (
        currentGalleryIndex +
        1
      ) %
      galleryItems.length;


    renderLightboxImage();

  };



  /* =========================================================
     PREVIOUS
     ========================================================= */

  const previousImage = () => {

    if (
      galleryItems.length === 0
    ) {

      return;

    }


    currentGalleryIndex =
      (
        currentGalleryIndex -
        1 +
        galleryItems.length
      ) %
      galleryItems.length;


    renderLightboxImage();

  };



  /* =========================================================
     GALLERY EVENTS
     ========================================================= */

  galleryItems.forEach(
    (
      item,
      index
    ) => {

      item.addEventListener(
        'click',
        () => {

          openLightbox(
            index
          );

        }
      );

    }
  );



  closeButtons.forEach(
    (button) => {

      button.addEventListener(
        'click',
        closeLightbox
      );

    }
  );



  previousButton
    ?.addEventListener(
      'click',
      previousImage
    );



  nextButton
    ?.addEventListener(
      'click',
      nextImage
    );



  /* =========================================================
     KEYBOARD
     ========================================================= */

  document.addEventListener(
    'keydown',
    (event) => {

      if (
        !lightbox
          ?.classList
          .contains(
            'is-open'
          )
      ) {

        return;

      }


      if (
        event.key ===
        'Escape'
      ) {

        closeLightbox();

        return;

      }


      if (
        event.key ===
        'ArrowLeft'
      ) {

        previousImage();

        return;

      }


      if (
        event.key ===
        'ArrowRight'
      ) {

        nextImage();

      }

    }
  );



  /* =========================================================
     TOUCH SWIPE IN LIGHTBOX
     ========================================================= */

  if (lightbox) {

    let touchStartX = 0;

    let touchEndX = 0;


    lightbox.addEventListener(
      'touchstart',
      (event) => {

        touchStartX =
          event.changedTouches[
            0
          ].screenX;

      },
      {
        passive: true
      }
    );


    lightbox.addEventListener(
      'touchend',
      (event) => {

        touchEndX =
          event.changedTouches[
            0
          ].screenX;


        const difference =
          touchStartX -
          touchEndX;


        if (
          Math.abs(
            difference
          ) <
          50
        ) {

          return;

        }


        if (
          difference >
          0
        ) {

          nextImage();

        } else {

          previousImage();

        }

      },
      {
        passive: true
      }
    );

  }



  /* =========================================================
     SCROLL REVEAL

     Desktop / tablet only.
     Mobile cards already have horizontal motion,
     so we do not animate them vertically on mobile.
     ========================================================= */

  const revealItems =
    document.querySelectorAll(
      '[data-reveal]'
    );


  const reduceMotion =
    window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    );


  const mobileQuery =
    window.matchMedia(
      '(max-width: 767.98px)'
    );


  if (
    reduceMotion.matches ||
    mobileQuery.matches
  ) {

    revealItems.forEach(
      (item) => {

        item.classList.add(
          'is-visible'
        );

      }
    );

  } else if (
    'IntersectionObserver'
    in
    window
  ) {

    const observer =
      new IntersectionObserver(
        (
          entries,
          currentObserver
        ) => {

          entries.forEach(
            (entry) => {

              if (
                !entry.isIntersecting
              ) {

                return;

              }


              entry.target
                .classList
                .add(
                  'is-visible'
                );


              currentObserver
                .unobserve(
                  entry.target
                );

            }
          );

        },
        {

          root:
            null,

          rootMargin:
            '0px 0px -8% 0px',

          threshold:
            0.12

        }
      );


    revealItems.forEach(
      (item) => {

        observer.observe(
          item
        );

      }
    );

  } else {

    revealItems.forEach(
      (item) => {

        item.classList.add(
          'is-visible'
        );

      }
    );

  }



})();