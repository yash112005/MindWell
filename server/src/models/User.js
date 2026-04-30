const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: {
    type: String,
    enum: ['user', 'admin', 'superadmin', 'moderator', 'analyst', 'editor'],
    default: 'user'
  },
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date },
  preferences: {
    theme: { type: String, enum: ['light', 'dark'], default: 'dark' },
    notifications: { type: Boolean, default: true },
    dailyReminderTime: { type: String, default: '09:00' }
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
