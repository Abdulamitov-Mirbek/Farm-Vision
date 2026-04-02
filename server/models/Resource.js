// server/models/Resource.js
const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    ru: { type: String, required: true, default: 'Новый ресурс' },
    en: { type: String, required: true, default: 'New resource' },
    kg: { type: String, required: true, default: 'Жаңы ресурс' }
  },
  category: {
    type: String,
    enum: ['seeds', 'fertilizers', 'fuel', 'chemicals', 'spareparts', 'packaging'],
    required: true,
    default: 'seeds'
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  unit: {
    ru: { type: String, required: true, default: 'кг' },
    en: { type: String, required: true, default: 'kg' },
    kg: { type: String, required: true, default: 'кг' }
  },
  minStock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  maxStock: {
    type: Number,
    required: true,
    min: 0,
    default: 100
  },
  price: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  totalValue: {
    type: Number,
    min: 0,
    default: 0
  },
  supplier: {
    ru: { type: String, default: '' },
    en: { type: String, default: '' },
    kg: { type: String, default: '' }
  },
  expiryDate: {
    type: Date,
    default: null
  },
  location: {
    ru: { type: String, default: '' },
    en: { type: String, default: '' },
    kg: { type: String, default: '' }
  },
  status: {
    type: String,
    enum: ['good', 'warning', 'critical'],
    default: 'good'
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Вычисление статуса и общей стоимости перед сохранением
resourceSchema.pre('save', function(next) {
  if (this.maxStock > 0) {
    const percentage = (this.quantity / this.maxStock) * 100;
    if (percentage <= 20) {
      this.status = 'critical';
    } else if (percentage <= 50) {
      this.status = 'warning';
    } else {
      this.status = 'good';
    }
  }
  this.totalValue = this.quantity * this.price;
  next();
});

module.exports = mongoose.model('Resource', resourceSchema);