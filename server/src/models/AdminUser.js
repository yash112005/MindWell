const mongoose = require('mongoose');

const adminUserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['superadmin', 'moderator', 'analyst', 'editor'], 
    default: 'moderator' 
  },
  twoFASecret: { type: String },
  lastLogin: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('AdminUser', adminUserSchema);
