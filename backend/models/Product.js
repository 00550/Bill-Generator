const mongoose = require("mongoose");


// =====================================================
// PRODUCT SCHEMA
// =====================================================

const productSchema = new mongoose.Schema(
    {

        // ==========================================
        // PRODUCT NAME
        // ==========================================

        name: {
            type: String,
            required: true,
            trim: true
        },


        // ==========================================
        // CATEGORY
        // ==========================================

        category: {
            type: String,
            trim: true,
            default: ""
        },


        // ==========================================
        // PRICE
        // ==========================================

        price: {
            type: Number,
            required: true,
            min: 0
        },


        // ==========================================
        // STOCK
        // ==========================================

        stock: {
            type: Number,
            required: true,
            min: 0,
            default: 0
        },


        // ==========================================
        // SHOP
        // ==========================================

        shop: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Shop",
            required: true
        },


        // ==========================================
        // OWNER
        // ==========================================

        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }

    },

    {
        timestamps: true
    }
);


// =====================================================
// MODEL
// =====================================================

module.exports =
    mongoose.model(
        "Product",
        productSchema
    );