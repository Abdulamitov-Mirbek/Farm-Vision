// server/controllers/weeklyTaskController.js
const WeeklyTask = require('../models/WeeklyTask');
const Field = require('../models/Field');

// Получить все еженедельные задачи
exports.getAllTasks = async (req, res) => {
  try {
    const { dayOfWeek, status, category } = req.query;
    
    const query = { userId: req.user._id };
    
    if (dayOfWeek !== undefined) query.dayOfWeek = parseInt(dayOfWeek);
    if (status) query.status = status;
    if (category) query.category = category;
    
    const tasks = await WeeklyTask.find(query)
      .populate('fieldId', 'name cropType')
      .sort({ dayOfWeek: 1, priority: -1 });
    
    // Группируем задачи по дням недели
    const days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
    const tasksByDay = {};
    
    days.forEach((day, index) => {
      tasksByDay[day] = {
        dayIndex: index,
        tasks: tasks.filter(t => t.dayOfWeek === index)
      };
    });
    
    const stats = await WeeklyTask.getStats(req.user._id);
    
    res.json({
      success: true,
      tasksByDay,
      allTasks: tasks,
      stats
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
    const taskData = {
      userId: req.user._id,
      title: req.body.title,
      description: req.body.description || '',
      dayOfWeek: req.body.dayOfWeek,
      priority: req.body.priority || 'medium',
      category: req.body.category || 'other',
      estimatedHours: req.body.estimatedHours || 1,
      recurring: req.body.recurring || false,
      tags: req.body.tags || [],
      notes: req.body.notes || ''
    };
    
    // Проверяем поле если указано
    if (req.body.fieldId) {
      const field = await Field.findOne({
        _id: req.body.fieldId,
        userId: req.user._id
      });
      
      if (field) {
        taskData.fieldId = req.body.fieldId;
      }
    }
    
    const task = new WeeklyTask(taskData);
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

// Обновить задачу
exports.updateTask = async (req, res) => {
  try {
    const task = await WeeklyTask.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    
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

// Отметить задачу как выполненную
exports.completeTask = async (req, res) => {
  try {
    const task = await WeeklyTask.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      {
        status: 'completed',
        completedAt: new Date()
      },
      { new: true }
    );
    
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
    console.error('Ошибка завершения задачи:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Удалить задачу
exports.deleteTask = async (req, res) => {
  try {
    const task = await WeeklyTask.findOneAndDelete({
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

// Получить статистику
exports.getTaskStats = async (req, res) => {
  try {
    const stats = await WeeklyTask.getStats(req.user._id);
    
    // Задачи по дням
    const tasksByDay = await WeeklyTask.aggregate([
      { $match: { userId: req.user._id } },
      {
        $group: {
          _id: '$dayOfWeek',
          total: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    // Задачи по приоритетам
    const tasksByPriority = await WeeklyTask.aggregate([
      { $match: { userId: req.user._id } },
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      }
    ]);
    
    res.json({
      success: true,
      stats,
      tasksByDay,
      tasksByPriority
    });
  } catch (error) {
    console.error('Ошибка получения статистики:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};