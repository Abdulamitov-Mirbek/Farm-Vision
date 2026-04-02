// src/contexts/ThemeContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

// Создаем контекст
const ThemeContext = createContext();

// Хук для использования темы
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Провайдер темы
export const ThemeProvider = ({ children }) => {
  // Проверяем сохраненную тему в localStorage или используем светлую по умолчанию
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'light';
  });

  useEffect(() => {
    // Сохраняем тему в localStorage
    localStorage.setItem('theme', theme);
    
    // Применяем тему к корневому элементу html
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('bg-gray-900', 'text-white');
      document.body.classList.remove('bg-white', 'text-gray-900');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.add('bg-white', 'text-gray-900');
      document.body.classList.remove('bg-gray-900', 'text-white');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};