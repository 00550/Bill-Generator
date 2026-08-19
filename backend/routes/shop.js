const express = require("express");

const Shop = require("../models/Shop");

const {
    protect,
    ownerOnly
} = require("../middleware/authMiddleware");

const router = express.Router();


// =====================================================
// ADD NEW SHOP
// POST /api/shop
// =====================================================

router.post("/", protect, ownerOnly, async (req, res) => {

    try {

        const {
            shopName,
            shopAddress,
            phone,
            email,
            gstNumber,

            accountName,
            accountNumber,
            bankName,
            ifscCode,

            upiId

        } = req.body;


        // ==============================================
        // VALIDATION
        // ==============================================

        if (!shopName || !shopAddress) {

            return res.status(400).json({

                message:
                    "Shop name and address are required"

            });

        }


        // ==============================================
        // CREATE SHOP
        // ==============================================

        const shop =
            await Shop.create({

                owner:
                    req.user._id,

                shopName:
                    shopName.trim(),

                shopAddress:
                    shopAddress.trim(),

                phone:
                    phone ? phone.trim() : "",

                email:
                    email ? email.trim() : "",

                gstNumber:
                    gstNumber
                        ? gstNumber.trim()
                        : "",


                // BANK DETAILS

                accountName:
                    accountName
                        ? accountName.trim()
                        : "",

                accountNumber:
                    accountNumber
                        ? accountNumber.trim()
                        : "",

                bankName:
                    bankName
                        ? bankName.trim()
                        : "",

                ifscCode:
                    ifscCode
                        ? ifscCode.trim().toUpperCase()
                        : "",


                // UPI

                upiId:
                    upiId
                        ? upiId.trim()
                        : ""

            });


        // ==============================================
        // RESPONSE
        // ==============================================

        return res.status(201).json({

            message:
                "Shop created successfully",

            shop

        });


    } catch (error) {

        console.error(
            "Create shop error:",
            error
        );


        return res.status(500).json({

            message:
                "Failed to create shop",

            error:
                error.message

        });

    }

});


// =====================================================
// GET ALL SHOPS
// GET /api/shop
// =====================================================

router.get("/", protect, ownerOnly, async (req, res) => {

    try {

        const shops =
            await Shop.find({

                owner:
                    req.user._id

            }).sort({

                createdAt: -1

            });


        return res.json({

            count:
                shops.length,

            shops

        });


    } catch (error) {

        console.error(
            "Get shops error:",
            error
        );


        return res.status(500).json({

            message:
                "Failed to fetch shops",

            error:
                error.message

        });

    }

});


// =====================================================
// GET SINGLE SHOP
// GET /api/shop/:id
// =====================================================

router.get("/:id", protect, ownerOnly, async (req, res) => {

    try {

        const shop =
            await Shop.findOne({

                _id:
                    req.params.id,

                owner:
                    req.user._id

            });


        if (!shop) {

            return res.status(404).json({

                message:
                    "Shop not found"

            });

        }


        return res.json({

            shop

        });


    } catch (error) {

        console.error(
            "Get single shop error:",
            error
        );


        return res.status(500).json({

            message:
                "Failed to fetch shop",

            error:
                error.message

        });

    }

});


// =====================================================
// UPDATE SHOP
// PUT /api/shop/:id
// =====================================================

router.put("/:id", protect, ownerOnly, async (req, res) => {

    try {

        const {
            shopName,
            shopAddress,
            phone,
            email,
            gstNumber,

            accountName,
            accountNumber,
            bankName,
            ifscCode,

            upiId,

            status

        } = req.body;


        const shop =
            await Shop.findOne({

                _id:
                    req.params.id,

                owner:
                    req.user._id

            });


        if (!shop) {

            return res.status(404).json({

                message:
                    "Shop not found"

            });

        }


        // ==============================================
        // UPDATE SHOP INFORMATION
        // ==============================================

        if (shopName !== undefined) {

            shop.shopName =
                shopName;

        }


        if (shopAddress !== undefined) {

            shop.shopAddress =
                shopAddress;

        }


        if (phone !== undefined) {

            shop.phone =
                phone;

        }


        if (email !== undefined) {

            shop.email =
                email;

        }


        if (gstNumber !== undefined) {

            shop.gstNumber =
                gstNumber;

        }


        // ==============================================
        // UPDATE BANK DETAILS
        // ==============================================

        if (accountName !== undefined) {

            shop.accountName =
                accountName;

        }


        if (accountNumber !== undefined) {

            shop.accountNumber =
                accountNumber;

        }


        if (bankName !== undefined) {

            shop.bankName =
                bankName;

        }


        if (ifscCode !== undefined) {

            shop.ifscCode =
                ifscCode;

        }


        // ==============================================
        // UPDATE UPI
        // ==============================================

        if (upiId !== undefined) {

            shop.upiId =
                upiId;

        }


        // ==============================================
        // UPDATE STATUS
        // ==============================================

        if (status !== undefined) {

            shop.status =
                status;

        }


        // ==============================================
        // VALIDATE
        // ==============================================

        if (
            !shop.shopName ||
            !shop.shopAddress
        ) {

            return res.status(400).json({

                message:
                    "Shop name and address are required"

            });

        }


        await shop.save();


        return res.json({

            message:
                "Shop updated successfully",

            shop

        });


    } catch (error) {

        console.error(
            "Update shop error:",
            error
        );


        return res.status(500).json({

            message:
                "Failed to update shop",

            error:
                error.message

        });

    }

});


// =====================================================
// DELETE SHOP
// DELETE /api/shop/:id
// =====================================================

router.delete("/:id", protect, ownerOnly, async (req, res) => {

    try {

        const shop =
            await Shop.findOne({

                _id:
                    req.params.id,

                owner:
                    req.user._id

            });


        if (!shop) {

            return res.status(404).json({

                message:
                    "Shop not found"

            });

        }


        await Shop.findByIdAndDelete(
            req.params.id
        );


        return res.json({

            message:
                "Shop deleted successfully"

        });


    } catch (error) {

        console.error(
            "Delete shop error:",
            error
        );


        return res.status(500).json({

            message:
                "Failed to delete shop",

            error:
                error.message

        });

    }

});


module.exports = router;