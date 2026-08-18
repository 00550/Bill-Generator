const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {

        const response = await fetch(
            "http://localhost:5000/api/auth/login",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email,
                    password
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            document.getElementById("message").textContent =
                data.message || "Login failed";

            return;
        }

    

        // Save JWT token
        localStorage.setItem("token", data.token);

        // Save user information
        localStorage.setItem(
            "user",
            JSON.stringify(data.user)
        );

        document.getElementById("message").textContent =
            "Login successful!";

        // Go to owner dashboard
        setTimeout(() => {
            window.location.href = "owner-dashboard.html";
        }, 500);

    } catch (error) {

        console.error(error);

        document.getElementById("message").textContent =
            "Unable to connect to server.";

    }

});