// src/components/layout/Navbar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAvatar } from '../../contexts/AvatarContext';
import { useActions } from '../../hooks/useActions';
import { useTheme } from '../../contexts/ThemeContext'; // ✅ Добавляем тему
import { 
  Menu, 
  X, 
  Bell, 
  User, 
  Settings, 
  LogOut, 
  Search,
  Plus,
  ChevronDown,
  Home,
  Map,
  Calendar,
  FileText,
  BarChart3,
  Cloud,
  PenTool,
  Droplets,
  Sprout,
  Download,
  Filter,
  Grid,
  List,
  Bot,
  Sparkles,
  Moon, // ✅ Для темной темы
  Sun   // ✅ Для светлой темы
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { t, language } = useLanguage();
  const { avatar } = useAvatar();
  const { handleAdd, handleExport, handleSearch } = useActions();
  const { theme, toggleTheme } = useTheme(); // ✅ Получаем тему и функцию переключения
  const navigate = useNavigate();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const notificationRef = useRef(null);
  const userMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    setImageError(false);
  }, [avatar]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    handleSearch(searchQuery);
    setIsMobileMenuOpen(false);
  };

  const handleAddClick = (type) => {
    handleAdd(type);
    setIsMobileMenuOpen(false);
    setShowUserMenu(false);
  };

  const handleExportClick = () => {
    handleExport('report');
  };

  const notifications = [
    { 
      id: 1, 
      text: t('notification1'),
      time: '10 ' + t('minutesAgo'), 
      type: 'warning', 
      icon: Droplets,
      link: '/tasks/1'
    },
    { 
      id: 2, 
      text: t('notification2'),
      time: '1 ' + t('hourAgo'), 
      type: 'info', 
      icon: Cloud,
      link: '/weather'
    },
    { 
      id: 3, 
      text: t('notification3'),
      time: '2 ' + t('hoursAgo'), 
      type: 'success', 
      icon: Sprout,
      link: '/fields/3'
    },
  ];

  const menuItems = [
    { path: '/dashboard', icon: Home, label: t('dashboard') },
    { path: '/fields', icon: Map, label: t('fields') },
    { path: '/tasks', icon: Calendar, label: t('tasks') },
    { path: '/diary', icon: PenTool, label: t('diary') },
    { path: '/reports', icon: FileText, label: t('reports') },
    { path: '/analytics', icon: BarChart3, label: t('analytics') },
    { path: '/weather', icon: Cloud, label: t('weather') },
    { 
      path: '/ai', 
      icon: Bot, 
      label: t('aiAssistant') || 'AI Ассистент',
      highlight: true,
      badge: 'NEW'
    },
  ];

  const addOptions = [
    { type: 'task', label: t('task'), icon: Calendar },
    { type: 'field', label: t('field'), icon: Map },
    { type: 'diary', label: t('diaryEntry'), icon: PenTool },
  ];

  // Классы для темной/светлой темы
  const themeClasses = {
    nav: theme === 'dark' 
      ? 'bg-gray-900 border-gray-800 text-white' 
      : 'bg-white border-gray-200 text-gray-900',
    search: theme === 'dark'
      ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
      : 'bg-white border-gray-300 text-gray-900',
    button: theme === 'dark'
      ? 'hover:bg-gray-800 text-gray-300'
      : 'hover:bg-gray-100 text-gray-600',
    menuItem: theme === 'dark'
      ? 'text-gray-300 hover:bg-gray-800'
      : 'text-gray-700 hover:bg-gray-50',
    activeMenuItem: theme === 'dark'
      ? 'bg-gray-800 text-green-400 border-l-4 border-green-400'
      : 'bg-green-50 text-green-700 border-l-4 border-green-600',
    card: theme === 'dark'
      ? 'bg-gray-800 border-gray-700'
      : 'bg-white border-gray-200',
    text: theme === 'dark' ? 'text-white' : 'text-gray-900',
    textSecondary: theme === 'dark' ? 'text-gray-400' : 'text-gray-600',
  };

  return (
    <nav className={`border-b sticky top-0 z-50 shadow-sm transition-colors duration-300 ${themeClasses.nav}`}>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Левая часть - логотип, текст и мобильное меню */}
          <div className="flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`lg:hidden p-2 rounded-lg mr-2 transition-colors ${themeClasses.button}`}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            
            <Link 
              to="/dashboard" 
              className="flex items-center space-x-3 hover:opacity-90 transition-opacity"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {/* PNG логотип */}
              <img 
                src="/src/assets/images/logo.png" 
                alt="Farm Vision" 
                className="h-14 w-auto rounded-full" 
              />
              
              {/* Текст FARM VISION */}
              <div className="flex flex-col">
                <span className={`font-bold text-sm leading-tight ${
                  theme === 'dark' ? 'text-amber-400' : 'text-amber-800'
                }`}>FARM</span>
                <span className={`font-bold text-sm leading-tight ${
                  theme === 'dark' ? 'text-sky-400' : 'text-sky-500'
                }`}>VISION</span>
              </div>
            </Link>
          </div>

          {/* Поиск (только на десктопе) */}
          <div className="hidden md:block flex-1 max-w-md mx-4">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                ref={searchInputRef}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('search')}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${themeClasses.search}`}
              />
              <button 
                type="submit" 
                className="absolute left-3 top-2.5 text-gray-400 hover:text-green-600 transition-colors"
              >
                <Search size={18} />
              </button>
            </form>
          </div>

          {/* Правая часть */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Кнопка переключения темы 🌙/☀️ */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors ${themeClasses.button}`}
              aria-label="Toggle theme"
              title={theme === 'dark' ? 'Светлая тема' : 'Темная тема'}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Кнопки видов (Grid/List) */}
            <button 
              onClick={() => console.log('Toggle view')}
              className={`p-2 rounded-lg transition-colors hidden sm:block ${themeClasses.button}`}
              title={t('toggleView')}
            >
              <Grid size={18} />
            </button>

            <button 
              onClick={() => console.log('Toggle view')}
              className={`p-2 rounded-lg transition-colors hidden sm:block ${themeClasses.button}`}
              title={t('toggleView')}
            >
              <List size={18} />
            </button>

            {/* Кнопка фильтра */}
            <button 
              onClick={() => console.log('Open filters')}
              className={`p-2 rounded-lg transition-colors hidden sm:block ${themeClasses.button}`}
              title={t('filter')}
            >
              <Filter size={18} />
            </button>

            {/* Уведомления */}
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className={`p-2 rounded-lg relative transition-colors ${themeClasses.button}`}
                aria-label="Notifications"
              >
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              </button>

              {showNotifications && (
                <div className={`absolute right-0 mt-2 w-80 rounded-xl shadow-lg border py-2 z-50 ${themeClasses.card}`}>
                  <div className={`px-4 py-3 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-100'}`}>
                    <h3 className={`font-semibold ${themeClasses.text}`}>
                      {t('notifications')}
                    </h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((n) => {
                      const Icon = n.icon;
                      return (
                        <div 
                          key={n.id} 
                          className={`px-4 py-3 border-b last:border-b-0 cursor-pointer transition-colors ${
                            theme === 'dark' 
                              ? 'hover:bg-gray-700 border-gray-700' 
                              : 'hover:bg-gray-50 border-gray-100'
                          }`}
                          onClick={() => {
                            setShowNotifications(false);
                            navigate(n.link);
                          }}
                        >
                          <div className="flex items-start space-x-3">
                            <div className={`p-1 rounded-lg ${
                              n.type === 'warning' ? 'bg-yellow-100' :
                              n.type === 'success' ? 'bg-green-100' : 'bg-blue-100'
                            }`}>
                              <Icon size={16} className={
                                n.type === 'warning' ? 'text-yellow-600' :
                                n.type === 'success' ? 'text-green-600' : 'text-blue-600'
                              } />
                            </div>
                            <div className="flex-1">
                              <p className={`text-sm ${themeClasses.text}`}>{n.text}</p>
                              <span className={`text-xs ${themeClasses.textSecondary}`}>{n.time}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className={`px-4 py-2 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-100'}`}>
                    <Link 
                      to="/notifications" 
                      className="text-sm text-green-600 hover:text-green-700 font-medium"
                      onClick={() => setShowNotifications(false)}
                    >
                      {t('viewAll')} →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Кнопка Экспорт */}
            <button 
              onClick={handleExportClick}
              className={`hidden sm:flex items-center space-x-2 px-4 py-2 border rounded-lg transition-all ${
                theme === 'dark' 
                  ? 'border-gray-700 hover:bg-gray-800 text-gray-300' 
                  : 'border-gray-300 hover:bg-gray-50 text-gray-700'
              }`}
              title={t('export')}
            >
              <Download size={18} />
              <span className="text-sm font-medium">{t('export')}</span>
            </button>

            {/* Кнопка Добавить с выпадающим меню */}
            <div className="relative group">
              <button 
                onClick={() => handleAddClick('task')}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all shadow-md hover:shadow-lg"
              >
                <Plus size={18} />
                <span className="text-sm font-medium hidden sm:inline">{t('add')}</span>
              </button>
              
              <div className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg border py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 ${
                theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}>
                {addOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.type}
                      onClick={() => handleAddClick(option.type)}
                      className={`w-full flex items-center px-4 py-2 text-sm transition-colors ${
                        theme === 'dark' 
                          ? 'text-gray-300 hover:bg-gray-700' 
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon size={16} className="mr-3 text-gray-500" />
                      <span>{t('add')} {option.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Профиль */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className={`flex items-center space-x-2 p-1 rounded-lg transition-colors ${themeClasses.button}`}
                aria-label="User menu"
              >
                {avatar && !imageError ? (
                  <img
                    src={avatar}
                    alt={user?.name}
                    className="w-8 h-8 rounded-full object-cover border-2 border-green-200"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-600 to-green-700 flex items-center justify-center text-white shadow-md">
                    <User size={16} />
                  </div>
                )}
                <span className={`hidden lg:inline text-sm font-medium ${themeClasses.text}`}>
                  {user?.name || 'User'}
                </span>
                <ChevronDown size={16} className={`hidden lg:inline transition-transform ${themeClasses.textSecondary} ${showUserMenu ? 'rotate-180' : ''}`} />
              </button>

              {showUserMenu && (
                <div className={`absolute right-0 mt-2 w-48 rounded-xl shadow-lg border py-2 z-50 ${
                  theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                }`}>
                  <div className={`px-4 py-2 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-100'}`}>
                    <p className={`text-sm font-medium ${themeClasses.text}`}>{user?.name}</p>
                    <p className={`text-xs ${themeClasses.textSecondary}`}>{user?.email}</p>
                  </div>
                  
                  <Link
                    to="/profile"
                    className={`flex items-center px-4 py-2 text-sm transition-colors ${
                      theme === 'dark' 
                        ? 'text-gray-300 hover:bg-gray-700' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => setShowUserMenu(false)}
                  >
                    <User size={16} className="mr-3 text-gray-500" />
                    {t('profile')}
                  </Link>
                  
                  <Link
                    to="/settings"
                    className={`flex items-center px-4 py-2 text-sm transition-colors ${
                      theme === 'dark' 
                        ? 'text-gray-300 hover:bg-gray-700' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => setShowUserMenu(false)}
                  >
                    <Settings size={16} className="mr-3 text-gray-500" />
                    {t('settings')}
                  </Link>
                  
                  <Link
                    to="/ai"
                    className={`flex items-center px-4 py-2 text-sm transition-colors border-t ${
                      theme === 'dark' 
                        ? 'text-purple-400 hover:bg-gray-700 border-gray-700' 
                        : 'text-purple-600 hover:bg-purple-50 border-gray-100'
                    }`}
                    onClick={() => setShowUserMenu(false)}
                  >
                    <Bot size={16} className="mr-3 text-purple-500" />
                    <span className="flex-1">{t('aiAssistant') || 'AI Ассистент'}</span>
                    <Sparkles size={14} className="text-purple-400" />
                  </Link>
                  
                  <div className={`border-t my-1 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-100'}`}></div>
                  
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      handleLogout();
                    }}
                    className={`w-full flex items-center px-4 py-2 text-sm text-red-600 transition-colors ${
                      theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-red-50'
                    }`}
                  >
                    <LogOut size={16} className="mr-3" />
                    {t('logout')}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Мобильное меню */}
        {isMobileMenuOpen && (
          <div ref={mobileMenuRef} className={`lg:hidden py-4 border-t animate-slideDown ${
            theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
          }`}>
            {/* Поиск для мобильных */}
            <form onSubmit={handleSearchSubmit} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('search')}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${themeClasses.search}`}
                />
                <button type="submit" className="absolute left-3 top-2.5 text-gray-400">
                  <Search size={18} />
                </button>
              </div>
            </form>
            
            <div className="grid grid-cols-2 gap-2 mb-4">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center p-3 rounded-lg transition-colors ${
                    item.highlight 
                      ? theme === 'dark'
                        ? 'bg-purple-900 text-purple-300 border border-purple-700'
                        : 'bg-purple-50 text-purple-700 border border-purple-200'
                      : themeClasses.menuItem
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon size={18} className={`mr-3 ${
                    item.highlight 
                      ? theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
                      : 'text-gray-600'
                  }`} />
                  <span className="text-sm flex-1">{item.label}</span>
                  {item.badge && (
                    <span className="text-xs px-1.5 py-0.5 bg-purple-600 text-white rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
            </div>

            <div className="mt-2 mb-4">
              <Link
                to="/ai"
                className={`flex items-center p-4 rounded-xl border shadow-sm ${
                  theme === 'dark'
                    ? 'bg-purple-900 border-purple-700'
                    : 'bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center mr-3 shadow-md">
                  <Bot size={20} className="text-white" />
                </div>
                <div>
                  <p className={`font-medium ${theme === 'dark' ? 'text-purple-300' : 'text-purple-700'}`}>
                    {t('aiAssistant') || 'AI Ассистент'}
                  </p>
                  <p className={`text-xs ${theme === 'dark' ? 'text-purple-400' : 'text-purple-500'}`}>
                    {language === 'ru' ? 'Задайте вопрос о сельском хозяйстве' : 
                     language === 'en' ? 'Ask about agriculture' : 
                     'Айыл чарба жөнүндө суроо бериңиз'}
                  </p>
                </div>
                <Sparkles size={20} className={`ml-auto animate-pulse ${
                  theme === 'dark' ? 'text-purple-400' : 'text-purple-400'
                }`} />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={handleExportClick}
                className={`flex items-center justify-center space-x-2 px-4 py-2 border rounded-lg transition-colors ${
                  theme === 'dark'
                    ? 'border-gray-700 hover:bg-gray-800 text-gray-300'
                    : 'border-gray-300 hover:bg-gray-50 text-gray-700'
                }`}
              >
                <Download size={18} />
                <span>{t('export')}</span>
              </button>
              
              <button 
                onClick={() => handleAddClick('task')}
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800"
              >
                <Plus size={18} />
                <span>{t('add')}</span>
              </button>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-1">
              <button className={`p-2 text-center rounded-lg transition-colors ${themeClasses.button}`}>
                <Grid size={18} className="mx-auto" />
                <span className={`text-xs ${themeClasses.textSecondary}`}>Grid</span>
              </button>
              <button className={`p-2 text-center rounded-lg transition-colors ${themeClasses.button}`}>
                <List size={18} className="mx-auto" />
                <span className={`text-xs ${themeClasses.textSecondary}`}>List</span>
              </button>
              <button className={`p-2 text-center rounded-lg transition-colors ${themeClasses.button}`}>
                <Filter size={18} className="mx-auto" />
                <span className={`text-xs ${themeClasses.textSecondary}`}>Filter</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;