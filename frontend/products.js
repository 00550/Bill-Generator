const token = localStorage.getItem("token");
const shopId = localStorage.getItem("selectedShopId");

let products = [];

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

const productsBody = document.getElementById("productsBody");
const productNameInput = document.getElementById("productName");
const categoryInput = document.getElementById("category");
const priceInput = document.getElementById("price");
const stockInput = document.getElementById("stock");
const message = document.getElementById("message");


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
            `${shop.shopAddress} | ${shop.phone || "No phone"} | GSTIN: ${shop.gstNumber || "Not provided"}`;

    } catch (error) {

        console.error("Load shop error:", error);

        document.getElementById("shopName").textContent =
            "Unable to load shop";

        document.getElementById("shopDetails").textContent =
            "Server connection failed";
    }
}


// =====================================================
// LOAD PRODUCTS
// =====================================================

async function loadProducts() {

    productsBody.innerHTML = `
        <tr>
            <td colspan="6" class="loading">
                Loading products...
            </td>
        </tr>
    `;

    try {

        const response = await fetch(
            `http://localhost:5000/api/products?shopId=${encodeURIComponent(shopId)}`,
            {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {

            productsBody.innerHTML = `
                <tr>
                    <td colspan="6" class="loading">
                        ${escapeHtml(
                            data.message ||
                            "Failed to load products"
                        )}
                    </td>
                </tr>
            `;

            return;
        }

        products = data.products || [];

        displayProducts();

    } catch (error) {

        console.error("Load products error:", error);

        productsBody.innerHTML = `
            <tr>
                <td colspan="6" class="loading">
                    Unable to connect to server.
                </td>
            </tr>
        `;
    }
}


// =====================================================
// DISPLAY PRODUCTS
// =====================================================

function displayProducts() {

    productsBody.innerHTML = "";

    if (products.length === 0) {

        productsBody.innerHTML = `
            <tr>
                <td colspan="6" class="loading">
                    No products found.
                </td>
            </tr>
        `;

        return;
    }

    products.forEach((product, index) => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>
                ${index + 1}
            </td>

            <td>
                ${escapeHtml(product.name || "")}
            </td>

            <td>
                ${escapeHtml(product.category || "-")}
            </td>

            <td class="price">
                ${formatCurrency(product.price)}
            </td>

            <td class="stock">
                ${Number(product.stock || 0)}
            </td>

            <td>

                <button
                    type="button"
                    class="edit-btn"
                    onclick="editProduct('${product._id}')"
                >
                    Edit
                </button>

                <button
                    type="button"
                    class="delete-btn"
                    onclick="deleteProduct('${product._id}')"
                >
                    Delete
                </button>

            </td>
        `;

        productsBody.appendChild(row);
    });
}


// =====================================================
// ADD PRODUCT
// =====================================================

async function addProduct() {

    clearMessage();

    const name = productNameInput.value.trim();
    const category = categoryInput.value.trim();

    const price = Number(priceInput.value);
    const stock = Number(stockInput.value);

    // ==========================================
    // VALIDATION
    // ==========================================

    if (!name) {

        showMessage(
            "Enter product name.",
            true
        );

        productNameInput.focus();

        return;
    }

    if (
        priceInput.value === "" ||
        Number.isNaN(price) ||
        price < 0
    ) {

        showMessage(
            "Enter a valid price.",
            true
        );

        priceInput.focus();

        return;
    }

    if (
        stockInput.value === "" ||
        Number.isNaN(stock) ||
        stock < 0
    ) {

        showMessage(
            "Enter a valid stock quantity.",
            true
        );

        stockInput.focus();

        return;
    }

    const body = {

        shopId,

        name,

        category,

        price,

        stock
    };

    try {

        const response = await fetch(
            "http://localhost:5000/api/products",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },

                body: JSON.stringify(body)
            }
        );

        const data = await response.json();

        if (!response.ok) {

            showMessage(
                data.message ||
                "Failed to add product.",
                true
            );

            return;
        }

        showMessage(
            "✓ Product added successfully."
        );

        clearProductForm();

        await loadProducts();

    } catch (error) {

        console.error(
            "Add product error:",
            error
        );

        showMessage(
            "Unable to connect to server.",
            true
        );
    }
}


// =====================================================
// EDIT PRODUCT
// =====================================================

async function editProduct(productId) {

    const product = products.find(
        item => item._id === productId
    );

    if (!product) {

        showMessage(
            "Product not found.",
            true
        );

        return;
    }

    const currentName =
        product.name || "";

    const currentCategory =
        product.category || "";

    const currentPrice =
        Number(product.price || 0);

    const currentStock =
        Number(product.stock || 0);

    const name = prompt(
        "Product name:",
        currentName
    );

    if (name === null) {
        return;
    }

    const category = prompt(
        "Category:",
        currentCategory
    );

    if (category === null) {
        return;
    }

    const priceValue = prompt(
        "Price:",
        currentPrice
    );

    if (priceValue === null) {
        return;
    }

    const stockValue = prompt(
        "Stock:",
        currentStock
    );

    if (stockValue === null) {
        return;
    }

    const trimmedName =
        name.trim();

    const trimmedCategory =
        category.trim();

    const price =
        Number(priceValue);

    const stock =
        Number(stockValue);

    if (!trimmedName) {

        showMessage(
            "Product name cannot be empty.",
            true
        );

        return;
    }

    if (
        Number.isNaN(price) ||
        price < 0
    ) {

        showMessage(
            "Invalid price.",
            true
        );

        return;
    }

    if (
        Number.isNaN(stock) ||
        stock < 0
    ) {

        showMessage(
            "Invalid stock.",
            true
        );

        return;
    }

    const body = {

        shopId,

        name: trimmedName,

        category: trimmedCategory,

        price,

        stock
    };

    try {

        const response = await fetch(
            `http://localhost:5000/api/products/${productId}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },

                body: JSON.stringify(body)
            }
        );

        const data =
            await response.json();

        if (!response.ok) {

            showMessage(
                data.message ||
                "Failed to update product.",
                true
            );

            return;
        }

        showMessage(
            "✓ Product updated successfully."
        );

        await loadProducts();

    } catch (error) {

        console.error(
            "Edit product error:",
            error
        );

        showMessage(
            "Unable to connect to server.",
            true
        );
    }
}


