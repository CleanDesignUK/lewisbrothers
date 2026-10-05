/* =========================================================
   LEWIS BROTHERS ROOFING & PLASTERING
   INDEX.JS

   Handles:
   - Lead form validation
   - Web3Forms submission
   - Homepage horizontal card controls
   ========================================================= */

(() => {

  'use strict';


  /* =======================================================
     CONFIG
     ======================================================= */

  const config =
    window.LEWIS_BROTHERS_CONFIG || {};


  const WEB3FORMS_ENDPOINT =
    'https://api.web3forms.com/submit';


  /* =======================================================
     DISPOSABLE EMAIL DOMAINS
     ======================================================= */

  const disposableDomains =
    new Set([

      'mailinator.com',
      '10minutemail.com',
      'guerrillamail.com',
      'tempmail.com',
      'yopmail.com',
      'trashmail.com',
      'throwawaymail.com',
      'fakeinbox.com',
      'getnada.com'

    ]);


  /* =======================================================
     HELPERS
     ======================================================= */

  const clean = (value) => {

    return String(
      value || ''
    ).trim();

  };


  const showAlert = (options) => {

    if (window.Swal) {

      return window.Swal.fire(
        options
      );

    }


    window.alert(
      options.text ||
      options.title ||
      'Please try again.'
    );


    return Promise.resolve();

  };


  /* =======================================================
     EMAIL VALIDATION
     ======================================================= */

  const validateEmail = (email) => {

    const value =
      clean(email)
        .toLowerCase();


    if (
      value.length < 6 ||
      value.length > 254
    ) {

      return false;

    }


    const pattern =
      /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;


    if (
      !pattern.test(value)
    ) {

      return false;

    }


    const domain =
      value.split('@')[1];


    if (
      !domain ||
      disposableDomains.has(domain)
    ) {

      return false;

    }


    return true;

  };


  /* =======================================================
     PHONE VALIDATION
     ======================================================= */

  const validatePhone = (phone) => {

    const value =
      clean(phone);


    if (!value) {

      return false;

    }


    const digits =
      value.replace(
        /\D/g,
        ''
      );


    /*
     * UK numbers entered as:
     *
     * 07932 511032
     * +44 7932 511032
     *
     * are both accepted.
     */

    if (
      digits.length < 10 ||
      digits.length > 13
    ) {

      return false;

    }


    /*
     * Reject only very obvious fake numbers.
     */

    if (
      /^(\d)\1+$/.test(digits)
    ) {

      return false;

    }


    return true;

  };


  /* =======================================================
     CLEAR VALIDATION
     ======================================================= */

  const clearInvalid = (form) => {

    form
      .querySelectorAll(
        '.is-invalid'
      )
      .forEach((field) => {

        field.classList.remove(
          'is-invalid'
        );


        field.removeAttribute(
          'aria-invalid'
        );

      });

  };


  /* =======================================================
     MARK FIELD INVALID
     ======================================================= */

  const markInvalid = (
    field,
    message
  ) => {

    if (!field) {

      return;

    }


    field.classList.add(
      'is-invalid'
    );


    field.setAttribute(
      'aria-invalid',
      'true'
    );


    const wrapper =
      field.parentElement;


    const feedback =
      wrapper?.querySelector(
        '.invalid-feedback'
      );


    if (
      feedback &&
      message
    ) {

      feedback.textContent =
        message;

    }

  };


  /* =======================================================
     VALIDATE FORM
     ======================================================= */

  const validateForm = (form) => {

    clearInvalid(form);


    let valid = true;


    const name =
      form.querySelector(
        '[name="name"]'
      );


    const email =
      form.querySelector(
        '[name="email"]'
      );


    const phone =
      form.querySelector(
        '[name="phone"]'
      );


    const service =
      form.querySelector(
        '[name="service"]'
      );


    const location =
      form.querySelector(
        '[name="location"]'
      );


    const message =
      form.querySelector(
        '[name="message"][required]'
      );


    /* =====================================================
       NAME
       ===================================================== */

    if (name) {

      const value =
        clean(name.value);


      if (
        value.length < 2 ||
        value.length > 80
      ) {

        markInvalid(
          name,
          'Please enter your name.'
        );


        valid = false;

      }

    }


    /* =====================================================
       EMAIL
       ===================================================== */

    if (
      email &&
      !validateEmail(
        email.value
      )
    ) {

      markInvalid(
        email,
        'Please enter a valid email address.'
      );


      valid = false;

    }


    /* =====================================================
       PHONE
       ===================================================== */

    if (
      phone &&
      !validatePhone(
        phone.value
      )
    ) {

      markInvalid(
        phone,
        'Please enter a valid phone number.'
      );


      valid = false;

    }


    /* =====================================================
       SERVICE
       ===================================================== */

    if (
      service &&
      service.required &&
      !clean(service.value)
    ) {

      markInvalid(
        service,
        'Please choose a service.'
      );


      valid = false;

    }


    /* =====================================================
       LOCATION
       ===================================================== */

    if (location) {

      const value =
        clean(location.value);


      if (
        location.required &&
        (
          value.length < 2 ||
          value.length > 100
        )
      ) {

        markInvalid(
          location,
          'Please enter the property location or postcode.'
        );


        valid = false;

      }

    }


    /* =====================================================
       MESSAGE
       ===================================================== */

    if (message) {

      const value =
        clean(message.value);


      if (
        value.length < 5
      ) {

        markInvalid(
          message,
          'Please tell us briefly what work you need.'
        );


        valid = false;

      }

    }


    return valid;

  };


  /* =======================================================
     CHECK WEB3FORMS KEY
     ======================================================= */

  const web3FormsIsConfigured = () => {

    return Boolean(
      clean(
        config.web3FormsAccessKey
      )
    );

  };


  /* =======================================================
     SUBMIT FORM
     ======================================================= */

  const submitForm =
    async (form) => {


      if (
        form.dataset.submitting ===
        'true'
      ) {

        return;

      }


      /* ===================================================
         VALIDATE
         =================================================== */

      const valid =
        validateForm(form);


      if (!valid) {

        const firstInvalid =
          form.querySelector(
            '.is-invalid'
          );


        if (firstInvalid) {

          firstInvalid.focus();


          firstInvalid.scrollIntoView({

            behavior:
              'smooth',

            block:
              'center'

          });

        }


        return;

      }


      /* ===================================================
         WEB3FORMS KEY
         =================================================== */

      if (
        !web3FormsIsConfigured()
      ) {

        await showAlert({

          icon:
            'error',

          title:
            'Form configuration error',

          text:
            'The enquiry form is not connected correctly yet.',

          confirmButtonText:
            'OK',

          confirmButtonColor:
            '#163153'

        });


        console.error(
          'Missing web3FormsAccessKey in js/config.js'
        );


        return;

      }


      const submitButton =
        form.querySelector(
          'button[type="submit"]'
        );


      if (!submitButton) {

        console.error(
          'Form submit button could not be found.'
        );


        return;

      }


      const originalHTML =
        submitButton.innerHTML;


      form.dataset.submitting =
        'true';


      submitButton.disabled =
        true;


      submitButton.innerHTML = `
        <span
          class="spinner-border spinner-border-sm me-2"
          aria-hidden="true"
        ></span>
        Sending...
      `;


      /* ===================================================
         BUILD DATA
         =================================================== */

      const data =
        new FormData(form);


      /*
       * Add the Web3Forms key from config.js.
       */

      data.set(
        'access_key',
        config.web3FormsAccessKey
      );


      /*
       * Email subject.
       */

      const serviceName =
        clean(
          data.get(
            'service'
          )
        ) ||
        'Website';


      data.set(
        'subject',
        `New ${serviceName} enquiry - Lewis Brothers website`
      );


      data.set(
        'from_name',
        'Lewis Brothers Website'
      );


      data.set(
        'page_url',
        window.location.href
      );


      /* ===================================================
         SUBMIT TO WEB3FORMS
         =================================================== */

      try {

        const response =
          await fetch(
            WEB3FORMS_ENDPOINT,
            {

              method:
                'POST',

              body:
                data

            }
          );


        let result;


        try {

          result =
            await response.json();

        } catch (jsonError) {

          throw new Error(
            'Web3Forms returned an invalid response.'
          );

        }


        console.log(
          'Web3Forms response:',
          result
        );


        if (
          !response.ok ||
          result.success !== true
        ) {

          throw new Error(
            result.message ||
            `Web3Forms returned HTTP ${response.status}`
          );

        }


        /* =================================================
           SUCCESS
           ================================================= */

        form.reset();


        clearInvalid(
          form
        );


        await showAlert({

          icon:
            'success',

          title:
            'Thank you!',

          text:
            'Our team will be in touch with you soon.',

          confirmButtonText:
            'Close',

          confirmButtonColor:
            '#163153'

        });


      } catch (error) {

        console.error(
          'Lewis Brothers form submission error:',
          error
        );


        const errorMessage =
          error instanceof Error
            ? error.message
            : String(error);


        await showAlert({

          icon:
            'error',

          title:
            "We couldn't send your enquiry",

          text:
            'Please try again or call us on 07932 511032.',

          confirmButtonText:
            'Close',

          confirmButtonColor:
            '#163153'

        });


        console.error(
          'Web3Forms error details:',
          errorMessage
        );


      } finally {

        form.dataset.submitting =
          'false';


        submitButton.disabled =
          false;


        submitButton.innerHTML =
          originalHTML;

      }

    };


  /* =======================================================
     INITIALISE FORMS
     ======================================================= */

  const initialiseLeadForms = () => {

    const forms =
      document.querySelectorAll(
        '.lead-form'
      );


    forms.forEach((form) => {


      if (
        form.dataset.leadFormBound ===
        'true'
      ) {

        return;

      }


      form.dataset.leadFormBound =
        'true';


      form.addEventListener(
        'submit',
        (event) => {

          event.preventDefault();


          submitForm(
            form
          );

        }
      );


      form
        .querySelectorAll(
          'input, select, textarea'
        )
        .forEach((field) => {


          const clearFieldError =
            () => {

              field.classList.remove(
                'is-invalid'
              );


              field.removeAttribute(
                'aria-invalid'
              );

            };


          field.addEventListener(
            'input',
            clearFieldError
          );


          field.addEventListener(
            'change',
            clearFieldError
          );

        });

    });

  };


  /* =======================================================
     CARD SCROLLING
     ======================================================= */

  const scrollCards = (
    elementId,
    direction
  ) => {

    const element =
      document.getElementById(
        elementId
      );


    if (!element) {

      return;

    }


    const firstCard =
      element.firstElementChild;


    let amount =
      Math.min(
        element.clientWidth * 0.85,
        380
      );


    if (firstCard) {

      const styles =
        window.getComputedStyle(
          element
        );


      const gap =
        parseFloat(
          styles.columnGap ||
          styles.gap ||
          '0'
        ) || 0;


      amount =
        firstCard
          .getBoundingClientRect()
          .width +
        gap;

    }


    element.scrollBy({

      left:
        direction === 'right'
          ? amount
          : -amount,

      behavior:
        'smooth'

    });

  };


  /* =======================================================
     CARD ARROWS
     ======================================================= */

  const initialiseHomepageScrollers =
    () => {


      document
        .querySelectorAll(
          '[data-scroll-left]'
        )
        .forEach((button) => {


          if (
            button.dataset.scrollButtonBound ===
            'true'
          ) {

            return;

          }


          button.dataset.scrollButtonBound =
            'true';


          button.addEventListener(
            'click',
            () => {

              scrollCards(
                button.dataset.scrollLeft,
                'left'
              );

            }
          );

        });


      document
        .querySelectorAll(
          '[data-scroll-right]'
        )
        .forEach((button) => {


          if (
            button.dataset.scrollButtonBound ===
            'true'
          ) {

            return;

          }


          button.dataset.scrollButtonBound =
            'true';


          button.addEventListener(
            'click',
            () => {

              scrollCards(
                button.dataset.scrollRight,
                'right'
              );

            }
          );

        });

  };


  /* =======================================================
     INITIALISE PAGE
     ======================================================= */

  const initialisePage = () => {

    initialiseLeadForms();

    initialiseHomepageScrollers();

  };


  if (
    document.readyState ===
    'loading'
  ) {

    document.addEventListener(
      'DOMContentLoaded',
      initialisePage,
      {
        once: true
      }
    );


  } else {

    initialisePage();

  }


  document.addEventListener(
    'lewis:components-ready',
    initialisePage
  );

})();