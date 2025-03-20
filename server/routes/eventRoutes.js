const express = require('express');
const Event = require('../models/event');
const router = express.Router();
// const permissionRole = require('../middlewares/permissionMiddleware');
const {verifyAdmin} = require('../middlewares/verifyAdmin');


// Create a new event
router.post("/add", verifyAdmin, async (req, res) => {
  try {
    const { title, date, description } = req.body;

    if (!title || !date || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newEvent = new Event({ title, date, description, createdBy: req.params.id });
    await newEvent.save();

    res.status(201).json({ message: "Event added successfully", event: newEvent });
  } catch (error) {
    console.error("Error adding event:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete an event
router.delete('/:id',verifyAdmin, async (req, res) => {
    try {
      const eventId = req.params.id;
      await Event.findByIdAndDelete(eventId);
      res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
      console.error('Error deleting event:', error);
      res.status(500).json({ error: 'Failed to delete event' });
    }
  });

module.exports = router;
