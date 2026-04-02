// server/controllers/fieldController.js
const Field = require('../models/Field');
const Diary = require('../models/Diary');
const Task = require('../models/Task');
const { validationResult } = require('express-validator');

/**
 * Получение всех полей пользователя
 */
exports.getAllFields = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      sortBy = 'name',
      sortOrder = 'asc',
      search,
      cropType,
      status,
      minArea,
      maxArea
    } = req.query;
    
    const query = { userId: req.user._id, isActive: true };
    
    // Поиск по названию
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Фильтрация по типу культуры
    if (cropType && cropType !== 'all') {
      query.cropType = cropType;
    }
    
    // Фильтрация по статусу
    if (status && status !== 'all') {
      query.status = status;
    }
    
    // Фильтрация по площади
    if (minArea || maxArea) {
      query.area = {};
      if (minArea) query.area.$gte = parseFloat(minArea);
      if (maxArea) query.area.$lte = parseFloat(maxArea);
    }
    
    // Параметры пагинации и сортировки
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };
    
    // Получаем поля
    const fields = await Field.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));
    
    // Получаем общее количество полей
    const total = await Field.countDocuments(query);
    
    // Получаем статистику
    const stats = await Field.getFieldStats(req.user._id);
    
    // Получаем распределение по культурам
    const cropDistribution = await Field.aggregate([
      { $match: { userId: req.user._id, isActive: true } },
      { $group: { _id: '$cropType', count: { $sum: 1 }, totalArea: { $sum: '$area' } } },
      { $sort: { count: -1 } }
    ]);
    
    res.json({
      success: true,
      fields,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      },
      stats: {
        ...stats,
        cropDistribution
      }
    });
    
  } catch (error) {
    console.error('❌ Ошибка получения полей:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера при получении полей.'
    });
  }
};

/**
 * Получение статистики по полям (общая)
 */
exports.getFieldStatistics = async (req, res) => {
  try {
    console.log('📊 Запрос статистики для пользователя:', req.user._id);
    
    // Получаем все активные поля пользователя
    const fields = await Field.find({ userId: req.user._id, isActive: true });
    
    // Базовая статистика
    const stats = {
      totalFields: fields.length,
      totalArea: fields.reduce((sum, f) => sum + (f.area || 0), 0),
      activeFields: fields.filter(f => 
        ['planted', 'growing', 'flowering', 'fruiting'].includes(f.status)
      ).length,
      avgYield: 0,
      uniqueCrops: 0,
      byCropType: {},
      byStatus: {},
      problemFields: 0
    };
    
    // Собираем уникальные культуры
    const crops = new Set();
    
    fields.forEach(f => {
      if (f.cropType) crops.add(f.cropType);
      
      // Статистика по типам культур
      stats.byCropType[f.cropType] = (stats.byCropType[f.cropType] || 0) + 1;
      
      // Статистика по статусам
      stats.byStatus[f.status] = (stats.byStatus[f.status] || 0) + 1;
      
      // Поля с проблемами
      if (f.status === 'problems') stats.problemFields++;
    });
    
    stats.uniqueCrops = crops.size;
    
    // Средняя урожайность
    const totalYield = fields.reduce((sum, f) => sum + (f.currentYield || 0), 0);
    stats.avgYield = fields.length > 0 ? (totalYield / fields.length).toFixed(1) : 0;
    
    // Ближайшие сборы урожая
    const today = new Date();
    const upcomingHarvests = fields
      .filter(f => f.expectedHarvestDate && new Date(f.expectedHarvestDate) > today)
      .sort((a, b) => new Date(a.expectedHarvestDate) - new Date(b.expectedHarvestDate))
      .slice(0, 5)
      .map(f => ({
        id: f._id,
        name: f.name,
        cropType: f.cropType,
        expectedHarvestDate: f.expectedHarvestDate,
        daysLeft: Math.ceil((new Date(f.expectedHarvestDate) - today) / (1000 * 60 * 60 * 24))
      }));
    
    stats.upcomingHarvests = upcomingHarvests;
    
    console.log('✅ Статистика отправлена');
    
    res.json({
      success: true,
      stats
    });
    
  } catch (error) {
    console.error('❌ Ошибка получения статистики:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера при получении статистики'
    });
  }
};

