// server/models/Field.js
const mongoose = require('mongoose');

const FieldSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'ID пользователя обязательно']
  },
  
  name: {
    type: String,
    required: [true, 'Название поля обязательно'],
    trim: true,
    maxlength: [100, 'Название должно быть не более 100 символов']
  },
  
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Описание должно быть не более 500 символов'],
    default: ''
  },
  
  area: {
    type: Number,
    required: [true, 'Площадь обязательна'],
    min: [0.01, 'Площадь должна быть положительной'],
    max: [10000, 'Площадь слишком большая']
  },
  
  unit: {
    type: String,
    enum: ['hectare', 'acre'],
    default: 'hectare'
  },
  
  cropType: {
    type: String,
    required: [true, 'Тип культуры обязателен'],
    enum: [
      'wheat',        // Пшеница
      'corn',         // Кукуруза
      'sunflower',    // Подсолнечник
      'barley',       // Ячмень
      'rye',          // Рожь
      'oat',          // Овес
      'rape',         // Рапс
      'soybean',      // Соя
      'potato',       // Картофель
      'vegetables',   // Овощи
      'fruits',       // Фрукты
      'berries',      // Ягоды
      'other'         // Другое
    ]
  },
  
  cropVariety: {
    type: String,
    trim: true,
    default: ''
  },
  
  soilType: {
    type: String,
    required: [true, 'Тип почвы обязателен'],
    enum: [
      'chernozem',    // Чернозем
      'loam',         // Суглинок
      'sandy',        // Супесь
      'clay',         // Глина
      'peat',         // Торф
      'other'         // Другое
    ]
  },
  
  irrigationSystem: {
    type: String,
    enum: [
      'drip',         // Капельный
      'sprinkler',    // Дождевание
      'flood',        // Поверхностный
      'none',         // Нет
      'other'         // Другое
    ],
    default: 'none'
  },
  
  plantingDate: {
    type: Date,
    default: null
  },
  
  expectedHarvestDate: {
    type: Date,
    default: null
  },
  
  actualHarvestDate: {
    type: Date,
    default: null
  },
  
  status: {
    type: String,
    enum: [
      'planning',     // Планирование
      'preparation',  // Подготовка
      'planted',      // Посажено
      'growing',      // Растет
      'flowering',    // Цветение
      'fruiting',     // Плодоношение
      'harvesting',   // Сбор урожая
      'harvested',    // Урожай собран
      'fallow',       // Под паром
      'problems'      // Проблемы
    ],
    default: 'planning'
  },
  
  currentYield: {
    type: Number,
    default: 0,
    min: [0, 'Урожайность не может быть отрицательной']
  },
  
  expectedYield: {
    type: Number,
    default: 0,
    min: [0, 'Ожидаемая урожайность не может быть отрицательной']
  },
  
  quality: {
    type: String,
    enum: ['excellent', 'good', 'average', 'poor', 'critical'],
    default: 'average'
  },
  
  // ✅ ОБЪЕДИНЯЕМ ДУБЛИКАТЫ sensor в один
  sensors: [{
    type: {
      type: String,
      enum: ['moisture', 'temperature', 'ph', 'nutrient'],
      required: true
    },
    deviceId: String,
    lastReading: Number,
    lastUpdate: Date,
    status: {
      type: String,
      enum: ['active', 'inactive', 'error'],
      default: 'active'
    }
  }],
  
  // ✅ ПРОСТЫЕ КООРДИНАТЫ (без геоиндекса)
  coordinates: {
    type: [{
      lat: Number,
      lng: Number
    }],
    default: []
  },
  
  notes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Заметки должны быть не более 1000 символов'],
    default: ''
  },
  
  images: [{
    url: { type: String },
    thumbnail: { type: String },
    description: { type: String },
    date: { type: Date, default: Date.now }
  }],
  
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Индексы (убираем location, так как его больше нет)
FieldSchema.index({ userId: 1 });
FieldSchema.index({ userId: 1, cropType: 1 });
FieldSchema.index({ userId: 1, status: 1 });

// Виртуальное поле для общего количества сенсоров
FieldSchema.virtual('sensorCount').get(function() {
  return this.sensors?.length || 0;
});

// Виртуальное поле для активных сенсоров
FieldSchema.virtual('activeSensors').get(function() {
  return this.sensors?.filter(sensor => sensor.status === 'active').length || 0;
});

// Виртуальное поле для возраста культуры (в днях)
FieldSchema.virtual('cropAge').get(function() {
  if (!this.plantingDate) return 0;
  const now = new Date();
  const planting = new Date(this.plantingDate);
  const diffTime = Math.abs(now - planting);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Виртуальное поле для дней до сбора урожая
FieldSchema.virtual('daysToHarvest').get(function() {
  if (!this.expectedHarvestDate) return null;
  const now = new Date();
  const harvest = new Date(this.expectedHarvestDate);
  const diffTime = harvest - now;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Виртуальное поле для площади в гектарах
FieldSchema.virtual('areaInHectares').get(function() {
  if (this.unit === 'hectare') return this.area;
  return this.area * 0.404686; // акры в гектары
});

// Предварительная обработка перед сохранением
FieldSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Автоматическое обновление статуса на основе дат
  if (this.plantingDate) {
    const plantingDate = new Date(this.plantingDate);
    const now = new Date();
    
    if (now < plantingDate) {
      this.status = 'planning';
    } else if (this.actualHarvestDate) {
      this.status = 'harvested';
    } else if (this.expectedHarvestDate && now > new Date(this.expectedHarvestDate)) {
      this.status = 'harvesting';
    } else if (this.plantingDate) {
      this.status = 'growing';
    }
  }
  
  next();
});

// Статический метод для получения статистики
FieldSchema.statics.getFieldStats = async function(userId) {
  const stats = await this.aggregate([
    {
      $match: { userId: new mongoose.Types.ObjectId(userId) }
    },
    {
      $group: {
        _id: null,
        totalFields: { $sum: 1 },
        totalArea: { $sum: '$area' },
        avgYield: { $avg: '$currentYield' },
        activeFields: {
          $sum: {
            $cond: [{ $eq: ['$isActive', true] }, 1, 0]
          }
        },
        crops: {
          $push: '$cropType'
        }
      }
    },
    {
      $project: {
        totalFields: 1,
        totalArea: 1,
        avgYield: 1,
        activeFields: 1,
        uniqueCrops: { $size: { $setUnion: ['$crops', []] } }
      }
    }
  ]);
  
  return stats[0] || {
    totalFields: 0,
    totalArea: 0,
    avgYield: 0,
    activeFields: 0,
    uniqueCrops: 0
  };
};

module.exports = mongoose.model('Field', FieldSchema);