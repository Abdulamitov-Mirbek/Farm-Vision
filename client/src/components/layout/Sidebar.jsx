// src/components/layout/Sidebar.jsx
import React, { useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAvatar } from '../../contexts/AvatarContext';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  Bot, 
  Sparkles, 
  PawPrint, 
  Home, 
  Map, 
  BookOpen, 
  Calendar,
  BarChart3,
  FileText,
  Cloud,
  CheckSquare,
  ClipboardList,
  Tractor,
  Users,
  Handshake,
  Sprout,
  Settings,
  LogOut,
  DollarSign,
  CreditCard,
  TrendingUp,
  Moon,
  Sun
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const { language } = useLanguage();
  const { avatar } = useAvatar();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // 🔍 ОТЛАДКА - проверяем данные пользователя
  console.log('👤 User в Sidebar:', user);
  console.log('🔑 user.role:', user?.role);
  console.log('🔑 user.isAdmin:', user?.isAdmin);

  // Проверяем роль пользователя
  const isAdmin = user?.role === 'admin' || user?.isAdmin === true;
  const isWorker = user?.role === 'worker' || user?.role === 'employee';

  // 🔍 Дополнительная отладка
  console.log('👑 isAdmin (итог):', isAdmin);
  console.log('👷 isWorker (итог):', isWorker);

  // Функция для выхода
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Ошибка при выходе:', error);
    }
  };

  // Тексты для сайдбара на разных языках
  const sidebarText = {
    // Разделы
    home: {
      ru: "ГЛАВНАЯ",
      en: "HOME",
      kg: "БАШКЫ"
    },
    livestock: {
      ru: "ЖИВОТНОВОДСТВО",
      en: "LIVESTOCK",
      kg: "МАЛ ЧАРБАСЫ"
    },
    analytics: {
      ru: "АНАЛИТИКА",
      en: "ANALYTICS",
      kg: "АНАЛИТИКА"
    },
    planning: {
      ru: "ПЛАНИРОВАНИЕ",
      en: "PLANNING",
      kg: "ПЛАНДОО"
    },
    directories: {
      ru: "СПРАВОЧНИКИ",
      en: "DIRECTORIES",
      kg: "СПРАВОЧНИКТЕР"
    },
    finance: {
      ru: "ФИНАНСЫ",
      en: "FINANCE",
      kg: "КАРЖЫ"
    },
    
    // Пункты меню
    dashboard: {
      ru: "ПАНЕЛЬ ИНФОРМАЦИИ",
      en: "DASHBOARD",
      kg: "КӨРСӨТҮҮ ТАКТАСЫ"
    },
    fields: {
      ru: "Поля",
      en: "Fields",
      kg: "Талаалар"
    },
    diary: {
      ru: "ДНЕВНИК",
      en: "DIARY",
      kg: "КҮНДӨЛҮК"
    },
    calendar: {
      ru: "Календарь",
      en: "Calendar",
      kg: "Календарь"
    },
    animals: {
      ru: "Животные",
      en: "Animals",
      kg: "Жаныбарлар"
    },
    reports: {
      ru: "Отчеты",
      en: "Reports",
      kg: "Отчеттор"
    },
    forecasts: {
      ru: "Прогнозы",
      en: "Forecasts",
      kg: "Болжолдор"
    },
    tasks: {
      ru: "Задачи на неделю",
      en: "Weekly tasks",
      kg: "Апталык тапшырмалар"
    },
    weeklyTasks: {
      ru: "Задачи на неделю",
      en: "Weekly tasks",
      kg: "Апталык тапшырмалар"
    },
    workPlan: {
      ru: "План работ",
      en: "Work Plan",
      kg: "Иш планы"
    },
    resources: {
      ru: "Ресурсы",
      en: "Resources",
      kg: "Ресурстар"
    },
    crops: {
      ru: "Культуры",
      en: "Crops",
      kg: "Өсүмдүктөр"
    },
    equipment: {
      ru: "Техника",
      en: "Equipment",
      kg: "Техника"
    },
    employees: {
      ru: "Сотрудники",
      en: "Employees",
      kg: "Кызматкерлер"
    },
    suppliers: {
      ru: "Поставщики",
      en: "Suppliers",
      kg: "Жеткирүүчүлөр"
    },
    financeOverview: {
      ru: "Обзор финансов",
      en: "Finance Overview",
      kg: "Каржы обзору"
    },
    transactions: {
      ru: "Транзакции",
      en: "Transactions",
      kg: "Транзакциялар"
    },
    budget: {
      ru: "Бюджет",
      en: "Budget",
      kg: "Бюджет"
    },
    financeReports: {
      ru: "Отчеты",
      en: "Reports",
      kg: "Отчеттор"
    },
    income: {
      ru: "Доходы",
      en: "Income",
      kg: "Кирешелер"
    },
    expenses: {
      ru: "Расходы",
      en: "Expenses",
      kg: "Чыгашалар"
    },
    
    // Статистика
    quickStats: {
      ru: "Краткая статистика",
      en: "Quick stats",
      kg: "Кыскача статистика"
    },
    activeFields: {
      ru: "Активных полей",
      en: "Active fields",
      kg: "Активдүү талаалар"
    },
    tasksToday: {
      ru: "Задач на сегодня",
      en: "Tasks today",
      kg: "Бүгүнкү тапшырмалар"
    },
    monthlyExpenses: {
      ru: "Расходы за месяц",
      en: "Monthly expenses",
      kg: "Айлык чыгымдар"
    },
    yieldForecast: {
      ru: "Прогноз урожая",
      en: "Yield forecast",
      kg: "Түшүм болжолу"
    },
    monthlyIncome: {
      ru: "Доход за месяц",
      en: "Monthly income",
      kg: "Айлык киреше"
    },
    
    // Кнопки
    logout: {
      ru: "Выйти",
      en: "Logout",
      kg: "Чыгуу"
    },
    
    // AI Assistant
    aiAssistant: {
      ru: "AI Ассистент",
      en: "AI Assistant",
      kg: "AI Жардамчы"
    },
    
    // Активность
    activity: {
      ru: "Уровень активности",
      en: "Activity level",
      kg: "Активдүүлүк деңгээли"
    },
    
    // Сообщения о доступе
    adminOnly: {
      ru: "Только для администратора",
      en: "Admin only",
      kg: "Админ үчүн гана"
    },
    financeAccess: {
      ru: "Доступ к финансам",
      en: "Finance access",
      kg: "Каржыга кирүү"
    },
    
    // Тема
    theme: {
      ru: "Тема",
      en: "Theme",
      kg: "Тема"
    },
    light: {
      ru: "Светлая",
      en: "Light",
      kg: "Жарык"
    },
    dark: {
      ru: "Темная",
      en: "Dark",
      kg: "Караңгы"
    }
  };

  // Классы для темной/светлой темы
  const themeClasses = {
    sidebar: theme === 'dark' 
      ? 'bg-gray-900 border-gray-700 text-white' 
      : 'bg-white border-gray-200 text-gray-900',
    border: theme === 'dark' ? 'border-gray-700' : 'border-gray-200',
    text: {
      primary: theme === 'dark' ? 'text-white' : 'text-gray-900',
      secondary: theme === 'dark' ? 'text-gray-400' : 'text-gray-600',
      muted: theme === 'dark' ? 'text-gray-500' : 'text-gray-400',
    },
    bg: {
      primary: theme === 'dark' ? 'bg-gray-800' : 'bg-white',
      secondary: theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50',
      hover: theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50',
    },
    menuItem: theme === 'dark'
      ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900',
    activeMenuItem: theme === 'dark'
      ? 'bg-gray-800 text-green-400 font-medium border-l-4 border-green-400'
      : 'bg-green-50 text-green-700 font-medium border-l-4 border-green-600',
    aiBlock: theme === 'dark'
      ? 'bg-purple-900 border-purple-700'
      : 'bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200',
    aiActive: theme === 'dark'
      ? 'bg-purple-800 border-2 border-purple-600 shadow-md'
      : 'bg-purple-100 border-2 border-purple-300 shadow-md',
    statsCard: theme === 'dark'
      ? 'bg-gray-800 border-gray-700'
      : 'bg-white border-gray-200',
    progressBar: {
      bg: theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200',
      fill: 'bg-green-600',
    },
    avatar: {
      border: theme === 'dark' ? 'border-green-800' : 'border-green-100',
      bg: 'bg-gradient-to-br from-green-400 to-green-600',
    }
  };

  // Базовые пункты меню для всех пользователей
  const baseNavItems = [
    {
      title: sidebarText.home[language],
      items: [
        { to: '/dashboard', icon: <Home size={18} />, label: sidebarText.dashboard[language] },
        { to: '/fields', icon: <Map size={18} />, label: sidebarText.fields[language] },
        { to: '/diary', icon: <BookOpen size={18} />, label: sidebarText.diary[language] },
        { to: '/calendar', icon: <Calendar size={18} />, label: sidebarText.calendar[language] },
      ]
    },
    {
      title: sidebarText.livestock[language],
      items: [
        { to: '/animals', icon: <PawPrint size={18} />, label: sidebarText.animals[language] },
      ]
    },
    {
      title: sidebarText.analytics[language],
      items: [
        { to: '/analytics', icon: <BarChart3 size={18} />, label: sidebarText.analytics[language] },
        { to: '/reports', icon: <FileText size={18} />, label: sidebarText.reports[language] },
        { to: '/forecasts', icon: <Cloud size={18} />, label: sidebarText.forecasts[language] },
      ]
    },
    {
      title: sidebarText.planning[language],
      items: [
        { to: '/weekly-tasks', icon: <CheckSquare size={18} />, label: sidebarText.weeklyTasks[language] },
        { to: '/work-plan', icon: <ClipboardList size={18} />, label: sidebarText.workPlan[language] },
        { to: '/resources', icon: <Tractor size={18} />, label: sidebarText.resources[language] },
      ]
    }
  ];

  // Пункты меню для финансов (только для admin)
  const financeNavItems = [
    {
      title: sidebarText.finance[language],
      items: [
        { 
          to: '/finance', 
          icon: <DollarSign size={18} />, 
          label: sidebarText.financeOverview[language],
          adminOnly: true
        },
        { 
          to: '/finance/transactions', 
          icon: <CreditCard size={18} />, 
          label: sidebarText.transactions[language],
          adminOnly: true
        },
        { 
          to: '/finance/budget', 
          icon: <TrendingUp size={18} />, 
          label: sidebarText.budget[language],
          adminOnly: true
        },
        { 
          to: '/finance/reports', 
          icon: <FileText size={18} />, 
          label: sidebarText.financeReports[language],
          adminOnly: true
        },
      ]
    }
  ];

  // Пункты справочников (с ограничением для работников)
  const directoryItems = [
    { to: '/crops', icon: <Sprout size={18} />, label: sidebarText.crops[language] },
    { to: '/equipment', icon: <Settings size={18} />, label: sidebarText.equipment[language] },
    { to: '/employees', icon: <Users size={18} />, label: sidebarText.employees[language], adminOnly: true },
    { to: '/suppliers', icon: <Handshake size={18} />, label: sidebarText.suppliers[language] },
  ];

  // Формируем полный список пунктов в зависимости от роли
  const getNavItems = () => {
    let items = [...baseNavItems];
    
    console.log('🔍 getNavItems: isAdmin =', isAdmin);
    
    if (isAdmin) {
      console.log('✅ Добавляем финансы для admin');
      console.log('📊 financeNavItems:', financeNavItems);
      items = [...items, ...financeNavItems];
    } else {
      console.log('❌ Финансы НЕ добавляются (не админ)');
    }

    const filteredDirectoryItems = directoryItems.filter(item => {
      if (item.adminOnly && !isAdmin) return false;
      return true;
    });

    if (filteredDirectoryItems.length > 0) {
      items.push({
        title: sidebarText.directories[language],
        items: filteredDirectoryItems
      });
    }

    console.log('📋 Итоговые пункты меню:', items.map(section => section.title));
    
    return items;
  };

  const navItems = getNavItems();

  return (
    <aside className={`hidden lg:block w-64 border-r overflow-y-auto h-screen sticky top-0 transition-colors duration-300 ${themeClasses.sidebar} ${themeClasses.border}`}>
      {/* Фермерская информация */}
      {user && (
        <div className={`p-6 border-b transition-colors duration-300 ${themeClasses.border}`}>
          <div className="flex items-center space-x-3 mb-4">
            {/* Аватар */}
            <div className={`w-12 h-12 rounded-full ${themeClasses.avatar.bg} flex items-center justify-center text-white text-xl overflow-hidden border-4 ${themeClasses.avatar.border}`}>
              {avatar ? (
                <img 
                  key={avatar}
                  src={avatar} 
                  alt={user.name} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = user?.firstName?.[0] || user?.name?.[0] || 'U';
                  }}
                />
              ) : (
                <span>{user?.firstName?.[0] || user?.name?.[0] || 'U'}</span>
              )}
            </div>
            <div className="flex-1">
              <h3 className={`font-semibold truncate ${themeClasses.text.primary}`}>
                {user.name || 'User'}
              </h3>
              <p className={`text-sm truncate ${themeClasses.text.secondary}`}>
                {user.farmName || 'Farm'}
                {isAdmin && <span className="ml-2 text-xs text-green-600 font-medium">(Admin)</span>}
                {isWorker && <span className="ml-2 text-xs text-blue-600 font-medium">(Worker)</span>}
              </p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className={`text-sm ${themeClasses.text.secondary}`}>
                {sidebarText.activity[language]}
              </span>
              <span className="text-sm font-medium text-green-600">85%</span>
            </div>
            <div className={`w-full rounded-full h-2 ${themeClasses.progressBar.bg}`}>
              <div className={`h-2 rounded-full ${themeClasses.progressBar.fill}`} style={{ width: '85%' }}></div>
            </div>
          </div>
        </div>
      )}

      {/* Кнопка переключения темы */}
      <div className="p-4 border-b transition-colors duration-300 flex justify-between items-center">
        <span className={`text-sm font-medium ${themeClasses.text.secondary}`}>
          {sidebarText.theme[language]}
        </span>
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-lg transition-colors ${
            theme === 'dark' 
              ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>

      {/* AI Ассистент - выделенный блок */}
      <div className="p-4">
        <NavLink
          to="/ai"
          className={({ isActive }) =>
            `flex items-center p-4 rounded-xl transition-all duration-300 ${
              isActive
                ? themeClasses.aiActive
                : `${themeClasses.aiBlock} hover:shadow-md hover:scale-105`
            }`
          }
        >
          <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center mr-3 shadow-md">
            <Bot size={22} className="text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center">
              <span className={`font-bold ${theme === 'dark' ? 'text-purple-300' : 'text-purple-700'}`}>
                {sidebarText.aiAssistant[language]}
              </span>
              <span className="ml-2 px-1.5 py-0.5 bg-purple-600 text-white text-xs rounded-full animate-pulse">
                NEW
              </span>
            </div>
            <p className={`text-xs mt-0.5 flex items-center ${
              theme === 'dark' ? 'text-purple-400' : 'text-purple-500'
            }`}>
              <Sparkles size={12} className="mr-1" />
              AI
            </p>
          </div>
        </NavLink>
      </div>

      {/* Навигация */}
      <div className="p-4 space-y-6 overflow-y-auto">
        {navItems.map((section, index) => (
          <div key={index}>
            <h4 className={`px-4 text-xs font-semibold uppercase tracking-wider mb-2 ${themeClasses.text.muted}`}>
              {section.title}
            </h4>
            <nav className="space-y-1">
              {section.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-2.5 text-sm rounded-lg transition-all duration-200 ${
                      isActive
                        ? themeClasses.activeMenuItem
                        : `${themeClasses.menuItem} border-l-4 border-transparent`
                    }`
                  }
                >
                  <span className="text-lg mr-3">{item.icon}</span>
                  <span className="flex-1">{item.label}</span>
                </NavLink>
              ))}
            </nav>
          </div>
        ))}
      </div>

      {/* Краткая статистика - разная для admin и worker */}
      <div className={`p-4 border-t transition-colors duration-300 ${themeClasses.border}`}>
        <h4 className={`font-medium mb-3 ${themeClasses.text.primary}`}>
          {sidebarText.quickStats[language]}
        </h4>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className={`text-sm ${themeClasses.text.secondary}`}>
              {sidebarText.activeFields[language]}
            </span>
            <span className={`font-semibold ${themeClasses.text.primary}`}>4</span>
          </div>
          <div className="flex justify-between items-center">
            <span className={`text-sm ${themeClasses.text.secondary}`}>
              {sidebarText.tasksToday[language]}
            </span>
            <span className={`font-semibold ${themeClasses.text.primary}`}>3</span>
          </div>
          
          {/* Для admin показываем финансовую статистику */}
          {isAdmin && (
            <>
              <div className="flex justify-between items-center">
                <span className={`text-sm ${themeClasses.text.secondary}`}>
                  {sidebarText.monthlyIncome[language]}
                </span>
                <span className="font-semibold text-green-600">+245 000 som</span>
              </div>
              <div className="flex justify-between items-center">
                <span className={`text-sm ${themeClasses.text.secondary}`}>
                  {sidebarText.monthlyExpenses[language]}
                </span>
                <span className="font-semibold text-red-600">-125 000 som</span>
              </div>
            </>
          )}
          
          {/* Для worker показываем обычную статистику */}
          {!isAdmin && (
            <div className="flex justify-between items-center">
              <span className={`text-sm ${themeClasses.text.secondary}`}>
                {sidebarText.yieldForecast[language]}
              </span>
              <span className={`font-semibold ${themeClasses.text.primary}`}>+12.5%</span>
            </div>
          )}
        </div>
      </div>

      {/* Выход */}
      <div className={`p-4 border-t transition-colors duration-300 ${themeClasses.border}`}>
        <button
          onClick={handleLogout}
          className={`w-full flex items-center px-4 py-2.5 text-sm rounded-lg text-red-600 transition-all duration-200 ${
            theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-red-50'
          }`}
        >
          <LogOut size={18} className="mr-3" />
          <span>{sidebarText.logout[language]}</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;