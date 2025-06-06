const express = require('express');
const mongoose = require('mongoose');
const Poll = require('../models/poll');
const permissionRole = require('../middlewares/permissionMiddleware');
const router = express.Router();

// Create Poll (Admin Only)
router.post('/create', async (req, res) => {
  try {
    const { question, options, societyId, duration } = req.body;
    if (!question || options.length < 2 || !societyId) {
      return res.status(400).json({ message: "A poll must have a question and at least two options." });
    }

    const poll = new Poll({
      question,
      options: options.map(option => ({ text: option.text, votes: 0 })), // Ensure correct structure
      societyId,
      duration,
      createdAt: new Date()
    });

    await poll.save();
    res.status(201).json({ message: "Poll created successfully", poll });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get All Polls (Public)
router.get('/', async (req, res) => {
  try {
    const { societyId } = req.query;
    // Validate societyId
          if (!societyId || !mongoose.Types.ObjectId.isValid(societyId)) {
            return res.status(400).json({ error: "Invalid society ID format" });
          }
    const polls = await Poll.find({societyId}).sort({ createdAt: -1 });
    if (polls.length === 0) {
      return res.status(404).json({ message: "No notices found for this society" });
    }

    res.status(200).json(polls);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching polls" });
  }
});


// Delete Poll (Admin Only)
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    
     if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ message: "Invalid polls ID" });
            }
    
    const deletedPoll = await Poll.findByIdAndDelete(req.params.id);

    if (!deletedPoll) {
      return res.status(404).json({ message: "Poll not found" });
    }
    res.status(200).json({ message: "Poll deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Vote on a Poll
router.post('/:id/vote', async (req, res) => {
  try {
    const { userId, optionIndex, societyId } = req.body;
    if (!userId || !societyId) {
      return res.status(400).json({ message: "User ID is required to vote" });
    }

    const poll = await Poll.findById(req.params.id);
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

    // Ensure user has not already voted
    const hasVoted = poll.voters.some(voter => voter.userId === userId);
    if (hasVoted) {
      return res.status(400).json({ message: "You have already voted" });
    }

    // Update vote count and record the user as a voter
    poll.options[optionIndex].votes += 1;
    poll.voters.push({ userId, optionIndex, votedAt: new Date() });

    await poll.save();
    res.status(200).json({ message: "Vote cast successfully", poll });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
