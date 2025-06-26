const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
  weightage: { type: Number, default: 1 }, // How much the subject affects overall %
});

module.exports = mongoose.model('Subject', subjectSchema);
