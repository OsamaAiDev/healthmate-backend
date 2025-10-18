const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  addVital,
  getVitals,
} = require('../controllers/vitals');

// @route   POST api/vitals
// @desc    Add a vital
// @access  Private
router.post('/', protect, addVital);

// @route   GET api/vitals
// @desc    Get all vitals for a user
// @access  Private
router.get('/', protect, getVitals);

module.exports = router;
