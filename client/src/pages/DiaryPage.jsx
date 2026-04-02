// src/pages/DiaryPage.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext'; // ✅ Добавляем тему
import { diaryAPI } from '../services/api/diaryAPI';
import fieldsAPI from '../services/api/fieldsAPI';
import { 
  Plus, Search, Filter, X, CheckCircle, Calendar,
  Clock, Users, DollarSign, Tag, MapPin, Heart,
  MoreVertical, Edit2, Trash2, Eye, Download,
  ChevronLeft, ChevronRight, Grid, List, Sparkles,
  Sun, Cloud, CloudRain, Wind, Leaf, Sprout,
  Droplets, Thermometer, Activity, Award
} from 'lucide-react';

const DiaryPage = () => {
  const { t, language } = useLanguage();
  const { theme } = useTheme(); // ✅ Получаем тему
  const [searchParams] = useSearchParams();
  const fieldId = searchParams.get('fieldId');
  
  const [entries, setEntries] = useState([]);
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedField, setSelectedField] = useState(fieldId || 'all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [showFilters, setShowFilters] = useState(false);
  
  const [newEntry, setNewEntry] = useState({
    title: '',
    content: '',
    activityType: 'sowing',
    fieldId: fieldId || '',
    date: new Date().toISOString().split('T')[0],
    hours: '',
    workers: '',
    cost: '',
    tags: '',
    weather: 'sunny',
    isImportant: false
  });

  // ✅ Классы для темы
  const themeClasses = {
    page: theme === 'dark' ? 'bg-gray-900' : 'bg-gradient-to-br from-gray-50 to-gray-100',
    card: theme === 'dark' 
      ? 'bg-gray-800/90 backdrop-blur-xl border-gray-700' 
      : 'bg-white/80 backdrop-blur-xl border-white/20',
    text: {
      primary: theme === 'dark' ? 'text-white' : 'text-gray-900',
      secondary: theme === 'dark' ? 'text-gray-400' : 'text-gray-600',
      muted: theme === 'dark' ? 'text-gray-500' : 'text-gray-400',
    },
    border: theme === 'dark' ? 'border-gray-700' : 'border-gray-200',
    input: theme === 'dark'
      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
      : 'bg-gray-50 border-gray-200 text-gray-900',
    button: {
      primary: 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white',
      outline: theme === 'dark'
        ? 'border-gray-600 hover:bg-gray-700 text-gray-300'
        : 'border-gray-200 hover:bg-gray-100 text-gray-600',
      icon: theme === 'dark'
        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
        : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
    },
    badge: {
      category: (color) => {
        const colors = {
          emerald: theme === 'dark' 
            ? 'bg-emerald-900/30 text-emerald-400 border-emerald-800'
            : 'bg-emerald-100 text-emerald-700 border-emerald-200',
          blue: theme === 'dark'
            ? 'bg-blue-900/30 text-blue-400 border-blue-800'
            : 'bg-blue-100 text-blue-700 border-blue-200',
          yellow: theme === 'dark'
            ? 'bg-yellow-900/30 text-yellow-400 border-yellow-800'
            : 'bg-yellow-100 text-yellow-700 border-yellow-200',
          purple: theme === 'dark'
            ? 'bg-purple-900/30 text-purple-400 border-purple-800'
            : 'bg-purple-100 text-purple-700 border-purple-200',
          orange: theme === 'dark'
            ? 'bg-orange-900/30 text-orange-400 border-orange-800'
            : 'bg-orange-100 text-orange-700 border-orange-200',
          indigo: theme === 'dark'
            ? 'bg-indigo-900/30 text-indigo-400 border-indigo-800'
            : 'bg-indigo-100 text-indigo-700 border-indigo-200',
          gray: theme === 'dark'
            ? 'bg-gray-700 text-gray-300 border-gray-600'
            : 'bg-gray-100 text-gray-700 border-gray-200'
        };
        return colors[color] || colors.gray;
      },
      metric: {
        hours: theme === 'dark'
          ? 'bg-blue-900/30 text-blue-400'
          : 'bg-blue-50 text-blue-700',
        cost: theme === 'dark'
          ? 'bg-green-900/30 text-green-400'
          : 'bg-green-50 text-green-700',
      }
    },
    stat: {
      card: theme === 'dark'
        ? 'bg-gray-800/80 border-gray-700'
        : 'bg-white/80 border-white/20',
      icon: {
        blue: theme === 'dark' ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-600',
        green: theme === 'dark' ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-600',
        yellow: theme === 'dark' ? 'bg-yellow-900/30 text-yellow-400' : 'bg-yellow-100 text-yellow-600',
        purple: theme === 'dark' ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-100 text-purple-600',
        red: theme === 'dark' ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-600',
      }
    },
    table: {
      header: theme === 'dark' ? 'bg-gray-800 text-gray-400 border-gray-700' : 'bg-gray-50 text-gray-600 border-gray-200',
      row: theme === 'dark' ? 'hover:bg-gray-700/50 border-gray-700' : 'hover:bg-gray-50 border-gray-100',
      cell: theme === 'dark' ? 'text-gray-300' : 'text-gray-600',
    },
    modal: {
      overlay: theme === 'dark' ? 'bg-black/50' : 'bg-black/30',
      content: theme === 'dark'
        ? 'bg-gray-800 border-gray-700'
        : 'bg-white/95 border-white/50',
    },
    entryCard: theme === 'dark'
      ? 'bg-gray-800/80 border-gray-700 hover:bg-gray-700/80'
      : 'bg-white/80 border-white/20 hover:bg-white/90',
  };

  // Категории с иконками и цветами
  const categories = [
    { id: 'sowing', icon: <Sprout size={18} />, label: { ru: 'Посев', en: 'Sowing', kg: 'Себүү' }, color: 'emerald' },
    { id: 'watering', icon: <Droplets size={18} />, label: { ru: 'Полив', en: 'Watering', kg: 'Сугаруу' }, color: 'blue' },
    { id: 'fertilizing', icon: <Leaf size={18} />, label: { ru: 'Удобрение', en: 'Fertilizing', kg: 'Жерсемирткич' }, color: 'yellow' },
    { id: 'treatment', icon: <Activity size={18} />, label: { ru: 'Обработка', en: 'Treatment', kg: 'Дарылоо' }, color: 'purple' },
    { id: 'harvesting', icon: <Award size={18} />, label: { ru: 'Уборка', en: 'Harvesting', kg: 'Жыйноо' }, color: 'orange' },
    { id: 'inspection', icon: <Eye size={18} />, label: { ru: 'Осмотр', en: 'Inspection', kg: 'Текшерүү' }, color: 'indigo' },
    { id: 'other', icon: <Sparkles size={18} />, label: { ru: 'Другое', en: 'Other', kg: 'Башка' }, color: 'gray' }
  ];

  // Погода
  const weatherOptions = [
    { id: 'sunny', icon: <Sun size={18} className="text-yellow-500" />, label: { ru: 'Солнечно', en: 'Sunny', kg: 'Күн ачык' } },
    { id: 'cloudy', icon: <Cloud size={18} className="text-gray-500" />, label: { ru: 'Облачно', en: 'Cloudy', kg: 'Булуттуу' } },
    { id: 'rainy', icon: <CloudRain size={18} className="text-blue-500" />, label: { ru: 'Дождливо', en: 'Rainy', kg: 'Жамгырлуу' } },
    { id: 'windy', icon: <Wind size={18} className="text-teal-500" />, label: { ru: 'Ветрено', en: 'Windy', kg: 'Шамалдуу' } }
  ];

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadEntries();
  }, [selectedCategory, selectedField, dateRange, searchQuery]);

  const loadData = async () => {
    try {
      setLoading(true);
      const fieldsRes = await fieldsAPI.getAll();
      setFields(fieldsRes.fields || []);
      await loadEntries();
    } catch (error) {
      console.error('Ошибка загрузки:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadEntries = async () => {
    try {
      const filters = {};
      if (selectedCategory !== 'all') filters.activityType = selectedCategory;
      if (selectedField !== 'all') filters.fieldId = selectedField;
      if (dateRange.start) filters.startDate = dateRange.start;
      if (dateRange.end) filters.endDate = dateRange.end;
      if (searchQuery) filters.search = searchQuery;
      
      const response = await diaryAPI.getEntries(filters);
      setEntries(response.data.entries || []);
    } catch (error) {
      console.error('Ошибка загрузки записей:', error);
    }
  };

  const handleAddEntry = async () => {
    if (!newEntry.title.trim() || !newEntry.content.trim()) {
      alert('Заполните заголовок и описание');
      return;
    }

    try {
      const entryData = {
        title: newEntry.title,
        content: newEntry.content,
        activityType: newEntry.activityType,
        fieldId: newEntry.fieldId || null,
        date: newEntry.date,
        tags: newEntry.tags ? newEntry.tags.split(',').map(t => t.trim()) : [],
        isImportant: newEntry.isImportant,
        weather: newEntry.weather,
        metrics: {
          duration: parseInt(newEntry.hours) || 0,
          workers: parseInt(newEntry.workers) || 0,
          cost: parseInt(newEntry.cost) || 0
        }
      };

      await diaryAPI.createEntry(entryData);
      await loadEntries();
      setShowAddModal(false);
      resetForm();
    } catch (error) {
      console.error('Ошибка:', error);
      alert('Ошибка при создании записи');
    }
  };

  const resetForm = () => {
    setNewEntry({
      title: '',
      content: '',
      activityType: 'sowing',
      fieldId: fieldId || '',
      date: new Date().toISOString().split('T')[0],
      hours: '',
      workers: '',
      cost: '',
      tags: '',
      weather: 'sunny',
      isImportant: false
    });
  };

  const handleDeleteEntry = async (id) => {
    if (!window.confirm('Удалить запись?')) return;
    try {
      await diaryAPI.deleteEntry(id);
      await loadEntries();
    } catch (error) {
      console.error('Ошибка удаления:', error);
    }
  };

  const getCategoryStyle = (categoryId) => {
    const cat = categories.find(c => c.id === categoryId) || categories[6];
    return themeClasses.badge.category(cat.color);
  };

  const getWeatherIcon = (weatherId) => {
    const weather = weatherOptions.find(w => w.id === weatherId);
    return weather?.icon || <Sun size={16} className="text-yellow-500" />;
  };

  const stats = {
    total: entries.length,
    hours: entries.reduce((sum, e) => sum + (e.metrics?.duration || e.hours || 0), 0),
    cost: entries.reduce((sum, e) => sum + (e.metrics?.cost || e.cost || 0), 0),
    workers: entries.reduce((sum, e) => sum + (e.metrics?.workers || e.workers || 0), 0),
    important: entries.filter(e => e.isImportant || e.important).length
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gradient-to-br from-green-50 to-emerald-50'} flex items-center justify-center`}>
        <div className="text-center">
          <div className="relative">
            <div className={`w-20 h-20 border-4 ${theme === 'dark' ? 'border-gray-700 border-t-green-500' : 'border-green-200 border-t-green-600'} rounded-full animate-spin mx-auto`}></div>
            <Leaf className={`w-8 h-8 ${theme === 'dark' ? 'text-green-500' : 'text-green-600'} absolute top-6 left-6 animate-pulse`} />
          </div>
          <p className={`mt-6 font-medium ${themeClasses.text.secondary}`}>
            {language === 'ru' ? 'Загрузка дневника...' :
             language === 'en' ? 'Loading diary...' :
             'Күндөлүк жүктөлүүдө...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${themeClasses.page} p-6`}>
      {/* Декоративные элементы */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-40 -right-40 w-80 h-80 ${theme === 'dark' ? 'bg-green-900/20' : 'bg-green-200'} rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob`}></div>
        <div className={`absolute -bottom-40 -left-40 w-80 h-80 ${theme === 'dark' ? 'bg-blue-900/20' : 'bg-blue-200'} rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000`}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Хедер */}
        <div className={`rounded-2xl p-6 shadow-xl border mb-6 ${themeClasses.card}`}>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Leaf className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className={`text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent`}>
                  {language === 'ru' ? 'Рабочий дневник' :
                   language === 'en' ? 'Work Diary' :
                   'Жумуш күндөлүгү'}
                </h1>
                <p className={themeClasses.text.secondary}>
                  {language === 'ru' ? 'Все работы и события на ваших полях' :
                   language === 'en' ? 'All work and events on your fields' :
                   'Талааларыңыздагы бардык иштер жана окуялар'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Переключатель вида */}
              <div className={`rounded-xl p-1 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'grid'
                      ? theme === 'dark'
                        ? 'bg-gray-600 text-green-400 shadow-md'
                        : 'bg-white text-green-600 shadow-md'
                      : themeClasses.text.muted
                  }`}
                >
                  <Grid size={20} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'list'
                      ? theme === 'dark'
                        ? 'bg-gray-600 text-green-400 shadow-md'
                        : 'bg-white text-green-600 shadow-md'
                      : themeClasses.text.muted
                  }`}
                >
                  <List size={20} />
                </button>
              </div>

              <button
                onClick={() => setShowAddModal(true)}
                className={`px-5 py-2.5 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center gap-2 ${themeClasses.button.primary}`}
              >
                <Plus size={18} />
                <span className="font-medium">
                  {language === 'ru' ? 'Запись' : language === 'en' ? 'Entry' : 'Жазуу'}
                </span>
              </button>
            </div>
          </div>

          {/* Поиск и фильтры */}
          <div className="mt-6">
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder={language === 'ru' ? '🔍 Поиск по записям...' :
                              language === 'en' ? '🔍 Search entries...' :
                              '🔍 Жазууларды издөө...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${themeClasses.input}`}
                />
                <Search className={`absolute left-4 top-3.5 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} size={18} />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-3 rounded-xl transition-all ${
                  showFilters
                    ? 'bg-green-600 text-white shadow-lg'
                    : themeClasses.button.icon
                }`}
              >
                <Filter size={18} />
              </button>
              <button className={`p-3 rounded-xl transition-all ${themeClasses.button.icon}`}>
                <Download size={18} />
              </button>
            </div>

            {/* Фильтры */}
            {showFilters && (
              <div className={`mt-4 p-5 rounded-xl border animate-slideDown ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${themeClasses.text.secondary}`}>
                      {language === 'ru' ? 'Категория' : 'Category'}
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className={`w-full px-4 py-2.5 border-2 rounded-lg focus:ring-2 focus:ring-green-500 ${themeClasses.input}`}
                    >
                      <option value="all">
                        {language === 'ru' ? 'Все категории' : 'All categories'}
                      </option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>
                          {cat.label[language]}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${themeClasses.text.secondary}`}>
                      {language === 'ru' ? 'Поле' : 'Field'}
                    </label>
                    <select
                      value={selectedField}
                      onChange={(e) => setSelectedField(e.target.value)}
                      className={`w-full px-4 py-2.5 border-2 rounded-lg focus:ring-2 focus:ring-green-500 ${themeClasses.input}`}
                    >
                      <option value="all">
                        {language === 'ru' ? 'Все поля' : 'All fields'}
                      </option>
                      {fields.map(field => (
                        <option key={field._id} value={field._id}>{field.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${themeClasses.text.secondary}`}>
                      {language === 'ru' ? 'Дата с' : 'Date from'}
                    </label>
                    <input
                      type="date"
                      value={dateRange.start}
                      onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                      className={`w-full px-4 py-2.5 border-2 rounded-lg focus:ring-2 focus:ring-green-500 ${themeClasses.input}`}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${themeClasses.text.secondary}`}>
                      {language === 'ru' ? 'Дата по' : 'Date to'}
                    </label>
                    <input
                      type="date"
                      value={dateRange.end}
                      onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                      className={`w-full px-4 py-2.5 border-2 rounded-lg focus:ring-2 focus:ring-green-500 ${themeClasses.input}`}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className={`rounded-xl p-5 shadow-lg border ${themeClasses.stat.card}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={themeClasses.text.secondary}>Всего</p>
                <p className={`text-3xl font-bold ${themeClasses.text.primary}`}>{stats.total}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${themeClasses.stat.icon.blue}`}>
                <Calendar size={24} />
              </div>
            </div>
          </div>

          <div className={`rounded-xl p-5 shadow-lg border ${themeClasses.stat.card}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={themeClasses.text.secondary}>Часы</p>
                <p className={`text-3xl font-bold ${themeClasses.text.primary}`}>{stats.hours}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${themeClasses.stat.icon.green}`}>
                <Clock size={24} />
              </div>
            </div>
          </div>

          <div className={`rounded-xl p-5 shadow-lg border ${themeClasses.stat.card}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={themeClasses.text.secondary}>Затраты</p>
                <p className={`text-3xl font-bold ${themeClasses.text.primary}`}>{stats.cost.toLocaleString()} som</p>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${themeClasses.stat.icon.yellow}`}>
                <DollarSign size={24} />
              </div>
            </div>
          </div>

          <div className={`rounded-xl p-5 shadow-lg border ${themeClasses.stat.card}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={themeClasses.text.secondary}>Работники</p>
                <p className={`text-3xl font-bold ${themeClasses.text.primary}`}>{stats.workers}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${themeClasses.stat.icon.purple}`}>
                <Users size={24} />
              </div>
            </div>
          </div>

          <div className={`rounded-xl p-5 shadow-lg border ${themeClasses.stat.card}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={themeClasses.text.secondary}>Важные</p>
                <p className={`text-3xl font-bold ${themeClasses.text.primary}`}>{stats.important}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${themeClasses.stat.icon.red}`}>
                <Heart size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Список записей */}
        {entries.length === 0 ? (
          <div className={`rounded-2xl p-16 shadow-xl border text-center ${themeClasses.card}`}>
            <div className="relative inline-block">
              <div className={`w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-100 rounded-3xl flex items-center justify-center mx-auto mb-6 ${theme === 'dark' ? 'bg-opacity-10' : ''}`}>
                <Leaf className={`w-12 h-12 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} />
              </div>
              <Heart className={`w-6 h-6 ${theme === 'dark' ? 'text-red-400' : 'text-red-400'} absolute -top-2 -right-2 animate-pulse`} />
            </div>
            <h3 className={`text-2xl font-bold mb-3 ${themeClasses.text.primary}`}>
              {searchQuery ? 'Ничего не найдено' : 'Пока нет записей'}
            </h3>
            <p className={`mb-8 max-w-md mx-auto ${themeClasses.text.secondary}`}>
              {searchQuery 
                ? 'Попробуйте изменить параметры поиска'
                : 'Добавьте первую запись о работах на полях'}
            </p>
            {!searchQuery && (
              <button
                onClick={() => setShowAddModal(true)}
                className={`px-8 py-4 rounded-xl transition-all shadow-lg inline-flex items-center gap-2 ${themeClasses.button.primary}`}
              >
                <Plus size={20} />
                <span>Добавить запись</span>
              </button>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {entries.map((entry, idx) => (
              <div
                key={entry.id || idx}
                className={`group rounded-xl p-6 shadow-lg border transition-all duration-300 hover:-translate-y-1 cursor-pointer ${themeClasses.entryCard}`}
                onClick={() => setSelectedEntry(entry)}
              >
                {/* Заголовок */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl ${getCategoryStyle(entry.activityType || entry.category)}`}>
                      {categories.find(c => c.id === (entry.activityType || entry.category))?.icon || <Sparkles size={20} />}
                    </div>
                    <div>
                      <h3 className={`font-semibold line-clamp-1 ${themeClasses.text.primary}`}>{entry.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs ${themeClasses.text.muted}`}>
                          {new Date(entry.date).toLocaleDateString()}
                        </span>
                        {(entry.isImportant || entry.important) && (
                          <Heart size={12} className="text-red-500 fill-current" />
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteEntry(entry.id);
                      }}
                      className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-red-900/30 text-red-400' : 'hover:bg-red-50 text-red-500'}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Описание */}
                <p className={`text-sm mb-4 line-clamp-2 ${themeClasses.text.secondary}`}>
                  {entry.description || entry.content}
                </p>

                {/* Мета-информация */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-3 text-xs">
                    {entry.fieldName && (
                      <span className={`flex items-center gap-1 ${themeClasses.text.muted}`}>
                        <MapPin size={12} className="text-green-500" />
                        {entry.fieldName}
                      </span>
                    )}
                    {entry.weather && (
                      <span className="flex items-center">
                        {getWeatherIcon(entry.weather)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {(entry.metrics?.duration || entry.hours) > 0 && (
                      <span className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${themeClasses.badge.metric.hours}`}>
                        <Clock size={10} />
                        {entry.metrics?.duration || entry.hours}ч
                      </span>
                    )}
                    {(entry.metrics?.cost || entry.cost) > 0 && (
                      <span className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${themeClasses.badge.metric.cost}`}>
                        <DollarSign size={10} />
                        {(entry.metrics?.cost || entry.cost).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={`rounded-xl shadow-lg border overflow-hidden ${themeClasses.card}`}>
            <table className="w-full">
              <thead className={`border-b ${themeClasses.table.header}`}>
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Дата</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Заголовок</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Категория</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Поле</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Часы</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Затраты</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {entries.map(entry => (
                  <tr 
                    key={entry.id} 
                    className={`cursor-pointer transition-colors ${themeClasses.table.row}`} 
                    onClick={() => setSelectedEntry(entry)}
                  >
                    <td className={`px-6 py-4 text-sm ${themeClasses.table.cell}`}>
                      {new Date(entry.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {(entry.isImportant || entry.important) && <Heart size={14} className="text-red-500 fill-current" />}
                        <span className={`text-sm font-medium ${themeClasses.text.primary}`}>{entry.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs ${getCategoryStyle(entry.activityType || entry.category)}`}>
                        {categories.find(c => c.id === (entry.activityType || entry.category))?.label[language]}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-sm ${themeClasses.table.cell}`}>{entry.fieldName || '—'}</td>
                    <td className={`px-6 py-4 text-sm ${themeClasses.table.cell}`}>{entry.metrics?.duration || entry.hours || '—'}</td>
                    <td className={`px-6 py-4 text-sm ${themeClasses.table.cell}`}>{(entry.metrics?.cost || entry.cost)?.toLocaleString() || '—'}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteEntry(entry.id);
                        }}
                        className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-red-900/30 text-red-400' : 'hover:bg-red-50 text-red-500'}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Модальное окно добавления */}
        {showAddModal && (
          <AddEntryModal
            onClose={() => setShowAddModal(false)}
            onSave={handleAddEntry}
            newEntry={newEntry}
            setNewEntry={setNewEntry}
            fields={fields}
            categories={categories}
            weatherOptions={weatherOptions}
            language={language}
            theme={theme}
            themeClasses={themeClasses}
          />
        )}

        {/* Модальное окно просмотра */}
        {selectedEntry && (
          <ViewEntryModal
            entry={selectedEntry}
            onClose={() => setSelectedEntry(null)}
            language={language}
            theme={theme}
            themeClasses={themeClasses}
          />
        )}
      </div>
    </div>
  );
};

// Компонент модального окна добавления
const AddEntryModal = ({ onClose, onSave, newEntry, setNewEntry, fields, categories, weatherOptions, language, theme, themeClasses }) => (
  <div className={`fixed inset-0 ${themeClasses.modal.overlay} backdrop-blur-sm flex items-center justify-center z-50 p-4`}>
    <div className={`rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border ${themeClasses.modal.content}`}>
      <div className={`p-6 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} sticky top-0 ${themeClasses.modal.content}`}>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            ✨ {language === 'ru' ? 'Новая запись' : 'New Entry'}
          </h2>
          <button onClick={onClose} className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
            <X size={20} className={themeClasses.text.secondary} />
          </button>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder={language === 'ru' ? 'Заголовок' : 'Title'}
            value={newEntry.title}
            onChange={(e) => setNewEntry({...newEntry, title: e.target.value})}
            className={`col-span-2 px-4 py-3 border-2 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all ${themeClasses.input}`}
          />

          <select
            value={newEntry.activityType}
            onChange={(e) => setNewEntry({...newEntry, activityType: e.target.value})}
            className={`px-4 py-3 border-2 rounded-xl focus:border-green-500 ${themeClasses.input}`}
          >
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.label[language]}</option>
            ))}
          </select>

          <select
            value={newEntry.fieldId}
            onChange={(e) => setNewEntry({...newEntry, fieldId: e.target.value})}
            className={`px-4 py-3 border-2 rounded-xl focus:border-green-500 ${themeClasses.input}`}
          >
            <option value="">{language === 'ru' ? 'Без поля' : 'No field'}</option>
            {fields.map(field => (
              <option key={field._id} value={field._id}>{field.name}</option>
            ))}
          </select>

          <input
            type="date"
            value={newEntry.date}
            onChange={(e) => setNewEntry({...newEntry, date: e.target.value})}
            className={`col-span-2 px-4 py-3 border-2 rounded-xl focus:border-green-500 ${themeClasses.input}`}
          />

          <textarea
            rows={4}
            placeholder={language === 'ru' ? 'Описание...' : 'Description...'}
            value={newEntry.content}
            onChange={(e) => setNewEntry({...newEntry, content: e.target.value})}
            className={`col-span-2 px-4 py-3 border-2 rounded-xl focus:border-green-500 ${themeClasses.input}`}
          />

          <div className="grid grid-cols-3 gap-4 col-span-2">
            <input
              type="number"
              placeholder={language === 'ru' ? 'Часы' : 'Hours'}
              value={newEntry.hours}
              onChange={(e) => setNewEntry({...newEntry, hours: e.target.value})}
              className={`px-4 py-3 border-2 rounded-xl focus:border-green-500 ${themeClasses.input}`}
            />
            <input
              type="number"
              placeholder={language === 'ru' ? 'Работники' : 'Workers'}
              value={newEntry.workers}
              onChange={(e) => setNewEntry({...newEntry, workers: e.target.value})}
              className={`px-4 py-3 border-2 rounded-xl focus:border-green-500 ${themeClasses.input}`}
            />
            <input
              type="number"
              placeholder={language === 'ru' ? 'Затраты' : 'Cost'}
              value={newEntry.cost}
              onChange={(e) => setNewEntry({...newEntry, cost: e.target.value})}
              className={`px-4 py-3 border-2 rounded-xl focus:border-green-500 ${themeClasses.input}`}
            />
          </div>

          <div className="col-span-2 grid grid-cols-2 gap-4">
            <select
              value={newEntry.weather}
              onChange={(e) => setNewEntry({...newEntry, weather: e.target.value})}
              className={`px-4 py-3 border-2 rounded-xl focus:border-green-500 ${themeClasses.input}`}
            >
              {weatherOptions.map(w => (
                <option key={w.id} value={w.id}>
                  {w.label[language]}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder={language === 'ru' ? 'Теги' : 'Tags'}
              value={newEntry.tags}
              onChange={(e) => setNewEntry({...newEntry, tags: e.target.value})}
              className={`px-4 py-3 border-2 rounded-xl focus:border-green-500 ${themeClasses.input}`}
            />
          </div>

          <div className="col-span-2 flex items-center gap-2">
            <input
              type="checkbox"
              id="important"
              checked={newEntry.isImportant}
              onChange={(e) => setNewEntry({...newEntry, isImportant: e.target.checked})}
              className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
            />
            <label htmlFor="important" className={themeClasses.text.secondary}>
              {language === 'ru' ? 'Важная запись' : 'Important'}
            </label>
          </div>
        </div>

        <div className={`flex justify-end gap-3 pt-4 border-t ${themeClasses.border}`}>
          <button
            onClick={onClose}
            className={`px-6 py-3 border-2 rounded-xl font-medium transition-colors ${themeClasses.button.outline}`}
          >
            {language === 'ru' ? 'Отмена' : 'Cancel'}
          </button>
          <button
            onClick={onSave}
            className={`px-6 py-3 rounded-xl font-medium flex items-center gap-2 ${themeClasses.button.primary}`}
          >
            <CheckCircle size={18} />
            {language === 'ru' ? 'Сохранить' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  </div>
);

// Компонент модального окна просмотра
const ViewEntryModal = ({ entry, onClose, language, theme, themeClasses }) => (
  <div className={`fixed inset-0 ${themeClasses.modal.overlay} backdrop-blur-sm flex items-center justify-center z-50 p-4`}>
    <div className={`rounded-2xl max-w-2xl w-full shadow-2xl border ${themeClasses.modal.content}`}>
      <div className={`p-6 border-b ${themeClasses.border} sticky top-0 ${themeClasses.modal.content} flex justify-between items-center`}>
        <h2 className={`text-2xl font-bold ${themeClasses.text.primary}`}>{entry.title}</h2>
        <button onClick={onClose} className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
          <X size={20} className={themeClasses.text.secondary} />
        </button>
      </div>
      <div className="p-6 space-y-4">
        <p className={`whitespace-pre-line ${themeClasses.text.secondary}`}>{entry.description || entry.content}</p>
        
        <div className={`grid grid-cols-2 gap-4 pt-4 border-t ${themeClasses.border}`}>
          {entry.date && (
            <div className={`flex items-center gap-2 text-sm ${themeClasses.text.secondary}`}>
              <Calendar size={16} className="text-green-500" />
              {new Date(entry.date).toLocaleDateString()}
            </div>
          )}
          {entry.fieldName && (
            <div className={`flex items-center gap-2 text-sm ${themeClasses.text.secondary}`}>
              <MapPin size={16} className="text-green-500" />
              {entry.fieldName}
            </div>
          )}
          {(entry.metrics?.duration || entry.hours) > 0 && (
            <div className={`flex items-center gap-2 text-sm ${themeClasses.text.secondary}`}>
              <Clock size={16} className="text-blue-500" />
              {entry.metrics?.duration || entry.hours} ч
            </div>
          )}
          {(entry.metrics?.workers || entry.workers) > 0 && (
            <div className={`flex items-center gap-2 text-sm ${themeClasses.text.secondary}`}>
              <Users size={16} className="text-purple-500" />
              {entry.metrics?.workers || entry.workers} чел.
            </div>
          )}
          {(entry.metrics?.cost || entry.cost) > 0 && (
            <div className={`flex items-center gap-2 text-sm ${themeClasses.text.secondary}`}>
              <DollarSign size={16} className="text-yellow-500" />
              {(entry.metrics?.cost || entry.cost).toLocaleString()} som
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);

// Добавьте анимации в ваш CSS файл
const styles = `
  @keyframes blob {
    0% { transform: translate(0px, 0px) scale(1); }
    33% { transform: translate(30px, -50px) scale(1.1); }
    66% { transform: translate(-20px, 20px) scale(0.9); }
    100% { transform: translate(0px, 0px) scale(1); }
  }
  .animate-blob { animation: blob 7s infinite; }
  .animation-delay-2000 { animation-delay: 2s; }
  .animation-delay-4000 { animation-delay: 4s; }
  
  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-slideDown { animation: slideDown 0.3s ease-out; }
`;

const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default DiaryPage;