const token = localStorage.getItem("token");
const shopId = localStorage.getItem("editShopId");

// ========================================
// CHECK LOGIN
// ========================================

if (!token) {
    window.location.href = "login.html";
}


// ========================================
// CHECK SHOP ID
// ========================================

if (!shopId) {
    alert("No shop selected.");
    window.location.href = "shops.html";
}


// ========================================
// LOAD SHOP
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

            document.getElementById("message").textContent =
                data.message || "Failed to load shop";

            return;
        }


        const shop = data.shop;


        document.getElementById("shopName").value =
            shop.shopName || "";

        document.getElementById("shopAddress").value =
            shop.shopAddress || "";

        document.getElementById("phone").value =
            shop.phone || "";

        document.getElementById("email").value =
            shop.email || "";

        document.getElementById("gstNumber").value =
            shop.gstNumber || "";

        document.getElementById("status").value =
            shop.status || "active";


    } catch (error) {

        console.error(error);

        document.getElementById("message").textContent =
            "Unable to connect to server.";

    }

}


// ========================================
// UPDATE SHOP
// ========================================

document
    .getElementById("editShopForm")
    .addEventListener("submit", async function (event) {

        event.preventDefault();


        const message =
            document.getElementById("message");


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

        const status =
            document.getElementById("status").value;


        message.textContent = "Updating shop...";


        try {

            const response = await fetch(
                `http://localhost:5000/api/shop/${shopId}`,
                {

                    method: "PUT",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${token}`

                    },

                    body: JSON.stringify({

                        shopName,
                        shopAddress,
                        phone,
                        email,
                        gstNumber,
                        status

                    })

                }
            );


            const data =
                await response.json();


            if (!response.ok) {

                message.textContent =
                    data.message ||
                    "Failed to update shop";

                return;

            }


            message.textContent =
                "Shop updated successfully!";


            setTimeout(() => {

                localStorage.removeItem("editShopId");

                window.location.href =
                    "shops.html";

            }, 1000);


        } catch (error) {

            console.error(error);

            message.textContent =
                "Unable to connect to server.";

        }

    });


// ========================================
// CANCEL
// ========================================

function goBack() {

    localStorage.removeItem("editShopId");

    window.location.href =
        "shops.html";

}


// ========================================
// LOAD SHOP WHEN PAGE OPENS
// ========================================

loadShop();