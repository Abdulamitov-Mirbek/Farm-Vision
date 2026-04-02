// client/src/services/api/supplierAPI.js
import api from './axiosConfig';

const supplierAPI = {
  getAll: async (filters = {}) => {
    try {
      console.log('📤 GET /api/suppliers', filters);
      const response = await api.get('/api/suppliers', { params: filters });
      console.log('✅ Suppliers fetched:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching suppliers:', error.response?.data || error.message);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      console.log(`📤 GET /api/suppliers/${id}`);
      const response = await api.get(`/api/suppliers/${id}`);
      console.log('✅ Supplier fetched:', response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Error fetching supplier ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },

  create: async (data) => {
    try {
      console.log('📤 POST /api/suppliers', data);
      const response = await api.post('/api/suppliers', data);
      console.log('✅ Supplier created:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error creating supplier:', error.response?.data || error.message);
      throw error;
    }
  },

  update: async (id, data) => {
    try {
      console.log(`📤 PUT /api/suppliers/${id}`, data);
      const response = await api.put(`/api/suppliers/${id}`, data);
      console.log('✅ Supplier updated:', response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Error updating supplier ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },

  updateStatus: async (id, status) => {
    try {
      console.log(`📤 PATCH /api/suppliers/${id}/status`, { status });
      const response = await api.patch(`/api/suppliers/${id}/status`, { status });
      console.log('✅ Supplier status updated:', response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Error updating supplier status ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      console.log(`📤 DELETE /api/suppliers/${id}`);
      const response = await api.delete(`/api/suppliers/${id}`);
      console.log('✅ Supplier deleted:', response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Error deleting supplier ${id}:`, error.response?.data || error.message);
      throw error;
    }
  }
};

export default supplierAPI;