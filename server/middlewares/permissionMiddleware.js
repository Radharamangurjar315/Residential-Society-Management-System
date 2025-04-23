const permissionRole = (permissions) => {
    return (req, res, next) => {
        
        const userRole = req.user ? req.user.role : req.body.role; // Check if using authentication
       

        if (permissions.includes(userRole)) {
            next();
        } else {
            console.error("❌ Access denied. Insufficient permissions.");
            return res.status(403).json({ error: "Access denied. Insufficient permissions." });
        }
    };
};

module.exports = permissionRole;
