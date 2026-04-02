// src/pages/Forecasts.jsx
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext'; // ✅ Добавляем тему
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { weatherAPI } from '../services/weather/weatherAPI';
import {
  TrendingUp,
  Cloud,
  Leaf,
  DollarSign,
  Download,
  AlertCircle,
  Sprout,
  Droplets,
  Thermometer,
  Wind,
  Sun,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudDrizzle,
  CloudFog
} from 'lucide-react';

const Forecasts = () => {
  const { t, language } = useLanguage();
  const { theme } = useTheme(); // ✅ Получаем тему
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Классы для темы
  const themeClasses = {
    page: theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50',
    card: theme === 'dark' 
      ? 'bg-gray-800 border-gray-700' 
      : 'bg-white border-gray-200',
    text: {
      primary: theme === 'dark' ? 'text-white' : 'text-gray-900',
      secondary: theme === 'dark' ? 'text-gray-400' : 'text-gray-600',
      muted: theme === 'dark' ? 'text-gray-500' : 'text-gray-400',
    },
    border: theme === 'dark' ? 'border-gray-700' : 'border-gray-200',
    input: theme === 'dark'
      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
      : 'bg-white border-gray-300 text-gray-900',
    button: {
      primary: 'bg-green-600 hover:bg-green-700 text-white',
      secondary: theme === 'dark'
        ? 'bg-gray-700 hover:bg-gray-600 text-gray-300 border-gray-600'
        : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300',
      outline: theme === 'dark'
        ? 'border-gray-600 hover:bg-gray-700 text-gray-300'
        : 'border-gray-300 hover:bg-gray-100 text-gray-700',
      warning: 'bg-yellow-600 hover:bg-yellow-700 text-white',
      danger: 'bg-red-600 hover:bg-red-700 text-white',
    },
    badge: {
      high: theme === 'dark'
        ? 'bg-red-900/30 text-red-400 border border-red-800'
        : 'bg-red-100 text-red-700 border border-red-200',
      medium: theme === 'dark'
        ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-800'
        : 'bg-yellow-100 text-yellow-700 border border-yellow-200',
      low: theme === 'dark'
        ? 'bg-green-900/30 text-green-400 border border-green-800'
        : 'bg-green-100 text-green-700 border border-green-200',
      blue: theme === 'dark'
        ? 'bg-blue-900/30 text-blue-400 border border-blue-800'
        : 'bg-blue-100 text-blue-700 border border-blue-200',
    },
    weatherCard: {
      gradient: theme === 'dark'
        ? 'bg-gradient-to-r from-gray-800 to-gray-900'
        : 'bg-gradient-to-r from-blue-50 to-indigo-50',
    },
    cityBadge: theme === 'dark'
      ? 'bg-blue-900/30 text-blue-400 border border-blue-800'
      : 'bg-blue-50 text-blue-700 border border-blue-200',
    iconWrapper: {
      blue: theme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-100',
      green: theme === 'dark' ? 'bg-green-900/30' : 'bg-green-100',
      yellow: theme === 'dark' ? 'bg-yellow-900/30' : 'bg-yellow-100',
      purple: theme === 'dark' ? 'bg-purple-900/30' : 'bg-purple-100',
    },
    iconColor: {
      blue: theme === 'dark' ? 'text-blue-400' : 'text-blue-600',
      green: theme === 'dark' ? 'text-green-400' : 'text-green-600',
      yellow: theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600',
      purple: theme === 'dark' ? 'text-purple-400' : 'text-purple-600',
    },
    progressBar: {
      bg: theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200',
      fill: 'bg-green-600',
    },
    forecastItem: {
      hover: theme === 'dark'
        ? 'hover:bg-gray-700'
        : 'hover:bg-gray-50',
    },
    errorCard: theme === 'dark'
      ? 'bg-red-900/20 border-red-800'
      : 'bg-red-50 border-red-200',
    errorText: {
      title: theme === 'dark' ? 'text-red-400' : 'text-red-800',
      message: theme === 'dark' ? 'text-red-400' : 'text-red-600',
    },
    divider: theme === 'dark' ? 'border-gray-700' : 'border-gray-100',
    spinner: theme === 'dark' ? 'border-green-400' : 'border-green-600',
    shadow: {
      card: theme === 'dark' 
        ? 'shadow-lg shadow-black/20' 
        : 'shadow-lg shadow-gray-200',
      hover: theme === 'dark'
        ? 'hover:shadow-xl hover:shadow-black/30'
        : 'hover:shadow-xl hover:shadow-gray-300',
    },
    aiCard: theme === 'dark'
      ? 'bg-gray-750 border-gray-700'
      : 'bg-white border-gray-200',
    longTermCard: {
      gradient: theme === 'dark'
        ? 'bg-gradient-to-r from-gray-800 to-gray-900'
        : 'bg-gradient-to-r from-green-50 to-blue-50',
      text: theme === 'dark' ? 'text-gray-300' : 'text-gray-700',
    },
    tableRow: {
      border: theme === 'dark' ? 'border-gray-700' : 'border-gray-100',
    },
    weatherMetric: {
      value: theme === 'dark' ? 'text-gray-300' : 'text-gray-600',
      icon: theme === 'dark' ? 'text-blue-400' : 'text-blue-600',
    },
  };

  // Загрузка данных для Бишкека
  useEffect(() => {
    loadBishkekWeather();
  }, []);

  const loadBishkekWeather = async () => {
  try {
    setLoading(true);
    setError(null);
    
    console.log('Загружаем погоду для Бишкека...');
    
    const [current, forecast] = await Promise.all([
      weatherAPI.getCurrentWeather('Bishkek'),
      weatherAPI.getForecast('Bishkek', 7)
    ]);
    
    console.log('Текущая погода:', current);
    console.log('Прогноз:', forecast);
    
    setWeatherData(current.data);
    
    // Проверяем структуру данных перед использованием
    if (forecast.data?.forecast?.forecastday) {
      const dailyForecast = forecast.data.forecast.forecastday.map(item => ({
        day: new Date(item.date).toLocaleDateString('ru-RU', { weekday: 'short' }),
        date: new Date(item.date).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' }),
        temp: `${Math.round(item.day.avgtemp_c)}°`,
        icon: getWeatherIcon(item.day.condition.text),
        condition: item.day.condition.text,
        rain: `${item.day.daily_chance_of_rain || 0}%`,
        wind: `${Math.round(item.day.maxwind_kph)} км/ч`,
        humidity: item.day.avghumidity
      }));
      
      setForecastData(dailyForecast);
    } else {
      console.error('Неожиданная структура данных:', forecast);
      setError('Ошибка формата данных от сервера');
    }
    
  } catch (err) {
    console.error('Ошибка загрузки:', err);
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

  // Функция для получения иконки по погоде
  const getWeatherIcon = (weatherMain) => {
    const icons = {
      Clear: Sun,
      Clouds: Cloud,
      Rain: CloudRain,
      Drizzle: CloudDrizzle,
      Thunderstorm: CloudLightning,
      Snow: CloudSnow,
      Mist: CloudFog,
      Fog: CloudFog,
      Haze: CloudFog
    };
    return icons[weatherMain] || Cloud;
  };

  // Получение эмодзи для погоды
  const getWeatherEmoji = (weatherMain) => {
    const emojis = {
      Clear: '☀️',
      Clouds: '☁️',
      Rain: '🌧️',
      Drizzle: '🌦️',
      Thunderstorm: '⛈️',
      Snow: '🌨️',
      Mist: '🌫️',
      Fog: '🌫️',
      Haze: '🌫️'
    };
    return emojis[weatherMain] || '☁️';
  };

  // Данные для урожайности (можно заменить на реальные с бэкенда)
  const yieldForecast = [
    { crop: t('wheat'), current: 78, forecast: 85, change: '+9%', field: t('northernField') + ', ' + t('southernField') },
    { crop: t('corn'), current: 82, forecast: 94, change: '+14.6%', field: t('easternField') },
    { crop: t('sunflower'), current: 65, forecast: 72, change: '+10.8%', field: t('westernField') },
    { crop: t('barley'), current: 71, forecast: 76, change: '+7%', field: t('northernField') },
  ];

  // Прогноз цен
  const priceForecast = [
    { crop: t('wheat'), current: '12 500 som', forecast: '13 200 som', change: '+5.6%', trend: 'up' },
    { crop: t('corn'), current: '10 800 som', forecast: '11 500 som', change: '+6.5%', trend: 'up' },
    { crop: t('sunflower'), current: '24 500 som', forecast: '25 800 som', change: '+5.3%', trend: 'up' },
    { crop: t('barley'), current: '9 800 som', forecast: '10 200 som', change: '+4.1%', trend: 'up' },
  ];

  // AI рекомендации
  const aiRecommendations = [
    {
      id: 1,
      title: language === 'ru' ? 'Оптимальное время для посева' : 
              language === 'en' ? 'Optimal sowing time' : 
              'Себүү үчүн оптималдуу убакыт',
      description: language === 'ru' ? 'На основе прогноза погоды для Бишкека, рекомендуем начать посев яровых культур с 20 марта' :
                    language === 'en' ? 'Based on Bishkek weather forecast, we recommend starting spring crops sowing from March 20' :
                    'Бишкектин аба ырайынын болжолуна негизделген, жазгы эгиндерди себүүнү 20-марттан баштаганды сунуштайбыз',
      icon: Sprout,
      priority: 'high'
    },
    {
      id: 2,
      title: language === 'ru' ? 'Обработка от вредителей' :
              language === 'en' ? 'Pest control treatment' :
              'Зыянкечтерге каршы дарылоо',
      description: language === 'ru' ? 'Ожидается повышенная активность вредителей. Рекомендуем провести обработку 15-17 февраля' :
                    language === 'en' ? 'Increased pest activity expected. Recommended treatment on February 15-17' :
                    'Зыянкечтердин активдүүлүгүнүн жогорулашы күтүлөт. Дарылоону 15-17-февралда жүргүзүү сунушталат',
      icon: AlertCircle,
      priority: 'medium'
    },
    {
      id: 3,
      title: language === 'ru' ? 'Поливной режим' :
              language === 'en' ? 'Irrigation schedule' :
              'Сугат режими',
      description: language === 'ru' ? 'Недостаток осадков в марте. Рекомендуем увеличить полив на 15%' :
                    language === 'en' ? 'Precipitation deficit in March. Recommended to increase irrigation by 15%' :
                    'Март айында жаан-чачындын жетишсиздиги. Сугарууну 15% га көбөйтүү сунушталат',
      icon: Droplets,
      priority: 'medium'
    }
  ];

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'red';
      case 'medium': return 'yellow';
      case 'low': return 'green';
      default: return 'blue';
    }
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center h-64 ${themeClasses.page}`}>
        <div className="text-center">
          <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${themeClasses.spinner} mx-auto`}></div>
          <p className={`mt-4 ${themeClasses.text.secondary}`}>
            {language === 'ru' ? 'Загрузка прогноза для Бишкека...' : 
             language === 'en' ? 'Loading Bishkek forecast...' : 
             'Бишкек үчүн болжол жүктөлүүдө...'}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-6 rounded-xl border text-center ${themeClasses.errorCard}`}>
        <AlertCircle className={`mx-auto mb-3 ${theme === 'dark' ? 'text-red-400' : 'text-red-500'}`} size={48} />
        <h3 className={`text-lg font-semibold mb-2 ${themeClasses.errorText.title}`}>
          {language === 'ru' ? 'Ошибка загрузки' : 
           language === 'en' ? 'Loading error' : 
           'Жүктөө катасы'}
        </h3>
        <p className={themeClasses.errorText.message}>{error}</p>
        <button 
          onClick={loadBishkekWeather}
          className={`mt-4 px-4 py-2 rounded-lg border transition-colors ${themeClasses.button.outline}`}
        >
          {language === 'ru' ? 'Повторить' : 
           language === 'en' ? 'Try again' : 
           'Кайра аракеттениңиз'}
        </button>
      </div>
    );
  }

  return (
    <div className={`p-6 transition-colors duration-300 ${themeClasses.page}`}>
      <div className="space-y-6">
        {/* Хедер */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className={`text-2xl font-bold ${themeClasses.text.primary}`}>
              {t('forecasts') || (language === 'ru' ? 'Прогнозы' : language === 'en' ? 'Forecasts' : 'Болжолдор')}
            </h1>
            <p className={`mt-1 ${themeClasses.text.secondary}`}>
              {language === 'ru' ? 'Прогноз погоды для Бишкека' :
               language === 'en' ? 'Weather forecast for Bishkek' :
               'Бишкек үчүн аба ырайынын болжолу'}
            </p>
          </div>
          
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            {/* Информация о городе */}
            <div className={`px-4 py-2 rounded-lg flex items-center gap-2 border ${themeClasses.cityBadge}`}>
              <span className="font-medium">Бишкек</span>
              <span className="text-sm">🇰🇬</span>
            </div>

            {/* Селектор периода */}
            <div className={`flex items-center rounded-lg border p-1 ${themeClasses.border} ${themeClasses.card}`}>
              {[
                { id: 'week', label: language === 'ru' ? 'Нед' : language === 'en' ? 'Week' : 'Апт' },
                { id: 'month', label: language === 'ru' ? 'Меc' : language === 'en' ? 'Mon' : 'Ай' },
                { id: 'season', label: language === 'ru' ? 'Сезон' : language === 'en' ? 'Season' : 'Сезон' }
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPeriod(p.id)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    selectedPeriod === p.id
                      ? 'bg-green-600 text-white'
                      : themeClasses.text.secondary + ' hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
            
            <button className={`px-4 py-2 rounded-lg border flex items-center gap-2 transition-colors ${themeClasses.button.outline}`}>
              <Download size={18} />
              <span>{t('export')}</span>
            </button>
          </div>
        </div>

        {/* Текущая погода в Бишкеке */}
        {weatherData && weatherData.weather && weatherData.weather[0] ? (
          <div className={`p-6 rounded-xl border ${themeClasses.weatherCard.gradient} ${themeClasses.card}`}>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="text-6xl">
                  {getWeatherEmoji(weatherData.weather[0].main)}
                </div>
                <div>
                  <div className={`text-4xl font-bold ${themeClasses.text.primary}`}>
                    {weatherData.main?.temp ? Math.round(weatherData.main.temp) : '—'}°C
                  </div>
                  <p className={`capitalize ${themeClasses.text.secondary}`}>
                    {weatherData.weather[0].description || '...'}
                  </p>
                  <p className={`text-sm ${themeClasses.text.muted}`}>
                    {language === 'ru' ? 'Ощущается как' : 'Feels like'}: {weatherData.main?.feels_like ? Math.round(weatherData.main.feels_like) : '—'}°C
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <Wind className={`w-6 h-6 mx-auto ${themeClasses.weatherMetric.icon}`} />
                  <p className={`text-sm mt-1 ${themeClasses.weatherMetric.value}`}>
                    {weatherData.wind?.speed || '—'} м/с
                  </p>
                </div>
                <div className="text-center">
                  <Droplets className={`w-6 h-6 mx-auto ${themeClasses.weatherMetric.icon}`} />
                  <p className={`text-sm mt-1 ${themeClasses.weatherMetric.value}`}>
                    {weatherData.main?.humidity || '—'}%
                  </p>
                </div>
                <div className="text-center">
                  <Thermometer className={`w-6 h-6 mx-auto ${themeClasses.weatherMetric.icon}`} />
                  <p className={`text-sm mt-1 ${themeClasses.weatherMetric.value}`}>
                    {weatherData.main?.pressure || '—'} гПа
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className={`p-6 rounded-xl border ${themeClasses.card}`}>
            <p className={`text-center ${themeClasses.text.secondary}`}>Загрузка погоды...</p>
          </div>
        )}

        {/* Прогноз погоды на неделю для Бишкека */}
        <div className={`p-6 rounded-xl border ${themeClasses.card} ${themeClasses.shadow.card}`}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${themeClasses.iconWrapper.blue}`}>
                <Cloud className={themeClasses.iconColor.blue} size={20} />
              </div>
              <div>
                <h2 className={`text-lg font-semibold ${themeClasses.text.primary}`}>
                  {t('weatherForecast') || (language === 'ru' ? 'Прогноз погоды' : language === 'en' ? 'Weather Forecast' : 'Аба ырайынын болжолу')}
                </h2>
                <p className={`text-sm ${themeClasses.text.secondary}`}>
                  Бишкек, Кыргызстан
                </p>
              </div>
            </div>
            <span className={`text-sm ${themeClasses.text.muted}`}>
              {t('nextWeek') || (language === 'ru' ? 'На неделю' : language === 'en' ? 'Next 7 days' : 'Аптага')}
            </span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {forecastData.map((day, index) => {
              const Icon = day.icon;
              return (
                <div key={index} className={`text-center p-3 rounded-lg transition-colors ${themeClasses.forecastItem.hover}`}>
                  <p className={`text-sm font-medium ${themeClasses.text.primary}`}>{day.day}</p>
                  <p className={`text-xs mb-2 ${themeClasses.text.muted}`}>{day.date}</p>
                  <div className="flex justify-center mb-2">
                    <Icon size={28} className={themeClasses.iconColor.blue} />
                  </div>
                  <p className={`text-lg font-bold ${themeClasses.text.primary}`}>{day.temp}</p>
                  <p className={`text-xs mb-1 ${themeClasses.text.secondary}`}>{day.condition}</p>
                  <div className="flex items-center justify-center gap-2 text-xs">
                    <span className={themeClasses.text.muted}>💧 {day.rain}</span>
                    <span className={themeClasses.text.muted}>💨 {day.wind}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Остальные карточки (урожайность, цены, рекомендации) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Прогноз урожайности */}
          <div className={`p-6 rounded-xl border ${themeClasses.card} ${themeClasses.shadow.card}`}>
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${themeClasses.iconWrapper.green}`}>
                <TrendingUp className={themeClasses.iconColor.green} size={20} />
              </div>
              <div>
                <h2 className={`text-lg font-semibold ${themeClasses.text.primary}`}>
                  {t('yieldForecast') || (language === 'ru' ? 'Прогноз урожайности' : language === 'en' ? 'Yield Forecast' : 'Түшүмдүүлүк болжолу')}
                </h2>
                <p className={`text-sm ${themeClasses.text.secondary}`}>
                  {language === 'ru' ? 'Сезон 2026' : language === 'en' ? 'Season 2026' : '2026-жыл сезону'}
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              {yieldForecast.map((item, index) => (
                <div key={index} className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className={`font-medium ${themeClasses.text.primary}`}>{item.crop}</span>
                      <span className={`text-xs ml-2 ${themeClasses.text.muted}`}>{item.field}</span>
                    </div>
                    <span className={`text-sm font-semibold ${themeClasses.iconColor.green}`}>{item.change}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${themeClasses.text.secondary}`}>
                      {language === 'ru' ? 'Текущая' : language === 'en' ? 'Current' : 'Учурдагы'}: {item.current} ц/га
                    </span>
                    <span className={`text-sm font-medium ${themeClasses.text.primary}`}>
                      {language === 'ru' ? 'Прогноз' : language === 'en' ? 'Forecast' : 'Болжол'}: {item.forecast} ц/га
                    </span>
                  </div>
                  <div className={`mt-2 w-full rounded-full h-2 ${themeClasses.progressBar.bg}`}>
                    <div 
                      className={`h-2 rounded-full ${themeClasses.progressBar.fill}`} 
                      style={{ width: `${(item.forecast / 100) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Прогноз цен */}
          <div className={`p-6 rounded-xl border ${themeClasses.card} ${themeClasses.shadow.card}`}>
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${themeClasses.iconWrapper.yellow}`}>
                <DollarSign className={themeClasses.iconColor.yellow} size={20} />
              </div>
              <div>
                <h2 className={`text-lg font-semibold ${themeClasses.text.primary}`}>
                  {language === 'ru' ? 'Прогноз цен' : language === 'en' ? 'Price Forecast' : 'Баа болжолу'}
                </h2>
                <p className={`text-sm ${themeClasses.text.secondary}`}>
                  {language === 'ru' ? 'На 2 квартал 2026' : language === 'en' ? 'Q2 2026' : '2026-жылдын 2-чейрегине'}
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              {priceForecast.map((item, index) => (
                <div key={index} className={`flex items-center justify-between p-3 border-b last:border-0 ${themeClasses.tableRow.border}`}>
                  <div>
                    <span className={`font-medium ${themeClasses.text.primary}`}>{item.crop}</span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs ${themeClasses.text.muted}`}>
                        {language === 'ru' ? 'Текущая' : language === 'en' ? 'Current' : 'Учурдагы'}: {item.current}
                      </span>
                      <span className={`text-xs ${themeClasses.text.muted}`}>→</span>
                      <span className={`text-xs font-medium ${themeClasses.text.primary}`}>{item.forecast}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-semibold ${themeClasses.iconColor.green}`}>{item.change}</span>
                    <TrendingUp size={16} className={themeClasses.iconColor.green} />
                  </div>
                </div>
              ))}
              
              <button className={`w-full mt-2 px-4 py-2 rounded-lg border transition-colors ${themeClasses.button.outline}`}>
                {language === 'ru' ? 'Полный отчет' : language === 'en' ? 'Full report' : 'Толук отчет'}
              </button>
            </div>
          </div>
        </div>

        {/* AI Рекомендации */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${themeClasses.iconWrapper.purple}`}>
              <span className="text-lg">🤖</span>
            </div>
            <h2 className={`text-lg font-semibold ${themeClasses.text.primary}`}>
              {t('aiRecommendation') || (language === 'ru' ? 'AI-рекомендации' : language === 'en' ? 'AI Recommendations' : 'AI-сунуштар')}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {aiRecommendations.map((rec) => {
              const Icon = rec.icon;
              const priorityColor = getPriorityColor(rec.priority);
              
              return (
                <div key={rec.id} className={`p-5 rounded-xl border transition-all ${themeClasses.aiCard} ${themeClasses.shadow.hover}`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${themeClasses.iconWrapper[priorityColor]}`}>
                      <Icon size={20} className={themeClasses.iconColor[priorityColor]} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={`font-medium ${themeClasses.text.primary}`}>{rec.title}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${themeClasses.badge[rec.priority]}`}>
                          {rec.priority === 'high' ? (language === 'ru' ? 'Высокий' : language === 'en' ? 'High' : 'Жогорку') :
                           rec.priority === 'medium' ? (language === 'ru' ? 'Средний' : language === 'en' ? 'Medium' : 'Орточо') :
                           (language === 'ru' ? 'Низкий' : language === 'en' ? 'Low' : 'Төмөн')}
                        </span>
                      </div>
                      <p className={`text-sm ${themeClasses.text.secondary}`}>{rec.description}</p>
                      <button className={`text-xs mt-2 font-medium ${themeClasses.iconColor.green} hover:opacity-80`}>
                        {language === 'ru' ? 'Применить' : language === 'en' ? 'Apply' : 'Колдонуу'} →
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Долгосрочный прогноз для Кыргызстана */}
        <div className={`p-6 rounded-xl border ${themeClasses.longTermCard.gradient} ${themeClasses.card}`}>
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${themeClasses.iconWrapper.green}`}>
              📊
            </div>
            <div className="flex-1">
              <h3 className={`font-semibold mb-2 ${themeClasses.text.primary}`}>
                {language === 'ru' ? 'Прогноз на сезон 2026 для Кыргызстана' : 
                 language === 'en' ? 'Season 2026 Forecast for Kyrgyzstan' : 
                 'Кыргызстан үчүн 2026-жыл сезонуна болжол'}
              </h3>
              <p className={`text-sm mb-4 ${themeClasses.longTermCard.text}`}>
                {language === 'ru' 
                  ? 'Ожидается благоприятный сезон с ростом урожайности на 12-15% по сравнению с прошлым годом. Рекомендуем увеличить посевные площади под кукурузу и подсолнечник в Чуйской области.'
                  : language === 'en'
                  ? 'A favorable season is expected with yield growth of 12-15% compared to last year. We recommend increasing acreage for corn and sunflower in Chui region.'
                  : 'Өткөн жылга салыштырмалуу түшүмдүүлүктүн 12-15% өсүшү менен ыңгайлуу сезон күтүлөт. Чүй облусунда жүгөрү жана күн карама үчүн аянттарды көбөйтүүнү сунуштайбыз.'}
              </p>
              <div className="flex items-center gap-4">
                <button className={`px-4 py-2 rounded-lg ${themeClasses.button.primary}`}>
                  {language === 'ru' ? 'Детальный прогноз' : 
                   language === 'en' ? 'Detailed forecast' : 
                   'Деталдуу болжол'}
                </button>
                <button className={`text-sm ${themeClasses.text.secondary} hover:${themeClasses.text.primary}`}>
                  {t('details') || (language === 'ru' ? 'Подробнее' : language === 'en' ? 'Details' : 'Толук маалымат')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forecasts;