/* =========================================================
   LEWIS BROTHERS ROOFING & PLASTERING
   INDEX.JS
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


  const disposableDomains =
    new Set([
      'mailinator.com',
      '10minutemail.com',
      'guerrillamail.com',
      'tempmail.com',
      'yopmail.com',
      'throwawaymail.com',
      'fakeinbox.com',
      'getnada.com'
    ]);



  /* =======================================================
     GENERAL HELPERS
     ======================================================= */

  const clean = (value) => {
    return String(value || '').trim();
  };


  const showAlert = (options) => {

    if (window.Swal) {
      return window.Swal.fire(options);
    }

    const message =
      options.text ||
      options.title ||
      'Please try again.';

    window.alert(message);

    return Promise.resolve();

  };



  /* =======================================================
     EMAIL VALIDATION
     ======================================================= */

  const validateEmail = (email) => {

    const value =
      clean(email).toLowerCase();


    if (
      value.length < 6 ||
      value.length > 254
    ) {
      return false;
    }


    /*
     * Reject obvious repeated-character spam.
     */

    if (/(.)\1{5,}/.test(value)) {
      return false;
    }


    /*
     * Sensible client-side format check.
     *
     * This confirms a plausible email structure.
     * Actual mailbox ownership cannot be verified
     * purely from client-side JavaScript.
     */

    const pattern =
      /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;


    if (!pattern.test(value)) {
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
     UK PHONE VALIDATION
     ======================================================= */

  const validateUKPhone = (phone) => {

    const raw =
      clean(phone);


    if (!raw) {
      return false;
    }


    const digits =
      raw.replace(/\D/g, '');


    /*
     * Reject 1111, 0000, 7777 etc.
     */

    if (/(\d)\1{3,}/.test(digits)) {
      return false;
    }


    /*
     * Reject obvious sequential dummy numbers.
     */

    if (
      /0123456789/.test(digits) ||
      /1234567890/.test(digits) ||
      /9876543210/.test(digits)
    ) {
      return false;
    }


    /*
     * Require reasonable number variation.
     */

    if (
      new Set(digits).size < 4
    ) {
      return false;
    }


    /*
     * International UK format:
     * +44...
     */

    if (digits.startsWith('44')) {

      if (digits.length !== 12) {
        return false;
      }

      return /^44(?:1|2|3|7)\d{9}$/.test(
        digits
      );

    }


    /*
     * Domestic UK format:
     * 01...
     * 02...
     * 03...
     * 07...
     */

    if (digits.startsWith('0')) {

      if (digits.length !== 11) {
        return false;
      }

      return /^0(?:1|2|3|7)\d{9}$/.test(
        digits
      );

    }


    return false;

  };



  /* =======================================================
     INVALID FIELD HELPERS
     ======================================================= */

  const findFeedbackElement = (field) => {

    const wrapper =
      field.closest(
        '.hero-field, .form-field, .col-12, .col-md-6'
      );


    return wrapper?.querySelector(
      '.invalid-feedback'
    );

  };


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


    const feedback =
      findFeedbackElement(field);


    if (feedback) {
      feedback.textContent = message;
    }

  };


  const clearInvalid = (form) => {

    form
      .querySelectorAll('.is-invalid')
      .forEach((field) => {

        field.classList.remove(
          'is-invalid'
        );

      });

  };



  /* =======================================================
     FORM VALIDATION
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


    const honeypot =
      form.querySelector(
        '[name="company_website"]'
      );


    /*
     * Spam honeypot.
     */

    if (
      honeypot &&
      clean(honeypot.value)
    ) {
      return false;
    }


    /*
     * Name.
     */

    if (
      !name ||
      clean(name.value).length < 2 ||
      /https?:\/\//i.test(name.value)
    ) {

      markInvalid(
        name,
        'Please enter your name.'
      );

      valid = false;

    }


    /*
     * Email.
     */

    if (
      !email ||
      !validateEmail(email.value)
    ) {

      markInvalid(
        email,
        'Please enter a valid email address.'
      );

      valid = false;

    }


    /*
     * Phone.
     */

    if (
      !phone ||
      !validateUKPhone(phone.value)
    ) {

      markInvalid(
        phone,
        'Please enter a valid UK phone number.'
      );

      valid = false;

    }


    /*
     * Service.
     */

    if (
      !service ||
      !clean(service.value)
    ) {

      markInvalid(
        service,
        'Please choose a service.'
      );

      valid = false;

    }


    /*
     * Location / postcode.
     */

    if (
      !location ||
      clean(location.value).length < 2 ||
      clean(location.value).length > 90
    ) {

      markInvalid(
        location,
        'Please enter the property location or postcode.'
      );

      valid = false;

    }


    /*
     * Message is required only on forms
     * where the message textarea itself
     * has the required attribute.
     */

    const message =
      form.querySelector(
        '[name="message"][required]'
      );


    if (
      message &&
      clean(message.value).length < 5
    ) {

      markInvalid(
        message,
        'Please tell us briefly what work you need.'
      );

      valid = false;

    }


    /*
     * Basic anti-bot timing check.
     */

    const loadedAt =
      Number(
        form.dataset.loadedAt ||
        Date.now()
      );


    if (
      Date.now() - loadedAt < 2500
    ) {
      valid = false;
    }


    return valid;

  };



  /* =======================================================
     WEB3FORMS SETUP WARNING
     ======================================================= */

  const showSetupWarning = () => {

    return showAlert({

      icon: 'info',

      title: 'Form setup needed',

      text:
        'Add your Web3Forms access key in js/config.js before publishing the website.',

      confirmButtonText: 'OK',

      customClass: {
        confirmButton:
          'swal-brand-button'
      },

      buttonsStyling: false

    });

  };



  /* =======================================================
     SUBMIT LEAD FORM
     ======================================================= */

  const submitForm = async (form) => {

    if (!validateForm(form)) {

      const firstInvalid =
        form.querySelector(
          '.is-invalid'
        );


      if (firstInvalid) {

        firstInvalid.focus({
          preventScroll: false
        });

      } else {

        showAlert({

          icon: 'warning',

          title:
            'Please check your details',

          text:
            'Please complete the form carefully and try again.',

          confirmButtonText: 'OK',

          customClass: {
            confirmButton:
              'swal-brand-button'
          },

          buttonsStyling: false

        });

      }


      return;

    }


    if (
      !config.web3FormsAccessKey ||
      config.web3FormsAccessKey ===
        'YOUR_WEB3FORMS_ACCESS_KEY'
    ) {

      showSetupWarning();

      return;

    }


    const submitButton =
      form.querySelector(
        'button[type="submit"]'
      );


    if (!submitButton) {
      return;
    }


    const originalText =
      submitButton.innerHTML;


    submitButton.disabled = true;


    submitButton.innerHTML = `
      <span
        class="spinner-border spinner-border-sm me-2"
        aria-hidden="true"
      ></span>
      Sending...
    `;


    const data =
      new FormData(form);


    data.append(
      'access_key',
      config.web3FormsAccessKey
    );


    data.append(
      'subject',
      `New ${data.get('service')} enquiry from Lewis Brothers website`
    );


    data.append(
      'from_name',
      'Lewis Brothers Website'
    );


    data.append(
      'page_url',
      window.location.href
    );


    try {

      const response =
        await fetch(
          WEB3FORMS_ENDPOINT,
          {
            method: 'POST',
            body: data
          }
        );


      const result =
        await response.json();


      if (
        !response.ok ||
        !result.success
      ) {

        throw new Error(
          result.message ||
          'Form submission failed'
        );

      }


      form.reset();


      form.dataset.loadedAt =
        Date.now().toString();


      await showAlert({

        icon: 'success',

        title: 'Thank you!',

        text:
          'Our team will be in touch with you soon.',

        confirmButtonText:
          'Close',

        customClass: {
          confirmButton:
            'swal-brand-button'
        },

        buttonsStyling: false

      });


    } catch (error) {

      const phoneE164 =
        config.phoneE164 ||
        '+447932511032';


      const phoneDisplay =
        config.phoneDisplay ||
        '07932 511032';


      await showAlert({

        icon: 'error',

        title:
          'We could not send your enquiry',

        html:
          `Please try again, or call <a href="tel:${phoneE164}">${phoneDisplay}</a>.`,

        confirmButtonText:
          'Close',

        customClass: {
          confirmButton:
            'swal-brand-button'
        },

        buttonsStyling: false

      });


    } finally {

      submitButton.disabled = false;

      submitButton.innerHTML =
        originalText;

    }

  };



  /* =======================================================
     INITIALISE LEAD FORMS
     ======================================================= */

  const initialiseLeadForms = () => {

    document
      .querySelectorAll('.lead-form')
      .forEach((form) => {

        /*
         * Prevent duplicate listeners.
         */

        if (
          form.dataset.leadFormBound ===
          'true'
        ) {
          return;
        }


        form.dataset.leadFormBound =
          'true';


        form.dataset.loadedAt =
          Date.now().toString();


        form.addEventListener(
          'submit',
          (event) => {

            event.preventDefault();

            submitForm(form);

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
     TESTIMONIAL HELPERS
     ======================================================= */

  const getTestimonialsTrack = () => {

    return document.querySelector(
      '[data-testimonials-track]'
    );

  };


  const getTestimonialScrollDistance =
    (track) => {

      if (!track) {
        return 0;
      }


      const card =
        track.querySelector(
          '.testimonial-review'
        );


      if (!card) {
        return track.clientWidth;
      }


      const styles =
        window.getComputedStyle(track);


      const gap =
        parseFloat(
          styles.columnGap ||
          styles.gap ||
          '0'
        ) || 0;


      return (
        card.getBoundingClientRect().width +
        gap
      );

    };



  /* =======================================================
     TESTIMONIAL ARROW NAVIGATION
     ======================================================= */

  const moveTestimonials = (
    direction
  ) => {

    const track =
      getTestimonialsTrack();


    if (!track) {
      return;
    }


    const distance =
      getTestimonialScrollDistance(
        track
      );


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


    if (direction === 'next') {

      /*
       * Loop back to the beginning
       * after reaching the final cards.
       */

      if (
        track.scrollLeft >=
        maxScroll - tolerance
      ) {

        target = 0;

      } else {

        target =
          Math.min(
            track.scrollLeft +
            distance,
            maxScroll
          );

      }

    } else {

      /*
       * From the beginning, previous
       * loops around to the end.
       */

      if (
        track.scrollLeft <=
        tolerance
      ) {

        target = maxScroll;

      } else {

        target =
          Math.max(
            track.scrollLeft -
            distance,
            0
          );

      }

    }


    track.scrollTo({

      left: target,

      behavior: 'smooth'

    });

  };



  /* =======================================================
     TESTIMONIAL READ MORE / LESS
     ======================================================= */

  const toggleTestimonial = (
    button
  ) => {

    const review =
      button.closest(
        '.testimonial-review'
      );


    if (!review) {
      return;
    }


    const expanded =
      review.classList.toggle(
        'is-expanded'
      );


    button.textContent =
      expanded
        ? 'Read less'
        : 'Read more';


    button.setAttribute(
      'aria-expanded',
      String(expanded)
    );

  };



  /* =======================================================
     GLOBAL CLICK HANDLER

     Event delegation means these controls work even if
     index.js is loaded before the testimonial section.
     ======================================================= */

  document.addEventListener(
    'click',
    (event) => {

      const previousButton =
        event.target.closest(
          '[data-testimonial-prev]'
        );


      if (previousButton) {

        event.preventDefault();

        moveTestimonials(
          'previous'
        );

        return;

      }


      const nextButton =
        event.target.closest(
          '[data-testimonial-next]'
        );


      if (nextButton) {

        event.preventDefault();

        moveTestimonials(
          'next'
        );

        return;

      }


      const readButton =
        event.target.closest(
          '.testimonial-read-button'
        );


      if (readButton) {

        event.preventDefault();

        toggleTestimonial(
          readButton
        );

      }

    }
  );



  /* =======================================================
     INITIAL PAGE LOAD
     ======================================================= */

  const initialiseIndexPage = () => {

    initialiseLeadForms();

  };


  if (
    document.readyState ===
    'loading'
  ) {

    document.addEventListener(
      'DOMContentLoaded',
      initialiseIndexPage,
      {
        once: true
      }
    );

  } else {

    initialiseIndexPage();

  }



  document.addEventListener(
    'lewis:components-ready',
    initialiseLeadForms
  );

})();