// client/src/services/api/axiosConfig.js
import axios from 'axios';

// ✅ ВАЖНО: добавляем /api к базовому URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

console.log('🔧 API Base URL:', API_URL); // Должно быть http://localhost:5000/api

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Логирование всех запросов
axiosInstance.interceptors.request.use(
  (config) => {
    console.log(`📤 ${config.method.toUpperCase()} ${config.baseURL}${config.url}`, config.data || '');
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Логирование всех ответов
axiosInstance.interceptors.response.use(
  (response) => {
    console.log(`📥 ${response.status} ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    console.error('❌ Response error:', error.response?.status, error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default axiosInstance;