// src/App.jsx - ИСПРАВЛЕННЫЙ
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import { WeatherProvider } from './contexts/WeatherContext';
import { AvatarProvider } from './contexts/AvatarContext';
import AppRoutes from './routes';
import { useAuth } from './hooks/useAuth';
import { useLanguage } from './contexts/LanguageContext';
// В других файлах импортируйте так:

// Компонент загрузки
const LoadingScreen = () => {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
      <div className="text-center bg-white p-8 rounded-2xl shadow-xl">
        <div className="w-20 h-20 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 font-medium">{t('loading') || 'Загрузка приложения...'}</p>
        <p className="text-sm text-gray-400 mt-2">Farm Culture</p>
      </div>
    </div>
  );
};

// Основной компонент с проверкой авторизации
const AppContent = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingScreen />;
  }

  // ВСЮ маршрутизацию делегируем AppRoutes
  return <AppRoutes />;
};

// Основной компонент App
function App() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <AuthProvider>
        <LanguageProvider>
          <WeatherProvider>
            <AvatarProvider>
              <AppContent />
            </AvatarProvider>
          </WeatherProvider>
        </LanguageProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;