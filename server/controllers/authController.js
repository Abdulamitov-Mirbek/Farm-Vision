// server/controllers/authController.js
const User = require('../models/User');
const { generateToken } = require('../config/auth');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

/**
 * Регистрация нового пользователя
 */
exports.register = async (req, res) => {
  try {
    // Проверка валидации
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    
    const { username, email, password, farmName, location, phone, role } = req.body;
    
    // Проверяем, существует ли пользователь с таким email
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: 'Пользователь с таким email уже существует.'
      });
    }
    
    // Проверяем, существует ли пользователь с таким username
    user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({
        success: false,
        message: 'Пользователь с таким именем уже существует.'
      });
    }
    
    // Создаем нового пользователя
    user = new User({
      username,
      email,
      password,
      farmName: farmName || '',
      location: location || '',
      phone: phone || '',
      role: role || 'worker',
      isActive: true
    });
    
    await user.save();
    
    // Генерируем токен
    const token = user.generateAuthToken();
    
    // Получаем пользователя без пароля
    const userResponse = await User.findById(user._id).select('-password');
    
    res.status(201).json({
      success: true,
      message: 'Регистрация успешна!',
      token,
      user: {
        id: userResponse._id,
        name: userResponse.username,
        email: userResponse.email,
        phone: userResponse.phone || '',
        farmName: userResponse.farmName || '',
        role: userResponse.role,
        avatar: userResponse.avatar || '',
        bio: userResponse.bio || '',
        location: userResponse.location || '',
        createdAt: userResponse.createdAt
      }
    });
    
  } catch (error) {
    console.error('❌ Ошибка регистрации:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера при регистрации.'
    });
  }
};

/**
 * Вход пользователя
 */
exports.login = async (req, res) => {
  try {
    console.log('🔵 ========== LOGIN ATTEMPT ==========');
    console.log('📦 Request body:', req.body);
    
    // Проверка валидации
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('❌ Validation errors:', errors.array());
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    
    const { email, password } = req.body;
    console.log('📧 Email:', email);
    
    // Находим пользователя по email
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      console.log('❌ User not found with email:', email);
      return res.status(401).json({
        success: false,
        message: 'Неверный email или пароль.'
      });
    }
    
    console.log('✅ User found:', {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role
    });
    
    // Проверяем активность аккаунта
    if (!user.isActive) {
      console.log('❌ User is not active:', email);
      return res.status(401).json({
        success: false,
        message: 'Учетная запись заблокирована. Обратитесь к администратору.'
      });
    }
    
    // Проверяем пароль
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      console.log('❌ Invalid password for user:', email);
      return res.status(401).json({
        success: false,
        message: 'Неверный email или пароль.'
      });
    }
    
    // Обновляем время последнего входа
    await user.updateLastLogin();
    
    // Генерируем токен
    const token = user.generateAuthToken();
    
    console.log('✅ Login successful for:', email);
    console.log('🔵 ========== LOGIN SUCCESS ==========');
    
    res.json({
      success: true,
      message: 'Вход выполнен успешно!',
      token,
      user: {
        id: user._id,
        name: user.username,
        email: user.email,
        phone: user.phone || '',
        farmName: user.farmName || '',
        role: user.role,
        avatar: user.avatar || '',
        bio: user.bio || '',
        location: user.location || '',
        createdAt: user.createdAt
      }
    });
    
  } catch (error) {
    console.error('🔴 ========== LOGIN ERROR ==========');
    console.error('❌ Error:', error);
    console.error('❌ Stack:', error.stack);
    
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера при входе.'
    });
  }
};

/**
 * Получение информации о текущем пользователе
 */
exports.getMe = async (req, res) => {
  try {
    console.log('🔵 ===== authController.getMe =====');
    console.log('User ID from req.user:', req.user?._id);
    
    if (!req.user || !req.user._id) {
      console.log('❌ No user in request');
      return res.status(401).json({
        success: false,
        message: 'Не авторизован'
      });
    }
    
    // Находим пользователя
    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
      console.log('❌ User not found');
      return res.status(404).json({
        success: false,
        message: 'Пользователь не найден.'
      });
    }
    
    console.log('✅ User found:', user.email);
    
    // Форматируем ответ для фронтенда
    const userResponse = {
      id: user._id,
      name: user.username,
      email: user.email,
      phone: user.phone || '',
      farmName: user.farmName || '',
      role: user.role || 'worker',
      avatar: user.avatar || '',
      bio: user.bio || '',
      location: user.location || '',
      createdAt: user.createdAt,
      isActive: user.isActive
    };
    
    console.log('✅ Sending user response');
    
    res.json({
      success: true,
      user: userResponse
    });
    
  } catch (error) {
    console.error('🔴 Ошибка получения пользователя:', error);
    console.error('Stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера при получении информации о пользователе.'
    });
  }
};

/**
 * Обновление профиля пользователя
 */
