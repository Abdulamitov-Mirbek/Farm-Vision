// server/models/Notification.js
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  
  type: {
    type: String,
    enum: ['task', 'weather', 'harvest', 'animals', 'equipment', 'system', 'warning', 'info', 'success'],
    required: true
  },
  
  title: {
    type: String,
    required: [true, 'Заголовок уведомления обязателен'],
    trim: true
  },
  
  message: {
    type: String,
    required: [true, 'Текст уведомления обязателен'],
    trim: true
  },
  
  icon: {
    type: String,
    default: '🔔'
  },
  
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  
  read: {
    type: Boolean,
    default: false,
    index: true
  },
  
  readAt: {
    type: Date,
    default: null
  },
  
  link: {
    type: String,
    default: null
  },
  
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  
  expiresAt: {
    type: Date,
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

// Индексы для быстрого поиска
notificationSchema.index({ userId: 1, read: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, priority: 1 });
notificationSchema.index({ userId: 1, type: 1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL индекс

// Статистика уведомлений
notificationSchema.statics.getStats = async function(userId) {
  const stats = await this.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        unread: { $sum: { $cond: [{ $eq: ['$read', false] }, 1, 0] } },
        read: { $sum: { $cond: [{ $eq: ['$read', true] }, 1, 0] } },
        high: { $sum: { $cond: [{ $eq: ['$priority', 'high'] }, 1, 0] } },
        critical: { $sum: { $cond: [{ $eq: ['$priority', 'critical'] }, 1, 0] } }
      }
    }
  ]);

  const byType = await this.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: '$type',
        count: { $sum: 1 },
        unread: { $sum: { $cond: [{ $eq: ['$read', false] }, 1, 0] } }
      }
    },
    { $sort: { count: -1 } }
  ]);

  return {
    ...(stats[0] || { total: 0, unread: 0, read: 0, high: 0, critical: 0 }),
    byType
  };
};

// Отметить как прочитанное
notificationSchema.methods.markAsRead = async function() {
  this.read = true;
  this.readAt = new Date();
  return this.save();
};

// Отметить все как прочитанные для пользователя
notificationSchema.statics.markAllAsRead = async function(userId) {
  return this.updateMany(
    { userId, read: false },
    { $set: { read: true, readAt: new Date() } }
  );
};

// Удалить старые уведомления
notificationSchema.statics.cleanOld = async function(days = 30) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  
  return this.deleteMany({
    read: true,
    createdAt: { $lt: date }
  });
};

module.exports = mongoose.model('Notification', notificationSchema);