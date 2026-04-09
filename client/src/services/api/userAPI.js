// client/src/services/api/userAPI.js
import api from "./axiosConfig";

const userAPI = {
  // Получение профиля пользователя
  getProfile: async () => {
    try {
      console.log("📤 Запрос профиля...");

      // ✅ CORRECTED: Use /api/auth/me
      const response = await api.get("/api/auth/me");
      console.log("✅ Профиль получен:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Ошибка загрузки профиля:", error);
      throw error;
    }
  },

  // Обновление профиля
  updateProfile: async (userData) => {
    try {
      console.log("📤 Отправка данных профиля:", userData);

      // ✅ CORRECTED: Add /api prefix
      const response = await api.put("/api/auth/profile", userData);
      console.log("✅ Профиль обновлен:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Ошибка обновления профиля:", error);
      throw error;
    }
  },

  // Смена пароля
  changePassword: async (passwordData) => {
    try {
      console.log("📤 Смена пароля...");

      // ✅ CORRECTED: Add /api prefix
      const response = await api.post(
        "/api/auth/change-password",
        passwordData,
      );
      console.log("✅ Пароль изменен");
      return response.data;
    } catch (error) {
      console.error("❌ Ошибка смены пароля:", error);
      throw error;
    }
  },

  // Статистика пользователя (заглушка - бэкенд не имеет этого эндпоинта)
  getUserStats: async () => {
    try {
      console.log("📤 Запрос статистики пользователя...");

      // Бэкенд не имеет /auth/stats, возвращаем заглушку сразу
      console.log("⚠️ Эндпоинт статистики не реализован, используем заглушку");
      return {
        fields: 12,
        animals: 45,
        tasks: 8,
        resources: 23,
        crops: 6,
        weather: {
          temperature: 22,
          condition: "sunny",
        },
      };
    } catch (error) {
      console.error("❌ Ошибка получения статистики:", error);
      return {
        fields: 0,
        animals: 0,
        tasks: 0,
        resources: 0,
        crops: 0,
      };
    }
  },

  // Загрузка аватара
  uploadAvatar: async (formData) => {
    try {
      console.log("📤 Загрузка аватара...");

      const response = await api.post("/api/auth/avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error) {
      console.error("❌ Ошибка загрузки аватара:", error);
      throw error;
    }
  },

  // Удаление аватара
  deleteAvatar: async () => {
    try {
      console.log("📤 Удаление аватара...");

      const response = await api.delete("/api/auth/avatar");
      return response.data;
    } catch (error) {
      console.error("❌ Ошибка удаления аватара:", error);
      throw error;
    }
  },

  // Получение настроек пользователя
  getUserSettings: async () => {
    try {
      console.log("📤 Запрос настроек пользователя...");

      const response = await api.get("/api/auth/settings");
      return response.data;
    } catch (error) {
      console.error("❌ Ошибка загрузки настроек:", error);
      // Возвращаем настройки по умолчанию
      return {
        notifications: true,
        language: "ru",
        theme: "light",
      };
    }
  },

  // Обновление настроек пользователя
  updateUserSettings: async (settings) => {
    try {
      console.log("📤 Обновление настроек:", settings);

      const response = await api.put("/api/auth/settings", settings);
      return response.data;
    } catch (error) {
      console.error("❌ Ошибка обновления настроек:", error);
      throw error;
    }
  },
};

export default userAPI;
