const mongoose = require('mongoose');

const LoginHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  userAgent: {
    type: String,
    default: 'Неизвестное устройство'
  },
  ip: {
    type: String,
    default: '0.0.0.0'
  },
  location: {
    type: String,
    default: 'Неизвестно'
  },
  success: {
    type: Boolean,
    default: true
  },
  error: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true
});

// Индекс для быстрой выборки истории
LoginHistorySchema.index({ userId: 1, createdAt: -1 });

// Автоматическое удаление старых записей (старше 90 дней)
LoginHistorySchema.index({ createdAt: 1 }, { 
  expireAfterSeconds: 90 * 24 * 60 * 60 
});

module.exports = mongoose.model('LoginHistory', LoginHistorySchema);