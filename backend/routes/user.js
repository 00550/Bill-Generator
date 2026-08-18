const express = require("express");

const {
    protect,
    ownerOnly
} = require("../middleware/authMiddleware");

const router = express.Router();


// Any logged-in user
router.get("/profile", protect, (req, res) => {

    res.json({
        message: "Authenticated successfully",
        user: req.user
    });

});


// Owner only
router.get("/owner-dashboard", protect, ownerOnly, (req, res) => {

    res.json({
        message: "Welcome to Owner Dashboard",
        owner: req.user
    });

});


module.exports = router;