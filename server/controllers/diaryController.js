// server/controllers/diaryController.js
const Diary = require('../models/Diary');
const Field = require('../models/Field');
const { validationResult } = require('express-validator');

/**
 * Получение всех записей дневника
 */
exports.getAllEntries = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      sortBy = 'date',
      sortOrder = 'desc',
      activityType,
      fieldId,
      startDate,
      endDate,
      search,
      tags
    } = req.query;
    
    const query = { userId: req.user._id };
    
    // Фильтры
    if (activityType) query.activityType = activityType;
    if (fieldId) query.fieldId = fieldId;
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim().toLowerCase());
      query.tags = { $in: tagArray };
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Пагинация
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };
    
    const entries = await Diary.find(query)
      .populate('fieldId', 'name')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Diary.countDocuments(query);
    
    res.json({
      success: true,
      entries,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
    
  } catch (error) {
    console.error('Ошибка получения записей:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера при получении записей.'
    });
  }
};

/**
 * Создание новой записи
 */
/**
 * Создание новой записи
 */
exports.createEntry = async (req, res) => {
  try {
    console.log('\n========== СОЗДАНИЕ ЗАПИСИ ==========');
    console.log('📥 Полученные данные:', JSON.stringify(req.body, null, 2));
    console.log('👤 Пользователь ID:', req.user._id);
    
    // Проверка валидации
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('❌ Ошибки валидации:', errors.array());
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    
    const {
      title,
      content,
      date,
      fieldId,
      activityType,
      weatherConditions,
      tags,
      metrics,
      isImportant,
      mood,
      location
    } = req.body;
    
    // Проверяем существование поля (если указано)
    if (fieldId) {
      const field = await Field.findOne({ 
        _id: fieldId, 
        userId: req.user._id 
      });
      
      if (!field) {
        console.log('❌ Поле не найдено:', fieldId);
        return res.status(404).json({
          success: false,
          message: 'Поле не найдено или у вас нет к нему доступа.'
        });
      }
    }
    
    // Создаем новую запись
    const entryData = {
      userId: req.user._id,
      title,
      content,
      date: date || new Date(),
      fieldId,
      activityType: activityType || 'other',
      weatherConditions: weatherConditions || {},
      tags: tags ? tags.map(tag => tag.trim().toLowerCase()) : [],
      metrics: metrics || {},
      isImportant: isImportant || false,
      mood: mood || 'normal',
      location: location || null
    };
    
    console.log('📦 Данные для сохранения:', JSON.stringify(entryData, null, 2));
    
    const entry = new Diary(entryData);
    await entry.save();
    
    // Заполняем поле
    await entry.populate('fieldId', 'name');
    
    console.log('✅ Запись создана с ID:', entry._id);
    console.log('============================================\n');
    
    res.status(201).json({
      success: true,
      message: 'Запись успешно создана.',
      entry
    });
    
  } catch (error) {
    console.error('\n❌ ОШИБКА СОЗДАНИЯ ЗАПИСИ:');
    console.error('Имя ошибки:', error.name);
    console.error('Сообщение:', error.message);
    
    if (error.name === 'ValidationError') {
      console.error('Ошибки валидации:', error.errors);
      return res.status(400).json({
        success: false,
        message: 'Ошибка валидации',
        errors: error.errors
      });
    }
    
    console.error('Стек:', error.stack);
    console.error('============================================\n');
    
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера при создании записи.'
    });
  }
};
/**
 * Получение записи по ID
 */
exports.getEntryById = async (req, res) => {
  try {
    const entry = await Diary.findById(req.params.id)
      .populate('fieldId', 'name');
    
    if (!entry) {
      return res.status(404).json({
        success: false,
        message: 'Запись не найдена.'
      });
    }
    
    // Проверяем, принадлежит ли запись текущему пользователю
    if (entry.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'У вас нет доступа к этой записи.'
      });
    }
    
    res.json({
      success: true,
      entry
    });
    
  } catch (error) {
    console.error('Ошибка получения записи:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера при получении записи.'
    });
  }
};

/**
 * Обновление записи
 */
