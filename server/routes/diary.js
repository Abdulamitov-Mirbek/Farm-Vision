const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const diaryController = require('../controllers/diaryController');
const { protect, ownerMiddleware } = require('../middleware/authMiddleware'); // ✅ ИСПРАВЛЕНО: protect вместо authMiddleware

// Валидаторы
const createEntryValidator = [
  body('title')
    .trim()
    .notEmpty().withMessage('Заголовок обязателен')
    .isLength({ max: 200 }).withMessage('Заголовок должен быть не более 200 символов'),
  
  body('content')
    .trim()
    .notEmpty().withMessage('Содержание обязательно'),
  
  body('date')
    .optional()
    .isISO8601().withMessage('Некорректный формат даты'),
  
  body('activityType')
    .optional()
    .isIn([
      'sowing', 'watering', 'fertilizing', 'treatment',
      'harvesting', 'maintenance', 'inspection',
      'planning', 'other'
    ]).withMessage('Некорректный тип активности'),
  
  body('tags')
    .optional()
    .isArray().withMessage('Теги должны быть массивом'),
  
  body('tags.*')
    .optional()
    .isString().withMessage('Тег должен быть строкой')
    .trim()
    .isLength({ max: 50 }).withMessage('Тег должен быть не более 50 символов'),
  
  body('mood')
    .optional()
    .isIn(['excellent', 'good', 'normal', 'bad', 'terrible'])
    .withMessage('Некорректное значение настроения')
];

// Маршруты - ВСЕ ИСПРАВЛЕНО НА protect
router.get('/', protect, diaryController.getAllEntries);
router.get('/stats', protect, diaryController.getDiaryStats);
router.get('/search/tags', protect, diaryController.searchByTags);
router.get('/date/:date', protect, diaryController.getEntriesByDate);
router.post('/', protect, createEntryValidator, diaryController.createEntry);
router.get('/:id', protect, diaryController.getEntryById);
router.put('/:id', protect, createEntryValidator, diaryController.updateEntry);
router.delete('/:id', protect, diaryController.deleteEntry);

module.exports = router;