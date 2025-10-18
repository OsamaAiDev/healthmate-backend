const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  reportType: {
    type: String,
    required: true,
  },
  fileUrl: {
    type: String,
    required: true,
  },
  cloudinaryId: {
    type: String,
    required: true,
  },
  summary: {
    english: { type: String },
    romanUrdu: { type: String },
  },
  doctorQuestions: [
    { type: String },
  ],
  foodSuggestions: {
    toEat: [{ type: String }],
    toAvoid: [{ type: String }],
  },
  homeRemedies: [
    { type: String },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Report', ReportSchema);
