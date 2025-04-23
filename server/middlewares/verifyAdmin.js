const jwt = require("jsonwebtoken");
const User = require("../models/user"); // Import user model
const JWT_SECRET = process.env.JWT_SECRET;

const verifyAdmin = async (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
  
      if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
      }
  
  
      const decoded = jwt.verify(token, JWT_SECRET);
  
      const user = await User.findById(decoded._id);
      if (!user) {
        console.log("User not found in database");
        return res.status(401).json({ message: "Unauthorized: User not found" });
      }
  
      if (user.role !== "admin") {
        return res.status(403).json({ message: "Access denied. Admins only!" });
      }
  
      req.user = user;
      next();
    } catch (error) {
      console.error("JWT Verification Error:", error);
      res.status(401).json({ message: "Invalid Token" });
    }
  };
  
  module.exports = { verifyAdmin };