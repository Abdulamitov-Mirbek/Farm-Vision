// client/src/services/api/notificationAPI.js
import api from './axiosConfig';

const notificationAPI = {
  // Получить все уведомления
  getAll: async (filters = {}) => {
    try {
      console.log('📤 GET /api/notifications', filters);
      const response = await api.get('/api/notifications', { params: filters });
      console.log('✅ Notifications fetched:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching notifications:', error.response?.data || error.message);
      throw error;
    }
  },

  // Получить уведомление по ID
  getById: async (id) => {
    try {
      console.log(`📤 GET /api/notifications/${id}`);
      const response = await api.get(`/api/notifications/${id}`);
      console.log('✅ Notification fetched:', response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Error fetching notification ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },

  // Создать уведомление
  create: async (data) => {
    try {
      console.log('📤 POST /api/notifications', data);
      const response = await api.post('/api/notifications', data);
      console.log('✅ Notification created:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error creating notification:', error.response?.data || error.message);
      throw error;
    }
  },

  // Отметить как прочитанное
  markAsRead: async (id) => {
    try {
      console.log(`📤 PATCH /api/notifications/${id}/read`);
      const response = await api.patch(`/api/notifications/${id}/read`);
      console.log('✅ Notification marked as read:', response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Error marking notification ${id} as read:`, error.response?.data || error.message);
      throw error;
    }
  },

  // Отметить все как прочитанные
  markAllAsRead: async () => {
    try {
      console.log('📤 PATCH /api/notifications/read-all');
      const response = await api.patch('/api/notifications/read-all');
      console.log('✅ All notifications marked as read:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error marking all as read:', error.response?.data || error.message);
      throw error;
    }
  },

  // Удалить уведомление
  delete: async (id) => {
    try {
      console.log(`📤 DELETE /api/notifications/${id}`);
      const response = await api.delete(`/api/notifications/${id}`);
      console.log('✅ Notification deleted:', response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Error deleting notification ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },

  // Удалить все прочитанные
  clearRead: async () => {
    try {
      console.log('📤 DELETE /api/notifications/clear/read');
      const response = await api.delete('/api/notifications/clear/read');
      console.log('✅ Read notifications cleared:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error clearing read notifications:', error.response?.data || error.message);
      throw error;
    }
  },

  // Получить статистику
  getStats: async () => {
    try {
      console.log('📤 GET /api/notifications/stats');
      const response = await api.get('/api/notifications/stats');
      console.log('✅ Notification stats:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching notification stats:', error.response?.data || error.message);
      throw error;
    }
  },

  // Получить непрочитанные уведомления
  getUnread: async () => {
    try {
      console.log('📤 GET /api/notifications/unread');
      const response = await api.get('/api/notifications/unread');
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching unread notifications:', error.response?.data || error.message);
      throw error;
    }
  },

  // Получить уведомления по типу
  getByType: async (type) => {
    try {
      console.log(`📤 GET /api/notifications/type/${type}`);
      const response = await api.get(`/api/notifications/type/${type}`);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching notifications by type:', error.response?.data || error.message);
      throw error;
    }
  },

  // Получить последние уведомления
  getRecent: async (limit = 10) => {
    try {
      console.log(`📤 GET /api/notifications/recent?limit=${limit}`);
      const response = await api.get('/api/notifications/recent', {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching recent notifications:', error.response?.data || error.message);
      throw error;
    }
  }
};

export default notificationAPI;