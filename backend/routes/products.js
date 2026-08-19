const express = require("express");

const Product = require("../models/Product");
const Shop = require("../models/Shop");

const {
    protect,
    ownerOnly
} = require("../middleware/authMiddleware");

const router = express.Router();


// =====================================================
// CREATE PRODUCT
// POST /api/products
// =====================================================

router.post("/", protect, ownerOnly, async (req, res) => {

    try {

        const {
            name,
            category,
            price,
            stock,
            shopId
        } = req.body;


        // ==========================================
        // VALIDATION
        // ==========================================

        if (!name || !shopId) {

            return res.status(400).json({
                message: "Product name and shop ID are required"
            });

        }


        const productPrice = Number(price);
        const productStock = Number(stock);


        if (
            Number.isNaN(productPrice) ||
            productPrice < 0
        ) {

            return res.status(400).json({
                message: "Invalid product price"
            });

        }


        if (
            Number.isNaN(productStock) ||
            productStock < 0
        ) {

            return res.status(400).json({
                message: "Invalid stock quantity"
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
        // CHECK DUPLICATE PRODUCT
        // ==========================================

        const existingProduct =
            await Product.findOne({
                name: name.trim(),
                shop: shopId
            });


        if (existingProduct) {

            return res.status(400).json({
                message: "Product already exists in this shop"
            });

        }


        // ==========================================
        // CREATE PRODUCT
        // ==========================================

        const product =
            await Product.create({

                name:
                    name.trim(),

                category:
                    category
                        ? category.trim()
                        : "",

                price:
                    Number(
                        productPrice.toFixed(2)
                    ),

                stock:
                    productStock,

                shop:
                    shopId,

                owner:
                    req.user._id

            });


        // ==========================================
        // RESPONSE
        // ==========================================

        res.status(201).json({

            message:
                "Product added successfully",

            product

        });


    } catch (error) {

        console.error(
            "Create product error:",
            error
        );


        res.status(500).json({

            message:
                "Failed to create product",

            error:
                error.message

        });

    }

});


// =====================================================
// GET SHOP PRODUCTS
// GET /api/products?shopId=SHOP_ID
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


        // ==========================================
        // CHECK SHOP OWNERSHIP
        // ==========================================

        const shop =
            await Shop.findOne({

                _id:
                    shopId,

                owner:
                    req.user._id

            });


        if (!shop) {

            return res.status(404).json({

                message:
                    "Shop not found or access denied"

            });

        }


        // ==========================================
        // GET PRODUCTS
        // ==========================================

        const products =
            await Product.find({

                shop:
                    shopId,

                owner:
                    req.user._id

            }).sort({

                createdAt:
                    -1

            });


        res.json({

            count:
                products.length,

            products

        });


    } catch (error) {

        console.error(
            "Get products error:",
            error
        );


        res.status(500).json({

            message:
                "Failed to fetch products",

            error:
                error.message

        });

    }

});


// =====================================================
// UPDATE PRODUCT
// PUT /api/products/:id
// =====================================================

router.put(
    "/:id",
    protect,
    ownerOnly,
    async (req, res) => {

        try {

            const {
                name,
                category,
                price,
                stock,
                shopId
            } = req.body;


            // ==========================================
            // FIND PRODUCT
            // ==========================================

            const product =
                await Product.findOne({

                    _id:
                        req.params.id,

                    owner:
                        req.user._id

                });


            if (!product) {

                return res.status(404).json({

                    message:
                        "Product not found"

                });

            }


            // ==========================================
            // CHECK SHOP
            // ==========================================

            if (shopId) {

                const shop =
                    await Shop.findOne({

                        _id:
                            shopId,

                        owner:
                            req.user._id

                    });


                if (!shop) {

                    return res.status(404).json({

                        message:
                            "Shop not found or access denied"

                    });

                }


                product.shop =
                    shopId;

            }


            // ==========================================
            // UPDATE NAME
            // ==========================================

            if (name !== undefined) {

                if (!name.trim()) {

                    return res.status(400).json({

                        message:
                            "Product name cannot be empty"

                    });

                }

                product.name =
                    name.trim();

            }


            // ==========================================
            // UPDATE CATEGORY
            // ==========================================

            if (category !== undefined) {

                product.category =
                    category.trim();

            }


            // ==========================================
            // UPDATE PRICE
            // ==========================================

            if (price !== undefined) {

                const productPrice =
                    Number(price);


                if (
                    Number.isNaN(productPrice) ||
                    productPrice < 0
                ) {

                    return res.status(400).json({

                        message:
                            "Invalid product price"

                    });

                }


                product.price =
                    Number(
                        productPrice.toFixed(2)
                    );

            }


            // ==========================================
            // UPDATE STOCK
            // ==========================================

            if (stock !== undefined) {

                const productStock =
                    Number(stock);


                if (
                    Number.isNaN(productStock) ||
                    productStock < 0
                ) {

                    return res.status(400).json({

                        message:
                            "Invalid stock quantity"

                    });

                }


                product.stock =
                    productStock;

            }


            // ==========================================
            // SAVE
            // ==========================================

            await product.save();


            res.json({

                message:
                    "Product updated successfully",

                product

            });


        } catch (error) {

            console.error(
                "Update product error:",
                error
            );


            res.status(500).json({

                message:
                    "Failed to update product",

                error:
                    error.message

            });

        }

    }
);


// =====================================================
// DELETE PRODUCT
// DELETE /api/products/:id
// =====================================================

router.delete(
    "/:id",
    protect,
    ownerOnly,
    async (req, res) => {

        try {

            const product =
                await Product.findOne({

                    _id:
                        req.params.id,

                    owner:
                        req.user._id

                });


            if (!product) {

                return res.status(404).json({

                    message:
                        "Product not found"

                });

            }


            await Product.findByIdAndDelete(
                req.params.id
            );


            res.json({

                message:
                    "Product deleted successfully"

            });


        } catch (error) {

            console.error(
                "Delete product error:",
                error
            );


            res.status(500).json({

                message:
                    "Failed to delete product",

                error:
                    error.message

            });

        }

    }
);


module.exports = router;