const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        shop: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Shop",
            required: true
        },

        customerName: {
            type: String,
            default: "Walk-in Customer",
            trim: true
        },

        customerPhone: {
            type: String,
            trim: true
        },

        items: [
            {
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

        subtotal: {
            type: Number,
            required: true,
            min: 0
        },

        discount: {
            type: Number,
            default: 0,
            min: 0
        },

        gst: {
            type: Number,
            default: 0,
            min: 0
        },

        total: {
            type: Number,
            required: true,
            min: 0
        },

        paymentMethod: {
            type: String,
            enum: ["cash", "upi", "card", "credit"],
            default: "cash"
        }
    },
    {
        timestamps: true
    }
);

module.exports =
    mongoose.model("Transaction", transactionSchema);