exports.updateEntry = async (req, res) => {
  try {
    // Проверка валидации
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    
    const entry = await Diary.findById(req.params.id);
    
    if (!entry) {
      return res.status(404).json({
        success: false,
        message: 'Запись не найдена.'
      });
    }
    
    // Проверяем, принадлежит ли запись текущему пользователю
    if (entry.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'У вас нет доступа к этой записи.'
      });
    }
    
    const {
      title,
      content,
      date,
      fieldId,
      activityType,
      weatherConditions,
      tags,
      metrics,
      isImportant,
      mood,
      location
    } = req.body;
    
    // Проверяем поле если обновляется
    if (fieldId && fieldId !== entry.fieldId?.toString()) {
      const field = await Field.findOne({ 
        _id: fieldId, 
        userId: req.user._id 
      });
      
      if (!field) {
        return res.status(404).json({
          success: false,
          message: 'Поле не найдено или у вас нет к нему доступа.'
        });
      }
      entry.fieldId = fieldId;
    }
    
    // Обновляем поля
    if (title !== undefined) entry.title = title;
    if (content !== undefined) entry.content = content;
    if (date !== undefined) entry.date = date;
    if (activityType !== undefined) entry.activityType = activityType;
    if (weatherConditions !== undefined) entry.weatherConditions = weatherConditions;
    if (tags !== undefined) entry.tags = tags.map(tag => tag.trim().toLowerCase());
    if (metrics !== undefined) entry.metrics = { ...entry.metrics, ...metrics };
    if (isImportant !== undefined) entry.isImportant = isImportant;
    if (mood !== undefined) entry.mood = mood;
    if (location !== undefined) entry.location = location;
    
    await entry.save();
    await entry.populate('fieldId', 'name');
    
    res.json({
      success: true,
      message: 'Запись успешно обновлена.',
      entry
    });
    
  } catch (error) {
    console.error('Ошибка обновления записи:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера при обновлении записи.'
    });
  }
};

/**
 * Удаление записи
 */
exports.deleteEntry = async (req, res) => {
  try {
    const entry = await Diary.findById(req.params.id);
    
    if (!entry) {
      return res.status(404).json({
        success: false,
        message: 'Запись не найдена.'
      });
    }
    
    // Проверяем, принадлежит ли запись текущему пользователю
    if (entry.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'У вас нет доступа к этой записи.'
      });
    }
    
    await entry.deleteOne();
    
    res.json({
      success: true,
      message: 'Запись успешно удалена.'
    });
    
  } catch (error) {
    console.error('Ошибка удаления записи:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера при удалении записи.'
    });
  }
};

/**
 * Получение записей по дате
 */
exports.getEntriesByDate = async (req, res) => {
  try {
    const { date } = req.params;
    
    const targetDate = new Date(date);
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);
    
    const entries = await Diary.find({
      userId: req.user._id,
      date: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    })
    .populate('fieldId', 'name')
    .sort({ date: -1 });
    
    res.json({
      success: true,
      entries,
      date: targetDate.toISOString().split('T')[0],
      count: entries.length
    });
    
  } catch (error) {
    console.error('Ошибка получения записей по дате:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера при получении записей по дате.'
    });
  }
};

/**
 * Получение статистики дневника
 */
exports.getDiaryStats = async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    
    const stats = await Diary.getStats(req.user._id, period);
    
    const recentEntries = await Diary.find({ userId: req.user._id })
      .sort({ date: -1 })
      .limit(5)
      .populate('fieldId', 'name');
    
    const frequentTags = await Diary.aggregate([
      { $match: { userId: req.user._id } },
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);
    
    const activityStats = await Diary.aggregate([
      { $match: { userId: req.user._id } },
      { $group: { 
        _id: '$activityType', 
        count: { $sum: 1 },
        lastDate: { $max: '$date' }
      } },
      { $sort: { count: -1 } }
    ]);
    
    res.json({
      success: true,
      stats: {
        periodStats: stats,
        recentEntries,
        frequentTags,
        activityStats,
        totalEntries: await Diary.countDocuments({ userId: req.user._id })
      }
    });
    
  } catch (error) {
    console.error('Ошибка получения статистики дневника:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера при получении статистики.'
    });
  }
};

/**
 * Поиск по тегам
 */
exports.searchByTags = async (req, res) => {
  try {
    const { tags, page = 1, limit = 20 } = req.query;
    
    if (!tags) {
      return res.status(400).json({
        success: false,
        message: 'Необходимо указать теги для поиска.'
      });
    }
    
    const tagArray = tags.split(',').map(tag => tag.trim().toLowerCase());
    
    const query = {
      userId: req.user._id,
      tags: { $in: tagArray }
    };
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const entries = await Diary.find(query)
      .populate('fieldId', 'name')
      .sort({ date: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Diary.countDocuments(query);
    
    res.json({
      success: true,
      entries,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      },
      searchTags: tagArray
    });
    
  } catch (error) {
    console.error('Ошибка поиска по тегам:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера при поиске по тегам.'
    });
  }
};

// В самом конце файла добавьте (если ещё нет):

module.exports = {
  getAllEntries: exports.getAllEntries,
  getDiaryStats: exports.getDiaryStats,
  searchByTags: exports.searchByTags,
  getEntriesByDate: exports.getEntriesByDate,
  createEntry: exports.createEntry,
  getEntryById: exports.getEntryById,
  updateEntry: exports.updateEntry,
  deleteEntry: exports.deleteEntry
};