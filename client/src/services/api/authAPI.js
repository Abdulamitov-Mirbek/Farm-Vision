// client/src/services/api/authAPI.js
import axiosInstance from './axiosConfig';

/**
 * API для аутентификации
 * Работает с реальным сервером на http://localhost:5000/api
 */
export const authAPI = {
  /**
   * Вход пользователя
   * @param {string} email - Email пользователя
   * @param {string} password - Пароль
   * @returns {Promise} - Promise с данными пользователя и токеном
   */
  login: async (email, password) => {
    try {
      console.log('📤 Login request to /api/auth/login');
      const response = await axiosInstance.post('/api/auth/login', { email, password });
      console.log('🔵 Login response:', response.data);
      return response;
    } catch (error) {
      console.error('❌ Login API error:', error);
      throw error;
    }
  },

  /**
   * Регистрация нового пользователя
   * @param {Object} userData - Данные пользователя
   * @param {string} userData.username - Имя пользователя
   * @param {string} userData.email - Email
   * @param {string} userData.password - Пароль
   * @param {string} userData.farmName - Название фермы
   * @param {string} userData.phone - Телефон (опционально)
   * @returns {Promise} - Promise с данными пользователя и токеном
   */
  register: async (userData) => {
    try {
      console.log('📤 Register request to /api/auth/register');
      const response = await axiosInstance.post('/api/auth/register', userData);
      console.log('🔵 Register response:', response.data);
      return response;
    } catch (error) {
      console.error('❌ Register API error:', error);
      throw error;
    }
  },

  /**
   * Получение данных текущего пользователя
   * @returns {Promise} - Promise с данными пользователя
   */
  getMe: async () => {
    try {
      console.log('📤 GetMe request to /api/auth/me');
      const response = await axiosInstance.get('/api/auth/me');
      console.log('🔵 GetMe response:', response.data);
      return response;
    } catch (error) {
      console.error('❌ GetMe API error:', error);
      throw error;
    }
  },

  /**
   * Выход из системы
   * Удаляет токен из localStorage
   */
  logout: () => {
    console.log('🚪 Logout - clearing tokens');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('agri_user');
    localStorage.removeItem('refresh_token');
    // Если на сервере есть эндпоинт для логаута, раскомментируйте:
    // try {
    //   return axiosInstance.post('/api/auth/logout');
    // } catch (error) {
    //   console.error('Logout error:', error);
    // }
  },

  /**
   * Обновление профиля пользователя
   * @param {Object} userData - Обновленные данные
   * @returns {Promise} - Promise с обновленными данными
   */
  updateProfile: async (userData) => {
    try {
      console.log('📤 Update profile request to /api/users/profile:', userData);
      const response = await axiosInstance.put('/api/users/profile', userData);
      console.log('🔵 Update profile response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Update profile API error:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Смена пароля
   * @param {string} currentPassword - Текущий пароль
   * @param {string} newPassword - Новый пароль
   * @returns {Promise} - Promise с результатом
   */
  changePassword: async (currentPassword, newPassword) => {
    try {
      console.log('📤 Change password request to /api/auth/change-password');
      const response = await axiosInstance.post('/api/auth/change-password', {
        currentPassword,
        newPassword
      });
      console.log('🔵 Change password response:', response.data);
      return response;
    } catch (error) {
      console.error('❌ Change password API error:', error);
      throw error;
    }
  },

  /**
   * Запрос на сброс пароля
   * @param {string} email - Email пользователя
   * @returns {Promise} - Promise с результатом
   */
  forgotPassword: async (email) => {
    try {
      console.log('📤 Forgot password request to /api/auth/forgot-password');
      const response = await axiosInstance.post('/api/auth/forgot-password', { email });
      console.log('🔵 Forgot password response:', response.data);
      return response;
    } catch (error) {
      console.error('❌ Forgot password API error:', error);
      throw error;
    }
  },

  /**
   * Сброс пароля по токену
   * @param {string} token - Токен сброса
   * @param {string} newPassword - Новый пароль
   * @returns {Promise} - Promise с результатом
   */
  resetPassword: async (token, newPassword) => {
    try {
      console.log('📤 Reset password request to /api/auth/reset-password');
      const response = await axiosInstance.post('/api/auth/reset-password', {
        token,
        newPassword
      });
      console.log('🔵 Reset password response:', response.data);
      return response;
    } catch (error) {
      console.error('❌ Reset password API error:', error);
      throw error;
    }
  },

  /**
   * Включение двухфакторной аутентификации
   * @returns {Promise} - Promise с секретом для 2FA
   */
  enable2FA: async () => {
    try {
      console.log('📤 Enable 2FA request to /api/auth/2fa/enable');
      const response = await axiosInstance.post('/api/auth/2fa/enable');
      console.log('🔵 Enable 2FA response:', response.data);
      return response;
    } catch (error) {
      console.error('❌ Enable 2FA API error:', error);
      throw error;
    }
  },

  /**
   * Подтверждение 2FA
   * @param {string} token - Код из приложения аутентификатора
   * @returns {Promise} - Promise с результатом
   */
  verify2FA: async (token) => {
    try {
      console.log('📤 Verify 2FA request to /api/auth/2fa/verify');
      const response = await axiosInstance.post('/api/auth/2fa/verify', { token });
      console.log('🔵 Verify 2FA response:', response.data);
      return response;
    } catch (error) {
      console.error('❌ Verify 2FA API error:', error);
      throw error;
    }
  },

  /**
   * Отключение 2FA
   * @param {string} token - Код для подтверждения
   * @returns {Promise} - Promise с результатом
   */
  disable2FA: async (token) => {
    try {
      console.log('📤 Disable 2FA request to /api/auth/2fa/disable');
      const response = await axiosInstance.post('/api/auth/2fa/disable', { token });
      console.log('🔵 Disable 2FA response:', response.data);
      return response;
    } catch (error) {
      console.error('❌ Disable 2FA API error:', error);
      throw error;
    }
  },

  /**
   * Обновление токена
   * @returns {Promise} - Promise с новым токеном
   */
  refreshToken: async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      console.log('📤 Refresh token request to /api/auth/refresh-token');
      
      const response = await axiosInstance.post('/api/auth/refresh-token', { refreshToken });
      
      if (response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
        console.log('🔵 Token refreshed successfully');
      }
      
      if (response.data.refreshToken) {
        localStorage.setItem('refresh_token', response.data.refreshToken);
      }
      
      return response;
    } catch (error) {
      console.error('❌ Refresh token API error:', error);
      throw error;
    }
  },

  /**
   * Проверка валидности токена
   * @returns {Promise} - Promise с результатом проверки
   */
  verifyToken: async () => {
    try {
      console.log('📤 Verify token request to /api/auth/verify');
      const response = await axiosInstance.get('/api/auth/verify');
      console.log('🔵 Verify token response:', response.data);
      return response;
    } catch (error) {
      console.error('❌ Verify token API error:', error);
      throw error;
    }
  }
};

export default authAPI;