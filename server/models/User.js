// server/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../config/auth'); // 👈 Импортируем из authConfig

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Имя пользователя обязательно'],
    unique: true,
    trim: true
  },
  
  email: {
    type: String,
    required: [true, 'Email обязателен'],
    unique: true,
    lowercase: true,
    trim: true
  },
  
  password: {
    type: String,
    required: [true, 'Пароль обязателен'],
    minlength: [6, 'Пароль должен быть не менее 6 символов'],
    select: false
  },
  
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  
  farmName: {
    type: String,
    default: ''
  },

  bio: {
    type: String,
    default: ''
  },
  
  location: {
    city: String,
    region: String,
    country: String
  },
  
  phone: {
    type: String,
    default: ''
  },
  
  avatar: {
    type: String,
    default: ''
  },
  
  isActive: {
    type: Boolean,
    default: true
  },
  
  lastLogin: Date,
  
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  verificationToken: String,
  
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Хеширование пароля перед сохранением
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Метод для сравнения пароля
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// ✅ ИСПРАВЛЕННЫЙ МЕТОД ДЛЯ ГЕНЕРАЦИИ ТОКЕНА
UserSchema.methods.generateAuthToken = function() {
  console.log('🎫 Generating token for user:', this._id);
  
  // Используем функцию из authConfig
  const token = generateToken(this._id);
  
  console.log('✅ Token generated successfully');
  return token;
};

// ✅ МЕТОД ДЛЯ ОБНОВЛЕНИЯ LAST LOGIN
UserSchema.methods.updateLastLogin = async function() {
  this.lastLogin = new Date();
  await this.save();
  return this;
};

module.exports = mongoose.model('User', UserSchema);