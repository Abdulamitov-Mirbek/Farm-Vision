// server/controllers/taskController.js
const Task = require('../models/Task');
const NotificationService = require('../services/notificationService');

// Создание задачи
exports.createTask = async (req, res) => {
  try {
    const task = new Task({
      userId: req.user._id,
      title: req.body.title,
      description: req.body.description,
      priority: req.body.priority,
      dueDate: req.body.dueDate,
      status: 'pending'
    });
    
    await task.save();
    
    // 🔔 Уведомление о новой задаче
    await NotificationService.taskCreated(req.user._id, task);
    
    // Если задача срочная, добавим еще одно уведомление
    if (task.priority === 'high' || task.priority === 'critical') {
      await NotificationService.criticalAlert(
        req.user._id,
        'Срочная задача',
        `Создана срочная задача: "${task.title}"`,
        `/tasks/${task._id}`
      );
    }
    
    res.status(201).json({ success: true, task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Обновление задачи (например, завершение)
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    const oldStatus = task.status;
    task.status = req.body.status || task.status;
    task.completedAt = req.body.status === 'completed' ? new Date() : task.completedAt;
    
    await task.save();
    
    // 🔔 Если задача завершена
    if (task.status === 'completed' && oldStatus !== 'completed') {
      await NotificationService.taskCompleted(req.user._id, task);
    }
    
    res.json({ success: true, task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Получить задачи с проверкой на приближающийся дедлайн
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user._id });
    
    // Проверяем задачи, у которых скоро дедлайн
    const today = new Date();
    for (const task of tasks) {
      if (task.dueDate && task.status === 'pending') {
        const dueDate = new Date(task.dueDate);
        const daysLeft = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
        
        // Если до дедлайна 3,2,1 день - отправляем уведомление
        if (daysLeft <= 3 && daysLeft > 0) {
          // Проверяем, не отправляли ли уже сегодня
          const lastNotification = await Notification.findOne({
            userId: req.user._id,
            'data.taskId': task._id,
            type: 'task',
            createdAt: { $gte: new Date().setHours(0,0,0,0) }
          });
          
          if (!lastNotification) {
            await NotificationService.taskDueSoon(req.user._id, task, daysLeft);
          }
        }
      }
    }
    
    res.json({ success: true, tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};