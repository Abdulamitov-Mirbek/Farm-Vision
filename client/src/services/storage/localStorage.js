export const storage = {
  set: (key, value) => {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(key, serialized);
      return true;
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      return false;
    }
  },

  get: (key) => {
    try {
      const serialized = localStorage.getItem(key);
      if (serialized === null) return null;
      return JSON.parse(serialized);
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing from localStorage:', error);
      return false;
    }
  },

  clear: () => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  },

  // Специализированные методы для приложения
  setUser: (user) => storage.set('agri_user', user),
  getUser: () => storage.get('agri_user'),
  clearUser: () => storage.remove('agri_user'),
  
  setToken: (token) => storage.set('auth_token', token),
  getToken: () => storage.get('auth_token'),
  clearToken: () => storage.remove('auth_token'),
  
  setFields: (fields) => storage.set('agri_fields', fields),
  getFields: () => storage.get('agri_fields'),
  
  setDiaryEntries: (entries) => storage.set('agri_diary', entries),
  getDiaryEntries: () => storage.get('agri_diary'),
  
  setSettings: (settings) => storage.set('agri_settings', settings),
  getSettings: () => storage.get('agri_settings')
};