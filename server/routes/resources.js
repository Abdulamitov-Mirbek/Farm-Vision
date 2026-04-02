// server/routes/resources.js
const express = require('express');
const router = express.Router();
const Resource = require('../models/Resource');
const { protect } = require('../middleware/authMiddleware');

// @desc    Создать новый ресурс
// @route   POST /api/resources
router.post('/', protect, async (req, res) => {
  try {
    console.log('\n========== СОЗДАНИЕ РЕСУРСА ==========');
    console.log('📥 Получены данные:', JSON.stringify(req.body, null, 2));
    console.log('👤 Пользователь ID:', req.user._id);

    // ✅ ЗАЩИТА: создаем базовую структуру с значениями по умолчанию
    const resourceData = {
      userId: req.user._id,
      name: {
        ru: req.body.name?.ru || 'Новый ресурс',
        en: req.body.name?.en || 'New resource',
        kg: req.body.name?.kg || 'Жаңы ресурс'
      },
      category: req.body.category || 'seeds',
      quantity: Number(req.body.quantity) || 0,
      unit: {
        ru: req.body.unit?.ru || 'кг',
        en: req.body.unit?.en || 'kg',
        kg: req.body.unit?.kg || 'кг'
      },
      minStock: Number(req.body.minStock) || 0,
      maxStock: Number(req.body.maxStock) || 100,
      price: Number(req.body.price) || 0,
      supplier: {
        ru: req.body.supplier?.ru || '',
        en: req.body.supplier?.en || '',
        kg: req.body.supplier?.kg || ''
      },
      expiryDate: req.body.expiryDate || null,
      location: {
        ru: req.body.location?.ru || '',
        en: req.body.location?.en || '',
        kg: req.body.location?.kg || ''
      },
      notes: req.body.notes || ''
    };

    console.log('📦 Подготовленные данные:', JSON.stringify(resourceData, null, 2));

    const resource = new Resource(resourceData);
    await resource.save();

    console.log('✅ Ресурс успешно создан с ID:', resource._id);
    console.log('=====================================\n');

    res.status(201).json({
      success: true,
      resource
    });
  } catch (error) {
    console.error('\n❌ ОШИБКА СОЗДАНИЯ РЕСУРСА:');
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
    
    console.error('Стек ошибки:', error.stack);
    
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// ... остальные маршруты остаются без изменений ...

// @desc    Получить все ресурсы пользователя
// @route   GET /api/resources
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { category, status, search } = req.query;
    let query = { userId: req.user._id };

    // Фильтрация по категории
    if (category && category !== 'all') {
      query.category = category;
    }

    // Фильтрация по статусу
    if (status && status !== 'all') {
      query.status = status;
    }

    // Поиск по названию
    if (search) {
      query.$or = [
        { 'name.ru': { $regex: search, $options: 'i' } },
        { 'name.en': { $regex: search, $options: 'i' } },
        { 'name.kg': { $regex: search, $options: 'i' } }
      ];
    }

    const resources = await Resource.find(query).sort({ createdAt: -1 });
    
    // Статистика
    const stats = {
      total: resources.length,
      totalValue: resources.reduce((sum, r) => sum + r.totalValue, 0),
      byCategory: {},
      byStatus: {
        good: resources.filter(r => r.status === 'good').length,
        warning: resources.filter(r => r.status === 'warning').length,
        critical: resources.filter(r => r.status === 'critical').length
      }
    };

    // Подсчет по категориям
    resources.forEach(r => {
      if (!stats.byCategory[r.category]) {
        stats.byCategory[r.category] = 0;
      }
      stats.byCategory[r.category]++;
    });

    res.json({
      success: true,
      resources,
      stats
    });
  } catch (error) {
    console.error('Ошибка получения ресурсов:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @desc    Получить один ресурс
// @route   GET /api/resources/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const resource = await Resource.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Ресурс не найден'
      });
    }

    res.json({
      success: true,
      resource
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @desc    Создать новый ресурс
// @route   POST /api/resources
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const resourceData = {
      ...req.body,
      userId: req.user._id
    };

    const resource = new Resource(resourceData);
    await resource.save();

    res.status(201).json({
      success: true,
      resource
    });
  } catch (error) {
    console.error('Ошибка создания ресурса:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @desc    Обновить ресурс
// @route   PUT /api/resources/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const resource = await Resource.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Ресурс не найден'
      });
    }

    res.json({
      success: true,
      resource
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @desc    Обновить количество ресурса
// @route   PATCH /api/resources/:id/quantity
// @access  Private
router.patch('/:id/quantity', protect, async (req, res) => {
  try {
    const { change } = req.body;
    const resource = await Resource.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Ресурс не найден'
      });
    }

    resource.quantity = Math.max(0, resource.quantity + change);
    await resource.save();

    res.json({
      success: true,
      resource
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @desc    Удалить ресурс
// @route   DELETE /api/resources/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const result = await Resource.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Ресурс не найден'
      });
    }

    res.json({
      success: true,
      message: 'Ресурс удален'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @desc    Получить статистику ресурсов
// @route   GET /api/resources/stats/summary
// @access  Private
router.get('/stats/summary', protect, async (req, res) => {
  try {
    const resources = await Resource.find({ userId: req.user._id });

    const stats = {
      totalResources: resources.length,
      totalValue: resources.reduce((sum, r) => sum + r.totalValue, 0),
      lowStock: resources.filter(r => r.status !== 'good').length,
      expiringSoon: resources.filter(r => {
        if (!r.expiryDate) return false;
        const daysLeft = Math.ceil((new Date(r.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
        return daysLeft > 0 && daysLeft <= 30;
      }).length,
      byCategory: {},
      totalQuantity: resources.reduce((sum, r) => sum + r.quantity, 0)
    };

    resources.forEach(r => {
      if (!stats.byCategory[r.category]) {
        stats.byCategory[r.category] = 0;
      }
      stats.byCategory[r.category]++;
    });

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;