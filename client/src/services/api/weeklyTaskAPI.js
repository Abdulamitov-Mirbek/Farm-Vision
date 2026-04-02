// client/src/services/api/weeklyTaskAPI.js
import api from './axiosConfig';

const weeklyTaskAPI = {
  // Получить все задачи
  getAll: async (filters = {}) => {
    try {
      console.log('📤 GET /api/weekly-tasks с фильтрами:', filters);
      const response = await api.get('/api/weekly-tasks', { params: filters });
      console.log('✅ Weekly tasks fetched:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching weekly tasks:', error.response?.data || error.message);
      throw error;
    }
  },

  // Создать задачу
  create: async (taskData) => {
    try {
      console.log('📤 POST /api/weekly-tasks с данными:', taskData);
      const response = await api.post('/api/weekly-tasks', taskData);
      console.log('✅ Weekly task created:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error creating weekly task:', error.response?.data || error.message);
      throw error;
    }
  },

  // Обновить задачу
  update: async (id, taskData) => {
    try {
      console.log(`📤 PUT /api/weekly-tasks/${id}:`, taskData);
      const response = await api.put(`/api/weekly-tasks/${id}`, taskData);
      console.log('✅ Weekly task updated:', response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Error updating weekly task ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },

  // Отметить как выполненную
  complete: async (id) => {
    try {
      console.log(`📤 PATCH /api/weekly-tasks/${id}/complete`);
      const response = await api.patch(`/api/weekly-tasks/${id}/complete`);
      console.log('✅ Weekly task completed:', response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Error completing weekly task ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },

  // Удалить задачу
  delete: async (id) => {
    try {
      console.log(`📤 DELETE /api/weekly-tasks/${id}`);
      const response = await api.delete(`/api/weekly-tasks/${id}`);
      console.log('✅ Weekly task deleted:', response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Error deleting weekly task ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },

  // Получить статистику
  getStats: async () => {
    try {
      console.log('📤 GET /api/weekly-tasks/stats');
      const response = await api.get('/api/weekly-tasks/stats');
      console.log('✅ Weekly tasks stats:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching weekly tasks stats:', error.response?.data || error.message);
      throw error;
    }
  },

  // Получить задачи на сегодня
  getToday: async () => {
    try {
      console.log('📤 GET /api/weekly-tasks/today');
      const response = await api.get('/api/weekly-tasks/today');
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching today tasks:', error.response?.data || error.message);
      throw error;
    }
  },

  // Получить задачи на неделю
  getWeek: async (date) => {
    try {
      console.log(`📤 GET /api/weekly-tasks/week?date=${date}`);
      const response = await api.get('/api/weekly-tasks/week', {
        params: { date }
      });
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching week tasks:', error.response?.data || error.message);
      throw error;
    }
  },

  // Получить задачи по приоритету
  getByPriority: async (priority) => {
    try {
      console.log(`📤 GET /api/weekly-tasks/priority/${priority}`);
      const response = await api.get(`/api/weekly-tasks/priority/${priority}`);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching tasks by priority:', error.response?.data || error.message);
      throw error;
    }
  },

  // Получить задачи по статусу
  getByStatus: async (status) => {
    try {
      console.log(`📤 GET /api/weekly-tasks/status/${status}`);
      const response = await api.get(`/api/weekly-tasks/status/${status}`);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching tasks by status:', error.response?.data || error.message);
      throw error;
    }
  },

  // Назначить задачу сотруднику
  assignTo: async (id, userId) => {
    try {
      console.log(`📤 POST /api/weekly-tasks/${id}/assign`, { userId });
      const response = await api.post(`/api/weekly-tasks/${id}/assign`, { userId });
      return response.data;
    } catch (error) {
      console.error('❌ Error assigning task:', error.response?.data || error.message);
      throw error;
    }
  },

  // Обновить приоритет задачи
  updatePriority: async (id, priority) => {
    try {
      console.log(`📤 PATCH /api/weekly-tasks/${id}/priority`, { priority });
      const response = await api.patch(`/api/weekly-tasks/${id}/priority`, { priority });
      return response.data;
    } catch (error) {
      console.error('❌ Error updating task priority:', error.response?.data || error.message);
      throw error;
    }
  },

  // Получить просроченные задачи
  getOverdue: async () => {
    try {
      console.log('📤 GET /api/weekly-tasks/overdue');
      const response = await api.get('/api/weekly-tasks/overdue');
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching overdue tasks:', error.response?.data || error.message);
      throw error;
    }
  },

  // Копировать задачу
  copy: async (id) => {
    try {
      console.log(`📤 POST /api/weekly-tasks/${id}/copy`);
      const response = await api.post(`/api/weekly-tasks/${id}/copy`);
      return response.data;
    } catch (error) {
      console.error('❌ Error copying task:', error.response?.data || error.message);
      throw error;
    }
  },

  // Массовое обновление задач
  bulkUpdate: async (updates) => {
    try {
      console.log('📤 PATCH /api/weekly-tasks/bulk', updates);
      const response = await api.patch('/api/weekly-tasks/bulk', { updates });
      return response.data;
    } catch (error) {
      console.error('❌ Error bulk updating tasks:', error.response?.data || error.message);
      throw error;
    }
  }
};

export default weeklyTaskAPI;