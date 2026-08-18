const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const shopRoutes = require("./routes/shop");
const staffRoutes = require("./routes/staff");

const app = express();


// ========================================
// DATABASE
// ========================================

connectDB();


// ========================================
// MIDDLEWARE
// ========================================

app.use(cors());
app.use(express.json());


// ========================================
// BASIC ROUTE
// ========================================

app.get("/", (req, res) => {

    res.json({
        message: "Billing Desk Backend is running"
    });

});


// ========================================
// API ROUTES
// ========================================

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/shop", shopRoutes);
app.use("/api/staff", staffRoutes);


// ========================================
// SERVER
// ========================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log(
        `Server running on http://localhost:${PORT}`
    );

});