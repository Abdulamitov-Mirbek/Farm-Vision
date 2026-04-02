// pages/Reports.jsx
import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { 
  FileText, 
  Download, 
  Calendar, 
  Filter, 
  BarChart3, 
  DollarSign, 
  Leaf, 
  Cloud, 
  Settings, 
  Share2, 
  Printer,
  FileSpreadsheet,
  Plus,
  Search,
  Star,
  Clock,
  CheckCircle2,
  TrendingUp,
  FileBarChart,
  PieChart,
  X,
  ChevronDown,
  MoreVertical,
  Grid,
  List
} from 'lucide-react';

const Reports = () => {
  const { t, language } = useLanguage();
  const { theme } = useTheme();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [starredOnly, setStarredOnly] = useState(false);

  // ✅ Классы для темы (как в Advanced.jsx)
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
      : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400',
    button: {
      primary: 'bg-green-600 hover:bg-green-700 text-white',
      outline: theme === 'dark'
        ? 'border-gray-600 hover:bg-gray-700 text-gray-300'
        : 'border-gray-200 hover:bg-gray-50 text-gray-700',
    },
    badge: {
      green: theme === 'dark'
        ? 'bg-green-900/30 text-green-400 border border-green-800'
        : 'bg-green-100 text-green-700 border border-green-200',
      blue: theme === 'dark'
        ? 'bg-blue-900/30 text-blue-400 border border-blue-800'
        : 'bg-blue-100 text-blue-700 border border-blue-200',
      yellow: theme === 'dark'
        ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-800'
        : 'bg-yellow-100 text-yellow-700 border border-yellow-200',
      purple: theme === 'dark'
        ? 'bg-purple-900/30 text-purple-400 border border-purple-800'
        : 'bg-purple-100 text-purple-700 border border-purple-200',
      gray: theme === 'dark'
        ? 'bg-gray-700 text-gray-300 border border-gray-600'
        : 'bg-gray-100 text-gray-700 border border-gray-200',
    },
    table: {
      header: theme === 'dark' ? 'bg-gray-800 text-gray-400 border-gray-700' : 'bg-gray-50 text-gray-500 border-gray-200',
      row: theme === 'dark' ? 'hover:bg-gray-700/50 border-gray-700' : 'hover:bg-gray-50 border-gray-100',
      cell: theme === 'dark' ? 'text-gray-300' : 'text-gray-600',
    },
    viewToggle: {
      active: theme === 'dark'
        ? 'bg-green-600 text-white'
        : 'bg-green-600 text-white',
      inactive: theme === 'dark'
        ? 'bg-gray-700 text-gray-400 hover:bg-gray-600'
        : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200',
    },
  };

  // Категории отчетов
  const categories = [
    { id: 'all', name: t('all_reports'), icon: FileText, color: 'gray' },
    { id: 'yield', name: t('yield'), icon: Leaf, color: 'green' },
    { id: 'financial', name: t('financial'), icon: DollarSign, color: 'blue' },
    { id: 'fields', name: t('fields'), icon: FileSpreadsheet, color: 'yellow' },
    { id: 'weather', name: t('weather'), icon: Cloud, color: 'purple' },
    { id: 'analytics', name: t('analytics'), icon: BarChart3, color: 'purple' },
  ];

  // Список отчетов
  const reports = [
    {
      id: 1,
      nameKey: 'annual_report',
      name: 'Годовой отчет по урожайности',
      category: 'yield',
      date: '31.12.2025',
      size: '2.4 MB',
      format: 'PDF',
      starred: true,
      icon: '🌾',
      tags: ['Пшеница', 'Кукуруза', 'Подсолнечник'],
      description: 'Полный анализ урожайности всех культур за 2025 год'
    },
    {
      id: 2,
      nameKey: 'financial_q1',
      name: 'Финансовый отчет Q1 2026',
      category: 'financial',
      date: '31.03.2026',
      size: '1.8 MB',
      format: 'PDF',
      starred: false,
      icon: '💰',
      tags: ['Прибыль', 'Расходы', 'Налоги'],
      description: 'Прибыль, расходы, рентабельность по полям'
    },
    {
      id: 3,
      nameKey: 'field_efficiency',
      name: 'Эффективность полей',
      category: 'fields',
      date: '28.02.2026',
      size: '3.1 MB',
      format: 'PDF',
      starred: true,
      icon: '🗺️',
      tags: ['Северное', 'Южное', 'Восточное'],
      description: 'Детальный анализ каждого поля, рекомендации'
    },
    {
      id: 4,
      nameKey: 'agronomy_diary',
      name: 'Дневник агронома',
      category: 'analytics',
      date: '15.01.2026',
      size: '5.2 MB',
      format: 'PDF',
      starred: false,
      icon: '📔',
      tags: ['Обработка', 'Удобрения', 'Гербициды'],
      description: 'Записи агронома, обработки, внесение удобрений'
    }
  ];

  // Фильтрация отчетов
  const filteredReports = reports.filter(report => {
    const matchesCategory = selectedCategory === 'all' || report.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      report.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStarred = starredOnly ? report.starred : true;
    return matchesCategory && matchesSearch && matchesStarred;
  });

  // Получение цвета категории
  const getCategoryColor = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.color || 'gray';
  };

  return (
    <div className={`min-h-screen p-6 transition-colors duration-300 ${themeClasses.page}`}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Хедер */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className={`text-2xl font-bold ${themeClasses.text.primary}`}>
              {t('reports') || 'Отчеты'}
            </h1>
            <p className={`mt-1 ${themeClasses.text.secondary}`}>
              {language === 'ru' ? 'Управление отчетами и аналитика' :
               language === 'en' ? 'Reports management and analytics' :
               'Отчетторду башкаруу жана аналитика'}
            </p>
          </div>
          
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            <button className={`px-4 py-2 rounded-lg flex items-center gap-2 ${themeClasses.button.primary}`}>
              <Plus size={18} />
              <span>Создать отчет</span>
            </button>
            
            <button className={`px-4 py-2 border rounded-lg flex items-center gap-2 ${themeClasses.button.outline}`}>
              <Download size={18} />
              <span>Экспорт</span>
            </button>
          </div>
        </div>

        {/* Поиск и фильтры */}
        <div className={`p-4 border rounded-xl ${themeClasses.card}`}>
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Поиск */}
            <div className="flex-1 relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${themeClasses.text.muted}`} size={18} />
              <input
                type="text"
                placeholder="Поиск отчетов..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${themeClasses.input}`}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${themeClasses.text.muted} hover:${themeClasses.text.secondary}`}
                >
                  <X size={16} />
                </button>
              )}
            </div>
            
            {/* Кнопки фильтров */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-2 border rounded-lg flex items-center gap-2 transition-colors ${
                  showFilters 
                    ? theme === 'dark'
                      ? 'bg-green-900/30 border-green-700 text-green-400'
                      : 'bg-green-50 border-green-500 text-green-700'
                    : themeClasses.button.outline
                }`}
              >
                <Filter size={18} />
                <span>Фильтр</span>
                <ChevronDown size={16} className={`transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Переключение вида */}
              <div className={`flex border rounded-lg overflow-hidden ${themeClasses.border}`}>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? themeClasses.viewToggle.active : themeClasses.viewToggle.inactive}`}
                >
                  <Grid size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? themeClasses.viewToggle.active : themeClasses.viewToggle.inactive}`}
                >
                  <List size={18} />
                </button>
              </div>
              
              {/* Звездочка */}
              <button
                onClick={() => setStarredOnly(!starredOnly)}
                className={`p-2 border rounded-lg ${
                  starredOnly 
                    ? theme === 'dark'
                      ? 'bg-yellow-900/30 border-yellow-700 text-yellow-400'
                      : 'bg-yellow-50 border-yellow-500 text-yellow-600'
                    : themeClasses.button.outline
                }`}
              >
                <Star size={18} fill={starredOnly ? 'currentColor' : 'none'} />
              </button>
            </div>
          </div>
        </div>

        {/* Категории */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const Icon = category.icon;
            const isSelected = selectedCategory === category.id;
            
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                  isSelected 
                    ? themeClasses.badge[category.color]
                    : theme === 'dark'
                      ? 'border-gray-700 hover:bg-gray-700 text-gray-400'
                      : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                }`}
              >
                <Icon size={16} />
                <span className="text-sm font-medium">{category.name}</span>
                {category.id !== 'all' && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    isSelected 
                      ? theme === 'dark' ? 'bg-gray-700' : 'bg-white/50'
                      : theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                  }`}>
                    {reports.filter(r => r.category === category.id).length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Заголовок списка */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className={`text-lg font-semibold ${themeClasses.text.primary}`}>
              {selectedCategory === 'all' ? 'Все отчеты' : categories.find(c => c.id === selectedCategory)?.name}
            </h2>
            <span className={`text-sm ${themeClasses.text.muted}`}>
              ({filteredReports.length} отчетов)
            </span>
          </div>
          
          <div className={`flex items-center gap-2 text-sm ${themeClasses.text.muted}`}>
            <Clock size={14} />
            <span>Недавно добавленные</span>
          </div>
        </div>

        {/* Список отчетов */}
        {filteredReports.length === 0 ? (
          <div className={`p-12 text-center border rounded-xl ${themeClasses.card}`}>
            <div className="text-6xl mb-4">📄</div>
            <h3 className={`text-lg font-medium mb-2 ${themeClasses.text.primary}`}>
              Отчеты не найдены
            </h3>
            <p className={`mb-6 ${themeClasses.text.secondary}`}>
              Попробуйте изменить параметры поиска
            </p>
          </div>
        ) : viewMode === 'grid' ? (
          // Grid View
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredReports.map((report) => {
              const categoryColor = getCategoryColor(report.category);
              
              return (
                <div key={report.id} className={`p-5 border rounded-xl transition-all hover:shadow-md group ${themeClasses.card}`}>
                  {/* Шапка карточки */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl ${themeClasses.badge[categoryColor]}`}>
                        {report.icon}
                      </div>
                      <div>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${themeClasses.badge[categoryColor]}`}>
                          {categories.find(c => c.id === report.category)?.name}
                        </span>
                        <span className={`text-xs ml-2 ${themeClasses.text.muted}`}>{report.format}</span>
                      </div>
                    </div>
                    <button className={`transition-colors ${themeClasses.text.muted} hover:text-yellow-500`}>
                      <Star size={16} fill={report.starred ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                  
                  {/* Заголовок */}
                  <h3 className={`font-medium mb-2 transition-colors group-hover:text-green-600 ${themeClasses.text.primary}`}>
                    {report.name}
                  </h3>
                  
                  {/* Описание */}
                  <p className={`text-sm mb-3 line-clamp-2 ${themeClasses.text.secondary}`}>
                    {report.description}
                  </p>
                  
                  {/* Теги */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {report.tags.map((tag, idx) => (
                      <span key={idx} className={`text-xs px-2 py-1 rounded-full ${themeClasses.badge.gray}`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  {/* Нижняя часть */}
                  <div className={`flex items-center justify-between pt-3 border-t ${themeClasses.border}`}>
                    <div className={`flex items-center text-xs ${themeClasses.text.muted}`}>
                      <Calendar size={12} className="mr-1" />
                      {report.date}
                      <span className="mx-2">•</span>
                      <span>{report.size}</span>
                    </div>
                    
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className={`p-1 rounded ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                        <Download size={14} />
                      </button>
                      <button className={`p-1 rounded ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                        <Share2 size={14} />
                      </button>
                      <button className={`p-1 rounded ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                        <MoreVertical size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          // List View
          <div className={`border rounded-xl overflow-hidden ${themeClasses.card}`}>
            <table className="w-full">
              <thead className={`border-b ${themeClasses.table.header}`}>
                <tr>
                  <th className="text-left py-3 px-4 text-xs font-medium uppercase">Название</th>
                  <th className="text-left py-3 px-4 text-xs font-medium uppercase">Категория</th>
                  <th className="text-left py-3 px-4 text-xs font-medium uppercase">Дата</th>
                  <th className="text-left py-3 px-4 text-xs font-medium uppercase">Формат</th>
                  <th className="text-left py-3 px-4 text-xs font-medium uppercase">Размер</th>
                  <th className="text-right py-3 px-4 text-xs font-medium uppercase">Действия</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.map((report) => {
                  const categoryColor = getCategoryColor(report.category);
                  
                  return (
                    <tr key={report.id} className={`border-b transition-colors ${themeClasses.table.row}`}>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${themeClasses.badge[categoryColor]}`}>
                            <span className="text-sm">{report.icon}</span>
                          </div>
                          <div>
                            <div className={`font-medium ${themeClasses.text.primary}`}>{report.name}</div>
                            <div className={`text-xs ${themeClasses.text.muted}`}>{report.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${themeClasses.badge[categoryColor]}`}>
                          {categories.find(c => c.id === report.category)?.name}
                        </span>
                      </td>
                      <td className={`py-3 px-4 text-sm ${themeClasses.table.cell}`}>{report.date}</td>
                      <td className={`py-3 px-4 text-sm ${themeClasses.table.cell}`}>{report.format}</td>
                      <td className={`py-3 px-4 text-sm ${themeClasses.table.cell}`}>{report.size}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-1">
                          <button className={`p-1 rounded ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}>
                            <Download size={16} />
                          </button>
                          <button className={`p-1 rounded ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}>
                            <Share2 size={16} />
                          </button>
                          <button className={`p-1 rounded ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}>
                            <MoreVertical size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;