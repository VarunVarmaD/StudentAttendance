const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/authMiddleware');
const Subject = require('../models/Subject');

// 🔒 Protect this route with token and student role
router.get('/attendance', authenticate, authorize('student'), async (req, res) => {
  try {
    const studentId = req.user.id;

    // Fetch all subjects
    const subjects = await Subject.find({});

    const result = [];

    for (const subject of subjects) {
      const totalClasses = subject.attendance.length;
      const attended = subject.attendance.filter(a => a.student.toString() === studentId).length;

      const percentage = totalClasses === 0 ? 0 : ((attended / totalClasses) * 100).toFixed(2);

      result.push({
        subject: subject.name,
        totalClasses,
        attended,
        percentage,
        weight: subject.weight || 1
      });
    }

    res.json({ subjects: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch attendance' });
  }
});

module.exports = router;
