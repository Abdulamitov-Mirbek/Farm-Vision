// server/routes/animals.js
const express = require('express');
const router = express.Router();
const Animal = require('../models/Animal');
const { protect } = require('../middleware/authMiddleware');

// Получить всех животных
router.get('/', protect, async (req, res) => {
  try {
    const animals = await Animal.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, animals });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ✅ Добавьте этот маршрут для статистики
router.get('/stats/summary', protect, async (req, res) => {
  try {
    const animals = await Animal.find({ userId: req.user._id });

    const stats = {
      total: animals.length,
      cattle: animals.filter(a => a.type === 'cattle').length,
      sheep: animals.filter(a => a.type === 'sheep').length,
      goats: animals.filter(a => a.type === 'goat').length,
      poultry: animals.filter(a => a.type === 'poultry').length,
      horses: animals.filter(a => a.type === 'horse').length,
      health: {
        excellent: animals.filter(a => a.health === 'excellent').length,
        good: animals.filter(a => a.health === 'good').length,
        warning: animals.filter(a => a.health === 'warning').length,
        critical: animals.filter(a => a.health === 'critical').length
      },
      pregnant: animals.filter(a => a.pregnant).length,
      totalMilk: animals.reduce((sum, a) => sum + (a.milk || 0), 0),
      totalWool: animals.reduce((sum, a) => sum + (a.wool || 0), 0),
      totalEggs: animals.reduce((sum, a) => sum + (a.eggsPerWeek || 0), 0)
    };

    res.json({ success: true, stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Создать животное
router.post('/', protect, async (req, res) => {
  try {
    console.log('📥 Получены данные:', req.body);
    
    const animalData = {
      ...req.body,
      userId: req.user._id
    };

    const animal = new Animal(animalData);
    await animal.save();
    
    res.status(201).json({ success: true, animal });
  } catch (error) {
    console.error('❌ Ошибка создания:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Обновить здоровье
router.patch('/:id/health', protect, async (req, res) => {
  try {
    const { health, notes } = req.body;
    const animal = await Animal.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!animal) {
      return res.status(404).json({ success: false, message: 'Животное не найдено' });
    }

    animal.health = health;
    if (notes) animal.notes = notes;
    await animal.save();

    res.json({ success: true, animal });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Добавить вакцинацию
router.post('/:id/vaccinations', protect, async (req, res) => {
  try {
    const animal = await Animal.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!animal) {
      return res.status(404).json({ success: false, message: 'Животное не найдено' });
    }

    animal.vaccinations.push(req.body);
    await animal.save();

    res.json({ success: true, animal });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Удалить животное
router.delete('/:id', protect, async (req, res) => {
  try {
    const animal = await Animal.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.user._id 
    });
    
    if (!animal) {
      return res.status(404).json({ 
        success: false, 
        message: 'Животное не найдено' 
      });
    }
    
    res.json({ success: true, message: 'Животное удалено' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;