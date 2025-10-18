const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('db is connected');
  } catch (err) {
    console.error('db is not connected');
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
