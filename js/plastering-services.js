/* ============================================================
   LEWIS BROTHERS
   PLASTERING SERVICES PAGE
   ============================================================ */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    initPlasteringServices();

    initPlasteringReasons();

    initPlasteringGallery();

    initPlasteringGalleryScroll();

  }
);



/* ============================================================
   PLASTERING SERVICES
   DESKTOP TABS + MOBILE ARROWS
   ============================================================ */

function initPlasteringServices() {

  const tabs = Array.from(
    document.querySelectorAll(
      "[data-plaster-tab]"
    )
  );


  const panels = Array.from(
    document.querySelectorAll(
      "[data-plaster-panel]"
    )
  );


  const previousButton =
    document.querySelector(
      "[data-plaster-service-prev]"
    );


  const nextButton =
    document.querySelector(
      "[data-plaster-service-next]"
    );


  const currentDisplay =
    document.querySelector(
      "[data-plaster-service-current]"
    );


  if (!panels.length) {
    return;
  }


  let activeIndex = 0;



  /* ----------------------------------------------------------
     ACTIVATE
     ---------------------------------------------------------- */

  const activateService = (index) => {

    if (index < 0) {
      index = panels.length - 1;
    }


    if (index >= panels.length) {
      index = 0;
    }


    activeIndex = index;



    /* PANELS */

    panels.forEach(
      (panel, panelIndex) => {

        const active =
          panelIndex === activeIndex;


        panel.hidden = !active;


        panel.classList.toggle(
          "is-active",
          active
        );

      }
    );



    /* DESKTOP TABS */

    tabs.forEach(
      (tab, tabIndex) => {

        const active =
          tabIndex === activeIndex;


        tab.classList.toggle(
          "is-active",
          active
        );


        tab.setAttribute(
          "aria-selected",
          String(active)
        );

      }
    );



    /* MOBILE COUNTER */

    if (currentDisplay) {

      currentDisplay.textContent =
        String(activeIndex + 1)
          .padStart(2, "0");

    }

  };



  /* ----------------------------------------------------------
     DESKTOP TAB EVENTS
     ---------------------------------------------------------- */

  tabs.forEach(
    (tab, index) => {

      tab.addEventListener(
        "click",
        () => {

          activateService(index);

        }
      );

    }
  );



  /* ----------------------------------------------------------
     MOBILE PREVIOUS
     ---------------------------------------------------------- */

  previousButton?.addEventListener(
    "click",
    () => {

      activateService(
        activeIndex - 1
      );

    }
  );



  /* ----------------------------------------------------------
     MOBILE NEXT
     ---------------------------------------------------------- */

  nextButton?.addEventListener(
    "click",
    () => {

      activateService(
        activeIndex + 1
      );

    }
  );



  /* ----------------------------------------------------------
     KEYBOARD FOR DESKTOP TABS
     ---------------------------------------------------------- */

  tabs.forEach(
    (tab, index) => {

      tab.addEventListener(
        "keydown",
        (event) => {

          let nextIndex = null;


          if (
            event.key === "ArrowRight"
          ) {

            nextIndex =
              (
                index + 1
              )
              % tabs.length;

          }


          if (
            event.key === "ArrowLeft"
          ) {

            nextIndex =
              (
                index - 1
                + tabs.length
              )
              % tabs.length;

          }


          if (nextIndex === null) {
            return;
          }


          event.preventDefault();


          tabs[nextIndex].focus();


          activateService(
            nextIndex
          );

        }
      );

    }
  );



  activateService(0);

}



/* ============================================================
   WHY LEWIS BROTHERS ACCORDION
   ============================================================ */

function initPlasteringReasons() {

  const items = Array.from(
    document.querySelectorAll(
      "[data-plaster-reason]"
    )
  );


  if (!items.length) {
    return;
  }


  items.forEach((item) => {

    const button =
      item.querySelector(
        ".plastering-reason-button"
      );


    if (!button) {
      return;
    }


    button.addEventListener(
      "click",
      () => {

        const isCurrentlyOpen =
          item.classList.contains(
            "is-open"
          );


        items.forEach(
          (otherItem) => {

            otherItem.classList.remove(
              "is-open"
            );


            const otherButton =
              otherItem.querySelector(
                ".plastering-reason-button"
              );


            otherButton?.setAttribute(
              "aria-expanded",
              "false"
            );

          }
        );


        if (!isCurrentlyOpen) {

          item.classList.add(
            "is-open"
          );


          button.setAttribute(
            "aria-expanded",
            "true"
          );

        }

      }
    );

  });

}



/* ============================================================
   GALLERY LIGHTBOX
   ============================================================ */

