const express = require('express');
const router = express.Router();
const MaintenancePayment = require('../models/maintenance');
const requiredLogin = require('../middlewares/requiredLogin');

// Resident submits payment
router.post('/submit', requiredLogin(), async (req, res) => {
  const { amount, paymentMethod, transactionId } = req.body;

  const payment = new MaintenancePayment({
    userId: req.user._id,
    societyId: req.user.societyId,
    amount,
    paymentMethod,
    transactionId,
    submittedAt: new Date()
  });

  await payment.save();
  res.json({ success: true, message: 'Payment submitted for verification' });
});

// Admin verifies or rejects payment
router.put('/verify/:id', requiredLogin('admin'), async (req, res) => {
  const { status } = req.body;

  const payment = await MaintenancePayment.findById(req.params.id);
  if (!payment) return res.status(404).json({ error: 'Payment not found' });

  payment.status = status;
  if (status === 'Verified') payment.verifiedAt = new Date();

  await payment.save();
  res.json({ success: true, message: `Payment ${status}` });
});

// Admin views all payments by society
router.get('/all/:societyId', requiredLogin('admin'), async (req, res) => {
  const payments = await MaintenancePayment.find({ societyId: req.params.societyId })
  .populate('userId', 'name flatNumber')
  res.json(payments);
});

// Resident views own payment history
router.get('/my-payments', requiredLogin('resident'), async (req, res) => {
  const payments = await MaintenancePayment.find({ userId: req.user._id });
  res.json(payments);
});

module.exports = router;
