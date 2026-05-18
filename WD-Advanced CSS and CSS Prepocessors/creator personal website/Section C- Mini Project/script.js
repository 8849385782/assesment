// script.js

const form =
document.getElementById("contactForm");

const successBox =
document.getElementById("successBox");

form.addEventListener("submit", function(event){

  event.preventDefault();

  successBox.style.display = "flex";

  form.reset();

});