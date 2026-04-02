import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';

const Analytics = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const [period, setPeriod] = useState('month');

  // ✅ КЛАССЫ ДЛЯ ТЕМЫ - КАК В PAYMENT.JSX
  const themeClasses = {
    page: theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50',
    card: theme === 'dark' 
      ? 'bg-gray-800 border-gray-700' 
      : 'bg-white border-gray-200',
    text: {
      primary: theme === 'dark' ? 'text-white' : 'text-gray-900',      // Основной текст - БЕЛЫЙ в темной теме
      secondary: theme === 'dark' ? 'text-gray-300' : 'text-gray-600', // Вторичный текст - СВЕТЛО-СЕРЫЙ
      muted: theme === 'dark' ? 'text-gray-400' : 'text-gray-500',     // Третьестепенный - СЕРЫЙ
    },
    border: theme === 'dark' ? 'border-gray-700' : 'border-gray-200',
    button: {
      primary: 'bg-green-600 hover:bg-green-700 text-white',
      secondary: theme === 'dark'
        ? 'border-gray-600 hover:bg-gray-700 text-gray-300'
        : 'border-gray-200 hover:bg-gray-50 text-gray-600',
      outline: theme === 'dark'
        ? 'border-gray-600 hover:bg-gray-700 text-gray-300'
        : 'border-gray-300 hover:bg-gray-100 text-gray-700',
    },
    badge: {
      green: theme === 'dark' ? 'bg-green-900/30 text-green-400' : 'bg-green-50 text-green-600',
      blue: theme === 'dark' ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-blue-600',
      purple: theme === 'dark' ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-50 text-purple-600',
      yellow: theme === 'dark' ? 'bg-yellow-900/30 text-yellow-400' : 'bg-yellow-50 text-yellow-600',
    },
    table: {
      header: theme === 'dark' ? 'border-gray-700' : 'border-gray-200',
      row: theme === 'dark' ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-100 hover:bg-gray-50',
      cell: theme === 'dark' ? 'text-gray-300' : 'text-gray-600',
      headerText: theme === 'dark' ? 'text-gray-400' : 'text-gray-500',
    },
    detailRow: theme === 'dark'
      ? 'border-gray-700 bg-gray-700/20'
      : 'border-gray-200 bg-gray-50',
    aiBlock: theme === 'dark'
      ? 'bg-gradient-to-r from-blue-900/30 to-green-900/30 border-blue-800'
      : 'bg-gradient-to-r from-blue-50 to-green-50 border-blue-100',
    reportIcon: {
      purple: theme === 'dark' ? 'bg-purple-900/50' : 'bg-purple-100',
      green: theme === 'dark' ? 'bg-green-900/50' : 'bg-green-100',
      blue: theme === 'dark' ? 'bg-blue-900/50' : 'bg-blue-100',
    }
  };

  // Данные урожайности по месяцам (2025 vs 2026)
  const yieldComparisonData = [
    { month: 'Янв', '2025': 38, '2026': 45 },
    { month: 'Фев', '2025': 42, '2026': 52 },
    { month: 'Мар', '2025': 40, '2026': 48 },
    { month: 'Апр', '2025': 45, '2026': 60 },
    { month: 'Май', '2025': 52, '2026': 72 },
    { month: 'Июн', '2025': 58, '2026': 85 },
  ];

  // Данные по культурам
  const cropData = [
    { name: 'Пшеница', площадь: 180, урожайность: 78, доход: '2.4M', цвет: '#3B82F6' },
    { name: 'Кукуруза', площадь: 120, урожайность: 82, доход: '1.8M', цвет: '#10B981' },
    { name: 'Подсолнечник', площадь: 95, урожайность: 65, доход: '1.2M', цвет: '#F59E0B' },
    { name: 'Ячмень', площадь: 85, урожайность: 71, доход: '980K', цвет: '#8B5CF6' },
  ];

  // Распределение доходов
  const revenueData = [
    { name: 'Пшеница', value: 42, color: '#3B82F6' },
    { name: 'Кукуруза', value: 28, color: '#10B981' },
    { name: 'Подсолнечник', value: 18, color: '#F59E0B' },
    { name: 'Ячмень', value: 12, color: '#8B5CF6' },
  ];

  // Ежемесячные расходы
  const expensesData = [
    { month: 'Янв', семена: 45, удобрения: 60, техника: 30 },
    { month: 'Фев', семена: 42, удобрения: 55, техника: 35 },
    { month: 'Мар', семена: 48, удобрения: 62, техника: 38 },
    { month: 'Апр', семена: 55, удобрения: 70, техника: 42 },
    { month: 'Май', семена: 60, удобрения: 75, техника: 45 },
    { month: 'Июн', семена: 58, удобрения: 72, техника: 48 },
  ];

  // Прогнозы
  const forecasts = [
    { month: 'Июл', прогноз: 88 },
    { month: 'Авг', прогноз: 92 },
    { month: 'Сен', прогноз: 86 },
    { month: 'Окт', прогноз: 79 },
  ];

  // Ключевые показатели
  const keyMetrics = [
    { label: 'Средняя урожайность', value: '74.2', unit: 'ц/га', change: '+12.5%', icon: '🌾', color: 'blue' },
    { label: 'Общая площадь', value: '480', unit: 'га', change: '+8.3%', icon: '🗺️', color: 'green' },
    { label: 'Валовая прибыль', value: '6.38M', unit: 'som', change: '+23.1%', icon: '💰', color: 'yellow' },
    { label: 'Рентабельность', value: '34.8', unit: '%', change: '+5.2%', icon: '📈', color: 'purple' },
  ];

  // Цвета для графиков в темной теме
  const chartColors = {
    grid: theme === 'dark' ? '#374151' : '#f0f0f0',
    text: theme === 'dark' ? '#9CA3AF' : '#6B7280',
    axis: theme === 'dark' ? '#4B5563' : '#E5E7EB',
  };

  return (
    <div className={`min-h-screen p-6 transition-colors duration-300 ${themeClasses.page}`}>
      {/* Хедер как в Payment */}
      <div className="mb-6">
        <h1 className={`text-2xl font-bold mb-2 ${themeClasses.text.primary}`}>
          Аналитика и статистика
        </h1>
        <p className={themeClasses.text.secondary}>
          Анализ урожайности и эффективности хозяйства
        </p>
      </div>

      {/* Период как в Payment */}
      <div className="flex justify-end mb-6">
        <div className={`flex items-center rounded-lg border p-1 ${themeClasses.card}`}>
          {['Неделя', 'Месяц', 'Квартал', 'Год'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p.toLowerCase())}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                period === p.toLowerCase()
                  ? 'bg-green-600 text-white'
                  : themeClasses.text.secondary + ' hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Ключевые метрики - 4 карточки как в Payment */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {keyMetrics.map((metric, idx) => (
          <div key={idx} className={`p-5 rounded-xl border ${themeClasses.card}`}>
            <div className="flex items-start justify-between">
              <div>
                <p className={`text-sm ${themeClasses.text.secondary}`}>{metric.label}</p>
                <p className={`text-2xl font-bold mt-1 ${themeClasses.text.primary}`}>
                  {metric.value} {metric.unit}
                </p>
                <div className="flex items-center mt-2">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${themeClasses.badge[metric.color] || themeClasses.badge.green}`}>
                    {metric.change}
                  </span>
                  <span className={`text-xs ml-2 ${themeClasses.text.muted}`}>за месяц</span>
                </div>
              </div>
              <span className="text-3xl">{metric.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* График урожайности */}
      <div className={`p-6 rounded-xl border mb-6 ${themeClasses.card}`}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className={`text-lg font-semibold ${themeClasses.text.primary}`}>
              Динамика урожайности
            </h3>
            <p className={`text-sm ${themeClasses.text.secondary}`}>
              Сравнение 2025 и 2026 годов
            </p>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 bg-blue-600 rounded-full"></span>
              <span className={`text-xs ${themeClasses.text.secondary}`}>2026</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 bg-gray-400 rounded-full"></span>
              <span className={`text-xs ${themeClasses.text.secondary}`}>2025</span>
            </div>
          </div>
        </div>
        
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={yieldComparisonData}>
            <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
            <XAxis dataKey="month" stroke={chartColors.text} />
            <YAxis stroke={chartColors.text} />
            <Tooltip 
              contentStyle={{
                backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF',
                borderColor: theme === 'dark' ? '#374151' : '#E5E7EB',
                color: theme === 'dark' ? '#FFFFFF' : '#111827'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="2026" 
              stroke="#3B82F6" 
              strokeWidth={2.5}
              dot={{ r: 4 }}
              name="2026"
            />
            <Line 
              type="monotone" 
              dataKey="2025" 
              stroke="#9CA3AF" 
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ r: 3 }}
              name="2025"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Две колонки - Культуры и Доходы */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Культуры - широкая колонка */}
        <div className={`p-6 rounded-xl border lg:col-span-2 ${themeClasses.card}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-lg font-semibold ${themeClasses.text.primary}`}>
              Культуры
            </h3>
            <button className={`text-sm ${themeClasses.text.secondary} hover:text-green-600`}>
              Все культуры →
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${themeClasses.border}`}>
                  <th className={`text-left py-3 text-xs font-medium uppercase ${themeClasses.table.headerText}`}>Культура</th>
                  <th className={`text-left py-3 text-xs font-medium uppercase ${themeClasses.table.headerText}`}>Площадь (га)</th>
                  <th className={`text-left py-3 text-xs font-medium uppercase ${themeClasses.table.headerText}`}>Урожайность (ц/га)</th>
                  <th className={`text-left py-3 text-xs font-medium uppercase ${themeClasses.table.headerText}`}>Доход</th>
                  <th className={`text-left py-3 text-xs font-medium uppercase ${themeClasses.table.headerText}`}>Доля</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${themeClasses.border}`}>
                {cropData.map((crop, idx) => (
                  <tr key={idx} className={themeClasses.table.row}>
                    <td className={`py-3 text-sm ${themeClasses.text.primary}`}>
                      <div className="flex items-center">
                        <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: crop.цвет }}></span>
                        {crop.name}
                      </div>
                    </td>
                    <td className={`py-3 text-sm ${themeClasses.table.cell}`}>{crop.площадь} га</td>
                    <td className={`py-3 text-sm font-medium ${themeClasses.text.primary}`}>{crop.урожайность} ц/га</td>
                    <td className={`py-3 text-sm ${themeClasses.text.primary}`}>{crop.доход} som</td>
                    <td className="py-3">
                      <div className="flex items-center">
                        <span className={`text-xs mr-2 ${themeClasses.text.secondary}`}>
                          {Math.round((crop.площадь / 480) * 100)}%
                        </span>
                        <div className={`w-16 rounded-full h-1.5 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
                          <div 
                            className="h-1.5 rounded-full"
                            style={{ 
                              width: `${(crop.площадь / 480) * 100}%`,
                              backgroundColor: crop.цвет 
                            }}
                          ></div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Структура доходов - узкая колонка */}
        <div className={`p-6 rounded-xl border ${themeClasses.card}`}>
          <h3 className={`text-lg font-semibold mb-4 ${themeClasses.text.primary}`}>
            Структура доходов
          </h3>
          
          <div className="flex flex-col items-center">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={revenueData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {revenueData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF',
                    borderColor: theme === 'dark' ? '#374151' : '#E5E7EB',
                    color: theme === 'dark' ? '#FFFFFF' : '#111827'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="w-full mt-4 space-y-2">
              {revenueData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <span className="w-2.5 h-2.5 rounded-full mr-2" style={{ backgroundColor: item.color }}></span>
                    <span className={themeClasses.text.secondary}>{item.name}</span>
                  </div>
                  <span className={`font-medium ${themeClasses.text.primary}`}>{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Расходы и прогнозы - две колонки */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Структура расходов */}
        <div className={`p-6 rounded-xl border ${themeClasses.card}`}>
          <h3 className={`text-lg font-semibold mb-4 ${themeClasses.text.primary}`}>
            Структура расходов
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={expensesData}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
              <XAxis dataKey="month" stroke={chartColors.text} />
              <YAxis stroke={chartColors.text} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF',
                  borderColor: theme === 'dark' ? '#374151' : '#E5E7EB',
                  color: theme === 'dark' ? '#FFFFFF' : '#111827'
                }}
              />
              <Bar dataKey="семена" stackId="a" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Семена" />
              <Bar dataKey="удобрения" stackId="a" fill="#10B981" radius={[4, 4, 0, 0]} name="Удобрения" />
              <Bar dataKey="техника" stackId="a" fill="#F59E0B" radius={[4, 4, 0, 0]} name="Техника" />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-4">
            <span className={`flex items-center text-xs ${themeClasses.text.secondary}`}>
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-1"></span> Семена
            </span>
            <span className={`flex items-center text-xs ${themeClasses.text.secondary}`}>
              <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span> Удобрения
            </span>
            <span className={`flex items-center text-xs ${themeClasses.text.secondary}`}>
              <span className="w-2 h-2 bg-yellow-500 rounded-full mr-1"></span> Техника
            </span>
          </div>
        </div>

        {/* Прогноз урожайности */}
        <div className={`p-6 rounded-xl border ${themeClasses.card}`}>
          <h3 className={`text-lg font-semibold mb-4 ${themeClasses.text.primary}`}>
            Прогноз урожайности
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={[...yieldComparisonData.slice(-2), ...forecasts]}>
              <defs>
                <linearGradient id="forecastGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
              <XAxis dataKey="month" stroke={chartColors.text} />
              <YAxis stroke={chartColors.text} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF',
                  borderColor: theme === 'dark' ? '#374151' : '#E5E7EB',
                  color: theme === 'dark' ? '#FFFFFF' : '#111827'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="прогноз" 
                stroke="#3B82F6" 
                strokeWidth={2}
                fill="url(#forecastGradient)" 
                strokeDasharray="5 5"
                name="Прогноз"
              />
              <Area 
                type="monotone" 
                dataKey="2026" 
                stroke="#10B981" 
                strokeWidth={2}
                fill="#10B981" 
                fillOpacity={0.1}
                name="2026"
              />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex justify-between mt-4 text-sm">
            <div>
              <span className={themeClasses.text.secondary}>Прогноз на сезон:</span>
              <span className={`font-bold ml-2 ${themeClasses.text.primary}`}>86.2 ц/га</span>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${themeClasses.badge.green}`}>
              +8.3% к прошлому году
            </span>
          </div>
        </div>
      </div>

      {/* AI Рекомендация - как блок в Payment */}
      <div className={`p-5 rounded-xl border mb-6 ${themeClasses.aiBlock}`}>
        <div className="flex items-start gap-4">
          <div className={`w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center text-xl`}>
            🌿
          </div>
          <div className="flex-1">
            <h4 className={`font-semibold mb-1 ${themeClasses.text.primary}`}>
              AI Рекомендация
            </h4>
            <p className={`text-sm ${themeClasses.text.secondary}`}>
              На основе анализа данных рекомендуем увеличить площадь под кукурузой на 15% для максимальной прибыли.
            </p>
            <div className="flex items-center gap-4 mt-3">
              <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg">
                Применить
              </button>
              <button className={`text-sm ${themeClasses.text.secondary} hover:text-green-600`}>
                Подробнее →
              </button>
            </div>
          </div>
          <div className="text-3xl opacity-20">🤖</div>
        </div>
      </div>

      {/* Отчеты - как в Payment */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`p-4 rounded-xl border cursor-pointer hover:shadow-md transition-shadow ${themeClasses.card}`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 ${themeClasses.reportIcon.purple} rounded-lg flex items-center justify-center text-xl`}>
              📑
            </div>
            <div>
              <p className={`font-medium ${themeClasses.text.primary}`}>Годовой отчет</p>
              <p className={`text-xs ${themeClasses.text.muted}`}>2026 • PDF</p>
            </div>
          </div>
        </div>
        <div className={`p-4 rounded-xl border cursor-pointer hover:shadow-md transition-shadow ${themeClasses.card}`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 ${themeClasses.reportIcon.green} rounded-lg flex items-center justify-center text-xl`}>
              📊
            </div>
            <div>
              <p className={`font-medium ${themeClasses.text.primary}`}>Эффективность полей</p>
              <p className={`text-xs ${themeClasses.text.muted}`}>Обновлено 12.02.2026</p>
            </div>
          </div>
        </div>
        <div className={`p-4 rounded-xl border cursor-pointer hover:shadow-md transition-shadow ${themeClasses.card}`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 ${themeClasses.reportIcon.blue} rounded-lg flex items-center justify-center text-xl`}>
              💰
            </div>
            <div>
              <p className={`font-medium ${themeClasses.text.primary}`}>Финансовый анализ</p>
              <p className={`text-xs ${themeClasses.text.muted}`}>Q1 2026</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;