import React, { createContext, useState, useContext, useEffect } from 'react';

const WeatherContext = createContext();

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
};

export const WeatherProvider = ({ children }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState({ lat: 55.7558, lon: 37.6173 }); // Москва по умолчанию

  const fetchWeather = async (lat, lon) => {
    setLoading(true);
    try {
      // Моковые данные для демонстрации
      const mockWeather = {
        location: {
          name: "Москва",
          region: "Московская область",
          country: "Россия"
        },
        current: {
          temp_c: 18,
          temp_f: 64.4,
          condition: {
            text: "Частично облачно",
            icon: "//cdn.weatherapi.com/weather/64x64/day/116.png",
            code: 1003
          },
          wind_kph: 12,
          wind_dir: "СЗ",
          humidity: 65,
          cloud: 40,
          feelslike_c: 18,
          uv: 4
        },
        forecast: {
          forecastday: [
            {
              date: new Date().toISOString().split('T')[0],
              day: {
                maxtemp_c: 20,
                mintemp_c: 15,
                avgtemp_c: 18,
                maxwind_kph: 15,
                totalprecip_mm: 0.1,
                avghumidity: 68,
                condition: {
                  text: "Солнечно",
                  icon: "//cdn.weatherapi.com/weather/64x64/day/113.png"
                },
                uv: 5
              },
              hour: Array.from({ length: 24 }, (_, i) => ({
                time: `${i.toString().padStart(2, '0')}:00`,
                temp_c: 15 + Math.sin(i / 24 * Math.PI) * 5,
                condition: {
                  text: i > 6 && i < 20 ? "Солнечно" : "Ясно",
                  icon: i > 6 && i < 20 
                    ? "//cdn.weatherapi.com/weather/64x64/day/113.png"
                    : "//cdn.weatherapi.com/weather/64x64/night/113.png"
                }
              }))
            },
            {
              date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
              day: {
                maxtemp_c: 19,
                mintemp_c: 14,
                avgtemp_c: 17,
                maxwind_kph: 18,
                totalprecip_mm: 2.5,
                avghumidity: 75,
                condition: {
                  text: "Небольшой дождь",
                  icon: "//cdn.weatherapi.com/weather/64x64/day/296.png"
                },
                uv: 3
              }
            },
            {
              date: new Date(Date.now() + 172800000).toISOString().split('T')[0],
              day: {
                maxtemp_c: 21,
                mintemp_c: 16,
                avgtemp_c: 19,
                maxwind_kph: 12,
                totalprecip_mm: 0,
                avghumidity: 62,
                condition: {
                  text: "Солнечно",
                  icon: "//cdn.weatherapi.com/weather/64x64/day/113.png"
                },
                uv: 6
              }
            }
          ]
        }
      };

      setWeatherData(mockWeather);
      return mockWeather;
    } catch (error) {
      console.error('Error fetching weather:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateLocation = (newLocation) => {
    setLocation(newLocation);
    fetchWeather(newLocation.lat, newLocation.lon);
  };

  const getWeatherRecommendations = () => {
    if (!weatherData) return [];
    
    const recommendations = [];
    const currentTemp = weatherData.current.temp_c;
    const precipitation = weatherData.forecast.forecastday[0].day.totalprecip_mm;

    if (precipitation > 5) {
      recommendations.push({
        type: 'warning',
        text: 'Ожидается сильный дождь. Отложите полив и обработку полей.',
        icon: '💧'
      });
    }

    if (currentTemp > 25) {
      recommendations.push({
        type: 'warning',
        text: 'Высокая температура. Увеличьте полив растений.',
        icon: '🔥'
      });
    }

    if (currentTemp < 10) {
      recommendations.push({
        type: 'warning',
        text: 'Низкая температура. Защитите теплолюбивые культуры.',
        icon: '❄️'
      });
    }

    if (weatherData.current.uv > 6) {
      recommendations.push({
        type: 'warning',
        text: 'Высокий УФ-индекс. Запланируйте работы на утро/вечер.',
        icon: '☀️'
      });
    }

    if (recommendations.length === 0) {
      recommendations.push({
        type: 'success',
        text: 'Идеальные условия для полевых работ.',
        icon: '✅'
      });
    }

    return recommendations;
  };

  useEffect(() => {
    fetchWeather(location.lat, location.lon);
  }, []);

  const value = {
    weatherData,
    loading,
    location,
    fetchWeather,
    updateLocation,
    getWeatherRecommendations
  };

  return (
    <WeatherContext.Provider value={value}>
      {children}
    </WeatherContext.Provider>
  );
};

export default WeatherContext;