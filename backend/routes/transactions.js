const express = require("express");

const Transaction = require("../models/Transaction");
const Shop = require("../models/Shop");
const Product = require("../models/Product");
const Customer = require("../models/Customer");

const {
    protect,
    ownerOnly
} = require("../middleware/authMiddleware");

const router = express.Router();


// =====================================================
// CREATE NEW BILL
// POST /api/transactions
// =====================================================

router.post("/", protect, ownerOnly, async (req, res) => {

    try {

        const {
            shopId,
            customerName,
            customerPhone,
            customerId,
            items,
            discount = 0,
            gstRate = 0,
            taxType = "intra",
            paymentMethod = "cash"
        } = req.body;


        // =================================================
        // BASIC VALIDATION
        // =================================================

        if (!shopId) {

            return res.status(400).json({
                message: "Shop ID is required"
            });

        }


        if (
            !Array.isArray(items) ||
            items.length === 0
        ) {

            return res.status(400).json({
                message: "At least one product is required"
            });

        }


        // =================================================
        // CHECK SHOP
        // =================================================

        const shop = await Shop.findOne({
            _id: shopId,
            owner: req.user._id
        });


        if (!shop) {

            return res.status(404).json({
                message: "Shop not found or access denied"
            });

        }


        // =================================================
        // CHECK DISCOUNT
        // =================================================

        const discountPercent =
            Number(discount);


        if (
            Number.isNaN(discountPercent) ||
            discountPercent < 0 ||
            discountPercent > 100
        ) {

            return res.status(400).json({
                message: "Discount must be between 0% and 100%"
            });

        }


        // =================================================
        // CHECK GST
        // =================================================

        const taxRate =
            Number(gstRate);


        if (
            Number.isNaN(taxRate) ||
            taxRate < 0
        ) {

            return res.status(400).json({
                message: "Invalid GST rate"
            });

        }


        // =================================================
        // CHECK PAYMENT METHOD
        // =================================================

        const allowedPaymentMethods = [
            "cash",
            "upi",
            "card",
            "credit"
        ];


        if (
            !allowedPaymentMethods.includes(
                paymentMethod
            )
        ) {

            return res.status(400).json({
                message: "Invalid payment method"
            });

        }


        // =================================================
        // CHECK TAX TYPE
        // =================================================

        if (
            taxType !== "intra" &&
            taxType !== "inter"
        ) {

            return res.status(400).json({
                message: "Invalid tax type"
            });

        }


        // =================================================
        // NORMALIZE ITEMS
        // =================================================

        const normalizedItems = [];


        for (const item of items) {

            if (!item.productId) {

                return res.status(400).json({
                    message: "Product ID is required for every item"
                });

            }


            const quantity =
                Number(item.quantity);


            if (
                Number.isNaN(quantity) ||
                !Number.isInteger(quantity) ||
                quantity < 1
            ) {

                return res.status(400).json({
                    message:
                        "Quantity must be a positive whole number"
                });

            }


            normalizedItems.push({
                productId: item.productId,
                quantity
            });

        }


        // =================================================
        // CHECK DUPLICATE PRODUCTS
        // =================================================

        const productIds =
            normalizedItems.map(
                item => item.productId
            );


        const uniqueProductIds =
            new Set(productIds);


        if (
            uniqueProductIds.size !==
            productIds.length
        ) {

            return res.status(400).json({
                message:
                    "The same product cannot be added twice to one bill"
            });

        }


        // =================================================
        // FIND PRODUCTS
        // =================================================

        const products =
            await Product.find({
                _id: {
                    $in: productIds
                },

                shop: shopId,

                owner: req.user._id
            });


        // =================================================
        // CHECK ALL PRODUCTS EXIST
        // =================================================

        if (
            products.length !==
            uniqueProductIds.size
        ) {

            return res.status(400).json({
                message:
                    "One or more products were not found or do not belong to this shop"
            });

        }


        // =================================================
        // CREATE PRODUCT MAP
        // =================================================

        const productMap =
            new Map();


        products.forEach(product => {

            productMap.set(
                product._id.toString(),
                product
            );

        });


        // =================================================
        // VALIDATE STOCK
        // =================================================

        for (const item of normalizedItems) {

            const product =
                productMap.get(
                    item.productId.toString()
                );


            if (!product) {

                return res.status(400).json({
                    message:
                        "Product not found"
                });

            }


            if (
                product.stock <
                item.quantity
            ) {

                return res.status(400).json({

                    message:
                        `Insufficient stock for "${product.name}". Available stock: ${product.stock}`

                });

            }

        }


        // =================================================
        // PREPARE BILL ITEMS
        // =================================================

        const billItems =
            normalizedItems.map(item => {

                const product =
                    productMap.get(
                        item.productId.toString()
                    );


                const quantity =
                    item.quantity;


                const price =
                    Number(product.price);


                const total =
                    quantity * price;


                return {

                    product:
                        product._id,

                    productName:
                        product.name,

                    quantity,

                    price,

                    total:
                        Number(
                            total.toFixed(2)
                        )

                };

            });


        // =================================================
        // CALCULATE SUBTOTAL
        // =================================================

        const calculatedSubtotal =
            billItems.reduce(
                (sum, item) => {

                    return sum + item.total;

                },
                0
            );


        // =================================================
        // CALCULATE DISCOUNT
        // =================================================

        const discountAmount =
            calculatedSubtotal *
            (discountPercent / 100);


        // =================================================
        // TAXABLE AMOUNT
        // =================================================

        const taxableAmount =
            Math.max(
                calculatedSubtotal -
                discountAmount,
                0
            );


        // =================================================
        // CALCULATE GST
        // =================================================

        let cgstRate = 0;
        let sgstRate = 0;
        let igstRate = 0;

        let cgstAmount = 0;
        let sgstAmount = 0;
        let igstAmount = 0;


        if (taxType === "intra") {

            cgstRate =
                taxRate / 2;

            sgstRate =
                taxRate / 2;


            cgstAmount =
                taxableAmount *
                (cgstRate / 100);


            sgstAmount =
                taxableAmount *
                (sgstRate / 100);

        }


        if (taxType === "inter") {

            igstRate =
                taxRate;


            igstAmount =
                taxableAmount *
                (igstRate / 100);

        }


        // =================================================
        // TOTAL GST
        // =================================================

        const totalGst =
            cgstAmount +
            sgstAmount +
            igstAmount;


        // =================================================
        // FINAL TOTAL
        // =================================================

        const finalTotal =
            taxableAmount +
            totalGst;


        // =================================================
        // FIND CUSTOMER
        // =================================================

        let customer = null;


        // -----------------------------------------------
        // If customerId is supplied
        // -----------------------------------------------

        if (customerId) {

            customer =
                await Customer.findOne({

                    _id: customerId,

                    shop: shopId,

                    owner: req.user._id

                });


            if (!customer) {

                return res.status(404).json({
                    message:
                        "Customer not found or access denied"
                });

            }

        }


        // -----------------------------------------------
        // Otherwise find by phone
        // -----------------------------------------------

        else if (customerPhone) {

            customer =
                await Customer.findOne({

                    phone:
                        customerPhone.trim(),

                    shop: shopId,

                    owner: req.user._id

                });

        }


        // =================================================
        // CUSTOMER SNAPSHOT
        // =================================================

        const finalCustomerName =
            customer
                ? customer.name
                : (
                    customerName &&
                    customerName.trim()
                        ? customerName.trim()
                        : "Walk-in Customer"
                );


        const finalCustomerPhone =
            customer
                ? customer.phone
                : (
                    customerPhone
                        ? customerPhone.trim()
                        : ""
                );


        // =================================================
        // CREATE TRANSACTION
        // =================================================

        const transaction =
            await Transaction.create({

                owner:
                    req.user._id,

                shop:
                    shopId,

                customer:
                    customer
                        ? customer._id
                        : null,

                customerName:
                    finalCustomerName,

                customerPhone:
                    finalCustomerPhone,


                // -----------------------------------------
                // ITEMS
                // -----------------------------------------

                items:
                    billItems,


                // -----------------------------------------
                // SUBTOTAL
                // -----------------------------------------

                subtotal:
                    Number(
                        calculatedSubtotal.toFixed(2)
                    ),


                // -----------------------------------------
                // DISCOUNT
                // -----------------------------------------

                discount:
                    Number(
                        discountPercent.toFixed(2)
                    ),


                // -----------------------------------------
                // GST RATE
                // -----------------------------------------

                gstRate:
                    Number(
                        taxRate.toFixed(2)
                    ),


                // -----------------------------------------
                // CGST
                // -----------------------------------------

                cgstRate:
                    Number(
                        cgstRate.toFixed(2)
                    ),

                cgstAmount:
                    Number(
                        cgstAmount.toFixed(2)
                    ),


                // -----------------------------------------
                // SGST
                // -----------------------------------------

                sgstRate:
                    Number(
                        sgstRate.toFixed(2)
                    ),

                sgstAmount:
                    Number(
                        sgstAmount.toFixed(2)
                    ),


                // -----------------------------------------
                // IGST
                // -----------------------------------------

                igstRate:
                    Number(
                        igstRate.toFixed(2)
                    ),

                igstAmount:
                    Number(
                        igstAmount.toFixed(2)
                    ),


                // -----------------------------------------
                // TOTAL GST
                // -----------------------------------------

                gst:
                    Number(
                        totalGst.toFixed(2)
                    ),


                // -----------------------------------------
                // FINAL TOTAL
                // -----------------------------------------

                total:
                    Number(
                        finalTotal.toFixed(2)
                    ),


                // -----------------------------------------
                // PAYMENT
                // -----------------------------------------

                paymentMethod

            });


        // =================================================
        // DEDUCT STOCK
        // =================================================

        for (const item of normalizedItems) {

            const product =
                productMap.get(
                    item.productId.toString()
                );


            product.stock -=
                item.quantity;


            await product.save();

        }


        // =================================================
        // UPDATE CUSTOMER
        // =================================================

        if (customer) {

            customer.totalPurchase +=
                Number(
                    finalTotal.toFixed(2)
                );


            customer.totalTransactions += 1;


            await customer.save();

        }


        // =================================================
        // SUCCESS RESPONSE
        // =================================================

        res.status(201).json({

            message:
                "Bill saved successfully",

            transaction

        });


    } catch (error) {

        console.error(
            "Create transaction error:",
            error
        );


        res.status(500).json({

            message:
                "Failed to save bill",

            error:
                error.message

        });

    }

});


// =====================================================
// GET SHOP TRANSACTIONS
// GET /api/transactions?shopId=SHOP_ID
// =====================================================

router.get("/", protect, ownerOnly, async (req, res) => {

    try {

        const {
            shopId
        } = req.query;


        if (!shopId) {

            return res.status(400).json({

                message:
                    "Shop ID is required"

            });

        }


        // =================================================
        // CHECK SHOP OWNERSHIP
        // =================================================

        const shop =
            await Shop.findOne({

                _id: shopId,

                owner:
                    req.user._id

            });


        if (!shop) {

            return res.status(404).json({

                message:
                    "Shop not found or access denied"

            });

        }


        // =================================================
        // GET TRANSACTIONS
        // =================================================

        const transactions =
            await Transaction.find({

                owner:
                    req.user._id,

                shop:
                    shopId

            })
            .populate(
                "customer",
                "name phone email"
            )
            .populate(
                "items.product",
                "name price stock"
            )
            .sort({
                createdAt: -1
            });


        res.json({

            count:
                transactions.length,

            transactions

        });


    } catch (error) {

        console.error(
            "Get transactions error:",
            error
        );


        res.status(500).json({

            message:
                "Failed to fetch transactions",

            error:
                error.message

        });

    }

});


module.exports = router;