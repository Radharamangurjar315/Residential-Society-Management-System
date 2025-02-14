const mongoose = require('mongoose');

const pollSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [
    {
      text: String,
      votes: { type: Number, default: 0 }
    }
  ],
  voters: [
    {
      userId: { type: String, required: true },
      optionIndex: { type: Number, required: true },
      votedAt: { type: Date, default: Date.now }
    }
  ],
  createdAt: { type: Date, default: Date.now },
  duration: { type: Number, required: true }
});

const Poll = mongoose.model('Poll', pollSchema);
module.exports = Poll;
