const express = require('express');
const Poll = require('../models/poll');
const router = express.Router();

// Create Poll
router.post('/create', async (req, res) => {
  try {
    const { question, options, duration } = req.body;
    const poll = new Poll({ question, options, duration });
    await poll.save();
    res.status(201).json(poll);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get All Polls
router.get('/', async (req, res) => {
  try {
    const polls = await Poll.find();
    res.json(polls);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete Poll
// Route Definition
router.delete('/:id', async (req, res) => {
    console.log("ID:", req.params.id);
    try {
      const deletedPoll = await Poll.findByIdAndDelete(req.params.id);
      if (!deletedPoll) {
        return res.status(404).json({ message: "Poll not found" });
      }
      res.status(200).json({ message: "Poll deleted" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  

// Vote on Poll
router.post('/:id/vote', async (req, res) => {
    const { userId, optionIndex } = req.body;
    try {
      const normalizedUserId = String(userId).trim().toLowerCase();
      console.log('Normalized User ID:', normalizedUserId);
  
      const poll = await Poll.findById(req.params.id);
  
      // Check if the poll exists
      if (!poll) {
        return res.status(404).json({ message: "Poll not found" });
      }
  
      // Check if the poll is still active
      const pollEndTime = new Date(poll.createdAt).getTime() + poll.duration * 60000;
      if (Date.now() > pollEndTime) {
        return res.status(400).json({ message: "Poll has ended" });
      }
  
      // Check if the optionIndex is valid
      if (optionIndex < 0 || optionIndex >= poll.options.length) {
        return res.status(400).json({ message: "Invalid option selected" });
      }
  
      // Atomic Operation to Prevent Duplicate Votes
      const updateResult = await Poll.findOneAndUpdate(
        {
          _id: req.params.id,
          'voters.userId': { $ne: normalizedUserId }
        },
        {
          $inc: { [`options.${optionIndex}.votes`]: 1 },
          $addToSet: {
            voters: {
              userId: normalizedUserId,
              optionIndex,
              votedAt: new Date()
            }
          }
        },
        { new: true }
      );
  
      console.log('Update Result:', updateResult);
  
      if (!updateResult) {
        return res.status(400).json({ message: "User has already voted" });
      }
  
      res.status(200).json({ message: "Vote cast successfully" });
    } catch (error) {
      console.error('Error casting vote:', error);
      res.status(500).json({ error: error.message });
    }
  });
  
  
// Get Poll Details
router.get('/:id', async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);
    res.json(poll);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
