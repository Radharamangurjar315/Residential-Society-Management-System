const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../keys');
const requiredLogin = require('../middlewares/requiredLogin');
const User = mongoose.model("User");
const Society = mongoose.model("Society");

const router = express.Router();

// ✅ Hash function for Society ID Generation
const generateSocietyId = (societyName) => {
    let hash = 0;
    for (let i = 0; i < societyName.length; i++) {
        hash = (hash << 5) - hash + societyName.charCodeAt(i);
        hash = hash & hash; // Convert to 32-bit integer
    }
    return "soc_" + Math.abs(hash).toString(36);
};

// ✅ Generate Society ID API
router.get('/societyId', (req, res) => {
    const { societyName } = req.query;

    if (!societyName) {
        return res.status(400).json({ error: "Please provide a society name" });
    }

    const societyId = generateSocietyId(societyName);
    res.json({ societyName, societyId });
});

// ✅ Protected Route Example
router.get('/protected', requiredLogin, (req, res) => {
    res.send("Hello Duniya");
});

// ✅ Get User Details
router.get("/getUser", requiredLogin, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ error: "User not found" });

        res.json({ user });
    } catch (error) {
        console.error("Get User Error:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// ✅ User Signup Route
router.post('/api/auth/signup', async (req, res) => {
    try {
        const { name, email, phone, password, role, societyName, address } = req.body;

        if (!name || !email || !phone || !password || !societyName || !address) {
            return res.status(422).json({ error: "Please fill in all required fields" });
        }

        // Generate Society ID
        const societyId = generateSocietyId(societyName);

        // Find or Create Society
        let society = await Society.findOne({ societyId });
        if (!society) {
            society = new Society({ name: societyName, address, societyId });
            await society.save();
        }

        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
        if (existingUser) {
            return res.status(400).json({ error: "User already registered in a society" });
        }

        // Hash password and create user
        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new User({ name, email, phone, password: hashedPassword, role, societyName, societyId: society._id, address });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });

    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post('/api/auth/signin', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(422).json({ error: "Please enter the email and password" });
        }

        const savedUser = await User.findOne({ email });
        if (!savedUser) {
            return res.status(422).json({ error: "Invalid email or password" });
        }

        const doMatch = await bcrypt.compare(password, savedUser.password);
        if (doMatch) {
            const token = jwt.sign(
                { _id: savedUser._id, societyId: savedUser.societyId },
                JWT_SECRET
            );
            const { _id, name, email, phone, role, societyId } = savedUser;
            res.json({ token, user: { _id, name, email, phone, role, societyId } });
        } else {
            return res.status(422).json({ error: "Invalid email or password" });
        }
    } catch (error) {
        console.error("Signin Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
