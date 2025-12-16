const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  mbti: {
    type: String,
    trim: true,
    default: ''
  },
  enneagram: {
    type: String,
    trim: true,
    default: ''
  },
  variant: {
    type: String,
    trim: true,
    default: ''
  },
  tritype: {
    type: Number,
    default: null
  },
  socionics: {
    type: String,
    trim: true,
    default: ''
  },
  sloan: {
    type: String,
    trim: true,
    default: ''
  },
  psyche: {
    type: String,
    trim: true,
    default: ''
  },
  image: {
    type: String,
    trim: true,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Profile', profileSchema);