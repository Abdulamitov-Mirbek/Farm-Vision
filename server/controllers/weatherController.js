// server/controllers/weatherController.js
const weatherService = require('../services/weatherService');
const Field = require('../models/Field');

exports.getCurrentWeather = async (req, res) => {
  try {
    const lat = req.query.lat || 55.7558;
    const lon = req.query.lon || 37.6173;
    
    const weather = await weatherService.getCurrentWeather(lat, lon);
    
    res.json({
      success: true,
      weather,
      location: { lat: parseFloat(lat), lon: parseFloat(lon) }
    });
  } catch (error) {
    console.error('Ошибка получения погоды:', error);
    res.status(500).json({ success: false, message: 'Ошибка получения данных о погоде.' });
  }
};

exports.getWeatherForecast = async (req, res) => {
  try {
    const lat = req.query.lat || 55.7558;
    const lon = req.query.lon || 37.6173;
    const days = parseInt(req.query.days) || 5;
    
    const forecast = await weatherService.getForecast(lat, lon, days);
    
    res.json({
      success: true,
      forecast,
      days,
      location: { lat: parseFloat(lat), lon: parseFloat(lon) }
    });
  } catch (error) {
    console.error('Ошибка получения прогноза:', error);
    res.status(500).json({ success: false, message: 'Ошибка получения прогноза погоды.' });
  }
};

exports.getHistoricalWeather = async (req, res) => {
  try {
    const { location, startDate, endDate } = req.query;
    res.json({
      message: 'Historical weather data',
      location: location || 'Default location',
      startDate: startDate || '2024-01-01',
      endDate: endDate || '2024-12-31',
      data: [
        { date: '2024-01-01', temp: 20, humidity: 65 },
        { date: '2024-01-02', temp: 22, humidity: 70 }
      ]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getWeatherAlerts = async (req, res) => {
  try {
    const { location } = req.query;
    res.json({
      message: 'Weather alerts',
      location: location || 'Default location',
      alerts: [{
        type: 'info',
        title: 'No active alerts',
        description: 'No severe weather alerts for your area.',
        severity: 'low'
      }],
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getWeatherByLocation = async (req, res) => {
  try {
    const { lat, lon } = req.params;
    res.json({
      message: 'Weather by coordinates',
      coordinates: { lat: parseFloat(lat), lon: parseFloat(lon) },
      current: {
        temperature: 22,
        humidity: 65,
        conditions: 'Partly Cloudy',
        windSpeed: 12,
        windDirection: 'NW'
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getWeatherForField = async (req, res) => {
  try {
    const { fieldId } = req.params;
    const weatherData = await weatherService.getWeatherForField(fieldId, req.user._id);
    res.json({ success: true, ...weatherData });
  } catch (error) {
    console.error('Ошибка получения погоды для поля:', error);
    res.status(500).json({ success: false, message: 'Ошибка получения погоды для поля.' });
  }
};