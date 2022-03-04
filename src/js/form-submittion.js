import axios from "axios";

class FormHandler {
  #emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  constructor(form) {
    this.form = form;
    this.formData = {};
    this.isRecaptchaPassed;
    this.init();
  }

  #createWholeFormMessage(type, message) {
    const errorSpan = this.__proto__.constructor.#createMessageSpan(
      message,
      true,
      type
    );
    this.form.insertBefore(errorSpan, this.form.firstChild);
  }

  static #handleInputError(input, message) {
    input.classList.add("form__input--error");
    const span = this.#createMessageSpan(message);
    input.insertAdjacentElement("afterend", span);
  }

  static #createMessageSpan(message, isWholeFormMessage, messageType) {
    const span = document.createElement("span");
    span.classList.add("form__message");
    isWholeFormMessage && span.classList.add("form__message--whole");
    messageType === "success"
      ? span.classList.add("form__message--success")
      : span.classList.add("form__message--error");
    span.textContent = message;
    return span;
  }

  static #resetForm() {
    const formMessages = this.form.querySelectorAll(".form__message");
    if (formMessages.length === 0) return;
    formMessages.forEach((message) => message.remove());
    const errorInputs = document.querySelectorAll(".form__input--error");
    errorInputs.forEach((input) =>
      input.classList.remove("form__input--error")
    );
  }

  init() {
    this.form.addEventListener("submit", this.handleSubmit.bind(this));
    const inputs = this.form.querySelectorAll("input");
    inputs.forEach((input) =>
      input.addEventListener(
        "input",
        this.__proto__.constructor.#resetForm.bind(this)
      )
    );
    document.addEventListener(
      "click",
      this.__proto__.constructor.#resetForm.bind(this)
    );
  }

  disableForm() {
    const elements = this.form.elements;
    document.removeEventListener("click", this.__proto__.constructor.#resetForm.bind(this));
    document.removeEventListener("input", this.__proto__.constructor.#resetForm.bind(this));
    for (let i = 0, ; i < elements.length; ++i) 
      elements[i].disabled = true;
  }

  async handleSubmit(e) {
    e.preventDefault();
    console.log("Validating form");
    const isFormValid = this.validateForm();
    if (!isFormValid) return;
    console.log("sending form");
    this.checkRecaptchaAndSubmit();
  }

  validateForm() {
    const fullNameInput = this.form.querySelector('input[name="full_name"]');
    const emailInput = this.form.querySelector('input[name="email"]');
    const phoneNumberInput = this.form.querySelector(
      'input[name="phone_number"]'
    );

    const hasFullName = fullNameInput.value !== "";
    const hasEmail = emailInput.value !== "";
    const hasPhone = phoneNumberInput.value !== "";

    !hasFullName &&
      this.__proto__.constructor.#handleInputError(
        fullNameInput,
        "Please enter your name"
      );
    !hasEmail &&
      this.__proto__.constructor.#handleInputError(
        emailInput,
        "Please enter your email"
      );
    !hasPhone &&
      this.__proto__.constructor.#handleInputError(
        phoneNumberInput,
        "Please enter your phone number"
      );

    const isEmailValid = this.#emailRegex.test(emailInput.value);
    !isEmailValid &&
      this.__proto__.constructor.#handleInputError(
        emailInput,
        "Your email doesn't seem valid!"
      );

    const [firstName, lastName] = fullNameInput.value.split(" ");

    (!firstName || !lastName) &&
      this.__proto__.constructor.#handleInputError(
        fullNameInput,
        "Please enter both your first name and your full name!"
      );

    if (
      hasFullName &&
      hasEmail &&
      hasPhone &&
      isEmailValid &&
      firstName &&
      lastName
    ) {
      this.formData = {
        first_name: firstName,
        last_name: lastName,
        email: emailInput.value,
        phone_number: phoneNumberInput.value,
      };
      return true;
    }
    return false;
  }

  checkRecaptchaAndSubmit() {
    window.onSubmit = async function () {
      console.log("hitting onsubmit");
      const recaptchaResponse = window.grecaptcha.getResponse();
      try {
        const response = await axios.post("/api/check-token", {
          token: recaptchaResponse,
        });
        if (response.status === 403) throw new Error("Invalid recaptcha");

        console.log(this.formData);

        const salesJetResponse = await axios.post(
          "https://sj-api.com/externalapp/track",
          {
            event_name: "webinar_registration",
            contact: this.formData,
          },
          {
            headers: {
              "content-type": "application/json",
              Authorization: process.env.SALESJET_API_KEY,
            },
          }
        );
        console.dir(salesJetResponse);
        this.#createWholeFormMessage(
          "success",
          "You have been correctly registered. Thank you!"
        );
        this.disableForm();
      } catch (err) {
        console.dir(err);
        if (err.response.status === 403 || err.message === "Invalid recaptcha")
          this.#createWholeFormMessage(
            "error",
            "Invalid recaptcha. Are you sure you are a human?"
          );
      }
    }.bind(this);
    window.grecaptcha.execute();
  }
}

export default FormHandler;
