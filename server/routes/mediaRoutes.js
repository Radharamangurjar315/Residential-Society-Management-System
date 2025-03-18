const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const Media = require("../models/media");

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer Storage (Buffer Storage for Direct Upload to Cloudinary)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload Media
router.post("/upload", upload.single("file"), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "No file uploaded" });

        cloudinary.uploader.upload_stream(
            { resource_type: "auto" },
            async (error, result) => {
                if (error) return res.status(500).json({ error });

                const media = new Media({
                    url:"cloudinary://616267911111457:g4ytaTCgwzXU7i4PCSgBe85BUiU@raman-scloud",
                    type: req.file.mimetype,
                });

                await media.save();
                res.status(201).json(media);
            }
        ).end(req.file.buffer);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Fetch All Media
router.get("/", async (req, res) => {
    try {
        const media = await Media.find().sort({ createdAt: -1 });
        res.json(media);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
