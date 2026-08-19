const token = localStorage.getItem("token");
const shopId = localStorage.getItem("selectedShopId");

let shop = null;


// =====================================================
// AUTH CHECK
// =====================================================

if (!token) {

    window.location.href = "login.html";

}

if (!shopId) {

    alert("Please select a shop first.");

    window.location.href = "shops.html";

}


// =====================================================
// ELEMENTS
// =====================================================

const itemsBody =
    document.getElementById("itemsBody");

const discountInput =
    document.getElementById("discount");

const gstType =
    document.getElementById("gstType");

const gstRateInput =
    document.getElementById("gstRate");

const paymentMethod =
    document.getElementById("paymentMethod");


// =====================================================
// LOAD SHOP
// =====================================================

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

            alert(
                data.message ||
                "Unable to load shop"
            );

            window.location.href =
                "shops.html";

            return;
        }


        shop = data.shop;


        document.getElementById(
            "shopName"
        ).textContent =
            shop.shopName;


        document.getElementById(
            "shopDetails"
        ).textContent =
            `${shop.shopAddress} | ${
                shop.phone || "No phone"
            } | GSTIN: ${
                shop.gstNumber || "Not provided"
            }`;


        document.getElementById(
            "upiIdDisplay"
        ).textContent =
            shop.upiId
                ? `UPI ID: ${shop.upiId}`
                : "UPI ID not configured";


        updateQRCode();


    } catch (error) {

        console.error(error);

        alert(
            "Unable to connect to server."
        );

    }

}


// =====================================================
// ADD ITEM
// =====================================================

function addItem() {

    const row =
        document.createElement("tr");


    row.innerHTML = `

        <td>

            <input
                type="text"
                class="item-input product-name"
                placeholder="Product name"
            >

        </td>


        <td>

            <input
                type="number"
                class="qty-input quantity"
                min="1"
                value="1"
            >

        </td>


        <td>

            <input
                type="number"
                class="price-input price"
                min="0"
                step="0.01"
                value="0"
            >

        </td>


        <td>

            <span class="amount">
                ₹0.00
            </span>

        </td>


        <td>

            <button
                type="button"
                class="remove-btn"
                onclick="removeItem(this)"
            >
                ×
            </button>

        </td>

    `;


    itemsBody.appendChild(row);


    row.querySelectorAll("input")
        .forEach(input => {

            input.addEventListener(
                "input",
                calculateBill
            );

        });


    calculateBill();

}


// =====================================================
// REMOVE ITEM
// =====================================================

function removeItem(button) {

    button
        .closest("tr")
        .remove();


    calculateBill();

}


// =====================================================
// CALCULATE BILL
// =====================================================

