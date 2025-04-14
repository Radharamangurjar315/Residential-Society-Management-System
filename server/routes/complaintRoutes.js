const express = require("express");
const {
  fileComplaint,
  getComplaints,
  updateComplaint
} = require("../controllers/complaintController");
const requiredLogin = require("../middlewares/requiredLogin"); // Use this instead
const { verifyAdmin } = require("../middlewares/verifyAdmin");

const router = express.Router();

// 📌 Resident OR Admin can file a complaint
router.post("/file", requiredLogin(), fileComplaint);

// 📌 Get complaints (Resident sees own, Admin sees all)
router.get("/:societyId", requiredLogin(), getComplaints);

// 📌 Only Admin can update complaint
router.put("/update/:complaintId", verifyAdmin, updateComplaint);

module.exports = router;
