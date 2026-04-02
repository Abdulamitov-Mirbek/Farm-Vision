// src/pages/Settings/Advanced.jsx
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext'; // ✅ Добавляем тему
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import './Advanced.css';

const Advanced = () => {
  const { language, setLanguage, t } = useLanguage();
  const { theme } = useTheme(); // ✅ Получаем тему
  const [activeTab, setActiveTab] = useState('system');
  const [apiKey, setApiKey] = useState('••••••••••••••••');
  const [showApiKey, setShowApiKey] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('https://api.farmvision.kg/webhook');
  const [dataRetention, setDataRetention] = useState('12');
  const [backupEnabled, setBackupEnabled] = useState(true);
  const [autoSync, setAutoSync] = useState(false);
  const [debugMode, setDebugMode] = useState(false);

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
      warning: 'bg-yellow-600 hover:bg-yellow-700 text-white',
      danger: 'bg-red-600 hover:bg-red-700 text-white',
    },
    tab: {
      active: theme === 'dark'
        ? 'bg-gray-700 text-green-400 border-b-2 border-green-400'
        : 'bg-white text-green-600 border-b-2 border-green-600',
      inactive: theme === 'dark'
        ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700'
        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100',
    },
    badge: {
      production: theme === 'dark'
        ? 'bg-green-900/30 text-green-400 border border-green-800'
        : 'bg-green-100 text-green-700 border border-green-200',
      warning: theme === 'dark'
        ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-800'
        : 'bg-yellow-100 text-yellow-700 border border-yellow-200',
    },
    toggle: {
      bg: theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300',
      checked: 'bg-green-600',
    },
    log: {
      error: theme === 'dark'
        ? 'bg-red-900/20 border-red-800 text-red-400'
        : 'bg-red-50 border-red-200 text-red-700',
      warn: theme === 'dark'
        ? 'bg-yellow-900/20 border-yellow-800 text-yellow-400'
        : 'bg-yellow-50 border-yellow-200 text-yellow-700',
      info: theme === 'dark'
        ? 'bg-blue-900/20 border-blue-800 text-blue-400'
        : 'bg-blue-50 border-blue-200 text-blue-700',
    },
    dangerZone: theme === 'dark'
      ? 'border-red-900 bg-red-900/10'
      : 'border-red-200 bg-red-50',
  };

  // Переводы для страницы
  const pageText = {
    title: {
      ru: 'Расширенные настройки',
      en: 'Advanced Settings',
      kg: 'Кеңейтилген жөндөөлөр'
    },
    description: {
      ru: 'Управление системными параметрами, API и интеграциями',
      en: 'Manage system parameters, APIs and integrations',
      kg: 'Системалык параметрлерди, API жана интеграцияларды башкаруу'
    },
    tabs: {
      system: {
        ru: '⚙️ Система',
        en: '⚙️ System',
        kg: '⚙️ Система'
      },
      api: {
        ru: '🔑 API и интеграции',
        en: '🔑 API & Integrations',
        kg: '🔑 API жана интеграциялар'
      },
      data: {
        ru: '💾 Данные и бэкапы',
        en: '💾 Data & Backups',
        kg: '💾 Маалыматтар жана бэкаптар'
      },
      developer: {
        ru: '👨‍💻 Разработчику',
        en: '👨‍💻 Developer',
        kg: '👨‍💻 Иштеп чыгуучуга'
      }
    },
    languageSelector: {
      title: {
        ru: 'Язык интерфейса',
        en: 'Interface Language',
        kg: 'Интерфейс тили'
      },
      description: {
        ru: 'Выберите язык для отображения интерфейса',
        en: 'Choose the interface language',
        kg: 'Интерфейс тилин тандоо'
      },
      russian: {
        ru: 'Русский',
        en: 'Russian',
        kg: 'Орусча'
      },
      english: {
        ru: 'Английский',
        en: 'English',
        kg: 'Англисче'
      },
      kyrgyz: {
        ru: 'Кыргызский',
        en: 'Kyrgyz',
        kg: 'Кыргызча'
      }
    },
    systemSettings: {
      title: {
        ru: 'Системные параметры',
        en: 'System Parameters',
        kg: 'Системалык параметрлер'
      },
      language: {
        ru: 'Язык интерфейса',
        en: 'Interface Language',
        kg: 'Интерфейс тили'
      },
      languageDesc: {
        ru: 'Выберите язык системы',
        en: 'Choose system language',
        kg: 'Система тилин тандоо'
      },
      timezone: {
        ru: 'Часовой пояс',
        en: 'Time Zone',
        kg: 'Убакыт алкагы'
      },
      timezoneDesc: {
        ru: 'Регион для отображения времени',
        en: 'Region for time display',
        kg: 'Убакытты көрсөтүү үчүн регион'
      },
      dateFormat: {
        ru: 'Формат даты',
        en: 'Date Format',
        kg: 'Дата форматы'
      },
      dateFormatDesc: {
        ru: 'Как отображать даты',
        en: 'How to display dates',
        kg: 'Даталарды кантип көрсөтүү'
      },
      units: {
        ru: 'Единицы измерения',
        en: 'Measurement Units',
        kg: 'Өлчөө бирдиктери'
      },
      unitsDesc: {
        ru: 'Площадь, вес, объем',
        en: 'Area, weight, volume',
        kg: 'Аянт, салмак, көлөм'
      }
    },
    performance: {
      title: {
        ru: 'Производительность',
        en: 'Performance',
        kg: 'Өндүрүмдүүлүк'
      },
      caching: {
        ru: 'Кэширование данных',
        en: 'Data caching',
        kg: 'Маалыматтарды кэштөө'
      },
      cachingDesc: {
        ru: 'Ускоряет загрузку страниц',
        en: 'Speeds up page loading',
        kg: 'Барактарды жүктөөнү тездетет'
      },
      autoSync: {
        ru: 'Автообновление',
        en: 'Auto sync',
        kg: 'Авто жаңыртуу'
      },
      autoSyncDesc: {
        ru: 'Автоматически загружать новые данные',
        en: 'Automatically load new data',
        kg: 'Жаңы маалыматтарды автоматтык түрдө жүктөө'
      },
      debugMode: {
        ru: 'Отладочный режим',
        en: 'Debug mode',
        kg: 'Debug режими'
      },
      debugModeDesc: {
        ru: 'Логирование и отладка',
        en: 'Logging and debugging',
        kg: 'Логирлөө жана оңдоо'
      }
    },
    apiKeys: {
      title: {
        ru: 'API ключи',
        en: 'API Keys',
        kg: 'API ачкычтары'
      },
      public: {
        ru: 'Публичный ключ',
        en: 'Public key',
        kg: 'Коомдук ачкыч'
      },
      secret: {
        ru: 'Секретный ключ',
        en: 'Secret key',
        kg: 'Купуя ачкыч'
      },
      production: {
        ru: 'Production',
        en: 'Production',
        kg: 'Production'
      },
      warning: {
        ru: 'Не показывать никому!',
        en: 'Do not share with anyone!',
        kg: 'Эч кимге көрсөтпөңүз!'
      },
      show: {
        ru: 'Показать',
        en: 'Show',
        kg: 'Көрсөтүү'
      },
      hide: {
        ru: 'Скрыть',
        en: 'Hide',
        kg: 'Жашыруу'
      },
      copy: {
        ru: 'Копировать',
        en: 'Copy',
        kg: 'Көчүрүү'
      },
      generate: {
        ru: 'Сгенерировать',
        en: 'Generate',
        kg: 'Түзүү'
      }
    },
    webhook: {
      title: {
        ru: 'Webhook URL',
        en: 'Webhook URL',
        kg: 'Webhook URL'
      },
      description: {
        ru: 'URL для получения уведомлений о событиях',
        en: 'URL to receive event notifications',
        kg: 'Окуялар жөнүндө билдирүүлөрдү алуу үчүн URL'
      },
      save: {
        ru: 'Сохранить',
        en: 'Save',
        kg: 'Сактоо'
      }
    },
    docs: {
      text: {
        ru: '📚 Подробная документация по API',
        en: '📚 Detailed API documentation',
        kg: '📚 API боюнча толук документация'
      },
      link: {
        ru: 'Перейти к документации →',
        en: 'Go to documentation →',
        kg: 'Документацияга өтүү →'
      }
    },
    dataManagement: {
      title: {
        ru: 'Управление данными',
        en: 'Data Management',
        kg: 'Маалыматтарды башкаруу'
      },
      retention: {
        ru: 'Хранение истории',
        en: 'Data retention',
        kg: 'Маалыматтарды сактоо'
      },
      retentionDesc: {
        ru: 'Сколько месяцев хранить данные',
        en: 'How many months to store data',
        kg: 'Канча ай маалымат сактоо'
      },
      months3: {
        ru: '3 месяца',
        en: '3 months',
        kg: '3 ай'
      },
      months6: {
        ru: '6 месяцев',
        en: '6 months',
        kg: '6 ай'
      },
      months12: {
        ru: '12 месяцев',
        en: '12 months',
        kg: '12 ай'
      },
      months24: {
        ru: '24 месяца',
        en: '24 months',
        kg: '24 ай'
      },
      unlimited: {
        ru: 'Без ограничений',
        en: 'Unlimited',
        kg: 'Чектөөсүз'
      },
      autoBackup: {
        ru: 'Автоматический бэкап',
        en: 'Auto backup',
        kg: 'Авто бэкап'
      },
      autoBackupDesc: {
        ru: 'Ежедневное резервное копирование',
        en: 'Daily backup',
        kg: 'Күнүмдүк резервдик көчүрмө'
      },
      manualBackup: {
        ru: 'Ручное резервное копирование',
        en: 'Manual backup',
        kg: 'Кол менен бэкап'
      },
      download: {
        ru: 'Скачать бэкап',
        en: 'Download backup',
        kg: 'Бэкапты жүктөө'
      },
      restore: {
        ru: 'Восстановить из бэкапа',
        en: 'Restore from backup',
        kg: 'Бэкаптан калыбына келтирүү'
      }
    },
    dangerZone: {
      title: {
        ru: '⚠️ Опасная зона',
        en: '⚠️ Danger zone',
        kg: '⚠️ Кооптуу аймак'
      },
      clearCache: {
        ru: 'Очистить кэш',
        en: 'Clear cache',
        kg: 'Кэшти тазалоо'
      },
      clearCacheDesc: {
        ru: 'Удалить временные файлы и кэш',
        en: 'Delete temporary files and cache',
        kg: 'Убактылуу файлдарды жана кэшти өчүрүү'
      },
      resetSettings: {
        ru: 'Сбросить настройки',
        en: 'Reset settings',
        kg: 'Жөндөөлөрдү баштапкы абалга келтирүү'
      },
      resetSettingsDesc: {
        ru: 'Вернуть все настройки по умолчанию',
        en: 'Restore all default settings',
        kg: 'Бардык жөндөөлөрдү баштапкы абалга келтирүү'
      },
      deleteData: {
        ru: 'Удалить все данные',
        en: 'Delete all data',
        kg: 'Бардык маалыматтарды өчүрүү'
      },
      deleteDataDesc: {
        ru: 'Это действие нельзя отменить',
        en: 'This action cannot be undone',
        kg: 'Бул аракетти кайтарып болбойт'
      },
      clear: {
        ru: 'Очистить',
        en: 'Clear',
        kg: 'Тазалоо'
      },
      reset: {
        ru: 'Сбросить',
        en: 'Reset',
        kg: 'Баштапкы абалга келтирүү'
      },
      delete: {
        ru: 'Удалить',
        en: 'Delete',
        kg: 'Өчүрүү'
      }
    },
    devInfo: {
      title: {
        ru: 'Информация для разработчика',
        en: 'Developer Information',
        kg: 'Иштеп чыгуучу үчүн маалымат'
      },
      appVersion: {
        ru: 'Версия приложения:',
        en: 'App version:',
        kg: 'Колдонмо версиясы:'
      },
      nodeVersion: {
        ru: 'Node.js:',
        en: 'Node.js:',
        kg: 'Node.js:'
      },
      reactVersion: {
        ru: 'React:',
        en: 'React:',
        kg: 'React:'
      },
      lastDeploy: {
        ru: 'Последний деплой:',
        en: 'Last deploy:',
        kg: 'Акыркы деплой:'
      }
    },
    logs: {
      title: {
        ru: 'Логи системы',
        en: 'System logs',
        kg: 'Система логдору'
      },
      allLevels: {
        ru: 'Все уровни',
        en: 'All levels',
        kg: 'Бардык деңгээлдер'
      },
      errors: {
        ru: 'Ошибки',
        en: 'Errors',
        kg: 'Каталар'
      },
      warnings: {
        ru: 'Предупреждения',
        en: 'Warnings',
        kg: 'Эскертүүлөр'
      },
      info: {
        ru: 'Информация',
        en: 'Info',
        kg: 'Маалымат'
      },
      refresh: {
        ru: 'Обновить',
        en: 'Refresh',
        kg: 'Жаңыртуу'
      }
    },
    timezones: {
      bishkek: {
        ru: 'Бишкек (GMT+6)',
        en: 'Bishkek (GMT+6)',
        kg: 'Бишкек (GMT+6)'
      },
      moscow: {
        ru: 'Москва (GMT+3)',
        en: 'Moscow (GMT+3)',
        kg: 'Москва (GMT+3)'
      },
      newyork: {
        ru: 'Нью-Йорк (GMT-5)',
        en: 'New York (GMT-5)',
        kg: 'Нью-Йорк (GMT-5)'
      }
    },
    dateFormats: {
      dmy: {
        ru: 'ДД.ММ.ГГГГ',
        en: 'DD.MM.YYYY',
        kg: 'ДД.ММ.ГГГГ'
      },
      mdy: {
        ru: 'ММ/ДД/ГГГГ',
        en: 'MM/DD/YYYY',
        kg: 'АА/КК/ЖЖЖЖ'
      },
      ymd: {
        ru: 'ГГГГ-ММ-ДД',
        en: 'YYYY-MM-DD',
        kg: 'ЖЖЖЖ-АА-КК'
      }
    },
    units: {
      metric: {
        ru: 'Метрическая (га, кг)',
        en: 'Metric (ha, kg)',
        kg: 'Метрикалык (га, кг)'
      },
      imperial: {
        ru: 'Английская (ac, lb)',
        en: 'Imperial (ac, lb)',
        kg: 'Англис (ac, lb)'
      }
    }
  };

  const copyApiKey = () => {
    navigator.clipboard.writeText('sk_live_farmvision_2026_kg_123456789');
    alert(pageText.apiKeys.copy[language]);
  };

  const generateNewApiKey = () => {
    if (window.confirm('Вы уверены? Старый API ключ перестанет работать.')) {
      setApiKey('sk_live_new_' + Math.random().toString(36).substring(2, 15));
      alert('Новый API ключ сгенерирован');
    }
  };

  // Функция для смены языка
  const handleLanguageChange = (lang) => {
    setLanguage(lang);
  };

  return (
    <div className={`p-6 transition-colors duration-300 ${themeClasses.page}`}>
      <div className="mb-6">
        <h1 className={`text-2xl font-bold mb-2 ${themeClasses.text.primary}`}>
          {pageText.title[language]}
        </h1>
        <p className={themeClasses.text.secondary}>
          {pageText.description[language]}
        </p>
      </div>

      {/* Селектор языка прямо на странице */}
      <div className={`mb-6 p-6 rounded-xl border ${themeClasses.card}`}>
        <div className="mb-4">
          <h3 className={`text-lg font-semibold ${themeClasses.text.primary}`}>
            {pageText.languageSelector.title[language]}
          </h3>
          <p className={themeClasses.text.secondary}>
            {pageText.languageSelector.description[language]}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            className={`px-4 py-2 rounded-lg border flex items-center gap-2 transition-colors ${
              language === 'ru' 
                ? 'bg-green-600 text-white border-green-600' 
                : themeClasses.button.outline
            }`}
            onClick={() => handleLanguageChange('ru')}
          >
            <span>🇷🇺</span>
            <span>{pageText.languageSelector.russian[language]}</span>
          </button>
          <button
            className={`px-4 py-2 rounded-lg border flex items-center gap-2 transition-colors ${
              language === 'en' 
                ? 'bg-green-600 text-white border-green-600' 
                : themeClasses.button.outline
            }`}
            onClick={() => handleLanguageChange('en')}
          >
            <span>🇬🇧</span>
            <span>{pageText.languageSelector.english[language]}</span>
          </button>
          <button
            className={`px-4 py-2 rounded-lg border flex items-center gap-2 transition-colors ${
              language === 'kg' 
                ? 'bg-green-600 text-white border-green-600' 
                : themeClasses.button.outline
            }`}
            onClick={() => handleLanguageChange('kg')}
          >
            <span>🇰🇬</span>
            <span>{pageText.languageSelector.kyrgyz[language]}</span>
          </button>
        </div>
      </div>

      {/* Табы */}
      <div className="flex gap-2 mb-6 border-b pb-2">
        <button 
          className={`px-4 py-2 rounded-t-lg transition-colors ${
            activeTab === 'system' 
              ? themeClasses.tab.active 
              : themeClasses.tab.inactive
          }`}
          onClick={() => setActiveTab('system')}
        >
          {pageText.tabs.system[language]}
        </button>
        <button 
          className={`px-4 py-2 rounded-t-lg transition-colors ${
            activeTab === 'api' 
              ? themeClasses.tab.active 
              : themeClasses.tab.inactive
          }`}
          onClick={() => setActiveTab('api')}
        >
          {pageText.tabs.api[language]}
        </button>
        <button 
          className={`px-4 py-2 rounded-t-lg transition-colors ${
            activeTab === 'data' 
              ? themeClasses.tab.active 
              : themeClasses.tab.inactive
          }`}
          onClick={() => setActiveTab('data')}
        >
          {pageText.tabs.data[language]}
        </button>
        <button 
          className={`px-4 py-2 rounded-t-lg transition-colors ${
            activeTab === 'developer' 
              ? themeClasses.tab.active 
              : themeClasses.tab.inactive
          }`}
          onClick={() => setActiveTab('developer')}
        >
          {pageText.tabs.developer[language]}
        </button>
      </div>

      {/* Контент табов */}
      <div className="space-y-6">
        {/* СИСТЕМА */}
        {activeTab === 'system' && (
          <>
            <div className={`p-6 rounded-xl border ${themeClasses.card}`}>
              <h2 className={`text-xl font-semibold mb-4 ${themeClasses.text.primary}`}>
                {pageText.systemSettings.title[language]}
              </h2>
              
              <div className="space-y-4">
                {/* Язык */}
                <div className="flex items-center justify-between py-3 border-b">
                  <div>
                    <label className={`block font-medium ${themeClasses.text.primary}`}>
                      {pageText.systemSettings.language[language]}
                    </label>
                    <p className={`text-sm ${themeClasses.text.secondary}`}>
                      {pageText.systemSettings.languageDesc[language]}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className={`px-3 py-1 rounded border ${language === 'ru' ? 'bg-green-600 text-white' : themeClasses.button.outline}`}
                      onClick={() => handleLanguageChange('ru')}
                    >
                      🇷🇺
                    </button>
                    <button
                      className={`px-3 py-1 rounded border ${language === 'en' ? 'bg-green-600 text-white' : themeClasses.button.outline}`}
                      onClick={() => handleLanguageChange('en')}
                    >
                      🇬🇧
                    </button>
                    <button
                      className={`px-3 py-1 rounded border ${language === 'kg' ? 'bg-green-600 text-white' : themeClasses.button.outline}`}
                      onClick={() => handleLanguageChange('kg')}
                    >
                      🇰🇬
                    </button>
                  </div>
                </div>

                {/* Часовой пояс */}
                <div className="flex items-center justify-between py-3 border-b">
                  <div>
                    <label className={`block font-medium ${themeClasses.text.primary}`}>
                      {pageText.systemSettings.timezone[language]}
                    </label>
                    <p className={`text-sm ${themeClasses.text.secondary}`}>
                      {pageText.systemSettings.timezoneDesc[language]}
                    </p>
                  </div>
                  <select className={`px-3 py-2 rounded-lg border ${themeClasses.input}`}>
                    <option>{pageText.timezones.bishkek[language]}</option>
                    <option>{pageText.timezones.moscow[language]}</option>
                    <option>{pageText.timezones.newyork[language]}</option>
                  </select>
                </div>

                {/* Формат даты */}
                <div className="flex items-center justify-between py-3 border-b">
                  <div>
                    <label className={`block font-medium ${themeClasses.text.primary}`}>
                      {pageText.systemSettings.dateFormat[language]}
                    </label>
                    <p className={`text-sm ${themeClasses.text.secondary}`}>
                      {pageText.systemSettings.dateFormatDesc[language]}
                    </p>
                  </div>
                  <select className={`px-3 py-2 rounded-lg border ${themeClasses.input}`}>
                    <option>{pageText.dateFormats.dmy[language]}</option>
                    <option>{pageText.dateFormats.mdy[language]}</option>
                    <option>{pageText.dateFormats.ymd[language]}</option>
                  </select>
                </div>

                {/* Единицы измерения */}
                <div className="flex items-center justify-between py-3">
                  <div>
                    <label className={`block font-medium ${themeClasses.text.primary}`}>
                      {pageText.systemSettings.units[language]}
                    </label>
                    <p className={`text-sm ${themeClasses.text.secondary}`}>
                      {pageText.systemSettings.unitsDesc[language]}
                    </p>
                  </div>
                  <select className={`px-3 py-2 rounded-lg border ${themeClasses.input}`}>
                    <option>{pageText.units.metric[language]}</option>
                    <option>{pageText.units.imperial[language]}</option>
                  </select>
                </div>
              </div>
            </div>

            <div className={`p-6 rounded-xl border ${themeClasses.card}`}>
              <h2 className={`text-xl font-semibold mb-4 ${themeClasses.text.primary}`}>
                {pageText.performance.title[language]}
              </h2>
              
              <div className="space-y-4">
                {/* Кэширование */}
                <div className="flex items-center justify-between py-3 border-b">
                  <div>
                    <label className={`block font-medium ${themeClasses.text.primary}`}>
                      {pageText.performance.caching[language]}
                    </label>
                    <p className={`text-sm ${themeClasses.text.secondary}`}>
                      {pageText.performance.cachingDesc[language]}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={true} readOnly />
                    <div className={`w-11 h-6 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${themeClasses.toggle.bg} peer-checked:bg-green-600`}></div>
                  </label>
                </div>

                {/* Автообновление */}
                <div className="flex items-center justify-between py-3 border-b">
                  <div>
                    <label className={`block font-medium ${themeClasses.text.primary}`}>
                      {pageText.performance.autoSync[language]}
                    </label>
                    <p className={`text-sm ${themeClasses.text.secondary}`}>
                      {pageText.performance.autoSyncDesc[language]}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={autoSync} 
                      onChange={(e) => setAutoSync(e.target.checked)} 
                    />
                    <div className={`w-11 h-6 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${themeClasses.toggle.bg} peer-checked:bg-green-600`}></div>
                  </label>
                </div>

                {/* Отладочный режим */}
                <div className="flex items-center justify-between py-3">
                  <div>
                    <label className={`block font-medium ${themeClasses.text.primary}`}>
                      {pageText.performance.debugMode[language]}
                    </label>
                    <p className={`text-sm ${themeClasses.text.secondary}`}>
                      {pageText.performance.debugModeDesc[language]}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={debugMode} 
                      onChange={(e) => setDebugMode(e.target.checked)} 
                    />
                    <div className={`w-11 h-6 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${themeClasses.toggle.bg} peer-checked:bg-green-600`}></div>
                  </label>
                </div>
              </div>
            </div>
          </>
        )}

        {/* API И ИНТЕГРАЦИИ */}
        {activeTab === 'api' && (
          <div className={`p-6 rounded-xl border ${themeClasses.card}`}>
            <h2 className={`text-xl font-semibold mb-4 ${themeClasses.text.primary}`}>
              {pageText.apiKeys.title[language]}
            </h2>
            
            <div className="space-y-6">
              {/* Публичный ключ */}
              <div className="p-4 rounded-lg border">
                <div className="flex items-center justify-between mb-2">
                  <span className={`font-medium ${themeClasses.text.primary}`}>
                    {pageText.apiKeys.public[language]}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full ${themeClasses.badge.production}`}>
                    {pageText.apiKeys.production[language]}
                  </span>
                </div>
                <div className="flex gap-2">
                  <code className={`flex-1 p-3 rounded-lg font-mono text-sm ${themeClasses.input}`}>
                    {showApiKey ? apiKey : '••••••••••••••••••••••••'}
                  </code>
                  <div className="flex gap-2">
                    <button 
                      className={`px-3 py-2 rounded-lg border ${themeClasses.button.outline}`}
                      onClick={() => setShowApiKey(!showApiKey)}
                    >
                      {showApiKey ? pageText.apiKeys.hide[language] : pageText.apiKeys.show[language]}
                    </button>
                    <button 
                      className={`px-3 py-2 rounded-lg border ${themeClasses.button.outline}`}
                      onClick={copyApiKey}
                    >
                      {pageText.apiKeys.copy[language]}
                    </button>
                    <button 
                      className={`px-3 py-2 rounded-lg border ${themeClasses.button.outline}`}
                      onClick={generateNewApiKey}
                    >
                      {pageText.apiKeys.generate[language]}
                    </button>
                  </div>
                </div>
              </div>

              {/* Секретный ключ */}
              <div className="p-4 rounded-lg border">
                <div className="flex items-center justify-between mb-2">
                  <span className={`font-medium ${themeClasses.text.primary}`}>
                    {pageText.apiKeys.secret[language]}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full ${themeClasses.badge.warning}`}>
                    {pageText.apiKeys.warning[language]}
                  </span>
                </div>
                <div className="flex gap-2">
                  <code className={`flex-1 p-3 rounded-lg font-mono text-sm ${themeClasses.input}`}>
                    sk_live_farmvision_2026_kg_123456789
                  </code>
                  <button 
                    className={`px-3 py-2 rounded-lg border ${themeClasses.button.outline}`}
                    onClick={copyApiKey}
                  >
                    {pageText.apiKeys.copy[language]}
                  </button>
                </div>
              </div>

              {/* Webhook */}
              <div className="p-4 rounded-lg border">
                <h3 className={`font-medium mb-2 ${themeClasses.text.primary}`}>
                  {pageText.webhook.title[language]}
                </h3>
                <p className={`text-sm mb-3 ${themeClasses.text.secondary}`}>
                  {pageText.webhook.description[language]}
                </p>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    className={`flex-1 px-3 py-2 rounded-lg border ${themeClasses.input}`}
                    placeholder="https://your-server.com/webhook"
                  />
                  <button className={`px-4 py-2 rounded-lg ${themeClasses.button.primary}`}>
                    {pageText.webhook.save[language]}
                  </button>
                </div>
              </div>

              {/* Ссылка на документацию */}
              <div className="mt-4 p-4 rounded-lg border flex items-center justify-between">
                <span className={themeClasses.text.primary}>{pageText.docs.text[language]}</span>
                <a href="#" className="text-green-600 hover:text-green-700 font-medium">
                  {pageText.docs.link[language]}
                </a>
              </div>
            </div>
          </div>
        )}

        {/* ДАННЫЕ И БЭКАПЫ */}
        {activeTab === 'data' && (
          <>
            <div className={`p-6 rounded-xl border ${themeClasses.card}`}>
              <h2 className={`text-xl font-semibold mb-4 ${themeClasses.text.primary}`}>
                {pageText.dataManagement.title[language]}
              </h2>
              
              <div className="space-y-4">
                {/* Хранение истории */}
                <div className="flex items-center justify-between py-3 border-b">
                  <div>
                    <label className={`block font-medium ${themeClasses.text.primary}`}>
                      {pageText.dataManagement.retention[language]}
                    </label>
                    <p className={`text-sm ${themeClasses.text.secondary}`}>
                      {pageText.dataManagement.retentionDesc[language]}
                    </p>
                  </div>
                  <select 
                    className={`px-3 py-2 rounded-lg border ${themeClasses.input}`}
                    value={dataRetention}
                    onChange={(e) => setDataRetention(e.target.value)}
                  >
                    <option value="3">{pageText.dataManagement.months3[language]}</option>
                    <option value="6">{pageText.dataManagement.months6[language]}</option>
                    <option value="12">{pageText.dataManagement.months12[language]}</option>
                    <option value="24">{pageText.dataManagement.months24[language]}</option>
                    <option value="0">{pageText.dataManagement.unlimited[language]}</option>
                  </select>
                </div>

                {/* Автоматический бэкап */}
                <div className="flex items-center justify-between py-3 border-b">
                  <div>
                    <label className={`block font-medium ${themeClasses.text.primary}`}>
                      {pageText.dataManagement.autoBackup[language]}
                    </label>
                    <p className={`text-sm ${themeClasses.text.secondary}`}>
                      {pageText.dataManagement.autoBackupDesc[language]}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={backupEnabled} 
                      onChange={(e) => setBackupEnabled(e.target.checked)} 
                    />
                    <div className={`w-11 h-6 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${themeClasses.toggle.bg} peer-checked:bg-green-600`}></div>
                  </label>
                </div>

                {/* Ручной бэкап */}
                <div className="py-3">
                  <h3 className={`font-medium mb-2 ${themeClasses.text.primary}`}>
                    {pageText.dataManagement.manualBackup[language]}
                  </h3>
                  <div className="flex gap-2">
                    <button className={`px-4 py-2 rounded-lg border ${themeClasses.button.outline}`}>
                      {pageText.dataManagement.download[language]}
                    </button>
                    <button className={`px-4 py-2 rounded-lg border ${themeClasses.button.outline}`}>
                      {pageText.dataManagement.restore[language]}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Опасная зона */}
            <div className={`p-6 rounded-xl border ${themeClasses.dangerZone}`}>
              <h2 className={`text-xl font-semibold mb-4 text-red-600`}>
                {pageText.dangerZone.title[language]}
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-red-200 dark:border-red-900">
                  <div>
                    <h4 className={`font-medium ${themeClasses.text.primary}`}>
                      {pageText.dangerZone.clearCache[language]}
                    </h4>
                    <p className={`text-sm ${themeClasses.text.secondary}`}>
                      {pageText.dangerZone.clearCacheDesc[language]}
                    </p>
                  </div>
                  <button className={`px-4 py-2 rounded-lg ${themeClasses.button.secondary}`}>
                    {pageText.dangerZone.clear[language]}
                  </button>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-red-200 dark:border-red-900">
                  <div>
                    <h4 className={`font-medium ${themeClasses.text.primary}`}>
                      {pageText.dangerZone.resetSettings[language]}
                    </h4>
                    <p className={`text-sm ${themeClasses.text.secondary}`}>
                      {pageText.dangerZone.resetSettingsDesc[language]}
                    </p>
                  </div>
                  <button className={`px-4 py-2 rounded-lg ${themeClasses.button.warning}`}>
                    {pageText.dangerZone.reset[language]}
                  </button>
                </div>

                <div className="flex items-center justify-between py-3">
                  <div>
                    <h4 className={`font-medium ${themeClasses.text.primary}`}>
                      {pageText.dangerZone.deleteData[language]}
                    </h4>
                    <p className={`text-sm text-red-600`}>
                      {pageText.dangerZone.deleteDataDesc[language]}
                    </p>
                  </div>
                  <button className={`px-4 py-2 rounded-lg ${themeClasses.button.danger}`}>
                    {pageText.dangerZone.delete[language]}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* РАЗРАБОТЧИКУ */}
        {activeTab === 'developer' && (
          <>
            <div className={`p-6 rounded-xl border ${themeClasses.card}`}>
              <h2 className={`text-xl font-semibold mb-4 ${themeClasses.text.primary}`}>
                {pageText.devInfo.title[language]}
              </h2>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b">
                  <span className={themeClasses.text.secondary}>{pageText.devInfo.appVersion[language]}</span>
                  <code className={`font-mono ${themeClasses.text.primary}`}>v2.4.0 (build 2026.02.13)</code>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <span className={themeClasses.text.secondary}>{pageText.devInfo.nodeVersion[language]}</span>
                  <code className={`font-mono ${themeClasses.text.primary}`}>v18.17.0</code>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <span className={themeClasses.text.secondary}>{pageText.devInfo.reactVersion[language]}</span>
                  <code className={`font-mono ${themeClasses.text.primary}`}>v18.2.0</code>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className={themeClasses.text.secondary}>{pageText.devInfo.lastDeploy[language]}</span>
                  <code className={`font-mono ${themeClasses.text.primary}`}>13.02.2026 14:23</code>
                </div>
              </div>
            </div>

            <div className={`p-6 rounded-xl border ${themeClasses.card}`}>
              <h2 className={`text-xl font-semibold mb-4 ${themeClasses.text.primary}`}>
                {pageText.logs.title[language]}
              </h2>
              
              <div className="space-y-4">
                <div className="flex gap-2">
                  <select className={`px-3 py-2 rounded-lg border ${themeClasses.input}`}>
                    <option>{pageText.logs.allLevels[language]}</option>
                    <option>{pageText.logs.errors[language]}</option>
                    <option>{pageText.logs.warnings[language]}</option>
                    <option>{pageText.logs.info[language]}</option>
                  </select>
                  <button className={`px-4 py-2 rounded-lg border ${themeClasses.button.outline}`}>
                    {pageText.logs.refresh[language]}
                  </button>
                </div>
                
                <div className="space-y-2">
                  <div className={`p-3 rounded-lg border ${themeClasses.log.error}`}>
                    <span className="text-xs font-mono mr-2">14:23:45</span>
                    <span className="text-xs font-bold mr-2">ERROR</span>
                    <span className="text-sm">{pageText.logs.errors[language]}</span>
                  </div>
                  <div className={`p-3 rounded-lg border ${themeClasses.log.warn}`}>
                    <span className="text-xs font-mono mr-2">14:20:12</span>
                    <span className="text-xs font-bold mr-2">WARN</span>
                    <span className="text-sm">{pageText.logs.warnings[language]}</span>
                  </div>
                  <div className={`p-3 rounded-lg border ${themeClasses.log.info}`}>
                    <span className="text-xs font-mono mr-2">14:15:03</span>
                    <span className="text-xs font-bold mr-2">INFO</span>
                    <span className="text-sm">{pageText.logs.info[language]}</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Advanced;