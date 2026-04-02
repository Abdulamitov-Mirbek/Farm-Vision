// client/src/services/api/animalsAPI.js
import api from './axiosConfig';

const animalsAPI = {
  // Получить всех животных
  getAll: async (filters = {}) => {
    try {
      console.log('📡 GET /api/animals с фильтрами:', filters);
      const response = await api.get('/api/animals', { params: filters });
      
      // Возвращаем данные в правильном формате
      if (response.data && response.data.data) {
        return response.data.data;
      } else if (Array.isArray(response.data)) {
        return response.data;
      } else if (response.data && response.data.animals) {
        return response.data.animals;
      }
      return response.data || [];
    } catch (error) {
      console.error('❌ Error fetching animals:', error.response?.data || error.message);
      
      // В режиме разработки возвращаем тестовые данные
      if (process.env.NODE_ENV === 'development') {
        console.log('⚠️ Using mock animals data');
        return [
          { 
            _id: '1', 
            name: 'Корова Зорька', 
            type: 'cow', 
            breed: 'Голштинская',
            age: 3, 
            weight: 650,
            health: 'good',
            status: 'active',
            tag: 'COW-001',
            lastCheckup: '2024-02-15'
          },
          { 
            _id: '2', 
            name: 'Корова Милка', 
            type: 'cow', 
            breed: 'Голштинская',
            age: 5, 
            weight: 680,
            health: 'excellent', 
            status: 'active',
            tag: 'COW-002',
            lastCheckup: '2024-02-10'
          }
        ];
      }
      
      throw error;
    }
  },

  // Получить статистику
  getStats: async () => {
    try {
      console.log('📡 GET /api/animals/stats');
      const response = await api.get('/api/animals/stats');
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching animals stats:', error.response?.data || error.message);
      throw error;
    }
  },

  // Создать животное
  create: async (animalData) => {
    try {
      // Добавляем уникальный тег, если его нет
      const dataWithTag = {
        ...animalData,
        tag: animalData.tag || `${animalData.type || 'ANIMAL'}-${Date.now()}`
      };
      
      console.log('📤 POST /api/animals с данными:', dataWithTag);
      const response = await api.post('/api/animals', dataWithTag);
      return response.data;
    } catch (error) {
      console.error('❌ Error creating animal:', error.response?.data || error.message);
      throw error;
    }
  },

  // Получить животное по ID
  getById: async (id) => {
    try {
      console.log(`📡 GET /api/animals/${id}`);
      const response = await api.get(`/api/animals/${id}`);
      return response.data;
    } catch (error) {
      console.error(`❌ Error fetching animal ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },

  // Обновить животное
  update: async (id, animalData) => {
    try {
      console.log(`📤 PUT /api/animals/${id}:`, animalData);
      const response = await api.put(`/api/animals/${id}`, animalData);
      return response.data;
    } catch (error) {
      console.error(`❌ Error updating animal ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },

  // Удалить животное
  delete: async (id) => {
    try {
      console.log(`📤 DELETE /api/animals/${id}`);
      const response = await api.delete(`/api/animals/${id}`);
      return response.data;
    } catch (error) {
      console.error(`❌ Error deleting animal ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },

  // Обновить здоровье
  updateHealth: async (id, healthData) => {
    try {
      console.log(`📤 PATCH /api/animals/${id}/health:`, healthData);
      const response = await api.patch(`/api/animals/${id}/health`, healthData);
      return response.data;
    } catch (error) {
      console.error(`❌ Error updating health for ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },

  // Добавить вакцинацию
  addVaccination: async (id, vaccinationData) => {
    try {
      console.log(`📤 POST /api/animals/${id}/vaccinations:`, vaccinationData);
      const response = await api.post(`/api/animals/${id}/vaccinations`, vaccinationData);
      return response.data;
    } catch (error) {
      console.error(`❌ Error adding vaccination for ${id}:`, error.response?.data || error.message);
      throw error;
    }
  }
};

export default animalsAPI;