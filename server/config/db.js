// server/config/db.js
const mongoose = require('mongoose');
require('dotenv').config();

const connectToDatabase = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    
    console.log(`✅ MongoDB Atlas подключен: ${conn.connection.host}`);
    console.log(`📊 База данных: ${conn.connection.name}`);

    // Создаем индексы для всех моделей
    await createIndexes();

    // Обработчики событий
    mongoose.connection.on('error', (err) => {
      console.error('❌ Ошибка MongoDB:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB отключен');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB переподключен');
    });

    return conn;
  } catch (error) {
    console.error('❌ Ошибка подключения к MongoDB:', error);
    process.exit(1);
  }
};

// Создание индексов
const createIndexes = async () => {
  try {
    // Проверяем существование моделей перед созданием индексов
    const User = require('../models/User');
    await User.collection.createIndex({ email: 1 }, { unique: true });
    await User.collection.createIndex({ username: 1 }, { unique: true });
    
    console.log('✅ Индексы пользователей созданы');
  } catch (error) {
    console.log('⚠️ Ошибка при создании индексов:', error.message);
  }
};

const closeDatabase = async () => {
  try {
    await mongoose.connection.close();
    console.log('🔌 Соединение с MongoDB закрыто');
  } catch (error) {
    console.error('❌ Ошибка при закрытии соединения:', error);
  }
};

module.exports = {
  connectToDatabase,
  closeDatabase,
  getConnection: () => mongoose.connection
};