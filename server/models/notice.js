const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    societyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Society', required: true },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdAt: { type: Date, default: Date.now },
    date: {
        type: Date,
        required: true,
    }
}, { timestamps: true });

module.exports = mongoose.model('Notice', noticeSchema);
