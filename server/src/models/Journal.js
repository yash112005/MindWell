const mongoose = require('mongoose');
const { encrypt, decrypt } = require('../utils/crypto');

const journalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  content: { 
    type: String, 
    required: true,
    get: decrypt,
    set: encrypt
  },
  mood: { type: Number, min: 1, max: 10, required: true },
  sentiment: { type: String, enum: ['Positive', 'Neutral', 'Negative', 'Mixed', 'positive', 'neutral', 'negative'], default: 'Neutral' },
  dominantEmotion: { type: String }, 
  image: { type: String },
  keyThemes: [{ type: String }], 
  tags: [{ type: String }], 
  date: { type: Date, default: Date.now },
}, { 
  timestamps: true,
  toJSON: { getters: true },
  toObject: { getters: true } 
});

module.exports = mongoose.model('Journal', journalSchema);
