// client/src/services/api/resourcesAPI.js
import api from './axiosConfig';

const resourcesAPI = {
  // Получить все ресурсы
  getAll: async (filters = {}) => {
    try {
      console.log('📡 GET /api/resources с фильтрами:', filters);
      const response = await api.get('/api/resources', { params: filters });
      console.log('✅ Resources fetched:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching resources:', error.response?.data || error.message);
      throw error;
    }
  },

  // Получить статистику
  getStats: async () => {
    try {
      console.log('📡 GET /api/resources/stats');
      const response = await api.get('/api/resources/stats');
      console.log('✅ Resources stats:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching resources stats:', error.response?.data || error.message);
      throw error;
    }
  },

  // Создать ресурс
  create: async (resourceData) => {
    try {
      console.log('📤 POST /api/resources с данными:', resourceData);
      const response = await api.post('/api/resources', resourceData);
      console.log('✅ Resource created:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error creating resource:', error.response?.data || error.message);
      throw error;
    }
  },

  // Получить ресурс по ID
  getById: async (id) => {
    try {
      console.log(`📡 GET /api/resources/${id}`);
      const response = await api.get(`/api/resources/${id}`);
      console.log('✅ Resource fetched:', response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Error fetching resource ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },

  // Обновить ресурс
  update: async (id, resourceData) => {
    try {
      console.log(`📤 PUT /api/resources/${id}:`, resourceData);
      const response = await api.put(`/api/resources/${id}`, resourceData);
      console.log('✅ Resource updated:', response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Error updating resource ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },

  // Удалить ресурс
  delete: async (id) => {
    try {
      console.log(`📤 DELETE /api/resources/${id}`);
      const response = await api.delete(`/api/resources/${id}`);
      console.log('✅ Resource deleted:', response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Error deleting resource ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },

  // Обновить количество
  updateQuantity: async (id, quantity) => {
    try {
      console.log(`📤 PATCH /api/resources/${id}/quantity:`, quantity);
      const response = await api.patch(`/api/resources/${id}/quantity`, { quantity });
      console.log('✅ Resource quantity updated:', response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Error updating quantity for ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },

  // Получить ресурсы по категории
  getByCategory: async (category) => {
    try {
      console.log(`📡 GET /api/resources/category/${category}`);
      const response = await api.get(`/api/resources/category/${category}`);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching resources by category:', error.response?.data || error.message);
      throw error;
    }
  },

  // Получить ресурсы с низким запасом
  getLowStock: async (threshold = 10) => {
    try {
      console.log(`📡 GET /api/resources/low-stock?threshold=${threshold}`);
      const response = await api.get('/api/resources/low-stock', {
        params: { threshold }
      });
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching low stock resources:', error.response?.data || error.message);
      throw error;
    }
  },

  // Получить ресурсы по статусу
  getByStatus: async (status) => {
    try {
      console.log(`📡 GET /api/resources/status/${status}`);
      const response = await api.get(`/api/resources/status/${status}`);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching resources by status:', error.response?.data || error.message);
      throw error;
    }
  },

  // Получить историю использования ресурса
  getUsageHistory: async (id) => {
    try {
      console.log(`📡 GET /api/resources/${id}/usage`);
      const response = await api.get(`/api/resources/${id}/usage`);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching usage history:', error.response?.data || error.message);
      throw error;
    }
  },

  // Добавить использование ресурса
  addUsage: async (id, usageData) => {
    try {
      console.log(`📤 POST /api/resources/${id}/usage`, usageData);
      const response = await api.post(`/api/resources/${id}/usage`, usageData);
      return response.data;
    } catch (error) {
      console.error('❌ Error adding resource usage:', error.response?.data || error.message);
      throw error;
    }
  },

  // Получить прогноз потребления
  getForecast: async (id) => {
    try {
      console.log(`📡 GET /api/resources/${id}/forecast`);
      const response = await api.get(`/api/resources/${id}/forecast`);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching resource forecast:', error.response?.data || error.message);
      throw error;
    }
  },

  // Заказать ресурс
  order: async (id, quantity) => {
    try {
      console.log(`📤 POST /api/resources/${id}/order`, { quantity });
      const response = await api.post(`/api/resources/${id}/order`, { quantity });
      return response.data;
    } catch (error) {
      console.error('❌ Error ordering resource:', error.response?.data || error.message);
      throw error;
    }
  },

  // Получить поставщиков ресурса
  getSuppliers: async (id) => {
    try {
      console.log(`📡 GET /api/resources/${id}/suppliers`);
      const response = await api.get(`/api/resources/${id}/suppliers`);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching resource suppliers:', error.response?.data || error.message);
      throw error;
    }
  },

  // Массовое обновление ресурсов
  bulkUpdate: async (updates) => {
    try {
      console.log('📤 PATCH /api/resources/bulk', updates);
      const response = await api.patch('/api/resources/bulk', { updates });
      return response.data;
    } catch (error) {
      console.error('❌ Error bulk updating resources:', error.response?.data || error.message);
      throw error;
    }
  },

  // Экспорт ресурсов
  exportResources: async (format = 'csv') => {
    try {
      console.log(`📡 GET /api/resources/export?format=${format}`);
      const response = await api.get('/api/resources/export', {
        params: { format },
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('❌ Error exporting resources:', error.response?.data || error.message);
      throw error;
    }
  },

  // Импорт ресурсов
  importResources: async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      console.log('📤 POST /api/resources/import');
      const response = await api.post('/api/resources/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('❌ Error importing resources:', error.response?.data || error.message);
      throw error;
    }
  }
};

export default resourcesAPI;