const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware'); // ✅ ИСПРАВЛЕНО: protect вместо authMiddleware

// Маршруты
router.get('/overview', protect, analyticsController.getOverview);
router.get('/financial', protect, analyticsController.getFinancialAnalytics);
router.get('/yield', protect, analyticsController.getYieldAnalytics);
router.get('/field/:fieldId', protect, analyticsController.getFieldAnalytics);
router.get('/crop/:cropType', protect, analyticsController.getCropAnalytics);
router.get('/seasonal', protect, analyticsController.getSeasonalAnalytics);

// Отчеты
router.get('/reports', protect, analyticsController.getReports);
router.post('/reports/generate', protect, analyticsController.generateReport);
router.get('/reports/:id', protect, analyticsController.getReport);
router.delete('/reports/:id', protect, analyticsController.deleteReport);

// Экспорт данных
router.get('/export', protect, analyticsController.exportData);

module.exports = router;