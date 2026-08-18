const token = localStorage.getItem("token");


// ========================================
// CHECK LOGIN
// ========================================

if (!token) {
    window.location.href = "login.html";
}


// ========================================
// LOAD SHOPS
// ========================================

async function loadShops() {

    const container =
        document.getElementById("shopsContainer");

    const message =
        document.getElementById("message");

    try {

        const response = await fetch(
            "http://localhost:5000/api/shop",
            {
                method: "GET",

                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );


        const data = await response.json();


        if (!response.ok) {

            message.textContent =
                data.message || "Failed to load shops";

            return;

        }


        if (data.shops.length === 0) {

            container.innerHTML = `
                <p>You don't have any shops yet.</p>

                <button onclick="addShop()">
                    Add Your First Shop
                </button>
            `;

            return;

        }


        container.innerHTML = "";


        data.shops.forEach((shop) => {

            const shopCard = document.createElement("div");

            shopCard.innerHTML = `

                <hr>

                <h3>${shop.shopName}</h3>

                <p>
                    <strong>Address:</strong>
                    ${shop.shopAddress}
                </p>

                <p>
                    <strong>Phone:</strong>
                    ${shop.phone || "Not provided"}
                </p>

                <p>
                    <strong>Email:</strong>
                    ${shop.email || "Not provided"}
                </p>

                <p>
                    <strong>GST:</strong>
                    ${shop.gstNumber || "Not provided"}
                </p>

                <p>
                    <strong>Status:</strong>
                    ${shop.status}
                </p>

                <button onclick="openShop('${shop._id}')">
                    Open Shop
                </button>

                <button onclick="editShop('${shop._id}')">
                    Edit
                </button>

            `;

            container.appendChild(shopCard);

        });


    } catch (error) {

        console.error(error);

        message.textContent =
            "Unable to connect to server.";

    }

}


// ========================================
// OPEN SHOP
// ========================================

function openShop(shopId) {

    localStorage.setItem(
        "selectedShopId",
        shopId
    );

    window.location.href = "shop-dashboard.html";

}


// ========================================
// EDIT SHOP
// ========================================

function editShop(shopId) {

    localStorage.setItem(
        "editShopId",
        shopId
    );

    window.location.href = "edit-shop.html";

}


// ========================================
// ADD SHOP
// ========================================

function addShop() {

    window.location.href = "add-shop.html";

}


// ========================================
// DASHBOARD
// ========================================

function goDashboard() {

    window.location.href =
        "owner-dashboard.html";

}


// ========================================
// LOAD WHEN PAGE OPENS
// ========================================

loadShops();