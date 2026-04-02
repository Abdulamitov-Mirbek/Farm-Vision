// server/controllers/taskController.js
const Task = require('../models/Task');

// Получить все задачи
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user._id })
      .populate('fieldId', 'name')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      tasks
    });
  } catch (error) {
    console.error('Ошибка получения задач:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Создать задачу
exports.createTask = async (req, res) => {
  try {
    console.log('📥 Создание задачи, данные:', req.body);
    
    const taskData = {
      userId: req.user._id,
      title: req.body.title,
      description: req.body.description || '',
      type: req.body.type || 'other',
      priority: req.body.priority || 'medium',
      status: req.body.status || 'pending',
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      fieldId: req.body.fieldId || null,
      estimatedCost: req.body.estimatedCost || 0,
      notes: req.body.notes || ''
    };

    const task = new Task(taskData);
    await task.save();

    res.status(201).json({
      success: true,
      task
    });
  } catch (error) {
    console.error('Ошибка создания задачи:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Получить задачу по ID
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.user._id
    }).populate('fieldId', 'name');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Задача не найдена'
      });
    }

    res.json({
      success: true,
      task
    });
  } catch (error) {
    console.error('Ошибка получения задачи:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Обновить задачу
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    ).populate('fieldId', 'name');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Задача не найдена'
      });
    }

    res.json({
      success: true,
      task
    });
  } catch (error) {
    console.error('Ошибка обновления задачи:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Обновить статус задачи
exports.updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { status },
      { new: true }
    ).populate('fieldId', 'name');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Задача не найдена'
      });
    }

    res.json({
      success: true,
      task
    });
  } catch (error) {
    console.error('Ошибка обновления статуса:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Удалить задачу
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Задача не найдена'
      });
    }

    res.json({
      success: true,
      message: 'Задача удалена'
    });
  } catch (error) {
    console.error('Ошибка удаления задачи:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Получить статистику задач
exports.getTaskStats = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user._id });
    
    const stats = {
      total: tasks.length,
      completed: tasks.filter(t => t.status === 'completed').length,
      pending: tasks.filter(t => t.status === 'pending').length,
      inProgress: tasks.filter(t => t.status === 'in_progress').length,
      overdue: tasks.filter(t => {
        if (t.status === 'completed') return false;
        return new Date(t.endDate) < new Date();
      }).length
    };

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Ошибка получения статистики:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};