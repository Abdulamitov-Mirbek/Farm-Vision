const axios = require('axios');
const Field = require('../models/Field');

class WeatherService {
  constructor() {
    this.apiKey = process.env.WEATHER_API_KEY;
    this.baseUrl = process.env.WEATHER_BASE_URL || 'https://api.openweathermap.org/data/2.5';
    
    if (!this.apiKey) {
      console.warn('⚠️ WEATHER_API_KEY не установлен. Погодный сервис будет использовать мок-данные.');
    }
  }
  
  /**
   * Получение текущей погоды по координатам
   */
  async getCurrentWeather(lat, lon) {
    if (!this.apiKey) {
      return this.getMockCurrentWeather(lat, lon);
    }
    
    try {
      const response = await axios.get(`${this.baseUrl}/weather`, {
        params: {
          lat,
          lon,
          appid: this.apiKey,
          units: 'metric',
          lang: 'ru'
        }
      });
      
      return this.formatWeatherData(response.data);
    } catch (error) {
      console.error('Ошибка получения погоды:', error.message);
      return this.getMockCurrentWeather(lat, lon);
    }
  }
  
  /**
   * Получение прогноза погоды
   */
  async getForecast(lat, lon, days = 5) {
    if (!this.apiKey) {
      return this.getMockForecast(days);
    }
    
    try {
      const response = await axios.get(`${this.baseUrl}/forecast`, {
        params: {
          lat,
          lon,
          appid: this.apiKey,
          units: 'metric',
          lang: 'ru',
          cnt: Math.min(days * 8, 40) // 8 записей в день
        }
      });
      
      return this.formatForecastData(response.data, days);
    } catch (error) {
      console.error('Ошибка получения прогноза:', error.message);
      return this.getMockForecast(days);
    }
  }
  
  /**
   * Получение погоды для поля
   */
  async getWeatherForField(fieldId, userId) {
    try {
      // Находим поле
      const field = await Field.findOne({ _id: fieldId, userId });
      
      if (!field || !field.coordinates || field.coordinates.length === 0) {
        throw new Error('Поле не найдено или не имеет координат');
      }
      
      // Используем первую координату как центр поля
      const centerLat = field.coordinates[0].lat;
      const centerLon = field.coordinates[0].lng;
      
      // Получаем текущую погоду и прогноз
      const currentWeather = await this.getCurrentWeather(centerLat, centerLon);
      const forecast = await this.getForecast(centerLat, centerLon, 3);
      
      // Добавляем рекомендации для поля
      const recommendations = this.getFieldRecommendations(currentWeather, field);
      
      return {
        current: currentWeather,
        forecast,
        recommendations,
        field: {
          name: field.name,
          cropType: field.cropType,
          status: field.status
        }
      };
    } catch (error) {
      console.error('Ошибка получения погоды для поля:', error.message);
      throw error;
    }
  }
  
  /**
   * Форматирование данных погоды
   */
  formatWeatherData(data) {
    return {
      temperature: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      humidity: data.main.humidity,
      pressure: Math.round(data.main.pressure * 0.750062), // hPa to mmHg
      windSpeed: Math.round(data.wind.speed * 3.6), // m/s to km/h
      windDirection: this.getWindDirection(data.wind.deg),
      clouds: data.clouds.all,
      visibility: data.visibility / 1000, // meters to km
      condition: this.translateCondition(data.weather[0].description),
      conditionCode: data.weather[0].id,
      icon: data.weather[0].icon,
      sunrise: new Date(data.sys.sunrise * 1000),
      sunset: new Date(data.sys.sunset * 1000),
      updatedAt: new Date()
    };
  }
  
  /**
   * Форматирование данных прогноза
   */
  formatForecastData(data, days) {
    const forecasts = [];
    const dailyData = {};
    
    // Группируем по дням
    data.list.forEach(item => {
      const date = new Date(item.dt * 1000);
      const dayKey = date.toISOString().split('T')[0];
      
      if (!dailyData[dayKey]) {
        dailyData[dayKey] = {
          date,
          tempMin: item.main.temp,
          tempMax: item.main.temp,
          conditions: [],
          humidity: [],
          windSpeed: []
        };
      }
      
      dailyData[dayKey].tempMin = Math.min(dailyData[dayKey].tempMin, item.main.temp);
      dailyData[dayKey].tempMax = Math.max(dailyData[dayKey].tempMax, item.main.temp);
      dailyData[dayKey].conditions.push(item.weather[0].id);
      dailyData[dayKey].humidity.push(item.main.humidity);
      dailyData[dayKey].windSpeed.push(item.wind.speed);
    });
    
    // Формируем прогноз на указанное количество дней
    const dayKeys = Object.keys(dailyData).slice(0, days);
    
    dayKeys.forEach(dayKey => {
      const day = dailyData[dayKey];
      const mostCommonCondition = this.getMostCommonCondition(day.conditions);
      
      forecasts.push({
        date: day.date,
        temperature: {
          min: Math.round(day.tempMin),
          max: Math.round(day.tempMax),
          avg: Math.round((day.tempMin + day.tempMax) / 2)
        },
        humidity: Math.round(day.humidity.reduce((a, b) => a + b) / day.humidity.length),
        windSpeed: Math.round(day.windSpeed.reduce((a, b) => a + b) / day.windSpeed.length * 3.6),
        condition: this.translateConditionById(mostCommonCondition),
        conditionCode: mostCommonCondition,
        precipitation: 0 // В базовом API нет данных об осадках
      });
    });
    
    return forecasts;
  }
  