exports.updateProfile = async (req, res) => {
  try {
    console.log('🔵 ===== authController.updateProfile =====');
    console.log('User ID:', req.user._id);
    console.log('Request body:', req.body);
    
    // Получаем все данные из тела запроса
    const updates = req.body;
    
    // Поля для обновления
    const updateFields = {};
    
    // Маппинг полей (фронт -> бэк)
    if (updates.name !== undefined && updates.name !== req.user.username) {
      // Проверяем уникальность username
      const existingUser = await User.findOne({ 
        username: updates.name, 
        _id: { $ne: req.user._id } 
      });
      
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Пользователь с таким именем уже существует.'
        });
      }
      updateFields.username = updates.name;
    }
    
    // Email
    if (updates.email !== undefined && updates.email !== req.user.email) {
      const existingUser = await User.findOne({ 
        email: updates.email, 
        _id: { $ne: req.user._id } 
      });
      
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Пользователь с таким email уже существует.'
        });
      }
      updateFields.email = updates.email;
    }
    
    // Остальные поля
    if (updates.phone !== undefined) updateFields.phone = updates.phone;
    if (updates.farmName !== undefined) updateFields.farmName = updates.farmName;
    if (updates.bio !== undefined) updateFields.bio = updates.bio;
    if (updates.location !== undefined) updateFields.location = updates.location;
    if (updates.avatar !== undefined) updateFields.avatar = updates.avatar;
    
    console.log('Update fields to apply:', updateFields);
    
    // Проверяем, есть ли что обновлять
    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Нет данных для обновления'
      });
    }
    
    // Обновляем пользователя
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Пользователь не найден'
      });
    }
    
    console.log('✅ User updated successfully');
    
    // Форматируем ответ для фронтенда
    const userResponse = {
      id: user._id,
      name: user.username,
      email: user.email,
      phone: user.phone || '',
      farmName: user.farmName || '',
      role: user.role,
      avatar: user.avatar || '',
      bio: user.bio || '',
      location: user.location || '',
      createdAt: user.createdAt
    };
    
    res.json({
      success: true,
      message: 'Профиль успешно обновлен.',
      user: userResponse
    });
    
  } catch (error) {
    console.error('🔴 Ошибка обновления профиля:', error);
    
    // Обработка специфических ошибок MongoDB
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        message: field === 'email' ? 'Email уже используется' : 
                field === 'username' ? 'Имя пользователя уже используется' : 
                'Данные уже существуют'
      });
    }
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера при обновлении профиля.'
    });
  }
};

/**
 * Смена пароля
 */
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Получаем пользователя с паролем
    const user = await User.findById(req.user._id).select('+password');
    
    // Проверяем текущий пароль
    const isPasswordValid = await user.comparePassword(currentPassword);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Текущий пароль неверен.'
      });
    }
    
    // Обновляем пароль
    user.password = newPassword;
    await user.save();
    
    // Генерируем новый токен
    const token = user.generateAuthToken();
    
    res.json({
      success: true,
      message: 'Пароль успешно изменен.',
      token
    });
    
  } catch (error) {
    console.error('❌ Ошибка смены пароля:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера при смене пароля.'
    });
  }
};

/**
 * Запрос на сброс пароля
 */
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Пользователь с таким email не найден.'
      });
    }
    
    // Генерируем токен для сброса пароля
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // Сохраняем хеш токена и время его действия
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 минут
    
    await user.save();
    
    // В реальном приложении здесь бы отправлялось письмо
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;
    
    res.json({
      success: true,
      message: 'Инструкции по сбросу пароля отправлены на email.',
      resetToken: process.env.NODE_ENV === 'development' ? resetToken : undefined,
      resetUrl: process.env.NODE_ENV === 'development' ? resetUrl : undefined
    });
    
  } catch (error) {
    console.error('❌ Ошибка запроса сброса пароля:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера при запросе сброса пароля.'
    });
  }
};

/**
 * Сброс пароля
 */
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    // Хешируем полученный токен для сравнения
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');
    
    // Находим пользователя по токену и проверяем время его действия
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Недействительный или истекший токен сброса пароля.'
      });
    }
    
    // Устанавливаем новый пароль
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    
    await user.save();
    
    // Генерируем новый токен авторизации
    const authToken = user.generateAuthToken();
    
    res.json({
      success: true,
      message: 'Пароль успешно изменен.',
      token: authToken
    });
    
  } catch (error) {
    console.error('❌ Ошибка сброса пароля:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера при сбросе пароля.'
    });
  }
};

/**
 * Выход пользователя (на стороне сервера просто возвращаем успех)
 */
exports.logout = async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Выход выполнен успешно.'
    });
    
  } catch (error) {
    console.error('❌ Ошибка выхода:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера при выходе.'
    });
  }
};

/**
 * Удаление учетной записи
 */
exports.deleteAccount = async (req, res) => {
  try {
    const { password } = req.body;
    
    // Проверяем пароль
    const user = await User.findById(req.user._id).select('+password');
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Неверный пароль.'
      });
    }
    
    // Помечаем пользователя как неактивного
    user.isActive = false;
    await user.save();
    
    res.json({
      success: true,
      message: 'Учетная запись успешно удалена.'
    });
    
  } catch (error) {
    console.error('❌ Ошибка удаления учетной записи:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера при удалении учетной записи.'
    });
  }
};