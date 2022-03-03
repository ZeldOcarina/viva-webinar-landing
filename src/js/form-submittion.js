class FormHandler {
  #emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  constructor(form) {
    this.form = form;
    this.formData = {};
    this.init();
  }

  static #handleInputError(input, message) {
    input.classList.add("form__input--error");
    const span = this.#createMessageSpan(message);
    input.insertAdjacentElement("afterend", span);
  }

  static #createMessageSpan(message) {
    const span = document.createElement("span");
    span.classList.add("form__message");
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

  handleSubmit(e) {
    e.preventDefault();
    const isFormValid = this.validateForm();
    if (!isFormValid) return;
    this.sendForm();
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
        phone: phoneNumberInput.value,
      };
      return true;
    }
    return false;
  }

  sendForm() {
    console.log("FORM IS BEING SENT!!!");
  }
}

export default FormHandler;
