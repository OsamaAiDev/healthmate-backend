const express = require('express');
const router = express.Router();
console.log('reports.js router loaded');
const { protect } = require('../middleware/auth');
const upload = require('../config/cloudinary');
const {
  uploadReport,
  getReports,
  getReportById,
  summarizeReport,
} = require('../controllers/reports');

// @route   POST api/reports
// @desc    Upload a report
// @access  Private
router.post('/', protect, upload.single('file'), uploadReport);

// @route   GET api/reports
// @desc    Get all reports for a user
// @access  Private
router.get('/', protect, getReports);


// @route   GET api/reports/:id
// @desc    Get a single report by ID
// @access  Private
router.get('/:id', protect, getReportById);

// @route   POST api/reports/summary/:id
// @desc    Generate a summary for a report
// @access  Private
router.post('/summary/:id', protect, summarizeReport);

module.exports = router;
