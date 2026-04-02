// server/models/Equipment.js
const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, default: 'tractor' },
  model: String,
  year: Number,
  status: { type: String, default: 'available' }
}, { timestamps: true });

module.exports = mongoose.model('Equipment', equipmentSchema);