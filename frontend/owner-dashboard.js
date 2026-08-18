const token = localStorage.getItem("token");
const userData = localStorage.getItem("user");

// If there is no token, send user back to login
if (!token) {

    window.location.href = "login.html";

}

// Display owner information
if (userData) {

    const user = JSON.parse(userData);

    document.getElementById("ownerInfo").innerHTML = `
        <p><strong>Owner:</strong> ${user.name}</p>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Role:</strong> ${user.role}</p>
    `;

}


// ============================
// BUTTON FUNCTIONS
// ============================

function addShop() {

    window.location.href = "add-shop.html";

}


function viewShops() {

    window.location.href = "shops.html";

}


function viewTransactions() {

    window.location.href = "transactions.html";

}


// ============================
// LOGOUT
// ============================

function logout() {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "login.html";

}