  /**
   * Получение рекомендаций для поля на основе погоды
   */
  getFieldRecommendations(weather, field) {
    const recommendations = [];
    
    // Рекомендации по поливу
    if (weather.temperature > 25 && weather.humidity < 60) {
      recommendations.push({
        type: 'watering',
        priority: 'high',
        message: 'Рекомендуется полив из-за высокой температуры и низкой влажности',
        details: {
          optimalTime: 'рано утром или поздно вечером',
          frequency: 'увеличить на 20%'
        }
      });
    }
    
    // Рекомендации по обработке
    if (weather.humidity > 80 && weather.temperature > 18 && weather.temperature < 25) {
      recommendations.push({
        type: 'treatment',
        priority: 'medium',
        message: 'Условия благоприятны для развития грибковых заболеваний',
        details: {
          action: 'профилактическая обработка',
          timing: 'в ближайшие 2-3 дня'
        }
      });
    }
    
    // Рекомендации по удобрениям
    if (weather.condition.includes('дождь') && !weather.condition.includes('сильный')) {
      recommendations.push({
        type: 'fertilizing',
        priority: 'low',
        message: 'Хорошие условия для внесения жидких удобрений',
        details: {
          action: 'внесение удобрений',
          timing: 'во время или сразу после дождя'
        }
      });
    }
    
    // Рекомендации на основе типа культуры
    if (field.cropType === 'wheat' && weather.temperature > 30) {
      recommendations.push({
        type: 'heat_protection',
        priority: 'high',
        message: 'Высокая температура может повредить пшеницу',
        details: {
          action: 'увеличить полив',
          timing: 'немедленно'
        }
      });
    }
    
    return recommendations;
  }
  
  /**
   * Перевод направления ветра
   */
  getWindDirection(degrees) {
    const directions = ['С', 'СВ', 'В', 'ЮВ', 'Ю', 'ЮЗ', 'З', 'СЗ'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
  }
  
  /**
   * Перевод условий погоды
   */
  translateCondition(condition) {
    const translations = {
      'clear sky': 'Ясно',
      'few clouds': 'Малооблачно',
      'scattered clouds': 'Рассеянные облака',
      'broken clouds': 'Облачно',
      'overcast clouds': 'Пасмурно',
      'mist': 'Туман',
      'fog': 'Густой туман',
      'light rain': 'Небольшой дождь',
      'moderate rain': 'Умеренный дождь',
      'heavy rain': 'Сильный дождь',
      'thunderstorm': 'Гроза',
      'snow': 'Снег',
      'light snow': 'Небольшой снег'
    };
    
    return translations[condition] || condition;
  }
  
  /**
   * Перевод кода условия
   */
  translateConditionById(code) {
    // Коды из OpenWeatherMap
    if (code >= 200 && code < 300) return 'Гроза';
    if (code >= 300 && code < 400) return 'Морось';
    if (code >= 500 && code < 600) return 'Дождь';
    if (code >= 600 && code < 700) return 'Снег';
    if (code >= 700 && code < 800) return 'Туман';
    if (code === 800) return 'Ясно';
    if (code > 800 && code < 900) return 'Облачно';
    return 'Неизвестно';
  }
  
  /**
   * Получение наиболее частого условия
   */
  getMostCommonCondition(conditions) {
    const counts = {};
    conditions.forEach(code => {
      counts[code] = (counts[code] || 0) + 1;
    });
    
    return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
  }
  
  /**
   * Мок-данные текущей погоды
   */
  getMockCurrentWeather(lat, lon) {
    const conditions = ['Ясно', 'Малооблачно', 'Облачно', 'Пасмурно', 'Небольшой дождь'];
    const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
    
    return {
      temperature: Math.floor(Math.random() * 15) + 15, // 15-30°C
      feelsLike: Math.floor(Math.random() * 15) + 15,
      humidity: Math.floor(Math.random() * 40) + 40, // 40-80%
      pressure: 750,
      windSpeed: Math.floor(Math.random() * 15) + 5, // 5-20 км/ч
      windDirection: ['С', 'СВ', 'В', 'ЮВ', 'Ю', 'ЮЗ', 'З', 'СЗ'][Math.floor(Math.random() * 8)],
      clouds: Math.floor(Math.random() * 100),
      visibility: 10,
      condition: randomCondition,
      conditionCode: 800,
      icon: '01d',
      sunrise: new Date(Date.now() - 4 * 60 * 60 * 1000),
      sunset: new Date(Date.now() + 8 * 60 * 60 * 1000),
      updatedAt: new Date(),
      isMock: true
    };
  }
  
  /**
   * Мок-данные прогноза
   */
  getMockForecast(days) {
    const forecasts = [];
    const conditions = ['Ясно', 'Малооблачно', 'Облачно', 'Пасмурно', 'Небольшой дождь'];
    
    for (let i = 0; i < days; i++) {
      const date = new Date(Date.now() + i * 24 * 60 * 60 * 1000);
      const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
      
      forecasts.push({
        date,
        temperature: {
          min: Math.floor(Math.random() * 10) + 10,
          max: Math.floor(Math.random() * 15) + 20,
          avg: Math.floor(Math.random() * 12) + 15
        },
        humidity: Math.floor(Math.random() * 40) + 40,
        windSpeed: Math.floor(Math.random() * 15) + 5,
        condition: randomCondition,
        conditionCode: 800,
        precipitation: Math.random() > 0.7 ? Math.floor(Math.random() * 10) : 0,
        isMock: true
      });
    }
    
    return forecasts;
  }
}

module.exports = new WeatherService();