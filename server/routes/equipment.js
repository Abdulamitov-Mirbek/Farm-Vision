// server/routes/equipment.js
const express = require('express');
const router = express.Router();

// Временное хранилище техники в памяти
let equipment = [
  { 
    _id: '1', 
    name: 'Трактор John Deere', 
    type: 'tractor', 
    model: '8R 410',
    status: 'active',
    year: 2022,
    lastMaintenance: '2026-01-15',
    nextMaintenance: '2026-04-15',
    hoursUsed: 1240,
    fuelConsumption: 12.5,
    field: 'Северное поле'
  },
  { 
    _id: '2', 
    name: 'Комбайн Claas', 
    type: 'harvester', 
    model: 'LEXION 780',
    status: 'maintenance',
    year: 2021,
    lastMaintenance: '2026-02-01',
    nextMaintenance: '2026-03-01',
    hoursUsed: 850,
    fuelConsumption: 18.2,
    field: null
  },
  { 
    _id: '3', 
    name: 'Плуг Kverneland', 
    type: 'implement', 
    model: 'X Pro',
    status: 'active',
    year: 2023,
    lastMaintenance: '2026-01-20',
    nextMaintenance: '2026-05-20',
    hoursUsed: 320,
    field: 'Южное поле'
  }
];

// @desc    Получить всю технику
// @route   GET /api/equipment
router.get('/', (req, res) => {
  console.log('📥 Запрос всей техники');
  
  // Фильтрация по статусу, если есть
  let filteredEquipment = [...equipment];
  
  if (req.query.status) {
    filteredEquipment = filteredEquipment.filter(e => e.status === req.query.status);
  }
  
  if (req.query.type) {
    filteredEquipment = filteredEquipment.filter(e => e.type === req.query.type);
  }
  
  res.json({
    success: true,
    count: filteredEquipment.length,
    equipment: filteredEquipment
  });
});

// @desc    Получить статистику по технике
// @route   GET /api/equipment/stats
router.get('/stats', (req, res) => {
  console.log('📥 Запрос статистики техники');
  
  const stats = {
    total: equipment.length,
    active: equipment.filter(e => e.status === 'active').length,
    maintenance: equipment.filter(e => e.status === 'maintenance').length,
    broken: equipment.filter(e => e.status === 'broken').length,
    totalHours: equipment.reduce((sum, e) => sum + e.hoursUsed, 0),
    avgFuelConsumption: (equipment.reduce((sum, e) => sum + e.fuelConsumption, 0) / equipment.length).toFixed(1),
    maintenanceDue: equipment.filter(e => {
      const nextMaintenance = new Date(e.nextMaintenance);
      const today = new Date();
      const diffDays = Math.ceil((nextMaintenance - today) / (1000 * 60 * 60 * 24));
      return diffDays <= 7 && diffDays > 0;
    }).length,
    overdueMaintenance: equipment.filter(e => {
      const nextMaintenance = new Date(e.nextMaintenance);
      const today = new Date();
      return nextMaintenance < today;
    }).length
  };
  
  res.json({
    success: true,
    stats
  });
});

// @desc    Получить технику по ID
// @route   GET /api/equipment/:id
router.get('/:id', (req, res) => {
  console.log('📥 Запрос техники по ID:', req.params.id);
  
  const item = equipment.find(e => e._id === req.params.id);
  
  if (!item) {
    return res.status(404).json({
      success: false,
      message: 'Техника не найдена'
    });
  }
  
  res.json({
    success: true,
    equipment: item
  });
});

