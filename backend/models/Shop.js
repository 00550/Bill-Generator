const mongoose = require("mongoose");

const shopSchema = new mongoose.Schema(
    {
        // ========================================
        // OWNER
        // ========================================

        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },


        // ========================================
        // SHOP INFORMATION
        // ========================================

        shopName: {
            type: String,
            required: true,
            trim: true
        },

        shopAddress: {
            type: String,
            required: true,
            trim: true
        },

        phone: {
            type: String,
            trim: true
        },

        email: {
            type: String,
            trim: true
        },

        gstNumber: {
            type: String,
            trim: true
        },


        // ========================================
        // BANK DETAILS
        // ========================================

        accountName: {
            type: String,
            trim: true
        },

        accountNumber: {
            type: String,
            trim: true
        },

        bankName: {
            type: String,
            trim: true
        },

        ifscCode: {
            type: String,
            trim: true
        },


        // ========================================
        // UPI PAYMENT
        // ========================================

        upiId: {
            type: String,
            trim: true
        },


        // ========================================
        // SHOP STATUS
        // ========================================

        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active"
        }
    },

    {
        timestamps: true
    }
);


module.exports =
    mongoose.model("Shop", shopSchema);