const mongoose = require("mongoose");

const mediaSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    public_id: { type: String, required: true }, // Cloudinary file identifier
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Admin who uploaded
    societyId: { type: mongoose.Schema.Types.ObjectId, ref: "Society", required: true }, // Society-specific media
  },
  { timestamps: true }
);

module.exports = mongoose.model("Media", mediaSchema);
