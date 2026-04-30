const mongoose = require('mongoose');

const crisisAlertSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['chat', 'journal'], required: true },
  keyword: { type: String, required: true },
  contextSnippet: { type: String, maxlength: 200 },
  status: { type: String, enum: ['pending', 'reviewed', 'escalated'], default: 'pending' },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser' },
  reviewedAt: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('CrisisAlert', crisisAlertSchema);
