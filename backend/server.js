const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');           // Admin: manage users & subjects
const studentRoutes = require('./routes/students');      // Students: view own attendance
const teacherRoutes = require('./routes/teachers');      // Teachers: mark/view attendance

const { seedAdmin } = require('./seed');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);           // Admin actions
app.use('/api/students', studentRoutes);      // Student self portal
app.use('/api/teachers', teacherRoutes);      // Teacher actions

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(async () => {
  console.log('✅ Connected to MongoDB');
  await seedAdmin(); // Default admin user
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
})
.catch(err => {
  console.error('❌ DB Connection Error:', err);
});
