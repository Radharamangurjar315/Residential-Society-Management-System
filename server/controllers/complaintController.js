const mongoose = require("mongoose");
const requiredLogin = require("../middlewares/requiredLogin");
const Complaint = require("../models/complaint");


// 📌 Resident files a complaint
const fileComplaint = async (req, res) => {
  try {
    const start = performance.now();

    const { title, description, attachments } = req.body;

    if (!title || !description) {
      return res.status(400).json({ success: false, message: "Title and description are required!" });
    }

    const complaint = new Complaint({
      societyId: req.user.societyId,
      residentId: req.user.id,
      title,
      description,
      attachments
    });

    const saveStart = performance.now();
    await complaint.save();
    const saveEnd = performance.now();

    const end = performance.now();

    res.status(201).json({ success: true, message: "Complaint filed successfully!", complaint });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};


// 📌 Get complaints (Residents see their complaints, Admins see all in their society)
const getComplaints = async (req, res) => {
  try {
    let filter = { societyId: req.user.societyId };

    if (req.user.role === "resident") {
      filter.residentId = req.user.id; // Residents can only see their own complaints
    }

    // Use find() with your filter and populate correctly
    const complaints = await Complaint.find(filter)
      .populate("residentId", "name email")
      .sort({ createdAt: -1 });
    
    res.status(200).json({ success: true, complaints });
  } catch (error) {
    console.error("❌ Server Error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
}; 

// 📌 Admin updates complaint status & response
const updateComplaint = async (req, res) => {
  try {
    const { status, adminResponse } = req.body;

    const updatedComplaint = await Complaint.findByIdAndUpdate(
      req.params.complaintId,
      { status, adminResponse, updatedAt: Date.now() },
      { new: true }
    );

    if (!updatedComplaint) {
      return res.status(404).json({ success: false, message: "Complaint not found!" });
    }

    res.status(200).json({ success: true, message: "Complaint updated successfully!", updatedComplaint });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

module.exports = { fileComplaint, getComplaints, updateComplaint };