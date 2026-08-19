// ==================================================
// BILLING DESK - SIGN UP
// ==================================================

console.log("SIGNUP.JS LOADED - REGISTER VERSION");


// ==================================================
// GET ELEMENTS
// ==================================================

const signupForm = document.getElementById("signupForm");

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");

const passwordInput = document.getElementById("password");
const confirmPasswordInput =
    document.getElementById("confirmPassword");

const termsCheckbox =
    document.getElementById("terms");

const errorMessage =
    document.getElementById("errorMessage");

const successMessage =
    document.getElementById("successMessage");


// ==================================================
// CHECK ELEMENTS
// ==================================================

console.log("Signup form:", signupForm);
console.log("Name input:", nameInput);
console.log("Email input:", emailInput);
console.log("Phone input:", phoneInput);
console.log("Password input:", passwordInput);
console.log("Confirm password:", confirmPasswordInput);
console.log("Terms:", termsCheckbox);


// ==================================================
// SHOW / HIDE PASSWORD
// ==================================================

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


// ==================================================
// SHOW / HIDE CONFIRM PASSWORD
// ==================================================

const toggleConfirmPassword =
    document.getElementById("toggleConfirmPassword");

if (toggleConfirmPassword) {

    toggleConfirmPassword.addEventListener(
        "click",
        function () {

            if (
                confirmPasswordInput.type ===
                "password"
            ) {

                confirmPasswordInput.type = "text";
                toggleConfirmPassword.textContent =
                    "Hide";

            } else {

                confirmPasswordInput.type = "password";
                toggleConfirmPassword.textContent =
                    "Show";

            }

        }
    );

}


// ==================================================
// PHONE VALIDATION
// ==================================================

if (phoneInput) {

    phoneInput.addEventListener(
        "input",
        function () {

            phoneInput.value =
                phoneInput.value.replace(/\D/g, "");

            if (phoneInput.value.length > 10) {

                phoneInput.value =
                    phoneInput.value.substring(0, 10);

            }

        }
    );

}


// ==================================================
// FORM SUBMIT
// ==================================================

if (signupForm) {

    signupForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            console.log("SIGNUP FORM SUBMITTED");


            // ==================================================
            // CLEAR MESSAGES
            // ==================================================

            errorMessage.style.display = "none";
            errorMessage.textContent = "";

            successMessage.style.display = "none";
            successMessage.textContent = "";


            // ==================================================
            // GET VALUES
            // ==================================================

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


            console.log("Name:", name);
            console.log("Email:", email);
            console.log("Phone:", phone);


            // ==================================================
            // VALIDATE NAME
            // ==================================================

            if (name.length < 3) {

                showError(
                    "Please enter your full name."
                );

                nameInput.focus();

                return;

            }


            // ==================================================
            // VALIDATE EMAIL
            // ==================================================

            if (!isValidEmail(email)) {

                showError(
                    "Please enter a valid email address."
                );

                emailInput.focus();

                return;

            }


            // ==================================================
            // VALIDATE PHONE
            // ==================================================

            if (phone.length !== 10) {

                showError(
                    "Please enter a valid 10-digit phone number."
                );

                phoneInput.focus();

                return;

            }


            // ==================================================
            // VALIDATE PASSWORD
            // ==================================================

            if (password.length < 6) {

                showError(
                    "Password must contain at least 6 characters."
                );

                passwordInput.focus();

                return;

            }


            // ==================================================
            // CONFIRM PASSWORD
            // ==================================================

            if (password !== confirmPassword) {

                showError(
                    "Passwords do not match."
                );

                confirmPasswordInput.focus();

                return;

            }


            // ==================================================
            // TERMS
            // ==================================================

            if (!termsCheckbox.checked) {

                showError(
                    "Please accept the Terms & Conditions."
                );

                return;

            }


            // ==================================================
            // SUBMIT BUTTON
            // ==================================================

            const submitButton =
                signupForm.querySelector(
                    ".signup-submit"
                );

            if (submitButton) {

                submitButton.disabled = true;

                submitButton.textContent =
                    "Creating Account...";

            }


            // ==================================================
            // LOADING MESSAGE
            // ==================================================

            successMessage.textContent =
                "Creating your account...";

            successMessage.style.display =
                "block";


            // ==================================================
            // SEND REQUEST
            // ==================================================

            try {

                const API_URL =
                    "http://localhost:5000/api/auth/register";


                console.log(
                    "Sending request to:",
                    API_URL
                );


                const response =
                    await fetch(
                        API_URL,
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


                console.log(
                    "Response status:",
                    response.status
                );


                // ==================================================
                // READ RESPONSE
                // ==================================================

                const contentType =
                    response.headers.get(
                        "content-type"
                    ) || "";


                let data;


                if (
                    contentType.includes(
                        "application/json"
                    )
                ) {

                    data =
                        await response.json();

                } else {

                    const text =
                        await response.text();

                    console.error(
                        "Non-JSON response:",
                        text
                    );

                    throw new Error(
                        "Server returned a non-JSON response. HTTP status: " +
                        response.status
                    );

                }


                console.log(
                    "Server response:",
                    data
                );


                // ==================================================
                // SERVER ERROR
                // ==================================================

                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Unable to create account."
                    );

                }


                // ==================================================
                // SUCCESS
                // ==================================================

                successMessage.textContent =
                    data.message ||
                    "Account created successfully!";

                successMessage.style.display =
                    "block";


                console.log(
                    "ACCOUNT CREATED SUCCESSFULLY"
                );


                // Clear form

                signupForm.reset();


                // ==================================================
                // REDIRECT TO LOGIN
                // ==================================================

                setTimeout(
                    function () {

                        window.location.href =
                            "login.html";

                    },
                    1500
                );


            } catch (error) {

                console.error(
                    "Signup Error:",
                    error
                );


                successMessage.style.display =
                    "none";


                showError(
                    error.message ||
                    "Unable to connect to server."
                );


                // ==================================================
                // ENABLE BUTTON
                // ==================================================

                if (submitButton) {

                    submitButton.disabled =
                        false;

                    submitButton.textContent =
                        "Create Account";

                }

            }

        }
    );

}


// ==================================================
// SHOW ERROR
// ==================================================

function showError(message) {

    if (!errorMessage) {
        return;
    }

    errorMessage.textContent =
        message;

    errorMessage.style.display =
        "block";

}


// ==================================================
// EMAIL VALIDATION
// ==================================================

function isValidEmail(email) {

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailPattern.test(email);

}


// ==================================================
// PAGE LOADED
// ==================================================

console.log(
    "Billing Desk signup page loaded successfully."
);