import "./js/footer-date.js";
import FormHandler from "./js/form-submittion.js";

function initApp() {
  const forms = document.querySelectorAll(".form");
  forms.forEach((form) => new FormHandler(form));
}

initApp();
