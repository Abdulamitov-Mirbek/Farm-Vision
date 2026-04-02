import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext'; // ✅ Добавляем тему
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Sun,
  Cloud,
  CloudRain,
  AlertCircle,
  CheckCircle,
  Clock,
  MapPin,
  Users,
  DollarSign,
  Leaf,
  Sprout,
  Scissors,
  Droplets,
  Thermometer,
  MoreVertical,
  Edit2,
  Trash2,
  Eye
} from 'lucide-react';

const CalendarPage = () => {
  const { t, language } = useLanguage();
  const { theme } = useTheme(); // ✅ Получаем тему
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month'); // month, week, day
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [filter, setFilter] = useState({
    type: 'all',
    field: 'all'
  });

  // ✅ Классы для темы
  const themeClasses = {
    page: theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50',
    card: theme === 'dark' 
      ? 'bg-gray-800 border-gray-700' 
      : 'bg-white border-gray-200',
    text: {
      primary: theme === 'dark' ? 'text-white' : 'text-gray-900',
      secondary: theme === 'dark' ? 'text-gray-300' : 'text-gray-600',
      muted: theme === 'dark' ? 'text-gray-400' : 'text-gray-500',
    },
    border: theme === 'dark' ? 'border-gray-700' : 'border-gray-200',
    button: {
      primary: 'bg-green-600 hover:bg-green-700 text-white',
      secondary: theme === 'dark'
        ? 'border-gray-600 hover:bg-gray-700 text-gray-300'
        : 'border-gray-200 hover:bg-gray-50 text-gray-600',
      outline: theme === 'dark'
        ? 'border-gray-600 hover:bg-gray-700 text-gray-300'
        : 'border-gray-300 hover:bg-gray-100 text-gray-700',
    },
    input: theme === 'dark'
      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
      : 'bg-white border-gray-200 text-gray-900',
    statCard: {
      blue: theme === 'dark' ? 'bg-blue-900/20' : 'bg-blue-100',
      green: theme === 'dark' ? 'bg-green-900/20' : 'bg-green-100',
      yellow: theme === 'dark' ? 'bg-yellow-900/20' : 'bg-yellow-100',
      red: theme === 'dark' ? 'bg-red-900/20' : 'bg-red-100',
      purple: theme === 'dark' ? 'bg-purple-900/20' : 'bg-purple-100',
    },
    calendar: {
      day: theme === 'dark'
        ? 'bg-gray-700 border-gray-600'
        : 'bg-white border-gray-100',
      dayCurrent: theme === 'dark'
        ? 'bg-gray-600 border-gray-500'
        : 'bg-white border-gray-100',
      dayOtherMonth: theme === 'dark'
        ? 'bg-gray-800 border-gray-700 text-gray-500'
        : 'bg-gray-50 border-gray-100 text-gray-400',
      today: theme === 'dark'
        ? 'border-green-500 bg-gray-600'
        : 'border-green-500 bg-white',
    },
    badge: {
      high: theme === 'dark' ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-800',
      medium: theme === 'dark' ? 'bg-yellow-900/30 text-yellow-400' : 'bg-yellow-100 text-yellow-800',
      low: theme === 'dark' ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-800',
    },
    eventCard: {
      sowing: theme === 'dark' ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700',
      harvest: theme === 'dark' ? 'bg-yellow-900/30 text-yellow-400' : 'bg-yellow-100 text-yellow-700',
      treatment: theme === 'dark' ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-100 text-purple-700',
      irrigation: theme === 'dark' ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-700',
      maintenance: theme === 'dark' ? 'bg-orange-900/30 text-orange-400' : 'bg-orange-100 text-orange-700',
    },
    detailBlock: theme === 'dark'
      ? 'bg-gray-700'
      : 'bg-gray-50',
  };

  // Моковые данные для событий
  useEffect(() => {
    // Имитация загрузки данных
    setTimeout(() => {
      setEvents([
        {
          id: 1,
          title: language === 'ru' ? 'Посев пшеницы' :
                 language === 'en' ? 'Wheat sowing' :
                 'Буудай себүү',
          type: 'sowing',
          date: '2026-02-15',
          time: '09:00',
          field: language === 'ru' ? 'Северное поле' :
                 language === 'en' ? 'Northern Field' :
                 'Түндүк талаа',
          fieldId: 1,
          description: language === 'ru' ? 'Начать посев озимой пшеницы. Сорт "Московская-56". Норма высева 220 кг/га.' :
                       language === 'en' ? 'Start winter wheat sowing. Variety "Moskovskaya-56". Seeding rate 220 kg/ha.' :
                       'Күздүк буудай себүүнү баштоо. "Московская-56" сорту. Себүү нормасы 220 кг/га.',
          status: 'planned',
          priority: 'high',
          weather: 'sunny',
          workers: 4,
          hours: 8,
          cost: 45000,
          completed: false
        },
        {
          id: 2,
          title: language === 'ru' ? 'Внесение удобрений' :
                 language === 'en' ? 'Fertilizer application' :
                 'Жерсемирткич чачуу',
          type: 'treatment',
          date: '2026-02-16',
          time: '10:30',
          field: language === 'ru' ? 'Южное поле' :
                 language === 'en' ? 'Southern Field' :
                 'Түштүк талаа',
          fieldId: 2,
          description: language === 'ru' ? 'Азотная подкормка. Аммиачная селитра 100 кг/га.' :
                       language === 'en' ? 'Nitrogen fertilization. Ammonium nitrate 100 kg/ha.' :
                       'Азот менен азыктандыруу. Аммиак селитрасы 100 кг/га.',
          status: 'planned',
          priority: 'medium',
          weather: 'cloudy',
          workers: 3,
          hours: 5,
          cost: 28000,
          completed: false
        },
        {
          id: 3,
          title: language === 'ru' ? 'Полив кукурузы' :
                 language === 'en' ? 'Corn irrigation' :
                 'Жүгөрү сугаруу',
          type: 'irrigation',
          date: '2026-02-17',
          time: '08:00',
          field: language === 'ru' ? 'Западное поле' :
                 language === 'en' ? 'Western Field' :
                 'Батыш талаа',
          fieldId: 3,
          description: language === 'ru' ? 'Капельный полив. Длительность 4 часа.' :
                       language === 'en' ? 'Drip irrigation. Duration 4 hours.' :
                       'Тамчылатып сугаруу. Узактыгы 4 саат.',
          status: 'planned',
          priority: 'low',
          weather: 'sunny',
          workers: 2,
          hours: 4,
          cost: 12000,
          completed: false
        },
        {
          id: 4,
          title: language === 'ru' ? 'Обработка от вредителей' :
                 language === 'en' ? 'Pest control' :
                 'Зыянкечтерге каршы дарылоо',
          type: 'treatment',
          date: '2026-02-18',
          time: '14:00',
          field: language === 'ru' ? 'Восточное поле' :
                 language === 'en' ? 'Eastern Field' :
                 'Чыгыш талаа',
          fieldId: 4,
          description: language === 'ru' ? 'Обнаружена тля. Срочная обработка инсектицидами.' :
                       language === 'en' ? 'Aphids detected. Urgent insecticide treatment.' :
                       'Тли табылды. Шашылыш инсектицид менен дарылоо.',
          status: 'planned',
          priority: 'high',
          weather: 'cloudy',
          workers: 2,
          hours: 3,
          cost: 15000,
          completed: false
        },
        {
          id: 5,
          title: language === 'ru' ? 'Уборка подсолнечника' :
                 language === 'en' ? 'Sunflower harvest' :
                 'Күн карама жыйноо',
          type: 'harvest',
          date: '2026-02-20',
          time: '08:00',
          field: language === 'ru' ? 'Центральное поле' :
                 language === 'en' ? 'Central Field' :
                 'Борбордук талаа',
          fieldId: 5,
          description: language === 'ru' ? 'Начать уборку подсолнечника. Ожидаемая урожайность 25 ц/га.' :
                       language === 'en' ? 'Start sunflower harvest. Expected yield 25 c/ha.' :
                       'Күн карама жыйноону баштоо. Күтүлүүчү түшүм 25 ц/га.',
          status: 'planned',
          priority: 'high',
          weather: 'sunny',
          workers: 6,
          hours: 10,
          cost: 65000,
          completed: false
        },
        {
          id: 6,
          title: language === 'ru' ? 'Техосмотр техники' :
                 language === 'en' ? 'Equipment inspection' :
                 'Техниканы текшерүү',
          type: 'maintenance',
          date: '2026-02-19',
          time: '11:00',
          field: language === 'ru' ? 'Общее' :
                 language === 'en' ? 'General' :
                 'Жалпы',
          fieldId: null,
          description: language === 'ru' ? 'Плановое ТО тракторов и сеялок.' :
                       language === 'en' ? 'Scheduled maintenance of tractors and seeders.' :
                       'Тракторлордун жана сеялкалардын пландуу тейлөөсү.',
          status: 'planned',
          priority: 'medium',
          weather: 'sunny',
          workers: 2,
          hours: 4,
          cost: 20000,
          completed: false
        }
      ]);
      setLoading(false);
    }, 1000);
  }, [language]);

  // Поля для фильтра
  const fields = [
    { id: 1, name: language === 'ru' ? 'Северное поле' : language === 'en' ? 'Northern Field' : 'Түндүк талаа' },
    { id: 2, name: language === 'ru' ? 'Южное поле' : language === 'en' ? 'Southern Field' : 'Түштүк талаа' },
    { id: 3, name: language === 'ru' ? 'Западное поле' : language === 'en' ? 'Western Field' : 'Батыш талаа' },
    { id: 4, name: language === 'ru' ? 'Восточное поле' : language === 'en' ? 'Eastern Field' : 'Чыгыш талаа' },
    { id: 5, name: language === 'ru' ? 'Центральное поле' : language === 'en' ? 'Central Field' : 'Борбордук талаа' }
  ];

  // Типы событий
  const eventTypes = [
    { id: 'sowing', icon: '🌱', name: language === 'ru' ? 'Посев' : language === 'en' ? 'Sowing' : 'Себүү', color: 'bg-green-500' },
    { id: 'harvest', icon: '🌾', name: language === 'ru' ? 'Уборка' : language === 'en' ? 'Harvest' : 'Жыйноо', color: 'bg-yellow-500' },
    { id: 'treatment', icon: '🧪', name: language === 'ru' ? 'Обработка' : language === 'en' ? 'Treatment' : 'Дарылоо', color: 'bg-purple-500' },
    { id: 'irrigation', icon: '💧', name: language === 'ru' ? 'Полив' : language === 'en' ? 'Irrigation' : 'Сугаруу', color: 'bg-blue-500' },
    { id: 'maintenance', icon: '🔧', name: language === 'ru' ? 'Обслуживание' : language === 'en' ? 'Maintenance' : 'Тейлөө', color: 'bg-orange-500' }
  ];

  // Приоритеты
  const getPriorityInfo = (priority) => {
    const priorities = {
      high: {
        label: language === 'ru' ? 'Высокий' : language === 'en' ? 'High' : 'Жогорку',
        color: themeClasses.badge.high,
        icon: '🔴'
      },
      medium: {
        label: language === 'ru' ? 'Средний' : language === 'en' ? 'Medium' : 'Орточо',
        color: themeClasses.badge.medium,
        icon: '🟡'
      },
      low: {
        label: language === 'ru' ? 'Низкий' : language === 'en' ? 'Low' : 'Төмөн',
        color: themeClasses.badge.low,
        icon: '🟢'
      }
    };
    return priorities[priority] || priorities.medium;
  };

  // Получение иконки погоды
  const getWeatherIcon = (weather) => {
    const icons = {
      sunny: <Sun size={16} className="text-yellow-500" />,
      cloudy: <Cloud size={16} className="text-gray-500" />,
      rainy: <CloudRain size={16} className="text-blue-500" />
    };
    return icons[weather] || <Sun size={16} className="text-yellow-500" />;
  };

  // Навигация по месяцам
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Получение дней в месяце
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const days = [];
    const startDay = firstDay.getDay() || 7; // 1 - понедельник, 7 - воскресенье
    
    // Добавляем пустые дни в начале
    for (let i = 1; i < startDay; i++) {
      days.push(null);
    }
    
    // Добавляем дни месяца
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  // Получение событий для конкретного дня
  const getEventsForDay = (date) => {
    if (!date) return [];
    const dateStr = date.toISOString().split('T')[0];
    return events.filter(event => {
      if (filter.type !== 'all' && event.type !== filter.type) return false;
      if (filter.field !== 'all' && event.fieldId !== parseInt(filter.field)) return false;
      return event.date === dateStr;
    });
  };

  // Форматирование даты
  const formatMonth = (date) => {
    return date.toLocaleDateString(
      language === 'ru' ? 'ru-RU' : language === 'en' ? 'en-US' : 'ky-KG',
      { month: 'long', year: 'numeric' }
    );
  };

  // Статистика
  const calculateStats = () => {
    const today = new Date().toISOString().split('T')[0];
    const thisMonth = currentDate.getMonth();
    const thisYear = currentDate.getFullYear();

    const stats = {
      total: events.length,
      today: events.filter(e => e.date === today).length,
      thisMonth: events.filter(e => {
        const eventDate = new Date(e.date);
        return eventDate.getMonth() === thisMonth && eventDate.getFullYear() === thisYear;
      }).length,
      highPriority: events.filter(e => e.priority === 'high').length,
      byType: {}
    };

    events.forEach(event => {
      if (!stats.byType[event.type]) {
        stats.byType[event.type] = 0;
      }
      stats.byType[event.type]++;
    });

    return stats;
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${themeClasses.page}`}>
        <div className="text-center">
          <div className="relative">
            <div className={`w-20 h-20 border-4 rounded-full ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}></div>
            <div className="w-20 h-20 border-4 border-green-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
          </div>
          <p className={`mt-6 text-lg ${themeClasses.text.secondary}`}>
            {language === 'ru' ? 'Загружаем календарь...' :
             language === 'en' ? 'Loading calendar...' :
             'Календарь жүктөлүүдө...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-6 space-y-6 transition-colors duration-300 ${themeClasses.page}`}>
      {/* Заголовок */}
      <div className={`flex flex-col md:flex-row md:items-center md:justify-between rounded-xl p-6 shadow-sm border ${themeClasses.card}`}>
        <div>
          <h1 className={`text-2xl font-bold flex items-center ${themeClasses.text.primary}`}>
            <CalendarIcon className="mr-3 text-green-600" size={28} />
            {language === 'ru' ? '📅 Календарь работ' :
             language === 'en' ? '📅 Work Calendar' :
             '📅 Иш календары'}
          </h1>
          <p className={`mt-1 ${themeClasses.text.secondary}`}>
            {language === 'ru' ? 'Планирование и учет полевых работ' :
             language === 'en' ? 'Planning and tracking field work' :
             'Талаа иштерин пландаштыруу жана эсепке алуу'}
          </p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={18} className="mr-2" />
            {language === 'ru' ? 'Событие' :
             language === 'en' ? 'Event' :
             'Окуя'}
          </Button>
        </div>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className={`p-4 rounded-xl border hover:shadow-md transition-shadow ${themeClasses.card}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${themeClasses.text.secondary}`}>
                {language === 'ru' ? 'Всего' : language === 'en' ? 'Total' : 'Бардыгы'}
              </p>
              <p className={`text-2xl font-bold ${themeClasses.text.primary}`}>{stats.total}</p>
            </div>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${themeClasses.statCard.blue}`}>
              <CalendarIcon className="text-blue-600 dark:text-blue-400" size={20} />
            </div>
          </div>
        </div>

        <div className={`p-4 rounded-xl border hover:shadow-md transition-shadow ${themeClasses.card}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${themeClasses.text.secondary}`}>
                {language === 'ru' ? 'Сегодня' : language === 'en' ? 'Today' : 'Бүгүн'}
              </p>
              <p className={`text-2xl font-bold ${themeClasses.text.primary}`}>{stats.today}</p>
            </div>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${themeClasses.statCard.green}`}>
              <Clock className="text-green-600 dark:text-green-400" size={20} />
            </div>
          </div>
        </div>

        <div className={`p-4 rounded-xl border hover:shadow-md transition-shadow ${themeClasses.card}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${themeClasses.text.secondary}`}>
                {language === 'ru' ? 'В месяце' : language === 'en' ? 'This month' : 'Бул айда'}
              </p>
              <p className={`text-2xl font-bold ${themeClasses.text.primary}`}>{stats.thisMonth}</p>
            </div>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${themeClasses.statCard.yellow}`}>
              <Sprout className="text-yellow-600 dark:text-yellow-400" size={20} />
            </div>
          </div>
        </div>

        <div className={`p-4 rounded-xl border hover:shadow-md transition-shadow ${themeClasses.card}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${themeClasses.text.secondary}`}>
                {language === 'ru' ? 'Высокий' : language === 'en' ? 'High' : 'Жогорку'}
              </p>
              <p className={`text-2xl font-bold ${themeClasses.text.primary}`}>{stats.highPriority}</p>
            </div>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${themeClasses.statCard.red}`}>
              <AlertCircle className="text-red-600 dark:text-red-400" size={20} />
            </div>
          </div>
        </div>

        <div className={`p-4 rounded-xl border hover:shadow-md transition-shadow ${themeClasses.card}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${themeClasses.text.secondary}`}>
                {language === 'ru' ? 'Типов' : language === 'en' ? 'Types' : 'Түрлөрү'}
              </p>
              <p className={`text-2xl font-bold ${themeClasses.text.primary}`}>{Object.keys(stats.byType).length}</p>
            </div>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${themeClasses.statCard.purple}`}>
              <Leaf className="text-purple-600 dark:text-purple-400" size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Фильтры и навигация */}
      <div className={`p-4 rounded-xl border ${themeClasses.card}`}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Навигация по месяцам */}
          <div className="flex items-center space-x-2">
            <button
              onClick={prevMonth}
              className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            >
              <ChevronLeft size={20} className={themeClasses.text.secondary} />
            </button>
            <h2 className={`text-xl font-semibold min-w-[200px] text-center ${themeClasses.text.primary}`}>
              {formatMonth(currentDate)}
            </h2>
            <button
              onClick={nextMonth}
              className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            >
              <ChevronRight size={20} className={themeClasses.text.secondary} />
            </button>
            <button
              onClick={goToToday}
              className="ml-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
            >
              {language === 'ru' ? 'Сегодня' :
               language === 'en' ? 'Today' :
               'Бүгүн'}
            </button>
          </div>

          {/* Фильтры */}
          <div className="flex items-center space-x-3">
            <select
              className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 text-sm ${themeClasses.input}`}
              value={filter.type}
              onChange={(e) => setFilter({...filter, type: e.target.value})}
            >
              <option value="all">
                {language === 'ru' ? 'Все типы' : language === 'en' ? 'All types' : 'Бардык түрлөр'}
              </option>
              {eventTypes.map(type => (
                <option key={type.id} value={type.id}>
                  {type.icon} {type.name}
                </option>
              ))}
            </select>

            <select
              className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 text-sm ${themeClasses.input}`}
              value={filter.field}
              onChange={(e) => setFilter({...filter, field: e.target.value})}
            >
              <option value="all">
                {language === 'ru' ? 'Все поля' : language === 'en' ? 'All fields' : 'Бардык талаалар'}
              </option>
              {fields.map(field => (
                <option key={field.id} value={field.id}>{field.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Календарь */}
      <div className={`p-6 rounded-xl border ${themeClasses.card}`}>
        {/* Дни недели */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {[
            language === 'ru' ? 'Пн' : language === 'en' ? 'Mon' : 'Дүй',
            language === 'ru' ? 'Вт' : language === 'en' ? 'Tue' : 'Шей',
            language === 'ru' ? 'Ср' : language === 'en' ? 'Wed' : 'Шар',
            language === 'ru' ? 'Чт' : language === 'en' ? 'Thu' : 'Бей',
            language === 'ru' ? 'Пт' : language === 'en' ? 'Fri' : 'Жум',
            language === 'ru' ? 'Сб' : language === 'en' ? 'Sat' : 'Ишм',
            language === 'ru' ? 'Вс' : language === 'en' ? 'Sun' : 'Жек'
          ].map((day, index) => (
            <div
              key={index}
              className={`text-center text-sm font-semibold py-2 ${themeClasses.text.secondary}`}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Дни месяца */}
        <div className="grid grid-cols-7 gap-2">
          {getDaysInMonth(currentDate).map((date, index) => {
            const dayEvents = date ? getEventsForDay(date) : [];
            const isToday = date && date.toDateString() === new Date().toDateString();
            const isCurrentMonth = date && date.getMonth() === currentDate.getMonth();

            let dayClass = themeClasses.calendar.dayOtherMonth;
            if (date && isCurrentMonth) {
              dayClass = themeClasses.calendar.dayCurrent;
            }
            if (isToday) {
              dayClass = themeClasses.calendar.today;
            }

            return (
              <div
                key={index}
                className={`min-h-[120px] p-2 rounded-lg border-2 transition-all ${dayClass}`}
              >
                {date && (
                  <>
                    <div className={`text-sm font-medium mb-2 ${
                      isToday 
                        ? 'text-green-600' 
                        : isCurrentMonth 
                          ? themeClasses.text.primary 
                          : themeClasses.text.muted
                    }`}>
                      {date.getDate()}
                    </div>
                    <div className="space-y-1">
                      {dayEvents.slice(0, 3).map(event => {
                        const type = eventTypes.find(t => t.id === event.type);
                        const priority = getPriorityInfo(event.priority);
                        return (
                          <div
                            key={event.id}
                            onClick={() => {
                              setSelectedEvent(event);
                              setShowEventModal(true);
                            }}
                            className={`text-xs p-1.5 rounded cursor-pointer hover:opacity-80 transition-opacity ${
                              themeClasses.eventCard[event.type] || themeClasses.eventCard.sowing
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="truncate font-medium">
                                {type?.icon} {event.title}
                              </span>
                              <span>{priority.icon}</span>
                            </div>
                          </div>
                        );
                      })}
                      {dayEvents.length > 3 && (
                        <div className={`text-xs text-center mt-1 ${themeClasses.text.muted}`}>
                          +{dayEvents.length - 3} еще
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Легенда */}
      <div className={`p-4 rounded-xl border ${themeClasses.card}`}>
        <div className="flex flex-wrap items-center gap-6">
          <span className={`text-sm font-medium ${themeClasses.text.primary}`}>
            {language === 'ru' ? 'Типы событий:' : language === 'en' ? 'Event types:' : 'Окуя түрлөрү:'}
          </span>
          {eventTypes.map(type => (
            <div key={type.id} className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${type.color}`}></div>
              <span className={`text-sm ${themeClasses.text.secondary}`}>{type.icon} {type.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Модальное окно создания события */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={language === 'ru' ? '✨ Новое событие' :
               language === 'en' ? '✨ New Event' :
               '✨ Жаңы окуя'}
        size="large"
      >
        <div className="space-y-4">
          <Input
            label={language === 'ru' ? 'Название' : language === 'en' ? 'Title' : 'Аталышы'}
            placeholder={language === 'ru' ? 'Например: Посев пшеницы' :
                        language === 'en' ? 'E.g.: Wheat sowing' :
                        'Мисалы: Буудай себүү'}
            className={themeClasses.input}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-1 ${themeClasses.text.primary}`}>
                {language === 'ru' ? 'Тип' : language === 'en' ? 'Type' : 'Түрү'}
              </label>
              <select className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${themeClasses.input}`}>
                {eventTypes.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.icon} {type.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${themeClasses.text.primary}`}>
                {language === 'ru' ? 'Поле' : language === 'en' ? 'Field' : 'Талаа'}
              </label>
              <select className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${themeClasses.input}`}>
                <option value="">
                  {language === 'ru' ? 'Выберите поле' : language === 'en' ? 'Select field' : 'Талаа тандоо'}
                </option>
                {fields.map(field => (
                  <option key={field.id} value={field.id}>{field.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="date"
              label={language === 'ru' ? 'Дата' : language === 'en' ? 'Date' : 'Дата'}
              className={themeClasses.input}
            />
            <Input
              type="time"
              label={language === 'ru' ? 'Время' : language === 'en' ? 'Time' : 'Убакыт'}
              className={themeClasses.input}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${themeClasses.text.primary}`}>
              {language === 'ru' ? 'Описание' : language === 'en' ? 'Description' : 'Сүрөттөмө'}
            </label>
            <textarea
              rows={4}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${themeClasses.input}`}
              placeholder={language === 'ru' ? 'Подробное описание...' :
                          language === 'en' ? 'Detailed description...' :
                          'Толук сүрөттөмө...'}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              type="number"
              label={language === 'ru' ? 'Часы' : language === 'en' ? 'Hours' : 'Саат'}
              placeholder="0"
              icon={<Clock size={16} />}
              className={themeClasses.input}
            />
            <Input
              type="number"
              label={language === 'ru' ? 'Работники' : language === 'en' ? 'Workers' : 'Жумушчулар'}
              placeholder="0"
              icon={<Users size={16} />}
              className={themeClasses.input}
            />
            <Input
              type="number"
              label={language === 'ru' ? 'Затраты' : language === 'en' ? 'Cost' : 'Чыгымдар'}
              placeholder="0"
              icon={<DollarSign size={16} />}
              className={themeClasses.input}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-1 ${themeClasses.text.primary}`}>
                {language === 'ru' ? 'Приоритет' : language === 'en' ? 'Priority' : 'Приоритет'}
              </label>
              <select className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${themeClasses.input}`}>
                <option value="high">🔴 {language === 'ru' ? 'Высокий' : language === 'en' ? 'High' : 'Жогорку'}</option>
                <option value="medium">🟡 {language === 'ru' ? 'Средний' : language === 'en' ? 'Medium' : 'Орточо'}</option>
                <option value="low">🟢 {language === 'ru' ? 'Низкий' : language === 'en' ? 'Low' : 'Төмөн'}</option>
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${themeClasses.text.primary}`}>
                {language === 'ru' ? 'Погода' : language === 'en' ? 'Weather' : 'Аба ырайы'}
              </label>
              <select className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${themeClasses.input}`}>
                <option value="sunny">☀️ {language === 'ru' ? 'Солнечно' : language === 'en' ? 'Sunny' : 'Күн ачык'}</option>
                <option value="cloudy">☁️ {language === 'ru' ? 'Облачно' : language === 'en' ? 'Cloudy' : 'Булуттуу'}</option>
                <option value="rainy">🌧️ {language === 'ru' ? 'Дождливо' : language === 'en' ? 'Rainy' : 'Жамгырлуу'}</option>
              </select>
            </div>
          </div>

          <div className={`flex justify-end space-x-3 pt-4 border-t ${themeClasses.border}`}>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              {language === 'ru' ? 'Отмена' : language === 'en' ? 'Cancel' : 'Жокко чыгаруу'}
            </Button>
            <Button variant="primary" onClick={() => setIsModalOpen(false)}>
              <CheckCircle size={18} className="mr-2" />
              {language === 'ru' ? 'Создать' : language === 'en' ? 'Create' : 'Түзүү'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Модальное окно просмотра события */}
      <Modal
        isOpen={showEventModal}
        onClose={() => setShowEventModal(false)}
        title={selectedEvent?.title}
        size="large"
      >
        {selectedEvent && (
          <div className="space-y-6">
            {/* Шапка */}
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-white text-3xl shadow-lg ${
                  eventTypes.find(t => t.id === selectedEvent.type)?.color
                }`}>
                  {eventTypes.find(t => t.id === selectedEvent.type)?.icon}
                </div>
                <div className="ml-4">
                  <div className="flex items-center gap-2">
                    <h3 className={`text-xl font-semibold ${themeClasses.text.primary}`}>{selectedEvent.title}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${getPriorityInfo(selectedEvent.priority).color}`}>
                      {getPriorityInfo(selectedEvent.priority).icon} {getPriorityInfo(selectedEvent.priority).label}
                    </span>
                  </div>
                  <div className={`flex items-center gap-4 mt-2 text-sm ${themeClasses.text.secondary}`}>
                    <span className="flex items-center">
                      <CalendarIcon size={14} className="mr-1" />
                      {new Date(selectedEvent.date).toLocaleDateString(
                        language === 'ru' ? 'ru-RU' : language === 'en' ? 'en-US' : 'ky-KG',
                        { day: 'numeric', month: 'long' }
                      )}
                    </span>
                    <span className="flex items-center">
                      <Clock size={14} className="mr-1" />
                      {selectedEvent.time}
                    </span>
                    <span className="flex items-center">
                      <MapPin size={14} className="mr-1" />
                      {selectedEvent.field}
                    </span>
                  </div>
                </div>
              </div>
              
              {selectedEvent.cost > 0 && (
                <div className={`px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-green-900/30' : 'bg-green-50'}`}>
                  <p className={`text-sm ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
                    {language === 'ru' ? 'Бюджет' : language === 'en' ? 'Budget' : 'Бюджет'}
                  </p>
                  <p className={`text-xl font-bold ${theme === 'dark' ? 'text-green-400' : 'text-green-700'}`}>
                    {selectedEvent.cost.toLocaleString()} som
                  </p>
                </div>
              )}
            </div>

            {/* Описание */}
            <div className={`p-6 rounded-xl ${themeClasses.detailBlock}`}>
              <h4 className={`text-sm font-medium mb-3 flex items-center ${themeClasses.text.primary}`}>
                <span className="mr-2">📝</span>
                {language === 'ru' ? 'Описание' : language === 'en' ? 'Description' : 'Сүрөттөмө'}
              </h4>
              <p className={`leading-relaxed ${themeClasses.text.secondary}`}>
                {selectedEvent.description}
              </p>
            </div>

            {/* Детали */}
            <div className="grid grid-cols-3 gap-4">
              {selectedEvent.hours > 0 && (
                <div className={`p-4 rounded-xl text-center ${themeClasses.detailBlock}`}>
                  <Clock size={24} className={`mx-auto mb-2 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
                  <p className={`text-sm ${themeClasses.text.secondary}`}>
                    {language === 'ru' ? 'Часов' : language === 'en' ? 'Hours' : 'Саат'}
                  </p>
                  <p className={`text-2xl font-bold ${themeClasses.text.primary}`}>{selectedEvent.hours}</p>
                </div>
              )}
              
              {selectedEvent.workers > 0 && (
                <div className={`p-4 rounded-xl text-center ${themeClasses.detailBlock}`}>
                  <Users size={24} className={`mx-auto mb-2 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} />
                  <p className={`text-sm ${themeClasses.text.secondary}`}>
                    {language === 'ru' ? 'Работники' : language === 'en' ? 'Workers' : 'Жумушчулар'}
                  </p>
                  <p className={`text-2xl font-bold ${themeClasses.text.primary}`}>{selectedEvent.workers}</p>
                </div>
              )}
              
              <div className={`p-4 rounded-xl text-center ${themeClasses.detailBlock}`}>
                {getWeatherIcon(selectedEvent.weather)}
                <p className={`text-sm mt-2 ${themeClasses.text.secondary}`}>
                  {language === 'ru' ? 'Погода' : language === 'en' ? 'Weather' : 'Аба ырайы'}
                </p>
                <p className={`text-lg font-bold ${themeClasses.text.primary}`}>
                  {selectedEvent.weather === 'sunny' ? (language === 'ru' ? 'Солнечно' : language === 'en' ? 'Sunny' : 'Күн ачык') :
                   selectedEvent.weather === 'cloudy' ? (language === 'ru' ? 'Облачно' : language === 'en' ? 'Cloudy' : 'Булуттуу') :
                   (language === 'ru' ? 'Дождливо' : language === 'en' ? 'Rainy' : 'Жамгырлуу')}
                </p>
              </div>
            </div>

            {/* Кнопки */}
            <div className={`flex justify-end space-x-3 pt-6 border-t ${themeClasses.border}`}>
              <Button variant="outline" onClick={() => setShowEventModal(false)}>
                {language === 'ru' ? 'Закрыть' : language === 'en' ? 'Close' : 'Жабуу'}
              </Button>
              <Button variant="primary">
                <Edit2 size={16} className="mr-2" />
                {language === 'ru' ? 'Редактировать' : language === 'en' ? 'Edit' : 'Оңдоо'}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CalendarPage;