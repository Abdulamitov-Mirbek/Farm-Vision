// client/src/services/api/userAPI.js
import api from "./axiosConfig";

const userAPI = {
  // Получение профиля пользователя
  getProfile: async () => {
    try {
      console.log("📤 Запрос профиля...");

      // ✅ Без двойного /api (базовый URL уже содержит /api)
      const response = await api.get("/auth/me");
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

      // ✅ Без двойного /api
      const response = await api.put("/auth/profile", userData);
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

      // ✅ Без двойного /api
      const response = await api.post("/auth/change-password", passwordData);
      console.log("✅ Пароль изменен");
      return response.data;
    } catch (error) {
      console.error("❌ Ошибка смены пароля:", error);
      throw error;
    }
  },

  // Загрузка аватара
  uploadAvatar: async (formData) => {
    try {
      console.log("📤 Загрузка аватара...");

      // ✅ Без двойного /api
      const response = await api.post("/auth/avatar", formData, {
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

  // Статистика пользователя (заглушка)
  getUserStats: async () => {
    try {
      console.log("📤 Запрос статистики...");

      // Пробуем получить статистику
      const response = await api.get("/users/stats");
      return response.data;
    } catch (error) {
      console.log("⚠️ Статистика недоступна, используем заглушку");
      // Возвращаем заглушку
      return {
        data: {
          totalFields: 12,
          totalArea: 45,
          totalTasks: 8,
          completedTasks: 5,
          totalHours: 120,
          achievements: 3,
        },
      };
    }
  },
};

export default userAPI;
