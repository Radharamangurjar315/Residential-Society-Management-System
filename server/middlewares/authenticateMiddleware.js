const jwt = require("jsonwebtoken");
const User = require("../models/user");
const JWT_SECRET  = process.env.JWT_SECRET;
const mongoose = require("mongoose");

const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(403).json({ error: "Invalid token" });
    }
  };

  module.exports = {authenticate};