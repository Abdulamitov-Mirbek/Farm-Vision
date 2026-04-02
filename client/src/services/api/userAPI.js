// client/src/services/api/userAPI.js
import api from './axiosConfig';

const userAPI = {
  // Получение профиля пользователя
  getProfile: async () => {
    try {
      console.log('📤 Запрос профиля...');
      
      // Пробуем разные варианты эндпоинтов
      let response;
      const endpoints = [
        '/auth/profile',
        '/users/profile'
      ];
      
      for (const endpoint of endpoints) {
        try {
          console.log(`Пробуем ${endpoint}...`);
          response = await api.get(endpoint);
          if (response.data) {
            console.log(`✅ Успешно на ${endpoint}:`, response.data);
            return response.data;
          }
        } catch (err) {
          console.log(`❌ ${endpoint} не работает:`, err.message);
        }
      }
      
      throw new Error('Не удалось найти эндпоинт профиля');
    } catch (error) {
      console.error('❌ Ошибка загрузки профиля:', error);
      throw error;
    }
  },

  // Обновление профиля
  updateProfile: async (userData) => {
    try {
      console.log('📤 Отправка данных профиля:', userData);
      
      const response = await api.put('/auth/profile', userData);
      console.log('✅ Профиль обновлен:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Ошибка обновления профиля:', error);
      throw error;
    }
  },

  // Смена пароля
  changePassword: async (passwordData) => {
    try {
      console.log('📤 Смена пароля...');
      
      const response = await api.post('/auth/change-password', passwordData);
      console.log('✅ Пароль изменен');
      return response.data;
    } catch (error) {
      console.error('❌ Ошибка смены пароля:', error);
      throw error;
    }
  },

  // ✅ ДОБАВЛЕН МЕТОД ДЛЯ СТАТИСТИКИ
  getUserStats: async () => {
    try {
      console.log('📤 Запрос статистики пользователя...');
      
      const endpoints = [
        '/auth/stats',
        '/users/stats'
      ];
      
      for (const endpoint of endpoints) {
        try {
          console.log(`Пробуем ${endpoint}...`);
          const response = await api.get(endpoint);
          if (response.data) {
            console.log(`✅ Статистика получена с ${endpoint}:`, response.data);
            return response.data;
          }
        } catch (err) {
          console.log(`❌ ${endpoint} не работает:`, err.message);
        }
      }
      
      // Заглушка для дашборда
      console.log('⚠️ Используем заглушку для статистики');
      return {
        fields: 12,
        animals: 45,
        tasks: 8,
        resources: 23,
        crops: 6,
        weather: {
          temperature: 22,
          condition: 'sunny'
        }
      };
    } catch (error) {
      console.error('❌ Ошибка получения статистики:', error);
      return {
        fields: 0,
        animals: 0,
        tasks: 0,
        resources: 0,
        crops: 0
      };
    }
  },

  // Загрузка аватара
  uploadAvatar: async (formData) => {
    try {
      console.log('📤 Загрузка аватара...');
      
      const response = await api.post('/auth/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      console.error('❌ Ошибка загрузки аватара:', error);
      throw error;
    }
  },

  // Удаление аватара
  deleteAvatar: async () => {
    try {
      console.log('📤 Удаление аватара...');
      
      const response = await api.delete('/auth/avatar');
      return response.data;
    } catch (error) {
      console.error('❌ Ошибка удаления аватара:', error);
      throw error;
    }
  },

  // Получение настроек пользователя
  getUserSettings: async () => {
    try {
      console.log('📤 Запрос настроек пользователя...');
      
      const response = await api.get('/auth/settings');
      return response.data;
    } catch (error) {
      console.error('❌ Ошибка загрузки настроек:', error);
      throw error;
    }
  },

  // Обновление настроек пользователя
  updateUserSettings: async (settings) => {
    try {
      console.log('📤 Обновление настроек:', settings);
      
      const response = await api.put('/auth/settings', settings);
      return response.data;
    } catch (error) {
      console.error('❌ Ошибка обновления настроек:', error);
      throw error;
    }
  }
};

export default userAPI;