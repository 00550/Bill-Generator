
// ==================================================
// BILLING DESK - SIGN UP
// JavaScript
// ==================================================


// ================= GET ELEMENTS =================

const signupForm = document.getElementById("signupForm");

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");

const passwordInput =
    document.getElementById("password");

const confirmPasswordInput =
    document.getElementById("confirmPassword");

const termsCheckbox =
    document.getElementById("terms");

const errorMessage =
    document.getElementById("errorMessage");

const successMessage =
    document.getElementById("successMessage");


// ================= SHOW / HIDE PASSWORD =================

const togglePassword =
    document.getElementById("togglePassword");

if (togglePassword) {

    togglePassword.addEventListener("click", function () {

        if (passwordInput.type === "password") {

            passwordInput.type = "text";

            togglePassword.textContent = "Hide";

        } else {

            passwordInput.type = "password";

            togglePassword.textContent = "Show";

        }

    });

}


// ================= SHOW / HIDE CONFIRM PASSWORD =================

const toggleConfirmPassword =
    document.getElementById("toggleConfirmPassword");

if (toggleConfirmPassword) {

    toggleConfirmPassword.addEventListener("click", function () {

        if (confirmPasswordInput.type === "password") {

            confirmPasswordInput.type = "text";

            toggleConfirmPassword.textContent = "Hide";

        } else {

            confirmPasswordInput.type = "password";

            toggleConfirmPassword.textContent = "Show";

        }

    });

}


// ================= PHONE VALIDATION =================

// Allow only numbers

phoneInput.addEventListener("input", function () {

    phoneInput.value =
        phoneInput.value.replace(/\D/g, "");

});


// ================= FORM SUBMIT =================

signupForm.addEventListener(
    "submit",
    async function (event) {

        // Stop normal form submission
        event.preventDefault();


        // ================= CLEAR PREVIOUS MESSAGES =================

        errorMessage.style.display = "none";
        errorMessage.textContent = "";

        successMessage.style.display = "none";
        successMessage.textContent = "";


        // ================= GET FORM VALUES =================

        const name =
            nameInput.value.trim();

        const email =
            emailInput.value.trim();

        const phone =
            phoneInput.value.trim();

        const password =
            passwordInput.value;

        const confirmPassword =
            confirmPasswordInput.value;


        // ================= VALIDATION =================

        // Name validation

        if (name.length < 3) {

            showError(
                "Please enter your full name."
            );

            nameInput.focus();

            return;
        }


        // Email validation

        if (!isValidEmail(email)) {

            showError(
                "Please enter a valid email address."
            );

            emailInput.focus();

            return;
        }


        // Phone validation

        if (phone.length !== 10) {

            showError(
                "Please enter a valid 10-digit phone number."
            );

            phoneInput.focus();

            return;
        }


        // Password validation

        if (password.length < 6) {

            showError(
                "Password must contain at least 6 characters."
            );

            passwordInput.focus();

            return;
        }


        // Confirm password

        if (password !== confirmPassword) {

            showError(
                "Passwords do not match."
            );

            confirmPasswordInput.focus();

            return;
        }


        // Terms and conditions

        if (!termsCheckbox.checked) {

            showError(
                "Please accept the Terms & Conditions."
            );

            return;
        }


        // ================= SEND DATA TO BACKEND =================

        try {

            // Show temporary message

            successMessage.textContent =
                "Creating your account...";

            successMessage.style.display = "block";


            // Send signup request to Node.js server

            const response = await fetch(
                "http://localhost:5000/api/auth/signup",
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body: JSON.stringify({

                        name: name,

                        email: email,

                        phone: phone,

                        password: password

                    })

                }
            );


            // ================= GET SERVER RESPONSE =================

            const data =
                await response.json();


            // ================= CHECK RESPONSE =================

            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Unable to create account."
                );

            }


            // ================= ACCOUNT CREATED =================

            successMessage.textContent =
                "Account created successfully!";

            successMessage.style.display = "block";


            // Clear form

            signupForm.reset();


            // ================= REDIRECT TO LOGIN =================

            setTimeout(function () {

                window.location.href =
                    "login.html";

            }, 1500);


        } catch (error) {

            // Hide success message

            successMessage.style.display =
                "none";


            // Show error

            console.error(
                "Signup Error:",
                error
            );


            showError(
                error.message ||
                "Unable to connect to server."
            );

        }

    }
);


// ================= ERROR FUNCTION =================

function showError(message) {

    errorMessage.textContent =
        message;

    errorMessage.style.display =
        "block";

}


// ================= EMAIL VALIDATION =================

function isValidEmail(email) {

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailPattern.test(email);

}


// ================= PAGE LOADED =================

console.log(
    "Billing Desk signup page loaded successfully."
);

