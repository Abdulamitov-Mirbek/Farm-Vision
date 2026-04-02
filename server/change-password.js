// server/change-password.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function changePassword() {
  try {
    // Подключаемся к MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Подключено к MongoDB');
    
    const db = mongoose.connection.db;
    const users = db.collection('users');
    
    // Хешируем новый пароль
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash('123456', salt);
    
    // Обновляем пароль администратора
    const result = await users.updateOne(
      { email: "mmrek07@gmail.com" },
      { $set: { password: hash } }
    );
    
    if (result.modifiedCount > 0) {
      console.log('✅ Пароль успешно изменен на "123456" для mmrek07@gmail.com');
    } else {
      console.log('❌ Пользователь не найден');
    }
    
  } catch (error) {
    console.error('❌ Ошибка:', error);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Отключено от MongoDB');
  }
}

changePassword();