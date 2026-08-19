const express = require("express");

const Customer = require("../models/Customer");
const Shop = require("../models/Shop");

const {
    protect,
    ownerOnly
} = require("../middleware/authMiddleware");

const router = express.Router();


// =====================================================
// CREATE CUSTOMER
// POST /api/customers
// =====================================================

router.post("/", protect, ownerOnly, async (req, res) => {

    try {

        const {
            name,
            phone,
            email,
            address,
            shopId
        } = req.body;


        // ==========================================
        // VALIDATION
        // ==========================================

        if (!name || !phone || !shopId) {

            return res.status(400).json({
                message: "Name, phone and shopId are required"
            });

        }


        // ==========================================
        // CHECK SHOP OWNERSHIP
        // ==========================================

        const shop = await Shop.findOne({
            _id: shopId,
            owner: req.user._id
        });


        if (!shop) {

            return res.status(404).json({
                message: "Shop not found or access denied"
            });

        }


        // ==========================================
        // CHECK EXISTING CUSTOMER
        // ==========================================

        const existingCustomer = await Customer.findOne({
            phone: phone.trim(),
            shop: shopId,
            owner: req.user._id
        });


        if (existingCustomer) {

            return res.status(400).json({
                message: "Customer with this phone number already exists"
            });

        }


        // ==========================================
        // CREATE CUSTOMER
        // ==========================================

        const customer = await Customer.create({

            name: name.trim(),

            phone: phone.trim(),

            email: email
                ? email.trim()
                : "",

            address: address
                ? address.trim()
                : "",

            shop: shopId,

            owner: req.user._id,

            totalPurchase: 0,

            totalTransactions: 0

        });


        // ==========================================
        // RESPONSE
        // ==========================================

        res.status(201).json({

            message: "Customer added successfully",

            customer

        });


    } catch (error) {

        console.error(
            "Create customer error:",
            error
        );


        res.status(500).json({

            message: "Failed to add customer",

            error: error.message

        });

    }

});


// =====================================================
// GET CUSTOMERS
// GET /api/customers?shopId=SHOP_ID
// =====================================================

router.get("/", protect, ownerOnly, async (req, res) => {

    try {

        const {
            shopId
        } = req.query;


        if (!shopId) {

            return res.status(400).json({

                message: "Shop ID is required"

            });

        }


        // ==========================================
        // CHECK SHOP OWNERSHIP
        // ==========================================

        const shop = await Shop.findOne({

            _id: shopId,

            owner: req.user._id

        });


        if (!shop) {

            return res.status(404).json({

                message: "Shop not found or access denied"

            });

        }


        // ==========================================
        // GET CUSTOMERS
        // ==========================================

        const customers = await Customer.find({

            shop: shopId,

            owner: req.user._id

        }).sort({

            createdAt: -1

        });


        res.json({

            count: customers.length,

            customers

        });


    } catch (error) {

        console.error(
            "Get customers error:",
            error
        );


        res.status(500).json({

            message: "Failed to fetch customers",

            error: error.message

        });

    }

});


// =====================================================
// GET SINGLE CUSTOMER
// GET /api/customers/:id
// =====================================================

router.get("/:id", protect, ownerOnly, async (req, res) => {

    try {

        const customer = await Customer.findOne({

            _id: req.params.id,

            owner: req.user._id

        });


        if (!customer) {

            return res.status(404).json({

                message: "Customer not found"

            });

        }


        res.json({

            customer

        });


    } catch (error) {

        console.error(
            "Get customer error:",
            error
        );


        res.status(500).json({

            message: "Failed to fetch customer",

            error: error.message

        });

    }

});


// =====================================================
// UPDATE CUSTOMER
// PUT /api/customers/:id
// =====================================================

router.put("/:id", protect, ownerOnly, async (req, res) => {

    try {

        const {
            name,
            phone,
            email,
            address
        } = req.body;


        // ==========================================
        // FIND CUSTOMER
        // ==========================================

        const customer = await Customer.findOne({

            _id: req.params.id,

            owner: req.user._id

        });


        if (!customer) {

            return res.status(404).json({

                message: "Customer not found"

            });

        }


        // ==========================================
        // UPDATE NAME
        // ==========================================

        if (name !== undefined) {

            if (!name.trim()) {

                return res.status(400).json({

                    message: "Customer name cannot be empty"

                });

            }

            customer.name = name.trim();

        }


        // ==========================================
        // UPDATE PHONE
        // ==========================================

        if (phone !== undefined) {

            if (!phone.trim()) {

                return res.status(400).json({

                    message: "Customer phone cannot be empty"

                });

            }


            const existingCustomer =
                await Customer.findOne({

                    phone: phone.trim(),

                    shop: customer.shop,

                    owner: req.user._id,

                    _id: {
                        $ne: customer._id
                    }

                });


            if (existingCustomer) {

                return res.status(400).json({

                    message:
                        "Another customer with this phone number already exists"

                });

            }


            customer.phone = phone.trim();

        }


        // ==========================================
        // UPDATE EMAIL
        // ==========================================

        if (email !== undefined) {

            customer.email =
                email.trim();

        }


        // ==========================================
        // UPDATE ADDRESS
        // ==========================================

        if (address !== undefined) {

            customer.address =
                address.trim();

        }


        // ==========================================
        // SAVE
        // ==========================================

        await customer.save();


        res.json({

            message:
                "Customer updated successfully",

            customer

        });


    } catch (error) {

        console.error(
            "Update customer error:",
            error
        );


        res.status(500).json({

            message:
                "Failed to update customer",

            error:
                error.message

        });

    }

});


// =====================================================
// DELETE CUSTOMER
// DELETE /api/customers/:id
// =====================================================

router.delete("/:id", protect, ownerOnly, async (req, res) => {

    try {

        const customer = await Customer.findOne({

            _id: req.params.id,

            owner: req.user._id

        });


        if (!customer) {

            return res.status(404).json({

                message: "Customer not found"

            });

        }


        await Customer.findByIdAndDelete(
            req.params.id
        );


        res.json({

            message:
                "Customer deleted successfully"

        });


    } catch (error) {

        console.error(
            "Delete customer error:",
            error
        );


        res.status(500).json({

            message:
                "Failed to delete customer",

            error:
                error.message

        });

    }

});


module.exports = router;