// src/contexts/LanguageContext.jsx
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { translations } from '../i18n/translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  // Получаем язык из localStorage или ставим 'ru' по умолчанию
  const [language, setLanguage] = useState(() => {
    const savedLang = localStorage.getItem('app_language');
    // Проверяем, что сохраненный язык поддерживается
    return (savedLang && translations[savedLang]) ? savedLang : 'ru';
  });

  // Сохраняем язык в localStorage при изменении
  useEffect(() => {
    localStorage.setItem('app_language', language);
    // Добавляем класс языка к html элементу
    document.documentElement.lang = language;
    document.documentElement.dir = 'ltr'; // для будущей поддержки RTL
  }, [language]);

  // Функция для перевода - используем useCallback для оптимизации
  const t = useCallback((key) => {
    if (!key) return '';
    
    // Сначала ищем в выбранном языке
    const translation = translations[language]?.[key];
    if (translation !== undefined) return translation;
    
    // Если нет, ищем в русском (как запасной вариант)
    const fallback = translations['ru']?.[key];
    if (fallback !== undefined) return fallback;
    
    // Если ничего не найдено, возвращаем ключ
    console.warn(`Translation missing for key: ${key} in language: ${language}`);
    return key;
  }, [language]);

  // Функция для смены языка
  const changeLanguage = useCallback((lang) => {
    if (translations[lang]) {
      setLanguage(lang);
    }
  }, []);

  const value = {
    language,
    setLanguage, // ✅ ДОБАВЛЯЕМ setLanguage для прямого доступа!
    changeLanguage,
    t,
    // Хелперы для проверки текущего языка
    isRu: language === 'ru',
    isEn: language === 'en',
    isKg: language === 'kg',
    // Список доступных языков
    availableLanguages: Object.keys(translations).map(code => ({
      code,
      name: translations[code]?.[code === 'ru' ? 'russian' : code === 'en' ? 'english' : 'kyrgyz'] || code,
      flag: code === 'ru' ? '🇷🇺' : code === 'en' ? '🇬🇧' : '🇰🇬'
    }))
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};