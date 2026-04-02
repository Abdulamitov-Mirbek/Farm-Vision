// client/src/pages/Suppliers.jsx
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext'; // ✅ Добавляем тему
import supplierAPI from '../services/api/supplierAPI';
import { 
  Truck, Plus, Edit2, Trash2, Eye,
  RefreshCw, Search, Package,
  Phone, Mail, MapPin, Star, X
} from 'lucide-react';

import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';

const Suppliers = () => {
  const { language } = useLanguage();
  const { theme } = useTheme(); // ✅ Получаем тему
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [stats, setStats] = useState({ total: 0, active: 0 });
  
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
      active: theme === 'dark'
        ? 'bg-green-900/30 border-green-800'
        : 'bg-green-50 border-green-100',
      categories: theme === 'dark'
        ? 'bg-purple-900/30 border-purple-800'
        : 'bg-purple-50 border-purple-100',
    },
    statText: {
      total: {
        label: theme === 'dark' ? 'text-blue-400' : 'text-blue-600',
        value: theme === 'dark' ? 'text-blue-300' : 'text-blue-800',
      },
      active: {
        label: theme === 'dark' ? 'text-green-400' : 'text-green-600',
        value: theme === 'dark' ? 'text-green-300' : 'text-green-800',
      },
      categories: {
        label: theme === 'dark' ? 'text-purple-400' : 'text-purple-600',
        value: theme === 'dark' ? 'text-purple-300' : 'text-purple-800',
      },
    },
    iconWrapper: {
      default: theme === 'dark'
        ? 'bg-gray-700 text-green-400'
        : 'bg-green-100 text-green-600',
      contact: theme === 'dark'
        ? 'bg-gray-700 text-gray-400'
        : 'bg-gray-100 text-gray-600',
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
      delete: 'hover:text-red-800',
      edit: 'hover:text-blue-800',
    },
    shadow: {
      card: theme === 'dark' 
        ? 'shadow-lg shadow-black/20' 
        : 'shadow-lg shadow-gray-200',
    },
    searchIcon: theme === 'dark' ? 'text-gray-500' : 'text-gray-400',
    badge: {
      active: theme === 'dark'
        ? 'bg-green-900/30 text-green-400 border border-green-800'
        : 'bg-green-100 text-green-800 border border-green-200',
      inactive: theme === 'dark'
        ? 'bg-gray-700 text-gray-400 border border-gray-600'
        : 'bg-gray-100 text-gray-800 border border-gray-200',
      blacklisted: theme === 'dark'
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
      view: theme === 'dark'
        ? 'text-gray-400 hover:text-gray-300'
        : 'text-gray-600 hover:text-gray-900',
      edit: theme === 'dark'
        ? 'text-blue-400 hover:text-blue-300'
        : 'text-blue-600 hover:text-blue-800',
      delete: theme === 'dark'
        ? 'text-red-400 hover:text-red-300'
        : 'text-red-600 hover:text-red-800',
    },
    ratingStar: theme === 'dark' ? 'text-yellow-400' : 'text-yellow-400',
    contactIcon: theme === 'dark' ? 'text-gray-500' : 'text-gray-400',
  };
  
  const [newSupplier, setNewSupplier] = useState({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    category: 'seeds',
    address: {
      city: '',
      region: ''
    },
    status: 'active'
  });

  // Переводы для страницы
  const pageText = {
    title: {
      ru: 'Поставщики',
      en: 'Suppliers',
      kg: 'Жеткирүүчүлөр'
    },
    subtitle: {
      ru: 'Управление поставщиками',
      en: 'Suppliers management',
      kg: 'Жеткирүүчүлөрдү башкаруу'
    },
    addButton: {
      ru: 'Добавить',
      en: 'Add',
      kg: 'Кошуу'
    },
    searchPlaceholder: {
      ru: 'Поиск поставщиков...',
      en: 'Search suppliers...',
      kg: 'Жеткирүүчүлөрдү издөө...'
    },
    stats: {
      total: {
        ru: 'Всего',
        en: 'Total',
        kg: 'Бардыгы'
      },
      active: {
        ru: 'Активные',
        en: 'Active',
        kg: 'Активдүү'
      },
      categories: {
        ru: 'Категорий',
        en: 'Categories',
        kg: 'Категориялар'
      }
    },
    filter: {
      all: {
        ru: 'Все',
        en: 'All',
        kg: 'Баары'
      },
      active: {
        ru: 'Активные',
        en: 'Active',
        kg: 'Активдүү'
      },
      inactive: {
        ru: 'Неактивные',
        en: 'Inactive',
        kg: 'Активдүү эмес'
      }
    },
    emptyState: {
      title: {
        ru: 'Нет поставщиков',
        en: 'No suppliers',
        kg: 'Жеткирүүчүлөр жок'
      },
      description: {
        ru: 'Добавьте первого поставщика',
        en: 'Add your first supplier',
        kg: 'Биринчи жеткирүүчүнү кошуңуз'
      }
    },
    status: {
      active: {
        ru: 'Активен',
        en: 'Active',
        kg: 'Активдүү'
      },
      inactive: {
        ru: 'Неактивен',
        en: 'Inactive',
        kg: 'Активдүү эмес'
      },
      blacklisted: {
        ru: 'Черный список',
        en: 'Blacklisted',
        kg: 'Кара тизме'
      }
    },
    modal: {
      add: {
        ru: 'Новый поставщик',
        en: 'New Supplier',
        kg: 'Жаңы жеткирүүчү'
      },
      edit: {
        ru: 'Редактировать поставщика',
        en: 'Edit Supplier',
        kg: 'Жеткирүүчүнү оңдоо'
      },
      delete: {
        ru: 'Удалить поставщика',
        en: 'Delete Supplier',
        kg: 'Жеткирүүчүнү өчүрүү'
      },
      confirmDelete: {
        ru: 'Удалить поставщика',
        en: 'Delete supplier',
        kg: 'Жеткирүүчүнү өчүрүү'
      },
      companyName: {
        ru: 'Название компании',
        en: 'Company name',
        kg: 'Компаниянын аталышы'
      },
      contactPerson: {
        ru: 'Контактное лицо',
        en: 'Contact person',
        kg: 'Байланыш адамы'
      },
      email: {
        ru: 'Email',
        en: 'Email',
        kg: 'Email'
      },
      phone: {
        ru: 'Телефон',
        en: 'Phone',
        kg: 'Телефон'
      },
      category: {
        ru: 'Категория',
        en: 'Category',
        kg: 'Категория'
      },
      city: {
        ru: 'Город',
        en: 'City',
        kg: 'Шаар'
      },
      region: {
        ru: 'Регион',
        en: 'Region',
        kg: 'Регион'
      },
      status: {
        ru: 'Статус',
        en: 'Status',
        kg: 'Статус'
      },
      cancel: {
        ru: 'Отмена',
        en: 'Cancel',
        kg: 'Жокко чыгаруу'
      },
      save: {
        ru: 'Сохранить',
        en: 'Save',
        kg: 'Сактоо'
      }
    },
    buttons: {
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
      }
    }
  };

  const categories = {
    seeds: { ru: 'Семена', en: 'Seeds', kg: 'Үрөндөр' },
    fertilizers: { ru: 'Удобрения', en: 'Fertilizers', kg: 'Жер семирткичтер' },
    equipment: { ru: 'Техника', en: 'Equipment', kg: 'Техника' },
    animals: { ru: 'Животные', en: 'Animals', kg: 'Жаныбарлар' },
    feed: { ru: 'Корма', en: 'Feed', kg: 'Тоют' },
    chemicals: { ru: 'Химикаты', en: 'Chemicals', kg: 'Химикаттар' },
    fuel: { ru: 'Топливо', en: 'Fuel', kg: 'Күйүүчү май' },
    services: { ru: 'Услуги', en: 'Services', kg: 'Кызматтар' },
    other: { ru: 'Другое', en: 'Other', kg: 'Башка' }
  };

  useEffect(() => {
    loadSuppliers();
  }, [filter]);

  const loadSuppliers = async () => {
    try {
      setLoading(true);
      const filters = {};
      if (filter !== 'all') filters.status = filter;
      
      const response = await supplierAPI.getAll(filters);
      setSuppliers(response.suppliers || []);
      setStats(response.stats || { total: 0, active: 0 });
    } catch (error) {
      console.error('Ошибка загрузки поставщиков:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSupplier = async () => {
    if (!newSupplier.name || !newSupplier.phone) {
      alert('Заполните обязательные поля');
      return;
    }

    try {
      await supplierAPI.create(newSupplier);
      setShowAddModal(false);
      loadSuppliers();
      resetForm();
    } catch (error) {
      console.error('Ошибка создания поставщика:', error);
    }
  };

  const handleEditClick = (supplier) => {
    setSelectedSupplier(supplier);
    setNewSupplier({
      name: supplier.name || '',
      contactPerson: supplier.contactPerson || '',
      email: supplier.email || '',
      phone: supplier.phone || '',
      category: supplier.category || 'seeds',
      address: {
        city: supplier.address?.city || '',
        region: supplier.address?.region || ''
      },
      status: supplier.status || 'active'
    });
    setShowEditModal(true);
  };

  const handleUpdateSupplier = async () => {
    if (!newSupplier.name || !newSupplier.phone) {
      alert('Заполните обязательные поля');
      return;
    }

    try {
      await supplierAPI.update(selectedSupplier._id, newSupplier);
      setShowEditModal(false);
      loadSuppliers();
      resetForm();
      setSelectedSupplier(null);
    } catch (error) {
      console.error('Ошибка обновления поставщика:', error);
    }
  };

  const handleDeleteSupplier = async (id, name) => {
    if (!window.confirm(`${pageText.modal.confirmDelete[language]} "${name}"?`)) return;
    
    try {
      await supplierAPI.delete(id);
      loadSuppliers();
    } catch (error) {
      console.error('Ошибка удаления поставщика:', error);
    }
  };

  const resetForm = () => {
    setNewSupplier({
      name: '',
      contactPerson: '',
      email: '',
      phone: '',
      category: 'seeds',
      address: { city: '', region: '' },
      status: 'active'
    });
    setSelectedSupplier(null);
  };

  const filteredSuppliers = suppliers.filter(sup => {
    if (searchTerm) {
      return sup.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
             sup.contactPerson?.toLowerCase().includes(searchTerm.toLowerCase()) ||
             sup.email?.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return true;
  });

  if (loading) {
    return (
      <div className={`flex items-center justify-center h-64 ${themeClasses.page}`}>
        <RefreshCw className={`animate-spin ${
          theme === 'dark' ? 'text-green-400' : 'text-green-600'
        }`} size={40} />
      </div>
    );
  }

  return (
    <div className={`p-6 transition-colors duration-300 ${themeClasses.page}`}>
      <div className="space-y-6">
        {/* Заголовок */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className={`text-2xl font-bold ${themeClasses.text.primary}`}>
              {pageText.title[language]}
            </h1>
            <p className={`mt-1 ${themeClasses.text.secondary}`}>
              {pageText.subtitle[language]}
            </p>
          </div>

          <div className="flex items-center space-x-3 mt-4 md:mt-0">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className={`px-3 py-2 rounded-lg border transition-colors ${themeClasses.select}`}
            >
              <option value="all">{pageText.filter.all[language]}</option>
              <option value="active">{pageText.filter.active[language]}</option>
              <option value="inactive">{pageText.filter.inactive[language]}</option>
            </select>

            <button
              className={`px-4 py-2 rounded-lg flex items-center ${themeClasses.button.primary}`}
              onClick={() => setShowAddModal(true)}
            >
              <Plus size={18} className="mr-2" />
              {pageText.addButton[language]}
            </button>
          </div>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`p-4 rounded-xl border ${themeClasses.statCard.total}`}>
            <p className={`text-sm ${themeClasses.statText.total.label}`}>
              {pageText.stats.total[language]}
            </p>
            <p className={`text-2xl font-bold ${themeClasses.statText.total.value}`}>
              {stats.total}
            </p>
          </div>
          <div className={`p-4 rounded-xl border ${themeClasses.statCard.active}`}>
            <p className={`text-sm ${themeClasses.statText.active.label}`}>
              {pageText.stats.active[language]}
            </p>
            <p className={`text-2xl font-bold ${themeClasses.statText.active.value}`}>
              {stats.active}
            </p>
          </div>
          <div className={`p-4 rounded-xl border ${themeClasses.statCard.categories}`}>
            <p className={`text-sm ${themeClasses.statText.categories.label}`}>
              {pageText.stats.categories[language]}
            </p>
            <p className={`text-2xl font-bold ${themeClasses.statText.categories.value}`}>
              {stats.byCategory?.length || 0}
            </p>
          </div>
        </div>

        {/* Поиск */}
        <div className="relative">
          <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${themeClasses.searchIcon}`} size={20} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={pageText.searchPlaceholder[language]}
            className={`w-full pl-10 pr-4 py-2 rounded-lg border transition-colors ${themeClasses.input}`}
          />
        </div>

        {/* Список поставщиков */}
        {filteredSuppliers.length === 0 ? (
          <div className={`p-12 rounded-xl border text-center ${themeClasses.card}`}>
            <Truck size={48} className={`mx-auto mb-4 ${themeClasses.emptyState.icon}`} />
            <h3 className={`text-lg font-semibold mb-2 ${themeClasses.text.primary}`}>
              {pageText.emptyState.title[language]}
            </h3>
            <p className={`mb-6 ${themeClasses.emptyState.text}`}>
              {pageText.emptyState.description[language]}
            </p>
            <button
              className={`px-4 py-2 rounded-lg inline-flex items-center ${themeClasses.button.primary}`}
              onClick={() => setShowAddModal(true)}
            >
              <Plus size={18} className="mr-2" />
              {pageText.addButton[language]}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSuppliers.map(sup => (
              <div 
                key={sup._id} 
                className={`p-6 rounded-xl border transition-all ${themeClasses.card} ${themeClasses.shadow.card} ${themeClasses.hover.card}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${themeClasses.iconWrapper.default}`}>
                      <Truck size={24} />
                    </div>
                    <div>
                      <h3 className={`font-semibold ${themeClasses.text.primary}`}>{sup.name}</h3>
                      {sup.contactPerson && (
                        <p className={`text-sm ${themeClasses.text.secondary}`}>{sup.contactPerson}</p>
                      )}
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${themeClasses.badge[sup.status] || themeClasses.badge.inactive}`}>
                    {sup.status === 'active' ? pageText.status.active[language] :
                     sup.status === 'inactive' ? pageText.status.inactive[language] :
                     pageText.status.blacklisted[language]}
                  </span>
                </div>

                {/* Кнопки быстрого действия под названием */}
                <div className="flex items-center space-x-2 mt-2 mb-3">
                  <button
                    onClick={() => handleDeleteSupplier(sup._id, sup.name)}
                    className={`text-sm flex items-center ${themeClasses.actionButton.delete}`}
                  >
                    <Trash2 size={16} className="mr-1" />
                    {pageText.buttons.delete[language]}
                  </button>
                  <button
                    onClick={() => handleEditClick(sup)}
                    className={`text-sm flex items-center ${themeClasses.actionButton.edit}`}
                  >
                    <Edit2 size={16} className="mr-1" />
                    {pageText.buttons.edit[language]}
                  </button>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <Package size={14} className={`mr-2 ${themeClasses.contactIcon}`} />
                    <span className={themeClasses.text.secondary}>
                      {categories[sup.category]?.[language] || sup.category}
                    </span>
                  </div>
                  {sup.email && (
                    <div className="flex items-center">
                      <Mail size={14} className={`mr-2 ${themeClasses.contactIcon}`} />
                      <span className={themeClasses.text.secondary}>{sup.email}</span>
                    </div>
                  )}
                  <div className="flex items-center">
                    <Phone size={14} className={`mr-2 ${themeClasses.contactIcon}`} />
                    <span className={themeClasses.text.secondary}>{sup.phone}</span>
                  </div>
                  {sup.address?.city && (
                    <div className="flex items-center">
                      <MapPin size={14} className={`mr-2 ${themeClasses.contactIcon}`} />
                      <span className={themeClasses.text.secondary}>{sup.address.city}</span>
                    </div>
                  )}
                  {sup.rating && (
                    <div className="flex items-center">
                      <Star size={14} className={`mr-2 ${themeClasses.ratingStar}`} />
                      <span className={themeClasses.text.secondary}>{sup.rating}/5</span>
                    </div>
                  )}
                </div>

                {/* Кнопки действий внизу карточки */}
                <div className="flex justify-end space-x-2 mt-4 pt-4 border-t">
                  <button
                    className={`p-2 rounded-lg transition-colors ${themeClasses.actionButton.view}`}
                    title={pageText.buttons.view[language]}
                    onClick={() => {/* view details */}}
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    className={`p-2 rounded-lg transition-colors ${themeClasses.actionButton.edit}`}
                    title={pageText.buttons.edit[language]}
                    onClick={() => handleEditClick(sup)}
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    className={`p-2 rounded-lg transition-colors ${themeClasses.actionButton.delete}`}
                    title={pageText.buttons.delete[language]}
                    onClick={() => handleDeleteSupplier(sup._id, sup.name)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Модальное окно добавления */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/50" onClick={() => {
              setShowAddModal(false);
              resetForm();
            }}></div>
            <div className={`relative w-full max-w-2xl rounded-xl border ${themeClasses.modal.content} p-6`}>
              <h3 className={`text-xl font-semibold mb-4 ${themeClasses.text.primary}`}>
                {pageText.modal.add[language]}
              </h3>
              
              <SupplierForm 
                newSupplier={newSupplier}
                setNewSupplier={setNewSupplier}
                language={language}
                pageText={pageText}
                categories={categories}
                themeClasses={themeClasses}
              />
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  className={`px-4 py-2 rounded-lg border transition-colors ${themeClasses.button.secondary}`}
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                >
                  {pageText.modal.cancel[language]}
                </button>
                <button
                  className={`px-4 py-2 rounded-lg flex items-center ${themeClasses.button.primary}`}
                  onClick={handleCreateSupplier}
                >
                  <Plus size={18} className="mr-2" />
                  {pageText.addButton[language]}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Модальное окно редактирования */}
        {showEditModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/50" onClick={() => {
              setShowEditModal(false);
              resetForm();
            }}></div>
            <div className={`relative w-full max-w-2xl rounded-xl border ${themeClasses.modal.content} p-6`}>
              <h3 className={`text-xl font-semibold mb-4 ${themeClasses.text.primary}`}>
                {pageText.modal.edit[language]}
              </h3>
              
              <SupplierForm 
                newSupplier={newSupplier}
                setNewSupplier={setNewSupplier}
                language={language}
                pageText={pageText}
                categories={categories}
                themeClasses={themeClasses}
              />
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  className={`px-4 py-2 rounded-lg border transition-colors ${themeClasses.button.secondary}`}
                  onClick={() => {
                    setShowEditModal(false);
                    resetForm();
                  }}
                >
                  {pageText.modal.cancel[language]}
                </button>
                <button
                  className={`px-4 py-2 rounded-lg flex items-center ${themeClasses.button.primary}`}
                  onClick={handleUpdateSupplier}
                >
                  <Edit2 size={18} className="mr-2" />
                  {pageText.modal.save[language]}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Компонент формы для поставщика
