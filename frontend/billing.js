
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
// LOAD SHOP DETAILS
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

            alert(
                data.message ||
                "Unable to load shop"
            );

            window.location.href = "shops.html";

            return;
        }


        const shop = data.shop;


        document.getElementById("shopName").textContent =
            shop.shopName || "Billing Desk";


        document.getElementById("shopAddress").textContent =
            shop.shopAddress || "-";


        document.getElementById("shopPhone").textContent =
            shop.phone || "-";


        document.getElementById("shopGST").textContent =
            shop.gstNumber || "-";


        /*
         * Optional shop payment information.
         *
         * These fields will only be filled if your
         * Shop model contains them.
         */

        if (shop.upiId) {

            document.getElementById("upiId").textContent =
                shop.upiId;

            generateQRCode(shop.upiId);

        }


        if (shop.accountName) {

            document.getElementById("accountName").textContent =
                shop.accountName;

        }


        if (shop.accountNumber) {

            document.getElementById("accountNumber").textContent =
                shop.accountNumber;

        }


        if (shop.bankName) {

            document.getElementById("bankName").textContent =
                shop.bankName;

        }


        if (shop.ifscCode) {

            document.getElementById("ifscCode").textContent =
                shop.ifscCode;

        }


    } catch (error) {

        console.error(
            "Load shop error:",
            error
        );


        document.getElementById(
            "shopName"
        ).textContent = "Unable to load shop";


        document.getElementById(
            "shopAddress"
        ).textContent = "Unable to connect to server.";

    }

}


// ========================================
// DATE & TIME
// ========================================

function setBillDateTime() {

    const dateElement =
        document.getElementById("billDateTime");


    if (!dateElement) {
        return;
    }


    const now = new Date();


    dateElement.textContent =
        now.toLocaleString("en-IN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
        });

}


// ========================================
// ADD ITEM
// ========================================

function addItem() {

    const container =
        document.getElementById("itemsContainer");


    const row =
        document.createElement("tr");


    row.className = "bill-item";


    row.innerHTML = `

        <td class="serial">
            -
        </td>

        <td>

            <input
                type="text"
                class="productName description-input"
                placeholder="Product name"
            >

        </td>

        <td>

            <input
                type="text"
                class="hsn"
                placeholder="HSN"
            >

        </td>

        <td>

            <input
                type="number"
                class="quantity"
                value="1"
                min="1"
                step="1"
                oninput="calculateTotal()"
            >

        </td>

        <td>

            <input
                type="number"
                class="price"
                value="0"
                min="0"
                step="0.01"
                oninput="calculateTotal()"
            >

        </td>

        <td>

            <input
                type="number"
                class="discount"
                value="0"
                min="0"
                step="0.01"
                oninput="calculateTotal()"
            >

        </td>

        <td class="amount">
            ₹0.00
        </td>

        <td class="remove-column">

            <button
                type="button"
                class="remove-btn"
                onclick="removeItem(this)"
            >
                X
            </button>

        </td>

    `;


    container.appendChild(row);


    updateSerialNumbers();

    calculateTotal();

}


// ========================================
// REMOVE ITEM
// ========================================

function removeItem(button) {

    const rows =
        document.querySelectorAll(
            "#itemsContainer .bill-item"
        );


    if (rows.length <= 1) {

        alert(
            "At least one product is required."
        );

        return;

    }


    button.closest(".bill-item").remove();


    updateSerialNumbers();

    calculateTotal();

}


// ========================================
// UPDATE SERIAL NUMBERS
// ========================================

function updateSerialNumbers() {

    const rows =
        document.querySelectorAll(
            "#itemsContainer .bill-item"
        );


    rows.forEach((row, index) => {

        const serial =
            row.querySelector(".serial");


        if (serial) {

            serial.textContent =
                index + 1;

        }

    });

}


// ========================================
// CALCULATE TOTAL
// ========================================

