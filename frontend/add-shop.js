// ==================================================
// BILLING DESK - ADD SHOP
// ==================================================

console.log("ADD SHOP JS LOADED");


// ==================================================
// GET TOKEN
// ==================================================

const token = localStorage.getItem("token");


// ==================================================
// CHECK LOGIN
// ==================================================

if (!token) {

    alert("Please login first.");

    window.location.href = "login.html";

}


// ==================================================
// GET MESSAGE ELEMENT
// ==================================================

const message =
    document.getElementById("message");


// ==================================================
// SAVE SHOP
// ==================================================

async function saveShop() {

    // ==============================================
    // GET FORM VALUES
    // ==============================================

    const shopName =
        document.getElementById("shopName").value.trim();

    const shopAddress =
        document.getElementById("shopAddress").value.trim();

    const phone =
        document.getElementById("phone").value.trim();

    const email =
        document.getElementById("email").value.trim();

    const gstNumber =
        document.getElementById("gstNumber").value.trim();


    // ==============================================
    // BANK DETAILS
    // ==============================================

    const accountName =
        document.getElementById("accountName").value.trim();

    const accountNumber =
        document.getElementById("accountNumber").value.trim();

    const bankName =
        document.getElementById("bankName").value.trim();

    const ifscCode =
        document.getElementById("ifscCode").value.trim();


    // ==============================================
    // UPI
    // ==============================================

    const upiId =
        document.getElementById("upiId").value.trim();


    // ==============================================
    // VALIDATION
    // ==============================================

    if (!shopName) {

        showMessage(
            "Please enter shop name.",
            "error"
        );

        document.getElementById("shopName").focus();

        return;
    }


    if (!shopAddress) {

        showMessage(
            "Please enter shop address.",
            "error"
        );

        document.getElementById("shopAddress").focus();

        return;
    }


    // ==============================================
    // SHOW LOADING
    // ==============================================

    showMessage(
        "Creating shop...",
        "success"
    );


    // ==============================================
    // DISABLE BUTTON
    // ==============================================

    const saveButton =
        document.querySelector(".save");

    if (saveButton) {

        saveButton.disabled = true;

        saveButton.textContent =
            "Saving...";

    }


    // ==============================================
    // SEND REQUEST
    // ==============================================

    try {

        console.log("Sending shop creation request...");

        console.log(
            "URL:",
            "http://localhost:5000/api/shop"
        );


        const response =
            await fetch(
                "http://localhost:5000/api/shop",
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${token}`

                    },

                    body:
                        JSON.stringify({

                            shopName:
                                shopName,

                            shopAddress:
                                shopAddress,

                            phone:
                                phone,

                            email:
                                email,

                            gstNumber:
                                gstNumber,

                            accountName:
                                accountName,

                            accountNumber:
                                accountNumber,

                            bankName:
                                bankName,

                            ifscCode:
                                ifscCode,

                            upiId:
                                upiId

                        })

                }
            );


        // ==========================================
        // READ RESPONSE
        // ==========================================

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
                "Server returned non-JSON:",
                text
            );

            throw new Error(
                `Server returned unexpected response. Status: ${response.status}`
            );

        }


        // ==========================================
        // SERVER ERROR
        // ==========================================

        if (!response.ok) {

            throw new Error(
                data.message ||
                "Failed to create shop."
            );

        }


        // ==========================================
        // SUCCESS
        // ==========================================

        console.log(
            "Shop created successfully:",
            data
        );


        showMessage(
            data.message ||
            "Shop created successfully!",
            "success"
        );


        // ==========================================
        // CLEAR FORM
        // ==========================================

        document.getElementById("shopName").value = "";

        document.getElementById("shopAddress").value = "";

        document.getElementById("phone").value = "";

        document.getElementById("email").value = "";

        document.getElementById("gstNumber").value = "";

        document.getElementById("accountName").value = "";

        document.getElementById("accountNumber").value = "";

        document.getElementById("bankName").value = "";

        document.getElementById("ifscCode").value = "";

        document.getElementById("upiId").value = "";


        // ==========================================
        // REDIRECT
        // ==========================================

        setTimeout(
            function () {

                window.location.href =
                    "shops.html";

            },
            1200
        );


    } catch (error) {

        console.error(
            "Create shop error:",
            error
        );


        showMessage(
            error.message ||
            "Unable to connect to server.",
            "error"
        );


        // ==========================================
        // ENABLE BUTTON
        // ==========================================

        if (saveButton) {

            saveButton.disabled =
                false;

            saveButton.textContent =
                "Save Shop";

        }

    }

}


// ==================================================
// SHOW MESSAGE
// ==================================================

function showMessage(text, type) {

    if (!message) {
        return;
    }


    message.textContent =
        text;


    if (type === "error") {

        message.style.color =
            "#dc2626";

    } else {

        message.style.color =
            "#16a34a";

    }

}


// ==================================================
// GO BACK
// ==================================================

function goBack() {

    window.location.href =
        "shops.html";

}