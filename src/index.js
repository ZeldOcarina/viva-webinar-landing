import "./js/footer-date";
import "./js/create-recaptcha";
import FormHandler from "./js/form-submittion";

function initApp() {
  const forms = document.querySelectorAll(".form");
  forms.forEach((form) => new FormHandler(form));
}

initApp();
