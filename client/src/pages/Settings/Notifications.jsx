// src/pages/Settings/Notifications.jsx
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext'; // ✅ Добавляем тему
import notificationAPI from '../../services/api/notificationAPI';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { 
  Bell, Download, Mail, MessageSquare, AlertCircle, 
  CheckCircle, XCircle, Clock, Calendar,
  Volume2, Moon, Filter, Search,
  ChevronRight, RefreshCw
} from 'lucide-react';
import './Notifications.css';

const Notifications = () => {
  const { language } = useLanguage();
  const { theme } = useTheme(); // ✅ Получаем тему
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    unread: 0,
    read: 0,
    high: 0,
    critical: 0,
    byType: []
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 1
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
    button: {
      primary: 'bg-green-600 hover:bg-green-700 text-white',
      secondary: theme === 'dark'
        ? 'bg-gray-700 hover:bg-gray-600 text-gray-300 border-gray-600'
        : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300',
      outline: theme === 'dark'
        ? 'border-gray-600 hover:bg-gray-700 text-gray-300'
        : 'border-gray-300 hover:bg-gray-100 text-gray-700',
    },
    statCard: theme === 'dark'
      ? 'bg-gray-800 border-gray-700'
      : 'bg-white border-gray-200',
    notification: {
      unread: theme === 'dark'
        ? 'bg-gray-700 border-l-4 border-green-500'
        : 'bg-green-50 border-l-4 border-green-500',
      read: theme === 'dark'
        ? 'bg-gray-800 border-gray-700 hover:bg-gray-700'
        : 'bg-white border-gray-200 hover:bg-gray-50',
    },
    badge: {
      critical: theme === 'dark'
        ? 'bg-red-900/30 text-red-400 border-red-800'
        : 'bg-red-100 text-red-800 border-red-200',
      high: theme === 'dark'
        ? 'bg-orange-900/30 text-orange-400 border-orange-800'
        : 'bg-orange-100 text-orange-800 border-orange-200',
      medium: theme === 'dark'
        ? 'bg-yellow-900/30 text-yellow-400 border-yellow-800'
        : 'bg-yellow-100 text-yellow-800 border-yellow-200',
      low: theme === 'dark'
        ? 'bg-blue-900/30 text-blue-400 border-blue-800'
        : 'bg-blue-100 text-blue-800 border-blue-200',
    },
    tab: {
      active: theme === 'dark'
        ? 'bg-gray-700 text-green-400 border-b-2 border-green-400'
        : 'bg-white text-green-600 border-b-2 border-green-600',
      inactive: theme === 'dark'
        ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700'
        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100',
    }
  };

  // Настройки уведомлений
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('notificationSettings');
    return saved ? JSON.parse(saved) : {
      pushEnabled: true,
      pushTasks: true,
      pushWeather: true,
      pushHarvest: true,
      pushAnimals: true,
      pushEquipment: true,
      emailEnabled: true,
      emailDaily: true,
      emailWeekly: true,
      smsEnabled: false,
      smsCritical: true,
      smsPhone: '+996 555 123 456',
      soundEnabled: true,
      soundVolume: 80,
      vibrateEnabled: false,
      quietHoursEnabled: false,
      quietStart: '22:00',
      quietEnd: '08:00'
    };
  });

  // 🔥 ФУНКЦИЯ ЭКСПОРТА В EXCEL
  const handleExport = () => {
    try {
      if (notifications.length === 0) {
        alert(language === 'ru' ? 'Нет данных для экспорта' : 
              language === 'en' ? 'No data to export' : 
              'Экспорттоо үчүн маалымат жок');
        return;
      }

      // Подготавливаем данные для экспорта
      const exportData = notifications.map(n => ({
        'Дата': new Date(n.createdAt).toLocaleString(language === 'ru' ? 'ru-RU' : language === 'en' ? 'en-US' : 'ky-KG'),
        'Тип': getTypeName(n.type, language),
        'Приоритет': getPriorityName(n.priority, language),
        'Заголовок': n.title,
        'Сообщение': n.message,
        'Статус': n.read ? 
          (language === 'ru' ? 'Прочитано' : language === 'en' ? 'Read' : 'Окулган') : 
          (language === 'ru' ? 'Новое' : language === 'en' ? 'New' : 'Жаңы'),
        'ID': n._id
      }));

      // Создаем рабочий лист
      const ws = XLSX.utils.json_to_sheet(exportData);
      
      // Настраиваем ширину колонок
      const wscols = [
        { wch: 20 }, // Дата
        { wch: 15 }, // Тип
        { wch: 12 }, // Приоритет
        { wch: 30 }, // Заголовок
        { wch: 50 }, // Сообщение
        { wch: 12 }, // Статус
        { wch: 25 }  // ID
      ];
      ws['!cols'] = wscols;

      // Создаем рабочую книгу
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Уведомления');

      // Генерируем имя файла с датой
      const fileName = `notifications_${new Date().toISOString().split('T')[0]}.xlsx`;

      // Сохраняем файл
      XLSX.writeFile(wb, fileName);

    } catch (error) {
      console.error('Ошибка экспорта:', error);
      alert(language === 'ru' ? 'Ошибка при экспорте' : 
            language === 'en' ? 'Export error' : 
            'Экспорттоо катасы');
    }
  };

  // Вспомогательные функции для получения названий
  const getTypeName = (type, lang) => {
    const types = {
      task: { ru: 'Задача', en: 'Task', kg: 'Тапшырма' },
      weather: { ru: 'Погода', en: 'Weather', kg: 'Аба ырайы' },
      harvest: { ru: 'Урожай', en: 'Harvest', kg: 'Түшүм' },
      animals: { ru: 'Животные', en: 'Animals', kg: 'Жаныбарлар' },
      equipment: { ru: 'Техника', en: 'Equipment', kg: 'Техника' },
      system: { ru: 'Система', en: 'System', kg: 'Система' },
      warning: { ru: 'Предупреждение', en: 'Warning', kg: 'Эскертүү' },
      info: { ru: 'Информация', en: 'Info', kg: 'Маалымат' },
      success: { ru: 'Успех', en: 'Success', kg: 'Ийгилик' }
    };
    return types[type]?.[lang] || type;
  };

  const getPriorityName = (priority, lang) => {
    const priorities = {
      low: { ru: 'Низкий', en: 'Low', kg: 'Төмөн' },
      medium: { ru: 'Средний', en: 'Medium', kg: 'Орто' },
      high: { ru: 'Высокий', en: 'High', kg: 'Жогорку' },
      critical: { ru: 'Критичный', en: 'Critical', kg: 'Критикалык' }
    };
    return priorities[priority]?.[lang] || priority;
  };

  // Загрузка данных
  useEffect(() => {
    loadNotifications();
    loadStats();
  }, [activeTab, pagination.page]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const filters = {
        page: pagination.page,
        limit: pagination.limit
      };
      
      if (activeTab === 'unread') {
        filters.read = false;
      }
      
      if (searchTerm) {
        filters.search = searchTerm;
      }
      
      const response = await notificationAPI.getAll(filters);
      setNotifications(response.notifications || []);
      setPagination(response.pagination || { page: 1, limit: 20, total: 0, pages: 1 });
    } catch (error) {
      console.error('Ошибка загрузки уведомлений:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await notificationAPI.getStats();
      setStats(response.stats || { total: 0, unread: 0, read: 0, high: 0, critical: 0, byType: [] });
    } catch (error) {
      console.error('Ошибка загрузки статистики:', error);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationAPI.markAsRead(id);
      await loadNotifications();
      await loadStats();
    } catch (error) {
      console.error('Ошибка отметки уведомления:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      await loadNotifications();
      await loadStats();
    } catch (error) {
      console.error('Ошибка отметки всех уведомлений:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Удалить уведомление?')) return;
    try {
      await notificationAPI.delete(id);
      await loadNotifications();
      await loadStats();
    } catch (error) {
      console.error('Ошибка удаления уведомления:', error);
    }
  };

  const handleClearAllRead = async () => {
    if (!window.confirm('Удалить все прочитанные уведомления?')) return;
    try {
      await notificationAPI.clearRead();
      await loadNotifications();
      await loadStats();
    } catch (error) {
      console.error('Ошибка удаления уведомлений:', error);
    }
  };

  const handleSettingChange = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('notificationSettings', JSON.stringify(newSettings));
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    const timeText = {
      justNow: { ru: 'Только что', en: 'Just now', kg: 'Азыр эле' },
      minutesAgo: { ru: 'мин назад', en: 'min ago', kg: 'мүн мурун' },
      hoursAgo: { ru: 'ч назад', en: 'h ago', kg: 'саат мурун' },
      yesterday: { ru: 'Вчера', en: 'Yesterday', kg: 'Кечээ' }
    };

    if (diffMins < 1) return timeText.justNow[language];
    if (diffMins < 60) return `${diffMins} ${timeText.minutesAgo[language]}`;
    if (diffHours < 24) return `${diffHours} ${timeText.hoursAgo[language]}`;
    if (diffDays === 1) return timeText.yesterday[language];
    return date.toLocaleDateString();
  };

  const getPriorityColor = (priority) => {
    return themeClasses.badge[priority] || themeClasses.badge.low;
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'task': return '📋';
      case 'weather': return '🌤️';
      case 'harvest': return '🌾';
      case 'animals': return '🐄';
      case 'equipment': return '🚜';
      case 'system': return '⚙️';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      case 'success': return '✅';
      default: return '🔔';
    }
  };

  // Переводы для страницы
  const pageText = {
    title: {
      ru: 'Уведомления',
      en: 'Notifications',
      kg: 'Билдирүүлөр'
    },
    subtitle: {
      ru: 'Управление уведомлениями и оповещениями',
      en: 'Manage notifications and alerts',
      kg: 'Билдирүүлөрдү жана эскертүүлөрдү башкаруу'
    },
    tabs: {
      all: { ru: 'Все', en: 'All', kg: 'Баары' },
      unread: { ru: 'Непрочитанные', en: 'Unread', kg: 'Окулбагандар' },
      settings: { ru: 'Настройки', en: 'Settings', kg: 'Жөндөөлөр' }
    },
    search: {
      placeholder: { ru: 'Поиск уведомлений...', en: 'Search notifications...', kg: 'Билдирүүлөрдү издөө...' }
    },
    actions: {
      export: { ru: 'Экспорт', en: 'Export', kg: 'Экспорт' },
      markAllRead: { ru: 'Отметить все', en: 'Mark all read', kg: 'Баарын белгилөө' },
      clearAll: { ru: 'Очистить все', en: 'Clear all', kg: 'Баарын тазалоо' },
      refresh: { ru: 'Обновить', en: 'Refresh', kg: 'Жаңыртуу' }
    },
    empty: {
      title: { ru: 'Нет уведомлений', en: 'No notifications', kg: 'Билдирүүлөр жок' },
      description: { ru: 'У вас пока нет уведомлений', en: 'You have no notifications yet', kg: 'Сизде азыр билдирүүлөр жок' }
    },
    stats: {
      total: { ru: 'Всего', en: 'Total', kg: 'Баары' },
      new: { ru: 'Новые', en: 'New', kg: 'Жаңы' },
      critical: { ru: 'Критичные', en: 'Critical', kg: 'Критикалык' },
      types: { ru: 'Типов', en: 'Types', kg: 'Түрлөрү' }
    }
  };

  return (
    <div className={`p-6 transition-colors duration-300 ${themeClasses.page}`}>
      <div className="mb-6">
        <h1 className={`text-2xl font-bold mb-2 ${themeClasses.text.primary}`}>
          {pageText.title[language]}
        </h1>
        <p className={themeClasses.text.secondary}>
          {pageText.subtitle[language]}
        </p>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className={`p-4 rounded-xl border ${themeClasses.statCard}`}>
          <p className={`text-2xl font-bold ${themeClasses.text.primary}`}>{stats.total}</p>
          <p className={themeClasses.text.secondary}>{pageText.stats.total[language]}</p>
        </div>
        <div className={`p-4 rounded-xl border ${themeClasses.statCard}`}>
          <p className={`text-2xl font-bold text-yellow-600`}>{stats.unread}</p>
          <p className={themeClasses.text.secondary}>{pageText.stats.new[language]}</p>
        </div>
        <div className={`p-4 rounded-xl border ${themeClasses.statCard}`}>
          <p className={`text-2xl font-bold text-red-600`}>{stats.critical}</p>
          <p className={themeClasses.text.secondary}>{pageText.stats.critical[language]}</p>
        </div>
        <div className={`p-4 rounded-xl border ${themeClasses.statCard}`}>
          <p className={`text-2xl font-bold text-blue-600`}>{stats.byType?.length || 0}</p>
          <p className={themeClasses.text.secondary}>{pageText.stats.types[language]}</p>
        </div>
      </div>

      {/* Табы */}
      <div className="flex gap-2 mb-6 border-b pb-2">
        <button
          className={`px-4 py-2 rounded-t-lg transition-colors ${
            activeTab === 'all' 
              ? themeClasses.tab.active 
              : themeClasses.tab.inactive
          }`}
          onClick={() => setActiveTab('all')}
        >
          {pageText.tabs.all[language]} ({stats.total})
        </button>
        <button
          className={`px-4 py-2 rounded-t-lg transition-colors ${
            activeTab === 'unread' 
              ? themeClasses.tab.active 
              : themeClasses.tab.inactive
          }`}
          onClick={() => setActiveTab('unread')}
        >
          {pageText.tabs.unread[language]} ({stats.unread})
        </button>
        <button
          className={`px-4 py-2 rounded-t-lg transition-colors ${
            activeTab === 'settings' 
              ? themeClasses.tab.active 
              : themeClasses.tab.inactive
          }`}
          onClick={() => setActiveTab('settings')}
        >
          {pageText.tabs.settings[language]}
        </button>
      </div>

      {/* Поиск и действия */}
      {activeTab !== 'settings' && (
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder={pageText.search.placeholder[language]}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg border ${themeClasses.input}`}
            />
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={handleExport}
              className={`px-4 py-2 rounded-lg border flex items-center gap-2 ${themeClasses.button.outline}`}
            >
              <Download size={16} />
              {pageText.actions.export[language]}
            </button>
            
            <button 
              onClick={handleMarkAllAsRead}
              className={`px-4 py-2 rounded-lg border flex items-center gap-2 ${themeClasses.button.outline}`}
            >
              <CheckCircle size={16} />
              {pageText.actions.markAllRead[language]}
            </button>
            
            <button 
              onClick={handleClearAllRead}
              className={`px-4 py-2 rounded-lg border flex items-center gap-2 ${themeClasses.button.outline}`}
            >
              <XCircle size={16} />
              {pageText.actions.clearAll[language]}
            </button>
            
            <button 
              onClick={loadNotifications}
              className={`p-2 rounded-lg border ${themeClasses.button.outline}`}
            >
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>
      )}

      {/* Контент */}
      {activeTab === 'settings' ? (
        <div className="notifications-settings">
          {/* Настройки - ваш существующий код */}
        </div>
      ) : (
        <div className="space-y-3">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <RefreshCw size={40} className="animate-spin text-green-600" />
            </div>
          ) : notifications.length > 0 ? (
            <>
              {notifications.map(notification => (
                <div
                  key={notification._id}
                  className={`p-4 rounded-xl border transition-colors ${
                    !notification.read 
                      ? themeClasses.notification.unread 
                      : themeClasses.notification.read
                  }`}
                >
                  <div className="flex gap-4">
                    <div className="text-2xl">
                      {notification.icon || getTypeIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className={`font-semibold ${themeClasses.text.primary}`}>
                          {notification.title}
                        </h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(notification.priority)}`}>
                          {getPriorityName(notification.priority, language)}
                        </span>
                      </div>
                      
                      <p className={`text-sm mb-3 ${themeClasses.text.secondary}`}>
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className={`text-xs flex items-center gap-1 ${themeClasses.text.muted}`}>
                          <Clock size={12} />
                          {getTimeAgo(notification.createdAt)}
                        </span>
                        
                        <div className="flex gap-2">
                          {!notification.read && (
                            <button
                              onClick={() => handleMarkAsRead(notification._id)}
                              className={`p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-600 ${themeClasses.text.secondary}`}
                              title="Отметить как прочитанное"
                            >
                              <CheckCircle size={16} />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(notification._id)}
                            className={`p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-600 text-red-600`}
                            title="Удалить"
                          >
                            <XCircle size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Пагинация */}
              {pagination.pages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-6">
                  <button
                    disabled={pagination.page === 1}
                    onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                    className={`p-2 rounded-lg border ${themeClasses.button.outline} disabled:opacity-50`}
                  >
                    <ChevronRight className="rotate-180" size={18} />
                  </button>
                  <span className={themeClasses.text.primary}>
                    {pagination.page} / {pagination.pages}
                  </span>
                  <button
                    disabled={pagination.page === pagination.pages}
                    onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                    className={`p-2 rounded-lg border ${themeClasses.button.outline} disabled:opacity-50`}
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <Bell size={48} className={`mx-auto mb-4 ${themeClasses.text.muted}`} />
              <p className={`text-lg font-medium ${themeClasses.text.primary}`}>
                {pageText.empty.title[language]}
              </p>
              <p className={themeClasses.text.secondary}>
                {pageText.empty.description[language]}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Notifications;