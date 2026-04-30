const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dateRange: {
    start: { type: Date, required: true },
    end: { type: Date, required: true }
  },
  insights: { type: String, required: true }, 
  streaks: { type: Number, default: 0 },
  averageMood: { type: Number },
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);
