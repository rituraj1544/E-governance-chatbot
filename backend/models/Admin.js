// models/Admin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const { Schema } = mongoose;

const AdminSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, 'Username required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Password required'],
      minlength: 6,
    },
    role: {
      type: String,
      enum: ['admin', 'superadmin'],
      default: 'admin',
      index: true,
    },
    lastLoginAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

/**
 * Hash password before saving when it's new or modified.
 * Use async hook WITHOUT a `next` callback to avoid `next is not a function`.
 */
AdminSchema.pre('save', async function () {
  try {
    // only hash if password is new or modified
    if (!this.isModified('password')) return;

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (err) {
    // throwing will cause Mongoose to propagate the error
    throw err;
  }
});

/**
 * Instance method to compare plaintext password with hashed password.
 * Usage: const match = await admin.comparePassword('plaintext');
 */
AdminSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

/**
 * Static helper: find by username (normalized)
 */
AdminSchema.statics.findByUsername = function (username) {
  if (!username) return Promise.resolve(null);
  return this.findOne({ username: username.toString().trim().toLowerCase() });
};

module.exports = mongoose.model('Admin', AdminSchema);