/**
 * Создание нового поля
 */
exports.createField = async (req, res) => {
  try {
    console.log('\n========== СОЗДАНИЕ ПОЛЯ ==========');
    console.log('📥 Полученные данные:', JSON.stringify(req.body, null, 2));
    console.log('👤 Пользователь ID:', req.user._id);

    // Проверка валидации
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    // Подготавливаем данные с значениями по умолчанию
    const fieldData = {
      userId: req.user._id,
      name: req.body.name,
      description: req.body.description || '',
      area: parseFloat(req.body.area) || 0,
      unit: req.body.unit || 'hectare',
      cropType: req.body.cropType,
      cropVariety: req.body.cropVariety || '',
      soilType: req.body.soilType,
      irrigationSystem: req.body.irrigationSystem || 'none',
      plantingDate: req.body.plantingDate || null,
      expectedHarvestDate: req.body.expectedHarvestDate || null,
      status: req.body.status || 'planning',
      coordinates: req.body.coordinates || [],
      sensors: req.body.sensors || [],
      notes: req.body.notes || '',
      images: req.body.images || [],
      isActive: true
    };

    console.log('📦 Подготовленные данные:', JSON.stringify(fieldData, null, 2));

    const field = new Field(fieldData);
    await field.save();

    console.log('✅ Поле создано с ID:', field._id);
    console.log('=====================================\n');

    res.status(201).json({
      success: true,
      field
    });

  } catch (error) {
    console.error('\n❌ ОШИБКА СОЗДАНИЯ ПОЛЯ:');
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
    console.error('=====================================\n');
    
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Получение поля по ID
 */
exports.getFieldById = async (req, res) => {
  try {
    const field = await Field.findOne({
      _id: req.params.id,
      userId: req.user._id,
      isActive: true
    }).populate({
      path: 'userId',
      select: 'username farmName'
    });
    
    if (!field) {
      return res.status(404).json({
        success: false,
        message: 'Поле не найдено.'
      });
    }
    
    // Получаем последние записи дневника для этого поля
    const recentDiaryEntries = await Diary.find({
      userId: req.user._id,
      fieldId: field._id
    })
    .sort({ date: -1 })
    .limit(5)
    .select('title date activityType');
    
    // Получаем активные задачи для этого поля
    const activeTasks = await Task.find({
      userId: req.user._id,
      fieldId: field._id,
      status: { $in: ['pending', 'in_progress'] }
    })
    .sort({ startDate: 1 })
    .limit(5)
    .select('title type priority status startDate endDate');
    
    res.json({
      success: true,
      field,
      relatedData: {
        recentDiaryEntries,
        activeTasks
      }
    });
    
  } catch (error) {
    console.error('❌ Ошибка получения поля:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера при получении поля.'
    });
  }
};

/**
 * Обновление поля
 */
exports.updateField = async (req, res) => {
  try {
    // Проверка валидации
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    
    const field = await Field.findOne({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!field) {
      return res.status(404).json({
        success: false,
        message: 'Поле не найдено.'
      });
    }
    
    // Проверяем уникальность названия (если изменяется)
    if (req.body.name && req.body.name !== field.name) {
      const existingField = await Field.findOne({ 
        name: req.body.name, 
        userId: req.user._id,
        _id: { $ne: field._id }
      });
      
      if (existingField) {
        return res.status(400).json({
          success: false,
          message: 'Поле с таким названием уже существует.'
        });
      }
    }
    
    // Обновляем поля
    const updatableFields = [
      'name', 'description', 'area', 'unit', 'cropType', 'cropVariety',
      'soilType', 'irrigationSystem', 'plantingDate', 'expectedHarvestDate',
      'actualHarvestDate', 'status', 'currentYield', 'expectedYield',
      'quality', 'coordinates', 'notes', 'images', 'isActive'
    ];
    
    updatableFields.forEach(fieldName => {
      if (req.body[fieldName] !== undefined) {
        if (fieldName === 'area' || fieldName === 'currentYield' || fieldName === 'expectedYield') {
          field[fieldName] = parseFloat(req.body[fieldName]);
        } else {
          field[fieldName] = req.body[fieldName];
        }
      }
    });
    
    await field.save();
    
    res.json({
      success: true,
      message: 'Поле успешно обновлено.',
      field
    });
    
  } catch (error) {
    console.error('❌ Ошибка обновления поля:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера при обновлении поля.'
    });
  }
};

/**
 * Обновление статуса поля
 */
exports.updateFieldStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const field = await Field.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { status },
      { new: true }
    );
    
    if (!field) {
      return res.status(404).json({
        success: false,
        message: 'Поле не найдено.'
      });
    }
    
    res.json({
      success: true,
      field
    });
    
  } catch (error) {
    console.error('❌ Ошибка обновления статуса:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера при обновлении статуса.'
    });
  }
};

