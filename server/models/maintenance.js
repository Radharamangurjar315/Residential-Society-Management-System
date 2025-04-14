const mongoose = require('mongoose');

const maintenancePaymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  societyId: { type: String, required: true },
  amount: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['UPI', 'Cash', 'Bank Transfer'], required: true },
  transactionId: { type: String },
  status: { type: String, enum: ['Pending', 'Verified', 'Rejected'], default: 'Pending' },
  submittedAt: { type: Date, default: Date.now },
  verifiedAt: Date,
});

module.exports = mongoose.model('MaintenancePayment', maintenancePaymentSchema);
