const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../keys");
const mongoose = require('mongoose');
const User = mongoose.model("User");

// Middleware for multi-role authentication
module.exports = (requiredRole) => {
    return (req, res, next) => {
        const { authorization } = req.headers;

        // Check if the authorization header is present
        if (!authorization) {
            return res.status(401).json({ error: "You must be logged in" });
        }

        const token = authorization.replace("Bearer ", "");

        jwt.verify(token, JWT_SECRET, async (err, payload) => {
            if (err) {
                return res.status(401).json({ error: "Invalid token. Please log in again." });
            }

            const { _id } = payload;

            try {
                const userdata = await User.findById(_id);
                
                if (!userdata) {
                    return res.status(404).json({ error: "User not found" });
                }

                // Check if the user's role matches the required role
                if (requiredRole && userdata.role !== requiredRole) {
                    return res.status(403).json({ error: "Access denied. Insufficient permissions." });
                }

                // Attach user data to the request object
                req.user = userdata;
                next();
            } catch (err) {
                console.error(err);
                res.status(500).json({ error: "Internal server error" });
            }
        });
    };
};