function initPlasteringGallery() {

  const items = Array.from(
    document.querySelectorAll(
      "[data-plastering-gallery]"
    )
  );


  const lightbox =
    document.getElementById(
      "plasteringLightbox"
    );


  const image =
    document.getElementById(
      "plasteringLightboxImage"
    );


  const caption =
    document.getElementById(
      "plasteringLightboxCaption"
    );


  const closeButtons =
    document.querySelectorAll(
      "[data-plastering-lightbox-close]"
    );


  const previousButton =
    document.querySelector(
      "[data-plastering-lightbox-prev]"
    );


  const nextButton =
    document.querySelector(
      "[data-plastering-lightbox-next]"
    );


  if (
    !items.length
    ||
    !lightbox
    ||
    !image
  ) {

    return;

  }


  let activeIndex = 0;

  let previouslyFocused = null;



  /* ----------------------------------------------------------
     UPDATE
     ---------------------------------------------------------- */

  const update = () => {

    const item =
      items[activeIndex];


    const thumbnail =
      item.querySelector("img");


    image.src =
      item.dataset.full
      ||
      thumbnail?.src
      ||
      "";


    image.alt =
      thumbnail?.alt
      ||
      item.dataset.caption
      ||
      "Plastering project";


    if (caption) {

      caption.textContent =
        item.dataset.caption
        ||
        "";

    }

  };



  /* ----------------------------------------------------------
     OPEN
     ---------------------------------------------------------- */

  const open = (index) => {

    activeIndex = index;


    previouslyFocused =
      document.activeElement;


    update();


    lightbox.classList.add(
      "is-open"
    );


    lightbox.setAttribute(
      "aria-hidden",
      "false"
    );


    document.body.style.overflow =
      "hidden";


    lightbox
      .querySelector(
        ".plastering-lightbox-close"
      )
      ?.focus();

  };



  /* ----------------------------------------------------------
     CLOSE
     ---------------------------------------------------------- */

  const close = () => {

    lightbox.classList.remove(
      "is-open"
    );


    lightbox.setAttribute(
      "aria-hidden",
      "true"
    );


    document.body.style.overflow =
      "";


    image.src = "";


    previouslyFocused?.focus?.();

  };



  /* ----------------------------------------------------------
     PREVIOUS
     ---------------------------------------------------------- */

  const previous = () => {

    activeIndex =
      (
        activeIndex
        - 1
        + items.length
      )
      % items.length;


    update();

  };



  /* ----------------------------------------------------------
     NEXT
     ---------------------------------------------------------- */

  const next = () => {

    activeIndex =
      (
        activeIndex + 1
      )
      % items.length;


    update();

  };



  /* ----------------------------------------------------------
     IMAGE EVENTS
     ---------------------------------------------------------- */

  items.forEach(
    (item, index) => {

      item.addEventListener(
        "click",
        () => {

          open(index);

        }
      );

    }
  );



  /* ----------------------------------------------------------
     CLOSE EVENTS
     ---------------------------------------------------------- */

  closeButtons.forEach(
    (button) => {

      button.addEventListener(
        "click",
        close
      );

    }
  );


  previousButton?.addEventListener(
    "click",
    previous
  );


  nextButton?.addEventListener(
    "click",
    next
  );



  /* ----------------------------------------------------------
     KEYBOARD
     ---------------------------------------------------------- */

  document.addEventListener(
    "keydown",
    (event) => {

      if (
        !lightbox.classList.contains(
          "is-open"
        )
      ) {

        return;

      }


      if (
        event.key === "Escape"
      ) {

        close();

      }


      if (
        event.key === "ArrowLeft"
      ) {

        previous();

      }


      if (
        event.key === "ArrowRight"
      ) {

        next();

      }

    }
  );

}



/* ============================================================
   MOBILE GALLERY ARROWS
   ============================================================ */

function initPlasteringGalleryScroll() {

  const track =
    document.querySelector(
      "[data-plastering-gallery-track]"
    );


  const previousButton =
    document.querySelector(
      "[data-gallery-scroll-prev]"
    );


  const nextButton =
    document.querySelector(
      "[data-gallery-scroll-next]"
    );


  if (!track) {
    return;
  }



  const getScrollDistance = () => {

    const firstCard =
      track.querySelector(
        ".plastering-gallery-item"
      );


    if (!firstCard) {

      return (
        track.clientWidth * 0.8
      );

    }


    const trackStyles =
      window.getComputedStyle(
        track
      );


    const gap =
      parseFloat(
        trackStyles.gap
      )
      ||
      14;


    return (
      firstCard
        .getBoundingClientRect()
        .width
      +
      gap
    );

  };



  previousButton?.addEventListener(
    "click",
    () => {

      track.scrollBy({

        left:
          -getScrollDistance(),

        behavior:
          "smooth"

      });

    }
  );



  nextButton?.addEventListener(
    "click",
    () => {

      track.scrollBy({

        left:
          getScrollDistance(),

        behavior:
          "smooth"

      });

    }
  );

}