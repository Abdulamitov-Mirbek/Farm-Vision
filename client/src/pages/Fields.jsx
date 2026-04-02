import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext'; // ✅ Добавляем тему
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import fieldsAPI from '../services/api/fieldsAPI';
import { MapPin, Edit2, Trash2, MoreVertical, Sprout, Droplets, Thermometer, Wind, RefreshCw, Search, Filter, X } from 'lucide-react';

const FieldsPage = () => {
  const { t, language } = useLanguage();
  const { theme } = useTheme(); // ✅ Получаем тему
  const [fields, setFields] = useState([]);
  const [stats, setStats] = useState({
    totalFields: 0,
    totalArea: 0,
    activeFields: 0,
    avgYield: 0
  });
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedField, setSelectedField] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

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
    select: theme === 'dark'
      ? 'bg-gray-700 border-gray-600 text-white'
      : 'bg-white border-gray-300 text-gray-900',
    textarea: theme === 'dark'
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
      danger: 'bg-red-600 hover:bg-red-700 text-white',
    },
    statCard: {
      total: theme === 'dark'
        ? 'bg-blue-900/30 border-blue-800'
        : 'bg-blue-50 border-blue-100',
      area: theme === 'dark'
        ? 'bg-green-900/30 border-green-800'
        : 'bg-green-50 border-green-100',
      active: theme === 'dark'
        ? 'bg-yellow-900/30 border-yellow-800'
        : 'bg-yellow-50 border-yellow-100',
      yield: theme === 'dark'
        ? 'bg-purple-900/30 border-purple-800'
        : 'bg-purple-50 border-purple-100',
    },
    statIcon: {
      total: theme === 'dark' ? 'text-blue-400' : 'text-blue-600',
      area: theme === 'dark' ? 'text-green-400' : 'text-green-600',
      active: theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600',
      yield: theme === 'dark' ? 'text-purple-400' : 'text-purple-600',
    },
    statBg: {
      total: theme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-100',
      area: theme === 'dark' ? 'bg-green-900/30' : 'bg-green-100',
      active: theme === 'dark' ? 'bg-yellow-900/30' : 'bg-yellow-100',
      yield: theme === 'dark' ? 'bg-purple-900/30' : 'bg-purple-100',
    },
    emptyState: {
      icon: theme === 'dark' ? 'text-gray-600' : 'text-gray-300',
      text: theme === 'dark' ? 'text-gray-400' : 'text-gray-500',
    },
    divider: theme === 'dark' ? 'border-gray-700' : 'border-gray-100',
    hover: {
      card: theme === 'dark'
        ? 'hover:bg-gray-750 hover:border-gray-600'
        : 'hover:bg-gray-50 hover:border-gray-300',
      table: theme === 'dark' ? 'hover:bg-gray-750' : 'hover:bg-gray-50',
    },
    shadow: {
      card: theme === 'dark' 
        ? 'shadow-lg shadow-black/20' 
        : 'shadow-lg shadow-gray-200',
    },
    searchIcon: theme === 'dark' ? 'text-gray-500' : 'text-gray-400',
    badge: {
      planning: theme === 'dark'
        ? 'bg-blue-900/30 text-blue-400 border border-blue-800'
        : 'bg-blue-100 text-blue-800 border border-blue-200',
      preparation: theme === 'dark'
        ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-800'
        : 'bg-yellow-100 text-yellow-800 border border-yellow-200',
      planted: theme === 'dark'
        ? 'bg-green-900/30 text-green-400 border border-green-800'
        : 'bg-green-100 text-green-800 border border-green-200',
      growing: theme === 'dark'
        ? 'bg-green-900/30 text-green-400 border border-green-800'
        : 'bg-green-100 text-green-800 border border-green-200',
      flowering: theme === 'dark'
        ? 'bg-purple-900/30 text-purple-400 border border-purple-800'
        : 'bg-purple-100 text-purple-800 border border-purple-200',
      fruiting: theme === 'dark'
        ? 'bg-purple-900/30 text-purple-400 border border-purple-800'
        : 'bg-purple-100 text-purple-800 border border-purple-200',
      harvesting: theme === 'dark'
        ? 'bg-orange-900/30 text-orange-400 border border-orange-800'
        : 'bg-orange-100 text-orange-800 border border-orange-200',
      harvested: theme === 'dark'
        ? 'bg-gray-700 text-gray-300 border border-gray-600'
        : 'bg-gray-100 text-gray-800 border border-gray-200',
      fallow: theme === 'dark'
        ? 'bg-gray-700 text-gray-300 border border-gray-600'
        : 'bg-gray-100 text-gray-800 border border-gray-200',
      problems: theme === 'dark'
        ? 'bg-red-900/30 text-red-400 border border-red-800'
        : 'bg-red-100 text-red-800 border border-red-200',
    },
    modal: {
      overlay: 'bg-black/50',
      content: theme === 'dark'
        ? 'bg-gray-800 border-gray-700'
        : 'bg-white border-gray-200',
    },
    label: theme === 'dark' ? 'text-gray-300' : 'text-gray-700',
    actionButton: {
      edit: theme === 'dark'
        ? 'text-gray-400 hover:text-blue-400'
        : 'text-gray-400 hover:text-blue-600',
      delete: theme === 'dark'
        ? 'text-gray-400 hover:text-red-400'
        : 'text-gray-400 hover:text-red-600',
    },
    table: {
      head: theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50',
      headText: theme === 'dark' ? 'text-gray-300' : 'text-gray-500',
      row: theme === 'dark' ? 'border-gray-700' : 'border-gray-200',
      cell: theme === 'dark' ? 'text-gray-300' : 'text-gray-600',
    },
    viewToggle: {
      active: 'bg-green-600 text-white',
      inactive: theme === 'dark'
        ? 'text-gray-400 hover:bg-gray-700'
        : 'text-gray-600 hover:bg-gray-100',
    },
    fieldInfo: {
      label: theme === 'dark' ? 'text-gray-400' : 'text-gray-600',
      value: theme === 'dark' ? 'text-white' : 'text-gray-900',
    },
  };

  const formatNumber = (value, decimals = 1) => {
    if (value === null || value === undefined) return '0';
    const num = typeof value === 'number' ? value : Number(value);
    return isNaN(num) ? '0' : num.toFixed(decimals);
  };

  // Загрузка данных из БД
  useEffect(() => {
    loadFields();
  }, [language, searchTerm, statusFilter]);

  const loadFields = async () => {
    try {
      setLoading(true);
      
      // Подготавливаем фильтры
      const filters = {};
      if (searchTerm) filters.search = searchTerm;
      if (statusFilter !== 'all') filters.status = statusFilter;
      
      // Загружаем поля
      const response = await fieldsAPI.getAll(filters);
      setFields(response.fields || []);
      
      // Загружаем статистику
      const statsResponse = await fieldsAPI.getStats();
      setStats(statsResponse.stats || {});
      
    } catch (error) {
      console.error('Ошибка загрузки полей:', error);
    } finally {
      setLoading(false);
    }
  };

  const [newField, setNewField] = useState({
    name: '',
    area: '',
    cropType: '',
    soilType: '',
    irrigationSystem: 'none',
    description: '',
    plantingDate: '',
    expectedHarvestDate: ''
  });

  const handleAddField = async () => {
    if (!newField.name || !newField.area) {
      alert(
        language === 'ru' ? 'Заполните название и площадь поля' :
        language === 'en' ? 'Fill in field name and area' :
        'Талаанын аталышын жана аянтын толтуруңуз'
      );
      return;
    }

    try {
      // Подготавливаем данные для отправки - БЕЗ СТАТУСА!
      const fieldData = {
        name: newField.name,
        area: parseFloat(newField.area),
        cropType: newField.cropType || 'other',
        soilType: newField.soilType || 'other',
        description: newField.description || '',
        unit: 'hectare',
        irrigationSystem: newField.irrigationSystem || 'none',
        plantingDate: newField.plantingDate || null,
        expectedHarvestDate: newField.expectedHarvestDate || null
      };

      const response = await fieldsAPI.create(fieldData);
      
      setFields([...fields, response.field]);
      loadFields(); // Перезагружаем для обновления статистики
      
      // Сбрасываем форму
      setNewField({
        name: '', area: '', cropType: '', soilType: '',
        irrigationSystem: 'none', description: '',
        plantingDate: '', expectedHarvestDate: ''
      });
      setIsModalOpen(false);
      
    } catch (error) {
      console.error('Ошибка создания поля:', error);
      alert('Ошибка при создании поля: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDeleteField = async (id) => {
    if (!window.confirm(
      language === 'ru' ? 'Вы уверены, что хотите удалить это поле?' :
      language === 'en' ? 'Are you sure you want to delete this field?' :
      'Бул талааны чын эле жок кылгыңыз келеби?'
    )) return;

    try {
      await fieldsAPI.delete(id);
      setFields(fields.filter(field => field._id !== id));
      loadFields(); // Перезагружаем статистику
    } catch (error) {
      console.error('Ошибка удаления поля:', error);
      alert('Ошибка при удалении поля');
    }
  };

  const getStatusColor = (status) => {
    const statusMap = {
      'planning': themeClasses.badge.planning,
      'preparation': themeClasses.badge.preparation,
      'planted': themeClasses.badge.planted,
      'growing': themeClasses.badge.growing,
      'flowering': themeClasses.badge.flowering,
      'fruiting': themeClasses.badge.fruiting,
      'harvesting': themeClasses.badge.harvesting,
      'harvested': themeClasses.badge.harvested,
      'fallow': themeClasses.badge.fallow,
      'problems': themeClasses.badge.problems
    };
    
    const defaultColor = themeClasses.badge.fallow;
    
    // Перевод статусов для отображения
    const statusText = {
      'planning': { ru: 'Планирование', en: 'Planning', kg: 'Пландоо' },
      'preparation': { ru: 'Подготовка', en: 'Preparation', kg: 'Даярдоо' },
      'planted': { ru: 'Посажено', en: 'Planted', kg: 'Эгилген' },
      'growing': { ru: 'Растет', en: 'Growing', kg: 'Өсүп жатат' },
      'flowering': { ru: 'Цветение', en: 'Flowering', kg: 'Гүлдөө' },
      'fruiting': { ru: 'Плодоношение', en: 'Fruiting', kg: 'Мөмөлөө' },
      'harvesting': { ru: 'Сбор', en: 'Harvesting', kg: 'Жыйноо' },
      'harvested': { ru: 'Собрано', en: 'Harvested', kg: 'Жыйналган' },
      'fallow': { ru: 'Пар', en: 'Fallow', kg: 'Пар' },
      'problems': { ru: 'Проблемы', en: 'Problems', kg: 'Көйгөйлөр' }
    };
    
    return {
      colorClass: statusMap[status] || defaultColor,
      text: statusText[status]?.[language] || status
    };
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center h-64 ${themeClasses.page}`}>
        <div className="text-center">
          <RefreshCw className={`animate-spin h-12 w-12 mx-auto ${
            theme === 'dark' ? 'text-green-400' : 'text-green-600'
          }`} />
          <p className={`mt-4 ${themeClasses.text.secondary}`}>
            {language === 'ru' ? 'Загрузка полей...' :
             language === 'en' ? 'Loading fields...' :
             'Талаалар жүктөлүүдө...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-6 transition-colors duration-300 ${themeClasses.page}`}>
      <div className="space-y-6">
        {/* Заголовок и кнопки */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className={`text-2xl font-bold ${themeClasses.text.primary}`}>
              {language === 'ru' ? 'Мои поля' :
               language === 'en' ? 'My Fields' :
               'Менин талааларым'}
            </h1>
            <p className={`mt-1 ${themeClasses.text.secondary}`}>
              {language === 'ru' ? 'Управление полями и их параметрами' :
               language === 'en' ? 'Manage fields and their parameters' :
               'Талааларды жана алардын параметрлерин башкаруу'}
            </p>
          </div>
          
          <div className="flex items-center space-x-3 mt-4 md:mt-0">
            {/* Поиск */}
            <div className="relative">
              <Search className={`absolute left-3 top-2.5 ${themeClasses.searchIcon}`} size={18} />
              <input
                type="text"
                placeholder={language === 'ru' ? 'Поиск полей...' :
                            language === 'en' ? 'Search fields...' :
                            'Талааларды издөө...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-10 pr-4 py-2 rounded-lg border transition-colors ${themeClasses.input} w-64`}
              />
            </div>

            {/* Фильтр по статусу */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`px-4 py-2 rounded-lg border transition-colors ${themeClasses.select}`}
            >
              <option value="all">
                {language === 'ru' ? 'Все статусы' :
                 language === 'en' ? 'All statuses' :
                 'Бардык статустар'}
              </option>
              <option value="planning">Планирование</option>
              <option value="growing">Растет</option>
              <option value="harvesting">Сбор урожая</option>
              <option value="harvested">Собрано</option>
              <option value="problems">Проблемы</option>
            </select>

            {/* Переключение вида */}
            <div className={`flex items-center rounded-lg border p-1 ${themeClasses.border} ${themeClasses.card}`}>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  viewMode === 'grid'
                    ? themeClasses.viewToggle.active
                    : themeClasses.viewToggle.inactive
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  viewMode === 'list'
                    ? themeClasses.viewToggle.active
                    : themeClasses.viewToggle.inactive
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
            
            <button
              className={`px-4 py-2 rounded-lg flex items-center ${themeClasses.button.primary}`}
              onClick={() => setIsModalOpen(true)}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              {language === 'ru' ? 'Добавить поле' :
               language === 'en' ? 'Add Field' :
               'Талаа кошуу'}
            </button>
          </div>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className={`p-6 rounded-xl border ${themeClasses.statCard.total} ${themeClasses.card}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${themeClasses.text.secondary}`}>
                  {language === 'ru' ? 'Всего полей' :
                   language === 'en' ? 'Total Fields' :
                   'Бардык талаалар'}
                </p>
                <p className={`text-2xl font-bold ${themeClasses.text.primary}`}>
                  {stats.totalFields || fields.length}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${themeClasses.statBg.total}`}>
                <MapPin className={themeClasses.statIcon.total} size={24} />
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-xl border ${themeClasses.statCard.area} ${themeClasses.card}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${themeClasses.text.secondary}`}>
                  {language === 'ru' ? 'Общая площадь' :
                   language === 'en' ? 'Total Area' :
                   'Жалпы аянт'}
                </p>
                <p className={`text-2xl font-bold ${themeClasses.text.primary}`}>
                  {(stats.totalArea || 0).toFixed(1)} га
                </p>
              </div>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${themeClasses.statBg.area}`}>
                <Sprout className={themeClasses.statIcon.area} size={24} />
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-xl border ${themeClasses.statCard.active} ${themeClasses.card}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${themeClasses.text.secondary}`}>
                  {language === 'ru' ? 'Активные поля' :
                   language === 'en' ? 'Active Fields' :
                   'Активдүү талаалар'}
                </p>
                <p className={`text-2xl font-bold ${themeClasses.text.primary}`}>
                  {stats.activeFields || 0}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${themeClasses.statBg.active}`}>
                <Thermometer className={themeClasses.statIcon.active} size={24} />
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-xl border ${themeClasses.statCard.yield} ${themeClasses.card}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${themeClasses.text.secondary}`}>
                  {language === 'ru' ? 'Ср. урожайность' :
                   language === 'en' ? 'Avg. Yield' :
                   'Орт. түшүмдүүлүк'}
                </p>
                <p className={`text-2xl font-bold ${themeClasses.text.primary}`}>
                  {typeof stats.avgYield === 'number' ? stats.avgYield.toFixed(1) : Number(stats.avgYield || 0).toFixed(1)} ц/га
                </p>
              </div>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${themeClasses.statBg.yield}`}>
                <Sprout className={themeClasses.statIcon.yield} size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Список полей */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fields.map(field => {
              const status = getStatusColor(field.status);
              return (
                <div 
                  key={field._id} 
                  className={`p-6 rounded-xl border transition-all ${themeClasses.card} ${themeClasses.shadow.card} ${themeClasses.hover.card}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className={`text-lg font-semibold ${themeClasses.text.primary}`}>{field.name}</h3>
                      <p className={`text-sm ${themeClasses.text.secondary}`}>{field.area} га</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className={themeClasses.actionButton.edit}>
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDeleteField(field._id)}
                        className={themeClasses.actionButton.delete}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className={themeClasses.fieldInfo.label}>
                        {language === 'ru' ? 'Культура' :
                         language === 'en' ? 'Crop' :
                         'Өсүмдүк'}:
                      </span>
                      <span className={`font-medium ${themeClasses.fieldInfo.value}`}>
                        {field.cropType === 'wheat' ? (language === 'ru' ? 'Пшеница' : language === 'en' ? 'Wheat' : 'Буудай') :
                         field.cropType === 'corn' ? (language === 'ru' ? 'Кукуруза' : language === 'en' ? 'Corn' : 'Жүгөрү') :
                         field.cropType === 'sunflower' ? (language === 'ru' ? 'Подсолнечник' : language === 'en' ? 'Sunflower' : 'Күн карама') :
                         field.cropType || '-'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className={themeClasses.fieldInfo.label}>
                        {language === 'ru' ? 'Статус' :
                         language === 'en' ? 'Status' :
                         'Статус'}:
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs ${status.colorClass}`}>
                        {status.text}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className={themeClasses.fieldInfo.label}>
                        {language === 'ru' ? 'Почва' :
                         language === 'en' ? 'Soil' :
                         'Топурак'}:
                      </span>
                      <span className={`font-medium ${themeClasses.fieldInfo.value}`}>
                        {field.soilType === 'chernozem' ? (language === 'ru' ? 'Чернозем' : 'Chernozem') :
                         field.soilType === 'loam' ? (language === 'ru' ? 'Суглинок' : 'Loam') :
                         field.soilType || '-'}
                      </span>
                    </div>
                  </div>

                  {field.plantingDate && (
                    <div className={`mt-4 pt-4 border-t ${themeClasses.divider}`}>
                      <div className={`flex items-center justify-between text-xs ${themeClasses.text.muted}`}>
                        <span>
                          {language === 'ru' ? 'Посадка' : 'Planting'}: {new Date(field.plantingDate).toLocaleDateString()}
                        </span>
                        {field.expectedHarvestDate && (
                          <span>
                            {language === 'ru' ? 'Сбор' : 'Harvest'}: {new Date(field.expectedHarvestDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className={`rounded-xl border overflow-hidden ${themeClasses.card}`}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={themeClasses.table.head}>
                  <tr>
                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${themeClasses.table.headText}`}>
                      {language === 'ru' ? 'Название' :
                       language === 'en' ? 'Name' :
                       'Аталышы'}
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${themeClasses.table.headText}`}>
                      {language === 'ru' ? 'Площадь (га)' :
                       language === 'en' ? 'Area (ha)' :
                       'Аянт (га)'}
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${themeClasses.table.headText}`}>
                      {language === 'ru' ? 'Культура' :
                       language === 'en' ? 'Crop' :
                       'Өсүмдүк'}
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${themeClasses.table.headText}`}>
                      {language === 'ru' ? 'Почва' :
                       language === 'en' ? 'Soil' :
                       'Топурак'}
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${themeClasses.table.headText}`}>
                      {language === 'ru' ? 'Статус' :
                       language === 'en' ? 'Status' :
                       'Статус'}
                    </th>
                    <th className={`px-6 py-3 text-right text-xs font-medium uppercase tracking-wider ${themeClasses.table.headText}`}>
                      {language === 'ru' ? 'Действия' :
                       language === 'en' ? 'Actions' :
                       'Аракеттер'}
                    </th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${themeClasses.table.row}`}>
                  {fields.map(field => {
                    const status = getStatusColor(field.status);
                    return (
                      <tr key={field._id} className={themeClasses.hover.table}>
                        <td className={`px-6 py-4 whitespace-nowrap ${themeClasses.text.primary}`}>
                          {field.name}
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap ${themeClasses.table.cell}`}>
                          {field.area}
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap ${themeClasses.table.cell}`}>
                          {field.cropType === 'wheat' ? (language === 'ru' ? 'Пшеница' : language === 'en' ? 'Wheat' : 'Буудай') :
                           field.cropType === 'corn' ? (language === 'ru' ? 'Кукуруза' : language === 'en' ? 'Corn' : 'Жүгөрү') :
                           field.cropType === 'sunflower' ? (language === 'ru' ? 'Подсолнечник' : language === 'en' ? 'Sunflower' : 'Күн карама') :
                           field.cropType || '-'}
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap ${themeClasses.table.cell}`}>
                          {field.soilType === 'chernozem' ? (language === 'ru' ? 'Чернозем' : 'Chernozem') :
                           field.soilType === 'loam' ? (language === 'ru' ? 'Суглинок' : 'Loam') :
                           field.soilType || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs ${status.colorClass}`}>
                            {status.text}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <button className={`mr-3 ${themeClasses.actionButton.edit}`}>
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={() => handleDeleteField(field._id)}
                            className={themeClasses.actionButton.delete}
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Модальное окно добавления поля */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/50" onClick={() => setIsModalOpen(false)}></div>
            <div className={`relative w-full max-w-2xl rounded-xl border ${themeClasses.modal.content} p-6`}>
              <h3 className={`text-xl font-semibold mb-4 ${themeClasses.text.primary}`}>
                {language === 'ru' ? 'Добавить новое поле' :
                 language === 'en' ? 'Add New Field' :
                 'Жаңы талаа кошуу'}
              </h3>
              
              <FieldForm 
                newField={newField}
                setNewField={setNewField}
                language={language}
                themeClasses={themeClasses}
              />
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  className={`px-4 py-2 rounded-lg border transition-colors ${themeClasses.button.secondary}`}
                  onClick={() => setIsModalOpen(false)}
                >
                  {language === 'ru' ? 'Отмена' :
                   language === 'en' ? 'Cancel' :
                   'Жокко чыгаруу'}
                </button>
                <button
                  className={`px-4 py-2 rounded-lg flex items-center ${themeClasses.button.primary}`}
                  onClick={handleAddField}
                >
                  {language === 'ru' ? 'Добавить поле' :
                   language === 'en' ? 'Add Field' :
                   'Талаа кошуу'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Компонент формы для поля
const FieldForm = ({ newField, setNewField, language, themeClasses }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className={`block text-sm font-medium mb-2 ${themeClasses.label}`}>
          {language === 'ru' ? 'Название поля' :
           language === 'en' ? 'Field Name' :
           'Талаанын аталышы'}
        </label>
        <input
          className={`w-full px-4 py-2 rounded-lg border transition-colors ${themeClasses.input}`}
          placeholder={language === 'ru' ? 'Например: Северное поле' :
                      language === 'en' ? 'E.g.: Northern Field' :
                      'Мисалы: Түндүк талаа'}
          value={newField.name}
          onChange={(e) => setNewField({...newField, name: e.target.value})}
        />
      </div>

      <div>
        <label className={`block text-sm font-medium mb-2 ${themeClasses.label}`}>
          {language === 'ru' ? 'Площадь (га)' :
           language === 'en' ? 'Area (ha)' :
           'Аянт (га)'}
        </label>
        <input
          type="number"
          className={`w-full px-4 py-2 rounded-lg border transition-colors ${themeClasses.input}`}
          placeholder="0.0"
          value={newField.area}
          onChange={(e) => setNewField({...newField, area: e.target.value})}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={`block text-sm font-medium mb-2 ${themeClasses.label}`}>
            {language === 'ru' ? 'Культура' :
             language === 'en' ? 'Crop' :
             'Өсүмдүк'}
          </label>
          <select
            value={newField.cropType}
            onChange={(e) => setNewField({...newField, cropType: e.target.value})}
            className={`w-full px-4 py-2 rounded-lg border transition-colors ${themeClasses.select}`}
          >
            <option value="">{language === 'ru' ? 'Выберите' : 'Select'}</option>
            <option value="wheat">Пшеница / Wheat / Буудай</option>
            <option value="corn">Кукуруза / Corn / Жүгөрү</option>
            <option value="sunflower">Подсолнечник / Sunflower / Күн карама</option>
            <option value="barley">Ячмень / Barley / Арпа</option>
            <option value="other">Другое / Other / Башка</option>
          </select>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${themeClasses.label}`}>
            {language === 'ru' ? 'Тип почвы' :
             language === 'en' ? 'Soil Type' :
             'Топурак түрү'}
          </label>
          <select
            value={newField.soilType}
            onChange={(e) => setNewField({...newField, soilType: e.target.value})}
            className={`w-full px-4 py-2 rounded-lg border transition-colors ${themeClasses.select}`}
          >
            <option value="">{language === 'ru' ? 'Выберите' : 'Select'}</option>
            <option value="chernozem">Чернозем / Chernozem / Кара топурак</option>
            <option value="loam">Суглинок / Loam / Чополуу</option>
            <option value="sandy">Песчаная / Sandy / Кумдуу</option>
            <option value="clay">Глинистая / Clay / Чополуу</option>
            <option value="other">Другое / Other / Башка</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={`block text-sm font-medium mb-2 ${themeClasses.label}`}>
            {language === 'ru' ? 'Дата посадки' :
             language === 'en' ? 'Planting Date' :
             'Эгүү датасы'}
          </label>
          <input
            type="date"
            className={`w-full px-4 py-2 rounded-lg border transition-colors ${themeClasses.input}`}
            value={newField.plantingDate}
            onChange={(e) => setNewField({...newField, plantingDate: e.target.value})}
          />
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${themeClasses.label}`}>
            {language === 'ru' ? 'Дата сбора' :
             language === 'en' ? 'Harvest Date' :
             'Жыйноо датасы'}
          </label>
          <input
            type="date"
            className={`w-full px-4 py-2 rounded-lg border transition-colors ${themeClasses.input}`}
            value={newField.expectedHarvestDate}
            onChange={(e) => setNewField({...newField, expectedHarvestDate: e.target.value})}
          />
        </div>
      </div>

      <div>
        <label className={`block text-sm font-medium mb-2 ${themeClasses.label}`}>
          {language === 'ru' ? 'Описание' :
           language === 'en' ? 'Description' :
           'Сүрөттөмө'}
        </label>
        <textarea
          className={`w-full px-4 py-2 rounded-lg border transition-colors ${themeClasses.textarea}`}
          placeholder={language === 'ru' ? 'Дополнительная информация...' :
                      language === 'en' ? 'Additional information...' :
                      'Кошумча маалымат...'}
          rows="3"
          value={newField.description}
          onChange={(e) => setNewField({...newField, description: e.target.value})}
        />
      </div>
    </div>
  );
};

export default FieldsPage;