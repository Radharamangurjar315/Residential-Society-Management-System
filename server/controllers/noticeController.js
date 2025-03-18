const Notice = require('../models/notice');

// Get all notices
const getNotices = async (req, res) => {
    try {
        const notices = await Notice.find().sort({ date: -1 });
        res.json(notices);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Add a new notice
const addNotice = async (req, res) => {
    const { title, description, date } = req.body;

    if (!title || !description || !date) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const newNotice = new Notice({ title, description, date });
        await newNotice.save();
        res.status(201).json(newNotice);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Update a notice
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

// Delete a notice
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
