// ========================================
// OWNER DASHBOARD AUTH
// ========================================

const token = localStorage.getItem("token");
const userData = localStorage.getItem("user");

console.log("================================");
console.log("OWNER DASHBOARD LOADED");
console.log("TOKEN:", token);
console.log("USER:", userData);
console.log("================================");


// ========================================
// CHECK LOGIN
// ========================================

if (!token) {

    console.error(
        "NO TOKEN FOUND - REDIRECTING TO LOGIN"
    );

    window.location.replace("login.html");

} else {

    console.log(
        "TOKEN FOUND - USER IS AUTHENTICATED"
    );

}


// ========================================
// DISPLAY OWNER INFORMATION
// ========================================

if (userData) {

    try {

        const user = JSON.parse(userData);

        const ownerInfo =
            document.getElementById("ownerInfo");

        if (ownerInfo) {

            ownerInfo.innerHTML = `
                <p>
                    <strong>Owner:</strong>
                    ${user.name || "-"}
                </p>

                <p>
                    <strong>Email:</strong>
                    ${user.email || "-"}
                </p>

                <p>
                    <strong>Role:</strong>
                    ${user.role || "-"}
                </p>
            `;

        }

    } catch (error) {

        console.error(
            "Invalid user data:",
            error
        );

    }

}


// ========================================
// BUTTON FUNCTIONS
// ========================================

function addShop() {

    window.location.href =
        "add-shop.html";

}


function viewShops() {

    window.location.href =
        "shops.html";

}


function viewTransactions() {

    window.location.href =
        "transactions.html";

}


// ========================================
// LOGOUT
// ========================================

function logout() {

    console.log("Logging out...");

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    console.log(
        "TOKEN AFTER LOGOUT:",
        localStorage.getItem("token")
    );

    window.location.replace(
        "login.html"
    );

}