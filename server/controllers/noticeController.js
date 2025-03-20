const Notice = require('../models/notice');

// Get all notices (accessible to all users)
const getNotices = async (req, res) => {
    try {
        const notices = await Notice.find().sort({ date: -1 });
        res.json(notices);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Add a new notice (only for admin, handled by verifyAdmin middleware)
const addNotice = async (req, res) => {
    try {
        console.log("Received request to add notice:", req.body);

        const { title, content } = req.body;

        if (!title || !content) {
            console.error("❌ Missing title or content");
            return res.status(400).json({ message: "Title and content are required" });
        }

        const newNotice = new Notice({
            title,
            content,
            date: new Date().toISOString().split("T")[0],
        });

        const savedNotice = await newNotice.save();
        console.log("✅ Notice saved successfully:", savedNotice);
        
        res.status(201).json(savedNotice);
    } catch (error) {
        console.error("❌ Error adding notice:", error);  // Logs the actual error
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};



// Update a notice (only for admin)
const updateNotice = async (req, res) => {
    const { id } = req.params;
    const { title, description, date } = req.body;

    try {
        const updatedNotice = await Notice.findByIdAndUpdate(
            id, 
            { title, description, date }, 
            { new: true }
        );
        res.json(updatedNotice);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Delete a notice (only for admin)
const deleteNotice = async (req, res) => {
    const { id } = req.params;

    try {
        await Notice.findByIdAndDelete(id);
        res.json({ message: 'Notice deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getNotices,
    addNotice,
    updateNotice,
    deleteNotice
};
