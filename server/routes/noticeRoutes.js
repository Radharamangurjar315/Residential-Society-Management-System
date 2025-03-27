const express = require('express');
const { getNotices, addNotice, updateNotice, deleteNotice } = require('../controllers/noticeController');
const { verifyAdmin } = require('../middlewares/verifyAdmin');

const router = express.Router();

// ✅ Fetch all notices (Accessible to all users)
router.get('/', getNotices);

// ✅ Add a notice (Only for Admins)
router.post('/', verifyAdmin, addNotice);

// // ✅ Update a notice (Only for Admins)
// router.put('/:id', verifyAdmin, updateNotice);

// ✅ Delete a notice (Only for Admins)
router.delete('/:id', verifyAdmin, deleteNotice);

module.exports = router;
