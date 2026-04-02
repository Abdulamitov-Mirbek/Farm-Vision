const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    //index: true
  },
  token: {
    type: String,
    required: true,
   // index: true
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
  lastActive: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    required: true,
    default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 дней
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Индексы для быстрого поиска
SessionSchema.index({ userId: 1, lastActive: -1 });
SessionSchema.index({ token: 1 });
SessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Session', SessionSchema);