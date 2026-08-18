
// ==================================================
// BILLING DESK - LOGIN
// ==================================================


// ================= ELEMENTS =================

const loginForm =
    document.getElementById("loginForm");

const username =
    document.getElementById("username");

const password =
    document.getElementById("password");

const error =
    document.getElementById("error");

const togglePassword =
    document.getElementById("togglePassword");

const loginButton =
    document.getElementById("loginButton");


// ================= SHOW / HIDE PASSWORD =================

togglePassword.addEventListener(
    "click",
    function () {

        if (password.type === "password") {

            password.type = "text";

            togglePassword.textContent = "Hide";

        } else {

            password.type = "password";

            togglePassword.textContent = "Show";

        }

    }
);


// ================= LOGIN =================

loginForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const user =
            username.value.trim();

        const pass =
            password.value.trim();


        // Clear previous error

        error.textContent = "";


        // ================= VALIDATE =================

        if (
            (user === "admin" && pass === "1234") ||
            (user === "Nalin" && pass === "Nalin")
        ) {

            // Change button text

            loginButton.innerHTML =
                `
                <span>Logging in...</span>
                <strong>✓</strong>
                `;

            loginButton.disabled = true;


            // Redirect to billing page

            setTimeout(
                function () {

                    window.location.href =
                        "recipt.html";

                },
                600
            );

        }

        else {

            error.textContent =
                "Invalid username or password.";

            password.value = "";

            password.focus();

        }

    }
);