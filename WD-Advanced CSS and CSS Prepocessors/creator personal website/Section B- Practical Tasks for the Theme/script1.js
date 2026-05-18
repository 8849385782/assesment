const form = document.getElementById("contactForm");

const records = document.getElementById("records");

const successMessage = document.getElementById("successMessage");

form.addEventListener("submit", function(event){

    event.preventDefault();

    // GET VALUES

    const name = document.getElementById("name").value;

    const email = document.getElementById("email").value;

    const message = document.getElementById("message").value;

    // SHOW SUCCESS MESSAGE

    successMessage.style.display = "block";

    // CREATE CARD

    const card = document.createElement("div");

    card.classList.add("record-card");

    card.innerHTML = `

        <p><strong>Name:</strong> ${name}</p>

        <p><strong>Email:</strong> ${email}</p>

        <p><strong>Message:</strong> ${message}</p>

        <hr>

    `;

    // ADD CARD

    records.appendChild(card);

    // RESET FORM

    form.reset();

});