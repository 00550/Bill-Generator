const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Authentication required"
            });
        }

        const token = authHeader.split(" ")[1];

        // Verify token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Find user
        const user = await User.findById(decoded.userId)
            .select("-password");

        if (!user) {
            return res.status(401).json({
                message: "User not found"
            });
        }

        if (user.status !== "active") {
            return res.status(403).json({
                message: "Account is inactive"
            });
        }

        // Attach user to request
        req.user = user;

        next();

    } catch (error) {
        console.error("Authentication error:", error.message);

        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
};


// Owner-only middleware
const ownerOnly = (req, res, next) => {

    if (req.user.role !== "owner") {
        return res.status(403).json({
            message: "Owner access required"
        });
    }

    next();
};


// Staff-only middleware
const staffOnly = (req, res, next) => {

    if (req.user.role !== "staff") {
        return res.status(403).json({
            message: "Staff access required"
        });
    }

    next();
};


module.exports = {
    protect,
    ownerOnly,
    staffOnly
};