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
        trim: true,
        match: [/.+\@.+\..+/, "Please enter a valid email address"]
    },
    phone: { 
        type: String, required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'resident', 'guard'],
    },
    societyName: {
        type: String,
        required: true
    },
    societyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Society', required: true }, // Link to society
    registeredAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

userSchema.index({ email: 1, societyId: 1 }, { unique: true }); // Unique email per society
userSchema.index({ phone: 1, societyId: 1 }, { unique: true }); // Unique phone per society


const User = mongoose.model("User", userSchema);

module.exports = User;