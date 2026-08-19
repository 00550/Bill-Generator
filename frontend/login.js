const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const email = document
        .getElementById("email")
        .value
        .trim();

    const password = document
        .getElementById("password")
        .value;

    const message = document.getElementById("message");

    try {

        console.log("Sending login request...");

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

        console.log("LOGIN RESPONSE:", data);
        console.log("STATUS:", response.status);

        if (!response.ok) {

            message.textContent =
                data.message || "Login failed";

            return;
        }

        if (!data.token) {

            console.error("NO TOKEN RECEIVED");

            message.textContent =
                "Login succeeded but server did not send a token.";

            return;
        }

        // ================================
        // SAVE TOKEN
        // ================================

        localStorage.setItem(
            "token",
            data.token
        );

        localStorage.setItem(
            "user",
            JSON.stringify(data.user)
        );

        console.log(
            "TOKEN SAVED:",
            localStorage.getItem("token")
        );

        console.log(
            "USER SAVED:",
            localStorage.getItem("user")
        );

        // IMPORTANT TEST
        if (localStorage.getItem("token") !== data.token) {

            console.error(
                "TOKEN WAS NOT SAVED TO LOCALSTORAGE"
            );

            message.textContent =
                "Token could not be saved.";

            return;
        }

        message.textContent =
            "Login successful!";

        // Give browser time to save localStorage
        setTimeout(() => {

            console.log(
                "TOKEN BEFORE REDIRECT:",
                localStorage.getItem("token")
            );

            window.location.replace("owner-dashboard.html");

        }, 1000);

    } catch (error) {

        console.error(
            "LOGIN ERROR:",
            error
        );

        message.textContent =
            "Unable to connect to server.";
    }
});


function togglePassword() {

    const password =
        document.getElementById("password");

    const button =
        document.querySelector(".toggle-password");

    if (password.type === "password") {

        password.type = "text";

        button.textContent = "Hide";

    } else {

        password.type = "password";

        button.textContent = "Show";
    }
}