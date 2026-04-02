// server/controllers/workPlanController.js
const WorkPlan = require('../models/WorkPlan');
const Task = require('../models/Task');

// Получить все планы работ
exports.getAllPlans = async (req, res) => {
  try {
    const { period, status, startDate, endDate } = req.query;
    
    const query = { userId: req.user._id };
    
    if (period) query.period = period;
    if (status) query.status = status;
    if (startDate || endDate) {
      query.startDate = {};
      if (startDate) query.startDate.$gte = new Date(startDate);
      if (endDate) query.endDate.$lte = new Date(endDate);
    }
    
    const plans = await WorkPlan.find(query)
      .populate('tasks.taskId', 'title priority status')
      .sort({ startDate: -1 });
    
    res.json({
      success: true,
      plans
    });
  } catch (error) {
    console.error('Ошибка получения планов:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Создать план
exports.createPlan = async (req, res) => {
  try {
    console.log('📥 Создание плана:', req.body);
    
    const planData = {
      userId: req.user._id,
      title: req.body.title,
      description: req.body.description || '',
      period: req.body.period,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      tasks: req.body.tasks || [],
      resources: req.body.resources || [],
      weather: req.body.weather || { favorable: true },
      status: req.body.status || 'draft',
      notes: req.body.notes || ''
    };
    
    const plan = new WorkPlan(planData);
    await plan.save();
    
    res.status(201).json({
      success: true,
      plan
    });
  } catch (error) {
    console.error('Ошибка создания плана:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Получить план по ID
exports.getPlanById = async (req, res) => {
  try {
    const plan = await WorkPlan.findOne({
      _id: req.params.id,
      userId: req.user._id
    }).populate('tasks.taskId', 'title priority status fieldId');
    
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'План не найден'
      });
    }
    
    res.json({
      success: true,
      plan
    });
  } catch (error) {
    console.error('Ошибка получения плана:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Обновить план
exports.updatePlan = async (req, res) => {
  try {
    const plan = await WorkPlan.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'План не найден'
      });
    }
    
    res.json({
      success: true,
      plan
    });
  } catch (error) {
    console.error('Ошибка обновления плана:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Обновить статус плана
exports.updatePlanStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const plan = await WorkPlan.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { 
        status,
        completedAt: status === 'completed' ? new Date() : null
      },
      { new: true }
    );
    
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'План не найден'
      });
    }
    
    res.json({
      success: true,
      plan
    });
  } catch (error) {
    console.error('Ошибка обновления статуса:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Удалить план
exports.deletePlan = async (req, res) => {
  try {
    const plan = await WorkPlan.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'План не найден'
      });
    }
    
    res.json({
      success: true,
      message: 'План удален'
    });
  } catch (error) {
    console.error('Ошибка удаления плана:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Добавить задачу в план
exports.addTaskToPlan = async (req, res) => {
  try {
    const { taskId } = req.body;
    
    const task = await Task.findOne({
      _id: taskId,
      userId: req.user._id
    });
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Задача не найдена'
      });
    }
    
    const plan = await WorkPlan.findOne({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'План не найден'
      });
    }
    
    // Добавляем задачу в план
    plan.tasks.push({
      taskId: task._id,
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.endDate,
      estimatedHours: task.estimatedHours || 0,
      status: task.status
    });
    
    await plan.save();
    
    res.json({
      success: true,
      plan
    });
  } catch (error) {
    console.error('Ошибка добавления задачи:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Обновить статус задачи в плане
exports.updateTaskStatus = async (req, res) => {
  try {
    const { planId, taskIndex } = req.params;
    const { status } = req.body;
    
    const plan = await WorkPlan.findOne({
      _id: planId,
      userId: req.user._id
    });
    
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'План не найден'
      });
    }
    
    if (!plan.tasks[taskIndex]) {
      return res.status(404).json({
        success: false,
        message: 'Задача не найдена в плане'
      });
    }
    
    plan.tasks[taskIndex].status = status;
    if (status === 'completed') {
      plan.tasks[taskIndex].completedAt = new Date();
    }
    
    await plan.save();
    
    res.json({
      success: true,
      plan
    });
  } catch (error) {
    console.error('Ошибка обновления статуса задачи:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};