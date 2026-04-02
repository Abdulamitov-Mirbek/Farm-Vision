// src/services/api/workPlanAPI.js
import api from './axiosConfig'; // Переименуйте импорт для ясности

// НЕ НУЖНО создавать API_URL заново - он уже есть в axiosConfig
// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// НЕ НУЖНО - заголовки уже добавляются в axiosConfig
// const getAuthHeader = () => {
//   const token = localStorage.getItem('auth_token');
//   return {
//     headers: {
//       'Authorization': `Bearer ${token}`,
//       'Content-Type': 'application/json'                                          
//     }
//   };
// };

const workPlanAPI = {
  // Получить все планы
  getAll: async (filters = {}) => {
    try {
      console.log('📤 GET /api/workplans с фильтрами:', filters);
      const response = await api.get('/api/workplans', { params: filters });
      console.log('✅ Work plans fetched:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Ошибка получения планов:', error.response?.data || error.message);
      throw error;
    }
  },

  // Создать план
  create: async (planData) => {
    try {
      console.log('📤 POST /api/workplans с данными:', planData);
      const response = await api.post('/api/workplans', planData);
      console.log('✅ Work plan created:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Ошибка создания плана:', error.response?.data || error.message);
      throw error;
    }
  },

  // Получить план по ID
  getOne: async (id) => {
    try {
      console.log(`📤 GET /api/workplans/${id}`);
      const response = await api.get(`/api/workplans/${id}`);
      console.log('✅ Work plan fetched:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Ошибка получения плана:', error.response?.data || error.message);
      throw error;
    }
  },

  // Обновить план
  update: async (id, planData) => {
    try {
      console.log(`📤 PUT /api/workplans/${id}:`, planData);
      const response = await api.put(`/api/workplans/${id}`, planData);
      console.log('✅ Work plan updated:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Ошибка обновления плана:', error.response?.data || error.message);
      throw error;
    }
  },

  // Обновить статус плана
  updateStatus: async (id, status) => {
    try {
      console.log(`📤 PATCH /api/workplans/${id}/status:`, { status });
      const response = await api.patch(`/api/workplans/${id}/status`, { status });
      console.log('✅ Work plan status updated:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Ошибка обновления статуса:', error.response?.data || error.message);
      throw error;
    }
  },

  // Удалить план
  delete: async (id) => {
    try {
      console.log(`📤 DELETE /api/workplans/${id}`);
      const response = await api.delete(`/api/workplans/${id}`);
      console.log('✅ Work plan deleted:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Ошибка удаления плана:', error.response?.data || error.message);
      throw error;
    }
  },

  // Добавить задачу в план
  addTask: async (planId, taskId) => {
    try {
      console.log(`📤 POST /api/workplans/${planId}/tasks:`, { taskId });
      const response = await api.post(`/api/workplans/${planId}/tasks`, { taskId });
      console.log('✅ Task added to plan:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Ошибка добавления задачи:', error.response?.data || error.message);
      throw error;
    }
  },

  // Обновить статус задачи в плане
  updateTaskStatus: async (planId, taskIndex, status) => {
    try {
      console.log(`📤 PATCH /api/workplans/${planId}/tasks/${taskIndex}:`, { status });
      const response = await api.patch(`/api/workplans/${planId}/tasks/${taskIndex}`, { status });
      console.log('✅ Task status updated:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Ошибка обновления статуса задачи:', error.response?.data || error.message);
      throw error;
    }
  },

  // Получить планы по дате
  getByDate: async (date) => {
    try {
      console.log(`📤 GET /api/workplans/date/${date}`);
      const response = await api.get(`/api/workplans/date/${date}`);
      return response.data;
    } catch (error) {
      console.error('❌ Ошибка получения планов по дате:', error.response?.data || error.message);
      throw error;
    }
  },

  // Получить планы по статусу
  getByStatus: async (status) => {
    try {
      console.log(`📤 GET /api/workplans/status/${status}`);
      const response = await api.get(`/api/workplans/status/${status}`);
      return response.data;
    } catch (error) {
      console.error('❌ Ошибка получения планов по статусу:', error.response?.data || error.message);
      throw error;
    }
  },

  // Получить статистику планов
  getStats: async () => {
    try {
      console.log('📤 GET /api/workplans/stats');
      const response = await api.get('/api/workplans/stats');
      return response.data;
    } catch (error) {
      console.error('❌ Ошибка получения статистики:', error.response?.data || error.message);
      throw error;
    }
  },

  // Клонировать план
  clone: async (id) => {
    try {
      console.log(`📤 POST /api/workplans/${id}/clone`);
      const response = await api.post(`/api/workplans/${id}/clone`);
      return response.data;
    } catch (error) {
      console.error('❌ Ошибка клонирования плана:', error.response?.data || error.message);
      throw error;
    }
  },

  // Экспортировать план
  exportPlan: async (id, format = 'pdf') => {
    try {
      console.log(`📤 GET /api/workplans/${id}/export?format=${format}`);
      const response = await api.get(`/api/workplans/${id}/export`, {
        params: { format },
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('❌ Ошибка экспорта плана:', error.response?.data || error.message);
      throw error;
    }
  },

  // Получить задачи плана
  getTasks: async (planId) => {
    try {
      console.log(`📤 GET /api/workplans/${planId}/tasks`);
      const response = await api.get(`/api/workplans/${planId}/tasks`);
      return response.data;
    } catch (error) {
      console.error('❌ Ошибка получения задач плана:', error.response?.data || error.message);
      throw error;
    }
  },

  // Удалить задачу из плана
  removeTask: async (planId, taskIndex) => {
    try {
      console.log(`📤 DELETE /api/workplans/${planId}/tasks/${taskIndex}`);
      const response = await api.delete(`/api/workplans/${planId}/tasks/${taskIndex}`);
      return response.data;
    } catch (error) {
      console.error('❌ Ошибка удаления задачи из плана:', error.response?.data || error.message);
      throw error;
    }
  }
};

export default workPlanAPI;