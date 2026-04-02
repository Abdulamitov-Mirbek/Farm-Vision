// client/src/services/api/tasksAPI.js
import api from './axiosConfig';

const tasksAPI = {
  // Получить все задачи
  getAll: async (filters = {}) => {
    try {
      console.log('📡 GET /api/tasks с фильтрами:', filters);
      const response = await api.get('/api/tasks', { params: filters });
      console.log('✅ Tasks fetched:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching tasks:', error.response?.data || error.message);
      throw error;
    }
  },

  // Получить статистику
  getStats: async () => {
    try {
      console.log('📡 GET /api/tasks/stats');
      const response = await api.get('/api/tasks/stats');
      console.log('✅ Tasks stats:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching tasks stats:', error.response?.data || error.message);
      throw error;
    }
  },

  // Создать задачу
  create: async (taskData) => {
    try {
      console.log('📤 POST /api/tasks с данными:', taskData);
      const response = await api.post('/api/tasks', taskData);
      console.log('✅ Task created:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error creating task:', error.response?.data || error.message);
      throw error;
    }
  },

  // Получить задачу по ID
  getById: async (id) => {
    try {
      console.log(`📡 GET /api/tasks/${id}`);
      const response = await api.get(`/api/tasks/${id}`);
      console.log('✅ Task fetched:', response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Error fetching task ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },

  // Обновить задачу
  update: async (id, taskData) => {
    try {
      console.log(`📤 PUT /api/tasks/${id}:`, taskData);
      const response = await api.put(`/api/tasks/${id}`, taskData);
      console.log('✅ Task updated:', response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Error updating task ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },

  // Удалить задачу
  delete: async (id) => {
    try {
      console.log(`📤 DELETE /api/tasks/${id}`);
      const response = await api.delete(`/api/tasks/${id}`);
      console.log('✅ Task deleted:', response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Error deleting task ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },

  // Обновить статус задачи
  updateStatus: async (id, status) => {
    try {
      console.log(`📤 PATCH /api/tasks/${id}/status:`, status);
      const response = await api.patch(`/api/tasks/${id}/status`, { status });
      console.log('✅ Task status updated:', response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Error updating status for ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },

  // Получить задачи по статусу
  getByStatus: async (status) => {
    try {
      console.log(`📡 GET /api/tasks/status/${status}`);
      const response = await api.get(`/api/tasks/status/${status}`);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching tasks by status:', error.response?.data || error.message);
      throw error;
    }
  },

  // Получить задачи по приоритету
  getByPriority: async (priority) => {
    try {
      console.log(`📡 GET /api/tasks/priority/${priority}`);
      const response = await api.get(`/api/tasks/priority/${priority}`);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching tasks by priority:', error.response?.data || error.message);
      throw error;
    }
  },

  // Получить задачи по назначенному сотруднику
  getByAssignee: async (userId) => {
    try {
      console.log(`📡 GET /api/tasks/assignee/${userId}`);
      const response = await api.get(`/api/tasks/assignee/${userId}`);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching tasks by assignee:', error.response?.data || error.message);
      throw error;
    }
  },

  // Получить задачи по дате
  getByDate: async (date) => {
    try {
      console.log(`📡 GET /api/tasks/date/${date}`);
      const response = await api.get(`/api/tasks/date/${date}`);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching tasks by date:', error.response?.data || error.message);
      throw error;
    }
  },

  // Получить просроченные задачи
  getOverdue: async () => {
    try {
      console.log('📡 GET /api/tasks/overdue');
      const response = await api.get('/api/tasks/overdue');
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching overdue tasks:', error.response?.data || error.message);
      throw error;
    }
  },

  // Получить задачи на сегодня
  getToday: async () => {
    try {
      console.log('📡 GET /api/tasks/today');
      const response = await api.get('/api/tasks/today');
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching today tasks:', error.response?.data || error.message);
      throw error;
    }
  },

  // Получить задачи на неделю
  getWeek: async (date) => {
    try {
      console.log(`📡 GET /api/tasks/week?date=${date}`);
      const response = await api.get('/api/tasks/week', {
        params: { date }
      });
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching week tasks:', error.response?.data || error.message);
      throw error;
    }
  },

  // Назначить задачу
  assignTask: async (id, userId) => {
    try {
      console.log(`📤 POST /api/tasks/${id}/assign`, { userId });
      const response = await api.post(`/api/tasks/${id}/assign`, { userId });
      return response.data;
    } catch (error) {
      console.error('❌ Error assigning task:', error.response?.data || error.message);
      throw error;
    }
  },

  // Добавить комментарий к задаче
  addComment: async (id, comment) => {
    try {
      console.log(`📤 POST /api/tasks/${id}/comments`, { comment });
      const response = await api.post(`/api/tasks/${id}/comments`, { comment });
      return response.data;
    } catch (error) {
      console.error('❌ Error adding comment:', error.response?.data || error.message);
      throw error;
    }
  },

  // Получить комментарии к задаче
  getComments: async (id) => {
    try {
      console.log(`📡 GET /api/tasks/${id}/comments`);
      const response = await api.get(`/api/tasks/${id}/comments`);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching comments:', error.response?.data || error.message);
      throw error;
    }
  },

  // Добавить вложение к задаче
  addAttachment: async (id, file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      console.log(`📤 POST /api/tasks/${id}/attachments`);
      const response = await api.post(`/api/tasks/${id}/attachments`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('❌ Error adding attachment:', error.response?.data || error.message);
      throw error;
    }
  },

  // Получить вложения задачи
  getAttachments: async (id) => {
    try {
      console.log(`📡 GET /api/tasks/${id}/attachments`);
      const response = await api.get(`/api/tasks/${id}/attachments`);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching attachments:', error.response?.data || error.message);
      throw error;
    }
  },

  // Копировать задачу
  copyTask: async (id) => {
    try {
      console.log(`📤 POST /api/tasks/${id}/copy`);
      const response = await api.post(`/api/tasks/${id}/copy`);
      return response.data;
    } catch (error) {
      console.error('❌ Error copying task:', error.response?.data || error.message);
      throw error;
    }
  },

  // Массовое обновление задач
  bulkUpdate: async (updates) => {
    try {
      console.log('📤 PATCH /api/tasks/bulk', updates);
      const response = await api.patch('/api/tasks/bulk', { updates });
      return response.data;
    } catch (error) {
      console.error('❌ Error bulk updating tasks:', error.response?.data || error.message);
      throw error;
    }
  },

  // Экспорт задач
  exportTasks: async (format = 'csv') => {
    try {
      console.log(`📡 GET /api/tasks/export?format=${format}`);
      const response = await api.get('/api/tasks/export', {
        params: { format },
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('❌ Error exporting tasks:', error.response?.data || error.message);
      throw error;
    }
  },

  // Импорт задач
  importTasks: async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      console.log('📤 POST /api/tasks/import');
      const response = await api.post('/api/tasks/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('❌ Error importing tasks:', error.response?.data || error.message);
      throw error;
    }
  }
};

export default tasksAPI;