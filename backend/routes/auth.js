const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const router = express.Router();


// ========================================
// TEST AUTH ROUTE
// ========================================

router.get("/test", (req, res) => {

    res.json({
        message: "Auth route is working"
    });

});

// =====================================================
// REGISTER OWNER
// POST /api/auth/register
// =====================================================

router.post("/register", async (req, res) => {

    try {

        const {
            name,
            email,
            phone,
            password
        } = req.body;


        // ==========================================
        // VALIDATION
        // ==========================================

        if (!name || !email || !password) {

            return res.status(400).json({
                message: "Name, email and password are required"
            });

        }


        const trimmedName = name.trim();
        const normalizedEmail = email.trim().toLowerCase();
        const trimmedPhone = phone
            ? phone.trim()
            : "";


        if (!trimmedName) {

            return res.status(400).json({
                message: "Name cannot be empty"
            });

        }


        if (!normalizedEmail) {

            return res.status(400).json({
                message: "Email cannot be empty"
            });

        }


        if (password.length < 6) {

            return res.status(400).json({
                message: "Password must be at least 6 characters"
            });

        }


        // ==========================================
        // CHECK EMAIL
        // ==========================================

        const existingUser = await User.findOne({
            email: normalizedEmail
        });


        if (existingUser) {

            return res.status(400).json({
                message: "Email already registered"
            });

        }


        // ==========================================
        // HASH PASSWORD
        // ==========================================

        const hashedPassword =
            await bcrypt.hash(password, 10);


        // ==========================================
        // CREATE USER
        // ==========================================

        const user = await User.create({

            name: trimmedName,

            email: normalizedEmail,

            phone: trimmedPhone,

            password: hashedPassword,

            role: "owner",

            status: "active"

        });


        // ==========================================
        // RESPONSE
        // ==========================================

        return res.status(201).json({

            message:
                "Owner account created successfully",

            user: {

                id: user._id,

                name: user.name,

                email: user.email,

                phone: user.phone,

                role: user.role

            }

        });


    } catch (error) {

        console.error(
            "Registration error:",
            error
        );


        // ==========================================
        // DUPLICATE EMAIL
        // ==========================================

        if (error.code === 11000) {

            return res.status(400).json({

                message:
                    "Email already registered"

            });

        }


        // ==========================================
        // MONGOOSE VALIDATION ERROR
        // ==========================================

        if (error.name === "ValidationError") {

            const messages =
                Object.values(error.errors)
                    .map(err => err.message);


            return res.status(400).json({

                message:
                    messages.join(", ")

            });

        }


        // ==========================================
        // SERVER ERROR
        // ==========================================

        return res.status(500).json({

            message:
                "Failed to create account",

            error:
                error.message

        });

    }

});


// =====================================================
// LOGIN
// POST /api/auth/login
// =====================================================

router.post("/login", async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;


        // ==========================================
        // VALIDATION
        // ==========================================

        if (!email || !password) {

            return res.status(400).json({

                message:
                    "Email and password are required"

            });

        }


        const normalizedEmail =
            email.trim().toLowerCase();


        // ==========================================
        // FIND USER
        // ==========================================

        const user =
            await User.findOne({

                email:
                    normalizedEmail

            });


        if (!user) {

            return res.status(401).json({

                message:
                    "Invalid email or password"

            });

        }


        // ==========================================
        // CHECK STATUS
        // ==========================================

        if (user.status !== "active") {

            return res.status(403).json({

                message:
                    "Account is inactive"

            });

        }


        // ==========================================
        // CHECK PASSWORD
        // ==========================================

        const passwordMatch =
            await bcrypt.compare(
                password,
                user.password
            );


        if (!passwordMatch) {

            return res.status(401).json({

                message:
                    "Invalid email or password"

            });

        }


        // ==========================================
        // JWT SECRET CHECK
        // ==========================================

        if (!process.env.JWT_SECRET) {

            console.error(
                "JWT_SECRET is missing from .env"
            );

            return res.status(500).json({

                message:
                    "JWT configuration is missing"

            });

        }


        // ==========================================
        // CREATE TOKEN
        // ==========================================

        const token =
            jwt.sign(

                {
                    userId:
                        user._id,

                    role:
                        user.role
                },

                process.env.JWT_SECRET,

                {
                    expiresIn:
                        "7d"
                }

            );


        // ==========================================
        // RESPONSE
        // ==========================================

        return res.json({

            message:
                "Login successful",

            token,

            user: {

                id:
                    user._id,

                name:
                    user.name,

                email:
                    user.email,

                phone:
                    user.phone,

                role:
                    user.role

            }

        });


    } catch (error) {

        console.error(
            "Login error:",
            error
        );


        return res.status(500).json({

            message:
                "Failed to login",

            error:
                error.message

        });

    }

});


module.exports = router;