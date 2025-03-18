const express = require('express');
const authenticate = require('../middlewares/requiredLogin'); 
const permissionRole = require('../middlewares/permissionMiddleware');
require('../models/user'); // ✅ Ensure the model is correctly registered

const {
    getNotices,
    addNotice,
    updateNotice,
    deleteNotice
} = require('../controllers/noticeController');

const router = express.Router();

// Route to fetch all notices (Accessible by both admin and resident)
router.get('/', getNotices);

// Route to add a notice (Only accessible by admin)
router.post('/',  addNotice);

// Route to update a notice (Only accessible by admin)
router.put('/:id', permissionRole(["admin"]), updateNotice);

// Route to delete a notice (Only accessible by admin)
router.delete('/:id', permissionRole(["admin"]), deleteNotice);

module.exports = router;
