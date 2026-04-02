// server/routes/weather.js
const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weatherController');
const { protect } = require('../middleware/authMiddleware');

// Маршруты погоды
router.get('/current', protect, weatherController.getCurrentWeather);
router.get('/forecast', protect, weatherController.getWeatherForecast);
router.get('/history', protect, weatherController.getHistoricalWeather);
router.get('/alerts', protect, weatherController.getWeatherAlerts);

// Маршруты для конкретных местоположений
router.get('/location/:lat/:lon', protect, weatherController.getWeatherByLocation);
router.get('/fields/:fieldId', protect, weatherController.getWeatherForField);

module.exports = router;