const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'resident', 'security', 'manager'],
        default: 'resident'
    },
    societyName: {
        type: String,
        required: true
    },
    // apartmentNumber: {
    //     type: String,
    //     trim: true
    // },
    // contactNumber: {
    //     type: String,
    //     trim: true
    // },
    // isActive: {
    //     type: Boolean,
    //     default: true
    // },
    // profilePicture: {
    //     type: String,
    //     default: ''
    // },
    registeredAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);