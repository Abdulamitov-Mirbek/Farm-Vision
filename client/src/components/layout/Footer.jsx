// src/components/layout/Footer.jsx
import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';

const Footer = () => {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const currentYear = new Date().getFullYear();

  // Тексты для футера на разных языках
  const footerText = {
    about: {
      ru: 'О системе',
      en: 'About',
      kg: 'Система жөнүндө'
    },
    docs: {
      ru: 'Документация',
      en: 'Documentation',
      kg: 'Документация'
    },
    support: {
      ru: 'Поддержка',
      en: 'Support',
      kg: 'Колдоо'
    },
    privacy: {
      ru: 'Конфиденциальность',
      en: 'Privacy',
      kg: 'Купуялык'
    },
    terms: {
      ru: 'Условия',
      en: 'Terms',
      kg: 'Шарттар'
    },
    systemWorking: {
      ru: 'Система работает стабильно',
      en: 'System is stable',
      kg: 'Система туруктуу иштейт'
    },
    version: {
      ru: 'Версия',
      en: 'Version',
      kg: 'Версия'
    },
    lastUpdate: {
      ru: 'Последнее обновление: сегодня',
      en: 'Last update: today',
      kg: 'Акыркы жаңыртуу: бүгүн'
    },
    changelog: {
      ru: 'История изменений',
      en: 'Changelog',
      kg: 'Өзгөрүүлөр тарыхы'
    },
    farmInfo: {
      ru: 'Система разработана для оптимизации сельскохозяйственных процессов. Используйте мобильное приложение для работы в поле.',
      en: 'The system is designed to optimize agricultural processes. Use the mobile app to work in the field.',
      kg: 'Система айыл чарба процесстерин оптималдаштыруу үчүн иштелип чыккан. Талаада иштөө үчүн мобилдик колдонмону колдонуңуз.'
    },
    downloadIOS: {
      ru: '📱 Скачать для iOS',
      en: '📱 Download for iOS',
      kg: '📱 iOS үчүн жүктөө'
    },
    downloadAndroid: {
      ru: '🤖 Скачать для Android',
      en: '🤖 Download for Android',
      kg: '🤖 Android үчүн жүктөө'
    },
    allRightsReserved: {
      ru: 'Все права защищены. Система управления сельским хозяйством.',
      en: 'All rights reserved. Agricultural Management System.',
      kg: 'Бардык укуктар корголгон. Айыл чарба башкаруу системасы.'
    },
    location: {
      ru: 'Бишкек, Кыргызстан',
      en: 'Bishkek, Kyrgyzstan',
      kg: 'Бишкек, Кыргызстан'
    }
  };

  // Классы для темной/светлой темы
  const themeClasses = {
    footer: theme === 'dark' 
      ? 'bg-gray-900 border-gray-800' 
      : 'bg-white border-gray-200',
    text: {
      primary: theme === 'dark' ? 'text-white' : 'text-gray-900',
      secondary: theme === 'dark' ? 'text-gray-400' : 'text-gray-600',
      muted: theme === 'dark' ? 'text-gray-500' : 'text-gray-500',
      link: theme === 'dark' 
        ? 'text-gray-400 hover:text-green-400' 
        : 'text-gray-600 hover:text-primary-600',
      linkPrimary: theme === 'dark'
        ? 'text-green-400 hover:text-green-300'
        : 'text-primary-600 hover:text-primary-700',
    },
    border: theme === 'dark' ? 'border-gray-800' : 'border-gray-200',
    icon: theme === 'dark' ? 'text-gray-500 hover:text-green-400' : 'text-gray-400 hover:text-primary-600',
    badge: {
      bg: theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100',
      text: theme === 'dark' ? 'text-gray-300' : 'text-gray-600',
    },
    statusDot: 'bg-green-500',
  };

  return (
    <footer className={`border-t py-6 px-6 transition-colors duration-300 ${themeClasses.footer} ${themeClasses.border}`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          {/* Лого и копирайт */}
          <div className="mb-4 md:mb-0">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-primary-600 rounded flex items-center justify-center">
                <span className="text-white text-sm font-bold">🌾</span>
              </div>
              <span className={`font-bold ${themeClasses.text.primary}`}>Farm Vision</span>
            </div>
            <p className={`text-sm mt-2 ${themeClasses.text.secondary}`}>
              © {currentYear} {footerText.allRightsReserved[language]}
            </p>
          </div>

          {/* Ссылки */}
          <div className="flex flex-wrap justify-start md:justify-center gap-4 md:gap-6 mb-4 md:mb-0">
            <a href="/about" className={`text-sm transition-colors duration-200 ${themeClasses.text.link}`}>
              {footerText.about[language]}
            </a>
            <a href="/docs" className={`text-sm transition-colors duration-200 ${themeClasses.text.link}`}>
              {footerText.docs[language]}
            </a>
            <a href="/support" className={`text-sm transition-colors duration-200 ${themeClasses.text.link}`}>
              {footerText.support[language]}
            </a>
            <a href="/privacy" className={`text-sm transition-colors duration-200 ${themeClasses.text.link}`}>
              {footerText.privacy[language]}
            </a>
            <a href="/terms" className={`text-sm transition-colors duration-200 ${themeClasses.text.link}`}>
              {footerText.terms[language]}
            </a>
          </div>
        </div>

        {/* Социальные сети и контакты */}
        <div className="mt-6 flex flex-col md:flex-row justify-between items-start md:items-center">
          {/* Социальные сети */}
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <div className="flex space-x-3">
              <a href="https://t.me/global_agri" className={`transition-colors duration-200 ${themeClasses.icon}`}>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.461-1.9-.902-1.056-.692-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
              </a>
              <a href="https://vk.com/global_agri" className={`transition-colors duration-200 ${themeClasses.icon}`}>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M15.073 2H8.937C3.332 2 2 3.333 2 8.927v6.136C2 20.667 3.323 22 8.927 22h6.136C20.667 22 22 20.677 22 15.073V8.937C22 3.332 20.677 2 15.073 2zm3.073 14.27h-1.459c-.552 0-.718-.447-1.708-1.437-.864-.833-1.229-.937-1.448-.937-.302 0-.385.083-.385.5v1.312c0 .354-.115.563-1.042.563-1.53 0-3.083-.834-4.281-2.396-1.646-2.135-2.521-4.583-2.521-4.583 0-.26.083-.5.5-.5h1.459c.375 0 .51.167.656.552.708 2.084 1.927 3.896 2.417 3.896.187 0 .27-.083.27-.552v-2.146c-.062-.979-.582-1.062-.582-1.416a.36.36 0 0 1 .374-.334h2.292c.312 0 .416.156.416.531v2.896c0 .312.135.416.229.416.187 0 .333-.104.667-.437 1.135-1.271 1.958-3.208 1.958-3.208.125-.354.302-.5.656-.5h1.459c.437 0 .53.229.437.531-.208 1.02-2.239 3.854-2.239 3.854-.187.27-.27.416 0 .708.19.239.833.78 1.25 1.271.854.937 1.458 1.687 1.458 2.114 0 .26-.156.395-.469.395z"/>
                </svg>
              </a>
              <a href="mailto:support@globalagri.ru" className={`transition-colors duration-200 ${themeClasses.icon}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </a>
            </div>
            
            <div className={`h-6 w-px ${themeClasses.border}`}></div>
            
            {/* Контактная информация */}
            <div className={`text-sm ${themeClasses.text.secondary}`}>
              <div className="flex items-center space-x-1">
                <svg className={`w-4 h-4 ${theme === 'dark' ? 'text-green-400' : 'text-primary-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{footerText.location[language]}</span>
              </div>
              <div className="flex items-center space-x-1 mt-1">
                <svg className={`w-4 h-4 ${theme === 'dark' ? 'text-green-400' : 'text-primary-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>+996 (777) 38-98-66</span>
                <span className="mx-1">•</span>
                <span>+996 (501) 81-81-91</span>
              </div>
            </div>
          </div>
        </div>

        {/* Версия и статус */}
        <div className={`mt-6 pt-6 border-t text-center ${themeClasses.border}`}>
          <div className="inline-flex flex-wrap items-center justify-center gap-2 text-sm">
            <div className="flex items-center">
              <span className={`w-2 h-2 rounded-full mr-2 ${themeClasses.statusDot}`}></span>
              <span className={themeClasses.text.secondary}>{footerText.systemWorking[language]}</span>
            </div>
            <span className={themeClasses.text.muted}>•</span>
            <span className={themeClasses.text.secondary}>{footerText.version[language]} 1.00.3</span>
            <span className={themeClasses.text.muted}>•</span>
            <span className={themeClasses.text.secondary}>{footerText.lastUpdate[language]} 12:30</span>
            <span className={themeClasses.text.muted}>•</span>
            <a href="/changelog" className={`transition-colors duration-200 ${themeClasses.text.linkPrimary}`}>
              {footerText.changelog[language]}
            </a>
          </div>
        </div>

        {/* Информация для фермеров */}
        <div className="mt-4 text-center">
          <p className={`text-xs ${themeClasses.text.muted}`}>
            {footerText.farmInfo[language]}
          </p>
          <div className="mt-2 flex justify-center space-x-4">
            <a href="/mobile-app" className={`text-xs transition-colors duration-200 ${themeClasses.text.linkPrimary}`}>
              📱 {footerText.downloadIOS[language]}
            </a>
            <a href="/mobile-app" className={`text-xs transition-colors duration-200 ${themeClasses.text.linkPrimary}`}>
              🤖 {footerText.downloadAndroid[language]}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;