// =====================================================
// DELETE PRODUCT
// =====================================================

async function deleteProduct(productId) {

    const product = products.find(
        item => item._id === productId
    );

    if (!product) {

        showMessage(
            "Product not found.",
            true
        );

        return;
    }

    const productName =
        product.name ||
        "this product";

    const confirmed = confirm(
        `Are you sure you want to delete "${productName}"?`
    );

    if (!confirmed) {
        return;
    }

    try {

        const response = await fetch(
            `http://localhost:5000/api/products/${productId}`,
            {
                method: "DELETE",

                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        const data =
            await response.json();

        if (!response.ok) {

            showMessage(
                data.message ||
                "Failed to delete product.",
                true
            );

            return;
        }

        showMessage(
            "✓ Product deleted successfully."
        );

        await loadProducts();

    } catch (error) {

        console.error(
            "Delete product error:",
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

function clearProductForm() {

    productNameInput.value = "";
    categoryInput.value = "";
    priceInput.value = "";
    stockInput.value = "";
}


// =====================================================
// MESSAGE
// =====================================================

function showMessage(text, isError = false) {

    message.textContent = text;

    message.style.color =
        isError
            ? "#dc2626"
            : "#16a34a";
}


function clearMessage() {

    message.textContent = "";
}


// =====================================================
// CURRENCY
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


// =====================================================
// HTML ESCAPE
// =====================================================

function escapeHtml(value) {

    const div =
        document.createElement("div");

    div.textContent =
        value == null
            ? ""
            : String(value);

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
loadProducts();