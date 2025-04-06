const express = require("express");
const { fileComplaint, getComplaints, updateComplaint } = require("../controllers/complaintController");
const  requiredLogin  = require("../middlewares/requiredLogin");
const { verifyAdmin } = require("../middlewares/verifyAdmin");

const router = express.Router();

// 📌 Resident files a complaint
router.post("/file",verifyAdmin, fileComplaint);

// 📌 Get all complaints (Residents see their own, Admins see society-wide)
router.get("/:societyId", verifyAdmin, getComplaints);

// 📌 Admin updates complaint status & response
router.put("/update/:complaintId", verifyAdmin, updateComplaint);

module.exports = router;