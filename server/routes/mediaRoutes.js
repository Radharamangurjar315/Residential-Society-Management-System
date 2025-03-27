const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const Media = require("../models/media");
const cloudinary = require("../config/cloudinary");
const { verifyAdmin } = require("../middlewares/verifyAdmin");

// **1. Upload Media (Admin only)**
router.post("/upload", verifyAdmin, upload.single("file"), async (req, res) => {
  try {
    const newMedia = new Media({
      url: req.file.path,
      public_id: req.file.filename,
      uploadedBy: req.user.id,
      societyId: req.user.societyId, // Ensure the user has a societyId
    });
    await newMedia.save();
    res.status(201).json({ success: true, media: newMedia });
  } catch (error) {
    res.status(500).json({ success: false, message: "Upload failed", error });
  }
});

// **2. Get All Media for a Society (Residents & Admins)**
router.get("/mediagallery/:societyId", async (req, res) => {
  try {
    const media = await Media.find({ societyId: req.params.societyId });
    res.status(200).json({ success: true, media });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching media", error });
  }
});

// **3. Delete Media (Admin only)**
router.delete("/:id", verifyAdmin, async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) return res.status(404).json({ success: false, message: "Media not found" });

    await cloudinary.uploader.destroy(media.public_id); // Delete from Cloudinary
    await media.deleteOne(); // Delete from DB

    res.status(200).json({ success: true, message: "Media deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting media", error });
  }
});

module.exports = router;
