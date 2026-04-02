// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../hooks/useAuth';
import { useAvatar } from '../contexts/AvatarContext';
import { useTheme } from '../contexts/ThemeContext'; // ✅ Добавляем тему
import fieldsAPI from '../services/api/fieldsAPI';
import tasksAPI from '../services/api/tasksAPI';
import animalsAPI from '../services/api/animalsAPI';
import resourcesAPI from '../services/api/resourcesAPI';
import diaryAPI from '../services/api/diaryAPI';
import userAPI from '../services/api/userAPI';
import { 
  MapPin, Calendar, Clock, Users, DollarSign, Target,
  TrendingUp, TrendingDown, Activity, Award, Bell,
  BarChart3,
  Settings, BookOpen, Calendar as CalendarIcon, Plus,
  Download, Search, ChevronRight, AlertCircle, CheckCircle,
  ShoppingCart, Warehouse, MoreVertical,
  Droplets, Sprout, Wind, Sun, Cloud, CloudRain,
  Timer, RefreshCw, Sparkles, PawPrint, Beef, Bird, Package,
  Leaf, AlertTriangle, Eye, Home, Tractor, Wheat, Coffee,
  Egg, Milk, Heart, Thermometer, Wind as WindIcon, Battery,
  Cpu, HardDrive, Zap, Globe, ThumbsUp, MessageCircle
} from 'lucide-react';

// Компонент карточки статистики - с поддержкой темы
const StatsCard = ({ title, value, change, icon, color, formatValue, loading }) => {
  const { theme } = useTheme();
  const isPositive = change >= 0;
  
  // Статические классы для каждого цвета (адаптированные под тему)
  const getBgColor = () => {
    if (theme === 'dark') {
      switch(color) {
        case 'blue': return 'bg-blue-900/30';
        case 'green': return 'bg-green-900/30';
        case 'purple': return 'bg-purple-900/30';
        case 'yellow': return 'bg-yellow-900/30';
        case 'orange': return 'bg-orange-900/30';
        case 'emerald': return 'bg-emerald-900/30';
        case 'indigo': return 'bg-indigo-900/30';
        default: return 'bg-gray-800';
      }
    } else {
      switch(color) {
        case 'blue': return 'bg-blue-100';
        case 'green': return 'bg-green-100';
        case 'purple': return 'bg-purple-100';
        case 'yellow': return 'bg-yellow-100';
        case 'orange': return 'bg-orange-100';
        case 'emerald': return 'bg-emerald-100';
        case 'indigo': return 'bg-indigo-100';
        default: return 'bg-gray-100';
      }
    }
  };

  const getTextColor = () => {
    if (theme === 'dark') {
      switch(color) {
        case 'blue': return 'text-blue-400';
        case 'green': return 'text-green-400';
        case 'purple': return 'text-purple-400';
        case 'yellow': return 'text-yellow-400';
        case 'orange': return 'text-orange-400';
        case 'emerald': return 'text-emerald-400';
        case 'indigo': return 'text-indigo-400';
        default: return 'text-gray-400';
      }
    } else {
      switch(color) {
        case 'blue': return 'text-blue-600';
        case 'green': return 'text-green-600';
        case 'purple': return 'text-purple-600';
        case 'yellow': return 'text-yellow-600';
        case 'orange': return 'text-orange-600';
        case 'emerald': return 'text-emerald-600';
        case 'indigo': return 'text-indigo-600';
        default: return 'text-gray-600';
      }
    }
  };

  return (
    <div className={`rounded-xl p-6 shadow-sm border transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' 
        : 'bg-white border-gray-100 hover:shadow-md'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl ${getBgColor()} flex items-center justify-center`}>
          <div className={getTextColor()}>{icon}</div>
        </div>
        {loading ? (
          <div className={`w-16 h-6 rounded animate-pulse ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
          }`}></div>
        ) : (
          <div className={`flex items-center ${isPositive ? 'text-green-600' : 'text-red-600'} text-sm font-medium`}>
            {isPositive ? <TrendingUp size={16} className="mr-1" /> : <TrendingDown size={16} className="mr-1" />}
            {Math.abs(change)}%
          </div>
        )}
      </div>
      <p className={`text-sm mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{title}</p>
      {loading ? (
        <div className={`w-24 h-8 rounded animate-pulse ${
          theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
        }`}></div>
      ) : (
        <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          {formatValue ? formatValue(value) : value}
        </p>
      )}
    </div>
  );
};

// Компонент сетки статистики
const StatsGrid = ({ children }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    {children}
  </div>
);

// Компонент аватара с предпросмотром
const AvatarWithPreview = () => {
  const { avatar } = useAvatar();
  const { user } = useAuth();
  const { theme } = useTheme();
  const [imageError, setImageError] = useState(false);

  return (
    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-3xl shadow-lg overflow-hidden ${
      theme === 'dark' ? 'ring-2 ring-green-800' : ''
    }`}>
      {avatar && !imageError ? (
        <img 
          key={avatar}
          src={avatar} 
          alt="avatar" 
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <span>{user?.name?.[0] || '🌾'}</span>
      )}
    </div>
  );
};

