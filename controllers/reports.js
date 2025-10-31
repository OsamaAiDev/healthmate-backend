const Report = require('../models/Report');
const User = require('../models/User');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fetch = require('node-fetch');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// @route   POST api/reports
// @desc    Upload a report
// @access  Private
exports.uploadReport = async (req, res) => {
  const { title, reportType } = req.body;
  const { path, filename } = req.file;

  try {
    const report = new Report({
      user: req.user.id,
      title,
      reportType,
      fileUrl: path,
      cloudinaryId: filename,
    });

    await report.save();
    res.json(report);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route   GET api/reports
// @desc    Get all reports for a user
// @access  Private
exports.getReports = async (req, res) => {
  try {
    const reports = await Report.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route   GET api/reports/:id
// @desc    Get a single report by ID
// @access  Private
exports.getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ msg: 'Report not found' });
    }

    // Check user
    if (report.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    res.json(report);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Report not found' });
    }
    res.status(500).send('Server Error');
  }
};

// @route   POST api/reports/summary/:id
// @desc    Generate a summary for a report
// @access  Private
exports.summarizeReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ msg: 'Report not found' });
    }

    // Check user
    if (report.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    const fileExtension = report.fileUrl.split('.').pop().toLowerCase();
    const mimeTypeMap = {
      jpeg: 'image/jpeg',
      jpg: 'image/jpeg',
      png: 'image/png',
    };
    const mimeType = mimeTypeMap[fileExtension];

    if (!mimeType) {
      return res.status(400).json({ msg: 'File type not supported for summarization. Only jpeg and png are supported.' });
    }

    const response = await fetch(report.fileUrl);
    const buffer = await response.buffer();

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = 'Analyze this medical report and provide a summary in both English and Roman Urdu. Also, suggest relevant questions to ask a doctor, recommend foods to eat and avoid, and list some home remedies. Format the output as a JSON object with the following keys: summary (with nested keys english and romanUrdu), doctorQuestions, foodSuggestions (with nested keys toEat and toAvoid), and homeRemedies.';

    const imagePart = {
      inlineData: {
        data: buffer.toString('base64'),
        mimeType: mimeType,
      },
    };

    const result = await model.generateContent([prompt, imagePart]);
    const text = result.response.text();
    const jsonText = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
    const summaryData = JSON.parse(jsonText);

    report.summary = summaryData.summary;
    report.doctorQuestions = summaryData.doctorQuestions;
    report.foodSuggestions = summaryData.foodSuggestions;
    report.homeRemedies = summaryData.homeRemedies;

    await report.save();

    res.json(report);
  } catch (err) {
    console.error('Error in summarizeReport:', err);
    res.status(500).send('Server Error');
  }
};
