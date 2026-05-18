document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("contactForm");
    const table = document.getElementById("dataTable");

    // Show old stored data
    let users = JSON.parse(localStorage.getItem("users")) || [];

    users.forEach(user => {
        addData(user);
    });

    // Form submit
    if(form){

        form.addEventListener("submit", function(event){

            event.preventDefault();

            let user = {

                name: document.getElementById("name").value,
                email: document.getElementById("email").value,
                phone: document.getElementById("phone").value,
                message: document.getElementById("message").value

            };

            users.push(user);

            localStorage.setItem("users", JSON.stringify(users));

            addData(user);

            document.getElementById("successMsg")
            .innerHTML = "Message Sent Successfully!";

            form.reset();

        });

    }

    // Add data into table
    function addData(user){

        let row = `

            <tr>

                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.phone}</td>
                <td>${user.message}</td>

            </tr>

        `;

        table.innerHTML += row;

    }

});