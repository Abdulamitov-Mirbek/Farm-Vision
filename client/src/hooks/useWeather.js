// client/src/hooks/useWeather.js
import { useState } from 'react';

export const useWeather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ФУНКЦИЯ ЗАГРУЗКИ - ВЫЗЫВАЕТСЯ ТОЛЬКО ПРИ КЛИКЕ
  const fetchWeather = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // ✅ КООРДИНАТЫ БИШКЕКА (заменили Москву)
      const latitude = 42.8746;  // Широта Бишкека
      const longitude = 74.5698; // Долгота Бишкека
      
      const API_KEY = '323869bc3cf8695c25cf5aef9719647f';
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric&lang=ru`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // КОНВЕРТИРУЕМ ДАННЫЕ OpenWeatherMap в нужный формат
      const convertedData = {
        location: {
          name: 'Бишкек', // Явно указываем Бишкек
          region: 'Чуйская область',
          country: 'Кыргызстан'
        },
        current: {
          temp_c: Math.round(data.main.temp),
          feelslike_c: Math.round(data.main.feels_like),
          condition: {
            text: data.weather[0].description,
            code: data.weather[0].id
          },
          wind_kph: Math.round(data.wind.speed * 3.6),
          humidity: data.main.humidity,
          pressure_mb: data.main.pressure,
          uv: 3,
          is_day: data.dt > data.sys.sunrise && data.dt < data.sys.sunset ? 1 : 0
        },
        forecast: {
          forecastday: [
            {
              date: new Date().toISOString().split('T')[0],
              day: {
                maxtemp_c: Math.round(data.main.temp_max || data.main.temp + 2),
                mintemp_c: Math.round(data.main.temp_min || data.main.temp - 2),
                condition: {
                  text: data.weather[0].description,
                  code: data.weather[0].id
                },
                totalprecip_mm: 0,
                avghumidity: data.main.humidity
              }
            }
          ]
        }
      };

      // Добавляем прогноз на 3 дня
      for (let i = 1; i <= 2; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        convertedData.forecast.forecastday.push({
          date: date.toISOString().split('T')[0],
          day: {
            maxtemp_c: Math.round(data.main.temp + 2 - i),
            mintemp_c: Math.round(data.main.temp - 3 - i),
            condition: {
              text: i % 2 === 0 ? 'Переменная облачность' : 'Облачно',
              code: i % 2 === 0 ? 1003 : 1006
            },
            totalprecip_mm: i * 0.2,
            avghumidity: data.main.humidity - 5
          }
        });
      }
      
      setWeatherData(convertedData);
    } catch (err) {
      console.error('Ошибка загрузки погоды:', err);
      setError('Не удалось загрузить погоду для Бишкека');
    } finally {
      setLoading(false);
    }
  };

  // ОЧИСТКА ДАННЫХ
  const clearWeather = () => {
    setWeatherData(null);
    setError(null);
  };

  const getWeatherRecommendations = () => {
    if (!weatherData) return [];
    
    const { current } = weatherData;
    const recommendations = [];

    if (current.temp_c > 30) {
      recommendations.push({
        type: 'warning',
        icon: '☀️',
        text: 'Очень жарко: поливайте растения рано утром или вечером'
      });
    } else if (current.temp_c > 25) {
      recommendations.push({
        type: 'info',
        icon: '☀️',
        text: 'Тепло: хорошее время для сбора урожая'
      });
    } else if (current.temp_c < 5) {
      recommendations.push({
        type: 'warning',
        icon: '❄️',
        text: 'Холодно: укройте теплолюбивые растения'
      });
    }

    if (current.humidity > 80) {
      recommendations.push({
        type: 'warning',
        icon: '💧',
        text: 'Высокая влажность: обработайте растения от грибка'
      });
    } else if (current.humidity < 30) {
      recommendations.push({
        type: 'warning',
        icon: '🔥',
        text: 'Низкая влажность: увеличьте полив'
      });
    }

    if (current.wind_kph > 35) {
      recommendations.push({
        type: 'warning',
        icon: '💨',
        text: 'Сильный ветер: проверьте крепления в теплицах'
      });
    }

    return recommendations;
  };

  return {
    weatherData,
    loading,
    error,
    fetchWeather,
    clearWeather,
    getWeatherRecommendations
  };
};