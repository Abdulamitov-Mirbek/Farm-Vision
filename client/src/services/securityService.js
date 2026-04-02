// client/src/services/securityService.js
import api from './api';

const securityService = {
  // Смена пароля
  changePassword: async (currentPassword, newPassword) => {
    const response = await api.post('/auth/change-password', {
      currentPassword,
      newPassword
    });
    return response.data;
  },

  // Статус 2FA
  get2FAStatus: async () => {
    const response = await api.get('/auth/2fa/status');
    return response.data;
  },

  // Генерация 2FA
  generate2FA: async () => {
    const response = await api.post('/auth/2fa/generate');
    return response.data;
  },

  // Включение 2FA
  enable2FA: async (token) => {
    const response = await api.post('/auth/2fa/enable', { token });
    return response.data;
  },

  // Отключение 2FA
  disable2FA: async () => {
    const response = await api.post('/auth/2fa/disable');
    return response.data;
  },

  // SMS 2FA
  sendSmsCode: async (phone) => {
    const response = await api.post('/auth/2fa/sms/send', { phone });
    return response.data;
  },

  verifySmsCode: async (code) => {
    const response = await api.post('/auth/2fa/sms/verify', { code });
    return response.data;
  },

  // Сессии
  getSessions: async () => {
    const response = await api.get('/auth/sessions');
    return response.data;
  },

  terminateSession: async (sessionId) => {
    const response = await api.delete(`/auth/sessions/${sessionId}`);
    return response.data;
  },

  terminateAllSessions: async () => {
    const response = await api.delete('/auth/sessions');
    return response.data;
  },

  // История входов
  getLoginHistory: async () => {
    const response = await api.get('/auth/login-history');
    return response.data;
  },

  // Настройки приватности
  getPrivacySettings: async () => {
    const response = await api.get('/auth/privacy');
    return response.data;
  },

  updatePrivacySettings: async (settings) => {
    const response = await api.put('/auth/privacy', settings);
    return response.data;
  },

  // Скор безопасности
  getSecurityScore: async () => {
    const response = await api.get('/auth/security-score');
    return response.data;
  },

  // Экспорт данных
  exportData: async () => {
    const response = await api.get('/auth/export', {
      responseType: 'blob'
    });
    return response.data;
  },

  // Удаление аккаунта
  deleteAccount: async (confirmation, password) => {
    const response = await api.delete('/auth/user', {
      data: { confirmation, password }
    });
    return response.data;
  }
};

export default securityService;