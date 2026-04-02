// src/components/layout/MainLayout.jsx
import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Footer from './Footer'; // ✅ ИМПОРТИРУЕМ ФУТЕР

const MainLayout = ({ children }) => {
  const { theme } = useTheme();

  return (
    <div className={`flex min-h-screen transition-colors duration-300 ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className={`flex-1 p-6 transition-colors duration-300 ${
          theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
        }`}>
          {children}
        </main>
        <Footer /> {/* ✅ ФУТЕР ЗДЕСЬ - ПОСЛЕ КОНТЕНТА */}
      </div>
    </div>
  );
};

export default MainLayout;