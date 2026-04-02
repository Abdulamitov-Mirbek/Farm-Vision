const User = require('../models/User');

// ============= ОПРЕДЕЛЯЕМ ФУНКЦИИ КАК ОБЫЧНЫЕ ПЕРЕМЕННЫЕ =============

// @desc    Получить всех пользователей (только для админов)
// @route   GET /api/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    console.log('📋 Получение всех пользователей');
    const users = await User.find({}).select('-password');
    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error('❌ Ошибка getAllUsers:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Получить пользователя по ID (только для админов)
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Пользователь не найден'
      });
    }
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('❌ Ошибка getUserById:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Обновить пользователя (только для админов)
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = async (req, res) => {
  try {
    const updates = req.body;
    delete updates.password; // Не обновляем пароль через этот маршрут
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Пользователь не найден'
      });
    }
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('❌ Ошибка updateUser:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Удалить пользователя (только для админов)
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Пользователь не найден'
      });
    }
    
    res.json({
      success: true,
      message: 'Пользователь удален'
    });
  } catch (error) {
    console.error('❌ Ошибка deleteUser:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ============= МАРШРУТЫ ДЛЯ ТЕКУЩЕГО ПОЛЬЗОВАТЕЛЯ =============

// @desc    Получить свой профиль
// @route   GET /api/users/profile
// @access  Private
const getMyProfile = async (req, res) => {
  try {
    console.log('👤 Получение профиля пользователя:', req.user.id);
    
    const user = await User.findById(req.user.id).select('-password -twoFactorSecret -twoFactorTempSecret -recoveryCodes -biometricCredentials');
    
    if (!user) {
      console.log('❌ Пользователь не найден');
      return res.status(404).json({
        success: false,
        message: 'Пользователь не найден'
      });
    }
    
    // Форматируем ответ для фронтенда
    const userResponse = {
      id: user._id,
      name: user.username,
      email: user.email,
      phone: user.phone || '',
      farmName: user.farmName || '',
      bio: user.bio || '',
      avatar: user.avatar || '',
      role: user.role,
      location: user.location || { city: '', region: '', country: '' },
      settings: user.settings || {},
      createdAt: user.createdAt
    };
    
    console.log('✅ Профиль отправлен');
    
    res.json({
      success: true,
      data: userResponse
    });
  } catch (error) {
    console.error('❌ Ошибка getMyProfile:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Обновить свой профиль
// @route   PUT /api/users/profile
// @access  Private
// @desc    Обновить свой профиль
// @route   PUT /api/users/profile
// @access  Private
const updateMyProfile = async (req, res) => {
  try {
    console.log('🔵 ===== НАЧАЛО ОБНОВЛЕНИЯ ПРОФИЛЯ =====');
    console.log('🔵 req.user.id:', req.user.id);
    console.log('🔵 req.body:', JSON.stringify(req.body, null, 2));
    
    const userId = req.user.id;
    
    // ✅ ТОЛЬКО эти поля можно обновлять
    const allowedFields = ['username', 'email', 'phone', 'farmName', 'bio', 'avatar'];
    const updates = {};
    
    // Маппинг: если фронт отправляет 'name', сохраняем в 'username'
    if (req.body.name) updates.username = req.body.name;
    if (req.body.email) updates.email = req.body.email;
    if (req.body.phone) updates.phone = req.body.phone;
    if (req.body.farmName) updates.farmName = req.body.farmName;
    if (req.body.bio) updates.bio = req.body.bio;
    if (req.body.avatar) updates.avatar = req.body.avatar;
    
    console.log('🟡 Обновляемые поля:', updates);
    
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'Пользователь не найден'
      });
    }
    
    // Форматируем ответ
    const userResponse = {
      id: updatedUser._id,
      name: updatedUser.username,
      email: updatedUser.email,
      phone: updatedUser.phone || '',
      farmName: updatedUser.farmName || '',
      bio: updatedUser.bio || '',
      avatar: updatedUser.avatar || '',
      role: updatedUser.role,
      createdAt: updatedUser.createdAt
    };
    
    res.json({
      success: true,
      data: userResponse,
      message: 'Профиль успешно обновлен'
    });
    
  } catch (error) {
    console.error('🔴 Ошибка:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Получить статистику пользователя
// @route   GET /api/users/me/stats
// @access  Private
const getUserStats = async (req, res) => {
  try {
    console.log('📊 Получение статистики для пользователя:', req.user.id);
    
    // Здесь можно добавить реальную статистику из базы данных
    const stats = {
      totalFields: 4,
      totalTasks: 156,
      completedTasks: 142,
      totalHours: 1245,
      achievements: 8
    };
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('❌ Ошибка getUserStats:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Получить активности пользователя
// @route   GET /api/users/me/activities
// @access  Private
const getUserActivities = async (req, res) => {
  try {
    console.log('📋 Получение активностей для пользователя:', req.user.id);
    
    const activities = [
      { id: 1, action: 'Обновил профиль', time: '2 часа назад' },
      { id: 2, action: 'Добавил новое поле', time: 'Вчера' },
      { id: 3, action: 'Завершил задачу', time: '3 дня назад' }
    ];
    
    res.json({
      success: true,
      data: activities
    });
  } catch (error) {
    console.error('❌ Ошибка getUserActivities:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ============= ЭКСПОРТ ВСЕХ ФУНКЦИЙ =============
module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getMyProfile,
  updateMyProfile,
  getUserStats,
  getUserActivities
};