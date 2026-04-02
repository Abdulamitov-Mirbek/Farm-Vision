// client/src/contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api/authAPI';

// Создаем контекст
const AuthContext = createContext();

// Хук для использования контекста - ЭКСПОРТИРУЕМ
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Провайдер контекста - ЭКСПОРТИРУЕМ
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserFromStorage = () => {
      const storedUser = localStorage.getItem('agri_user');
      const storedToken = localStorage.getItem('auth_token');
      
      console.log('🔄 Загрузка из localStorage:', { 
        user: storedUser ? 'есть' : 'нет', 
        token: storedToken ? 'есть' : 'нет' 
      });
      
      if (storedUser && storedToken) {
        try {
          setUser(JSON.parse(storedUser));
          console.log('✅ Пользователь загружен из localStorage');
        } catch (error) {
          console.error('❌ Ошибка парсинга user:', error);
          localStorage.removeItem('agri_user');
          localStorage.removeItem('auth_token');
        }
      }
      setLoading(false);
    };
    
    loadUserFromStorage();
  }, []);

  // ИСПРАВЛЕНО: добавлен параметр userType
  const login = async (email, password, userType) => {
    try {
      console.log('🟢 Попытка входа...', { email, userType });
      
      // Передаем userType в API
      const response = await authAPI.login(email, password, userType);
      console.log('🟢 Ответ от API:', response);
      
      // Получаем данные из ответа
      const data = response.data || response;
      const token = data.token;
      const userData = data.user;
      
      if (token && userData) {
        localStorage.setItem('auth_token', token);
        localStorage.setItem('agri_user', JSON.stringify(userData));
        setUser(userData);
        
        console.log('✅ Успешный вход!');
        console.log('📝 Токен сохранен');
        console.log('👤 Пользователь:', userData);
        console.log('👑 Роль пользователя:', userData.role);
        
        return { success: true, user: userData };
      } else {
        console.error('❌ Неверный формат ответа:', data);
        return { success: false, error: data?.message || 'Неверный формат ответа от сервера' };
      }
      
    } catch (error) {
      console.error('🔴 Ошибка входа:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Ошибка при входе' 
      };
    }
  };

  const register = async (userData) => {
    try {
      console.log('📤 AuthContext.register:', userData);
      const response = await authAPI.register(userData);
      console.log('📥 Ответ от сервера:', response);
      
      const data = response.data || response;
      
      if (data.token && data.user) {
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('agri_user', JSON.stringify(data.user));
        setUser(data.user);
        return { success: true, user: data.user };
      } else {
        return { success: false, error: data?.message || 'Неверный формат ответа' };
      }
    } catch (error) {
      console.error('❌ Ошибка регистрации:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Ошибка регистрации' 
      };
    }
  };
  
  const logout = () => {
    console.log('🚪 Выход из системы');
    authAPI.logout();
    setUser(null);
    localStorage.removeItem('agri_user');
    localStorage.removeItem('auth_token');
  };

  const updateProfile = async (updatedData) => {
    try {
      const response = await authAPI.updateProfile(updatedData);
      if (response.success) {
        const updatedUser = { ...user, ...updatedData };
        setUser(updatedUser);
        localStorage.setItem('agri_user', JSON.stringify(updatedUser));
        return { success: true, user: updatedUser };
      }
      return { success: false, error: 'Ошибка обновления' };
    } catch (error) {
      console.error('❌ Ошибка обновления профиля:', error);
      return { success: false, error: error.message };
    }
  };

  // Добавляем проверки ролей для удобства
  const isAdmin = user?.role === 'admin';
  const isWorker = user?.role === 'worker';

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user,
    isAdmin,
    isWorker
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// НЕ экспортируем AuthContext напрямую, только через хуки
// export { AuthContext }; - УДАЛЯЕМ ЭТУ СТРОКУ