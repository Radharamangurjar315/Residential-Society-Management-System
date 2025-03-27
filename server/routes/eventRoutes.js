const express = require('express');
const Event = require('../models/event');
const router = express.Router();
// const permissionRole = require('../middlewares/permissionMiddleware');
const {verifyAdmin} = require('../middlewares/verifyAdmin');
const mongoose = require('mongoose');


// Create a new event
router.post("/add", verifyAdmin, async (req, res) => {
  try {
    const { title, date, description, societyId, location } = req.body;

    if (!title || !date || !description || !societyId || !location) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!mongoose.Types.ObjectId.isValid(societyId)) {
      return res.status(400).json({ message: "Invalid society ID format" });
    }

    // Convert event date to UTC before validation
    let eventDate = new Date(date);
    let now = new Date();

    // Convert both dates to UTC (ignoring time zone issues)
    eventDate = new Date(eventDate.toISOString().split("T")[0]); 
    now = new Date(now.toISOString().split("T")[0]);

   

    if (eventDate < now) {
      return res.status(400).json({ message: "Date must be in the future" });
    }

    const createdBy = req.user?.id;
    if (!createdBy) {
      return res.status(403).json({ message: "Unauthorized: Admin ID missing" });
    }

    const newEvent = new Event({
      title,
      date: eventDate, 
      description,
      societyId: new mongoose.Types.ObjectId(societyId),
      location,
      createdBy,
    });

    await newEvent.save();

    res.status(200).json({
      success: true,
      data: newEvent,
      message: "Event added successfully",
    });
  } catch (error) {
    console.error("Error adding event:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const { societyId } = req.query;

    // console.log("Received request for events:", req.query);

    // Check if societyId is provided
   // In your GET / route:
if (!societyId) {
  return res.status(400).json({ 
    error: "societyId query parameter is required",
    example: "/api/events?societyId=12345" 
  });
}

    // Validate if societyId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(societyId)) {
      return res.status(400).json({ error: "Invalid society ID format" });
    }

    // console.log(`Fetching events for Society ID: ${societyId}`);

    // Fetch events from the database
    const events = await Event.find({ societyId: new mongoose.Types.ObjectId(societyId) }).sort({ date: -1 });

    // In all routes, maintain consistent response structure:
res.status(200).json({
  success: true,
  data: events, // or whatever data
  message: "Events retrieved successfully"
});
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});




// Delete an event
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findByIdAndDelete(id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    res.status(200).json({ message: "Event deleted successfully" });
    // Verify admin belongs to the same society
    if (req.user.societyId.toString() !== event.societyId.toString()) {
      return res.status(403).json({ message: "Unauthorized to delete this event" });
    }
    
   
   
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
