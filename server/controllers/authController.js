// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const User = require('../models/society.js');

// class AuthController {
//     // User Registration
//     static async register(req, res) {
//         try {
//             const { 
//                 name, 
//                 email, 
//                 password, 
//                 societyName, 
//                 apartmentNumber, 
//                 contactNumber,
//                 role 
//             } = req.body;

//             // Check if user already exists
//             const existingUser = await User.findOne({ email });
//             if (existingUser) {
//                 return res.status(400).json({ 
//                     error: 'User with this email already exists.' 
//                 });
//             }

//             // Hash password
//             const salt = await bcrypt.genSalt(10);
//             const hashedPassword = await bcrypt.hash(password, salt);

//             // Create new user
//             const newUser = new User({
//                 name,
//                 email,
//                 password: hashedPassword,
//                 societyName,
//                 apartmentNumber,
//                 contactNumber,
//                 role: role || 'resident'
//             });

//             await newUser.save();

//             // Generate JWT token
//             const token = jwt.sign(
//                 { userId: newUser._id, role: newUser.role }, 
//                 process.env.JWT_SECRET, 
//                 { expiresIn: '7d' }
//             );

//             res.status(201).json({ 
//                 message: 'User registered successfully',
//                 token,
//                 user: {
//                     id: newUser._id,
//                     name: newUser.name,
//                     email: newUser.email,
//                     role: newUser.role
//                 }
//             });
//         } catch (error) {
//             res.status(500).json({ 
//                 error: 'Registration failed', 
//                 details: error.message 
//             });
//         }
//     }

//     // User Login
//     static async login(req, res) {
//         try {
//             const { email, password } = req.body;

//             // Find user by email
//             const user = await User.findOne({ email });
//             if (!user) {
//                 return res.status(401).json({ 
//                     error: 'Invalid login credentials.' 
//                 });
//             }

//             // Check password
//             const isMatch = await bcrypt.compare(password, user.password);
//             if (!isMatch) {
//                 return res.status(401).json({ 
//                     error: 'Invalid login credentials.' 
//                 });
//             }

//             // Check if user is active
//             if (!user.isActive) {
//                 return res.status(403).json({ 
//                     error: 'User account is inactive.' 
//                 });
//             }

//             // Generate JWT token
//             const token = jwt.sign(
//                 { userId: user._id, role: user.role }, 
//                 process.env.JWT_SECRET, 
//                 { expiresIn: '7d' }
//             );

//             res.json({ 
//                 message: 'Login successful',
//                 token,
//                 user: {
//                     id: user._id,
//                     name: user.name,
//                     email: user.email,
//                     role: user.role,
//                     societyName: user.societyName
//                 }
//             });
//         } catch (error) {
//             res.status(500).json({ 
//                 error: 'Login failed', 
//                 details: error.message 
//             });
//         }
//     }

//     // Get User Profile
//     static async getUserProfile(req, res) {
//         try {
//             // req.user is attached by the auth middleware
//             const user = await User.findById(req.user._id)
//                 .select('-password') // Exclude password from response
//                 .lean(); // Convert to plain JavaScript object

//             if (!user) {
//                 return res.status(404).json({ 
//                     error: 'User not found.' 
//                 });
//             }

//             res.json({ user });
//         } catch (error) {
//             res.status(500).json({ 
//                 error: 'Failed to retrieve profile', 
//                 details: error.message 
//             });
//         }
//     }
// }

// module.exports = AuthController;