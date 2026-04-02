// server/models/WeeklyTask.js
const mongoose = require('mongoose');

const weeklyTaskSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  title: {
    type: String,
    required: [true, 'Название задачи обязательно'],
    trim: true
  },
  
  description: {
    type: String,
    trim: true,
    default: ''
  },
  
  dayOfWeek: {
    type: Number,
    required: true,
    min: 0,
    max: 6,
    description: '0-6: воскресенье-суббота'
  },
  
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  
  category: {
    type: String,
    enum: ['field', 'animals', 'equipment', 'crops', 'other'],
    default: 'other'
  },
  
  status: {
    type: String,
    enum: ['pending', 'completed', 'skipped'],
    default: 'pending'
  },
  
  estimatedHours: {
    type: Number,
    min: 0,
    default: 1
  },
  
  completedAt: {
    type: Date,
    default: null
  },
  
  recurring: {
    type: Boolean,
    default: false
  },
  
  assignedTo: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  
  fieldId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Field',
    default: null
  },
  
  tags: [{
    type: String,
    trim: true
  }],
  
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Индексы для быстрого поиска
weeklyTaskSchema.index({ userId: 1, dayOfWeek: 1 });
weeklyTaskSchema.index({ userId: 1, status: 1 });
weeklyTaskSchema.index({ userId: 1, category: 1 });

// Статистика по задачам - ИСПРАВЛЕНО!
weeklyTaskSchema.statics.getStats = async function(userId) {
  // Для MongoDB версии 4+ можно использовать просто userId
  const stats = await this.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } }, // ✅ Добавлен new
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
        pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
        skipped: { $sum: { $cond: [{ $eq: ['$status', 'skipped'] }, 1, 0] } }
      }
    }
  ]);
  
  return stats[0] || { total: 0, completed: 0, pending: 0, skipped: 0 };
};

module.exports = mongoose.model('WeeklyTask', weeklyTaskSchema);