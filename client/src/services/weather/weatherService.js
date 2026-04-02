import { weatherAPI } from './weatherAPI';
import { WEATHER_CONDITIONS } from '../../utils/constants';

export const weatherService = {
  getWeatherForAgriculture: async (lat, lon) => {
    const [currentResponse, forecastResponse] = await Promise.all([
      weatherAPI.getCurrentWeather(lat, lon),
      weatherAPI.getForecast(lat, lon, 5)
    ]);

    const current = currentResponse.data.current;
    const forecast = forecastResponse.data.forecast.forecastday;

    // Анализ для сельского хозяйства
    const analysis = {
      irrigationNeeds: calculateIrrigationNeeds(current, forecast),
      plantingRecommendation: getPlantingRecommendation(current, forecast),
      harvestingConditions: analyzeHarvestingConditions(forecast),
      pestRisk: calculatePestRisk(current, forecast),
      frostRisk: calculateFrostRisk(forecast),
      overallScore: calculateOverallScore(current, forecast)
    };

    return {
      current,
      forecast,
      analysis,
      recommendations: generateRecommendations(analysis)
    };
  },

  getWeatherCondition: (code) => {
    return WEATHER_CONDITIONS[code] || { text: 'Неизвестно', icon: '❓', bgColor: 'bg-gray-100' };
  },

  calculateGrowingDegreeDays: (tempC) => {
    const baseTemp = 10; // Базовая температура для многих культур
    return Math.max(0, tempC - baseTemp);
  }
};

const calculateIrrigationNeeds = (current, forecast) => {
  const precipLast3Days = forecast.slice(0, 3).reduce((sum, day) => sum + day.day.totalprecip_mm, 0);
  const avgTemp = forecast.reduce((sum, day) => sum + day.day.avgtemp_c, 0) / forecast.length;
  
  let needs = 'low';
  if (precipLast3Days < 5 && avgTemp > 20) needs = 'high';
  else if (precipLast3Days < 10 && avgTemp > 15) needs = 'medium';
  
  return {
    level: needs,
    suggestedAmount: needs === 'high' ? 'Увеличить на 30%' : needs === 'medium' ? 'Увеличить на 15%' : 'Норма'
  };
};

const getPlantingRecommendation = (current, forecast) => {
  const soilTemp = current.temp_c - 5; // Примерная температура почвы
  const rainForecast = forecast[0].day.daily_will_it_rain;
  
  if (soilTemp < 8) return { canPlant: false, reason: 'Температура почвы слишком низкая' };
  if (rainForecast) return { canPlant: false, reason: 'Ожидается дождь' };
  return { canPlant: true, reason: 'Благоприятные условия' };
};

const analyzeHarvestingConditions = (forecast) => {
  const next3Days = forecast.slice(0, 3);
  const rainyDays = next3Days.filter(day => day.day.daily_will_it_rain).length;
  
  if (rainyDays >= 2) return { suitable: false, reason: 'Много дождливых дней' };
  if (rainyDays === 1) return { suitable: 'moderate', reason: 'Возможен дождь' };
  return { suitable: true, reason: 'Сухая погода' };
};

const calculatePestRisk = (current, forecast) => {
  const 
  
 dity = forecast.reduce((sum, day) => sum + day.day.avghumidity, 0) / forecast.length;
  const avgTemp = forecast.reduce((sum, day) => sum + day.day.avgtemp_c, 0) / forecast.length;
  
  let risk = 'low';
  if (avgHumidity > 75 && avgTemp > 20) risk = 'high';
  else if (avgHumidity > 65 && avgTemp > 18) risk = 'medium';
  
  return risk;
};

const calculateFrostRisk = (forecast) => {
  const minTemps = forecast.map(day => day.day.mintemp_c);
  const risk = minTemps.some(temp => temp < 2) ? 'high' : minTemps.some(temp => temp < 5) ? 'medium' : 'low';
  return risk;
};

const calculateOverallScore = (current, forecast) => {
  // Простая система оценки от 0 до 100
  let score = 50;
  
  // Температурный фактор
  const avgTemp = forecast.reduce((sum, day) => sum + day.day.avgtemp_c, 0) / forecast.length;
  if (avgTemp >= 15 && avgTemp <= 25) score += 20;
  else if (avgTemp >= 10 && avgTemp <= 30) score += 10;
  
  // Осадки
  const totalPrecip = forecast.reduce((sum, day) => sum + day.day.totalprecip_mm, 0);
  if (totalPrecip >= 5 && totalPrecip <= 20) score += 15;
  else if (totalPrecip < 30) score += 5;
  
  // Ветер
  if (current.wind_kph < 30) score += 10;
  
  // Влажность
  if (current.humidity >= 40 && current.humidity <= 70) score += 10;
  
  return Math.min(100, Math.max(0, score));
};

const generateRecommendations = (analysis) => {
  const recs = [];
  
  if (analysis.irrigationNeeds.level === 'high') {
    recs.push('Рекомендуется увеличить полив на 30% в течение 3 дней');
  }
  
  if (analysis.pestRisk === 'high') {
    recs.push('Высокий риск вредителей. Проведите профилактическую обработку');
  }
  
  if (analysis.frostRisk === 'high') {
    recs.push('Высокий риск заморозков. Защитите теплолюбивые культуры');
  }
  
  if (analysis.overallScore > 80) {
    recs.push('Отличные условия для сельскохозяйственных работ');
  }
  
  return recs;
};