/**
 * Удаление поля
 */
exports.deleteField = async (req, res) => {
  try {
    const field = await Field.findOne({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!field) {
      return res.status(404).json({
        success: false,
        message: 'Поле не найдено.'
      });
    }
    
    // Проверяем, есть ли связанные записи
    const hasDiaryEntries = await Diary.exists({ fieldId: field._id });
    const hasTasks = await Task.exists({ fieldId: field._id });
    
    if (hasDiaryEntries || hasTasks) {
      // Вместо удаления, помечаем поле как неактивное
      field.isActive = false;
      await field.save();
      
      return res.json({
        success: true,
        message: 'Поле помечено как неактивное, так как есть связанные данные.'
      });
    }
    
    // Если нет связанных данных, удаляем полностью
    await field.deleteOne();
    
    res.json({
      success: true,
      message: 'Поле успешно удалено.'
    });
    
  } catch (error) {
    console.error('❌ Ошибка удаления поля:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера при удалении поля.'
    });
  }
};

/**
 * Добавление сенсора к полю
 */
exports.addSensor = async (req, res) => {
  try {
    const field = await Field.findOne({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!field) {
      return res.status(404).json({
        success: false,
        message: 'Поле не найдено.'
      });
    }
    
    const { type, deviceId } = req.body;
    
    // Проверяем, существует ли уже сенсор с таким deviceId
    const existingSensor = field.sensors.find(s => s.deviceId === deviceId);
    
    if (existingSensor) {
      return res.status(400).json({
        success: false,
        message: 'Сенсор с таким deviceId уже существует.'
      });
    }
    
    // Добавляем новый сенсор
    field.sensors.push({
      type,
      deviceId,
      lastReading: 0,
      lastUpdate: new Date(),
      status: 'active'
    });
    
    await field.save();
    
    res.json({
      success: true,
      message: 'Сенсор успешно добавлен.',
      field
    });
    
  } catch (error) {
    console.error('❌ Ошибка добавления сенсора:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера при добавлении сенсора.'
    });
  }
};

/**
 * Обновление показаний сенсора
 */
exports.updateSensorReading = async (req, res) => {
  try {
    const field = await Field.findOne({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!field) {
      return res.status(404).json({
        success: false,
        message: 'Поле не найдено.'
      });
    }
    
    const sensorId = req.params.sensorId;
    const { reading } = req.body;
    
    // Находим сенсор
    const sensor = field.sensors.id(sensorId);
    
    if (!sensor) {
      return res.status(404).json({
        success: false,
        message: 'Сенсор не найден.'
      });
    }
    
    // Обновляем показания
    sensor.lastReading = reading;
    sensor.lastUpdate = new Date();
    
    await field.save();
    
    res.json({
      success: true,
      message: 'Показания сенсора обновлены.',
      sensor
    });
    
  } catch (error) {
    console.error('❌ Ошибка обновления показаний сенсора:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера при обновлении показаний сенсора.'
    });
  }
};