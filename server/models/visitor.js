const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
  societyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Society',
    required: true,
  },
  flatNumber: String,
  visitorName: String,
  purpose: String,
  entryTime: {
    type: Date,
    default: Date.now
  },
  exitTime: Date,
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'exited'],
    default: 'pending'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

module.exports = mongoose.model('Visitor', visitorSchema);