function calculateBill() {

    let subtotal = 0;


    const rows =
        itemsBody.querySelectorAll("tr");


    rows.forEach(row => {

        const quantity =
            Number(
                row.querySelector(".quantity").value
            ) || 0;


        const price =
            Number(
                row.querySelector(".price").value
            ) || 0;


        const amount =
            quantity * price;


        subtotal += amount;


        row.querySelector(".amount")
            .textContent =
            formatCurrency(amount);

    });


    // ================================================
    // DISCOUNT
    // ================================================

    let discount =
        Number(discountInput.value) || 0;


    discount =
        Math.min(
            Math.max(discount, 0),
            100
        );


    const discountAmount =
        subtotal *
        discount /
        100;


    const taxableAmount =
        Math.max(
            subtotal -
            discountAmount,
            0
        );


    // ================================================
    // GST
    // ================================================

    let gstRate =
        Number(gstRateInput.value) || 0;


    gstRate =
        Math.max(gstRate, 0);


    let cgstRate = 0;
    let sgstRate = 0;
    let igstRate = 0;


    if (gstType.value === "local") {

        cgstRate =
            gstRate / 2;

        sgstRate =
            gstRate / 2;

        document.getElementById(
            "cgstRow"
        ).classList.remove("hidden");

        document.getElementById(
            "sgstRow"
        ).classList.remove("hidden");

        document.getElementById(
            "igstRow"
        ).classList.add("hidden");

    } else {

        igstRate =
            gstRate;

        document.getElementById(
            "cgstRow"
        ).classList.add("hidden");

        document.getElementById(
            "sgstRow"
        ).classList.add("hidden");

        document.getElementById(
            "igstRow"
        ).classList.remove("hidden");

    }


    // ================================================
    // TAX AMOUNTS
    // ================================================

    const cgstAmount =
        taxableAmount *
        cgstRate /
        100;


    const sgstAmount =
        taxableAmount *
        sgstRate /
        100;


    const igstAmount =
        taxableAmount *
        igstRate /
        100;


    const totalGst =
        cgstAmount +
        sgstAmount +
        igstAmount;


    const grandTotal =
        taxableAmount +
        totalGst;


    // ================================================
    // DISPLAY
    // ================================================

    document.getElementById(
        "subtotal"
    ).textContent =
        formatCurrency(subtotal);


    document.getElementById(
        "discountAmount"
    ).textContent =
        formatCurrency(discountAmount);


    document.getElementById(
        "taxableAmount"
    ).textContent =
        formatCurrency(taxableAmount);


    document.getElementById(
        "cgstRateLabel"
    ).textContent =
        `${cgstRate.toFixed(2)}%`;


    document.getElementById(
        "sgstRateLabel"
    ).textContent =
        `${sgstRate.toFixed(2)}%`;


    document.getElementById(
        "igstRateLabel"
    ).textContent =
        `${igstRate.toFixed(2)}%`;


    document.getElementById(
        "cgstAmount"
    ).textContent =
        formatCurrency(cgstAmount);


    document.getElementById(
        "sgstAmount"
    ).textContent =
        formatCurrency(sgstAmount);


    document.getElementById(
        "igstAmount"
    ).textContent =
        formatCurrency(igstAmount);


    document.getElementById(
        "totalGst"
    ).textContent =
        formatCurrency(totalGst);


    document.getElementById(
        "grandTotal"
    ).textContent =
        formatCurrency(grandTotal);


    return {

        subtotal,

        discount,

        discountAmount,

        taxableAmount,

        gstRate,

        cgstRate,

        sgstRate,

        igstRate,

        cgstAmount,

        sgstAmount,

        igstAmount,

        totalGst,

        grandTotal

    };

}


// =====================================================
// PAYMENT METHOD
// =====================================================

paymentMethod.addEventListener(
    "change",
    updateQRCode
);


function updateQRCode() {

    const upiSection =
        document.getElementById(
            "upiSection"
        );


    if (
        paymentMethod.value !== "upi"
    ) {

        upiSection.classList.add(
            "hidden"
        );

        return;

    }


    upiSection.classList.remove(
        "hidden"
    );


    generateQRCode();

}


// =====================================================
// QR CODE
// =====================================================

function generateQRCode() {

    const qr =
        document.getElementById(
            "qrcode"
        );


    qr.innerHTML = "";


    if (!shop || !shop.upiId) {

        qr.innerHTML = `
            <p>
                UPI ID is not configured
                for this shop.
            </p>
        `;

        return;

    }


    const calculation =
        calculateBill();


    const amount =
        calculation.grandTotal
            .toFixed(2);


    const upiUrl =
        `upi://pay?pa=${
            encodeURIComponent(shop.upiId)
        }&pn=${
            encodeURIComponent(shop.shopName)
        }&am=${
            amount
        }&cu=INR`;


    new QRCode(qr, {

        text: upiUrl,

        width: 180,

        height: 180

    });

}


// =====================================================
// SAVE BILL
// =====================================================

