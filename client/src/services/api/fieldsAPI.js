// client/src/services/api/fieldsAPI.js
import api from './axiosConfig';

const fieldsAPI = {
  // Получить все поля
  getAll: async (filters = {}) => {
    try {
      console.log('📡 GET /fields с фильтрами:', filters);
      const response = await api.get('/fields', { params: filters });
      console.log('✅ Fields fetched:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching fields:', error.response?.data || error.message);
      throw error;
    }
  },

  // Получить статистику
  getStats: async () => {
    try {
      console.log('📡 GET /fields/stats');
      const response = await api.get('/fields/stats');
      console.log('✅ Fields stats:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching fields stats:', error.response?.data || error.message);
      throw error;
    }
  },

  // Создать поле
  create: async (fieldData) => {
    try {
      console.log('📤 POST /fields с данными:', fieldData);
      const response = await api.post('/fields', fieldData);
      console.log('✅ Поле создано:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error creating field:', error.response?.data || error.message);
      throw error;
    }
  },

  // Получить поле по ID
  getById: async (id) => {
    try {
      console.log(`📡 GET /fields/${id}`);
      const response = await api.get(`/fields/${id}`);
      console.log('✅ Field fetched:', response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Error fetching field ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },

  // Обновить поле
  update: async (id, fieldData) => {
    try {
      console.log(`📤 PUT /fields/${id}:`, fieldData);
      const response = await api.put(`/fields/${id}`, fieldData);
      console.log('✅ Field updated:', response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Error updating field ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },

  // Удалить поле
  delete: async (id) => {
    try {
      console.log(`📤 DELETE /fields/${id}`);
      const response = await api.delete(`/fields/${id}`);
      console.log('✅ Field deleted:', response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Error deleting field ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },

  // Обновить статус поля
  updateStatus: async (id, status) => {
    try {
      console.log(`📤 PATCH /fields/${id}/status:`, status);
      const response = await api.patch(`/fields/${id}/status`, { status });
      console.log('✅ Field status updated:', response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Error updating status for ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },

  // Получить поля по культуре
  getByCrop: async (cropType) => {
    try {
      console.log(`📡 GET /fields/crop/${cropType}`);
      const response = await api.get(`/fields/crop/${cropType}`);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching fields by crop:', error.response?.data || error.message);
      throw error;
    }
  },

  // Получить активные поля
  getActive: async () => {
    try {
      console.log('📡 GET /fields/active');
      const response = await api.get('/fields/active');
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching active fields:', error.response?.data || error.message);
      throw error;
    }
  },

  // Получить поля требующие полива
  getNeedsWatering: async () => {
    try {
      console.log('📡 GET /fields/needs-watering');
      const response = await api.get('/fields/needs-watering');
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching fields needing watering:', error.response?.data || error.message);
      throw error;
    }
  },

  // Получить урожайность по полям
  getYield: async (fieldId) => {
    try {
      console.log(`📡 GET /fields/${fieldId}/yield`);
      const response = await api.get(`/fields/${fieldId}/yield`);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching field yield:', error.response?.data || error.message);
      throw error;
    }
  },

  // Получить историю работ на поле
  getWorkHistory: async (fieldId) => {
    try {
      console.log(`📡 GET /fields/${fieldId}/work-history`);
      const response = await api.get(`/fields/${fieldId}/work-history`);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching work history:', error.response?.data || error.message);
      throw error;
    }
  },

  // Получить прогноз урожая
  getForecast: async (fieldId) => {
    try {
      console.log(`📡 GET /fields/${fieldId}/forecast`);
      const response = await api.get(`/fields/${fieldId}/forecast`);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching forecast:', error.response?.data || error.message);
      throw error;
    }
  },

  // Массовое обновление полей
  bulkUpdate: async (updates) => {
    try {
      console.log('📤 PATCH /fields/bulk', updates);
      const response = await api.patch('/fields/bulk', { updates });
      return response.data;
    } catch (error) {
      console.error('❌ Error bulk updating fields:', error.response?.data || error.message);
      throw error;
    }
  },

  // Экспорт полей
  exportFields: async (format = 'csv') => {
    try {
      console.log(`📡 GET /fields/export?format=${format}`);
      const response = await api.get('/fields/export', {
        params: { format },
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('❌ Error exporting fields:', error.response?.data || error.message);
      throw error;
    }
  }
};

export default fieldsAPI;