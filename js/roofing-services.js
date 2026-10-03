(() => {

  'use strict';



  /* =========================================================
     GALLERY ELEMENTS
     ========================================================= */

  const lightbox =
    document.getElementById(
      'roofingLightbox'
    );


  const lightboxImage =
    document.getElementById(
      'roofingLightboxImage'
    );


  const lightboxCaption =
    document.getElementById(
      'roofingLightboxCaption'
    );


  const galleryItems =
    Array.from(
      document.querySelectorAll(
        '[data-roofing-gallery]'
      )
    );


  const closeButtons =
    document.querySelectorAll(
      '[data-roofing-lightbox-close]'
    );


  const previousButton =
    document.querySelector(
      '[data-roofing-lightbox-prev]'
    );


  const nextButton =
    document.querySelector(
      '[data-roofing-lightbox-next]'
    );


  let currentGalleryIndex = 0;



  /* =========================================================
     IMAGE DATA
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
     RENDER
     ========================================================= */

  const renderLightbox = () => {

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


    if (lightboxCaption) {

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


    renderLightbox();


    lightbox.classList.add(
      'is-open'
    );


    lightbox.setAttribute(
      'aria-hidden',
      'false'
    );


    document.body.classList.add(
      'roofing-lightbox-open'
    );


    window.setTimeout(
      () => {

        lightbox
          .querySelector(
            '.roofing-lightbox-close'
          )
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
      'roofing-lightbox-open'
    );


    window.setTimeout(
      () => {

        galleryItems[
          currentGalleryIndex
        ]?.focus();

      },
      20
    );

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


    renderLightbox();

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


    renderLightbox();

  };



  /* =========================================================
     OPEN EVENTS
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



  /* =========================================================
     CLOSE EVENTS
     ========================================================= */

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
     MOBILE LIGHTBOX SWIPE
     ========================================================= */

  if (lightbox) {

    let startX = 0;

    let endX = 0;


    lightbox.addEventListener(
      'touchstart',
      (event) => {

        startX =
          event
            .changedTouches[0]
            .screenX;

      },
      {
        passive: true
      }
    );


    lightbox.addEventListener(
      'touchend',
      (event) => {

        endX =
          event
            .changedTouches[0]
            .screenX;


        const distance =
          startX -
          endX;


        if (
          Math.abs(
            distance
          ) <
          50
        ) {

          return;

        }


        if (
          distance >
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


})();