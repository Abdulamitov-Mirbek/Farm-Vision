// src/pages/Resources.jsx
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext'; // ✅ Добавляем тему
import resourcesAPI from '../services/api/resourcesAPI';
import { 
  Package, Search, Filter, Plus, Edit2, Trash2,
  MoreVertical, Download, TrendingUp, TrendingDown,
  AlertCircle, CheckCircle, Clock, X, Minus, Plus as PlusIcon,
  AlertTriangle, RefreshCw
} from 'lucide-react';

const Resources = () => {
  const { language } = useLanguage();
  const { theme } = useTheme(); // ✅ Получаем тему
  const [resources, setResources] = useState([]);
  const [stats, setStats] = useState({
    totalResources: 0,
    totalValue: 0,
    lowStock: 0,
    expiringSoon: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(null);

  // ✅ Классы для темы (как в Advanced.jsx)
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
    border: theme === 'dark' ? 'border-gray-700' : 'border-gray-200',
    input: theme === 'dark'
      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
      : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400',
    button: {
      primary: 'bg-green-600 hover:bg-green-700 text-white',
      outline: theme === 'dark'
        ? 'border-gray-600 hover:bg-gray-700 text-gray-300'
        : 'border-gray-200 hover:bg-gray-50 text-gray-700',
      icon: theme === 'dark'
        ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
        : 'bg-gray-100 hover:bg-gray-200 text-gray-600',
    },
    badge: {
      good: theme === 'dark'
        ? 'bg-green-900/30 text-green-400 border border-green-800'
        : 'bg-green-100 text-green-800 border border-green-200',
      warning: theme === 'dark'
        ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-800'
        : 'bg-yellow-100 text-yellow-800 border border-yellow-200',
      critical: theme === 'dark'
        ? 'bg-red-900/30 text-red-400 border border-red-800'
        : 'bg-red-100 text-red-800 border border-red-200',
      gray: theme === 'dark'
        ? 'bg-gray-700 text-gray-300 border border-gray-600'
        : 'bg-gray-100 text-gray-700 border border-gray-200',
    },
    table: {
      header: theme === 'dark' ? 'bg-gray-800 text-gray-400 border-gray-700' : 'bg-gray-50 text-gray-600 border-gray-200',
      row: theme === 'dark' ? 'hover:bg-gray-700/50 border-gray-700' : 'hover:bg-gray-50 border-gray-100',
      cell: theme === 'dark' ? 'text-gray-300' : 'text-gray-600',
    },
    stat: {
      card: theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100',
      value: theme === 'dark' ? 'text-white' : 'text-gray-900',
      label: theme === 'dark' ? 'text-gray-400' : 'text-gray-600',
    },
    modal: {
      overlay: theme === 'dark' ? 'bg-black/70' : 'bg-black/50',
      content: theme === 'dark' 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-200',
    },
    quantityButton: theme === 'dark'
      ? 'hover:bg-gray-700 text-gray-400'
      : 'hover:bg-gray-100 text-gray-500',
  };

  // Переводы для страницы
  const pageText = {
    title: {
      ru: 'Ресурсы и материалы',
      en: 'Resources & Materials',
      kg: 'Ресурстар жана материалдар'
    },
    totalResources: {
      ru: 'Всего ресурсов:',
      en: 'Total resources:',
      kg: 'Бардык ресурстар:'
    },
    searchPlaceholder: {
      ru: '🔍 Поиск ресурсов...',
      en: '🔍 Search resources...',
      kg: '🔍 Ресурстарды издөө...'
    },
    categories: {
      all: {
        ru: 'Все категории',
        en: 'All categories',
        kg: 'Бардык категориялар'
      },
      seeds: {
        ru: 'Семена',
        en: 'Seeds',
        kg: 'Үрөндөр'
      },
      fertilizers: {
        ru: 'Удобрения',
        en: 'Fertilizers',
        kg: 'Жер семирткичтер'
      },
      fuel: {
        ru: 'Топливо',
        en: 'Fuel',
        kg: 'Күйүүчү май'
      },
      chemicals: {
        ru: 'Химикаты',
        en: 'Chemicals',
        kg: 'Химикаттар'
      },
      spareparts: {
        ru: 'Запчасти',
        en: 'Spare Parts',
        kg: 'Запас бөлүктөр'
      },
      packaging: {
        ru: 'Упаковка',
        en: 'Packaging',
        kg: 'Таңгактоо'
      }
    },
    addButton: {
      ru: 'Добавить',
      en: 'Add',
      kg: 'Кошуу'
    },
    stats: {
      totalValue: {
        ru: 'Общая стоимость',
        en: 'Total Value',
        kg: 'Жалпы баасы'
      },
      lowStock: {
        ru: 'Низкий запас',
        en: 'Low Stock',
        kg: 'Аз запас'
      },
      expiringSoon: {
        ru: 'Истекает срок',
        en: 'Expiring Soon',
        kg: 'Мөөнөтү бүтүүгө аз калды'
      },
      totalItems: {
        ru: 'Всего позиций',
        en: 'Total Items',
        kg: 'Бардык пункттар'
      }
    },
    table: {
      resource: {
        ru: 'Ресурс',
        en: 'Resource',
        kg: 'Ресурс'
      },
      category: {
        ru: 'Категория',
        en: 'Category',
        kg: 'Категория'
      },
      quantity: {
        ru: 'Количество',
        en: 'Quantity',
        kg: 'Саны'
      },
      price: {
        ru: 'Цена',
        en: 'Price',
        kg: 'Баасы'
      },
      total: {
        ru: 'Сумма',
        en: 'Total',
        kg: 'Сумма'
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
      }
    },
    status: {
      good: {
        ru: 'Норма',
        en: 'Good',
        kg: 'Норма'
      },
      warning: {
        ru: 'Заканчивается',
        en: 'Running Low',
        kg: 'Бүтүүгө аз калды'
      },
      critical: {
        ru: 'Критично',
        en: 'Critical',
        kg: 'Критикалык'
      }
    },
    noResources: {
      ru: 'Ресурсы не найдены',
      en: 'No resources found',
      kg: 'Ресурстар табылган жок'
    },
    modal: {
      addTitle: {
        ru: 'Добавить ресурс',
        en: 'Add Resource',
        kg: 'Ресурс кошуу'
      },
      editTitle: {
        ru: 'Редактировать ресурс',
        en: 'Edit Resource',
        kg: 'Ресурсты оңдоо'
      },
      nameRu: {
        ru: 'Название (рус.)',
        en: 'Name (Russian)',
        kg: 'Аталышы (орусча)'
      },
      nameEn: {
        ru: 'Название (англ.)',
        en: 'Name (English)',
        kg: 'Аталышы (англисче)'
      },
      nameKg: {
        ru: 'Название (кырг.)',
        en: 'Name (Kyrgyz)',
        kg: 'Аталышы (кыргызча)'
      },
      category: {
        ru: 'Категория',
        en: 'Category',
        kg: 'Категория'
      },
      quantity: {
        ru: 'Количество',
        en: 'Quantity',
        kg: 'Саны'
      },
      minStock: {
        ru: 'Мин. запас',
        en: 'Min Stock',
        kg: 'Мин. запас'
      },
      maxStock: {
        ru: 'Макс. запас',
        en: 'Max Stock',
        kg: 'Макс. запас'
      },
      price: {
        ru: 'Цена',
        en: 'Price',
        kg: 'Баасы'
      },
      unit: {
        ru: 'Единица',
        en: 'Unit',
        kg: 'Бирдик'
      },
      expiryDate: {
        ru: 'Срок годности',
        en: 'Expiry Date',
        kg: 'Жарактуулук мөөнөтү'
      },
      cancel: {
        ru: 'Отмена',
        en: 'Cancel',
        kg: 'Жокко чыгаруу'
      },
      add: {
        ru: 'Добавить',
        en: 'Add',
        kg: 'Кошуу'
      },
      update: {
        ru: 'Обновить',
        en: 'Update',
        kg: 'Жаңыртуу'
      }
    },
    currency: {
      ru: 'сом',
      en: 'som',
      kg: 'сом'
    },
    units: {
      kg: {
        ru: 'кг',
        en: 'kg',
        kg: 'кг'
      },
      l: {
        ru: 'л',
        en: 'l',
        kg: 'л'
      },
      pcs: {
        ru: 'шт',
        en: 'pcs',
        kg: 'шт'
      },
      t: {
        ru: 'т',
        en: 't',
        kg: 'т'
      }
    }
  };

  // Загрузка данных
  useEffect(() => {
    loadResources();
    loadStats();
  }, [selectedCategory, searchTerm]);

  const loadResources = async () => {
    try {
      setLoading(true);
      const filters = {};
      if (selectedCategory !== 'all') filters.category = selectedCategory;
      if (searchTerm) filters.search = searchTerm;
      
      const response = await resourcesAPI.getAll(filters);
      setResources(response.resources || []);
    } catch (err) {
      setError('Ошибка загрузки ресурсов');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await resourcesAPI.getStats();
      setStats(response.stats || {
        totalResources: 0,
        totalValue: 0,
        lowStock: 0,
        expiringSoon: 0
      });
    } catch (err) {
      console.error('Ошибка загрузки статистики:', err);
    }
  };

  const handleAddResource = async (formData) => {
    try {
      console.log('📤 Отправляемые данные:', formData);
      
      const resourceData = {
        name: {
          ru: formData.name.ru || 'Новый ресурс',
          en: formData.name.en || 'New resource',
          kg: formData.name.kg || 'Жаңы ресурс'
        },
        category: formData.category || 'seeds',
        quantity: Number(formData.quantity) || 0,
        unit: {
          ru: formData.unit.ru || 'кг',
          en: formData.unit.en || 'kg',
          kg: formData.unit.kg || 'кг'
        },
        minStock: Number(formData.minStock) || 0,
        maxStock: Number(formData.maxStock) || 100,
        price: Number(formData.price) || 0,
        supplier: {
          ru: formData.supplier?.ru || '',
          en: formData.supplier?.en || '',
          kg: formData.supplier?.kg || ''
        },
        expiryDate: formData.expiryDate || null,
        location: {
          ru: formData.location?.ru || '',
          en: formData.location?.en || '',
          kg: formData.location?.kg || ''
        },
        notes: formData.notes || ''
      };

      console.log('📦 Подготовленные данные:', resourceData);
      
      const response = await resourcesAPI.create(resourceData);
      console.log('✅ Ресурс создан:', response);
      
      setResources([...resources, response.resource]);
      setShowAddModal(false);
      loadStats();
    } catch (err) {
      console.error('❌ Ошибка при добавлении ресурса:', err);
      alert('Ошибка при добавлении ресурса. Проверьте все поля.');
    }
  };

  const handleUpdateQuantity = async (id, change) => {
    try {
      const response = await resourcesAPI.updateQuantity(id, change);
      setResources(resources.map(r => 
        r._id === id ? response.resource : r
      ));
      loadStats();
    } catch (err) {
      alert('Ошибка при обновлении количества');
    }
  };

  const handleDeleteResource = async (id) => {
    if (!window.confirm(
      language === 'ru' ? 'Удалить этот ресурс?' :
      language === 'en' ? 'Delete this resource?' :
      'Бул ресурсту өчүрүү?'
    )) return;

    try {
      await resourcesAPI.delete(id);
      setResources(resources.filter(r => r._id !== id));
      loadStats();
    } catch (err) {
      alert('Ошибка при удалении ресурса');
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'good': return themeClasses.badge.good;
      case 'warning': return themeClasses.badge.warning;
      case 'critical': return themeClasses.badge.critical;
      default: return themeClasses.badge.gray;
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'good': return <CheckCircle size={14} className={theme === 'dark' ? 'text-green-400' : 'text-green-600'} />;
      case 'warning': return <AlertTriangle size={14} className={theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'} />;
      case 'critical': return <AlertCircle size={14} className={theme === 'dark' ? 'text-red-400' : 'text-red-600'} />;
      default: return <Package size={14} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} />;
    }
  };

  const getStatusText = (status) => {
    return pageText.status[status]?.[language] || status;
  };

  const getCategoryName = (category) => {
    return pageText.categories[category]?.[language] || category;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ru-RU', { 
      style: 'currency', 
      currency: 'KGS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount).replace('KGS', pageText.currency[language]);
  };

  if (loading && resources.length === 0) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${themeClasses.page}`}>
        <div className="text-center">
          <RefreshCw size={40} className={`animate-spin ${theme === 'dark' ? 'text-green-400' : 'text-green-600'} mx-auto mb-4`} />
          <p className={themeClasses.text.secondary}>
            {language === 'ru' ? 'Загрузка ресурсов...' : 
             language === 'en' ? 'Loading resources...' : 
             'Ресурстар жүктөлүүдө...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-6 transition-colors duration-300 ${themeClasses.page}`}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Заголовок и кнопки */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className={`text-2xl font-bold ${themeClasses.text.primary}`}>
              {pageText.title[language]}
            </h1>
            <p className={`mt-1 ${themeClasses.text.secondary}`}>
              {pageText.totalResources[language]} {stats.totalResources}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder={pageText.searchPlaceholder[language]}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-green-500 w-64 ${themeClasses.input}`}
              />
              <Search size={18} className={`absolute left-3 top-2.5 ${themeClasses.text.muted}`} />
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={`px-4 py-2 border rounded-xl focus:ring-2 focus:ring-green-500 ${themeClasses.input}`}
            >
              <option value="all">{pageText.categories.all[language]}</option>
              <option value="seeds">{pageText.categories.seeds[language]}</option>
              <option value="fertilizers">{pageText.categories.fertilizers[language]}</option>
              <option value="fuel">{pageText.categories.fuel[language]}</option>
              <option value="chemicals">{pageText.categories.chemicals[language]}</option>
              <option value="spareparts">{pageText.categories.spareparts[language]}</option>
              <option value="packaging">{pageText.categories.packaging[language]}</option>
            </select>
            
            <button 
              onClick={() => setShowAddModal(true)}
              className={`px-4 py-2 rounded-xl transition-colors flex items-center gap-2 ${themeClasses.button.primary}`}
            >
              <Plus size={18} />
              <span className="hidden sm:inline">{pageText.addButton[language]}</span>
            </button>
          </div>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className={`rounded-xl p-6 shadow-sm border ${themeClasses.stat.card}`}>
            <p className={`text-sm mb-1 ${themeClasses.stat.label}`}>{pageText.stats.totalValue[language]}</p>
            <p className={`text-2xl font-bold ${themeClasses.stat.value}`}>
              {formatCurrency(stats.totalValue)}
            </p>
          </div>
          
          <div className={`rounded-xl p-6 shadow-sm border ${themeClasses.stat.card}`}>
            <p className={`text-sm mb-1 ${themeClasses.stat.label}`}>{pageText.stats.lowStock[language]}</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.lowStock}</p>
          </div>
          
          <div className={`rounded-xl p-6 shadow-sm border ${themeClasses.stat.card}`}>
            <p className={`text-sm mb-1 ${themeClasses.stat.label}`}>{pageText.stats.expiringSoon[language]}</p>
            <p className="text-2xl font-bold text-orange-600">{stats.expiringSoon}</p>
          </div>
          
          <div className={`rounded-xl p-6 shadow-sm border ${themeClasses.stat.card}`}>
            <p className={`text-sm mb-1 ${themeClasses.stat.label}`}>{pageText.stats.totalItems[language]}</p>
            <p className="text-2xl font-bold text-blue-600">{stats.totalResources}</p>
          </div>
        </div>

        {/* Таблица ресурсов */}
        <div className={`rounded-xl shadow-sm border overflow-hidden ${themeClasses.card}`}>
          {error && (
            <div className={`p-4 border-b ${theme === 'dark' ? 'bg-red-900/20 border-red-800 text-red-400' : 'bg-red-50 border-red-200 text-red-700'}`}>
              <p>{error}</p>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={`border-b ${themeClasses.table.header}`}>
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    {pageText.table.resource[language]}
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    {pageText.table.category[language]}
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    {pageText.table.quantity[language]}
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    {pageText.table.price[language]}
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    {pageText.table.total[language]}
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    {pageText.table.status[language]}
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    {pageText.table.actions[language]}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {resources.map((resource) => (
                  <tr key={resource._id} className={`transition-colors ${themeClasses.table.row}`}>
                    <td className="px-6 py-4">
                      <p className={`text-sm font-medium ${themeClasses.text.primary}`}>{resource.name[language]}</p>
                      <p className={`text-xs ${themeClasses.text.muted}`}>{resource.location?.[language]}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm ${themeClasses.table.cell}`}>
                        {getCategoryName(resource.category)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleUpdateQuantity(resource._id, -10)}
                          className={`p-1 rounded transition-colors ${themeClasses.quantityButton}`}
                        >
                          <Minus size={14} />
                        </button>
                        <span className={`text-sm font-medium min-w-[60px] text-center ${themeClasses.text.primary}`}>
                          {resource.quantity} {resource.unit[language]}
                        </span>
                        <button 
                          onClick={() => handleUpdateQuantity(resource._id, 10)}
                          className={`p-1 rounded transition-colors ${themeClasses.quantityButton}`}
                        >
                          <PlusIcon size={14} />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm ${themeClasses.text.primary}`}>
                        {formatCurrency(resource.price)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-medium ${themeClasses.text.primary}`}>
                        {formatCurrency(resource.totalValue)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(resource.status)}`}>
                        {getStatusIcon(resource.status)}
                        {getStatusText(resource.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleDeleteResource(resource._id)}
                          className={`p-1 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-red-900/30' : 'hover:bg-red-100'}`}
                        >
                          <Trash2 size={16} className={theme === 'dark' ? 'text-red-400' : 'text-red-500'} />
                        </button>
                        <button className={`p-1 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                          <MoreVertical size={16} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {resources.length === 0 && !loading && (
            <div className="text-center py-12">
              <Package size={48} className={`mx-auto mb-4 ${themeClasses.text.muted}`} />
              <p className={themeClasses.text.secondary}>{pageText.noResources[language]}</p>
            </div>
          )}
        </div>

        {/* Модальное окно добавления ресурса */}
        {showAddModal && (
          <ResourceModal
            onClose={() => setShowAddModal(false)}
            onSave={handleAddResource}
            language={language}
            pageText={pageText}
            theme={theme}
            themeClasses={themeClasses}
          />
        )}
      </div>
    </div>
  );
};

// Компонент модального окна
const ResourceModal = ({ onClose, onSave, language, pageText, theme, themeClasses }) => {
  const [formData, setFormData] = useState({
    name: { ru: '', en: '', kg: '' },
    category: 'seeds',
    quantity: '',
    unit: { ru: 'кг', en: 'kg', kg: 'кг' },
    minStock: '',
    maxStock: '',
    price: '',
    supplier: { ru: '', en: '', kg: '' },
    expiryDate: '',
    location: { ru: '', en: '', kg: '' },
    notes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const dataToSend = {
      ...formData,
      quantity: Number(formData.quantity) || 0,
      minStock: Number(formData.minStock) || 0,
      maxStock: Number(formData.maxStock) || 100,
      price: Number(formData.price) || 0
    };
    
    console.log('📤 Отправка данных:', dataToSend);
    onSave(dataToSend);
  };

  return (
    <div className={`fixed inset-0 ${themeClasses.modal.overlay} flex items-center justify-center z-50 p-4`}>
      <div className={`rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border ${themeClasses.modal.content}`}>
        <div className={`p-6 border-b ${themeClasses.border} flex justify-between items-center sticky top-0 ${themeClasses.modal.content}`}>
          <h2 className={`text-xl font-semibold ${themeClasses.text.primary}`}>
            {pageText.modal.addTitle[language]}
          </h2>
          <button onClick={onClose} className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
            <X size={20} className={themeClasses.text.secondary} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className={`block text-sm font-medium mb-1 ${themeClasses.text.secondary}`}>
                {pageText.modal.nameRu[language]}
              </label>
              <input
                type="text"
                value={formData.name.ru}
                onChange={(e) => setFormData({
                  ...formData,
                  name: { ...formData.name, ru: e.target.value }
                })}
                className={`w-full px-4 py-2 border rounded-xl ${themeClasses.input}`}
                required
              />
            </div>
            
            <div className="col-span-2">
              <label className={`block text-sm font-medium mb-1 ${themeClasses.text.secondary}`}>
                {pageText.modal.nameEn[language]}
              </label>
              <input
                type="text"
                value={formData.name.en}
                onChange={(e) => setFormData({
                  ...formData,
                  name: { ...formData.name, en: e.target.value }
                })}
                className={`w-full px-4 py-2 border rounded-xl ${themeClasses.input}`}
                required
              />
            </div>
            
            <div className="col-span-2">
              <label className={`block text-sm font-medium mb-1 ${themeClasses.text.secondary}`}>
                {pageText.modal.nameKg[language]}
              </label>
              <input
                type="text"
                value={formData.name.kg}
                onChange={(e) => setFormData({
                  ...formData,
                  name: { ...formData.name, kg: e.target.value }
                })}
                className={`w-full px-4 py-2 border rounded-xl ${themeClasses.input}`}
                required
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${themeClasses.text.secondary}`}>
                {pageText.modal.category[language]}
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className={`w-full px-4 py-2 border rounded-xl ${themeClasses.input}`}
              >
                <option value="seeds">{pageText.categories.seeds[language]}</option>
                <option value="fertilizers">{pageText.categories.fertilizers[language]}</option>
                <option value="fuel">{pageText.categories.fuel[language]}</option>
                <option value="chemicals">{pageText.categories.chemicals[language]}</option>
                <option value="spareparts">{pageText.categories.spareparts[language]}</option>
                <option value="packaging">{pageText.categories.packaging[language]}</option>
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${themeClasses.text.secondary}`}>
                {pageText.modal.unit[language]}
              </label>
              <select
                value={formData.unit.ru}
                onChange={(e) => setFormData({
                  ...formData,
                  unit: { 
                    ru: e.target.value, 
                    en: e.target.value === 'кг' ? 'kg' : e.target.value === 'л' ? 'l' : e.target.value === 'шт' ? 'pcs' : 't', 
                    kg: e.target.value 
                  }
                })}
                className={`w-full px-4 py-2 border rounded-xl ${themeClasses.input}`}
              >
                <option value="кг">{pageText.units.kg[language]}</option>
                <option value="л">{pageText.units.l[language]}</option>
                <option value="шт">{pageText.units.pcs[language]}</option>
                <option value="т">{pageText.units.t[language]}</option>
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${themeClasses.text.secondary}`}>
                {pageText.modal.quantity[language]}
              </label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                className={`w-full px-4 py-2 border rounded-xl ${themeClasses.input}`}
                required
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${themeClasses.text.secondary}`}>
                {pageText.modal.price[language]}
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                className={`w-full px-4 py-2 border rounded-xl ${themeClasses.input}`}
                required
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${themeClasses.text.secondary}`}>
                {pageText.modal.minStock[language]}
              </label>
              <input
                type="number"
                value={formData.minStock}
                onChange={(e) => setFormData({...formData, minStock: e.target.value})}
                className={`w-full px-4 py-2 border rounded-xl ${themeClasses.input}`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${themeClasses.text.secondary}`}>
                {pageText.modal.maxStock[language]}
              </label>
              <input
                type="number"
                value={formData.maxStock}
                onChange={(e) => setFormData({...formData, maxStock: e.target.value})}
                className={`w-full px-4 py-2 border rounded-xl ${themeClasses.input}`}
              />
            </div>

            <div className="col-span-2">
              <label className={`block text-sm font-medium mb-1 ${themeClasses.text.secondary}`}>
                {pageText.modal.expiryDate[language]}
              </label>
              <input
                type="date"
                value={formData.expiryDate}
                onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                className={`w-full px-4 py-2 border rounded-xl ${themeClasses.input}`}
              />
            </div>
          </div>

          <div className={`flex justify-end gap-3 pt-4 border-t ${themeClasses.border}`}>
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 border rounded-xl transition-colors ${themeClasses.button.outline}`}
            >
              {pageText.modal.cancel[language]}
            </button>
            <button
              type="submit"
              className={`px-4 py-2 rounded-xl transition-colors ${themeClasses.button.primary}`}
            >
              {pageText.modal.add[language]}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Resources;