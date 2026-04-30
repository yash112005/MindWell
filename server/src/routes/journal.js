const express = require('express');
const router = express.Router();
const {
  getJournals,
  createJournal,
  updateJournal,
  deleteJournal,
  getDashboardStats,
} = require('../controllers/journalController');
const { protect } = require('../middleware/auth');


router.get('/stats', protect, getDashboardStats);

router.route('/').get(protect, getJournals).post(protect, createJournal);
router.route('/:id').put(protect, updateJournal).delete(protect, deleteJournal);

module.exports = router;
