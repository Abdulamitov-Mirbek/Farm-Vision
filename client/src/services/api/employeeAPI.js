// client/src/services/api/employeeAPI.js
import api from './axiosConfig';

const employeeAPI = {
  getAll: async (filters = {}) => {
    try {
      console.log('📤 GET /api/employees', filters);
      const response = await api.get('/api/employees', { params: filters });
      console.log('✅ Employees fetched:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching employees:', error.response?.data || error.message);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      console.log(`📤 GET /api/employees/${id}`);
      const response = await api.get(`/api/employees/${id}`);
      console.log('✅ Employee fetched:', response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Error fetching employee ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },

  create: async (data) => {
    try {
      console.log('📤 POST /api/employees', data);
      const response = await api.post('/api/employees', data);
      console.log('✅ Employee created:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error creating employee:', error.response?.data || error.message);
      throw error;
    }
  },

  update: async (id, data) => {
    try {
      console.log(`📤 PUT /api/employees/${id}`, data);
      const response = await api.put(`/api/employees/${id}`, data);
      console.log('✅ Employee updated:', response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Error updating employee ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },

  updateStatus: async (id, status) => {
    try {
      console.log(`📤 PATCH /api/employees/${id}/status`, { status });
      const response = await api.patch(`/api/employees/${id}/status`, { status });
      console.log('✅ Employee status updated:', response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Error updating employee status ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      console.log(`📤 DELETE /api/employees/${id}`);
      const response = await api.delete(`/api/employees/${id}`);
      console.log('✅ Employee deleted:', response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Error deleting employee ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },

  // Поиск сотрудников
  search: async (query) => {
    try {
      console.log(`📤 GET /api/employees/search?q=${query}`);
      const response = await api.get('/api/employees/search', {
        params: { q: query }
      });
      return response.data;
    } catch (error) {
      console.error('❌ Error searching employees:', error.response?.data || error.message);
      throw error;
    }
  },

  // Получить сотрудников по должности
  getByPosition: async (position) => {
    try {
      console.log(`📤 GET /api/employees/position/${position}`);
      const response = await api.get(`/api/employees/position/${position}`);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching employees by position:', error.response?.data || error.message);
      throw error;
    }
  },

  // Получить активных сотрудников
  getActive: async () => {
    try {
      console.log('📤 GET /api/employees/active');
      const response = await api.get('/api/employees/active');
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching active employees:', error.response?.data || error.message);
      throw error;
    }
  },

  // Получить статистику по сотрудникам
  getStats: async () => {
    try {
      console.log('📤 GET /api/employees/stats');
      const response = await api.get('/api/employees/stats');
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching employees stats:', error.response?.data || error.message);
      throw error;
    }
  }
};

export default employeeAPI;