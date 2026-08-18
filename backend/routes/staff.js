const express = require("express");
const bcrypt = require("bcryptjs");

const Staff = require("../models/Staff");
const Shop = require("../models/Shop");

const {
    protect,
    ownerOnly
} = require("../middleware/authMiddleware");

const router = express.Router();


// ======================================
// CREATE STAFF
// ======================================

router.post("/", protect, ownerOnly, async (req, res) => {
    try {

        const {
            name,
            email,
            phone,
            password,
            shopId
        } = req.body;

        if (!name || !email || !phone || !password || !shopId) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        // Check shop
        const shop = await Shop.findOne({
            _id: shopId,
            ownerId: req.user._id
        });

        if (!shop) {
            return res.status(404).json({
                message: "Shop not found or unauthorized"
            });
        }

        // Check existing staff
        const existingStaff = await Staff.findOne({
            email
        });

        if (existingStaff) {
            return res.status(400).json({
                message: "Staff email already exists"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const staff = await Staff.create({
            name,
            email,
            phone,
            password: hashedPassword,
            ownerId: req.user._id,
            shopId
        });

        res.status(201).json({
            message: "Staff account created successfully",
            staff: {
                id: staff._id,
                name: staff.name,
                email: staff.email,
                phone: staff.phone,
                role: staff.role,
                shopId: staff.shopId
            }
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


// ======================================
// GET OWNER'S STAFF
// ======================================

router.get("/", protect, ownerOnly, async (req, res) => {

    try {

        const staff = await Staff.find({
            ownerId: req.user._id
        })
        .select("-password")
        .populate("shopId", "shopName");

        res.json({
            count: staff.length,
            staff
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


module.exports = router;