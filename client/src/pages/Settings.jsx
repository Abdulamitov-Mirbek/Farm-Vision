// src/pages/Settings.jsx
import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext'; // ✅ Добавляем тему
import Card from '../components/common/Card';
import Payment from './Settings/Payment';
import Advanced from './Settings/Advanced';
import Integrations from './Settings/Integrations';
import Security from './Settings/Security'; 
import Notifications from './Settings/Notifications';

const Settings = () => {
  const { language } = useLanguage();
  const { theme } = useTheme(); // ✅ Получаем тему
  const [activeTab, setActiveTab] = useState('notifications');

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
    nav: {
      item: theme === 'dark'
        ? 'text-gray-300 hover:bg-gray-700 border-l-4 border-transparent'
        : 'text-gray-700 hover:bg-gray-50 border-l-4 border-transparent',
      active: theme === 'dark'
        ? 'bg-gray-700 text-green-400 font-medium border-l-4 border-green-400'
        : 'bg-green-50 text-green-700 font-medium border-l-4 border-green-600',
    },
    button: {
      primary: 'bg-green-600 hover:bg-green-700 text-white',
      secondary: theme === 'dark'
        ? 'border-gray-600 hover:bg-gray-700 text-gray-300'
        : 'border-gray-200 hover:bg-gray-50 text-gray-600',
    }
  };

  // Переводы для страницы
  const pageText = {
    title: {
      ru: 'Настройки',
      en: 'Settings',
      kg: 'Орнотуулар'
    },
    subtitle: {
      ru: 'Управление настройками аккаунта и системы',
      en: 'Manage account and system settings',
      kg: 'Аккаунт жана система жөндөөлөрүн башкаруу'
    },
    tabs: {
      notifications: {
        ru: 'Уведомления',
        en: 'Notifications',
        kg: 'Билдирүүлөр'
      },
      security: {
        ru: 'Безопасность',
        en: 'Security',
        kg: 'Коопсуздук'
      },
      integrations: {
        ru: 'Интеграции',
        en: 'Integrations',
        kg: 'Интеграциялар'
      },
      billing: {
        ru: 'Оплата',
        en: 'Billing',
        kg: 'Төлөм'
      },
      advanced: {
        ru: 'Расширенные',
        en: 'Advanced',
        kg: 'Кеңейтилген'
      }
    },
    development: {
      title: {
        ru: 'Раздел в разработке',
        en: 'Section in development',
        kg: 'Бөлүм иштелип жатат'
      },
      description: {
        ru: 'Этот раздел настроек находится в разработке и будет доступен в ближайшее время.',
        en: 'This settings section is under development and will be available soon.',
        kg: 'Бул жөндөөлөр бөлүмү иштелип жатат жана жакында жеткиликтүү болот.'
      }
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'notifications':
        return <Notifications />;
      case 'security':
        return <Security />;
      case 'billing':
        return <Payment />;
      case 'advanced':
        return <Advanced />;
      case 'integrations':
        return <Integrations />;
      default:
        return (
          <div className={`text-center py-12 transition-colors duration-300`}>
            <div className="text-5xl mb-4">⚙️</div>
            <h3 className={`text-lg font-medium mb-2 ${themeClasses.text.primary}`}>
              {pageText.development.title[language]}
            </h3>
            <p className={themeClasses.text.secondary}>
              {pageText.development.description[language]}
            </p>
          </div>
        );
    }
  };

  // Массив вкладок с переведенными названиями
  const tabs = [
    { id: 'notifications', label: pageText.tabs.notifications[language], icon: '🔔' },
    { id: 'security', label: pageText.tabs.security[language], icon: '🔒' },
    { id: 'integrations', label: pageText.tabs.integrations[language], icon: '🔌' },
    { id: 'billing', label: pageText.tabs.billing[language], icon: '💳' },
    { id: 'advanced', label: pageText.tabs.advanced[language], icon: '⚙️' }
  ];

  return (
    <div className={`min-h-screen p-6 transition-colors duration-300 ${themeClasses.page}`}>
      <div className="mb-6">
        <h1 className={`text-2xl font-bold mb-2 ${themeClasses.text.primary}`}>
          {pageText.title[language]}
        </h1>
        <p className={themeClasses.text.secondary}>
          {pageText.subtitle[language]}
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Боковое меню */}
        <div className="lg:col-span-1">
          <div className={`p-4 rounded-xl border transition-colors duration-300 ${themeClasses.card}`}>
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-4 py-3 text-sm rounded-lg transition-all duration-200 ${
                    activeTab === tab.id
                      ? themeClasses.nav.active
                      : themeClasses.nav.item
                  }`}
                >
                  <span className="text-lg mr-3">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Основное содержимое */}
        <div className="lg:col-span-3">
          <div className={`p-6 rounded-xl border transition-colors duration-300 ${themeClasses.card}`}>
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;