function calculateTotal() {

    const rows =
        document.querySelectorAll(
            "#itemsContainer .bill-item"
        );


    let subtotal = 0;


    rows.forEach((row) => {

        const quantityInput =
            row.querySelector(".quantity");


        const priceInput =
            row.querySelector(".price");


        const discountInput =
            row.querySelector(".discount");


        const quantity =
            Number(quantityInput?.value) || 0;


        const price =
            Number(priceInput?.value) || 0;


        const discount =
            Number(discountInput?.value) || 0;


        const grossAmount =
            quantity * price;


        /*
         * Discount is treated as a fixed amount
         * for each item.
         */

        const finalAmount =
            Math.max(
                grossAmount - discount,
                0
            );


        const amountElement =
            row.querySelector(".amount");


        if (amountElement) {

            amountElement.textContent =
                `₹${finalAmount.toFixed(2)}`;

        }


        subtotal += finalAmount;

    });


    // ========================================
    // GST
    // ========================================

    const cgstRate =
        Number(
            document.getElementById(
                "cgstRate"
            )?.value
        ) || 0;


    const sgstRate =
        Number(
            document.getElementById(
                "sgstRate"
            )?.value
        ) || 0;


    const igstRate =
        Number(
            document.getElementById(
                "igstRate"
            )?.value
        ) || 0;


    const cgstAmount =
        subtotal * cgstRate / 100;


    const sgstAmount =
        subtotal * sgstRate / 100;


    const igstAmount =
        subtotal * igstRate / 100;


    const grandTotal =
        subtotal +
        cgstAmount +
        sgstAmount +
        igstAmount;


    // ========================================
    // DISPLAY TOTALS
    // ========================================

    document.getElementById(
        "subtotal"
    ).textContent =
        subtotal.toFixed(2);


    document.getElementById(
        "cgstAmount"
    ).textContent =
        cgstAmount.toFixed(2);


    document.getElementById(
        "sgstAmount"
    ).textContent =
        sgstAmount.toFixed(2);


    document.getElementById(
        "igstAmount"
    ).textContent =
        igstAmount.toFixed(2);


    document.getElementById(
        "grandTotal"
    ).textContent =
        grandTotal.toFixed(2);


    // ========================================
    // AMOUNT IN WORDS
    // ========================================

    const words =
        numberToWords(
            Math.round(grandTotal)
        );


    const amountWords =
        document.getElementById(
            "amountWords"
        );


    if (amountWords) {

        amountWords.textContent =
            words + " Rupees Only";

    }


    return {
        subtotal,
        cgstRate,
        sgstRate,
        igstRate,
        cgstAmount,
        sgstAmount,
        igstAmount,
        grandTotal
    };

}


// ========================================
// GET BILL ITEMS
// ========================================

function getBillItems() {

    const rows =
        document.querySelectorAll(
            "#itemsContainer .bill-item"
        );


    const items = [];


    rows.forEach((row) => {

        const productName =
            row.querySelector(
                ".productName"
            )?.value.trim();


        const hsn =
            row.querySelector(
                ".hsn"
            )?.value.trim();


        const quantity =
            Number(
                row.querySelector(
                    ".quantity"
                )?.value
            ) || 0;


        const price =
            Number(
                row.querySelector(
                    ".price"
                )?.value
            ) || 0;


        const discount =
            Number(
                row.querySelector(
                    ".discount"
                )?.value
            ) || 0;


        const total =
            Math.max(
                quantity * price - discount,
                0
            );


        /*
         * HSN is kept in the frontend data.
         *
         * Your current Transaction model does
         * not contain an HSN field, so it is not
         * sent to the backend.
         */

        if (productName) {

            items.push({

                productName,

                quantity,

                price,

                total

            });

        }

    });


    return items;

}


// ========================================
// SAVE BILL
// ========================================

async function saveBill() {

    const message =
        document.getElementById(
            "message"
        );


    message.textContent =
        "Saving bill...";


    message.style.color =
        "#2563eb";


    const customerName =
        document.getElementById(
            "customerName"
        )?.value.trim() || "";


    const customerPhone =
        document.getElementById(
            "customerPhone"
        )?.value.trim() || "";


    const vehicleNo =
        document.getElementById(
            "vehicleNo"
        )?.value.trim() || "";


    const items =
        getBillItems();


    // ========================================
    // VALIDATION
    // ========================================

    if (items.length === 0) {

        message.textContent =
            "Please add at least one product.";

        message.style.color =
            "#dc2626";

        return;

    }


    for (const item of items) {

        if (
            !item.quantity ||
            item.quantity < 1
        ) {

            message.textContent =
                "Quantity must be at least 1.";

            message.style.color =
                "#dc2626";

            return;

        }


        if (item.price < 0) {

            message.textContent =
                "Price cannot be negative.";

            message.style.color =
                "#dc2626";

            return;

        }

    }


    const totals =
        calculateTotal();


    // ========================================
    // CREATE BILL DATA
    // ========================================

    const billData = {

        shopId,

        customerName:
            customerName ||
            "Walk-in Customer",

        customerPhone,

        items,

        subtotal:
            Number(
                totals.subtotal.toFixed(2)
            ),

        discount: 0,

        /*
         * Your backend Transaction model
         * currently has only one GST number.
         *
         * We store the total GST amount here.
         */

        gst:
            Number(
                (
                    totals.cgstAmount +
                    totals.sgstAmount +
                    totals.igstAmount
                ).toFixed(2)
            ),

        total:
            Number(
                totals.grandTotal.toFixed(2)
            ),

        paymentMethod:
            "cash"

    };


    // ========================================
    // SEND TO BACKEND
    // ========================================

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
                        JSON.stringify(
                            billData
                        )

                }
            );


        let data;


        try {

            data =
                await response.json();

        } catch (jsonError) {

            data = {};

        }


        if (!response.ok) {

            console.error(
                "Save bill failed:",
                data
            );


            message.textContent =
                data.message ||
                "Failed to save bill.";

            message.style.color =
                "#dc2626";

            return;

        }


        // ========================================
        // SUCCESS
        // ========================================

        message.textContent =
            "Bill saved successfully!";

        message.style.color =
            "#16a34a";


        /*
         * Give the user a moment to see the
         * success message before redirecting.
         */

        setTimeout(() => {

            window.location.href =
                "transactions.html";

        }, 1000);


    } catch (error) {

        console.error(
            "Save bill error:",
            error
        );


        message.textContent =
            "Unable to connect to server.";

        message.style.color =
            "#dc2626";

    }

}


