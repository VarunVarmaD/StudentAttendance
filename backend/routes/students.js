const express = require('express');
const router = express.Router();

const Student = require('../models/Student');

// POST /students → Add a new student
router.post('/', async (req, res) => {
  const { name, rollNo } = req.body;

  try {
    const newStudent = new Student({ name, rollNo });
    await newStudent.save();
    res.status(201).json({ message: 'Student added successfully', student: newStudent });
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).json({ error: 'Student with this roll number already exists' });
    } else {
      res.status(500).json({ error: 'Failed to add student' });
    }
  }
});

module.exports = router;

// POST /mark-attendance/:rollNo
router.post('/mark-attendance/:rollNo', async (req, res) => {
  const { rollNo } = req.params;

  try {
    const student = await Student.findOne({ rollNo });

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const today = new Date().toISOString().split('T')[0]; // 'YYYY-MM-DD'

    // Check if already marked for today
    const alreadyMarked = student.attendance.some(date =>
      new Date(date).toISOString().startsWith(today)
    );

    if (alreadyMarked) {
      return res.status(400).json({ error: 'Attendance already marked for today' });
    }

    // Mark attendance
    student.attendance.push(new Date());
    await student.save();

    res.json({ message: 'Attendance marked', student });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to mark attendance' });
  }
});

// GET /students
router.get('/', async (req, res) => {
  try {
    const students = await Student.find({});
    res.json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});
