// client/src/services/api/authAPI.js
import axiosInstance from "./axiosConfig";

/**
 * API для аутентификации
 * Работает с реальным сервером на http://localhost:5000/api
 */
export const authAPI = {
  /**
   * Вход пользователя
   */
  login: async (email, password) => {
    try {
      console.log("📤 Login request to /auth/login");
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
      });
      console.log("🔵 Login response:", response.data);
      return response;
    } catch (error) {
      console.error("❌ Login API error:", error);
      throw error;
    }
  },

  /**
   * Регистрация нового пользователя
   */
  register: async (userData) => {
    try {
      console.log("📤 Register request to /auth/register");
      const response = await axiosInstance.post("/auth/register", userData);
      console.log("🔵 Register response:", response.data);
      return response;
    } catch (error) {
      console.error("❌ Register API error:", error);
      throw error;
    }
  },

  /**
   * Получение данных текущего пользователя
   */
  getMe: async () => {
    try {
      console.log("📤 GetMe request to /auth/me");
      const response = await axiosInstance.get("/auth/me");
      console.log("🔵 GetMe response:", response.data);
      return response;
    } catch (error) {
      console.error("❌ GetMe API error:", error);
      throw error;
    }
  },

  /**
   * Выход из системы
   */
  logout: () => {
    console.log("🚪 Logout - clearing tokens");
    localStorage.removeItem("token");
    localStorage.removeItem("auth_token");
    localStorage.removeItem("agri_user");
    localStorage.removeItem("refresh_token");
  },

  /**
   * Обновление профиля пользователя
   */
  updateProfile: async (userData) => {
    try {
      console.log("📤 Update profile request to /auth/profile:", userData);
      // ✅ Исправлено: /auth/profile вместо /users/profile
      const response = await axiosInstance.put("/auth/profile", userData);
      console.log("🔵 Update profile response:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "❌ Update profile API error:",
        error.response?.data || error.message,
      );
      throw error;
    }
  },

  /**
   * Смена пароля
   */
  changePassword: async (currentPassword, newPassword) => {
    try {
      console.log("📤 Change password request to /auth/change-password");
      const response = await axiosInstance.post("/auth/change-password", {
        currentPassword,
        newPassword,
      });
      console.log("🔵 Change password response:", response.data);
      return response;
    } catch (error) {
      console.error("❌ Change password API error:", error);
      throw error;
    }
  },

  /**
   * Запрос на сброс пароля
   */
  forgotPassword: async (email) => {
    try {
      // ✅ Исправлено: без /api
      console.log("📤 Forgot password request to /auth/forgot-password");
      const response = await axiosInstance.post("/auth/forgot-password", {
        email,
      });
      console.log("🔵 Forgot password response:", response.data);
      return response;
    } catch (error) {
      console.error("❌ Forgot password API error:", error);
      throw error;
    }
  },

  /**
   * Сброс пароля по токену
   */
  resetPassword: async (token, newPassword) => {
    try {
      // ✅ Исправлено: без /api
      console.log("📤 Reset password request to /auth/reset-password");
      const response = await axiosInstance.post("/auth/reset-password", {
        token,
        newPassword,
      });
      console.log("🔵 Reset password response:", response.data);
      return response;
    } catch (error) {
      console.error("❌ Reset password API error:", error);
      throw error;
    }
  },

  /**
   * Включение двухфакторной аутентификации
   */
  enable2FA: async () => {
    try {
      // ✅ Исправлено: без /api
      console.log("📤 Enable 2FA request to /auth/2fa/enable");
      const response = await axiosInstance.post("/auth/2fa/enable");
      console.log("🔵 Enable 2FA response:", response.data);
      return response;
    } catch (error) {
      console.error("❌ Enable 2FA API error:", error);
      throw error;
    }
  },

  /**
   * Подтверждение 2FA
   */
  verify2FA: async (token) => {
    try {
      // ✅ Исправлено: без /api
      console.log("📤 Verify 2FA request to /auth/2fa/verify");
      const response = await axiosInstance.post("/auth/2fa/verify", { token });
      console.log("🔵 Verify 2FA response:", response.data);
      return response;
    } catch (error) {
      console.error("❌ Verify 2FA API error:", error);
      throw error;
    }
  },

  /**
   * Отключение 2FA
   */
  disable2FA: async (token) => {
    try {
      // ✅ Исправлено: без /api
      console.log("📤 Disable 2FA request to /auth/2fa/disable");
      const response = await axiosInstance.post("/auth/2fa/disable", { token });
      console.log("🔵 Disable 2FA response:", response.data);
      return response;
    } catch (error) {
      console.error("❌ Disable 2FA API error:", error);
      throw error;
    }
  },

  /**
   * Обновление токена
   */
  refreshToken: async () => {
    try {
      const refreshToken = localStorage.getItem("refresh_token");
      // ✅ Исправлено: без /api
      console.log("📤 Refresh token request to /auth/refresh-token");

      const response = await axiosInstance.post("/auth/refresh-token", {
        refreshToken,
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("auth_token", response.data.token);
        console.log("🔵 Token refreshed successfully");
      }

      if (response.data.refreshToken) {
        localStorage.setItem("refresh_token", response.data.refreshToken);
      }

      return response;
    } catch (error) {
      console.error("❌ Refresh token API error:", error);
      throw error;
    }
  },

  /**
   * Проверка валидности токена
   */
  verifyToken: async () => {
    try {
      // ✅ Исправлено: без /api
      console.log("📤 Verify token request to /auth/verify");
      const response = await axiosInstance.get("/auth/verify");
      console.log("🔵 Verify token response:", response.data);
      return response;
    } catch (error) {
      console.error("❌ Verify token API error:", error);
      throw error;
    }
  },
};

export default authAPI;
