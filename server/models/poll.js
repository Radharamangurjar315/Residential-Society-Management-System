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
      user:{ type: mongoose.Schema.Types.ObjectId, ref: "User" },
      optionIndex: { type: Number, required: true },
      votedAt: { type: Date, default: Date.now }
    }
  ],
  societyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Society', required: true },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  duration: { type: Number, required: true }
});

const Poll = mongoose.model('Poll', pollSchema);
module.exports = Poll;
