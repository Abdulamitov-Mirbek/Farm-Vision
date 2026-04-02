// src/pages/finance/FinanceBudget.jsx
import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  Plus, Edit, Trash2, Target, Calendar,
  TrendingUp, TrendingDown, AlertCircle,
  CheckCircle, Clock, Download, Printer,
  Copy, Save, ArrowLeft, ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const FinanceBudget = () => {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const [selectedYear, setSelectedYear] = useState(2026);
  const [selectedMonth, setSelectedMonth] = useState('february');

  const themeClasses = {
    page: theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50',
    card: theme === 'dark' 
      ? 'bg-gray-800 border-gray-700' 
      : 'bg-white border-gray-100',
    text: {
      primary: theme === 'dark' ? 'text-white' : 'text-gray-900',
      secondary: theme === 'dark' ? 'text-gray-400' : 'text-gray-600',
      muted: theme === 'dark' ? 'text-gray-500' : 'text-gray-400',
    },
    button: {
      primary: 'bg-green-600 hover:bg-green-700 text-white',
      secondary: theme === 'dark'
        ? 'border-gray-700 hover:bg-gray-700 text-gray-300'
        : 'border-gray-200 hover:bg-gray-50 text-gray-600',
    },
    border: theme === 'dark' ? 'border-gray-700' : 'border-gray-200',
    progress: {
      low: 'bg-green-500',
      medium: 'bg-yellow-500',
      high: 'bg-red-500',
    },
    badge: {  // ✅ ДОБАВЛЕНО!
      success: theme === 'dark' ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700',
      warning: theme === 'dark' ? 'bg-yellow-900/30 text-yellow-400' : 'bg-yellow-100 text-yellow-700',
      danger: theme === 'dark' ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-700',
      info: theme === 'dark' ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-700',
    },
    input: theme === 'dark'
      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
      : 'bg-white border-gray-300 text-gray-900',
  };

  const translations = {
    title: {
      ru: 'Бюджет',
      en: 'Budget',
      kg: 'Бюджет'
    },
    createBudget: {
      ru: 'Создать бюджет',
      en: 'Create Budget',
      kg: 'Бюджет түзүү'
    },
    export: {
      ru: 'Экспорт',
      en: 'Export',
      kg: 'Экспорт'
    },
    categories: {
      ru: 'Категории',
      en: 'Categories',
      kg: 'Категориялар'
    },
    planned: {
      ru: 'Запланировано',
      en: 'Planned',
      kg: 'Пландалган'
    },
    actual: {
      ru: 'Фактически',
      en: 'Actual',
      kg: 'Чыныгы'
    },
    remaining: {
      ru: 'Остаток',
      en: 'Remaining',
      kg: 'Калган'
    },
    progress: {
      ru: 'Прогресс',
      en: 'Progress',
      kg: 'Прогресс'
    },
    status: {
      ru: 'Статус',
      en: 'Status',
      kg: 'Статус'
    },
    onTrack: {
      ru: 'В норме',
      en: 'On track',
      kg: 'Нормада'
    },
    warning: {
      ru: 'Внимание',
      en: 'Warning',
      kg: 'Көңүл буруу'
    },
    overBudget: {
      ru: 'Превышение',
      en: 'Over budget',
      kg: 'Ашып кетти'
    },
    addCategory: {
      ru: 'Добавить категорию',
      en: 'Add Category',
      kg: 'Категория кошуу'
    },
    january: { ru: 'Январь', en: 'January', kg: 'Январь' },
    february: { ru: 'Февраль', en: 'February', kg: 'Февраль' },
    march: { ru: 'Март', en: 'March', kg: 'Март' },
    april: { ru: 'Апрель', en: 'April', kg: 'Апрель' },
    may: { ru: 'Май', en: 'May', kg: 'Май' },
    june: { ru: 'Июнь', en: 'June', kg: 'Июнь' },
    july: { ru: 'Июль', en: 'July', kg: 'Июль' },
    august: { ru: 'Август', en: 'August', kg: 'Август' },
    september: { ru: 'Сентябрь', en: 'September', kg: 'Сентябрь' },
    october: { ru: 'Октябрь', en: 'October', kg: 'Октябрь' },
    november: { ru: 'Ноябрь', en: 'November', kg: 'Ноябрь' },
    december: { ru: 'Декабрь', en: 'December', kg: 'Декабрь' },
    thisWeek: {
      ru: 'Эта неделя',
      en: 'This week',
      kg: 'Бул апта'
    },
    thisMonth: {
      ru: 'Этот месяц',
      en: 'This month',
      kg: 'Бул ай'
    },
    thisQuarter: {
      ru: 'Этот квартал',
      en: 'This quarter',
      kg: 'Бул квартал'
    },
    thisYear: {
      ru: 'Этот год',
      en: 'This year',
      kg: 'Бул жыл'
    },
    custom: {
      ru: 'Свой период',
      en: 'Custom',
      kg: 'Өз мезгили'
    }
  };

  const t = (key) => translations[key]?.[language] || key;

  const months = [
    'january', 'february', 'march', 'april', 'may', 'june',
    'july', 'august', 'september', 'october', 'november', 'december'
  ];

  // Данные бюджета по категориям
  const budgetCategories = [
    {
      id: 1,
      name: 'Семена',
      planned: 450000,
      actual: 320000,
      color: 'green',
      items: [
        { name: 'Пшеница', planned: 180000, actual: 180000 },
        { name: 'Кукуруза', planned: 150000, actual: 140000 },
        { name: 'Подсолнечник', planned: 120000, actual: 0 },
      ]
    },
    {
      id: 2,
      name: 'Удобрения',
      planned: 380000,
      actual: 275000,
      color: 'blue',
      items: [
        { name: 'Азотные', planned: 150000, actual: 150000 },
        { name: 'Фосфорные', planned: 130000, actual: 125000 },
        { name: 'Калийные', planned: 100000, actual: 0 },
      ]
    },
    {
      id: 3,
      name: 'Техника',
      planned: 520000,
      actual: 490000,
      color: 'yellow',
      items: [
        { name: 'Топливо', planned: 200000, actual: 210000 },
        { name: 'Ремонт', planned: 170000, actual: 180000 },
        { name: 'Запчасти', planned: 150000, actual: 100000 },
      ]
    },
    {
      id: 4,
      name: 'Зарплата',
      planned: 600000,
      actual: 600000,
      color: 'purple',
      items: [
        { name: 'Постоянные', planned: 400000, actual: 400000 },
        { name: 'Сезонные', planned: 200000, actual: 200000 },
      ]
    },
    {
      id: 5,
      name: 'Коммунальные',
      planned: 120000,
      actual: 95000,
      color: 'orange',
      items: [
        { name: 'Электричество', planned: 60000, actual: 55000 },
        { name: 'Вода', planned: 40000, actual: 40000 },
        { name: 'Газ', planned: 20000, actual: 0 },
      ]
    },
  ];

  const getProgressColor = (percentage) => {
    if (percentage <= 70) return themeClasses.progress.low;
    if (percentage <= 90) return themeClasses.progress.medium;
    return themeClasses.progress.high;
  };

  const getStatusIcon = (planned, actual) => {
    const percentage = (actual / planned) * 100;
    if (percentage <= 80) return <CheckCircle size={16} className="text-green-500" />;
    if (percentage <= 100) return <AlertCircle size={16} className="text-yellow-500" />;
    return <AlertCircle size={16} className="text-red-500" />;
  };

  const getStatusText = (planned, actual) => {
    const percentage = (actual / planned) * 100;
    if (percentage <= 80) return t('onTrack');
    if (percentage <= 100) return t('warning');
    return t('overBudget');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ru-RU').format(amount) + ' сом';
  };

  const totalPlanned = budgetCategories.reduce((sum, cat) => sum + cat.planned, 0);
  const totalActual = budgetCategories.reduce((sum, cat) => sum + cat.actual, 0);
  const totalRemaining = totalPlanned - totalActual;

  return (
    <div className={`p-6 space-y-6 transition-colors duration-300 ${themeClasses.page}`}>
      {/* Заголовок */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className={`text-2xl font-bold ${themeClasses.text.primary}`}>{t('title')}</h1>
          <p className={`mt-1 ${themeClasses.text.secondary}`}>
            {language === 'ru' ? 'Планирование и контроль бюджета' :
             language === 'en' ? 'Budget planning and control' :
             'Бюджетти пландоо жана көзөмөлдөө'}
          </p>
        </div>
        
        <div className="flex items-center gap-3 mt-4 md:mt-0">
          <button className={`px-4 py-2 rounded-lg flex items-center gap-2 ${themeClasses.button.primary}`}>
            <Plus size={18} />
            {t('createBudget')}
          </button>
          
          <button className={`p-2 border rounded-lg ${themeClasses.button.secondary}`}>
            <Download size={18} />
          </button>
        </div>
      </div>

      {/* Навигация по месяцам */}
      <div className={`p-4 rounded-xl border ${themeClasses.card}`}>
        <div className="flex items-center justify-between">
          <button className={`p-2 rounded-lg ${themeClasses.button.secondary}`}>
            <ArrowLeft size={18} />
          </button>
          
          <div className="flex items-center gap-4">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className={`px-4 py-2 border rounded-lg ${themeClasses.input}`}
            >
              {months.map((month) => (
                <option key={month} value={month}>{t(month)}</option>
              ))}
            </select>
            
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className={`px-4 py-2 border rounded-lg ${themeClasses.input}`}
            >
              {[2024, 2025, 2026, 2027].map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          
          <button className={`p-2 rounded-lg ${themeClasses.button.secondary}`}>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* Сводка бюджета */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`p-6 rounded-xl shadow-sm border ${themeClasses.card}`}>
          <p className={`text-sm ${themeClasses.text.secondary}`}>{t('planned')}</p>
          <p className={`text-2xl font-bold ${themeClasses.text.primary}`}>{formatCurrency(totalPlanned)}</p>
        </div>
        
        <div className={`p-6 rounded-xl shadow-sm border ${themeClasses.card}`}>
          <p className={`text-sm ${themeClasses.text.secondary}`}>{t('actual')}</p>
          <p className={`text-2xl font-bold text-blue-600`}>{formatCurrency(totalActual)}</p>
        </div>
        
        <div className={`p-6 rounded-xl shadow-sm border ${themeClasses.card}`}>
          <p className={`text-sm ${themeClasses.text.secondary}`}>{t('remaining')}</p>
          <p className={`text-2xl font-bold ${totalRemaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(totalRemaining)}
          </p>
        </div>
      </div>

      {/* Категории бюджета */}
      <div className={`rounded-xl shadow-sm border overflow-hidden ${themeClasses.card}`}>
        <div className={`p-6 border-b flex justify-between items-center ${themeClasses.border}`}>
          <h2 className={`text-lg font-semibold ${themeClasses.text.primary}`}>{t('categories')}</h2>
          <button className={`px-3 py-1 text-sm rounded-lg border ${themeClasses.button.secondary}`}>
            {t('addCategory')}
          </button>
        </div>

        <div className="divide-y">
          {budgetCategories.map((category) => {
            const percentage = (category.actual / category.planned) * 100;
            const remaining = category.planned - category.actual;
            
            return (
              <div key={category.id} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg bg-${category.color}-100 dark:bg-${category.color}-900/30 flex items-center justify-center`}>
                      <Target className={`w-5 h-5 text-${category.color}-600 dark:text-${category.color}-400`} />
                    </div>
                    <div>
                      <h3 className={`font-medium ${themeClasses.text.primary}`}>{category.name}</h3>
                      <p className={`text-xs ${themeClasses.text.muted}`}>
                        {category.items.length} подкатегорий
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className={`text-sm ${themeClasses.text.secondary}`}>{t('planned')}</p>
                      <p className={`font-medium ${themeClasses.text.primary}`}>{formatCurrency(category.planned)}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm ${themeClasses.text.secondary}`}>{t('actual')}</p>
                      <p className={`font-medium text-blue-600`}>{formatCurrency(category.actual)}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm ${themeClasses.text.secondary}`}>{t('remaining')}</p>
                      <p className={`font-medium ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(remaining)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Прогресс бар */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className={themeClasses.text.secondary}>{t('progress')}</span>
                    <span className={`font-medium ${themeClasses.text.primary}`}>
                      {percentage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getProgressColor(percentage)}`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Подкатегории */}
                <div className="mt-4 space-y-2">
                  {category.items.map((item, idx) => {
                    const itemPercentage = (item.actual / item.planned) * 100;
                    return (
                      <div key={idx} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <span className={themeClasses.text.secondary}>{item.name}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            itemPercentage <= 80 ? themeClasses.badge.success :
                            itemPercentage <= 100 ? themeClasses.badge.warning :
                            themeClasses.badge.danger
                          }`}>
                            {itemPercentage.toFixed(0)}%
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={themeClasses.text.muted}>{formatCurrency(item.planned)}</span>
                          <span className="text-blue-600">{formatCurrency(item.actual)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Статус */}
                <div className="mt-4 flex items-center justify-between pt-2 border-t dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(category.planned, category.actual)}
                    <span className={`text-sm ${themeClasses.text.secondary}`}>
                      {getStatusText(category.planned, category.actual)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button className={`p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700`}>
                      <Edit size={16} className={themeClasses.text.secondary} />
                    </button>
                    <button className={`p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700`}>
                      <Copy size={16} className={themeClasses.text.secondary} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FinanceBudget;