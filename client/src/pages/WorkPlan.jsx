// src/pages/WorkPlan.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext'; // ✅ Добавляем тему
import workPlanAPI from '../services/api/workPlanAPI';
import { 
  Calendar, Plus, Trash2, Eye,
  RefreshCw, Search, CheckCircle, Play, Save, X
} from 'lucide-react';

import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';

const WorkPlan = () => {
  const { language } = useLanguage();
  const { theme } = useTheme(); // ✅ Получаем тему
  const navigate = useNavigate();
  
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    completed: 0,
    draft: 0
  });
  
  const [filter, setFilter] = useState({
    period: 'all',
    status: 'all'
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
      active: theme === 'dark'
        ? 'bg-green-900/30 border-green-800'
        : 'bg-green-50 border-green-100',
      completed: theme === 'dark'
        ? 'bg-purple-900/30 border-purple-800'
        : 'bg-purple-50 border-purple-100',
      draft: theme === 'dark'
        ? 'bg-gray-700 border-gray-600'
        : 'bg-gray-50 border-gray-200',
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
      completed: {
        label: theme === 'dark' ? 'text-purple-400' : 'text-purple-600',
        value: theme === 'dark' ? 'text-purple-300' : 'text-purple-800',
      },
      draft: {
        label: theme === 'dark' ? 'text-gray-400' : 'text-gray-600',
        value: theme === 'dark' ? 'text-gray-300' : 'text-gray-800',
      },
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
    },
    shadow: {
      card: theme === 'dark' 
        ? 'shadow-lg shadow-black/20' 
        : 'shadow-lg shadow-gray-200',
    },
    searchIcon: theme === 'dark' ? 'text-gray-500' : 'text-gray-400',
    badge: {
      draft: theme === 'dark'
        ? 'bg-gray-700 text-gray-300 border border-gray-600'
        : 'bg-gray-100 text-gray-800 border border-gray-200',
      active: theme === 'dark'
        ? 'bg-green-900/30 text-green-400 border border-green-800'
        : 'bg-green-100 text-green-800 border border-green-200',
      completed: theme === 'dark'
        ? 'bg-blue-900/30 text-blue-400 border border-blue-800'
        : 'bg-blue-100 text-blue-800 border border-blue-200',
    },
    modal: {
      overlay: 'bg-black/50',
      content: theme === 'dark'
        ? 'bg-gray-800 border-gray-700'
        : 'bg-white border-gray-200',
    },
    label: theme === 'dark' ? 'text-gray-300' : 'text-gray-700',
    icon: {
      calendar: theme === 'dark' ? 'text-gray-500' : 'text-gray-400',
    },
    description: {
      text: theme === 'dark' ? 'text-gray-400' : 'text-gray-600',
      lineClamp: 'line-clamp-2',
    },
    actionButton: {
      view: theme === 'dark'
        ? 'text-gray-400 hover:text-gray-300'
        : 'text-gray-600 hover:text-gray-900',
      delete: theme === 'dark'
        ? 'text-red-400 hover:text-red-300'
        : 'text-red-600 hover:text-red-800',
      status: {
        active: theme === 'dark'
          ? 'text-green-400 hover:text-green-300'
          : 'text-green-600 hover:text-green-800',
        completed: theme === 'dark'
          ? 'text-blue-400 hover:text-blue-300'
          : 'text-blue-600 hover:text-blue-800',
      },
    },
  };

  const [newPlan, setNewPlan] = useState({
    title: '',
    description: '',
    period: 'weekly',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 7*24*60*60*1000).toISOString().split('T')[0],
    status: 'draft'
  });

  // Заголовки на разных языках
  const pageTitle = {
    ru: 'План работ',
    en: 'Work Plan',
    kg: 'Иш планы'
  };

  const pageSubtitle = {
    ru: 'Планирование и управление работами',
    en: 'Planning and work management',
    kg: 'Иштерди пландоо жана башкаруу'
  };

  const newPlanButton = {
    ru: 'Новый план',
    en: 'New plan',
    kg: 'Жаңы план'
  };

  const statsTitles = {
    total: {
      ru: 'Всего планов',
      en: 'Total plans',
      kg: 'Бардык пландар'
    },
    active: {
      ru: 'Активных',
      en: 'Active',
      kg: 'Активдүү'
    },
    completed: {
      ru: 'Завершено',
      en: 'Completed',
      kg: 'Аякталган'
    },
    draft: {
      ru: 'Черновиков',
      en: 'Drafts',
      kg: 'Долбоорлор'
    }
  };

  const searchPlaceholder = {
    ru: 'Поиск планов...',
    en: 'Search plans...',
    kg: 'Пландарды издөө...'
  };

  const emptyState = {
    title: {
      ru: 'Нет планов работ',
      en: 'No work plans',
      kg: 'Иш пландары жок'
    },
    description: {
      ru: 'Создайте первый план',
      en: 'Create your first plan',
      kg: 'Биринчи иш планын түзүңүз'
    },
    button: {
      ru: 'Создать план',
      en: 'Create plan',
      kg: 'План түзүү'
    }
  };

  const filterOptions = {
    allPeriods: {
      ru: 'Все периоды',
      en: 'All periods',
      kg: 'Бардык мезгилдер'
    },
    allStatuses: {
      ru: 'Все статусы',
      en: 'All statuses',
      kg: 'Бардык статустар'
    }
  };

  const modalTitles = {
    title: {
      ru: 'Новый план',
      en: 'New Plan',
      kg: 'Жаңы план'
    },
    name: {
      ru: 'Название',
      en: 'Title',
      kg: 'Аталышы'
    },
    description: {
      ru: 'Описание',
      en: 'Description',
      kg: 'Сүрөттөмө'
    },
    period: {
      ru: 'Период',
      en: 'Period',
      kg: 'Мезгил'
    },
    status: {
      ru: 'Статус',
      en: 'Status',
      kg: 'Статус'
    },
    startDate: {
      ru: 'Дата начала',
      en: 'Start Date',
      kg: 'Башталуу датасы'
    },
    endDate: {
      ru: 'Дата окончания',
      en: 'End Date',
      kg: 'Аяктоо датасы'
    }
  };

  const buttonText = {
    cancel: {
      ru: 'Отмена',
      en: 'Cancel',
      kg: 'Жокко чыгаруу'
    },
    create: {
      ru: 'Создать',
      en: 'Create',
      kg: 'Түзүү'
    }
  };

  useEffect(() => {
    loadPlans();
  }, [filter]);

  const loadPlans = async () => {
    try {
      setLoading(true);
      const filters = {};
      if (filter.period !== 'all') filters.period = filter.period;
      if (filter.status !== 'all') filters.status = filter.status;
      
      const response = await workPlanAPI.getAll(filters);
      setPlans(response.plans || []);
      calculateStats(response.plans || []);
    } catch (error) {
      console.error('Ошибка загрузки планов:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (plansData) => {
    const total = plansData.length;
    const active = plansData.filter(p => p.status === 'active').length;
    const completed = plansData.filter(p => p.status === 'completed').length;
    const draft = plansData.filter(p => p.status === 'draft').length;
    setStats({ total, active, completed, draft });
  };

  const handleCreatePlan = async () => {
    if (!newPlan.title) {
      alert('Введите название плана');
      return;
    }

    try {
      const response = await workPlanAPI.create(newPlan);
      setPlans([...plans, response.plan]);
      setShowAddModal(false);
      calculateStats([...plans, response.plan]);
      resetForm();
    } catch (error) {
      console.error('Ошибка создания плана:', error);
      alert('Ошибка при создании плана');
    }
  };

  const handleDeletePlan = async (id) => {
    if (!window.confirm('Удалить план?')) return;
    
    try {
      await workPlanAPI.delete(id);
      const updatedPlans = plans.filter(p => p._id !== id);
      setPlans(updatedPlans);
      calculateStats(updatedPlans);
    } catch (error) {
      console.error('Ошибка удаления плана:', error);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      const response = await workPlanAPI.updateStatus(id, status);
      const updatedPlans = plans.map(p => p._id === id ? response.plan : p);
      setPlans(updatedPlans);
      calculateStats(updatedPlans);
    } catch (error) {
      console.error('Ошибка обновления статуса:', error);
    }
  };

  const resetForm = () => {
    setNewPlan({
      title: '',
      description: '',
      period: 'weekly',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 7*24*60*60*1000).toISOString().split('T')[0],
      status: 'draft'
    });
  };

  const getPeriodText = (period) => {
    const periods = {
      daily: { ru: 'Ежедневный', en: 'Daily', kg: 'Күн сайын' },
      weekly: { ru: 'Еженедельный', en: 'Weekly', kg: 'Апта сайын' },
      monthly: { ru: 'Ежемесячный', en: 'Monthly', kg: 'Ай сайын' }
    };
    return periods[period]?.[language] || period;
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'draft': return themeClasses.badge.draft;
      case 'active': return themeClasses.badge.active;
      case 'completed': return themeClasses.badge.completed;
      default: return themeClasses.badge.draft;
    }
  };

  const getStatusText = (status) => {
    const statuses = {
      draft: { ru: 'Черновик', en: 'Draft', kg: 'Долбоор' },
      active: { ru: 'Активный', en: 'Active', kg: 'Активдүү' },
      completed: { ru: 'Завершен', en: 'Completed', kg: 'Аякталган' }
    };
    return statuses[status]?.[language] || status;
  };

  const filteredPlans = plans.filter(plan => {
    if (searchTerm) {
      return plan.title?.toLowerCase().includes(searchTerm.toLowerCase());
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
        {/* Заголовок страницы */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className={`text-2xl font-bold ${themeClasses.text.primary}`}>
              {pageTitle[language]}
            </h1>
            <p className={`mt-1 ${themeClasses.text.secondary}`}>
              {pageSubtitle[language]}
            </p>
          </div>

          <div className="flex items-center space-x-3 mt-4 md:mt-0">
            {/* Фильтры */}
            <select
              value={filter.period}
              onChange={(e) => setFilter({...filter, period: e.target.value})}
              className={`px-3 py-2 rounded-lg border transition-colors ${themeClasses.select}`}
            >
              <option value="all">{filterOptions.allPeriods[language]}</option>
              <option value="daily">{getPeriodText('daily')}</option>
              <option value="weekly">{getPeriodText('weekly')}</option>
              <option value="monthly">{getPeriodText('monthly')}</option>
            </select>

            <select
              value={filter.status}
              onChange={(e) => setFilter({...filter, status: e.target.value})}
              className={`px-3 py-2 rounded-lg border transition-colors ${themeClasses.select}`}
            >
              <option value="all">{filterOptions.allStatuses[language]}</option>
              <option value="draft">{getStatusText('draft')}</option>
              <option value="active">{getStatusText('active')}</option>
              <option value="completed">{getStatusText('completed')}</option>
            </select>

            <button
              className={`px-4 py-2 rounded-lg flex items-center ${themeClasses.button.primary}`}
              onClick={() => setShowAddModal(true)}
            >
              <Plus size={18} className="mr-2" />
              {newPlanButton[language]}
            </button>
          </div>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className={`p-4 rounded-xl border ${themeClasses.statCard.total}`}>
            <p className={`text-sm ${themeClasses.statText.total.label}`}>
              {statsTitles.total[language]}
            </p>
            <p className={`text-2xl font-bold ${themeClasses.statText.total.value}`}>
              {stats.total}
            </p>
          </div>
          <div className={`p-4 rounded-xl border ${themeClasses.statCard.active}`}>
            <p className={`text-sm ${themeClasses.statText.active.label}`}>
              {statsTitles.active[language]}
            </p>
            <p className={`text-2xl font-bold ${themeClasses.statText.active.value}`}>
              {stats.active}
            </p>
          </div>
          <div className={`p-4 rounded-xl border ${themeClasses.statCard.completed}`}>
            <p className={`text-sm ${themeClasses.statText.completed.label}`}>
              {statsTitles.completed[language]}
            </p>
            <p className={`text-2xl font-bold ${themeClasses.statText.completed.value}`}>
              {stats.completed}
            </p>
          </div>
          <div className={`p-4 rounded-xl border ${themeClasses.statCard.draft}`}>
            <p className={`text-sm ${themeClasses.statText.draft.label}`}>
              {statsTitles.draft[language]}
            </p>
            <p className={`text-2xl font-bold ${themeClasses.statText.draft.value}`}>
              {stats.draft}
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
            placeholder={searchPlaceholder[language]}
            className={`w-full pl-10 pr-4 py-2 rounded-lg border transition-colors ${themeClasses.input}`}
          />
        </div>

        {/* Список планов */}
        {filteredPlans.length === 0 ? (
          <div className={`p-12 rounded-xl border text-center ${themeClasses.card}`}>
            <Calendar size={48} className={`mx-auto mb-4 ${themeClasses.emptyState.icon}`} />
            <h3 className={`text-lg font-semibold mb-2 ${themeClasses.text.primary}`}>
              {emptyState.title[language]}
            </h3>
            <p className={`mb-6 ${themeClasses.emptyState.text}`}>
              {emptyState.description[language]}
            </p>
            <button
              className={`px-4 py-2 rounded-lg inline-flex items-center ${themeClasses.button.primary}`}
              onClick={() => setShowAddModal(true)}
            >
              <Plus size={18} className="mr-2" />
              {emptyState.button[language]}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlans.map(plan => (
              <div 
                key={plan._id} 
                className={`p-6 rounded-xl border transition-all ${themeClasses.card} ${themeClasses.shadow.card} ${themeClasses.hover.card}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className={`font-semibold ${themeClasses.text.primary}`}>{plan.title}</h3>
                    <p className={`text-sm mt-1 ${themeClasses.text.secondary}`}>{getPeriodText(plan.period)}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(plan.status)}`}>
                    {getStatusText(plan.status)}
                  </span>
                </div>

                {plan.description && (
                  <p className={`text-sm mb-4 ${themeClasses.description.text} ${themeClasses.description.lineClamp}`}>
                    {plan.description}
                  </p>
                )}

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm">
                    <Calendar size={14} className={`mr-2 ${themeClasses.icon.calendar}`} />
                    <span className={themeClasses.text.secondary}>
                      {new Date(plan.startDate).toLocaleDateString()} - {new Date(plan.endDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-4 border-t">
                  <button
                    className={`p-2 rounded-lg transition-colors ${
                      plan.status === 'active' 
                        ? themeClasses.actionButton.status.completed
                        : themeClasses.actionButton.status.active
                    }`}
                    onClick={() => handleUpdateStatus(plan._id, plan.status === 'active' ? 'completed' : 'active')}
                  >
                    {plan.status === 'active' ? <CheckCircle size={16} /> : <Play size={16} />}
                  </button>
                  <button
                    className={`p-2 rounded-lg transition-colors ${themeClasses.actionButton.view}`}
                    onClick={() => navigate(`/work-plan/${plan._id}`)}
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    className={`p-2 rounded-lg transition-colors ${themeClasses.actionButton.delete}`}
                    onClick={() => handleDeletePlan(plan._id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Модальное окно создания плана */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/50" onClick={() => setShowAddModal(false)}></div>
            <div className={`relative w-full max-w-2xl rounded-xl border ${themeClasses.modal.content} p-6`}>
              <h3 className={`text-xl font-semibold mb-4 ${themeClasses.text.primary}`}>
                {modalTitles.title[language]}
              </h3>
              
              <PlanForm 
                newPlan={newPlan}
                setNewPlan={setNewPlan}
                language={language}
                modalTitles={modalTitles}
                getPeriodText={getPeriodText}
                getStatusText={getStatusText}
                themeClasses={themeClasses}
              />
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  className={`px-4 py-2 rounded-lg border transition-colors ${themeClasses.button.secondary}`}
                  onClick={() => setShowAddModal(false)}
                >
                  {buttonText.cancel[language]}
                </button>
                <button
                  className={`px-4 py-2 rounded-lg flex items-center ${themeClasses.button.primary}`}
                  onClick={handleCreatePlan}
                >
                  <Save size={18} className="mr-2" />
                  {buttonText.create[language]}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Компонент формы для плана
const PlanForm = ({ newPlan, setNewPlan, language, modalTitles, getPeriodText, getStatusText, themeClasses }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className={`block text-sm font-medium mb-2 ${themeClasses.label}`}>
          {modalTitles.name[language]} *
        </label>
        <input
          className={`w-full px-4 py-2 rounded-lg border transition-colors ${themeClasses.input}`}
          value={newPlan.title}
          onChange={(e) => setNewPlan({...newPlan, title: e.target.value})}
          placeholder={modalTitles.name[language]}
        />
      </div>

      <div>
        <label className={`block text-sm font-medium mb-2 ${themeClasses.label}`}>
          {modalTitles.description[language]}
        </label>
        <textarea
          value={newPlan.description}
          onChange={(e) => setNewPlan({...newPlan, description: e.target.value})}
          rows="3"
          className={`w-full px-4 py-2 rounded-lg border transition-colors ${themeClasses.textarea}`}
          placeholder={modalTitles.description[language]}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={`block text-sm font-medium mb-2 ${themeClasses.label}`}>
            {modalTitles.period[language]}
          </label>
          <select
            value={newPlan.period}
            onChange={(e) => setNewPlan({...newPlan, period: e.target.value})}
            className={`w-full px-4 py-2 rounded-lg border transition-colors ${themeClasses.select}`}
          >
            <option value="daily">{getPeriodText('daily')}</option>
            <option value="weekly">{getPeriodText('weekly')}</option>
            <option value="monthly">{getPeriodText('monthly')}</option>
          </select>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${themeClasses.label}`}>
            {modalTitles.status[language]}
          </label>
          <select
            value={newPlan.status}
            onChange={(e) => setNewPlan({...newPlan, status: e.target.value})}
            className={`w-full px-4 py-2 rounded-lg border transition-colors ${themeClasses.select}`}
          >
            <option value="draft">{getStatusText('draft')}</option>
            <option value="active">{getStatusText('active')}</option>
          </select>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${themeClasses.label}`}>
            {modalTitles.startDate[language]}
          </label>
          <input
            type="date"
            className={`w-full px-4 py-2 rounded-lg border transition-colors ${themeClasses.input}`}
            value={newPlan.startDate}
            onChange={(e) => setNewPlan({...newPlan, startDate: e.target.value})}
          />
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${themeClasses.label}`}>
            {modalTitles.endDate[language]}
          </label>
          <input
            type="date"
            className={`w-full px-4 py-2 rounded-lg border transition-colors ${themeClasses.input}`}
            value={newPlan.endDate}
            onChange={(e) => setNewPlan({...newPlan, endDate: e.target.value})}
          />
        </div>
      </div>
    </div>
  );
};

export default WorkPlan;