async function saveBill() {

    const message =
        document.getElementById(
            "message"
        );


    message.textContent = "";


    const rows =
        itemsBody.querySelectorAll("tr");


    if (rows.length === 0) {

        message.textContent =
            "Add at least one item.";

        return;

    }


    const items = [];


    for (const row of rows) {

        const productName =
            row.querySelector(
                ".product-name"
            ).value.trim();


        const quantity =
            Number(
                row.querySelector(
                    ".quantity"
                ).value
            );


        const price =
            Number(
                row.querySelector(
                    ".price"
                ).value
            );


        if (!productName) {

            message.textContent =
                "Enter a product name.";

            return;

        }


        if (
            !quantity ||
            quantity < 1
        ) {

            message.textContent =
                "Quantity must be at least 1.";

            return;

        }


        if (
            price < 0 ||
            isNaN(price)
        ) {

            message.textContent =
                "Enter a valid price.";

            return;

        }


        items.push({

            productName,

            quantity,

            price

        });

    }


    const calculation =
        calculateBill();


    const body = {

        shopId,

        customerName:
            document.getElementById(
                "customerName"
            ).value.trim(),

        customerPhone:
            document.getElementById(
                "customerPhone"
            ).value.trim(),

        items,

        discount:
            calculation.discount,

        gstRate:
            calculation.gstRate,

        cgstRate:
            calculation.cgstRate,

        sgstRate:
            calculation.sgstRate,

        igstRate:
            calculation.igstRate,

        paymentMethod:
            paymentMethod.value

    };


    try {

        const response =
            await fetch(
                "http://localhost:5000/api/transactions",
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${token}`

                    },

                    body:
                        JSON.stringify(body)

                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            message.textContent =
                data.message ||
                "Failed to save bill.";

            return;

        }


        message.textContent =
            "✓ Bill saved successfully.";


        // Prepare print data
        preparePrintBill(
            data.transaction
        );


    } catch (error) {

        console.error(error);

        message.textContent =
            "Unable to connect to server.";

    }

}


// =====================================================
// PREPARE PRINT BILL
// =====================================================

function preparePrintBill(transaction) {

    document.getElementById(
        "printShopName"
    ).textContent =
        shop.shopName;


    document.getElementById(
        "printShopAddress"
    ).textContent =
        shop.shopAddress;


    document.getElementById(
        "printShopPhone"
    ).textContent =
        shop.phone
            ? `Phone: ${shop.phone}`
            : "";


    document.getElementById(
        "printShopGST"
    ).textContent =
        shop.gstNumber
            ? `GSTIN: ${shop.gstNumber}`
            : "";


    document.getElementById(
        "printCustomer"
    ).textContent =
        transaction.customerName;


    document.getElementById(
        "printCustomerPhone"
    ).textContent =
        transaction.customerPhone ||
        "-";


    document.getElementById(
        "printDate"
    ).textContent =
        new Date(
            transaction.createdAt
        ).toLocaleString();


    const printItems =
        document.getElementById(
            "printItems"
        );


    printItems.innerHTML = "";


    transaction.items.forEach(
        (item, index) => {

            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    ${index + 1}
                </td>

                <td>
                    ${escapeHtml(
                        item.productName
                    )}
                </td>

                <td>
                    ${item.quantity}
                </td>

                <td>
                    ${formatCurrency(
                        item.price
                    )}
                </td>

                <td>
                    ${formatCurrency(
                        item.total
                    )}
                </td>

            `;


            printItems.appendChild(row);

        }
    );


    document.getElementById(
        "printSubtotal"
    ).textContent =
        formatCurrency(
            transaction.subtotal
        );


    document.getElementById(
        "printDiscount"
    ).textContent =
        `${transaction.discount}%`;


    document.getElementById(
        "printCgst"
    ).textContent =
        formatCurrency(
            transaction.cgstAmount
        );


    document.getElementById(
        "printSgst"
    ).textContent =
        formatCurrency(
            transaction.sgstAmount
        );


    document.getElementById(
        "printIgst"
    ).textContent =
        formatCurrency(
            transaction.igstAmount
        );


    document.getElementById(
        "printTotal"
    ).textContent =
        formatCurrency(
            transaction.total
        );


    document.getElementById(
        "printPayment"
    ).textContent =
        transaction.paymentMethod
            .toUpperCase();

}


// =====================================================
// PRINT
// =====================================================

function printBill() {

    if (!shop) {

        alert(
            "Shop information is still loading."
        );

        return;

    }


    prepareCurrentPrintBill();

    window.print();

}


