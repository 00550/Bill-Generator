const token = localStorage.getItem("token");
const shopId = localStorage.getItem("selectedShopId");


// ========================================
// CHECK LOGIN
// ========================================

if (!token) {

    window.location.href = "login.html";

}


// ========================================
// CHECK SHOP
// ========================================

if (!shopId) {

    alert("Please select a shop first.");

    window.location.href = "shops.html";

}


// ========================================
// LOAD SELECTED SHOP
// ========================================

async function loadShop() {

    try {

        const response = await fetch(
            `http://localhost:5000/api/shop/${shopId}`,
            {
                method: "GET",

                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );


        const data = await response.json();


        if (!response.ok) {

            alert(data.message || "Unable to load shop");

            window.location.href = "shops.html";

            return;
        }


        const shop = data.shop;


        document.getElementById("shopName").textContent =
            shop.shopName;


        document.getElementById("shopInfo").textContent =
            `${shop.shopAddress} | ${shop.phone || "No phone"}`;


    } catch (error) {

        console.error(error);

        alert("Unable to connect to server.");

    }

}


// ========================================
// NAVIGATION
// ========================================

function goBack() {

    window.location.href = "shops.html";

}


function openBilling() {

    window.location.href = "billing.html";

}


function openProducts() {

    window.location.href = "products.html";

}


function openCustomers() {

    window.location.href = "customers.html";

}


function openTransactions() {

    window.location.href = "transactions.html";

}


function openStaff() {

    window.location.href = "staff.html";

}


function logout() {

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("selectedShopId");

    window.location.href = "login.html";

}


// ========================================
// LOAD
// ========================================

loadShop();