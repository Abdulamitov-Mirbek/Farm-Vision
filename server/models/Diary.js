const mongoose = require('mongoose');

const DiarySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'ID пользователя обязательно']
  },
  
  title: {
    type: String,
    required: [true, 'Заголовок обязателен'],
    trim: true,
    maxlength: [200, 'Заголовок должен быть не более 200 символов']
  },
  
  content: {
    type: String,
    required: [true, 'Содержание обязательно'],
    trim: true
  },
  
  date: {
    type: Date,
    required: [true, 'Дата обязательна'],
    default: Date.now
  },
  
  fieldId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Field',
    required: false
  },
  
  activityType: {
    type: String,
    enum: [
      'sowing',       // Посев
      'watering',     // Полив
      'fertilizing',  // Удобрение
      'treatment',    // Обработка
      'harvesting',   // Сбор урожая
      'maintenance',  // Обслуживание
      'inspection',   // Осмотр
      'planning',     // Планирование
      'other'         // Другое
    ],
    default: 'other'
  },
  
  weatherConditions: {
    temperature: { type: Number },
    humidity: { type: Number },
    precipitation: { type: Number },
    windSpeed: { type: Number },
    condition: { type: String }
  },
  
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  
  images: [{
    url: { type: String },
    thumbnail: { type: String },
    description: { type: String }
  }],
  
  metrics: {
    // Метрики могут быть специфичными для типа активности
    area: { type: Number },           // Площадь в гектарах
    volume: { type: Number },         // Объем (вода, удобрения)
    quantity: { type: Number },       // Количество (семена, растения)
    duration: { type: Number },       // Длительность в часах
    cost: { type: Number }            // Стоимость
  },
  
  isImportant: {
    type: Boolean,
    default: false
  },
  
  mood: {
    type: String,
    enum: ['excellent', 'good', 'normal', 'bad', 'terrible'],
    default: 'normal'
  },
  
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [0, 0]
    }
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Индексы для быстрого поиска
DiarySchema.index({ userId: 1, date: -1 });
DiarySchema.index({ userId: 1, fieldId: 1 });
DiarySchema.index({ userId: 1, activityType: 1 });
DiarySchema.index({ userId: 1, tags: 1 });
DiarySchema.index({ location: '2dsphere' });

// Виртуальное поле для форматированной даты
DiarySchema.virtual('formattedDate').get(function() {
  return this.date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Виртуальное поле для времени записи
DiarySchema.virtual('time').get(function() {
  return this.date.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit'
  });
});

// Предварительная обработка перед сохранением
DiarySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Автоматически добавляем теги на основе активности
  if (this.activityType && !this.tags.includes(this.activityType)) {
    this.tags.push(this.activityType);
  }
  
  next();
});

// Метод для поиска по периоду
DiarySchema.statics.findByPeriod = function(userId, startDate, endDate) {
  return this.find({
    userId,
    date: {
      $gte: startDate,
      $lte: endDate
    }
  }).sort({ date: -1 });
};

// Метод для получения статистики
DiarySchema.statics.getStats = async function(userId, period = 'month') {
  const now = new Date();
  let startDate;
  
  switch (period) {
    case 'day':
      startDate = new Date(now.setDate(now.getDate() - 1));
      break;
    case 'week':
      startDate = new Date(now.setDate(now.getDate() - 7));
      break;
    case 'month':
      startDate = new Date(now.setMonth(now.getMonth() - 1));
      break;
    case 'year':
      startDate = new Date(now.setFullYear(now.getFullYear() - 1));
      break;
    default:
      startDate = new Date(now.setMonth(now.getMonth() - 1));
  }
  
  const stats = await this.aggregate([
    {
      $match: {
        userId: mongoose.Types.ObjectId(userId),
        date: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: '$activityType',
        count: { $sum: 1 },
        totalArea: { $sum: '$metrics.area' },
        totalCost: { $sum: '$metrics.cost' },
        lastEntry: { $max: '$date' }
      }
    },
    {
      $sort: { count: -1 }
    }
  ]);
  
  return stats;
};

module.exports = mongoose.model('Diary', DiarySchema);