const SupplierForm = ({ newSupplier, setNewSupplier, language, pageText, categories, themeClasses }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className={`block text-sm font-medium mb-2 ${themeClasses.label}`}>
          {pageText.modal.companyName[language]} *
        </label>
        <input
          className={`w-full px-4 py-2 rounded-lg border transition-colors ${themeClasses.input}`}
          value={newSupplier.name}
          onChange={(e) => setNewSupplier({...newSupplier, name: e.target.value})}
          placeholder="ООО АгроСнаб"
        />
      </div>

      <div>
        <label className={`block text-sm font-medium mb-2 ${themeClasses.label}`}>
          {pageText.modal.contactPerson[language]}
        </label>
        <input
          className={`w-full px-4 py-2 rounded-lg border transition-colors ${themeClasses.input}`}
          value={newSupplier.contactPerson}
          onChange={(e) => setNewSupplier({...newSupplier, contactPerson: e.target.value})}
          placeholder="Иван Иванов"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={`block text-sm font-medium mb-2 ${themeClasses.label}`}>
            {pageText.modal.email[language]}
          </label>
          <input
            type="email"
            className={`w-full px-4 py-2 rounded-lg border transition-colors ${themeClasses.input}`}
            value={newSupplier.email}
            onChange={(e) => setNewSupplier({...newSupplier, email: e.target.value})}
            placeholder="info@agro.kg"
          />
        </div>
        <div>
          <label className={`block text-sm font-medium mb-2 ${themeClasses.label}`}>
            {pageText.modal.phone[language]} *
          </label>
          <input
            className={`w-full px-4 py-2 rounded-lg border transition-colors ${themeClasses.input}`}
            value={newSupplier.phone}
            onChange={(e) => setNewSupplier({...newSupplier, phone: e.target.value})}
            placeholder="+996 555 123 456"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={`block text-sm font-medium mb-2 ${themeClasses.label}`}>
            {pageText.modal.category[language]}
          </label>
          <select
            className={`w-full px-4 py-2 rounded-lg border transition-colors ${themeClasses.select}`}
            value={newSupplier.category}
            onChange={(e) => setNewSupplier({...newSupplier, category: e.target.value})}
          >
            {Object.keys(categories).map(key => (
              <option key={key} value={key}>
                {categories[key][language]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${themeClasses.label}`}>
            {pageText.modal.status[language]}
          </label>
          <select
            className={`w-full px-4 py-2 rounded-lg border transition-colors ${themeClasses.select}`}
            value={newSupplier.status}
            onChange={(e) => setNewSupplier({...newSupplier, status: e.target.value})}
          >
            <option value="active">{pageText.status.active[language]}</option>
            <option value="inactive">{pageText.status.inactive[language]}</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={`block text-sm font-medium mb-2 ${themeClasses.label}`}>
            {pageText.modal.city[language]}
          </label>
          <input
            className={`w-full px-4 py-2 rounded-lg border transition-colors ${themeClasses.input}`}
            value={newSupplier.address.city}
            onChange={(e) => setNewSupplier({
              ...newSupplier,
              address: { ...newSupplier.address, city: e.target.value }
            })}
            placeholder="Бишкек"
          />
        </div>
        <div>
          <label className={`block text-sm font-medium mb-2 ${themeClasses.label}`}>
            {pageText.modal.region[language]}
          </label>
          <input
            className={`w-full px-4 py-2 rounded-lg border transition-colors ${themeClasses.input}`}
            value={newSupplier.address.region}
            onChange={(e) => setNewSupplier({
              ...newSupplier,
              address: { ...newSupplier.address, region: e.target.value }
            })}
            placeholder="Чуйская область"
          />
        </div>
      </div>
    </div>
  );
};

export default Suppliers;