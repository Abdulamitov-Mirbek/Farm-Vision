// client/src/services/api/equipmentAPI.js
import api from './axiosConfig';

const equipmentAPI = {
  // Получить всю технику
  getAll: async (filters = {}) => {
    try {
      console.log('📤 GET /api/equipment', filters);
      const response = await api.get('/api/equipment', { params: filters });
      console.log('✅ Equipment fetched:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching equipment:', error.response?.data || error.message);
      throw error;
    }
  },

  // Получить технику по ID
  getById: async (id) => {
    try {
      console.log(`📤 GET /api/equipment/${id}`);
      const response = await api.get(`/api/equipment/${id}`);
      console.log('✅ Equipment fetched:', response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Error fetching equipment ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },

  // Создать новую технику
  create: async (data) => {
    try {
      console.log('📤 POST /api/equipment', data);
      const response = await api.post('/api/equipment', data);
      console.log('✅ Equipment created:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error creating equipment:', error.response?.data || error.message);
      throw error;
    }
  },

  // Обновить технику
  update: async (id, data) => {
    try {
      console.log(`📤 PUT /api/equipment/${id}`, data);
      const response = await api.put(`/api/equipment/${id}`, data);
      console.log('✅ Equipment updated:', response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Error updating equipment ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },

  // Обновить статус техники
  updateStatus: async (id, status) => {
    try {
      console.log(`📤 PATCH /api/equipment/${id}/status`, { status });
      const response = await api.patch(`/api/equipment/${id}/status`, { status });
      console.log('✅ Equipment status updated:', response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Error updating equipment status ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },

  // Удалить технику
  delete: async (id) => {
    try {
      console.log(`📤 DELETE /api/equipment/${id}`);
      const response = await api.delete(`/api/equipment/${id}`);
      console.log('✅ Equipment deleted:', response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Error deleting equipment ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },

  // Получить технику по типу
  getByType: async (type) => {
    try {
      console.log(`📤 GET /api/equipment/type/${type}`);
      const response = await api.get(`/api/equipment/type/${type}`);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching equipment by type:', error.response?.data || error.message);
      throw error;
    }
  },

  // Получить доступную технику
  getAvailable: async () => {
    try {
      console.log('📤 GET /api/equipment/available');
      const response = await api.get('/api/equipment/available');
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching available equipment:', error.response?.data || error.message);
      throw error;
    }
  },

  // Получить технику в ремонте
  getInMaintenance: async () => {
    try {
      console.log('📤 GET /api/equipment/maintenance');
      const response = await api.get('/api/equipment/maintenance');
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching equipment in maintenance:', error.response?.data || error.message);
      throw error;
    }
  },

  // Получить статистику по технике
  getStats: async () => {
    try {
      console.log('📤 GET /api/equipment/stats');
      const response = await api.get('/api/equipment/stats');
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching equipment stats:', error.response?.data || error.message);
      throw error;
    }
  },

  // Назначить технику на задачу
  assignToTask: async (equipmentId, taskId) => {
    try {
      console.log(`📤 POST /api/equipment/${equipmentId}/assign/${taskId}`);
      const response = await api.post(`/api/equipment/${equipmentId}/assign/${taskId}`);
      return response.data;
    } catch (error) {
      console.error('❌ Error assigning equipment to task:', error.response?.data || error.message);
      throw error;
    }
  },

  // Освободить технику от задачи
  releaseFromTask: async (equipmentId, taskId) => {
    try {
      console.log(`📤 POST /api/equipment/${equipmentId}/release/${taskId}`);
      const response = await api.post(`/api/equipment/${equipmentId}/release/${taskId}`);
      return response.data;
    } catch (error) {
      console.error('❌ Error releasing equipment from task:', error.response?.data || error.message);
      throw error;
    }
  },

  // Получить историю обслуживания
  getMaintenanceHistory: async (equipmentId) => {
    try {
      console.log(`📤 GET /api/equipment/${equipmentId}/maintenance`);
      const response = await api.get(`/api/equipment/${equipmentId}/maintenance`);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching maintenance history:', error.response?.data || error.message);
      throw error;
    }
  },

  // Добавить запись об обслуживании
  addMaintenanceRecord: async (equipmentId, record) => {
    try {
      console.log(`📤 POST /api/equipment/${equipmentId}/maintenance`, record);
      const response = await api.post(`/api/equipment/${equipmentId}/maintenance`, record);
      return response.data;
    } catch (error) {
      console.error('❌ Error adding maintenance record:', error.response?.data || error.message);
      throw error;
    }
  }
};

export default equipmentAPI;