const express = require('express');
const router = express.Router();
const { getLeads, createLead, updateLead, deleteLead, addNote, getStats, createPublicLead } = require('../controllers/leadController');
const { protect } = require('../middleware/authMiddleware');

router.post('/public', createPublicLead); // Public route


router.route('/').get(protect, getLeads).post(protect, createLead);
router.get('/stats', protect, getStats);
router.route('/:id').put(protect, updateLead).delete(protect, deleteLead);
router.route('/:id/note').post(protect, addNote);

module.exports = router;
