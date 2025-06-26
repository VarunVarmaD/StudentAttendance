const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/authMiddleware');

const User = require('../models/User');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Subject = require('../models/Subject');

// 🔐 All routes below require admin authentication
router.use(authenticate);
router.use(authorize('admin'));

/**
 * 1️⃣ Add a new Teacher
 */
router.post('/add-teacher', async (req, res) => {
  const { name, username, password, subjects } = req.body;

  try {
    // 🧹 Split subject names if sent as comma-separated string
    const subjectNames = Array.isArray(subjects)
      ? subjects
      : subjects.split(',').map(s => s.trim());

    // 🔍 Fetch or create Subject documents
    const subjectDocs = await Promise.all(
      subjectNames.map(async (subjectName) => {
        let subject = await Subject.findOne({ name: subjectName });
        if (!subject) {
          subject = await Subject.create({ name: subjectName });
        }
        return subject;
      })
    );
    const subjectIds = subjectDocs.map(sub => sub._id);

    // 🔐 Hash the password
    const hashedPassword = await bcrypt.hash(password || username, 10);

    // 👤 Create User and Teacher
    const user = await User.create({
      username,
      password: hashedPassword,
      role: 'teacher',
    });

    const teacher = await Teacher.create({
      name,
      user: user._id,
      subjects: subjectIds,
    });

    res.status(201).json({ message: 'Teacher created', teacher });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add teacher' });
  }
});


/**
 * 2️⃣ Add a new Student
 */
router.post('/add-student', async (req, res) => {
  const { name, rollNo, subjects } = req.body;

  try {
    // 🧹 Split subject names if sent as comma-separated string
    const subjectNames = Array.isArray(subjects)
      ? subjects
      : subjects.split(',').map(s => s.trim());

    // 🔍 Fetch or create Subject documents
    const subjectDocs = await Promise.all(
      subjectNames.map(async (subjectName) => {
        let subject = await Subject.findOne({ name: subjectName });
        if (!subject) {
          subject = await Subject.create({ name: subjectName });
        }
        return subject;
      })
    );
    const subjectIds = subjectDocs.map(sub => sub._id);

    // 🔐 Create student User
    const hashedPassword = await bcrypt.hash(rollNo, 10);
    const user = await User.create({
      username: rollNo,
      password: hashedPassword,
      role: 'student',
    });

    // 🧑‍🎓 Create student profile
    const student = await Student.create({
      name,
      rollNo,
      user: user._id,
      subjects: subjectIds,
    });

    res.status(201).json({ message: 'Student created', student });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add student' });
  }
});

/**
 * 3️⃣ Add a new Subject
 */
router.post('/add-subject', async (req, res) => {
  const { name, priority } = req.body;

  try {
    const existing = await Subject.findOne({ name });
    if (existing) return res.status(400).json({ error: 'Subject already exists' });

    const subject = await Subject.create({ name, priority });
    res.status(201).json({ message: 'Subject created', subject });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add subject' });
  }
});

module.exports = router;
