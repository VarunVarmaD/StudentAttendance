const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/authMiddleware');
const Subject = require('../models/Subject');
const Student = require('../models/Student');
const Attendance = require('../models/Attendance');

// 🔒 Protect this route with token and student role
router.get('/attendance', authenticate, authorize('student'), async (req, res) => {
  try {
    const userId = req.user.id;
    const student = await Student.findOne({ user: userId }).populate('subjects');
    if (!student) return res.status(404).json({ error: 'Student not found' });

    const result = [];

    for (const subject of student.subjects) {
      const totalClasses = await Attendance.countDocuments({ subject: subject._id });
      const attended = await Attendance.countDocuments({ student: student._id, subject: subject._id });

      const percentage = totalClasses === 0 ? 0 : Number(((attended / totalClasses) * 100).toFixed(2));

      result.push({
        subject: subject.name,
        totalClasses,
        attended,
        percentage,
        weight: subject.weightage || 1
      });
    }

    res.json({ subjects: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch attendance' });
  }
});

module.exports = router;
