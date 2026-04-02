// server/controllers/notificationController.js
const Notification = require('../models/Notification');

// Получить все уведомления пользователя
exports.getAllNotifications = async (req, res) => {
  try {
    const { type, read, priority, limit = 50, page = 1 } = req.query;
    
    const query = { userId: req.user._id };
    
    if (type) query.type = type;
    if (read !== undefined) query.read = read === 'true';
    if (priority) query.priority = priority;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({ 
      userId: req.user._id, 
      read: false 
    });
    
    const stats = await Notification.getStats(req.user._id);
    
    res.json({
      success: true,
      notifications,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      },
      unreadCount,
      stats
    });
  } catch (error) {
    console.error('Ошибка получения уведомлений:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Получить одно уведомление
exports.getNotificationById = async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!notification) {
      return res.status(404).json({ 
        success: false, 
        message: 'Уведомление не найдено' 
      });
    }
    
    res.json({ success: true, notification });
  } catch (error) {
    console.error('Ошибка получения уведомления:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Создать уведомление (обычно вызывается из других контроллеров)
exports.createNotification = async (req, res) => {
  try {
    const notificationData = {
      userId: req.body.userId || req.user._id,
      type: req.body.type,
      title: req.body.title,
      message: req.body.message,
      icon: req.body.icon || getIconForType(req.body.type),
      priority: req.body.priority || 'medium',
      link: req.body.link,
      data: req.body.data || {},
      expiresAt: req.body.expiresAt
    };
    
    const notification = new Notification(notificationData);
    await notification.save();
    
    // Если запрос пришел через API, возвращаем ответ
    if (req.body.returnResponse) {
      res.status(201).json({ success: true, notification });
    } else {
      return notification;
    }
  } catch (error) {
    console.error('Ошибка создания уведомления:', error);
    if (req.body.returnResponse) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

// Отметить уведомление как прочитанное
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!notification) {
      return res.status(404).json({ 
        success: false, 
        message: 'Уведомление не найдено' 
      });
    }
    
    await notification.markAsRead();
    
    const unreadCount = await Notification.countDocuments({ 
      userId: req.user._id, 
      read: false 
    });
    
    res.json({ 
      success: true, 
      notification,
      unreadCount
    });
  } catch (error) {
    console.error('Ошибка отметки уведомления:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Отметить все уведомления как прочитанные
exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.markAllAsRead(req.user._id);
    
    res.json({ 
      success: true, 
      message: 'Все уведомления отмечены как прочитанные',
      unreadCount: 0
    });
  } catch (error) {
    console.error('Ошибка отметки всех уведомлений:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Удалить уведомление
exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!notification) {
      return res.status(404).json({ 
        success: false, 
        message: 'Уведомление не найдено' 
      });
    }
    
    const unreadCount = await Notification.countDocuments({ 
      userId: req.user._id, 
      read: false 
    });
    
    res.json({ 
      success: true, 
      message: 'Уведомление удалено',
      unreadCount
    });
  } catch (error) {
    console.error('Ошибка удаления уведомления:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Удалить все прочитанные уведомления
exports.clearAllRead = async (req, res) => {
  try {
    const result = await Notification.deleteMany({
      userId: req.user._id,
      read: true
    });
    
    res.json({ 
      success: true, 
      message: `Удалено ${result.deletedCount} уведомлений`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Ошибка удаления уведомлений:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Получить статистику
exports.getStats = async (req, res) => {
  try {
    const stats = await Notification.getStats(req.user._id);
    
    res.json({ success: true, stats });
  } catch (error) {
    console.error('Ошибка получения статистики:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Вспомогательная функция для получения иконки по типу
function getIconForType(type) {
  const icons = {
    task: '📋',
    weather: '🌤️',
    harvest: '🌾',
    animals: '🐄',
    equipment: '🚜',
    system: '⚙️',
    warning: '⚠️',
    info: 'ℹ️',
    success: '✅'
  };
  return icons[type] || '🔔';
}