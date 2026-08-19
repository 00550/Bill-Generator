const mongoose = require("mongoose");


// =====================================================
// CUSTOMER SCHEMA
// =====================================================

const customerSchema = new mongoose.Schema(
    {

        // ==========================================
        // CUSTOMER NAME
        // ==========================================

        name: {
            type: String,
            required: true,
            trim: true
        },


        // ==========================================
        // PHONE
        // ==========================================

        phone: {
            type: String,
            required: true,
            trim: true
        },


        // ==========================================
        // EMAIL
        // ==========================================

        email: {
            type: String,
            trim: true,
            default: ""
        },


        // ==========================================
        // ADDRESS
        // ==========================================

        address: {
            type: String,
            trim: true,
            default: ""
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
        },


        // ==========================================
        // TOTAL PURCHASE
        // ==========================================

        totalPurchase: {
            type: Number,
            default: 0,
            min: 0
        },


        // ==========================================
        // TOTAL TRANSACTIONS
        // ==========================================

        totalTransactions: {
            type: Number,
            default: 0,
            min: 0
        }

    },

    {
        timestamps: true
    }
);


// =====================================================
// MODEL
// =====================================================

module.exports = mongoose.model(
    "Customer",
    customerSchema
);