const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  rollNo: {
    type: String,
    required: true,
    unique: true,
  },
  attendance: {
    type: [Date], // Array of dates when present
    default: [],
  },
});

module.exports = mongoose.model('Student', studentSchema);