// @desc    Создать новую технику
// @route   POST /api/equipment
router.post('/', (req, res) => {
  console.log('📥 Создание новой техники:', req.body);
  
  // Проверка обязательных полей
  if (!req.body.name || !req.body.type) {
    return res.status(400).json({
      success: false,
      message: 'Название и тип техники обязательны'
    });
  }
  
  // Создаем новую запись
  const newEquipment = {
    _id: (equipment.length + 1).toString(),
    name: req.body.name,
    type: req.body.type,
    model: req.body.model || '',
    status: req.body.status || 'active',
    year: req.body.year || new Date().getFullYear(),
    lastMaintenance: req.body.lastMaintenance || new Date().toISOString().split('T')[0],
    nextMaintenance: req.body.nextMaintenance || '',
    hoursUsed: req.body.hoursUsed || 0,
    fuelConsumption: req.body.fuelConsumption || 0,
    field: req.body.field || null,
    createdAt: new Date().toISOString()
  };
  
  equipment.push(newEquipment);
  
  console.log('✅ Техника создана:', newEquipment);
  
  res.status(201).json({
    success: true,
    message: 'Техника успешно создана',
    equipment: newEquipment
  });
});

// @desc    Обновить технику
// @route   PUT /api/equipment/:id
router.put('/:id', (req, res) => {
  console.log('📥 Обновление техники:', req.params.id, req.body);
  
  const index = equipment.findIndex(e => e._id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: 'Техника не найдена'
    });
  }
  
  equipment[index] = {
    ...equipment[index],
    ...req.body,
    _id: req.params.id
  };
  
  res.json({
    success: true,
    message: 'Техника обновлена',
    equipment: equipment[index]
  });
});

// @desc    Удалить технику
// @route   DELETE /api/equipment/:id
router.delete('/:id', (req, res) => {
  console.log('📥 Удаление техники:', req.params.id);
  
  const index = equipment.findIndex(e => e._id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: 'Техника не найдена'
    });
  }
  
  equipment.splice(index, 1);
  
  res.json({
    success: true,
    message: 'Техника удалена'
  });
});

// @desc    Обновить статус техники
// @route   PATCH /api/equipment/:id/status
router.patch('/:id/status', (req, res) => {
  console.log('📥 Обновление статуса техники:', req.params.id, req.body.status);
  
  const index = equipment.findIndex(e => e._id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: 'Техника не найдена'
    });
  }
  
  if (!req.body.status) {
    return res.status(400).json({
      success: false,
      message: 'Статус обязателен'
    });
  }
  
  equipment[index].status = req.body.status;
  
  res.json({
    success: true,
    message: 'Статус обновлен',
    equipment: equipment[index]
  });
});

// @desc    Обновить местоположение техники (поле)
// @route   PATCH /api/equipment/:id/field
router.patch('/:id/field', (req, res) => {
  console.log('📥 Обновление поля техники:', req.params.id, req.body.field);
  
  const index = equipment.findIndex(e => e._id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: 'Техника не найдена'
    });
  }
  
  equipment[index].field = req.body.field || null;
  
  res.json({
    success: true,
    message: 'Поле техники обновлено',
    equipment: equipment[index]
  });
});

// @desc    Добавить запись о обслуживании
// @route   POST /api/equipment/:id/maintenance
router.post('/:id/maintenance', (req, res) => {
  console.log('📥 Добавление обслуживания для техники:', req.params.id, req.body);
  
  const index = equipment.findIndex(e => e._id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: 'Техника не найдена'
    });
  }
  
  // Обновляем даты обслуживания
  equipment[index].lastMaintenance = req.body.date || new Date().toISOString().split('T')[0];
  equipment[index].nextMaintenance = req.body.nextDate || '';
  
  // Добавляем запись в историю (если есть поле maintenanceHistory)
  if (!equipment[index].maintenanceHistory) {
    equipment[index].maintenanceHistory = [];
  }
  
  equipment[index].maintenanceHistory.push({
    date: req.body.date || new Date().toISOString().split('T')[0],
    description: req.body.description || 'Плановое ТО',
    cost: req.body.cost || 0
  });
  
  res.json({
    success: true,
    message: 'Обслуживание добавлено',
    equipment: equipment[index]
  });
});

module.exports = router;