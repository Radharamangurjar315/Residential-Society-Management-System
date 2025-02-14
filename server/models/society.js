const mongoose = require('mongoose');

const SocietySchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    societyId: { type: String, required: true, unique: true }, // Unique identifier
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Society', SocietySchema);
