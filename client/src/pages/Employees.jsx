// client/src/pages/Employees.jsx
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext'; // ✅ Добавляем тему
import employeeAPI from '../services/api/employeeAPI';
import { 
  Users, Plus, Edit2, Trash2, Eye,
  RefreshCw, Search, Briefcase,
  Phone, Mail, MapPin, Calendar, Award, X
} from 'lucide-react';

import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';

const Employees = () => {
  const { language } = useLanguage();
  const { theme } = useTheme(); // ✅ Получаем тему
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [stats, setStats] = useState({ total: 0, active: 0, onLeave: 0 });

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
      onLeave: theme === 'dark'
        ? 'bg-yellow-900/30 border-yellow-800'
        : 'bg-yellow-50 border-yellow-100',
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
      onLeave: {
        label: theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600',
        value: theme === 'dark' ? 'text-yellow-300' : 'text-yellow-800',
      },
    },
    avatar: {
      bg: theme === 'dark'
        ? 'bg-gray-700 text-green-400'
        : 'bg-green-100 text-green-600',
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
      'on-leave': theme === 'dark'
        ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-800'
        : 'bg-yellow-100 text-yellow-800 border border-yellow-200',
      terminated: theme === 'dark'
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
    icon: {
      default: theme === 'dark' ? 'text-gray-500' : 'text-gray-400',
    },
  };

  const [newEmployee, setNewEmployee] = useState({
    firstName: '',
    lastName: '',
    position: '',
    department: 'field',
    email: '',
    phone: '',
    hireDate: new Date().toISOString().split('T')[0],
    employmentType: 'full-time',
    status: 'active'
  });

  // Переводы для страницы
  const pageText = {
    title: {
      ru: 'Сотрудники',
      en: 'Employees',
      kg: 'Кызматкерлер'
    },
    subtitle: {
      ru: 'Управление персоналом фермы',
      en: 'Farm staff management',
      kg: 'Ферма кызматкерлерин башкаруу'
    },
    addButton: {
      ru: 'Добавить',
      en: 'Add',
      kg: 'Кошуу'
    },
    searchPlaceholder: {
      ru: 'Поиск сотрудников...',
      en: 'Search employees...',
      kg: 'Кызматкерлерди издөө...'
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
      onLeave: {
        ru: 'В отпуске',
        en: 'On leave',
        kg: 'Өргүүдө'
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
      onLeave: {
        ru: 'В отпуске',
        en: 'On leave',
        kg: 'Өргүүдө'
      }
    },
    emptyState: {
      title: {
        ru: 'Нет сотрудников',
        en: 'No employees',
        kg: 'Кызматкерлер жок'
      },
      description: {
        ru: 'Добавьте первого сотрудника',
        en: 'Add your first employee',
        kg: 'Биринчи кызматкерди кошуңуз'
      }
    },
    status: {
      active: {
        ru: 'Активен',
        en: 'Active',
        kg: 'Активдүү'
      },
      onLeave: {
        ru: 'В отпуске',
        en: 'On leave',
        kg: 'Өргүүдө'
      },
      terminated: {
        ru: 'Уволен',
        en: 'Terminated',
        kg: 'Жумуштан бошотулган'
      }
    },
    departments: {
      field: {
        ru: 'Полевые работы',
        en: 'Field work',
        kg: 'Талаа иштери'
      },
      livestock: {
        ru: 'Животноводство',
        en: 'Livestock',
        kg: 'Мал чарбасы'
      },
      equipment: {
        ru: 'Техника',
        en: 'Equipment',
        kg: 'Техника'
      },
      management: {
        ru: 'Управление',
        en: 'Management',
        kg: 'Башкаруу'
      },
      other: {
        ru: 'Другое',
        en: 'Other',
        kg: 'Башка'
      }
    },
    employmentTypes: {
      'full-time': {
        ru: 'Полный день',
        en: 'Full-time',
        kg: 'Толук күн'
      },
      'part-time': {
        ru: 'Частичная занятость',
        en: 'Part-time',
        kg: 'Жарым-жартылай'
      },
      'seasonal': {
        ru: 'Сезонный',
        en: 'Seasonal',
        kg: 'Сезондук'
      },
      'contractor': {
        ru: 'Подрядчик',
        en: 'Contractor',
        kg: 'Подрядчик'
      }
    },
    modal: {
      add: {
        ru: 'Новый сотрудник',
        en: 'New Employee',
        kg: 'Жаңы кызматкер'
      },
      edit: {
        ru: 'Редактировать сотрудника',
        en: 'Edit Employee',
        kg: 'Кызматкерди оңдоо'
      },
      confirmDelete: {
        ru: 'Удалить сотрудника',
        en: 'Delete employee',
        kg: 'Кызматкерди өчүрүү'
      },
      firstName: {
        ru: 'Имя',
        en: 'First name',
        kg: 'Аты'
      },
      lastName: {
        ru: 'Фамилия',
        en: 'Last name',
        kg: 'Фамилиясы'
      },
      position: {
        ru: 'Должность',
        en: 'Position',
        kg: 'Кызматы'
      },
      department: {
        ru: 'Отдел',
        en: 'Department',
        kg: 'Бөлүм'
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
      hireDate: {
        ru: 'Дата найма',
        en: 'Hire date',
        kg: 'Ишке алынган дата'
      },
      employmentType: {
        ru: 'Тип занятости',
        en: 'Employment type',
        kg: 'Иш менен камсыздоо түрү'
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

  useEffect(() => {
    loadEmployees();
  }, [filter]);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const filters = {};
      if (filter !== 'all') filters.status = filter;
      
      const response = await employeeAPI.getAll(filters);
      setEmployees(response.employees || []);
      setStats(response.stats || { total: 0, active: 0, onLeave: 0 });
    } catch (error) {
      console.error('Ошибка загрузки сотрудников:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEmployee = async () => {
    if (!newEmployee.firstName || !newEmployee.lastName || !newEmployee.position) {
      alert('Заполните обязательные поля');
      return;
    }

    try {
      await employeeAPI.create(newEmployee);
      setShowAddModal(false);
      loadEmployees();
      resetForm();
    } catch (error) {
      console.error('Ошибка создания сотрудника:', error);
    }
  };

  const handleEditClick = (employee) => {
    setSelectedEmployee(employee);
    setNewEmployee({
      firstName: employee.firstName || '',
      lastName: employee.lastName || '',
      position: employee.position || '',
      department: employee.department || 'field',
      email: employee.email || '',
      phone: employee.phone || '',
      hireDate: employee.hireDate ? employee.hireDate.split('T')[0] : new Date().toISOString().split('T')[0],
      employmentType: employee.employmentType || 'full-time',
      status: employee.status || 'active'
    });
    setShowEditModal(true);
  };

  const handleUpdateEmployee = async () => {
    if (!newEmployee.firstName || !newEmployee.lastName || !newEmployee.position) {
      alert('Заполните обязательные поля');
      return;
    }

    try {
      await employeeAPI.update(selectedEmployee._id, newEmployee);
      setShowEditModal(false);
      loadEmployees();
      resetForm();
      setSelectedEmployee(null);
    } catch (error) {
      console.error('Ошибка обновления сотрудника:', error);
    }
  };

  const handleDeleteEmployee = async (id, name) => {
    if (!window.confirm(`${pageText.modal.confirmDelete[language]} "${name}"?`)) return;
    
    try {
      await employeeAPI.delete(id);
      loadEmployees();
    } catch (error) {
      console.error('Ошибка удаления сотрудника:', error);
    }
  };

  const resetForm = () => {
    setNewEmployee({
      firstName: '',
      lastName: '',
      position: '',
      department: 'field',
      email: '',
      phone: '',
      hireDate: new Date().toISOString().split('T')[0],
      employmentType: 'full-time',
      status: 'active'
    });
    setSelectedEmployee(null);
  };

  const filteredEmployees = employees.filter(emp => {
    if (searchTerm) {
      const fullName = `${emp.firstName} ${emp.lastName}`.toLowerCase();
      return fullName.includes(searchTerm.toLowerCase()) ||
             emp.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
             emp.email?.toLowerCase().includes(searchTerm.toLowerCase());
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
              <option value="on-leave">{pageText.filter.onLeave[language]}</option>
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
          <div className={`p-4 rounded-xl border ${themeClasses.statCard.onLeave}`}>
            <p className={`text-sm ${themeClasses.statText.onLeave.label}`}>
              {pageText.stats.onLeave[language]}
            </p>
            <p className={`text-2xl font-bold ${themeClasses.statText.onLeave.value}`}>
              {stats.onLeave}
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

        {/* Список сотрудников */}
        {filteredEmployees.length === 0 ? (
          <div className={`p-12 rounded-xl border text-center ${themeClasses.card}`}>
            <Users size={48} className={`mx-auto mb-4 ${themeClasses.emptyState.icon}`} />
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
            {filteredEmployees.map(emp => (
              <div 
                key={emp._id} 
                className={`p-6 rounded-xl border transition-all ${themeClasses.card} ${themeClasses.shadow.card} ${themeClasses.hover.card}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-semibold ${themeClasses.avatar.bg}`}>
                      {emp.firstName?.[0]}{emp.lastName?.[0]}
                    </div>
                    <div>
                      <h3 className={`font-semibold ${themeClasses.text.primary}`}>
                        {emp.firstName} {emp.lastName}
                      </h3>
                      <p className={`text-sm ${themeClasses.text.secondary}`}>{emp.position}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${themeClasses.badge[emp.status] || themeClasses.badge.active}`}>
                    {emp.status === 'active' ? pageText.status.active[language] :
                     emp.status === 'on-leave' ? pageText.status.onLeave[language] :
                     pageText.status.terminated[language]}
                  </span>
                </div>

                {/* Кнопки быстрого действия под именем */}
                <div className="flex items-center space-x-2 mt-2 mb-3">
                  <button
                    onClick={() => handleDeleteEmployee(emp._id, `${emp.firstName} ${emp.lastName}`)}
                    className={`text-sm flex items-center ${themeClasses.actionButton.delete}`}
                  >
                    <Trash2 size={16} className="mr-1" />
                    {pageText.buttons.delete[language]}
                  </button>
                  <button
                    onClick={() => handleEditClick(emp)}
                    className={`text-sm flex items-center ${themeClasses.actionButton.edit}`}
                  >
                    <Edit2 size={16} className="mr-1" />
                    {pageText.buttons.edit[language]}
                  </button>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <Briefcase size={14} className={`mr-2 ${themeClasses.icon.default}`} />
                    <span className={themeClasses.text.secondary}>
                      {pageText.departments[emp.department]?.[language] || emp.department}
                    </span>
                  </div>
                  {emp.email && (
                    <div className="flex items-center">
                      <Mail size={14} className={`mr-2 ${themeClasses.icon.default}`} />
                      <span className={themeClasses.text.secondary}>{emp.email}</span>
                    </div>
                  )}
                  {emp.phone && (
                    <div className="flex items-center">
                      <Phone size={14} className={`mr-2 ${themeClasses.icon.default}`} />
                      <span className={themeClasses.text.secondary}>{emp.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center">
                    <Calendar size={14} className={`mr-2 ${themeClasses.icon.default}`} />
                    <span className={themeClasses.text.secondary}>
                      {new Date(emp.hireDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Award size={14} className={`mr-2 ${themeClasses.icon.default}`} />
                    <span className={themeClasses.text.secondary}>
                      {pageText.employmentTypes[emp.employmentType]?.[language] || emp.employmentType}
                    </span>
                  </div>
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
                    onClick={() => handleEditClick(emp)}
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    className={`p-2 rounded-lg transition-colors ${themeClasses.actionButton.delete}`}
                    title={pageText.buttons.delete[language]}
                    onClick={() => handleDeleteEmployee(emp._id, `${emp.firstName} ${emp.lastName}`)}
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
              
              <EmployeeForm 
                newEmployee={newEmployee}
                setNewEmployee={setNewEmployee}
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
                  onClick={handleCreateEmployee}
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
              
              <EmployeeForm 
                newEmployee={newEmployee}
                setNewEmployee={setNewEmployee}
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
                  onClick={handleUpdateEmployee}
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

// Компонент формы для сотрудника
const EmployeeForm = ({ newEmployee, setNewEmployee, language, pageText, themeClasses }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={`block text-sm font-medium mb-2 ${themeClasses.label}`}>
            {pageText.modal.firstName[language]} *
          </label>
          <input
            className={`w-full px-4 py-2 rounded-lg border transition-colors ${themeClasses.input}`}
            value={newEmployee.firstName}
            onChange={(e) => setNewEmployee({...newEmployee, firstName: e.target.value})}
            placeholder="Иван"
          />
        </div>
        <div>
          <label className={`block text-sm font-medium mb-2 ${themeClasses.label}`}>
            {pageText.modal.lastName[language]} *
          </label>
          <input
            className={`w-full px-4 py-2 rounded-lg border transition-colors ${themeClasses.input}`}
            value={newEmployee.lastName}
            onChange={(e) => setNewEmployee({...newEmployee, lastName: e.target.value})}
            placeholder="Иванов"
          />
        </div>
      </div>

      <div>
        <label className={`block text-sm font-medium mb-2 ${themeClasses.label}`}>
          {pageText.modal.position[language]} *
        </label>
        <input
          className={`w-full px-4 py-2 rounded-lg border transition-colors ${themeClasses.input}`}
          value={newEmployee.position}
          onChange={(e) => setNewEmployee({...newEmployee, position: e.target.value})}
          placeholder="Агроном"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={`block text-sm font-medium mb-2 ${themeClasses.label}`}>
            {pageText.modal.department[language]}
          </label>
          <select
            className={`w-full px-4 py-2 rounded-lg border transition-colors ${themeClasses.select}`}
            value={newEmployee.department}
            onChange={(e) => setNewEmployee({...newEmployee, department: e.target.value})}
          >
            {Object.keys(pageText.departments).map(key => (
              <option key={key} value={key}>
                {pageText.departments[key][language]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${themeClasses.label}`}>
            {pageText.modal.employmentType[language]}
          </label>
          <select
            className={`w-full px-4 py-2 rounded-lg border transition-colors ${themeClasses.select}`}
            value={newEmployee.employmentType}
            onChange={(e) => setNewEmployee({...newEmployee, employmentType: e.target.value})}
          >
            {Object.keys(pageText.employmentTypes).map(key => (
              <option key={key} value={key}>
                {pageText.employmentTypes[key][language]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={`block text-sm font-medium mb-2 ${themeClasses.label}`}>
            {pageText.modal.email[language]}
          </label>
          <input
            type="email"
            className={`w-full px-4 py-2 rounded-lg border transition-colors ${themeClasses.input}`}
            value={newEmployee.email}
            onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
            placeholder="ivan@farm.kg"
          />
        </div>
        <div>
          <label className={`block text-sm font-medium mb-2 ${themeClasses.label}`}>
            {pageText.modal.phone[language]}
          </label>
          <input
            className={`w-full px-4 py-2 rounded-lg border transition-colors ${themeClasses.input}`}
            value={newEmployee.phone}
            onChange={(e) => setNewEmployee({...newEmployee, phone: e.target.value})}
            placeholder="+7 (999) 123-45-67"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={`block text-sm font-medium mb-2 ${themeClasses.label}`}>
            {pageText.modal.hireDate[language]}
          </label>
          <input
            type="date"
            className={`w-full px-4 py-2 rounded-lg border transition-colors ${themeClasses.input}`}
            value={newEmployee.hireDate}
            onChange={(e) => setNewEmployee({...newEmployee, hireDate: e.target.value})}
          />
        </div>
        <div>
          <label className={`block text-sm font-medium mb-2 ${themeClasses.label}`}>
            {pageText.modal.status[language]}
          </label>
          <select
            className={`w-full px-4 py-2 rounded-lg border transition-colors ${themeClasses.select}`}
            value={newEmployee.status}
            onChange={(e) => setNewEmployee({...newEmployee, status: e.target.value})}
          >
            <option value="active">{pageText.status.active[language]}</option>
            <option value="on-leave">{pageText.status.onLeave[language]}</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default Employees;