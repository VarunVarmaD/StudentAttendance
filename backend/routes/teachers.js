const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/authMiddleware');

const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const Subject = require('../models/Subject');

// ✅ Mark Attendance for a subject
router.post('/mark', authenticate, authorize('teacher'), async (req, res) => {
  const { subjectId, studentId } = req.body;

  try {
    const teacher = await Teacher.findOne({ user: req.user.id });
    if (!teacher) return res.status(404).json({ error: 'Teacher not found' });

    const hasSubject = teacher.subjects.includes(subjectId);
    if (!hasSubject) return res.status(403).json({ error: 'You are not assigned to this subject' });

    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ error: 'Student not found' });

    const today = new Date().toISOString().split('T')[0];
    const alreadyMarked = student.attendance.some(
      (entry) =>
        entry.subject.toString() === subjectId &&
        new Date(entry.date).toISOString().startsWith(today)
    );

    if (alreadyMarked) {
      return res.status(400).json({ error: 'Attendance already marked today' });
    }

    student.attendance.push({ subject: subjectId, date: new Date() });
    await student.save();

    res.json({ message: '✅ Attendance marked', student });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to mark attendance' });
  }
});

// ✅ View all students in teacher's subjects + attendance
router.get('/students', authenticate, authorize('teacher'), async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ user: req.user.id }).populate('subjects');
    if (!teacher) return res.status(404).json({ error: 'Teacher not found' });

    const subjectIds = teacher.subjects.map((subj) => subj._id);

    const students = await Student.find({ subjects: { $in: subjectIds } })
      .populate('subjects')
      .populate('attendance.subject');

    res.json({ students, subjects: teacher.subjects });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

module.exports = router;
