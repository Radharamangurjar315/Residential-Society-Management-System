const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../keys");
const User = require("../models/user");

// Middleware for authentication
module.exports = (requiredRole) => {
    return async (req, res, next) => {
        try {
            const { authorization } = req.headers;

            if (!authorization) {
                return res.status(401).json({ 
                    error: "Authorization header is required" 
                });
            }

            const token = authorization.replace("Bearer ", "");

            const decoded = jwt.verify(token, JWT_SECRET);
            const user = await User.findById(decoded._id).select('-password');

            if (!user) {
                return res.status(401).json({ 
                    error: "User not found" 
                });
            }

            if (requiredRole && user.role !== requiredRole) {
                return res.status(403).json({ 
                    error: "Insufficient permissions" 
                });
            }

            req.user = user;
            next();
        } catch (error) {
            console.error("Authentication error:", error);
            return res.status(401).json({ 
                error: "Invalid or expired token" 
            });
        }
    };
};