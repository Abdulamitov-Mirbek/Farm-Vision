// client/src/pages/Crops.jsx
import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';

const Crops = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('all');
  const [showCropModal, setShowCropModal] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState(null);

  // Классы для темы - унифицировано с Advanced.jsx подходом
  const themeClasses = {
    page: theme === 'dark' ? 'bg-gray-900' : 'bg-gradient-to-br from-slate-50 via-white to-emerald-50',
    card: theme === 'dark' 
      ? 'bg-gray-800 border-gray-700' 
      : 'bg-white/90 backdrop-blur-sm border-0',
    text: {
      primary: theme === 'dark' ? 'text-white' : 'text-gray-900',
      secondary: theme === 'dark' ? 'text-gray-400' : 'text-gray-600',
      muted: theme === 'dark' ? 'text-gray-500' : 'text-gray-500',
      accent: theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600',
      danger: theme === 'dark' ? 'text-red-400' : 'text-red-600',
      warning: theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600',
    },
    border: theme === 'dark' ? 'border-gray-700' : 'border-gray-200',
    input: theme === 'dark'
      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
      : 'bg-white/80 backdrop-blur-sm border-gray-200 text-gray-900 placeholder-gray-400',
    button: {
      primary: 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white',
      outline: theme === 'dark'
        ? 'border-gray-600 hover:bg-gray-700 text-gray-300'
        : 'border-gray-300 hover:bg-gray-100 text-gray-700',
      secondary: theme === 'dark'
        ? 'border-gray-600 hover:bg-gray-700 text-gray-300'
        : 'border-gray-200 hover:bg-gray-50 text-gray-600',
    },
    badge: {
      active: theme === 'dark'
        ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-800'
        : 'bg-emerald-100 text-emerald-700 border border-emerald-200',
      seedling: theme === 'dark'
        ? 'bg-blue-900/30 text-blue-400 border border-blue-800'
        : 'bg-blue-100 text-blue-700 border border-blue-200',
      harvest: theme === 'dark'
        ? 'bg-amber-900/30 text-amber-400 border border-amber-800'
        : 'bg-amber-100 text-amber-700 border border-amber-200',
      rest: theme === 'dark'
        ? 'bg-gray-700 text-gray-300 border border-gray-600'
        : 'bg-gray-100 text-gray-700 border border-gray-200',
      planned: theme === 'dark'
        ? 'bg-gray-700 text-gray-300 border border-gray-600'
        : 'bg-gray-100 text-gray-700 border border-gray-200',
      inProgress: theme === 'dark'
        ? 'bg-blue-900/30 text-blue-400 border border-blue-800'
        : 'bg-blue-100 text-blue-700 border border-blue-200',
      completed: theme === 'dark'
        ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-800'
        : 'bg-emerald-100 text-emerald-700 border border-emerald-200',
      high: theme === 'dark'
        ? 'bg-rose-900/30 text-rose-400 border border-rose-800'
        : 'bg-rose-100 text-rose-700 border border-rose-200',
      medium: theme === 'dark'
        ? 'bg-amber-900/30 text-amber-400 border border-amber-800'
        : 'bg-amber-100 text-amber-700 border border-amber-200',
      low: theme === 'dark'
        ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-800'
        : 'bg-emerald-100 text-emerald-700 border border-emerald-200',
    },
    riskBadge: {
      high: theme === 'dark'
        ? 'bg-rose-900/30 text-rose-400 border border-rose-800'
        : 'bg-rose-50 text-rose-600 border border-rose-200',
      medium: theme === 'dark'
        ? 'bg-amber-900/30 text-amber-400 border border-amber-800'
        : 'bg-amber-50 text-amber-600 border border-amber-200',
      low: theme === 'dark'
        ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-800'
        : 'bg-emerald-50 text-emerald-600 border border-emerald-200',
    },
    statCard: theme === 'dark'
      ? 'bg-gray-800 border-gray-700'
      : 'bg-white/80 backdrop-blur-sm border-0',
    cropCard: theme === 'dark'
      ? 'bg-gray-800 border-gray-700 hover:shadow-gray-900/50'
      : 'bg-white/90 backdrop-blur-sm hover:shadow-xl',
    weatherBlock: theme === 'dark'
      ? 'bg-gray-700 border-gray-600'
      : 'bg-gradient-to-r from-blue-50 to-indigo-50',
    taskItem: theme === 'dark'
      ? 'bg-gray-700 border-gray-600'
      : 'bg-gray-50',
    modal: theme === 'dark'
      ? 'bg-gray-800 border-gray-700'
      : 'bg-gradient-to-br from-white to-emerald-50/30',
    breadcrumb: theme === 'dark'
      ? 'bg-gray-800 border-gray-700'
      : 'bg-white/70 backdrop-blur-sm',
    shadow: {
      card: theme === 'dark' 
        ? 'shadow-lg shadow-black/20' 
        : 'shadow-lg shadow-gray-200',
      hover: theme === 'dark'
        ? 'hover:shadow-xl hover:shadow-black/30'
        : 'hover:shadow-xl hover:shadow-gray-300',
    },
    divider: theme === 'dark' ? 'border-gray-700' : 'border-gray-200',
    hover: {
      card: theme === 'dark'
        ? 'hover:bg-gray-750 hover:border-gray-600'
        : 'hover:bg-gray-50 hover:border-gray-300',
    },
    iconWrapper: {
      bg: (color) => {
        const colorMap = {
          amber: theme === 'dark' ? 'bg-amber-900/30' : 'bg-amber-100',
          yellow: theme === 'dark' ? 'bg-yellow-900/30' : 'bg-yellow-100',
          orange: theme === 'dark' ? 'bg-orange-900/30' : 'bg-orange-100',
          green: theme === 'dark' ? 'bg-green-900/30' : 'bg-green-100',
          emerald: theme === 'dark' ? 'bg-emerald-900/30' : 'bg-emerald-100',
          brown: theme === 'dark' ? 'bg-amber-900/30' : 'bg-amber-100',
          default: theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100',
        };
        return colorMap[color] || colorMap.default;
      },
      text: (color) => {
        const colorMap = {
          amber: theme === 'dark' ? 'text-amber-400' : 'text-amber-600',
          yellow: theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600',
          orange: theme === 'dark' ? 'text-orange-400' : 'text-orange-600',
          green: theme === 'dark' ? 'text-green-400' : 'text-green-600',
          emerald: theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600',
          brown: theme === 'dark' ? 'text-amber-400' : 'text-amber-600',
          default: theme === 'dark' ? 'text-gray-400' : 'text-gray-600',
        };
        return colorMap[color] || colorMap.default;
      },
    },
    progressBar: {
      bg: theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100',
      fill: 'bg-gradient-to-r from-emerald-500 to-green-500',
    },
    closeButton: theme === 'dark'
      ? 'bg-gray-700 hover:bg-gray-600 border-gray-600'
      : 'bg-gray-100 hover:bg-gray-200 border-gray-200',
  };

  // Данные по культурам
  const [crops] = useState([
    {
      id: 1,
      name: 'Пшеница',
      latinName: 'Triticum aestivum',
      icon: '🌾',
      color: 'amber',
      area: '45.2',
      areaUnit: 'га',
      yield: '42.3',
      yieldUnit: 'ц/га',
      growth: 80,
      sowingDate: '15.04.2026',
      harvestDate: '25.08.2026',
      status: 'active',
      field: 'Северное поле',
      humidity: 65,
      temperature: '22°C',
      fertilizer: 'Азотные',
      pestRisk: 'low',
      price: '12 500',
      priceUnit: 'сом/т',
      profit: '+15.3%',
      tasks: [
        { id: 1, title: 'Внесение удобрений', date: '20.06.2026', status: 'planned' },
        { id: 2, title: 'Обработка от вредителей', date: '25.06.2026', status: 'planned' }
      ]
    },
    {
      id: 2,
      name: 'Кукуруза',
      latinName: 'Zea mays',
      icon: '🌽',
      color: 'yellow',
      area: '38.7',
      areaUnit: 'га',
      yield: '65.1',
      yieldUnit: 'ц/га',
      growth: 65,
      sowingDate: '10.05.2026',
      harvestDate: '15.09.2026',
      status: 'active',
      field: 'Южное поле',
      humidity: 70,
      temperature: '24°C',
      fertilizer: 'Фосфорные',
      pestRisk: 'medium',
      price: '14 200',
      priceUnit: 'сом/т',
      profit: '+22.7%',
      tasks: [
        { id: 1, title: 'Полив полей', date: '18.06.2026', status: 'inProgress' },
        { id: 2, title: 'Прополка', date: '22.06.2026', status: 'planned' }
      ]
    },
    {
      id: 3,
      name: 'Подсолнечник',
      latinName: 'Helianthus annuus',
      icon: '🌻',
      color: 'orange',
      area: '22.5',
      areaUnit: 'га',
      yield: '28.4',
      yieldUnit: 'ц/га',
      growth: 45,
      sowingDate: '20.05.2026',
      harvestDate: '10.10.2026',
      status: 'active',
      field: 'Восточное поле',
      humidity: 55,
      temperature: '26°C',
      fertilizer: 'Калийные',
      pestRisk: 'high',
      price: '28 500',
      priceUnit: 'сом/т',
      profit: '+32.1%',
      tasks: [
        { id: 1, title: 'Обработка от вредителей', date: '15.06.2026', status: 'planned' }
      ]
    },
    {
      id: 4,
      name: 'Ячмень',
      latinName: 'Hordeum vulgare',
      icon: '🌾',
      color: 'green',
      area: '40.1',
      areaUnit: 'га',
      yield: '38.2',
      yieldUnit: 'ц/га',
      growth: 70,
      sowingDate: '05.04.2026',
      harvestDate: '10.08.2026',
      status: 'active',
      field: 'Западное поле',
      humidity: 60,
      temperature: '21°C',
      fertilizer: 'Азотные',
      pestRisk: 'low',
      price: '11 800',
      priceUnit: 'сом/т',
      profit: '+12.8%',
      tasks: [
        { id: 1, title: 'Внесение удобрений', date: '12.06.2026', status: 'completed' }
      ]
    },
    {
      id: 5,
      name: 'Соя',
      latinName: 'Glycine max',
      icon: '🌱',
      color: 'emerald',
      area: '18.3',
      areaUnit: 'га',
      yield: '22.7',
      yieldUnit: 'ц/га',
      growth: 35,
      sowingDate: '01.06.2026',
      harvestDate: '05.10.2026',
      status: 'seedling',
      field: 'Северо-западное поле',
      humidity: 75,
      temperature: '23°C',
      fertilizer: 'Фосфорные',
      pestRisk: 'low',
      price: '32 000',
      priceUnit: 'сом/т',
      profit: '+18.5%',
      tasks: []
    },
    {
      id: 6,
      name: 'Картофель',
      latinName: 'Solanum tuberosum',
      icon: '🥔',
      color: 'brown',
      area: '25.8',
      areaUnit: 'га',
      yield: '185.3',
      yieldUnit: 'ц/га',
      growth: 50,
      sowingDate: '15.05.2026',
      harvestDate: '20.09.2026',
      status: 'active',
      field: 'Юго-восточное поле',
      humidity: 80,
      temperature: '20°C',
      fertilizer: 'Калийные',
      pestRisk: 'medium',
      price: '18 000',
      priceUnit: 'сом/т',
      profit: '+25.4%',
      tasks: []
    }
  ]);

  // Статистика по культурам
  const statistics = {
    totalArea: crops.reduce((sum, crop) => sum + parseFloat(crop.area), 0).toFixed(1),
    avgYield: (crops.reduce((sum, crop) => sum + parseFloat(crop.yield), 0) / crops.length).toFixed(1),
    activeCrops: crops.filter(c => c.status === 'active').length,
    totalProfit: '+21.3%'
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'active': return themeClasses.badge.active;
      case 'seedling': return themeClasses.badge.seedling;
      case 'harvest': return themeClasses.badge.harvest;
      case 'planned': return themeClasses.badge.planned;
      case 'inProgress': return themeClasses.badge.inProgress;
      case 'completed': return themeClasses.badge.completed;
      case 'high': return themeClasses.badge.high;
      case 'medium': return themeClasses.badge.medium;
      case 'low': return themeClasses.badge.low;
      default: return themeClasses.badge.rest;
    }
  };

  const getRiskBadge = (risk) => {
    switch(risk) {
      case 'high': return themeClasses.riskBadge.high;
      case 'medium': return themeClasses.riskBadge.medium;
      case 'low': return themeClasses.riskBadge.low;
      default: return themeClasses.riskBadge.low;
    }
  };

  return (
    <div className={`min-h-screen py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${themeClasses.page}`}>
      <div className="max-w-7xl mx-auto">
        {/* Хлебные крошки */}
        <div className="flex items-center text-sm mb-6">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-sm border ${themeClasses.breadcrumb} ${themeClasses.shadow.card}`}>
            <span className={`${themeClasses.text.secondary} hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer transition-colors`}>
              <i className="fas fa-home mr-1"></i>Главная
            </span>
            <i className={`fas fa-chevron-right text-xs ${themeClasses.text.muted}`}></i>
            <span className={`${themeClasses.text.secondary} hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer transition-colors`}>
              Справочники
            </span>
            <i className={`fas fa-chevron-right text-xs ${themeClasses.text.muted}`}></i>
            <span className={`text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1`}>
              <i className="fas fa-leaf"></i>
              Культуры
            </span>
          </div>
        </div>

        {/* Заголовок страницы */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-green-500 rounded-2xl blur-lg opacity-30"></div>
              <div className="relative bg-gradient-to-r from-emerald-500 to-green-600 text-white p-4 rounded-2xl shadow-lg">
                <i className="fas fa-leaf text-2xl"></i>
              </div>
            </div>
            <div>
              <h1 className={`text-3xl md:text-4xl font-bold ${themeClasses.text.primary}`}>
                Культуры
              </h1>
              <p className={`mt-1 flex items-center gap-2 ${themeClasses.text.secondary}`}>
                <i className="fas fa-map-marker-alt text-emerald-500 dark:text-emerald-400"></i>
                КФХ "Рассвет" • {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <div className="mt-4 md:mt-0 flex gap-3">
            <button 
              className={`px-4 py-2 rounded-lg flex items-center gap-2 border transition-colors ${themeClasses.button.secondary}`}
            >
              <i className="fas fa-download"></i>
              Экспорт
            </button>
            <button 
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${themeClasses.button.primary}`}
              onClick={() => setShowCropModal(true)}
            >
              <i className="fas fa-plus"></i>
              Добавить культуру
            </button>
          </div>
        </div>

        {/* Статистика по культурам */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className={`p-5 rounded-xl border transition-all duration-300 hover:-translate-y-1 ${themeClasses.statCard} ${themeClasses.shadow.card} ${themeClasses.hover.card}`}>
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${themeClasses.iconWrapper.bg('emerald')}`}>
                <i className={`fas fa-map-marked-alt text-2xl ${themeClasses.iconWrapper.text('emerald')}`}></i>
              </div>
              <div>
                <p className={`text-sm font-medium ${themeClasses.text.secondary}`}>Общая площадь</p>
                <p className={`text-2xl font-bold ${themeClasses.text.primary}`}>{statistics.totalArea} га</p>
                <p className={`text-xs mt-1 flex items-center gap-1 ${themeClasses.text.accent}`}>
                  <i className="fas fa-arrow-up"></i> +2.5% за месяц
                </p>
              </div>
            </div>
          </div>
          
          <div className={`p-5 rounded-xl border transition-all duration-300 hover:-translate-y-1 ${themeClasses.statCard} ${themeClasses.shadow.card} ${themeClasses.hover.card}`}>
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${themeClasses.iconWrapper.bg('amber')}`}>
                <i className={`fas fa-seedling text-2xl ${themeClasses.iconWrapper.text('amber')}`}></i>
              </div>
              <div>
                <p className={`text-sm font-medium ${themeClasses.text.secondary}`}>Средняя урожайность</p>
                <p className={`text-2xl font-bold ${themeClasses.text.primary}`}>{statistics.avgYield} ц/га</p>
                <p className={`text-xs mt-1 flex items-center gap-1 ${themeClasses.text.accent}`}>
                  <i className="fas fa-arrow-up"></i> +1.8% за месяц
                </p>
              </div>
            </div>
          </div>
          
          <div className={`p-5 rounded-xl border transition-all duration-300 hover:-translate-y-1 ${themeClasses.statCard} ${themeClasses.shadow.card} ${themeClasses.hover.card}`}>
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${themeClasses.iconWrapper.bg('blue')}`}>
                <i className={`fas fa-check-circle text-2xl ${
                  theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                }`}></i>
              </div>
              <div>
                <p className={`text-sm font-medium ${themeClasses.text.secondary}`}>Активные культуры</p>
                <p className={`text-2xl font-bold ${themeClasses.text.primary}`}>{statistics.activeCrops}</p>
                <p className={`text-xs mt-1 flex items-center gap-1 ${themeClasses.text.accent}`}>
                  <i className="fas fa-check-circle"></i> В процессе
                </p>
              </div>
            </div>
          </div>
          
          <div className={`p-5 rounded-xl border transition-all duration-300 hover:-translate-y-1 ${themeClasses.statCard} ${themeClasses.shadow.card} ${themeClasses.hover.card}`}>
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${themeClasses.iconWrapper.bg('purple')}`}>
                <i className={`fas fa-chart-line text-2xl ${
                  theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
                }`}></i>
              </div>
              <div>
                <p className={`text-sm font-medium ${themeClasses.text.secondary}`}>Рентабельность</p>
                <p className={`text-2xl font-bold ${themeClasses.text.primary}`}>{statistics.totalProfit}</p>
                <p className={`text-xs mt-1 flex items-center gap-1 ${themeClasses.text.accent}`}>
                  <i className="fas fa-arrow-up"></i> к прошлому году
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Фильтры и поиск */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className={`flex items-center gap-2 rounded-xl p-1 border shadow-sm ${themeClasses.breadcrumb} ${themeClasses.shadow.card}`}>
            <button
              onClick={() => setActiveTab('all')}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'all'
                  ? themeClasses.button.primary
                  : `${themeClasses.text.secondary} hover:bg-gray-100 dark:hover:bg-gray-700`
              }`}
            >
              Все культуры
            </button>
            <button
              onClick={() => setActiveTab('active')}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'active'
                  ? themeClasses.button.primary
                  : `${themeClasses.text.secondary} hover:bg-gray-100 dark:hover:bg-gray-700`
              }`}
            >
              Активные
            </button>
            <button
              onClick={() => setActiveTab('seedling')}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'seedling'
                  ? themeClasses.button.primary
                  : `${themeClasses.text.secondary} hover:bg-gray-100 dark:hover:bg-gray-700`
              }`}
            >
              Всходы
            </button>
            <button
              onClick={() => setActiveTab('harvest')}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'harvest'
                  ? themeClasses.button.primary
                  : `${themeClasses.text.secondary} hover:bg-gray-100 dark:hover:bg-gray-700`
              }`}
            >
              Уборка
            </button>
          </div>
          
          <div className="relative">
            <i className={`fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 ${themeClasses.text.muted} text-sm`}></i>
            <input 
              type="text" 
              placeholder="Поиск культур..."
              className={`pl-10 pr-5 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-emerald-100 dark:focus:ring-emerald-900/30 focus:border-emerald-500 transition-all w-full sm:w-64 ${themeClasses.input}`}
            />
          </div>
        </div>

        {/* Сетка культур */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {crops
            .filter(crop => activeTab === 'all' || crop.status === activeTab)
            .map(crop => {
              return (
                <div 
                  key={crop.id} 
                  className={`p-6 rounded-xl border transition-all duration-300 hover:-translate-y-2 group cursor-pointer ${themeClasses.cropCard} ${themeClasses.shadow.card} ${themeClasses.shadow.hover}`}
                  onClick={() => setSelectedCrop(crop)}
                >
                  {/* Шапка карточки */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-md ${themeClasses.iconWrapper.bg(crop.color)}`}>
                        {crop.icon}
                      </div>
                      <div>
                        <h3 className={`font-bold text-lg ${themeClasses.text.primary}`}>{crop.name}</h3>
                        <p className={`text-xs italic ${themeClasses.text.muted}`}>{crop.latinName}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${getStatusBadge(crop.status)}`}>
                      {crop.status === 'active' ? 'Активный' :
                       crop.status === 'seedling' ? 'Всходы' :
                       crop.status === 'harvest' ? 'Уборка' : 'Покой'}
                    </span>
                  </div>

                  {/* Основные показатели */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className={`rounded-xl p-3 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <p className={`text-xs mb-1 ${themeClasses.text.muted}`}>Площадь</p>
                      <p className={`font-bold ${themeClasses.text.primary}`}>{crop.area} {crop.areaUnit}</p>
                    </div>
                    <div className={`rounded-xl p-3 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <p className={`text-xs mb-1 ${themeClasses.text.muted}`}>Урожайность</p>
                      <p className={`font-bold ${themeClasses.text.primary}`}>{crop.yield} {crop.yieldUnit}</p>
                    </div>
                  </div>

                  {/* Прогресс роста */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className={`text-xs ${themeClasses.text.muted}`}>Рост</span>
                      <span className={`text-xs font-semibold ${themeClasses.text.primary}`}>{crop.growth}%</span>
                    </div>
                    <div className={`w-full rounded-full h-2.5 overflow-hidden ${themeClasses.progressBar.bg}`}>
                      <div 
                        className={`h-2.5 rounded-full transition-all duration-500 ${themeClasses.progressBar.fill}`}
                        style={{ width: `${crop.growth}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Детали */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center gap-2 text-xs">
                      <i className="fas fa-calendar-alt text-emerald-500"></i>
                      <span className={themeClasses.text.secondary}>Посев:</span>
                      <span className={`font-medium ${themeClasses.text.primary}`}>{crop.sowingDate}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <i className="fas fa-calendar-check text-amber-500"></i>
                      <span className={themeClasses.text.secondary}>Уборка:</span>
                      <span className={`font-medium ${themeClasses.text.primary}`}>{crop.harvestDate}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <i className="fas fa-map-pin text-blue-500"></i>
                      <span className={themeClasses.text.secondary}>Поле:</span>
                      <span className={`font-medium ${themeClasses.text.primary}`}>{crop.field}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <i className="fas fa-flask text-purple-500"></i>
                      <span className={themeClasses.text.secondary}>Удобр.:</span>
                      <span className={`font-medium ${themeClasses.text.primary}`}>{crop.fertilizer}</span>
                    </div>
                  </div>

                  {/* Погодные условия */}
                  <div className={`flex items-center justify-between rounded-xl p-3 mb-4 border ${themeClasses.weatherBlock}`}>
                    <div className="flex items-center gap-2">
                      <i className={`fas fa-temperature-high ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}></i>
                      <span className={`text-sm ${themeClasses.text.secondary}`}>{crop.temperature}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <i className={`fas fa-tint ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}></i>
                      <span className={`text-sm ${themeClasses.text.secondary}`}>{crop.humidity}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <i className={`fas fa-exclamation-triangle ${theme === 'dark' ? 'text-amber-400' : 'text-amber-600'}`}></i>
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${getRiskBadge(crop.pestRisk)}`}>
                        {crop.pestRisk === 'high' ? 'Высокий' :
                         crop.pestRisk === 'medium' ? 'Средний' : 'Низкий'} риск
                      </span>
                    </div>
                  </div>

                  {/* Цена и прибыль */}
                  <div className={`flex items-center justify-between pt-4 border-t ${themeClasses.divider}`}>
                    <div>
                      <p className={`text-xs mb-1 ${themeClasses.text.muted}`}>Текущая цена</p>
                      <p className={`font-bold ${themeClasses.text.primary}`}>{crop.price} {crop.priceUnit}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-xs mb-1 ${themeClasses.text.muted}`}>Прибыль/мес</p>
                      <p className={`font-bold ${themeClasses.text.accent}`}>{crop.profit}</p>
                    </div>
                  </div>

                  {/* Задачи */}
                  {crop.tasks.length > 0 && (
                    <div className={`mt-4 pt-4 border-t ${themeClasses.divider}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-xs font-medium flex items-center gap-1 ${themeClasses.text.primary}`}>
                          <i className="fas fa-tasks text-emerald-500"></i>
                          Задачи ({crop.tasks.length})
                        </span>
                        <span className={`text-xs ${themeClasses.text.accent} hover:text-emerald-700 cursor-pointer`}>
                          Посмотреть все
                        </span>
                      </div>
                      <div className="space-y-2">
                        {crop.tasks.slice(0, 2).map(task => (
                          <div key={task.id} className={`flex items-center justify-between text-xs p-2 rounded-lg border ${themeClasses.taskItem}`}>
                            <span className={themeClasses.text.primary}>{task.title}</span>
                            <div className="flex items-center gap-2">
                              <span className={themeClasses.text.muted}>{task.date}</span>
                              <span className={`px-2 py-0.5 rounded-full text-xs border ${getStatusBadge(task.status)}`}>
                                {task.status === 'planned' ? 'План' :
                                 task.status === 'inProgress' ? 'В процессе' :
                                 task.status === 'completed' ? 'Выполнено' : task.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
        </div>

        {/* Модальное окно детальной информации о культуре */}
        {selectedCrop && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/50" onClick={() => setSelectedCrop(null)}></div>
            <div className={`relative w-full max-w-3xl rounded-2xl border p-8 ${themeClasses.modal} ${themeClasses.shadow.card}`}>
              {/* Шапка */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-4xl shadow-lg ${themeClasses.iconWrapper.bg(selectedCrop.color)}`}>
                    {selectedCrop.icon}
                  </div>
                  <div>
                    <h2 className={`text-2xl font-bold ${themeClasses.text.primary}`}>{selectedCrop.name}</h2>
                    <p className={`text-sm italic ${themeClasses.text.muted}`}>{selectedCrop.latinName}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedCrop(null)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors border ${themeClasses.closeButton}`}
                >
                  <i className={`fas fa-times ${themeClasses.text.secondary}`}></i>
                </button>
              </div>

              {/* Статистика */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className={`p-4 rounded-xl border shadow-sm ${themeClasses.card}`}>
                  <p className={`text-xs mb-1 ${themeClasses.text.muted}`}>Площадь</p>
                  <p className={`text-xl font-bold ${themeClasses.text.primary}`}>
                    {selectedCrop.area} {selectedCrop.areaUnit}
                  </p>
                </div>
                <div className={`p-4 rounded-xl border shadow-sm ${themeClasses.card}`}>
                  <p className={`text-xs mb-1 ${themeClasses.text.muted}`}>Урожайность</p>
                  <p className={`text-xl font-bold ${themeClasses.text.primary}`}>
                    {selectedCrop.yield} {selectedCrop.yieldUnit}
                  </p>
                </div>
                <div className={`p-4 rounded-xl border shadow-sm ${themeClasses.card}`}>
                  <p className={`text-xs mb-1 ${themeClasses.text.muted}`}>Дата посева</p>
                  <p className={`text-xl font-bold ${themeClasses.text.primary}`}>{selectedCrop.sowingDate}</p>
                </div>
                <div className={`p-4 rounded-xl border shadow-sm ${themeClasses.card}`}>
                  <p className={`text-xs mb-1 ${themeClasses.text.muted}`}>Дата уборки</p>
                  <p className={`text-xl font-bold ${themeClasses.text.primary}`}>{selectedCrop.harvestDate}</p>
                </div>
              </div>

              {/* Две колонки */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Левая колонка */}
                <div className="space-y-4">
                  {/* Рост */}
                  <div className={`p-4 rounded-xl border shadow-sm ${themeClasses.card}`}>
                    <h3 className={`font-semibold mb-3 flex items-center gap-2 ${themeClasses.text.primary}`}>
                      <i className={`fas fa-chart-line ${themeClasses.text.accent}`}></i>
                      Рост
                    </h3>
                    <div className="flex justify-between mb-2">
                      <span className={`text-sm ${themeClasses.text.secondary}`}>Текущий рост</span>
                      <span className={`text-sm font-bold ${themeClasses.text.accent}`}>
                        {selectedCrop.growth}%
                      </span>
                    </div>
                    <div className={`w-full rounded-full h-3 overflow-hidden ${themeClasses.progressBar.bg}`}>
                      <div 
                        className={`h-3 rounded-full ${themeClasses.progressBar.fill}`}
                        style={{ width: `${selectedCrop.growth}%` }}
                      ></div>
                    </div>
                    <p className={`text-xs mt-3 ${themeClasses.text.muted}`}>
                      Ожидаемая уборка: {selectedCrop.harvestDate}
                    </p>
                  </div>

                  {/* Задачи */}
                  <div className={`p-4 rounded-xl border shadow-sm ${themeClasses.card}`}>
                    <h3 className={`font-semibold mb-3 flex items-center gap-2 ${themeClasses.text.primary}`}>
                      <i className={`fas fa-tasks ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}></i>
                      Задачи ({selectedCrop.tasks.length})
                    </h3>
                    <div className="space-y-3">
                      {selectedCrop.tasks.length > 0 ? (
                        selectedCrop.tasks.map(task => (
                          <div key={task.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <i className="fas fa-circle text-[6px] text-emerald-500"></i>
                              <span className={`text-sm ${themeClasses.text.secondary}`}>{task.title}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className={`text-xs ${themeClasses.text.muted}`}>{task.date}</span>
                              <span className={`px-2 py-1 rounded-lg text-xs border ${getStatusBadge(task.status)}`}>
                                {task.status === 'planned' ? 'План' :
                                 task.status === 'inProgress' ? 'В процессе' :
                                 task.status === 'completed' ? 'Выполнено' : task.status}
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className={`text-sm text-center py-2 ${themeClasses.text.muted}`}>
                          Нет задач
                        </p>
                      )}
                      <button className={`w-full mt-2 px-4 py-2 rounded-lg border text-sm flex items-center justify-center gap-2 ${themeClasses.button.secondary}`}>
                        <i className="fas fa-plus"></i>
                        Добавить задачу
                      </button>
                    </div>
                  </div>
                </div>

                {/* Правая колонка */}
                <div className="space-y-4">
                  {/* Погода */}
                  <div className={`p-4 rounded-xl border shadow-sm ${themeClasses.card}`}>
                    <h3 className={`font-semibold mb-3 flex items-center gap-2 ${themeClasses.text.primary}`}>
                      <i className={`fas fa-cloud-sun ${theme === 'dark' ? 'text-amber-400' : 'text-amber-600'}`}></i>
                      Погодные условия
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className={`text-xs mb-1 ${themeClasses.text.muted}`}>Температура</p>
                        <p className={`text-lg font-bold ${themeClasses.text.primary}`}>{selectedCrop.temperature}</p>
                      </div>
                      <div>
                        <p className={`text-xs mb-1 ${themeClasses.text.muted}`}>Влажность</p>
                        <p className={`text-lg font-bold ${themeClasses.text.primary}`}>{selectedCrop.humidity}%</p>
                      </div>
                      <div>
                        <p className={`text-xs mb-1 ${themeClasses.text.muted}`}>Удобрение</p>
                        <p className={`text-lg font-bold ${themeClasses.text.primary}`}>{selectedCrop.fertilizer}</p>
                      </div>
                      <div>
                        <p className={`text-xs mb-1 ${themeClasses.text.muted}`}>Риск вредителей</p>
                        <span className={`inline-block px-3 py-1.5 rounded-lg text-xs font-medium border ${getRiskBadge(selectedCrop.pestRisk)}`}>
                          {selectedCrop.pestRisk === 'high' ? 'Высокий' :
                           selectedCrop.pestRisk === 'medium' ? 'Средний' : 'Низкий'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Экономика */}
                  <div className={`p-4 rounded-xl border shadow-sm ${themeClasses.card}`}>
                    <h3 className={`font-semibold mb-3 flex items-center gap-2 ${themeClasses.text.primary}`}>
                      <i className={`fas fa-chart-pie ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`}></i>
                      Экономические показатели
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className={`text-sm ${themeClasses.text.secondary}`}>Текущая цена</span>
                        <span className={`font-bold ${themeClasses.text.primary}`}>
                          {selectedCrop.price} {selectedCrop.priceUnit}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className={`text-sm ${themeClasses.text.secondary}`}>Рентабельность</span>
                        <span className={`font-bold ${themeClasses.text.accent}`}>
                          {selectedCrop.profit}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className={`text-sm ${themeClasses.text.secondary}`}>Прогноз цены</span>
                        <span className={`font-bold ${theme === 'dark' ? 'text-amber-400' : 'text-amber-600'}`}>
                          {parseInt(selectedCrop.price.replace(/\s/g, '')) * 1.15} сом/т
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Кнопки действий */}
                  <div className="flex gap-3 mt-4">
                    <button className={`flex-1 px-4 py-2 rounded-lg flex items-center justify-center gap-2 ${themeClasses.button.primary}`}>
                      <i className="fas fa-edit"></i>
                      Редактировать
                    </button>
                    <button className={`flex-1 px-4 py-2 rounded-lg flex items-center justify-center gap-2 border ${themeClasses.button.secondary}`}>
                      <i className="fas fa-chart-line"></i>
                      Аналитика
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Модальное окно добавления культуры */}
        {showCropModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/50" onClick={() => setShowCropModal(false)}></div>
            <div className={`relative w-full max-w-2xl rounded-2xl border p-8 ${themeClasses.modal} ${themeClasses.shadow.card}`}>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <i className="fas fa-plus-circle text-2xl text-white"></i>
                </div>
                <div>
                  <h2 className={`text-2xl font-bold ${themeClasses.text.primary}`}>Добавить новую культуру</h2>
                  <p className={`text-sm mt-1 ${themeClasses.text.secondary}`}>Заполните информацию о новой культуре</p>
                </div>
              </div>
              
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${themeClasses.text.primary}`}>
                      Название культуры
                    </label>
                    <input 
                      type="text" 
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-4 focus:ring-emerald-100 dark:focus:ring-emerald-900/30 focus:border-emerald-500 outline-none transition ${themeClasses.input}`}
                      placeholder="Пшеница"
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${themeClasses.text.primary}`}>
                      Тип культуры
                    </label>
                    <select className={`w-full px-4 py-3 border rounded-xl focus:ring-4 focus:ring-emerald-100 dark:focus:ring-emerald-900/30 focus:border-emerald-500 outline-none transition ${themeClasses.input}`}>
                      <option>Зерновые</option>
                      <option>Масличные</option>
                      <option>Бобовые</option>
                      <option>Овощные</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${themeClasses.text.primary}`}>
                      Дата посева
                    </label>
                    <input 
                      type="date" 
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-4 focus:ring-emerald-100 dark:focus:ring-emerald-900/30 focus:border-emerald-500 outline-none transition ${themeClasses.input}`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${themeClasses.text.primary}`}>
                      Дата уборки
                    </label>
                    <input 
                      type="date" 
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-4 focus:ring-emerald-100 dark:focus:ring-emerald-900/30 focus:border-emerald-500 outline-none transition ${themeClasses.input}`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${themeClasses.text.primary}`}>
                      Площадь (га)
                    </label>
                    <input 
                      type="number" 
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-4 focus:ring-emerald-100 dark:focus:ring-emerald-900/30 focus:border-emerald-500 outline-none transition ${themeClasses.input}`}
                      placeholder="0.0"
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${themeClasses.text.primary}`}>
                      Поле
                    </label>
                    <select className={`w-full px-4 py-3 border rounded-xl focus:ring-4 focus:ring-emerald-100 dark:focus:ring-emerald-900/30 focus:border-emerald-500 outline-none transition ${themeClasses.input}`}>
                      <option>Северное поле</option>
                      <option>Южное поле</option>
                      <option>Восточное поле</option>
                      <option>Западное поле</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${themeClasses.text.primary}`}>
                    Описание
                  </label>
                  <textarea 
                    rows="3"
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-4 focus:ring-emerald-100 dark:focus:ring-emerald-900/30 focus:border-emerald-500 outline-none transition ${themeClasses.input}`}
                    placeholder="Дополнительная информация о культуре..."
                  ></textarea>
                </div>

                <div className="flex gap-4 mt-8">
                  <button 
                    className={`flex-1 py-3 rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-emerald-200 dark:shadow-none ${themeClasses.button.primary}`}
                  >
                    <i className="fas fa-check"></i>
                    Сохранить
                  </button>
                  <button 
                    className={`flex-1 py-3 rounded-lg flex items-center justify-center gap-2 border ${themeClasses.button.secondary}`}
                    onClick={() => setShowCropModal(false)}
                  >
                    Отмена
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Crops;