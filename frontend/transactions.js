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

            document.getElementById(
                "message"
            ).textContent =
                data.message || "Unable to load shop";

            return;

        }


        document.getElementById(
            "shopInfo"
        ).textContent =
            `${data.shop.shopName} | ${data.shop.shopAddress}`;


    } catch (error) {

        console.error(error);

        document.getElementById(
            "message"
        ).textContent =
            "Unable to connect to server.";

    }

}


// ========================================
// LOAD TRANSACTIONS
// ========================================

async function loadTransactions() {

    const container =
        document.getElementById(
            "transactionsContainer"
        );

    const message =
        document.getElementById(
            "message"
        );


    try {

        const response = await fetch(
            `http://localhost:5000/api/transactions?shopId=${shopId}`,
            {
                method: "GET",

                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );


        const data =
            await response.json();


        if (!response.ok) {

            message.textContent =
                data.message ||
                "Failed to load transactions";

            return;

        }


        if (
            !data.transactions ||
            data.transactions.length === 0
        ) {

            container.innerHTML = `
                <div class="empty">
                    <h3>No transactions yet</h3>

                    <p>
                        Create your first bill
                        from the Billing section.
                    </p>
                </div>
            `;

            return;

        }


        container.innerHTML = "";


        data.transactions.forEach(
            (transaction, index) => {

                const bill =
                    document.createElement("div");

                bill.className = "bill";


                const date =
                    new Date(
                        transaction.createdAt
                    ).toLocaleString();


                let itemsHTML = "";


                transaction.items.forEach(
                    (item) => {

                        itemsHTML += `
                            <li>
                                ${item.productName}
                                -
                                ${item.quantity}
                                × ₹${item.price}
                                =
                                ₹${item.total}
                            </li>
                        `;

                    }
                );


                bill.innerHTML = `

                    <h3>
                        Bill #${index + 1}
                    </h3>

                    <p>
                        <strong>Date:</strong>
                        ${date}
                    </p>

                    <p>
                        <strong>Customer:</strong>
                        ${transaction.customerName || "Walk-in Customer"}
                    </p>

                    <p>
                        <strong>Phone:</strong>
                        ${transaction.customerPhone || "Not provided"}
                    </p>

                    <p>
                        <strong>Payment:</strong>
                        ${transaction.paymentMethod}
                    </p>

                    <h4>Items</h4>

                    <ul>
                        ${itemsHTML}
                    </ul>

                    <p>
                        <strong>Subtotal:</strong>
                        ₹${Number(
                            transaction.subtotal
                        ).toFixed(2)}
                    </p>

                    <p>
                        <strong>Discount:</strong>
                        ₹${Number(
                            transaction.discount || 0
                        ).toFixed(2)}
                    </p>

                    <p>
                        <strong>GST:</strong>
                        ₹${Number(
                            transaction.gst || 0
                        ).toFixed(2)}
                    </p>

                    <p class="total">
                        Total:
                        ₹${Number(
                            transaction.total
                        ).toFixed(2)}
                    </p>

                `;


                container.appendChild(bill);

            }
        );


    } catch (error) {

        console.error(error);

        message.textContent =
            "Unable to connect to server.";

    }

}


// ========================================
// BACK TO SHOP
// ========================================

function goBack() {

    window.location.href =
        "shop-dashboard.html";

}


// ========================================
// LOAD PAGE
// ========================================

loadShop();
loadTransactions();