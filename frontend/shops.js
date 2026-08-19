// ========================================
// AUTHENTICATION
// ========================================

const shopsToken = localStorage.getItem("token");

if (!shopsToken) {
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
                    "Authorization": `Bearer ${shopsToken}`,
                    "Content-Type": "application/json"
                }
            }
        );

        const data = await response.json();

        console.log("SHOPS STATUS:", response.status);
        console.log("SHOPS RESPONSE:", data);


        // ========================================
        // AUTH ERROR
        // ========================================

        if (response.status === 401) {

            localStorage.removeItem("token");
            localStorage.removeItem("user");

            window.location.href = "login.html";

            return;
        }


        // ========================================
        // OTHER ERROR
        // ========================================

        if (!response.ok) {

            message.textContent =
                data.message || "Failed to load shops";

            return;
        }


        // ========================================
        // NO SHOPS
        // ========================================

        if (!data.shops || data.shops.length === 0) {

            container.innerHTML = `
                <div class="empty-shop">

                    <h3>No Shops Found</h3>

                    <p>
                        You haven't added a shop yet.
                    </p>

                    <button onclick="addShop()">
                        Add Your First Shop
                    </button>

                </div>
            `;

            return;
        }


        // ========================================
        // DISPLAY SHOPS
        // ========================================

        container.innerHTML = "";

        data.shops.forEach((shop) => {

            const shopCard =
                document.createElement("div");

            // IMPORTANT
            shopCard.className = "shop-card";


            shopCard.innerHTML = `

                <h3>
                    ${escapeHTML(shop.shopName)}
                </h3>

                <p>
                    <strong>Address:</strong>
                    ${escapeHTML(shop.shopAddress)}
                </p>

                <p>
                    <strong>Phone:</strong>
                    ${escapeHTML(shop.phone || "Not provided")}
                </p>

                <p>
                    <strong>Email:</strong>
                    ${escapeHTML(shop.email || "Not provided")}
                </p>

                <p>
                    <strong>GST:</strong>
                    ${escapeHTML(shop.gstNumber || "Not provided")}
                </p>

                <p>
                    <strong>Status:</strong>
                    ${escapeHTML(shop.status || "active")}
                </p>

                <div class="shop-actions">

                    <button
                        type="button"
                        class="open-shop-btn"
                        onclick="openShop('${shop._id}')"
                    >
                        Open Shop
                    </button>

                    <button
                        type="button"
                        class="edit-shop-btn"
                        onclick="editShop('${shop._id}')"
                    >
                        Edit
                    </button>

                </div>
            `;


            container.appendChild(shopCard);

        });


    } catch (error) {

        console.error(
            "Load shops error:",
            error
        );

        message.textContent =
            "Unable to connect to server.";

    }

}


// ========================================
// OPEN SHOP
// ========================================

function openShop(shopId) {

    if (!shopId) {

        console.error(
            "No shop ID received"
        );

        return;
    }


    console.log(
        "SELECTED SHOP:",
        shopId
    );


    // Save selected shop
    localStorage.setItem(
        "selectedShopId",
        shopId
    );


    console.log(
        "SAVED SHOP:",
        localStorage.getItem("selectedShopId")
    );


    // Go to shop dashboard
    window.location.href =
        "shop-dashboard.html";

}


// ========================================
// EDIT SHOP
// ========================================

function editShop(shopId) {

    if (!shopId) {
        return;
    }

    localStorage.setItem(
        "editShopId",
        shopId
    );

    window.location.href =
        "edit-shop.html";
}


// ========================================
// ADD SHOP
// ========================================

function addShop() {

    window.location.href =
        "add-shop.html";

}


// ========================================
// BACK TO OWNER DASHBOARD
// ========================================

function goDashboard() {

    window.location.href =
        "owner-dashboard.html";

}


// ========================================
// BASIC HTML ESCAPE
// ========================================

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// ========================================
// LOAD PAGE
// ========================================

loadShops();