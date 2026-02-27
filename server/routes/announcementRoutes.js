const express = require('express');
const router = express.Router();
const { getAnnouncements, createAnnouncement } = require('../controllers/announcementController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getAnnouncements);
router.post('/', protect, createAnnouncement);

module.exports = router;