// ========================================
// PRINT BILL
// ========================================

function printBill() {

    calculateTotal();

    window.print();

}


// ========================================
// GENERATE UPI QR CODE
// ========================================

function generateQRCode(upiId) {

    const qrContainer =
        document.getElementById(
            "qrcode"
        );


    if (!qrContainer) {
        return;
    }


    qrContainer.innerHTML = "";


    if (
        typeof QRCode ===
        "undefined"
    ) {

        console.warn(
            "QRCode library not loaded."
        );

        return;

    }


    if (!upiId) {

        return;

    }


    /*
     * Basic UPI payment QR.
     *
     * Amount is intentionally not fixed here.
     * The QR represents the shop's UPI ID.
     */

    const upiUrl =
        `upi://pay?pa=${encodeURIComponent(
            upiId
        )}&pn=${encodeURIComponent(
            document.getElementById(
                "shopName"
            )?.textContent || "Shop"
        )}&cu=INR`;


    new QRCode(
        qrContainer,
        {
            text: upiUrl,
            width: 140,
            height: 140
        }
    );

}


// ========================================
// BACK TO SHOP DASHBOARD
// ========================================

function goBack() {

    window.location.href =
        "shop-dashboard.html";

}


// ========================================
// NUMBER TO WORDS
// ========================================

function numberToWords(number) {

    number =
        Number(number) || 0;


    if (number === 0) {

        return "Zero";

    }


    const ones = [

        "",
        "One",
        "Two",
        "Three",
        "Four",
        "Five",
        "Six",
        "Seven",
        "Eight",
        "Nine",
        "Ten",
        "Eleven",
        "Twelve",
        "Thirteen",
        "Fourteen",
        "Fifteen",
        "Sixteen",
        "Seventeen",
        "Eighteen",
        "Nineteen"

    ];


    const tens = [

        "",
        "",
        "Twenty",
        "Thirty",
        "Forty",
        "Fifty",
        "Sixty",
        "Seventy",
        "Eighty",
        "Ninety"

    ];


    function convertLessThanThousand(num) {

        let result = "";


        if (num >= 100) {

            result +=
                ones[
                    Math.floor(
                        num / 100
                    )
                ] +
                " Hundred ";

            num %= 100;

        }


        if (num >= 20) {

            result +=
                tens[
                    Math.floor(
                        num / 10
                    )
                ];

            if (num % 10 !== 0) {

                result +=
                    " " +
                    ones[
                        num % 10
                    ];

            }

        } else if (num > 0) {

            result +=
                ones[num];

        }


        return result.trim();

    }


    let result = "";


    if (number >= 10000000) {

        result +=
            convertLessThanThousand(
                Math.floor(
                    number / 10000000
                )
            ) +
            " Crore ";

        number %=
            10000000;

    }


    if (number >= 100000) {

        result +=
            convertLessThanThousand(
                Math.floor(
                    number / 100000
                )
            ) +
            " Lakh ";

        number %=
            100000;

    }


    if (number >= 1000) {

        result +=
            convertLessThanThousand(
                Math.floor(
                    number / 1000
                )
            ) +
            " Thousand ";

        number %=
            1000;

    }


    if (number > 0) {

        result +=
            convertLessThanThousand(
                number
            );

    }


    return result.trim();

}


// ========================================
// INITIALIZE
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        setBillDateTime();

        loadShop();

        calculateTotal();

    }
);


