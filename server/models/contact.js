const mongoose = require("mongoose");


const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  designation: { type: String, required: true }, // Who they are
  phone: { type: String, required: true },
  societyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Society', required: true },
}, { timestamps: true });

module.exports = mongoose.model("Contact", contactSchema);
