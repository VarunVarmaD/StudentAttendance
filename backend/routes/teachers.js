const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/authMiddleware');

const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const Subject = require('../models/Subject');
const Attendance = require('../models/Attendance');

// ✅ Mark Attendance for a subject
router.post('/mark', authenticate, authorize('teacher'), async (req, res) => {
  const { subjectId, studentId } = req.body;

  try {
    const teacher = await Teacher.findOne({ user: req.user.id });
    if (!teacher) return res.status(404).json({ error: 'Teacher not found' });

    const hasSubject = teacher.subjects
      .map((s) => s.toString())
      .includes(subjectId);
    if (!hasSubject) return res.status(403).json({ error: 'You are not assigned to this subject' });

    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ error: 'Student not found' });

    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    const alreadyMarked = await Attendance.findOne({
      student: studentId,
      subject: subjectId,
      date: { $gte: start, $lt: end }
    });

    if (alreadyMarked) {
      return res.status(400).json({ error: 'Attendance already marked today' });
    }

    await Attendance.create({ student: studentId, subject: subjectId });

    res.json({ message: '✅ Attendance marked' });
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
      .populate('subjects');

    const studentsWithAttendance = [];
    for (const student of students) {
      const attendance = await Attendance.find({ student: student._id })
        .populate('subject');
      studentsWithAttendance.push({
        ...student.toObject(),
        attendance,
      });
    }

    res.json({ students: studentsWithAttendance, subjects: teacher.subjects });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

module.exports = router;
