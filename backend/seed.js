const bcrypt = require('bcrypt');
const User = require('./models/User');

async function seedAdmin() {
  const existingAdmin = await User.findOne({ role: 'admin' });
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await User.create({
      username: 'admin',
      password: hashedPassword,
      role: 'admin',
    });
    console.log('🧪 Default admin user created: admin/admin123');
  } else {
    console.log('🧪 Admin user already exists');
  }
}

module.exports = { seedAdmin };
