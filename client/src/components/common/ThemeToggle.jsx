// src/components/common/ThemeToggle.jsx
import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const ThemeToggle = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-lg transition-colors ${
        theme === 'dark' 
          ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400' 
          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
      } ${className}`}
      aria-label="Toggle theme"
      title={theme === 'dark' ? 'Светлая тема' : 'Темная тема'}
    >
      {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
};

export default ThemeToggle;