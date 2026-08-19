const mongoose = require("mongoose");


// =====================================================
// TRANSACTION SCHEMA
// =====================================================

const transactionSchema = new mongoose.Schema(
    {

        // ==========================================
        // OWNER
        // ==========================================

        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
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
        // CUSTOMER
        // ==========================================

        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
            default: null
        },

        customerName: {
            type: String,
            default: "Walk-in Customer",
            trim: true
        },

        customerPhone: {
            type: String,
            trim: true,
            default: ""
        },


        // ==========================================
        // BILL ITEMS
        // ==========================================

        items: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true
                },

                productName: {
                    type: String,
                    required: true,
                    trim: true
                },

                quantity: {
                    type: Number,
                    required: true,
                    min: 1
                },

                price: {
                    type: Number,
                    required: true,
                    min: 0
                },

                total: {
                    type: Number,
                    required: true,
                    min: 0
                }
            }
        ],


        // ==========================================
        // BILL CALCULATION
        // ==========================================

        subtotal: {
            type: Number,
            required: true,
            min: 0
        },

        discount: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        },


        // ==========================================
        // GST
        // ==========================================

        gstRate: {
            type: Number,
            default: 0,
            min: 0
        },


        // ==========================================
        // CGST
        // ==========================================

        cgstRate: {
            type: Number,
            default: 0,
            min: 0
        },

        cgstAmount: {
            type: Number,
            default: 0,
            min: 0
        },


        // ==========================================
        // SGST
        // ==========================================

        sgstRate: {
            type: Number,
            default: 0,
            min: 0
        },

        sgstAmount: {
            type: Number,
            default: 0,
            min: 0
        },


        // ==========================================
        // IGST
        // ==========================================

        igstRate: {
            type: Number,
            default: 0,
            min: 0
        },

        igstAmount: {
            type: Number,
            default: 0,
            min: 0
        },


        // ==========================================
        // TOTAL GST
        // ==========================================

        gst: {
            type: Number,
            default: 0,
            min: 0
        },


        // ==========================================
        // FINAL TOTAL
        // ==========================================

        total: {
            type: Number,
            required: true,
            min: 0
        },


        // ==========================================
        // PAYMENT
        // ==========================================

        paymentMethod: {
            type: String,
            enum: [
                "cash",
                "upi",
                "card",
                "credit"
            ],
            default: "cash"
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
    "Transaction",
    transactionSchema
);