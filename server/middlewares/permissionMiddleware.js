const permissionRole = (permissions) => {
    return (req, res, next) => {
        console.log("🔍 Incoming Request Details:");
        console.log("Headers:", req.headers);
        console.log("Body:", req.body);
        console.log("Params:", req.params);
        console.log("Query:", req.query);

        const userRole = req.user ? req.user.role : req.body.role; // Check if using authentication
        console.log("Extracted User Role:", userRole); 

        if (permissions.includes(userRole)) {
            next();
        } else {
            console.error("❌ Access denied. Insufficient permissions.");
            return res.status(403).json({ error: "Access denied. Insufficient permissions." });
        }
    };
};

module.exports = permissionRole;
