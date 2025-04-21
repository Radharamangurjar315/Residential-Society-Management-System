const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env.JWT_SECRET;
const requiredLogin = require('../middlewares/requiredLogin');
const User = mongoose.model("User");
const Society = mongoose.model("Society");
// const Event = mongoose.model("Event");
require('dotenv').config();
const otpStore = {}; // { email: { otp, expiresAt } }
const nodemailer = require('nodemailer');

const router = express.Router();
// Create Nodemailer transporter using Gmail
const transporter = nodemailer.createTransport({
    service: 'gmail',  // You can replace this with other email services
    auth: {
        user: 'radharamangurjar4104@gmail.com', // Replace with your Gmail address
        pass: 'mjty qmxq gdqv tmkx', // Your Gmail app password (NOT regular Gmail password)
    },
});
const otpGenerator = require('otp-generator');

// Route to send OTP to email
router.post('/api/auth/send-otp', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(422).json({ error: "Please provide an email" });
    }

    const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, alphabets: false }); // Generate a 6-digit OTP
    const expiresAt = Date.now() + 5 * 60 * 1000; // OTP expires in 5 minutes

    // Store OTP with expiration time
    otpStore[email] = { otp, expiresAt };

    const mailOptions = {
        from: 'Societyy societyyoficial@gmail.com',  // Replace with your email
        to: email,
        subject: 'Your OTP Code',
        html: `<p>Your OTP is <strong>${otp}</strong>. It will expire in 5 minutes.</p>`,
    };

    try {
        await transporter.sendMail(mailOptions);  // Send OTP via email
        res.json({ message: 'OTP sent successfully' });
    } catch (err) {
        console.error('Error sending OTP email:', err);
        res.status(500).json({ error: 'Failed to send OTP' });
    }
});



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



// ✅ Get User Details
router.get("/getUser", requiredLogin, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ error: "User not found" });

        res.json({ user, societyName: user.societyName, flatNumber: user.flatNumber, address: user.address });
    } catch (error) {
        console.error("Get User Error:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// ✅ User Signup Route
router.post('/api/auth/signup', async (req, res) => {
    try {
        const { name, email, phone, password, role, societyName, flatNumber, address } = req.body;

        if (!name || !email || !phone || !password || !societyName || !flatNumber || !address) {
            return res.status(422).json({ error: "Please fill in all required fields" });
        }

        // Generate Society ID
        const societyId = generateSocietyId(societyName);

        // Find or Create Society
        let society = await Society.findOne({ societyId });
        if (!society) {
            society = new Society({ name: societyName, flatNumber, address, societyId });
            await society.save();
        }

        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
        if (existingUser) {
            return res.status(400).json({ error: "User already registered in a society" });
        }

        // Hash password and create user
        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new User({ name, email, phone, password: hashedPassword, role, societyName, flatNumber, societyId: society._id, address });
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
            const { _id, name, email, phone, role, societyId, societyName, flatNumber, address } = savedUser;
            res.json({ token, user: { _id, name, email, phone, role, societyId, societyName, flatNumber, address } });
        } else {
            return res.status(422).json({ error: "Invalid email or password" });
        }
    } catch (error) {
        console.error("Signin Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


// Route to verify OTP
router.post('/api/auth/verify-otp', (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(422).json({ error: "Please provide both email and OTP" });
    }

    const storedData = otpStore[email];

    if (!storedData) {
        return res.status(400).json({ error: "No OTP request found for this email" });
    }

    const { otp: storedOtp, expiresAt } = storedData;

    if (Date.now() > expiresAt) {
        delete otpStore[email];
        return res.status(400).json({ error: "OTP expired. Please request a new one." });
    }

    if (otp !== storedOtp) {
        return res.status(400).json({ error: "Invalid OTP. Please try again." });
    }

    // OTP is valid
    delete otpStore[email]; // Optional: Remove OTP after successful verification

    res.json({ message: "OTP verified successfully" });
});


// Reset password after OTP verification
router.post('/api/auth/reset-password', async (req, res) => {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
        return res.status(422).json({ error: "Please provide email, OTP, and new password" });
    }

    const storedData = otpStore[email];

    if (!storedData) {
        return res.status(400).json({ error: "No OTP request found for this email" });
    }

    const { otp: storedOtp, expiresAt } = storedData;

    if (Date.now() > expiresAt) {
        delete otpStore[email];
        return res.status(400).json({ error: "OTP expired. Please request again." });
    }

    if (otp !== storedOtp) {
        return res.status(400).json({ error: "Invalid OTP" });
    }

    try {
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        const updatedUser = await User.findOneAndUpdate(
            { email },
            { password: hashedPassword },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        delete otpStore[email]; // remove OTP after successful reset

        res.json({ message: "Password reset successfully" });
    } catch (err) {
        console.error("Reset Password Error:", err);
        res.status(500).json({ error: "Server error while resetting password" });
    }
});


module.exports = router;
