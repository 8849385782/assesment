document.addEventListener("DOMContentLoaded", function(){

    const form =
          document.getElementById("contactForm");

    const tableBody =
          document.getElementById("tableBody");

    const successMessage =
          document.getElementById("successMessage");

    // Load Stored Messages

    let messages =
        JSON.parse(localStorage.getItem("messages")) || [];

    messages.forEach(addMessage);

    // Form Submit

    if(form){

        form.addEventListener("submit", function(event){

            event.preventDefault();

            const data = {

                name:
                document.getElementById("name").value,

                email:
                document.getElementById("email").value

            };

            messages.push(data);

            localStorage.setItem(
                "messages",
                JSON.stringify(messages)
            );

            addMessage(data);

            successMessage.classList.remove("d-none");

            form.reset();

        });

    }

    // Add Data To Table

    function addMessage(data){

        const rowCount =
              tableBody.rows.length + 1;

        const row = `

            <tr>

                <td>${rowCount}</td>

                <td>${data.name}</td>

                <td>${data.email}</td>

            </tr>

        `;

        tableBody.innerHTML += row;

    }

});