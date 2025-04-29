const express = require('express');
const router = express.Router();
const visitorController = require('../controllers/visitorController');
const requiredLogin = require('../middlewares/requiredLogin');

// Routes
router.post('/add', requiredLogin('admin'), visitorController.createVisitor);                 // Any logged-in user (admin, guard)
router.get('/:societyId', requiredLogin(), visitorController.getVisitors);             // Any logged-in user
router.put('/status/:id', requiredLogin('resident'), visitorController.updateVisitorStatus); // Only residents can approve/reject
router.put('/exit/:id', requiredLogin('admin'), visitorController.markVisitorExit);    // Only admin can mark exit

module.exports = router;
