// src/pages/Equipment.jsx
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext'; // ✅ Добавляем тему
import equipmentAPI from '../services/api/equipmentAPI';
import { 
  Tractor, Plus, Edit2, Trash2, Eye,
  RefreshCw, Search, Wrench, Fuel,
  Calendar, Clock, Settings, Truck, Save, X
} from 'lucide-react';

import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';

const Equipment = () => {
  const { language } = useLanguage();
  const { theme } = useTheme(); // ✅ Получаем тему
  
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    inUse: 0,
    maintenance: 0
  });
  
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
      available: theme === 'dark'
        ? 'bg-green-900/30 border-green-800'
        : 'bg-green-50 border-green-100',
      inUse: theme === 'dark'
        ? 'bg-purple-900/30 border-purple-800'
        : 'bg-purple-50 border-purple-100',
      maintenance: theme === 'dark'
        ? 'bg-yellow-900/30 border-yellow-800'
        : 'bg-yellow-50 border-yellow-100',
    },
    statText: {
      total: {
        label: theme === 'dark' ? 'text-blue-400' : 'text-blue-600',
        value: theme === 'dark' ? 'text-blue-300' : 'text-blue-800',
      },
      available: {
        label: theme === 'dark' ? 'text-green-400' : 'text-green-600',
        value: theme === 'dark' ? 'text-green-300' : 'text-green-800',
      },
      inUse: {
        label: theme === 'dark' ? 'text-purple-400' : 'text-purple-600',
        value: theme === 'dark' ? 'text-purple-300' : 'text-purple-800',
      },
      maintenance: {
        label: theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600',
        value: theme === 'dark' ? 'text-yellow-300' : 'text-yellow-800',
      },
    },
    iconWrapper: theme === 'dark'
      ? 'bg-gray-700 text-green-400'
      : 'bg-green-100 text-green-600',
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
      available: theme === 'dark'
        ? 'bg-green-900/30 text-green-400 border border-green-800'
        : 'bg-green-100 text-green-800 border border-green-200',
      inUse: theme === 'dark'
        ? 'bg-blue-900/30 text-blue-400 border border-blue-800'
        : 'bg-blue-100 text-blue-800 border border-blue-200',
      maintenance: theme === 'dark'
        ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-800'
        : 'bg-yellow-100 text-yellow-800 border border-yellow-200',
      broken: theme === 'dark'
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
  };
  
  const [formData, setFormData] = useState({
    name: '',
    type: 'tractor',
    model: '',
    year: new Date().getFullYear(),
    status: 'available',
    fuelType: 'diesel',
    fuelConsumption: '',
    lastMaintenance: new Date().toISOString().split('T')[0],
    nextMaintenance: '',
    notes: '',
    image: null
  });

  // Переводы для страницы
  const pageText = {
    title: {
      ru: 'Техника',
      en: 'Equipment',
      kg: 'Техника'
    },
    subtitle: {
      ru: 'Управление сельскохозяйственной техникой',
      en: 'Agricultural equipment management',
      kg: 'Айыл чарба техникасын башкаруу'
    },
    addButton: {
      ru: 'Добавить технику',
      en: 'Add equipment',
      kg: 'Техника кошуу'
    },
    searchPlaceholder: {
      ru: 'Поиск техники...',
      en: 'Search equipment...',
      kg: 'Техника издөө...'
    },
    stats: {
      total: {
        ru: 'Всего единиц',
        en: 'Total units',
        kg: 'Бардыгы'
      },
      available: {
        ru: 'Доступно',
        en: 'Available',
        kg: 'Жеткиликтүү'
      },
      inUse: {
        ru: 'В работе',
        en: 'In use',
        kg: 'Иште'
      },
      maintenance: {
        ru: 'На ремонте',
        en: 'Maintenance',
        kg: 'Ремонтто'
      }
    },
    filter: {
      all: {
        ru: 'Вся техника',
        en: 'All equipment',
        kg: 'Бардык техника'
      },
      available: {
        ru: 'Доступная',
        en: 'Available',
        kg: 'Жеткиликтүү'
      },
      inUse: {
        ru: 'В работе',
        en: 'In use',
        kg: 'Иште'
      },
      maintenance: {
        ru: 'На ремонте',
        en: 'Maintenance',
        kg: 'Ремонтто'
      }
    },
    emptyState: {
      title: {
        ru: 'Нет техники',
        en: 'No equipment',
        kg: 'Техника жок'
      },
      description: {
        ru: 'Добавьте первую единицу техники',
        en: 'Add your first equipment',
        kg: 'Биринчи техниканы кошуңуз'
      }
    },
    status: {
      available: {
        ru: 'Доступна',
        en: 'Available',
        kg: 'Жеткиликтүү'
      },
      inUse: {
        ru: 'В работе',
        en: 'In use',
        kg: 'Иште'
      },
      maintenance: {
        ru: 'На ремонте',
        en: 'Maintenance',
        kg: 'Ремонтто'
      },
      broken: {
        ru: 'Сломана',
        en: 'Broken',
        kg: 'Бузулган'
      }
    },
    types: {
      tractor: {
        ru: 'Трактор',
        en: 'Tractor',
        kg: 'Трактор'
      },
      harvester: {
        ru: 'Комбайн',
        en: 'Harvester',
        kg: 'Комбайн'
      },
      plow: {
        ru: 'Плуг',
        en: 'Plow',
        kg: 'Плуг'
      },
      seeder: {
        ru: 'Сеялка',
        en: 'Seeder',
        kg: 'Сеялка'
      },
      sprayer: {
        ru: 'Опрыскиватель',
        en: 'Sprayer',
        kg: 'Опрыскиватель'
      },
      truck: {
        ru: 'Грузовик',
        en: 'Truck',
        kg: 'Жүк ташуучу'
      },
      other: {
        ru: 'Другое',
        en: 'Other',
        kg: 'Башка'
      }
    },
    fuelTypes: {
      diesel: {
        ru: 'Дизель',
        en: 'Diesel',
        kg: 'Дизель'
      },
      petrol: {
        ru: 'Бензин',
        en: 'Petrol',
        kg: 'Бензин'
      },
      electric: {
        ru: 'Электро',
        en: 'Electric',
        kg: 'Электр'
      },
      hybrid: {
        ru: 'Гибрид',
        en: 'Hybrid',
        kg: 'Гибрид'
      }
    },
    modal: {
      add: {
        ru: 'Новая техника',
        en: 'New equipment',
        kg: 'Жаңы техника'
      },
      edit: {
        ru: 'Редактировать технику',
        en: 'Edit equipment',
        kg: 'Техниканы оңдоо'
      },
      confirmDelete: {
        ru: 'Удалить технику',
        en: 'Delete equipment',
        kg: 'Техниканы өчүрүү'
      },
      name: {
        ru: 'Название',
        en: 'Name',
        kg: 'Аталышы'
      },
      type: {
        ru: 'Тип',
        en: 'Type',
        kg: 'Түрү'
      },
      model: {
        ru: 'Модель',
        en: 'Model',
        kg: 'Модели'
      },
      year: {
        ru: 'Год выпуска',
        en: 'Year',
        kg: 'Чыгарылган жылы'
      },
      status: {
        ru: 'Статус',
        en: 'Status',
        kg: 'Статус'
      },
      fuelType: {
        ru: 'Тип топлива',
        en: 'Fuel type',
        kg: 'Күйүүчү май түрү'
      },
      fuelConsumption: {
        ru: 'Расход топлива',
        en: 'Fuel consumption',
        kg: 'Күйүүчү май чыгымы'
      },
      lastMaintenance: {
        ru: 'Последнее ТО',
        en: 'Last maintenance',
        kg: 'Акыркы ТО'
      },
      nextMaintenance: {
        ru: 'Следующее ТО',
        en: 'Next maintenance',
        kg: 'Кийинки ТО'
      },
      notes: {
        ru: 'Заметки',
        en: 'Notes',
        kg: 'Эскертүүлөр'
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
      },
      update: {
        ru: 'Обновить',
        en: 'Update',
        kg: 'Жаңыртуу'
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

  useEffect(() => {
    loadEquipment();
  }, [filter]);

  const loadEquipment = async () => {
    try {
      setLoading(true);
      const filters = {};
      if (filter !== 'all') filters.status = filter;
      
      const response = await equipmentAPI.getAll(filters);
      setEquipment(response.equipment || []);
      
      // Обновляем статистику
      const equipmentList = response.equipment || [];
      setStats({
        total: equipmentList.length,
        available: equipmentList.filter(e => e.status === 'available').length,
        inUse: equipmentList.filter(e => e.status === 'inUse').length,
        maintenance: equipmentList.filter(e => e.status === 'maintenance').length
      });
    } catch (error) {
      console.error('Ошибка загрузки техники:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEquipment = async () => {
    if (!formData.name) {
      alert(pageText.modal.name[language] + ' - обязательное поле');
      return;
    }

    try {
      await equipmentAPI.create(formData);
      setShowAddModal(false);
      loadEquipment();
      resetForm();
    } catch (error) {
      console.error('Ошибка добавления техники:', error);
    }
  };

  const handleEditClick = (item) => {
    setSelectedEquipment(item);
    setFormData({
      name: item.name || '',
      type: item.type || 'tractor',
      model: item.model || '',
      year: item.year || new Date().getFullYear(),
      status: item.status || 'available',
      fuelType: item.fuelType || 'diesel',
      fuelConsumption: item.fuelConsumption || '',
      lastMaintenance: item.lastMaintenance ? item.lastMaintenance.split('T')[0] : new Date().toISOString().split('T')[0],
      nextMaintenance: item.nextMaintenance ? item.nextMaintenance.split('T')[0] : '',
      notes: item.notes || '',
      image: item.image || null
    });
    setShowEditModal(true);
  };

  const handleUpdateEquipment = async () => {
    if (!formData.name) {
      alert(pageText.modal.name[language] + ' - обязательное поле');
      return;
    }

    try {
      await equipmentAPI.update(selectedEquipment._id, formData);
      setShowEditModal(false);
      loadEquipment();
      resetForm();
      setSelectedEquipment(null);
    } catch (error) {
      console.error('Ошибка обновления техники:', error);
    }
  };

  const handleDeleteEquipment = async (id, name) => {
    if (!window.confirm(`${pageText.modal.confirmDelete[language]} "${name}"?`)) return;

    try {
      await equipmentAPI.delete(id);
      loadEquipment();
    } catch (error) {
      console.error('Ошибка удаления техники:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'tractor',
      model: '',
      year: new Date().getFullYear(),
      status: 'available',
      fuelType: 'diesel',
      fuelConsumption: '',
      lastMaintenance: new Date().toISOString().split('T')[0],
      nextMaintenance: '',
      notes: '',
      image: null
    });
    setSelectedEquipment(null);
  };

  const filteredEquipment = equipment.filter(item => {
    if (searchTerm) {
      return item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
             item.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
             item.notes?.toLowerCase().includes(searchTerm.toLowerCase());
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
              <option value="available">{pageText.filter.available[language]}</option>
              <option value="inUse">{pageText.filter.inUse[language]}</option>
              <option value="maintenance">{pageText.filter.maintenance[language]}</option>
            </select>

            <button
              className={`px-4 py-2 rounded-lg flex items-center ${themeClasses.button.primary}`}
              onClick={() => {
                resetForm();
                setShowAddModal(true);
              }}
            >
              <Plus size={18} className="mr-2" />
              {pageText.addButton[language]}
            </button>
          </div>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className={`p-4 rounded-xl border ${themeClasses.statCard.total}`}>
            <p className={`text-sm ${themeClasses.statText.total.label}`}>
              {pageText.stats.total[language]}
            </p>
            <p className={`text-2xl font-bold ${themeClasses.statText.total.value}`}>
              {stats.total}
            </p>
          </div>
          <div className={`p-4 rounded-xl border ${themeClasses.statCard.available}`}>
            <p className={`text-sm ${themeClasses.statText.available.label}`}>
              {pageText.stats.available[language]}
            </p>
            <p className={`text-2xl font-bold ${themeClasses.statText.available.value}`}>
              {stats.available}
            </p>
          </div>
          <div className={`p-4 rounded-xl border ${themeClasses.statCard.inUse}`}>
            <p className={`text-sm ${themeClasses.statText.inUse.label}`}>
              {pageText.stats.inUse[language]}
            </p>
            <p className={`text-2xl font-bold ${themeClasses.statText.inUse.value}`}>
              {stats.inUse}
            </p>
          </div>
          <div className={`p-4 rounded-xl border ${themeClasses.statCard.maintenance}`}>
            <p className={`text-sm ${themeClasses.statText.maintenance.label}`}>
              {pageText.stats.maintenance[language]}
            </p>
            <p className={`text-2xl font-bold ${themeClasses.statText.maintenance.value}`}>
              {stats.maintenance}
            </p>
          </div>
        </div>

        {/* Поиск */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${themeClasses.searchIcon}`} size={20} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={pageText.searchPlaceholder[language]}
              className={`w-full pl-10 pr-4 py-2 rounded-lg border transition-colors ${themeClasses.input}`}
            />
          </div>
        </div>

        {/* Список техники */}
        {filteredEquipment.length === 0 ? (
          <div className={`p-12 rounded-xl border text-center ${themeClasses.card}`}>
            <Tractor size={48} className={`mx-auto mb-4 ${themeClasses.emptyState.icon}`} />
            <h3 className={`text-lg font-semibold mb-2 ${themeClasses.text.primary}`}>
              {pageText.emptyState.title[language]}
            </h3>
            <p className={`mb-6 ${themeClasses.emptyState.text}`}>
              {pageText.emptyState.description[language]}
            </p>
            <button
              className={`px-4 py-2 rounded-lg inline-flex items-center ${themeClasses.button.primary}`}
              onClick={() => {
                resetForm();
                setShowAddModal(true);
              }}
            >
              <Plus size={18} className="mr-2" />
              {pageText.addButton[language]}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEquipment.map(item => (
              <div 
                key={item._id} 
                className={`p-6 rounded-xl border transition-all ${themeClasses.card} ${themeClasses.shadow.card} ${themeClasses.hover.card}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${themeClasses.iconWrapper}`}>
                      {item.type === 'tractor' && <Tractor size={24} />}
                      {item.type === 'harvester' && <Settings size={24} />}
                      {item.type === 'truck' && <Truck size={24} />}
                      {(item.type === 'plow' || item.type === 'seeder' || item.type === 'sprayer') && 
                        <Wrench size={24} />
                      }
                    </div>
                    <div>
                      <h3 className={`font-semibold ${themeClasses.text.primary}`}>{item.name}</h3>
                      <p className={`text-sm ${themeClasses.text.secondary}`}>
                        {pageText.types[item.type]?.[language] || item.type} • {item.model}
                      </p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${themeClasses.badge[item.status] || themeClasses.badge.available}`}>
                    {pageText.status[item.status]?.[language] || item.status}
                  </span>
                </div>

                {/* Детали */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <Fuel size={14} className={`mr-2 ${themeClasses.text.muted}`} />
                    <span className={themeClasses.text.secondary}>
                      {pageText.fuelTypes[item.fuelType]?.[language] || item.fuelType} • {item.fuelConsumption}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Calendar size={14} className={`mr-2 ${themeClasses.text.muted}`} />
                    <span className={themeClasses.text.secondary}>
                      {new Date(item.lastMaintenance).toLocaleDateString()}
                    </span>
                  </div>
                  {item.nextMaintenance && (
                    <div className="flex items-center">
                      <Clock size={14} className={`mr-2 ${themeClasses.text.muted}`} />
                      <span className={`font-medium ${
                        theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'
                      }`}>
                        {new Date(item.nextMaintenance).toLocaleDateString()}
                      </span>
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
                    onClick={() => handleEditClick(item)}
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    className={`p-2 rounded-lg transition-colors ${themeClasses.actionButton.delete}`}
                    title={pageText.buttons.delete[language]}
                    onClick={() => handleDeleteEquipment(item._id, item.name)}
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
              
              <EquipmentForm 
                formData={formData}
                setFormData={setFormData}
                language={language}
                pageText={pageText}
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
                  onClick={handleAddEquipment}
                >
                  <Save size={18} className="mr-2" />
                  {pageText.modal.save[language]}
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
              
              <EquipmentForm 
                formData={formData}
                setFormData={setFormData}
                language={language}
                pageText={pageText}
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
                  onClick={handleUpdateEquipment}
                >
                  <Save size={18} className="mr-2" />
                  {pageText.modal.update[language]}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Компонент формы для техники
const EquipmentForm = ({ formData, setFormData, language, pageText, themeClasses }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className={`block text-sm font-medium mb-2 ${themeClasses.label}`}>
            {pageText.modal.name[language]} *
          </label>
          <input 
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            placeholder={pageText.modal.name[language]} 
            className={`w-full px-4 py-2 rounded-lg border transition-colors ${themeClasses.input}`}
          />
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${themeClasses.label}`}>
            {pageText.modal.type[language]}
          </label>
          <select 
            value={formData.type}
            onChange={(e) => setFormData({...formData, type: e.target.value})}
            className={`w-full px-4 py-2 rounded-lg border transition-colors ${themeClasses.select}`}
          >
            {Object.entries(pageText.types).map(([key, value]) => (
              <option key={key} value={key}>{value[language]}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${themeClasses.label}`}>
            {pageText.modal.model[language]}
          </label>
          <input 
            value={formData.model}
            onChange={(e) => setFormData({...formData, model: e.target.value})}
            placeholder={pageText.modal.model[language]} 
            className={`w-full px-4 py-2 rounded-lg border transition-colors ${themeClasses.input}`}
          />
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${themeClasses.label}`}>
            {pageText.modal.year[language]}
          </label>
          <input 
            type="number"
            value={formData.year}
            onChange={(e) => setFormData({...formData, year: parseInt(e.target.value)})}
            placeholder="2024" 
            className={`w-full px-4 py-2 rounded-lg border transition-colors ${themeClasses.input}`}
          />
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${themeClasses.label}`}>
            {pageText.modal.status[language]}
          </label>
          <select 
            value={formData.status}
            onChange={(e) => setFormData({...formData, status: e.target.value})}
            className={`w-full px-4 py-2 rounded-lg border transition-colors ${themeClasses.select}`}
          >
            {Object.entries(pageText.status).map(([key, value]) => (
              <option key={key} value={key}>{value[language]}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${themeClasses.label}`}>
            {pageText.modal.fuelType[language]}
          </label>
          <select 
            value={formData.fuelType}
            onChange={(e) => setFormData({...formData, fuelType: e.target.value})}
            className={`w-full px-4 py-2 rounded-lg border transition-colors ${themeClasses.select}`}
          >
            {Object.entries(pageText.fuelTypes).map(([key, value]) => (
              <option key={key} value={key}>{value[language]}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${themeClasses.label}`}>
            {pageText.modal.fuelConsumption[language]}
          </label>
          <input 
            value={formData.fuelConsumption}
            onChange={(e) => setFormData({...formData, fuelConsumption: e.target.value})}
            placeholder="л/час" 
            className={`w-full px-4 py-2 rounded-lg border transition-colors ${themeClasses.input}`}
          />
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${themeClasses.label}`}>
            {pageText.modal.lastMaintenance[language]}
          </label>
          <input 
            type="date"
            value={formData.lastMaintenance}
            onChange={(e) => setFormData({...formData, lastMaintenance: e.target.value})}
            className={`w-full px-4 py-2 rounded-lg border transition-colors ${themeClasses.input}`}
          />
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${themeClasses.label}`}>
            {pageText.modal.nextMaintenance[language]}
          </label>
          <input 
            type="date"
            value={formData.nextMaintenance}
            onChange={(e) => setFormData({...formData, nextMaintenance: e.target.value})}
            className={`w-full px-4 py-2 rounded-lg border transition-colors ${themeClasses.input}`}
          />
        </div>

        <div className="col-span-2">
          <label className={`block text-sm font-medium mb-2 ${themeClasses.label}`}>
            {pageText.modal.notes[language]}
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
            rows="3"
            className={`w-full px-4 py-2 rounded-lg border transition-colors ${themeClasses.input}`}
            placeholder={pageText.modal.notes[language]}
          />
        </div>
      </div>
    </div>
  );
};

export default Equipment;