const express = require('express');
const { createPoll, getPolls } = require('../controllers/pollController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/create', authMiddleware, createPoll);
router.get('/', authMiddleware, getPolls);

module.exports = router;
