function showSkill(skill){

  const image =
  document.getElementById("skill-image");

  const text =
  document.getElementById("skill-text");

  if(skill === "html"){

    image.src = "html.png";

    text.innerHTML =
    "HTML creates the structure of web pages.";

  }

  else if(skill === "css"){

    image.src = "css.png";

    text.innerHTML =
    "CSS is used for styling and responsive design.";

  }

  else if(skill === "js"){

    image.src = "js.png";

    text.innerHTML =
    "JavaScript adds interactivity and functionality.";

  }

}


const form =
document.getElementById("contactForm");

if(form){

  form.addEventListener("submit",
  function(event){

    event.preventDefault();

    const name =
    document.getElementById("name").value;

    const email =
    document.getElementById("email").value;

    const message =
    document.getElementById("message").value;

    const record =
    document.createElement("div");

    record.classList.add("record");

    record.innerHTML = `
      <h4>${name}</h4>
      <p>${email}</p>
      <p>${message}</p>
    `;

    document
    .getElementById("records")
    .appendChild(record);

    form.reset();

  });

}