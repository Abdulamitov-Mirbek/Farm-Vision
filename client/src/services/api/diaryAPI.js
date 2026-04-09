// src/services/api/diaryAPI.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('auth_token');
  return {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
};

export const diaryAPI = {
  // Получить все записи с фильтрацией
  getEntries: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);
      if (filters.activityType) params.append('activityType', filters.activityType);
      if (filters.fieldId) params.append('fieldId', filters.fieldId);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.tags) params.append('tags', filters.tags);
      if (filters.important) params.append('important', filters.important);
      if (filters.search) params.append('search', filters.search);
      
      const url = `${API_URL}/diary${params.toString() ? `?${params.toString()}` : ''}`;
      console.log('📡 Запрос записей дневника:', url);
      
      const response = await axios.get(url, getAuthHeader());
      
      // Преобразуем данные в формат, совместимый с вашим компонентом
      const entries = response.data.entries.map(entry => ({
        id: entry._id,
        date: entry.date,
        category: entry.activityType,
        title: entry.title,
        description: entry.content,
        fieldId: entry.fieldId?._id || entry.fieldId,
        fieldName: entry.fieldId?.name || null,
        cropType: entry.metrics?.cropType || null,
        hours: entry.metrics?.duration || 0,
        workers: entry.metrics?.workers || 0,
        cost: entry.metrics?.cost || 0,
        attachments: entry.images || [],
        tags: entry.tags || [],
        isImportant: entry.isImportant,
        weather: entry.weatherConditions,
        mood: entry.mood
      }));
      
      return {
        data: {
          entries,
          total: response.data.pagination?.total || entries.length,
          stats: response.data.stats || {
            totalHours: entries.reduce((sum, e) => sum + e.hours, 0),
            totalCost: entries.reduce((sum, e) => sum + e.cost, 0),
            byCategory: entries.reduce((acc, e) => {
              acc[e.category] = (acc[e.category] || 0) + 1;
              return acc;
            }, {})
          }
        }
      };
    } catch (error) {
      console.error('❌ Ошибка получения записей:', error.response?.data || error.message);
      
      // В случае ошибки возвращаем пустой результат
      return {
        data: {
          entries: [],
          total: 0,
          stats: { totalHours: 0, totalCost: 0, byCategory: {} }
        }
      };
    }
  },

  // Получить статистику дневника
  getStats: async (period = 'month') => {
    try {
      const url = `${API_URL}/diary/stats?period=${period}`;
      console.log('📡 Запрос статистики дневника:', url);
      
      const response = await axios.get(url, getAuthHeader());
      
      return {
        data: {
          stats: response.data.stats
        }
      };
    } catch (error) {
      console.error('❌ Ошибка получения статистики:', error.response?.data || error.message);
      return { data: { stats: {} } };
    }
  },

  // Получить записи по дате
  getEntriesByDate: async (date) => {
    try {
      const formattedDate = date instanceof Date ? date.toISOString().split('T')[0] : date;
      const url = `${API_URL}/diary/date/${formattedDate}`;
      console.log('📡 Запрос записей по дате:', url);
      
      const response = await axios.get(url, getAuthHeader());
      
      const entries = response.data.entries.map(entry => ({
        id: entry._id,
        date: entry.date,
        category: entry.activityType,
        title: entry.title,
        description: entry.content,
        fieldId: entry.fieldId?._id || entry.fieldId,
        fieldName: entry.fieldId?.name || null,
        cropType: entry.metrics?.cropType || null,
        hours: entry.metrics?.duration || 0,
        workers: entry.metrics?.workers || 0,
        cost: entry.metrics?.cost || 0,
        attachments: entry.images || [],
        tags: entry.tags || [],
        isImportant: entry.isImportant,
        weather: entry.weatherConditions,
        mood: entry.mood
      }));
      
      return { data: { entries } };
    } catch (error) {
      console.error('❌ Ошибка получения записей по дате:', error.response?.data || error.message);
      return { data: { entries: [] } };
    }
  },

  // Получить важные записи
  getImportantEntries: async () => {
    try {
      const url = `${API_URL}/diary/important`;
      console.log('📡 Запрос важных записей:', url);
      
      const response = await axios.get(url, getAuthHeader());
      
      const entries = response.data.entries.map(entry => ({
        id: entry._id,
        date: entry.date,
        category: entry.activityType,
        title: entry.title,
        description: entry.content,
        fieldId: entry.fieldId?._id || entry.fieldId,
        fieldName: entry.fieldId?.name || null,
        cropType: entry.metrics?.cropType || null,
        hours: entry.metrics?.duration || 0,
        workers: entry.metrics?.workers || 0,
        cost: entry.metrics?.cost || 0,
        attachments: entry.images || [],
        tags: entry.tags || [],
        isImportant: entry.isImportant,
        weather: entry.weatherConditions,
        mood: entry.mood
      }));
      
      return { data: { entries } };
    } catch (error) {
      console.error('❌ Ошибка получения важных записей:', error.response?.data || error.message);
      return { data: { entries: [] } };
    }
  },

  // Получить записи по полю
  getEntriesByField: async (fieldId) => {
    try {
      const url = `${API_URL}/diary/field/${fieldId}`;
      console.log('📡 Запрос записей по полю:', url);
      
      const response = await axios.get(url, getAuthHeader());
      
      const entries = response.data.entries.map(entry => ({
        id: entry._id,
        date: entry.date,
        category: entry.activityType,
        title: entry.title,
        description: entry.content,
        fieldId: entry.fieldId?._id || entry.fieldId,
        fieldName: entry.fieldId?.name || null,
        cropType: entry.metrics?.cropType || null,
        hours: entry.metrics?.duration || 0,
        workers: entry.metrics?.workers || 0,
        cost: entry.metrics?.cost || 0,
        attachments: entry.images || [],
        tags: entry.tags || [],
        isImportant: entry.isImportant,
        weather: entry.weatherConditions,
        mood: entry.mood
      }));
      
      return { data: { entries } };
    } catch (error) {
      console.error('❌ Ошибка получения записей по полю:', error.response?.data || error.message);
      return { data: { entries: [] } };
    }
  },

  // Поиск записей
  searchEntries: async (query) => {
    try {
      const url = `${API_URL}/diary/search?q=${encodeURIComponent(query)}`;
      console.log('📡 Поиск записей:', url);
      
      const response = await axios.get(url, getAuthHeader());
      
      const entries = response.data.entries.map(entry => ({
        id: entry._id,
        date: entry.date,
        category: entry.activityType,
        title: entry.title,
        description: entry.content,
        fieldId: entry.fieldId?._id || entry.fieldId,
        fieldName: entry.fieldId?.name || null,
        cropType: entry.metrics?.cropType || null,
        hours: entry.metrics?.duration || 0,
        workers: entry.metrics?.workers || 0,
        cost: entry.metrics?.cost || 0,
        attachments: entry.images || [],
        tags: entry.tags || [],
        isImportant: entry.isImportant,
        weather: entry.weatherConditions,
        mood: entry.mood
      }));
      
      return { data: { entries } };
    } catch (error) {
      console.error('❌ Ошибка поиска записей:', error.response?.data || error.message);
      return { data: { entries: [] } };
    }
  },

  // Создать новую запись
  createEntry: async (entryData) => {
    try {
      console.log('📤 Создание записи:', entryData);
      
      // Подготавливаем данные для сервера
      const dataToSend = {
        title: entryData.title,
        content: entryData.description || entryData.content,
        date: entryData.date || new Date().toISOString(),
        fieldId: entryData.fieldId || null,
        activityType: entryData.category || 'other',
        weatherConditions: entryData.weather || {},
        tags: entryData.tags || [],
        metrics: {
          duration: entryData.hours || 0,
          workers: entryData.workers || 0,
          cost: entryData.cost || 0,
          area: entryData.area || 0,
          quantity: entryData.quantity || 0
        },
        isImportant: entryData.isImportant || false,
        mood: entryData.mood || 'normal'
      };

      console.log('📦 Отправка данных:', dataToSend);
      
      const response = await axios.post(`${API_URL}/diary`, dataToSend, getAuthHeader());
      console.log('✅ Запись создана:', response.data);
      
      const entry = response.data.entry;
      
      return {
        data: {
          success: true,
          entry: {
            id: entry._id,
            date: entry.date,
            category: entry.activityType,
            title: entry.title,
            description: entry.content,
            fieldId: entry.fieldId?._id || entry.fieldId,
            fieldName: entry.fieldId?.name || null,
            cropType: entry.metrics?.cropType || null,
            hours: entry.metrics?.duration || 0,
            workers: entry.metrics?.workers || 0,
            cost: entry.metrics?.cost || 0,
            attachments: entry.images || [],
            tags: entry.tags || [],
            isImportant: entry.isImportant,
            weather: entry.weatherConditions,
            mood: entry.mood
          }
        }
      };
    } catch (error) {
      console.error('❌ Ошибка создания записи:', error.response?.data || error.message);
      throw error;
    }
  },

  // Обновить запись
  updateEntry: async (id, entryData) => {
    try {
      console.log('📤 Обновление записи ID:', id, entryData);
      
      // Подготавливаем данные
      const dataToSend = {
        title: entryData.title,
        content: entryData.description || entryData.content,
        date: entryData.date,
        fieldId: entryData.fieldId,
        activityType: entryData.category,
        weatherConditions: entryData.weather,
        tags: entryData.tags,
        metrics: {
          duration: entryData.hours || 0,
          workers: entryData.workers || 0,
          cost: entryData.cost || 0
        },
        isImportant: entryData.isImportant,
        mood: entryData.mood
      };
      
      const response = await axios.put(`${API_URL}/diary/${id}`, dataToSend, getAuthHeader());
      console.log('✅ Запись обновлена:', response.data);
      
      const entry = response.data.entry;
      
      return {
        data: {
          success: true,
          entry: {
            id: entry._id,
            date: entry.date,
            category: entry.activityType,
            title: entry.title,
            description: entry.content,
            fieldId: entry.fieldId?._id || entry.fieldId,
            fieldName: entry.fieldId?.name || null,
            cropType: entry.metrics?.cropType || null,
            hours: entry.metrics?.duration || 0,
            workers: entry.metrics?.workers || 0,
            cost: entry.metrics?.cost || 0,
            attachments: entry.images || [],
            tags: entry.tags || [],
            isImportant: entry.isImportant,
            weather: entry.weatherConditions,
            mood: entry.mood
          }
        }
      };
    } catch (error) {
      console.error('❌ Ошибка обновления записи:', error.response?.data || error.message);
      throw error;
    }
  },

  // Удалить запись
  deleteEntry: async (id) => {
    try {
      console.log('📤 Удаление записи ID:', id);
      
      const response = await axios.delete(`${API_URL}/diary/${id}`, getAuthHeader());
      console.log('✅ Запись удалена:', response.data);
      
      return {
        data: { success: true }
      };
    } catch (error) {
      console.error('❌ Ошибка удаления записи:', error.response?.data || error.message);
      throw error;
    }
  },

  // Переключить важность записи
  toggleImportant: async (id) => {
    try {
      console.log('📤 Переключение важности записи ID:', id);
      
      const response = await axios.patch(`${API_URL}/diary/${id}/important`, {}, getAuthHeader());
      console.log('✅ Важность переключена:', response.data);
      
      return {
        data: { success: true, isImportant: response.data.isImportant }
      };
    } catch (error) {
      console.error('❌ Ошибка переключения важности:', error.response?.data || error.message);
      throw error;
    }
  },

  // Получить категории (типы активностей)
  getCategories: async () => {
    // Возвращаем статические категории, так как они фиксированы в модели
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            categories: [
              { id: 'sowing', name: 'Посев', color: 'bg-green-500', icon: '🌱' },
              { id: 'watering', name: 'Полив', color: 'bg-blue-500', icon: '💧' },
              { id: 'fertilizing', name: 'Удобрение', color: 'bg-yellow-500', icon: '🧪' },
              { id: 'treatment', name: 'Обработка', color: 'bg-purple-500', icon: '🔬' },
              { id: 'harvesting', name: 'Сбор урожая', color: 'bg-orange-500', icon: '🌾' },
              { id: 'maintenance', name: 'Обслуживание', color: 'bg-gray-500', icon: '🔧' },
              { id: 'inspection', name: 'Осмотр', color: 'bg-indigo-500', icon: '👁️' },
              { id: 'planning', name: 'Планирование', color: 'bg-cyan-500', icon: '📋' },
              { id: 'other', name: 'Другое', color: 'bg-gray-400', icon: '📝' }
            ]
          }
        });
      }, 200);
    });
  },

  // Добавить изображение к записи
  addImage: async (id, imageData) => {
    try {
      console.log('📤 Добавление изображения к записи ID:', id);
      
      const response = await axios.post(`${API_URL}/diary/${id}/images`, imageData, getAuthHeader());
      return { data: { success: true, image: response.data.image } };
    } catch (error) {
      console.error('❌ Ошибка добавления изображения:', error.response?.data || error.message);
      throw error;
    }
  },

  // Удалить изображение из записи
  deleteImage: async (id, imageId) => {
    try {
      console.log('📤 Удаление изображения из записи ID:', id);
      
      const response = await axios.delete(`${API_URL}/diary/${id}/images/${imageId}`, getAuthHeader());
      return { data: { success: true } };
    } catch (error) {
      console.error('❌ Ошибка удаления изображения:', error.response?.data || error.message);
      throw error;
    }
  }
};

export default diaryAPI;