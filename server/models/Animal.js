// server/models/Animal.js
const mongoose = require('mongoose');

const animalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,  // ✅ Только одна строка!
    required: true
  },
  type: {
    type: String,
    enum: ['cattle', 'sheep', 'goat', 'horse', 'poultry'],
    default: 'cattle'
  },
  breed: {
    type: String,
    default: ''
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
    default: 'female'
  },
  birthDate: {
    type: Date
  },
  weight: {
    type: Number,
    default: 0
  },
  health: {
    type: String,
    enum: ['excellent', 'good', 'warning', 'critical'],
    default: 'good'
  },
  location: {
    type: String,
    default: ''
  },
  notes: {
    type: String,
    default: ''
  },
  // Для КРС
  milk: {
    type: Number,
    default: 0
  },
  pregnant: {
    type: Boolean,
    default: false
  },
  dueDate: Date,
  // Для овец
  wool: {
    type: Number,
    default: 0
  },
  // Для птицы
  eggsPerWeek: {
    type: Number,
    default: 0
  },
  vaccinations: [{
    name: String,
    date: Date,
    nextDate: Date,
    notes: String
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Animal', animalSchema);