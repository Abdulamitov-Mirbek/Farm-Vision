// src/pages/finance/FinanceReports.jsx
import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  FileText, Download, Calendar, Filter, Plus,
  PieChart, BarChart, LineChart, TrendingUp,
  TrendingDown, DollarSign, Percent, Users,
  Tractor, Sprout, Package, Clock, Eye,
  Printer, Mail, Share2, Star, MoreHorizontal,
  ChevronRight, FileBarChart, FileSpreadsheet,
  FilePieChart, FileLineChart, FilePlus, Search
} from 'lucide-react';
import { Link } from 'react-router-dom';

const FinanceReports = () => {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const [reportType, setReportType] = useState('all');
  const [dateRange, setDateRange] = useState('month');
  const [selectedReports, setSelectedReports] = useState([]);

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
    badge: {
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
      ru: 'Отчеты',
      en: 'Reports',
      kg: 'Отчеттор'
    },
    createReport: {
      ru: 'Создать отчет',
      en: 'Create Report',
      kg: 'Отчет түзүү'
    },
    export: {
      ru: 'Экспорт',
      en: 'Export',
      kg: 'Экспорт'
    },
    search: {
      ru: 'Поиск отчетов...',
      en: 'Search reports...',
      kg: 'Отчетторду издөө...'
    },
    filter: {
      ru: 'Фильтр',
      en: 'Filter',
      kg: 'Фильтр'
    },
    allReports: {
      ru: 'Все отчеты',
      en: 'All Reports',
      kg: 'Бардык отчеттор'
    },
    financial: {
      ru: 'Финансовые',
      en: 'Financial',
      kg: 'Каржылык'
    },
    tax: {
      ru: 'Налоговые',
      en: 'Tax',
      kg: 'Салык'
    },
    operational: {
      ru: 'Операционные',
      en: 'Operational',
      kg: 'Операциялык'
    },
    custom: {
      ru: 'Пользовательские',
      en: 'Custom',
      kg: 'Колдонуучу'
    },
    reportName: {
      ru: 'Название отчета',
      en: 'Report Name',
      kg: 'Отчеттун аты'
    },
    type: {
      ru: 'Тип',
      en: 'Type',
      kg: 'Түрү'
    },
    date: {
      ru: 'Дата',
      en: 'Date',
      kg: 'Дата'
    },
    size: {
      ru: 'Размер',
      en: 'Size',
      kg: 'Көлөм'
    },
    format: {
      ru: 'Формат',
      en: 'Format',
      kg: 'Формат'
    },
    status: {
      ru: 'Статус',
      en: 'Status',
      kg: 'Статус'
    },
    actions: {
      ru: 'Действия',
      en: 'Actions',
      kg: 'Аракеттер'
    },
    generated: {
      ru: 'Сгенерирован',
      en: 'Generated',
      kg: 'Түзүлгөн'
    },
    download: {
      ru: 'Скачать',
      en: 'Download',
      kg: 'Жүктөө'
    },
    view: {
      ru: 'Просмотр',
      en: 'View',
      kg: 'Көрүү'
    },
    edit: {
      ru: 'Редактировать',
      en: 'Edit',
      kg: 'Оңдоо'
    },
    delete: {
      ru: 'Удалить',
      en: 'Delete',
      kg: 'Өчүрүү'
    },
    share: {
      ru: 'Поделиться',
      en: 'Share',
      kg: 'Бөлүшүү'
    },
    schedule: {
      ru: 'Запланировать',
      en: 'Schedule',
      kg: 'Пландаштыруу'
    },
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
    profitAndLoss: {
      ru: 'Прибыли и убытки',
      en: 'Profit & Loss',
      kg: 'Киреше жана чыгаша'
    },
    balanceSheet: {
      ru: 'Балансовый отчет',
      en: 'Balance Sheet',
      kg: 'Баланс отчет'
    },
    cashFlow: {
      ru: 'Движение денег',
      en: 'Cash Flow',
      kg: 'Акча кыймылы'
    },
    taxReport: {
      ru: 'Налоговая декларация',
      en: 'Tax Report',
      kg: 'Салык декларациясы'
    },
    expensesByCategory: {
      ru: 'Расходы по категориям',
      en: 'Expenses by Category',
      kg: 'Категориялар боюнча чыгашалар'
    },
    incomeByCrop: {
      ru: 'Доходы по культурам',
      en: 'Income by Crop',
      kg: 'Өсүмдүктөр боюнча киреше'
    },
    employeeCosts: {
      ru: 'Затраты на сотрудников',
      en: 'Employee Costs',
      kg: 'Кызматкерлерге чыгаша'
    },
    equipmentCosts: {
      ru: 'Затраты на технику',
      en: 'Equipment Costs',
      kg: 'Техникага чыгаша'
    },
    inventory: {
      ru: 'Инвентаризация',
      en: 'Inventory',
      kg: 'Инвентаризация'
    },
    draft: {
      ru: 'Черновик',
      en: 'Draft',
      kg: 'Долбоор'
    },
    completed: {
      ru: 'Готов',
      en: 'Completed',
      kg: 'Даяр'
    },
    archived: {
      ru: 'Архив',
      en: 'Archived',
      kg: 'Архив'
    },
    scheduled: {
      ru: 'Запланирован',
      en: 'Scheduled',
      kg: 'Пландалган'
    }
  };

  const t = (key) => translations[key]?.[language] || key;

  // Данные отчетов
  const reports = [
    {
      id: 1,
      name: t('profitAndLoss'),
      type: 'financial',
      typeLabel: t('financial'),
      date: '2026-02-20',
      size: '245 KB',
      format: 'PDF',
      status: 'completed',
      icon: FileBarChart,
      color: 'blue',
      description: 'Январь 2026 - Февраль 2026',
      starred: true
    },
    {
      id: 2,
      name: t('balanceSheet'),
      type: 'financial',
      typeLabel: t('financial'),
      date: '2026-02-19',
      size: '189 KB',
      format: 'PDF',
      status: 'completed',
      icon: FilePieChart,
      color: 'green',
      description: 'По состоянию на 19.02.2026',
      starred: false
    },
    {
      id: 3,
      name: t('cashFlow'),
      type: 'financial',
      typeLabel: t('financial'),
      date: '2026-02-18',
      size: '156 KB',
      format: 'XLSX',
      status: 'completed',
      icon: FileLineChart,
      color: 'purple',
      description: 'Февраль 2026',
      starred: true
    },
    {
      id: 4,
      name: t('taxReport'),
      type: 'tax',
      typeLabel: t('tax'),
      date: '2026-02-15',
      size: '312 KB',
      format: 'PDF',
      status: 'completed',
      icon: FileText,
      color: 'orange',
      description: '1 квартал 2026',
      starred: false
    },
    {
      id: 5,
      name: t('expensesByCategory'),
      type: 'operational',
      typeLabel: t('operational'),
      date: '2026-02-14',
      size: '98 KB',
      format: 'XLSX',
      status: 'completed',
      icon: FileSpreadsheet,
      color: 'yellow',
      description: 'Февраль 2026',
      starred: false
    },
    {
      id: 6,
      name: t('incomeByCrop'),
      type: 'operational',
      typeLabel: t('operational'),
      date: '2026-02-13',
      size: '87 KB',
      format: 'XLSX',
      status: 'completed',
      icon: FileSpreadsheet,
      color: 'emerald',
      description: 'Сезон 2025',
      starred: true
    },
    {
      id: 7,
      name: t('employeeCosts'),
      type: 'operational',
      typeLabel: t('operational'),
      date: '2026-02-12',
      size: '124 KB',
      format: 'PDF',
      status: 'draft',
      icon: FileText,
      color: 'red',
      description: 'Февраль 2026',
      starred: false
    },
    {
      id: 8,
      name: t('inventory'),
      type: 'operational',
      typeLabel: t('operational'),
      date: '2026-02-10',
      size: '234 KB',
      format: 'XLSX',
      status: 'completed',
      icon: FileSpreadsheet,
      color: 'indigo',
      description: 'Складской учет',
      starred: false
    },
  ];

  // Шаблоны отчетов
  const templates = [
    { name: 'Ежемесячный отчет', icon: Calendar, color: 'blue' },
    { name: 'Сравнительный анализ', icon: BarChart, color: 'green' },
    { name: 'Прогноз прибыли', icon: TrendingUp, color: 'purple' },
    { name: 'Анализ расходов', icon: TrendingDown, color: 'orange' },
  ];

  // Фильтрация отчетов
  const filteredReports = reportType === 'all' 
    ? reports 
    : reports.filter(r => r.type === reportType);

  const getStatusBadge = (status) => {
    switch(status) {
      case 'completed':
        return <span className={`px-2 py-1 text-xs font-medium rounded-full ${themeClasses.badge.success}`}>✓ {t('completed')}</span>;
      case 'draft':
        return <span className={`px-2 py-1 text-xs font-medium rounded-full ${themeClasses.badge.warning}`}>📝 {t('draft')}</span>;
      case 'archived':
        return <span className={`px-2 py-1 text-xs font-medium rounded-full ${themeClasses.badge.info}`}>📦 {t('archived')}</span>;
      case 'scheduled':
        return <span className={`px-2 py-1 text-xs font-medium rounded-full ${themeClasses.badge.info}`}>⏰ {t('scheduled')}</span>;
      default:
        return null;
    }
  };

  const getTypeColor = (type) => {
    switch(type) {
      case 'financial': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400';
      case 'tax': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400';
      case 'operational': return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400';
      default: return themeClasses.text.secondary;
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(language === 'ru' ? 'ru-RU' : 'en-US');
  };

  const toggleReportSelection = (id) => {
    if (selectedReports.includes(id)) {
      setSelectedReports(selectedReports.filter(r => r !== id));
    } else {
      setSelectedReports([...selectedReports, id]);
    }
  };

  return (
    <div className={`p-6 space-y-6 transition-colors duration-300 ${themeClasses.page}`}>
      {/* Заголовок */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className={`text-2xl font-bold ${themeClasses.text.primary}`}>{t('title')}</h1>
          <p className={`mt-1 ${themeClasses.text.secondary}`}>
            {language === 'ru' ? 'Генерация и управление отчетами' :
             language === 'en' ? 'Generate and manage reports' :
             'Отчетторду түзүү жана башкаруу'}
          </p>
        </div>
        
        <div className="flex items-center gap-3 mt-4 md:mt-0">
          <Link
            to="/finance/reports/new"
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${themeClasses.button.primary}`}
          >
            <FilePlus size={18} />
            {t('createReport')}
          </Link>
          
          <button className={`p-2 border rounded-lg ${themeClasses.button.secondary}`}>
            <Download size={18} />
          </button>
          
          <button className={`p-2 border rounded-lg ${themeClasses.button.secondary}`}>
            <Calendar size={18} />
          </button>
        </div>
      </div>

      {/* Быстрые действия */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {templates.map((template, idx) => (
          <button
            key={idx}
            className={`p-4 rounded-xl border hover:shadow-md transition-all ${themeClasses.card}`}
          >
            <div className={`p-2 rounded-lg w-fit mb-3 bg-${template.color}-100 dark:bg-${template.color}-900/30`}>
              <template.icon className={`w-5 h-5 text-${template.color}-600 dark:text-${template.color}-400`} />
            </div>
            <p className={`text-sm font-medium ${themeClasses.text.primary}`}>{template.name}</p>
          </button>
        ))}
      </div>

      {/* Фильтры */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder={t('search')}
            className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${themeClasses.input}`}
          />
          <Search size={18} className="absolute left-3 top-3 text-gray-400" />
        </div>
        
        <div className="flex gap-2">
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className={`px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${themeClasses.input}`}
          >
            <option value="all">{t('allReports')}</option>
            <option value="financial">{t('financial')}</option>
            <option value="tax">{t('tax')}</option>
            <option value="operational">{t('operational')}</option>
            <option value="custom">{t('custom')}</option>
          </select>
          
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className={`px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${themeClasses.input}`}
          >
            <option value="week">{t('thisWeek')}</option>
            <option value="month">{t('thisMonth')}</option>
            <option value="quarter">{t('thisQuarter')}</option>
            <option value="year">{t('thisYear')}</option>
            <option value="custom">{t('custom')}</option>
          </select>
          
          <button className={`p-2 border rounded-lg ${themeClasses.button.secondary}`}>
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* Список отчетов */}
      <div className={`rounded-xl shadow-sm border overflow-hidden ${themeClasses.card}`}>
        <div className={`p-6 border-b ${themeClasses.border}`}>
          <h2 className={`text-lg font-semibold ${themeClasses.text.primary}`}>Последние отчеты</h2>
        </div>

        <div className="divide-y">
          {filteredReports.map((report) => {
            const Icon = report.icon;
            return (
              <div key={report.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex items-start gap-4">
                  {/* Чекбокс для выбора */}
                  <div className="pt-1">
                    <input
                      type="checkbox"
                      checked={selectedReports.includes(report.id)}
                      onChange={() => toggleReportSelection(report.id)}
                      className="h-4 w-4 text-green-600 rounded border-gray-300"
                    />
                  </div>

                  {/* Иконка */}
                  <div className={`p-3 rounded-xl bg-${report.color}-100 dark:bg-${report.color}-900/30`}>
                    <Icon className={`w-6 h-6 text-${report.color}-600 dark:text-${report.color}-400`} />
                  </div>

                  {/* Информация */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className={`font-medium ${themeClasses.text.primary}`}>
                        {report.name}
                      </h3>
                      {report.starred && (
                        <Star size={14} className="text-yellow-500 fill-yellow-500" />
                      )}
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getTypeColor(report.type)}`}>
                        {report.typeLabel}
                      </span>
                      {getStatusBadge(report.status)}
                    </div>
                    
                    <p className={`text-sm mb-2 ${themeClasses.text.secondary}`}>
                      {report.description}
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs">
                      <span className={themeClasses.text.muted}>
                        {t('generated')}: {formatDate(report.date)}
                      </span>
                      <span className={themeClasses.text.muted}>
                        {report.format} • {report.size}
                      </span>
                    </div>
                  </div>

                  {/* Действия */}
                  <div className="flex items-center gap-2">
                    <button className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 ${themeClasses.button.secondary}`}>
                      <Eye size={16} />
                    </button>
                    <button className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 ${themeClasses.button.secondary}`}>
                      <Download size={16} />
                    </button>
                    <button className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 ${themeClasses.button.secondary}`}>
                      <Share2 size={16} />
                    </button>
                    <button className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 ${themeClasses.button.secondary}`}>
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Статистика отчетов */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className={`p-4 rounded-xl border ${themeClasses.card}`}>
          <p className={`text-sm ${themeClasses.text.secondary}`}>Всего отчетов</p>
          <p className={`text-2xl font-bold ${themeClasses.text.primary}`}>24</p>
        </div>
        
        <div className={`p-4 rounded-xl border ${themeClasses.card}`}>
          <p className={`text-sm ${themeClasses.text.secondary}`}>За этот месяц</p>
          <p className={`text-2xl font-bold text-green-600`}>8</p>
        </div>
        
        <div className={`p-4 rounded-xl border ${themeClasses.card}`}>
          <p className={`text-sm ${themeClasses.text.secondary}`}>Последний отчет</p>
          <p className={`text-sm font-medium ${themeClasses.text.primary}`}>20.02.2026</p>
        </div>
        
        <div className={`p-4 rounded-xl border ${themeClasses.card}`}>
          <p className={`text-sm ${themeClasses.text.secondary}`}>В работе</p>
          <p className={`text-2xl font-bold text-yellow-600`}>3</p>
        </div>
      </div>
    </div>
  );
};

export default FinanceReports;