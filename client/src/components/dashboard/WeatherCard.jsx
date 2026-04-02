import React, { useState } from 'react';
import { useWeather } from '../../hooks/useWeather';
import Card from '../common/Card';
import Button from '../common/Button';

const WeatherCard = ({ compact = false }) => {
  const { weatherData, loading, error, fetchWeather, clearWeather, getWeatherRecommendations } = useWeather();
  const [showDetails, setShowDetails] = useState(false);
  const [selectedDay, setSelectedDay] = useState(0);
  const [isVisible, setIsVisible] = useState(false); // СОСТОЯНИЕ ВИДИМОСТИ

  // ФУНКЦИЯ ДЛЯ ПОКАЗА ПОГОДЫ
  const handleShowWeather = () => {
    setIsVisible(true);
    fetchWeather(); // ЗАГРУЖАЕМ ДАННЫЕ С http://localhost:5000
  };

  // ФУНКЦИЯ ДЛЯ СКРЫТИЯ ПОГОДЫ
  const handleHideWeather = () => {
    setIsVisible(false);
    clearWeather(); // ОЧИЩАЕМ ДАННЫЕ
  };

  // ЕСЛИ КАРТОЧКА СКРЫТА - ПОКАЗЫВАЕМ ТОЛЬКО КНОПКУ
  if (!isVisible) {
    return (
      <Card className="flex justify-center items-center p-8">
        <Button
          variant="primary"
          onClick={handleShowWeather} // ПРИ КЛИКЕ - ЗАГРУЗКА И ПОКАЗ
          className="px-6 py-3 text-lg"
          disabled={loading}
        >
          {loading ? '⏳ Загрузка...' : '🌤️ Показать погоду'}
        </Button>
      </Card>
    );
  }

  // ПОКАЗЫВАЕМ ЗАГРУЗКУ
  if (loading) {
    return (
      <Card>
        <div className="flex justify-end mb-2">
          <button
            onClick={handleHideWeather}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ✕
          </button>
        </div>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </Card>
    );
  }

  // ПОКАЗЫВАЕМ ОШИБКУ
  if (error) {
    return (
      <Card>
        <div className="flex justify-end mb-2">
          <button
            onClick={handleHideWeather}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ✕
          </button>
        </div>
        <div className="text-center p-6">
          <p className="text-red-500 mb-4">❌ {error}</p>
          <Button
            variant="primary"
            onClick={handleShowWeather}
          >
            Попробовать снова
          </Button>
        </div>
      </Card>
    );
  }

  // ЕСЛИ НЕТ ДАННЫХ
  if (!weatherData) {
    return null;
  }

  const { location, current, forecast } = weatherData;
  const recommendations = getWeatherRecommendations();

  const getWeatherIcon = (code, isDay) => {
    if (code === 1000) return isDay ? '☀️' : '🌙';
    if (code === 1003) return '⛅';
    if (code === 1006) return '☁️';
    if (code >= 1063 && code <= 1072) return '🌦️';
    if (code >= 1087) return '⛈️';
    if (code >= 1114 && code <= 1117) return '❄️';
    if (code >= 1150 && code <= 1195) return '🌧️';
    if (code >= 1204 && code <= 1258) return '🌨️';
    return '🌤️';
  };

  if (compact) {
    return (
      <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 relative">
        <div className="absolute top-2 right-2">
          <button
            onClick={handleHideWeather}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">Погода</h3>
            <div className="flex items-center mt-1">
              <span className="text-3xl font-bold text-gray-900">{current.temp_c}°</span>
              <div className="ml-3">
                <p className="text-sm text-gray-600">{current.condition.text}</p>
                <p className="text-xs text-gray-500">{location.name}</p>
              </div>
            </div>
          </div>
          <div className="text-4xl">
            {getWeatherIcon(current.condition.code, current.is_day)}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="relative">
      {/* КНОПКА ЗАКРЫТИЯ */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={handleHideWeather}
          className="text-gray-400 hover:text-gray-600 text-xl bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-sm"
        >
          ✕
        </button>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Погода и климат</h2>
          <p className="text-sm text-gray-600 mt-1">
            {location.name}, {location.region}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={showDetails ? 'primary' : 'outline'}
            size="small"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? 'Свернуть' : 'Подробнее'}
          </Button>
        </div>
      </div>

      {/* Текущая погода */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center">
              <span className="text-5xl font-bold text-gray-900">{current.temp_c}°C</span>
              <div className="ml-4">
                <p className="text-lg font-medium text-gray-900">{current.condition.text}</p>
                <p className="text-sm text-gray-600">
                  Ощущается как {current.feelslike_c}°C
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div>
                <p className="text-sm text-gray-600">Ветер</p>
                <p className="font-medium text-gray-900">{current.wind_kph} км/ч</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Влажность</p>
                <p className="font-medium text-gray-900">{current.humidity}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Давление</p>
                <p className="font-medium text-gray-900">{current.pressure_mb} мбар</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">УФ-индекс</p>
                <p className="font-medium text-gray-900">{current.uv}</p>
              </div>
            </div>
          </div>
          
          <div className="text-7xl hidden md:block">
            {getWeatherIcon(current.condition.code, current.is_day)}
          </div>
        </div>
      </div>

      {/* Прогноз на 3 дня */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Прогноз на 3 дня</h3>
        <div className="grid grid-cols-3 gap-3">
          {forecast.forecastday.slice(0, 3).map((day, index) => (
            <button
              key={day.date}
              onClick={() => setSelectedDay(index)}
              className={`p-4 rounded-lg border ${
                selectedDay === index
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              } transition-all duration-200`}
            >
              <p className="text-sm font-medium text-gray-900">
                {new Date(day.date).toLocaleDateString('ru-RU', { weekday: 'short' })}
              </p>
              <div className="flex items-center justify-center my-2 text-2xl">
                {getWeatherIcon(day.day.condition.code, true)}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-gray-900">{Math.round(day.day.maxtemp_c)}°</span>
                <span className="text-sm text-gray-500">{Math.round(day.day.mintemp_c)}°</span>
              </div>
              <p className="text-xs text-gray-600 mt-1 text-center">
                {day.day.condition.text}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Рекомендации */}
      {recommendations.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Рекомендации для фермера</h3>
          <div className="space-y-2">
            {recommendations.map((rec, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg ${
                  rec.type === 'warning'
                    ? 'bg-yellow-50 border border-yellow-100'
                    : 'bg-green-50 border border-green-100'
                }`}
              >
                <div className="flex items-start">
                  <span className="text-lg mr-3">{rec.icon}</span>
                  <p className="text-sm text-gray-800">{rec.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

export default WeatherCard;