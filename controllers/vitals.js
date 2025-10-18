const Vital = require('../models/Vital');

// @route   POST api/vitals
// @desc    Add a vital
// @access  Private
exports.addVital = async (req, res) => {
  const { bloodPressure, bloodSugar, weight, notes } = req.body;

  try {
    const vital = new Vital({
      user: req.user.id,
      bloodPressure,
      bloodSugar,
      weight,
      notes,
    });

    await vital.save();
    res.json(vital);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route   GET api/vitals
// @desc    Get all vitals for a user
// @access  Private
exports.getVitals = async (req, res) => {
  try {
    const vitals = await Vital.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(vitals);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
