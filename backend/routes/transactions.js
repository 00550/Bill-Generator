
const express = require("express");

const Transaction = require("../models/Transaction");
const Shop = require("../models/Shop");

const {
    protect,
    ownerOnly
} = require("../middleware/authMiddleware");

const router = express.Router();


// ========================================
// CREATE NEW BILL
// POST /api/transactions
// ========================================

router.post("/", protect, ownerOnly, async (req, res) => {

    try {

        const {
            shopId,
            customerName,
            customerPhone,
            items,
            subtotal,
            discount = 0,
            gst = 0,
            total,
            paymentMethod
        } = req.body;


        // ========================================
        // VALIDATION
        // ========================================

        if (!shopId) {

            return res.status(400).json({
                message: "Shop ID is required"
            });

        }


        if (!items || !Array.isArray(items) || items.length === 0) {

            return res.status(400).json({
                message: "At least one product is required"
            });

        }


        // ========================================
        // CHECK SHOP
        // ========================================

        const shop = await Shop.findOne({
            _id: shopId,
            owner: req.user._id
        });


        if (!shop) {

            return res.status(404).json({
                message: "Shop not found or access denied"
            });

        }


        // ========================================
        // VALIDATE ITEMS
        // ========================================

        for (const item of items) {

            if (!item.productName) {

                return res.status(400).json({
                    message: "Product name is required"
                });

            }


            if (!item.quantity || item.quantity < 1) {

                return res.status(400).json({
                    message: "Quantity must be at least 1"
                });

            }


            if (
                item.price === undefined ||
                item.price < 0
            ) {

                return res.status(400).json({
                    message: "Invalid product price"
                });

            }

        }


        // ========================================
        // CALCULATE TOTAL
        // ========================================

        const calculatedSubtotal = items.reduce(
            (sum, item) => {

                return sum +
                    (Number(item.quantity) *
                    Number(item.price));

            },
            0
        );


        const discountAmount =
            Number(discount) || 0;


        const gstAmount =
            Number(gst) || 0;


        const calculatedTotal =
            Math.max(
                calculatedSubtotal -
                discountAmount +
                gstAmount,
                0
            );


        // ========================================
        // CREATE TRANSACTION
        // ========================================

        const transaction =
            await Transaction.create({

                owner: req.user._id,

                shop: shopId,

                customerName:
                    customerName ||
                    "Walk-in Customer",

                customerPhone:
                    customerPhone || "",

                items: items.map((item) => ({

                    productName:
                        item.productName,

                    quantity:
                        Number(item.quantity),

                    price:
                        Number(item.price),

                    total:
                        Number(item.quantity) *
                        Number(item.price)

                })),

                subtotal:
                    calculatedSubtotal,

                discount:
                    discountAmount,

                gst:
                    gstAmount,

                total:
                    calculatedTotal,

                paymentMethod:
                    paymentMethod || "cash"

            });


        // ========================================
        // RESPONSE
        // ========================================

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



// ========================================
// GET SHOP TRANSACTIONS
// GET /api/transactions?shopId=SHOP_ID
// ========================================

router.get("/", protect, ownerOnly, async (req, res) => {

    try {

        const { shopId } = req.query;


        if (!shopId) {

            return res.status(400).json({

                message:
                    "Shop ID is required"

            });

        }


        // ========================================
        // CHECK SHOP OWNERSHIP
        // ========================================

        const shop =
            await Shop.findOne({

                _id: shopId,

                owner: req.user._id

            });


        if (!shop) {

            return res.status(404).json({

                message:
                    "Shop not found or access denied"

            });

        }


        // ========================================
        // GET TRANSACTIONS
        // ========================================

        const transactions =
            await Transaction.find({

                owner: req.user._id,

                shop: shopId

            }).sort({

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
