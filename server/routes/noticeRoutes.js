const express = require('express');
const authenticate = require('../middlewares/requiredLogin'); 

require('../models/user'); // ✅ Ensure the model is correctly registered

const {getNotices, addNotice, updateNotice, deleteNotice} = require('../controllers/noticeController'); 
const { verifyAdmin } = require('../middlewares/verifyAdmin');

const router = express.Router();

// Route to fetch all notices (Accessible by both admin and resident)
router.get('/', getNotices);

// Route to add a notice (Only accessible by admin)
router.post('/', verifyAdmin,  addNotice);

// Route to update a notice (Only accessible by admin)
router.put('/:id', verifyAdmin, updateNotice);

// Route to delete a notice (Only accessible by admin)
router.delete('/:id', verifyAdmin, deleteNotice);

module.exports = router;