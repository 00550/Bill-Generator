const token = localStorage.getItem("token");
const shopId = localStorage.getItem("selectedShopId");

let customers = [];


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

const customersBody =
    document.getElementById("customersBody");

const customerNameInput =
    document.getElementById("customerName");

const phoneInput =
    document.getElementById("phone");

const emailInput =
    document.getElementById("email");

const addressInput =
    document.getElementById("address");

const message =
    document.getElementById("message");


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

            window.location.href = "shops.html";

            return;
        }

        const shop = data.shop;

        document.getElementById("shopName").textContent =
            shop.shopName;

        document.getElementById("shopDetails").textContent =
            `${shop.shopAddress} | ${
                shop.phone || "No phone"
            } | GSTIN: ${
                shop.gstNumber || "Not provided"
            }`;

    } catch (error) {

        console.error(
            "Load shop error:",
            error
        );

        document.getElementById("shopName").textContent =
            "Unable to load shop";

        document.getElementById("shopDetails").textContent =
            "Server connection failed";
    }
}


// =====================================================
// LOAD CUSTOMERS
// =====================================================

async function loadCustomers() {

    customersBody.innerHTML = `
        <tr>
            <td colspan="6" class="loading">
                Loading customers...
            </td>
        </tr>
    `;

    try {

        const response = await fetch(
            `http://localhost:5000/api/customers?shopId=${encodeURIComponent(shopId)}`,
            {
                method: "GET",

                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {

            customersBody.innerHTML = `
                <tr>
                    <td colspan="6" class="loading">
                        ${
                            data.message ||
                            "Failed to load customers"
                        }
                    </td>
                </tr>
            `;

            return;
        }

        customers =
            data.customers || [];

        displayCustomers();

    } catch (error) {

        console.error(
            "Load customers error:",
            error
        );

        customersBody.innerHTML = `
            <tr>
                <td colspan="6" class="loading">
                    Unable to connect to server.
                </td>
            </tr>
        `;
    }
}


// =====================================================
// DISPLAY CUSTOMERS
// =====================================================

function displayCustomers() {

    customersBody.innerHTML = "";

    if (customers.length === 0) {

        customersBody.innerHTML = `
            <tr>
                <td colspan="6" class="loading">
                    No customers found.
                </td>
            </tr>
        `;

        return;
    }

    customers.forEach((customer, index) => {

        const row =
            document.createElement("tr");

        row.innerHTML = `

            <td>
                ${index + 1}
            </td>

            <td>
                ${escapeHtml(customer.name || "")}
            </td>

            <td>
                ${escapeHtml(customer.phone || "-")}
            </td>

            <td>
                ${escapeHtml(customer.email || "-")}
            </td>

            <td>
                ${escapeHtml(customer.address || "-")}
            </td>

            <td>

                <button
                    type="button"
                    class="edit-btn"
                    onclick="editCustomer('${customer._id}')"
                >
                    Edit
                </button>

                <button
                    type="button"
                    class="delete-btn"
                    onclick="deleteCustomer('${customer._id}')"
                >
                    Delete
                </button>

            </td>
        `;

        customersBody.appendChild(row);
    });
}


// =====================================================
// ADD CUSTOMER
// =====================================================

async function addCustomer() {

    clearMessage();

    const name =
        customerNameInput.value.trim();

    const phone =
        phoneInput.value.trim();

    const email =
        emailInput.value.trim();

    const address =
        addressInput.value.trim();


    // ==========================================
    // VALIDATION
    // ==========================================

    if (!name) {

        showMessage(
            "Enter customer name.",
            true
        );

        customerNameInput.focus();

        return;
    }

    if (!phone) {

        showMessage(
            "Enter customer phone.",
            true
        );

        phoneInput.focus();

        return;
    }


    const body = {

        shopId,

        name,

        phone,

        email,

        address
    };


    try {

        const response = await fetch(
            "http://localhost:5000/api/customers",
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

            showMessage(
                data.message ||
                "Failed to add customer.",
                true
            );

            return;
        }


        showMessage(
            "✓ Customer added successfully."
        );


        clearCustomerForm();

        await loadCustomers();


    } catch (error) {

        console.error(
            "Add customer error:",
            error
        );

        showMessage(
            "Unable to connect to server.",
            true
        );
    }
}


// =====================================================
// EDIT CUSTOMER
// =====================================================

async function editCustomer(customerId) {

    const customer =
        customers.find(
            item =>
                item._id === customerId
        );


    if (!customer) {

        showMessage(
            "Customer not found.",
            true
        );

        return;
    }


    const currentName =
        customer.name || "";

    const currentPhone =
        customer.phone || "";

    const currentEmail =
        customer.email || "";

    const currentAddress =
        customer.address || "";


    const name =
        prompt(
            "Customer name:",
            currentName
        );

    if (name === null) {
        return;
    }


    const phone =
        prompt(
            "Phone:",
            currentPhone
        );

    if (phone === null) {
        return;
    }


    const email =
        prompt(
            "Email:",
            currentEmail
        );

    if (email === null) {
        return;
    }


    const address =
        prompt(
            "Address:",
            currentAddress
        );

    if (address === null) {
        return;
    }


    const trimmedName =
        name.trim();

    const trimmedPhone =
        phone.trim();

    const trimmedEmail =
        email.trim();

    const trimmedAddress =
        address.trim();


    // ==========================================
    // VALIDATION
    // ==========================================

    if (!trimmedName) {

        showMessage(
            "Customer name cannot be empty.",
            true
        );

        return;
    }


    if (!trimmedPhone) {

        showMessage(
            "Customer phone cannot be empty.",
            true
        );

        return;
    }


    const body = {

        name:
            trimmedName,

        phone:
            trimmedPhone,

        email:
            trimmedEmail,

        address:
            trimmedAddress
    };


    try {

        const response = await fetch(
            `http://localhost:5000/api/customers/${customerId}`,
            {
                method: "PUT",

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

            showMessage(
                data.message ||
                "Failed to update customer.",
                true
            );

            return;
        }


        showMessage(
            "✓ Customer updated successfully."
        );


        await loadCustomers();


    } catch (error) {

        console.error(
            "Edit customer error:",
            error
        );

        showMessage(
            "Unable to connect to server.",
            true
        );
    }
}


// =====================================================
// DELETE CUSTOMER
// =====================================================

async function deleteCustomer(customerId) {

    const customer =
        customers.find(
            item =>
                item._id === customerId
        );


    if (!customer) {

        showMessage(
            "Customer not found.",
            true
        );

        return;
    }


    const customerName =
        customer.name ||
        "this customer";


    const confirmed =
        confirm(
            `Are you sure you want to delete "${customerName}"?`
        );


    if (!confirmed) {
        return;
    }


    try {

        const response = await fetch(
            `http://localhost:5000/api/customers/${customerId}`,
            {
                method: "DELETE",

                headers: {

                    "Authorization":
                        `Bearer ${token}`
                }
            }
        );


        const data =
            await response.json();


        if (!response.ok) {

            showMessage(
                data.message ||
                "Failed to delete customer.",
                true
            );

            return;
        }


        showMessage(
            "✓ Customer deleted successfully."
        );


        await loadCustomers();


    } catch (error) {

        console.error(
            "Delete customer error:",
            error
        );

        showMessage(
            "Unable to connect to server.",
            true
        );
    }
}


// =====================================================
// CLEAR FORM
// =====================================================

function clearCustomerForm() {

    customerNameInput.value = "";

    phoneInput.value = "";

    emailInput.value = "";

    addressInput.value = "";
}


// =====================================================
// MESSAGE
// =====================================================

function showMessage(
    text,
    isError = false
) {

    message.textContent =
        text;

    message.style.color =
        isError
            ? "#dc2626"
            : "#16a34a";
}


function clearMessage() {

    message.textContent = "";
}


// =====================================================
// HTML ESCAPE
// =====================================================

function escapeHtml(value) {

    const div =
        document.createElement("div");

    div.textContent =
        value || "";

    return div.innerHTML;
}


// =====================================================
// BACK
// =====================================================

function goBack() {

    window.location.href =
        "shop-dashboard.html";
}


// =====================================================
// INITIAL LOAD
// =====================================================

loadShop();

loadCustomers();