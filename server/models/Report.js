const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['harvest', 'weather', 'field', 'financial', 'custom'],
    default: 'custom'
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  format: {
    type: String,
    enum: ['json', 'pdf', 'excel', 'csv'],
    default: 'json'
  },
  generatedAt: {
    type: Date,
    default: Date.now
  },
  period: {
    start: Date,
    end: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Report', ReportSchema);