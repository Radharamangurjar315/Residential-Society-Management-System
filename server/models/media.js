const mongoose = require("mongoose");

const mediaSchema = new mongoose.Schema({
    url: { type: String, required: true },
    type: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Media", mediaSchema);
