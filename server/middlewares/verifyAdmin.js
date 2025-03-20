const jwt = require("jsonwebtoken");
const User = require("../models/user"); // Import user model
const { JWT_SECRET } = require("../keys"); // Import JWT secret key

const verifyAdmin = async (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
  
      if (!token) {
        console.log("No token provided");
        return res.status(401).json({ message: "Unauthorized: No token provided" });
      }
  
    //   console.log("Received Token:", token);         receive token in console
  
      const decoded = jwt.verify(token, JWT_SECRET);
    //   console.log("Decoded JWT:", decoded);
  
      const user = await User.findById(decoded._id);
      if (!user) {
        console.log("User not found in database");
        return res.status(401).json({ message: "Unauthorized: User not found" });
      }
  
    //   console.log("User exists:", user);                returns user details in console
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