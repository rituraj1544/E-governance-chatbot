// scripts/createAdmin.js
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Admin = require('../models/Admin');

(async () => {
  try {
    await connectDB();
    const user = new Admin({ username: 'admin1', password: 'ChangeMe123', role: 'superadmin' });
    await user.save();
    console.log('Admin created:', { id: user._id, username: user.username, role: user.role });
    process.exit(0);
  } catch (err) {
    console.error('Error creating admin:', err.message);
    process.exit(1);
  }
})();
