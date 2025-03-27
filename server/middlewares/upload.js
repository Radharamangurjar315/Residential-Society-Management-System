const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "society_media",
    allowed_formats: ["jpg", "png", "mp4", "jpeg", "gif"],
  },
});

const upload = multer({ storage });

module.exports = upload;
