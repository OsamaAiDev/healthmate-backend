const mongoose = require('mongoose');

const VitalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  bloodPressure: {
    type: String,
  },
  bloodSugar: {
    type: String,
  },
  weight: {
    type: String,
  },
  notes: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Vital', VitalSchema);
