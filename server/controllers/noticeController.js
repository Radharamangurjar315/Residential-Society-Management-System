const mongoose = require("mongoose");
const Notice = require("../models/notice");

// ✅ Fetch notices by societyId (accessible to all users)
const getNotices = async (req, res) => {
    try {
      const { societyId } = req.query; // Ensure societyId is extracted from req.query
  
      // Validate societyId
      if (!societyId || !mongoose.Types.ObjectId.isValid(societyId)) {
        return res.status(400).json({ error: "Invalid society ID format" });
      }
  
  
      // Fetch notices sorted by latest date
      const notices = await Notice.find({ societyId }).sort({ date: -1 });
  
      if (notices.length === 0) {
        return res.status(404).json({ message: "No notices found for this society" });
      }
  
      res.json(notices);
    } catch (error) {
      console.error("❌ Error fetching notices:", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

// ✅ Add a new notice (Only for Admins)
const addNotice = async (req, res) => {
    try {
        const { title, content, societyId } = req.body;

        if (!title || !content || !societyId) {
            return res.status(400).json({ message: "Title, content, and societyId are required" });
        }

        if (!mongoose.Types.ObjectId.isValid(societyId)) {
            return res.status(400).json({ message: "Invalid society ID" });
        }

        const newNotice = new Notice({
            title,
            content,
            societyId,
            date: Date.now(),
        });

        const savedNotice = await newNotice.save();

        res.status(201).json(savedNotice);
    } catch (error) {
        console.error("❌ Error adding notice:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// ✅ Update a notice (Only for Admins)
const updateNotice = async (req, res) => {
    const { id } = req.params;
    const { title, content, date } = req.body;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid notice ID" });
        }

        const updatedNotice = await Notice.findByIdAndUpdate(
            id,
            { title, content, date },
            { new: true }
        );

        if (!updatedNotice) {
            return res.status(404).json({ message: "Notice not found" });
        }

        res.json(updatedNotice);
    } catch (error) {
        console.error("❌ Error updating notice:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// ✅ Delete a notice (Only for Admins)
const deleteNotice = async (req, res) => {
    const { id } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid notice ID" });
        }

        const deletedNotice = await Notice.findByIdAndDelete(id);

        if (!deletedNotice) {
            return res.status(404).json({ message: "Notice not found" });
        }

        res.json({ message: "Notice deleted successfully" });
    } catch (error) {
        console.error("❌ Error deleting notice:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = {
    getNotices,
    addNotice,
    updateNotice,
    deleteNotice
};
