const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }]
});

module.exports = mongoose.model('Teacher', teacherSchema);