// Компонент реального времени - с поддержкой темы
const RealTimeClock = () => {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString(language === 'ru' ? 'ru-RU' : language === 'en' ? 'en-US' : 'ky-KG', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString(language === 'ru' ? 'ru-RU' : language === 'en' ? 'en-US' : 'ky-KG', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className={`rounded-xl p-4 shadow-sm border transition-colors duration-300 ${
      theme === 'dark'
        ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700'
        : 'bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-100'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-md ${
            theme === 'dark' ? 'bg-indigo-800' : 'bg-indigo-600'
          }`}>
            <Timer size={20} className="text-white" />
          </div>
          <div>
            <h3 className={`text-sm font-medium ${
              theme === 'dark' ? 'text-indigo-300' : 'text-indigo-800'
            }`}>
              {language === 'ru' ? 'Текущее время' : 
               language === 'en' ? 'Current Time' : 
               'Учурдагы убакыт'}
            </h3>
            <p className={`text-2xl font-bold font-mono ${
              theme === 'dark' ? 'text-white' : 'text-indigo-900'
            }`}>
              {formatTime(currentTime)}
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <p className={`text-sm font-medium ${
            theme === 'dark' ? 'text-indigo-300' : 'text-indigo-800'
          }`}>
            {formatDate(currentTime)}
          </p>
        </div>
      </div>
    </div>
  );
};

// Основной компонент Dashboard
const Dashboard = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const { theme } = useTheme(); // ✅ Получаем тему
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState('');
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  
  // Состояния для данных из БД
  const [stats, setStats] = useState({
    fields: { total: 0, totalArea: 0, active: 0 },
    tasks: { total: 0, completed: 0, pending: 0, overdue: 0 },
    animals: { total: 0, cattle: 0, sheep: 0, poultry: 0 },
    resources: { total: 0, totalValue: 0, lowStock: 0 },
    diary: { total: 0, important: 0 },
    equipment: { total: 0, active: 0, maintenance: 0 },
    crops: { total: 0, totalArea: 0 },
    employees: { total: 0, active: 0 }
  });
  
  const [recentTasks, setRecentTasks] = useState([]);
  const [upcomingHarvests, setUpcomingHarvests] = useState([]);
  const [lowStockResources, setLowStockResources] = useState([]);
  const [recentDiary, setRecentDiary] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [userStats, setUserStats] = useState({});
  const [notifications, setNotifications] = useState([]);

  // Классы для темы
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
    button: {
      primary: 'bg-green-600 hover:bg-green-700 text-white',
      secondary: theme === 'dark'
        ? 'border-gray-700 hover:bg-gray-700 text-gray-300'
        : 'border-gray-200 hover:bg-gray-50 text-gray-600',
    },
    input: theme === 'dark'
      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
      : 'bg-white border-gray-200 text-gray-900',
    border: theme === 'dark' ? 'border-gray-700' : 'border-gray-200',
  };

  // Переводы для страницы
  const pageText = {
    greeting: {
      morning: {
        ru: 'Доброе утро',
        en: 'Good morning',
        kg: 'Кутман таң'
      },
      afternoon: {
        ru: 'Добрый день',
        en: 'Good afternoon',
        kg: 'Куттуу күн'
      },
      evening: {
        ru: 'Добрый вечер',
        en: 'Good evening',
        kg: 'Кутман кеч'
      }
    },
    role: {
      ru: 'Фермер',
      en: 'Farmer',
      kg: 'Фермер'
    },
    search: {
      ru: '🔍 Поиск...',
      en: '🔍 Search...',
      kg: '🔍 Издөө...'
    },
    export: {
      ru: 'Экспорт',
      en: 'Export',
      kg: 'Экспорт'
    },
    addTask: {
      ru: 'Задача',
      en: 'Task',
      kg: 'Тапшырма'
    },
    refresh: {
      ru: 'Обновить',
      en: 'Refresh',
      kg: 'Жаңыртуу'
    },
    stats: {
      totalArea: {
        ru: 'Общая площадь',
        en: 'Total Area',
        kg: 'Жалпы аянт'
      },
      activeTasks: {
        ru: 'Активных задач',
        en: 'Active Tasks',
        kg: 'Активдүү тапшырмалар'
      },
      totalAnimals: {
        ru: 'Всего животных',
        en: 'Total Animals',
        kg: 'Бардык жаныбарлар'
      },
      resourcesValue: {
        ru: 'Запасы',
        en: 'Resources',
        kg: 'Ресурстар'
      },
      equipment: {
        ru: 'Техника',
        en: 'Equipment',
        kg: 'Техника'
      },
      crops: {
        ru: 'Культуры',
        en: 'Crops',
        kg: 'Өсүмдүктөр'
      },
      employees: {
        ru: 'Сотрудники',
        en: 'Employees',
        kg: 'Кызматкерлер'
      }
    },
    sections: {
      todayTasks: {
        ru: 'Задачи на сегодня',
        en: "Today's Tasks",
        kg: 'Бүгүнкү тапшырмалар'
      },
      active: {
        ru: 'активных',
        en: 'active',
        kg: 'активдүү'
      },
      allTasks: {
        ru: 'Все задачи',
        en: 'All Tasks',
        kg: 'Бардык тапшырмалар'
      },
      noTasks: {
        ru: 'Нет задач',
        en: 'No tasks',
        kg: 'Тапшырма жок'
      },
      upcomingHarvests: {
        ru: 'Ближайшие сборы',
        en: 'Upcoming Harvests',
        kg: 'Жакынкы түшүмдөр'
      },
      daysLeft: {
        ru: 'дней',
        en: 'days',
        kg: 'күн'
      },
      view: {
        ru: 'Смотреть',
        en: 'View',
        kg: 'Көрүү'
      },
      recentDiary: {
        ru: 'Последние записи',
        en: 'Recent Diary',
        kg: 'Акыркы жазуулар'
      },
      viewAll: {
        ru: 'Все',
        en: 'All',
        kg: 'Баары'
      },
      livestock: {
        ru: 'Животноводство',
        en: 'Livestock',
        kg: 'Мал чарбасы'
      },
      total: {
        ru: 'Всего',
        en: 'Total',
        kg: 'Бардыгы'
      },
      cattle: {
        ru: 'КРС',
        en: 'Cattle',
        kg: 'Ири мүйүздүү'
      },
      sheep: {
        ru: 'Овцы',
        en: 'Sheep',
        kg: 'Кой'
      },
      poultry: {
        ru: 'Птица',
        en: 'Poultry',
        kg: 'Куш'
      },
      manageAnimals: {
        ru: 'Управление',
        en: 'Manage',
        kg: 'Башкаруу'
      },
      lowStock: {
        ru: 'Заканчиваются',
        en: 'Low Stock',
        kg: 'Бүтүп баратат'
      },
      allGood: {
        ru: 'Все в норме',
        en: 'All good',
        kg: 'Баары жакшы'
      },
      manageResources: {
        ru: 'Управление',
        en: 'Manage',
        kg: 'Башкаруу'
      },
      lastUpdated: {
        ru: 'Последнее обновление',
        en: 'Last updated',
        kg: 'Акыркы жаңыртуу'
      },
      equipment: {
        ru: 'Техника',
        en: 'Equipment',
        kg: 'Техника'
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
      },
      manageEquipment: {
        ru: 'Управление техникой',
        en: 'Manage equipment',
        kg: 'Техниканы башкаруу'
      },
      crops: {
        ru: 'Культуры',
        en: 'Crops',
        kg: 'Өсүмдүктөр'
      },
      totalCrops: {
        ru: 'Всего культур',
        en: 'Total crops',
        kg: 'Бардык өсүмдүктөр'
      },
      cropArea: {
        ru: 'Площадь',
        en: 'Area',
        kg: 'Аянт'
      },
      manageCrops: {
        ru: 'Управление культурами',
        en: 'Manage crops',
        kg: 'Өсүмдүктөрдү башкаруу'
      },
      employees: {
        ru: 'Сотрудники',
        en: 'Employees',
        kg: 'Кызматкерлер'
      },
      activeEmployees: {
        ru: 'Активные',
        en: 'Active',
        kg: 'Активдүү'
      },
      onLeave: {
        ru: 'В отпуске',
        en: 'On leave',
        kg: 'Өргүүдө'
      },
      manageEmployees: {
        ru: 'Управление сотрудниками',
        en: 'Manage employees',
        kg: 'Кызматкерлерди башкаруу'
      },
      recentActivities: {
        ru: 'Последние активности',
        en: 'Recent Activities',
        kg: 'Акыркы активдүүлүктөр'
      },
      notifications: {
        ru: 'Уведомления',
        en: 'Notifications',
        kg: 'Эскертүүлөр'
      },
      viewAllNotifications: {
        ru: 'Все уведомления',
        en: 'All notifications',
        kg: 'Бардык эскертүүлөр'
      },
      markAllRead: {
        ru: 'Прочитать все',
        en: 'Mark all read',
        kg: 'Баарын окулган деп белгилөө'
      }
    },
    status: {
      completed: {
        ru: 'Завершено',
        en: 'Completed',
        kg: 'Аякталган'
      },
      pending: {
        ru: 'В процессе',
        en: 'Pending',
        kg: 'Күтүүдө'
      },
      overdue: {
        ru: 'Просрочено',
        en: 'Overdue',
        kg: 'Кечиктирилген'
      }
    },
    ha: {
      ru: 'га',
      en: 'ha',
      kg: 'га'
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return pageText.greeting.morning[language];
    if (hour < 18) return pageText.greeting.afternoon[language];
    return pageText.greeting.evening[language];
  };

  // Загрузка всех данных
  useEffect(() => {
    loadDashboardData();
    setGreeting(getGreeting());
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Параллельная загрузка всех данных
      const [
        fieldsRes,
        tasksRes,
        animalsRes,
        resourcesRes,
        diaryRes,
        userStatsRes,
        equipmentRes,
        cropsRes,
        employeesRes
      ] = await Promise.all([
        fieldsAPI.getAll().catch(() => ({ fields: [] })),
        tasksAPI.getAll().catch(() => ({ tasks: [] })),
        animalsAPI.getAll().catch(() => ({ animals: [] })),
        resourcesAPI.getAll().catch(() => ({ resources: [] })),
        diaryAPI.getEntries().catch(() => ({ data: { entries: [] } })),
        userAPI.getUserStats().catch(() => ({ data: {} })),
        fetch('/api/equipment').then(res => res.json()).catch(() => ({ equipment: [] })),
        fetch('/api/crops').then(res => res.json()).catch(() => ({ crops: [] })),
        fetch('/api/employees').then(res => res.json()).catch(() => ({ employees: [] }))
      ]);

      // Обработка данных полей
      const fields = fieldsRes.fields || [];
      const activeFields = fields.filter(f => 
        ['planted', 'growing', 'flowering'].includes(f.status)
      ).length;

      // Обработка задач
      const tasks = tasksRes.tasks || [];
      const now = new Date();
      const overdueTasks = tasks.filter(t => 
        t.status !== 'completed' && new Date(t.endDate) < now
      ).length;

      // Обработка животных
      const animals = animalsRes.animals || [];

      // Обработка ресурсов
      const resources = resourcesRes.resources || [];
      const lowStock = resources.filter(r => r.status === 'warning' || r.status === 'critical');
      const totalValue = resources.reduce((sum, r) => sum + (r.totalValue || 0), 0);

      // Обработка дневника
      const diaryEntries = diaryRes.data?.entries || [];

      // Обработка техники
      const equipment = equipmentRes.equipment || [];

      // Обработка культур
      const crops = cropsRes.crops || [];

      // Обработка сотрудников
      const employees = employeesRes.employees || [];

      // Обновляем статистику
      setStats({
        fields: {
          total: fields.length,
          totalArea: fields.reduce((sum, f) => sum + (f.area || 0), 0),
          active: activeFields
        },
        tasks: {
          total: tasks.length,
          completed: tasks.filter(t => t.status === 'completed').length,
          pending: tasks.filter(t => t.status === 'pending').length,
          overdue: overdueTasks
        },
        animals: {
          total: animals.length,
          cattle: animals.filter(a => a.type === 'cattle').length,
          sheep: animals.filter(a => a.type === 'sheep' || a.type === 'goat').length,
          poultry: animals.filter(a => a.type === 'poultry').length
        },
        resources: {
          total: resources.length,
          totalValue,
          lowStock: lowStock.length
        },
        diary: {
          total: diaryEntries.length,
          important: diaryEntries.filter(d => d.important).length
        },
        equipment: {
          total: equipment.length,
          active: equipment.filter(e => e.status === 'available').length,
          maintenance: equipment.filter(e => e.status === 'maintenance').length
        },
        crops: {
          total: crops.length,
          totalArea: crops.reduce((sum, c) => sum + (c.area || 0), 0)
        },
        employees: {
          total: employees.length,
          active: employees.filter(e => e.status === 'active').length
        }
      });

      // Последние задачи
      setRecentTasks(tasks.slice(0, 5));

      // Ближайшие сборы урожая
      const harvests = fields
        .filter(f => f.expectedHarvestDate)
        .map(f => ({
          id: f._id,
          name: f.name,
          cropType: f.cropType,
          date: f.expectedHarvestDate,
          daysLeft: Math.ceil((new Date(f.expectedHarvestDate) - now) / (1000 * 60 * 60 * 24))
        }))
        .filter(h => h.daysLeft > 0)
        .sort((a, b) => a.daysLeft - b.daysLeft)
        .slice(0, 3);
      setUpcomingHarvests(harvests);

      // Ресурсы с низким запасом
      setLowStockResources(lowStock.slice(0, 3));

      // Последние записи дневника
      setRecentDiary(diaryEntries.slice(0, 3));

      // Последние активности
      const activities = [
        ...tasks.slice(0, 2).map(t => ({ type: 'task', data: t })),
        ...diaryEntries.slice(0, 2).map(d => ({ type: 'diary', data: d }))
      ].sort((a, b) => new Date(b.data.updatedAt) - new Date(a.data.updatedAt)).slice(0, 4);
      setRecentActivities(activities);

      // Уведомления
      const notifs = [];
      if (overdueTasks > 0) {
        notifs.push({
          id: 1,
          type: 'warning',
          title: language === 'ru' ? 'Просроченные задачи' : 
                 language === 'en' ? 'Overdue tasks' : 
                 'Кечиктирилген тапшырмалар',
          message: language === 'ru' ? `У вас ${overdueTasks} просроченных задач` :
                   language === 'en' ? `You have ${overdueTasks} overdue tasks` :
                   `Сизде ${overdueTasks} кечиктирилген тапшырма бар`,
          time: new Date()
        });
      }
      if (lowStock.length > 0) {
        notifs.push({
          id: 2,
          type: 'info',
          title: language === 'ru' ? 'Заканчиваются ресурсы' :
                 language === 'en' ? 'Low stock resources' :
                 'Ресурстар бүтүп баратат',
          message: language === 'ru' ? `${lowStock.length} ресурсов заканчиваются` :
                   language === 'en' ? `${lowStock.length} resources are low` :
                   `${lowStock.length} ресурстар бүтүп баратат`,
          time: new Date()
        });
      }
      setNotifications(notifs);

      // Статистика пользователя
      setUserStats(userStatsRes.data || {});

      setLastUpdated(new Date());

    } catch (error) {
      console.error('Ошибка загрузки данных дашборда:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'KGS',
    minimumFractionDigits: 0,
    currencyDisplay: 'symbol'
  }).format(amount).replace('KGS', 'сом');
};


  const statsCards = [
    {
      title: pageText.stats.totalArea[language],
      value: stats.fields.totalArea,
      change: 2.5,
      icon: <MapPin size={20} />,
      color: 'blue',
      formatValue: (v) => `${v.toFixed(1)} ${pageText.ha[language]}`
    },
    {
      title: pageText.stats.activeTasks[language],
      value: stats.tasks.pending,
      change: 1.8,
      icon: <Target size={20} />,
      color: 'green',
      formatValue: (v) => v
    },
    {
      title: pageText.stats.totalAnimals[language],
      value: stats.animals.total,
      change: 3.2,
      icon: <PawPrint size={20} />,
      color: 'purple',
      formatValue: (v) => v
    },
    {
      title: pageText.stats.resourcesValue[language],
      value: stats.resources.totalValue,
      change: 12.5,
      icon: <Package size={20} />,
      color: 'yellow',
      formatValue: (v) => formatCurrency(v)
    },
    {
      title: pageText.stats.equipment[language],
      value: stats.equipment.total,
      change: 0,
      icon: <Tractor size={20} />,
      color: 'orange',
      formatValue: (v) => v
    },
    {
      title: pageText.stats.crops[language],
      value: stats.crops.total,
      change: 5.2,
      icon: <Wheat size={20} />,
      color: 'emerald',
      formatValue: (v) => v
    },
    {
      title: pageText.stats.employees[language],
      value: stats.employees.total,
      change: 2.1,
      icon: <Users size={20} />,
      color: 'indigo',
      formatValue: (v) => v
    }
  ];

  const getStatusColor = (status) => {
    if (theme === 'dark') {
      switch(status) {
        case 'completed': return 'text-green-400 bg-green-900/30';
        case 'pending': return 'text-yellow-400 bg-yellow-900/30';
        case 'overdue': return 'text-red-400 bg-red-900/30';
        default: return 'text-gray-400 bg-gray-800';
      }
    } else {
      switch(status) {
        case 'completed': return 'text-green-600 bg-green-100';
        case 'pending': return 'text-yellow-600 bg-yellow-100';
        case 'overdue': return 'text-red-600 bg-red-100';
        default: return 'text-gray-600 bg-gray-100';
      }
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'completed': return pageText.status.completed[language];
      case 'pending': return pageText.status.pending[language];
      case 'overdue': return pageText.status.overdue[language];
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${themeClasses.page}`}>
        <div className="text-center">
          <RefreshCw size={40} className="animate-spin text-green-600 mx-auto mb-4" />
          <p className={themeClasses.text.secondary}>
            {language === 'ru' ? 'Загрузка дашборда...' : 
             language === 'en' ? 'Loading dashboard...' : 
             'Дашборд жүктөлүүдө...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 transition-colors duration-300 ${themeClasses.page}`}>
      {/* Верхняя панель */}
      <div className={`rounded-2xl p-6 shadow-sm border transition-colors duration-300 ${themeClasses.card}`}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center space-x-4">
            <AvatarWithPreview />
            
            <div>
              <div className="flex items-center space-x-2">
                <h1 className={`text-2xl font-bold ${themeClasses.text.primary}`}>
                  {greeting}, {user?.name || 'Фермер'}!
                </h1>
                <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full font-medium">
                  {pageText.role[language]}
                </span>
              </div>
              <p className={`mt-1 flex items-center ${themeClasses.text.secondary}`}>
                <CalendarIcon size={16} className="mr-2 text-green-500" />
                {new Date().toLocaleDateString(language === 'ru' ? 'ru-RU' : language === 'en' ? 'en-US' : 'ky-KG', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 mt-4 lg:mt-0">
            <button 
              onClick={loadDashboardData}
              className={`p-2 border rounded-xl transition-colors ${themeClasses.button.secondary}`}
              title={pageText.refresh[language]}
            >
              <RefreshCw size={18} />
            </button>
            
            <div className="relative">
              <input
                type="text"
                placeholder={pageText.search[language]}
                className={`pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-green-500 w-64 transition-colors ${themeClasses.input}`}
              />
              <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
            </div>
            
            <button 
              onClick={() => navigate('/reports')}
              className={`px-4 py-2 border rounded-xl transition-colors flex items-center ${themeClasses.button.secondary}`}
            >
              <Download size={18} className="mr-2" />
              {pageText.export[language]}
            </button>
            
            <button 
              onClick={() => navigate('/tasks/new')}
              className={`px-4 py-2 rounded-xl transition-colors flex items-center ${themeClasses.button.primary}`}
            >
              <Plus size={18} className="mr-2" />
              {pageText.addTask[language]}
            </button>
          </div>
        </div>
      </div>

      {/* Реальное время */}
      <RealTimeClock />

      {/* Статистика */}
      <StatsGrid>
        {statsCards.map((stat, i) => (
          <StatsCard
            key={i}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            icon={stat.icon}
            color={stat.color}
            formatValue={stat.formatValue}
            loading={loading}
          />
        ))}
      </StatsGrid>

      {/* Остальная часть (нужно добавить аналогично) */}
      
    </div>
  );
};

export default Dashboard;