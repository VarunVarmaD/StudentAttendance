const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  date: { type: Date, default: Date.now }
});

attendanceSchema.index({ student: 1, subject: 1, date: 1 }, { unique: true }); // Prevent duplicate entries

module.exports = mongoose.model('Attendance', attendanceSchema);