// =====================================================
// PREPARE CURRENT BILL FOR PRINT
// =====================================================

function prepareCurrentPrintBill() {

    const calculation =
        calculateBill();


    const customerName =
        document.getElementById(
            "customerName"
        ).value.trim()
        || "Walk-in Customer";


    const customerPhone =
        document.getElementById(
            "customerPhone"
        ).value.trim();


    document.getElementById(
        "printShopName"
    ).textContent =
        shop.shopName;


    document.getElementById(
        "printShopAddress"
    ).textContent =
        shop.shopAddress;


    document.getElementById(
        "printShopPhone"
    ).textContent =
        shop.phone
            ? `Phone: ${shop.phone}`
            : "";


    document.getElementById(
        "printShopGST"
    ).textContent =
        shop.gstNumber
            ? `GSTIN: ${shop.gstNumber}`
            : "";


    document.getElementById(
        "printCustomer"
    ).textContent =
        customerName;


    document.getElementById(
        "printCustomerPhone"
    ).textContent =
        customerPhone || "-";


    document.getElementById(
        "printDate"
    ).textContent =
        new Date().toLocaleString();


    const printItems =
        document.getElementById(
            "printItems"
        );


    printItems.innerHTML = "";


    const rows =
        itemsBody.querySelectorAll("tr");


    rows.forEach(
        (row, index) => {

            const name =
                row.querySelector(
                    ".product-name"
                ).value;


            const quantity =
                Number(
                    row.querySelector(
                        ".quantity"
                    ).value
                ) || 0;


            const price =
                Number(
                    row.querySelector(
                        ".price"
                    ).value
                ) || 0;


            const total =
                quantity * price;


            printItems.innerHTML += `

                <tr>

                    <td>
                        ${index + 1}
                    </td>

                    <td>
                        ${escapeHtml(name)}
                    </td>

                    <td>
                        ${quantity}
                    </td>

                    <td>
                        ${formatCurrency(price)}
                    </td>

                    <td>
                        ${formatCurrency(total)}
                    </td>

                </tr>

            `;

        }
    );


    document.getElementById(
        "printSubtotal"
    ).textContent =
        formatCurrency(
            calculation.subtotal
        );


    document.getElementById(
        "printDiscount"
    ).textContent =
        `${calculation.discount}%`;


    document.getElementById(
        "printCgst"
    ).textContent =
        formatCurrency(
            calculation.cgstAmount
        );


    document.getElementById(
        "printSgst"
    ).textContent =
        formatCurrency(
            calculation.sgstAmount
        );


    document.getElementById(
        "printIgst"
    ).textContent =
        formatCurrency(
            calculation.igstAmount
        );


    document.getElementById(
        "printTotal"
    ).textContent =
        formatCurrency(
            calculation.grandTotal
        );


    document.getElementById(
        "printPayment"
    ).textContent =
        paymentMethod.value.toUpperCase();

}


// =====================================================
// UTILITIES
// =====================================================

function formatCurrency(value) {

    return new Intl.NumberFormat(
        "en-IN",
        {
            style: "currency",
            currency: "INR"
        }
    ).format(
        Number(value) || 0
    );

}


function escapeHtml(value) {

    const div =
        document.createElement("div");

    div.textContent =
        value || "";

    return div.innerHTML;

}


function goBack() {

    window.location.href =
        "shop-dashboard.html";

}


// =====================================================
// EVENTS
// =====================================================

discountInput.addEventListener(
    "input",
    () => {

        calculateBill();

        if (
            paymentMethod.value === "upi"
        ) {
            generateQRCode();
        }

    }
);


gstRateInput.addEventListener(
    "input",
    () => {

        calculateBill();

        if (
            paymentMethod.value === "upi"
        ) {
            generateQRCode();
        }

    }
);


gstType.addEventListener(
    "change",
    () => {

        calculateBill();

    }
);


// =====================================================
// INITIAL LOAD
// =====================================================

document.getElementById(
    "billDate"
).textContent =
    new Date().toLocaleString();


addItem();

loadShop();