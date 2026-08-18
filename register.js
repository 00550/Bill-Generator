const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const password = document.getElementById("password").value;

    try {

        const response = await fetch(
            "http://localhost:5000/api/auth/register",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    name,
                    email,
                    phone,
                    password
                })
            }
        );

        const data = await response.json();

        document.getElementById("message").textContent =
            data.message;

        console.log(data);

    } catch (error) {

        console.error(error);

        document.getElementById("message").textContent =
            "Unable to connect to server.";

    }

});