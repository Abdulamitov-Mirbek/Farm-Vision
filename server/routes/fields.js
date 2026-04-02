// server/routes/fields.js
const express = require('express');
const router = express.Router();

// Хранилище полей в памяти (для теста)
let fields = [
  { _id: '1', name: 'Северное поле', area: 45.2, cropType: 'wheat', soilType: 'chernozem', status: 'growing' },
  { _id: '2', name: 'Южное поле', area: 38.7, cropType: 'corn', soilType: 'loam', status: 'planted' }
];

// GET - получить все поля
router.get('/', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Fields API работает!',
    fields: fields 
  });
});

// GET - статистика полей
router.get('/stats', (req, res) => {
  const totalFields = fields.length;
  const totalArea = fields.reduce((sum, f) => sum + f.area, 0);
  const activeFields = fields.filter(f => f.status !== 'harvested').length;
  
  res.json({ 
    success: true, 
    stats: {
      totalFields,
      totalArea,
      activeFields,
      avgYield: 42.5
    }
  });
});

// ✅ POST - создать новое поле (ИСПРАВЛЕНО)
router.post('/', (req, res) => {
  console.log('📥 Получены данные для создания поля:', req.body);
  
  // Проверка обязательных полей
  if (!req.body.name || !req.body.area) {
    return res.status(400).json({
      success: false,
      message: 'Название и площадь поля обязательны'
    });
  }
  
  // Создаем новое поле
  const newField = {
    _id: (fields.length + 1).toString(),
    name: req.body.name,
    area: Number(req.body.area),
    cropType: req.body.cropType || 'other',
    soilType: req.body.soilType || 'other',
    status: 'planning',
    plantingDate: req.body.plantingDate || null,
    expectedHarvestDate: req.body.expectedHarvestDate || null,
    description: req.body.description || '',
    createdAt: new Date().toISOString()
  };
  
  // Добавляем в массив
  fields.push(newField);
  
  console.log('✅ Поле создано:', newField);
  
  res.status(201).json({ 
    success: true, 
    message: 'Поле успешно создано',
    field: newField
  });
});

// GET - получить одно поле по ID
router.get('/:id', (req, res) => {
  const field = fields.find(f => f._id === req.params.id);
  
  if (!field) {
    return res.status(404).json({
      success: false,
      message: 'Поле не найдено'
    });
  }
  
  res.json({ 
    success: true, 
    field 
  });
});

// PUT - обновить поле
router.put('/:id', (req, res) => {
  const index = fields.findIndex(f => f._id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: 'Поле не найдено'
    });
  }
  
  fields[index] = { ...fields[index], ...req.body, _id: req.params.id };
  
  res.json({ 
    success: true, 
    message: 'Поле обновлено',
    field: fields[index]
  });
});

// DELETE - удалить поле
router.delete('/:id', (req, res) => {
  const index = fields.findIndex(f => f._id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: 'Поле не найдено'
    });
  }
  
  fields.splice(index, 1);
  
  res.json({ 
    success: true, 
    message: 'Поле удалено' 
  });
});

// PATCH - обновить статус поля
router.patch('/:id/status', (req, res) => {
  const index = fields.findIndex(f => f._id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: 'Поле не найдено'
    });
  }
  
  if (!req.body.status) {
    return res.status(400).json({
      success: false,
      message: 'Статус обязателен'
    });
  }
  
  fields[index].status = req.body.status;
  
  res.json({ 
    success: true, 
    message: 'Статус обновлен',
    field: fields[index]
  });
});

module.exports = router;