import axiosInstance from '../api/axiosConfig';

// Конфигурация API
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY; // или VITE_WEATHER_API_KEY
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const weatherAPI = {
  // Текущая погода по городу
  getCurrentWeather: async (city = 'Bishkek') => {
    try {
      if (!API_KEY) {
        throw new Error('API ключ не найден!');
      }
      
      const response = await fetch(
        `${BASE_URL}/weather?q=${city}&units=metric&lang=ru&appid=${API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`Ошибка загрузки: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Преобразуем данные OpenWeatherMap в формат, который ожидает Forecasts.jsx
      return {
        data: {
          location: {
            name: data.name,
            country: data.sys.country,
            lat: data.coord.lat,
            lon: data.coord.lon,
            localtime: new Date().toISOString()
          },
          current: {
            temp_c: data.main.temp,
            condition: {
              text: data.weather[0].description,
              icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
            },
            wind_kph: data.wind.speed * 3.6,
            humidity: data.main.humidity,
            feelslike_c: data.main.feels_like,
            pressure: data.main.pressure
          }
        }
      };
    } catch (error) {
      console.error('Ошибка в getCurrentWeather:', error);
      throw error;
    }
  },

  // Прогноз на несколько дней
  getForecast: async (city = 'Bishkek', days = 7) => {
    try {
      if (!API_KEY) {
        throw new Error('API ключ не найден!');
      }
      
      const response = await fetch(
        `${BASE_URL}/forecast?q=${city}&units=metric&lang=ru&appid=${API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`Ошибка загрузки: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Группируем по дням (OpenWeatherMap возвращает каждые 3 часа)
      const dailyForecast = [];
      const daysMap = new Map();
      
      // Группируем все записи по датам
      data.list.forEach(item => {
        const date = item.dt_txt.split(' ')[0];
        if (!daysMap.has(date)) {
          daysMap.set(date, []);
        }
        daysMap.get(date).push(item);
      });
      
      // Для каждого дня берем данные на 12:00 или первое значение
      for (const [date, items] of daysMap) {
        // Ищем запись на 12:00
        const dayData = items.find(item => item.dt_txt.includes('12:00:00')) || items[0];
        
        dailyForecast.push({
          date: date,
          day: {
            maxtemp_c: Math.max(...items.map(i => i.main.temp)),
            mintemp_c: Math.min(...items.map(i => i.main.temp)),
            avgtemp_c: items.reduce((sum, i) => sum + i.main.temp, 0) / items.length,
            maxwind_kph: Math.max(...items.map(i => i.wind.speed)) * 3.6,
            avghumidity: items.reduce((sum, i) => sum + i.main.humidity, 0) / items.length,
            daily_chance_of_rain: Math.round(Math.max(...items.map(i => i.pop || 0)) * 100),
            condition: {
              text: dayData.weather[0].description,
              icon: `https://openweathermap.org/img/wn/${dayData.weather[0].icon}@2x.png`
            }
          }
        });
      }
      
      return {
        data: {
          location: {
            name: data.city.name,
            country: data.city.country
          },
          current: {
            temp_c: data.list[0].main.temp,
            condition: { text: data.list[0].weather[0].description }
          },
          forecast: {
            forecastday: dailyForecast.slice(0, days)
          }
        }
      };
    } catch (error) {
      console.error('Ошибка в getForecast:', error);
      throw error;
    }
  }
};