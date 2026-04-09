import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { useTheme } from "../contexts/ThemeContext"; // ✅ Добавляем тему
import { useAuth } from "../hooks/useAuth";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import Modal from "../components/common/Modal";
import { useAvatar } from "../contexts/AvatarContext";
import userAPI from "../services/api/userAPI";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Camera,
  Save,
  Edit2,
  Award,
  Target,
  Clock,
  Users,
  DollarSign,
  Leaf,
  CheckCircle,
  XCircle,
  AlertCircle,
  Trash2,
  LogOut,
  ChevronRight,
  RefreshCw,
} from "lucide-react";

const ProfilePage = () => {
  const { language } = useLanguage();
  const { theme } = useTheme(); // ✅ Получаем тему
  const { user, logout, updateProfile } = useAuth();
  const { avatar, updateAvatar } = useAvatar();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(avatar || "");

  // Классы для темы
  const themeClasses = {
    page: theme === "dark" ? "bg-gray-900" : "bg-gray-50",
    card:
      theme === "dark"
        ? "bg-gray-800 border-gray-700"
        : "bg-white border-gray-200",
    text: {
      primary: theme === "dark" ? "text-white" : "text-gray-900",
      secondary: theme === "dark" ? "text-gray-400" : "text-gray-600",
      muted: theme === "dark" ? "text-gray-500" : "text-gray-400",
    },
    border: theme === "dark" ? "border-gray-700" : "border-gray-200",
    input:
      theme === "dark"
        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-500"
        : "bg-white border-gray-300 text-gray-900",
    button: {
      primary: "bg-green-600 hover:bg-green-700 text-white",
      secondary:
        theme === "dark"
          ? "bg-gray-700 hover:bg-gray-600 text-gray-300 border-gray-600"
          : "bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300",
      outline:
        theme === "dark"
          ? "border-gray-600 hover:bg-gray-700 text-gray-300"
          : "border-gray-300 hover:bg-gray-100 text-gray-700",
      warning: "bg-yellow-600 hover:bg-yellow-700 text-white",
      danger: "bg-red-600 hover:bg-red-700 text-white",
    },
    avatar: {
      bg: theme === "dark" ? "bg-gray-700" : "bg-gray-100",
      text: theme === "dark" ? "text-gray-300" : "text-gray-600",
    },
    statCard: {
      bg: theme === "dark" ? "bg-gray-700" : "bg-gray-50",
      value: theme === "dark" ? "text-white" : "text-gray-900",
      label: theme === "dark" ? "text-gray-400" : "text-gray-600",
    },
    badge: {
      success:
        theme === "dark"
          ? "bg-green-900/30 text-green-400 border border-green-800"
          : "bg-green-100 text-green-700 border border-green-200",
      warning:
        theme === "dark"
          ? "bg-yellow-900/30 text-yellow-400 border border-yellow-800"
          : "bg-yellow-100 text-yellow-700 border border-yellow-200",
      info:
        theme === "dark"
          ? "bg-blue-900/30 text-blue-400 border border-blue-800"
          : "bg-blue-100 text-blue-700 border border-blue-200",
    },
    bio: {
      bg: theme === "dark" ? "bg-gray-700" : "bg-gray-50",
      text: theme === "dark" ? "text-gray-300" : "text-gray-700",
    },
    divider: theme === "dark" ? "border-gray-700" : "border-gray-100",
    hover: {
      card:
        theme === "dark"
          ? "hover:bg-gray-750 hover:border-gray-600"
          : "hover:bg-gray-50 hover:border-gray-300",
    },
    shadow: {
      card:
        theme === "dark"
          ? "shadow-lg shadow-black/20"
          : "shadow-lg shadow-gray-200",
    },
  };

  // Данные пользователя из API
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    farmName: "",
    bio: "",
    location: {
      city: "",
      country: "",
    },
    joinDate: "",
    stats: {
      totalFields: 0,
      totalArea: 0,
      totalTasks: 0,
      completedTasks: 0,
      totalHours: 0,
      achievements: 0,
    },
  });

  // Форма редактирования
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
    farmName: "",
    bio: "",
    location: {
      city: "",
      country: "",
    },
  });

  // Загрузка данных профиля
  useEffect(() => {
    loadProfileData();
  }, []);

  // Загрузка сохраненного фото
  useEffect(() => {
    if (avatar) {
      setImagePreview(avatar);
    }
  }, [avatar]);

  const loadProfileData = async () => {
    try {
      setLoading(true);

      // Загружаем профиль из API
      const response = await userAPI.getProfile();
      console.log("📥 Ответ API профиля:", response);

      // ✅ ПРАВИЛЬНОЕ извлечение данных профиля
      let profile;
      if (response.user) {
        profile = response.user; // Формат от /api/auth/me
      } else if (response.data) {
        profile = response.data; // Формат от /api/users/profile
      } else {
        profile = response; // Данные напрямую
      }

      console.log("📥 Данные профиля:", profile);

      // Загружаем статистику
      const statsResponse = await userAPI.getUserStats();
      const stats = statsResponse.data || statsResponse;

      setUserData({
        name: profile.name || profile.username || "",
        email: profile.email || "",
        phone: profile.phone || "",
        farmName: profile.farmName || "",
        bio: profile.bio || "",
        location: profile.location || { city: "", country: "" },
        joinDate: profile.createdAt || new Date().toISOString(),
        stats: stats || {
          totalFields: 0,
          totalArea: 0,
          totalTasks: 0,
          completedTasks: 0,
          totalHours: 0,
          achievements: 0,
        },
      });

      // Заполняем форму редактирования
      setEditForm({
        name: profile.name || profile.username || "",
        email: profile.email || "",
        phone: profile.phone || "",
        farmName: profile.farmName || "",
        bio: profile.bio || "",
        location: profile.location || { city: "", country: "" },
      });
    } catch (error) {
      console.error("❌ Ошибка загрузки профиля:", error);
    } finally {
      setLoading(false);
    }
  };
  // Обработчик загрузки фото
  // Обработчик загрузки фото
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      // Показываем превью сразу (из локального файла)
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Отправляем на сервер
      const formData = new FormData();
      formData.append("avatar", file);

      console.log("📤 Отправка аватара...");
      const response = await userAPI.uploadAvatar(formData);

      if (response.success) {
        console.log("✅ Аватар загружен, URL:", response.avatar);

        // ✅ ВАЖНО: Обновляем аватар в контексте с ПРАВИЛЬНЫМ URL
        const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
        const fullAvatarUrl = response.avatar.startsWith("http")
          ? response.avatar
          : `${baseUrl}${response.avatar}`;

        console.log("📸 Полный URL аватара:", fullAvatarUrl);

        // ✅ Обновляем контекст
        updateAvatar(fullAvatarUrl);

        // ✅ Обновляем превью
        setImagePreview(fullAvatarUrl);

        // ✅ Обновляем данные пользователя
        setUserData((prev) => ({
          ...prev,
          avatar: fullAvatarUrl,
        }));

        alert("✅ Аватар обновлен!");
      }
    } catch (error) {
      console.error("❌ Ошибка загрузки аватара:", error);
      alert(
        "Не удалось загрузить аватар: " +
          (error.response?.data?.message || error.message),
      );
    }
  };
  // Обработчик сохранения профиля
  const handleSaveProfile = async () => {
    try {
      setSaving(true);

      const profileData = {
        name: editForm.name,
        email: editForm.email,
        phone: editForm.phone,
        farmName: editForm.farmName,
        bio: editForm.bio,
        location: editForm.location,
      };

      console.log("📤 Отправка данных:", profileData);

      const result = await userAPI.updateProfile(profileData);

      if (result?.success) {
        // Обновляем локальные данные
        setUserData((prev) => ({
          ...prev,
          ...profileData,
        }));

        // Обновляем пользователя в контексте
        if (updateProfile) {
          await updateProfile(profileData);
        }

        setIsEditing(false);
        alert("✅ Профиль обновлен!");
      }
    } catch (error) {
      console.error("Ошибка сохранения:", error);
      alert(error.response?.data?.message || "Не удалось обновить профиль");
    } finally {
      setSaving(false);
    }
  };

  // Обработчик выхода
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Форматирование даты
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString(
      language === "ru" ? "ru-RU" : language === "en" ? "en-US" : "ky-KG",
      { year: "numeric", month: "long", day: "numeric" },
    );
  };

  if (loading) {
    return (
      <div
        className={`flex items-center justify-center h-64 ${themeClasses.page}`}
      >
        <div className="text-center">
          <RefreshCw
            className={`animate-spin mx-auto mb-4 ${
              theme === "dark" ? "text-green-400" : "text-green-600"
            }`}
            size={40}
          />
          <p className={themeClasses.text.secondary}>
            {language === "ru"
              ? "Загрузка профиля..."
              : language === "en"
                ? "Loading profile..."
                : "Профиль жүктөлүүдө..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-6 transition-colors duration-300 ${themeClasses.page}`}>
      <div className="space-y-6">
        {/* Заголовок */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1
              className={`text-2xl font-bold ${themeClasses.text.primary} flex items-center`}
            >
              <User
                className={`mr-2 ${
                  theme === "dark" ? "text-green-400" : "text-green-600"
                }`}
                size={24}
              />
              {language === "ru"
                ? "👤 Мой профиль"
                : language === "en"
                  ? "👤 My Profile"
                  : "👤 Менин профилим"}
            </h1>
            <p className={`mt-1 ${themeClasses.text.secondary}`}>
              {language === "ru"
                ? "Личная информация и статистика"
                : language === "en"
                  ? "Personal information and statistics"
                  : "Жеке маалымат жана статистика"}
            </p>
          </div>

          <div className="flex items-center space-x-3 mt-4 md:mt-0">
            <button
              className={`px-4 py-2 rounded-lg border transition-colors ${themeClasses.button.outline} ${
                themeClasses.hover.card
              }`}
              onClick={() => setIsEditing(true)}
              disabled={saving}
            >
              <Edit2 size={16} className="mr-2 inline" />
              {language === "ru"
                ? "Редактировать"
                : language === "en"
                  ? "Edit"
                  : "Оңдоо"}
            </button>
            <button
              className={`px-4 py-2 rounded-lg ${themeClasses.button.danger}`}
              onClick={handleLogout}
            >
              <LogOut size={16} className="mr-2 inline" />
              {language === "ru"
                ? "Выйти"
                : language === "en"
                  ? "Logout"
                  : "Чыгуу"}
            </button>
          </div>
        </div>

        {/* Основной контент */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Левая колонка - Аватар и основная информация */}
          <div className="lg:col-span-1">
            <div
              className={`p-6 rounded-xl border ${themeClasses.card} ${themeClasses.shadow.card}`}
            >
              {/* Аватар */}
              <div className="relative group mb-4 inline-block">
                <div
                  className={`w-32 h-32 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-5xl shadow-lg mx-auto overflow-hidden ${
                    themeClasses.avatar.bg
                  }`}
                >
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{userData.name?.[0]?.toUpperCase() || "U"}</span>
                  )}
                </div>
                <label
                  className={`absolute bottom-0 right-0 w-8 h-8 rounded-lg shadow-md flex items-center justify-center cursor-pointer transition-colors border ${
                    theme === "dark"
                      ? "bg-gray-700 hover:bg-gray-600 border-gray-600"
                      : "bg-white hover:bg-gray-50 border-gray-200"
                  }`}
                >
                  <Camera
                    size={16}
                    className={
                      theme === "dark" ? "text-gray-300" : "text-gray-600"
                    }
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <h2 className={`text-xl font-bold ${themeClasses.text.primary}`}>
                {userData.name || "Пользователь"}
              </h2>
              <p className={`mt-1 ${themeClasses.text.secondary}`}>
                {userData.farmName || "Фермер"}
              </p>

              <div className={`mt-4 pt-4 border-t ${themeClasses.divider}`}>
                <div
                  className={`flex items-center justify-center text-sm mb-2 ${themeClasses.text.secondary}`}
                >
                  <MapPin size={14} className="mr-1" />
                  {userData.location?.city || "Город не указан"},{" "}
                  {userData.location?.country || "Страна не указана"}
                </div>
                <div
                  className={`flex items-center justify-center text-sm ${themeClasses.text.secondary}`}
                >
                  <Calendar size={14} className="mr-1" />
                  {language === "ru"
                    ? "Регистрация"
                    : language === "en"
                      ? "Joined"
                      : "Катталган"}
                  : {formatDate(userData.joinDate)}
                </div>
              </div>

              <div className="mt-4 flex justify-center space-x-4">
                <div className="text-center">
                  <p
                    className={`text-xl font-bold ${themeClasses.text.primary}`}
                  >
                    {userData.stats.totalFields || 0}
                  </p>
                  <p className={`text-xs ${themeClasses.text.muted}`}>
                    {language === "ru"
                      ? "Полей"
                      : language === "en"
                        ? "Fields"
                        : "Талаалар"}
                  </p>
                </div>
                <div className="text-center">
                  <p
                    className={`text-xl font-bold ${themeClasses.text.primary}`}
                  >
                    {userData.stats.totalTasks || 0}
                  </p>
                  <p className={`text-xs ${themeClasses.text.muted}`}>
                    {language === "ru"
                      ? "Задач"
                      : language === "en"
                        ? "Tasks"
                        : "Милдеттер"}
                  </p>
                </div>
                <div className="text-center">
                  <p
                    className={`text-xl font-bold ${themeClasses.text.primary}`}
                  >
                    {userData.stats.achievements || 0}
                  </p>
                  <p className={`text-xs ${themeClasses.text.muted}`}>
                    {language === "ru"
                      ? "Достижения"
                      : language === "en"
                        ? "Achievements"
                        : "Жетишкендиктер"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Правая колонка - Детальная информация */}
          <div className="lg:col-span-2 space-y-6">
            {/* Личная информация */}
            <div
              className={`p-6 rounded-xl border ${themeClasses.card} ${themeClasses.shadow.card}`}
            >
              <h3
                className={`text-lg font-semibold mb-4 ${themeClasses.text.primary}`}
              >
                {language === "ru"
                  ? "📋 Личная информация"
                  : language === "en"
                    ? "📋 Personal Information"
                    : "📋 Жеке маалымат"}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className={`text-sm mb-1 ${themeClasses.text.secondary}`}>
                    {language === "ru"
                      ? "Имя"
                      : language === "en"
                        ? "Name"
                        : "Аты"}
                  </p>
                  <p className={`font-medium ${themeClasses.text.primary}`}>
                    {userData.name || "—"}
                  </p>
                </div>
                <div>
                  <p className={`text-sm mb-1 ${themeClasses.text.secondary}`}>
                    Email
                  </p>
                  <p className={`font-medium ${themeClasses.text.primary}`}>
                    {userData.email || "—"}
                  </p>
                </div>
                <div>
                  <p className={`text-sm mb-1 ${themeClasses.text.secondary}`}>
                    {language === "ru"
                      ? "Телефон"
                      : language === "en"
                        ? "Phone"
                        : "Телефон"}
                  </p>
                  <p className={`font-medium ${themeClasses.text.primary}`}>
                    {userData.phone || "—"}
                  </p>
                </div>
                <div>
                  <p className={`text-sm mb-1 ${themeClasses.text.secondary}`}>
                    {language === "ru"
                      ? "Ферма"
                      : language === "en"
                        ? "Farm"
                        : "Ферма"}
                  </p>
                  <p className={`font-medium ${themeClasses.text.primary}`}>
                    {userData.farmName || "—"}
                  </p>
                </div>
              </div>

              {userData.bio && (
                <div className="mt-4">
                  <p className={`text-sm mb-1 ${themeClasses.text.secondary}`}>
                    {language === "ru"
                      ? "О себе"
                      : language === "en"
                        ? "Bio"
                        : "Өзүм жөнүндө"}
                  </p>
                  <p
                    className={`p-3 rounded-lg ${themeClasses.bio.bg} ${themeClasses.bio.text}`}
                  >
                    {userData.bio}
                  </p>
                </div>
              )}
            </div>

            {/* Статистика */}
            <div
              className={`p-6 rounded-xl border ${themeClasses.card} ${themeClasses.shadow.card}`}
            >
              <h3
                className={`text-lg font-semibold mb-4 ${themeClasses.text.primary}`}
              >
                {language === "ru"
                  ? "📊 Статистика"
                  : language === "en"
                    ? "📊 Statistics"
                    : "📊 Статистика"}
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div
                  className={`text-center p-4 rounded-xl ${themeClasses.statCard.bg}`}
                >
                  <p
                    className={`text-2xl font-bold ${themeClasses.statCard.value}`}
                  >
                    {userData.stats.totalFields || 0}
                  </p>
                  <p className={`text-sm ${themeClasses.statCard.label}`}>
                    {language === "ru"
                      ? "Полей"
                      : language === "en"
                        ? "Fields"
                        : "Талаалар"}
                  </p>
                </div>
                <div
                  className={`text-center p-4 rounded-xl ${themeClasses.statCard.bg}`}
                >
                  <p
                    className={`text-2xl font-bold ${themeClasses.statCard.value}`}
                  >
                    {userData.stats.totalArea || 0}
                  </p>
                  <p className={`text-sm ${themeClasses.statCard.label}`}>
                    {language === "ru" ? "га" : language === "en" ? "ha" : "га"}
                  </p>
                </div>
                <div
                  className={`text-center p-4 rounded-xl ${themeClasses.statCard.bg}`}
                >
                  <p
                    className={`text-2xl font-bold ${themeClasses.statCard.value}`}
                  >
                    {userData.stats.totalTasks || 0}
                  </p>
                  <p className={`text-sm ${themeClasses.statCard.label}`}>
                    {language === "ru"
                      ? "Задач"
                      : language === "en"
                        ? "Tasks"
                        : "Милдеттер"}
                  </p>
                </div>
                <div
                  className={`text-center p-4 rounded-xl ${themeClasses.statCard.bg}`}
                >
                  <p
                    className={`text-2xl font-bold ${themeClasses.statCard.value}`}
                  >
                    {userData.stats.totalHours || 0}
                  </p>
                  <p className={`text-sm ${themeClasses.statCard.label}`}>
                    {language === "ru"
                      ? "Часов"
                      : language === "en"
                        ? "Hours"
                        : "Саат"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Модальное окно редактирования */}
        {isEditing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div
              className={`w-full max-w-2xl rounded-xl border ${themeClasses.card} ${themeClasses.shadow.card} p-6`}
            >
              <h3
                className={`text-xl font-semibold mb-4 ${themeClasses.text.primary}`}
              >
                {language === "ru"
                  ? "✏️ Редактировать профиль"
                  : language === "en"
                    ? "✏️ Edit Profile"
                    : "✏️ Профилди оңдоо"}
              </h3>

              <div className="space-y-4">
                <div>
                  <label
                    className={`block text-sm font-medium mb-1 ${themeClasses.text.secondary}`}
                  >
                    {language === "ru"
                      ? "Имя"
                      : language === "en"
                        ? "Name"
                        : "Аты"}
                  </label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                    disabled={saving}
                    className={`w-full px-4 py-2 rounded-lg border transition-colors ${themeClasses.input}`}
                  />
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-1 ${themeClasses.text.secondary}`}
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) =>
                      setEditForm({ ...editForm, email: e.target.value })
                    }
                    disabled={saving}
                    className={`w-full px-4 py-2 rounded-lg border transition-colors ${themeClasses.input}`}
                  />
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-1 ${themeClasses.text.secondary}`}
                  >
                    {language === "ru"
                      ? "Телефон"
                      : language === "en"
                        ? "Phone"
                        : "Телефон"}
                  </label>
                  <input
                    type="text"
                    value={editForm.phone}
                    onChange={(e) =>
                      setEditForm({ ...editForm, phone: e.target.value })
                    }
                    disabled={saving}
                    className={`w-full px-4 py-2 rounded-lg border transition-colors ${themeClasses.input}`}
                  />
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-1 ${themeClasses.text.secondary}`}
                  >
                    {language === "ru"
                      ? "Название фермы"
                      : language === "en"
                        ? "Farm Name"
                        : "Ферманын аты"}
                  </label>
                  <input
                    type="text"
                    value={editForm.farmName}
                    onChange={(e) =>
                      setEditForm({ ...editForm, farmName: e.target.value })
                    }
                    disabled={saving}
                    className={`w-full px-4 py-2 rounded-lg border transition-colors ${themeClasses.input}`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      className={`block text-sm font-medium mb-1 ${themeClasses.text.secondary}`}
                    >
                      {language === "ru"
                        ? "Город"
                        : language === "en"
                          ? "City"
                          : "Шаар"}
                    </label>
                    <input
                      type="text"
                      value={editForm.location.city}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          location: {
                            ...editForm.location,
                            city: e.target.value,
                          },
                        })
                      }
                      disabled={saving}
                      className={`w-full px-4 py-2 rounded-lg border transition-colors ${themeClasses.input}`}
                    />
                  </div>
                  <div>
                    <label
                      className={`block text-sm font-medium mb-1 ${themeClasses.text.secondary}`}
                    >
                      {language === "ru"
                        ? "Страна"
                        : language === "en"
                          ? "Country"
                          : "Өлкө"}
                    </label>
                    <input
                      type="text"
                      value={editForm.location.country}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          location: {
                            ...editForm.location,
                            country: e.target.value,
                          },
                        })
                      }
                      disabled={saving}
                      className={`w-full px-4 py-2 rounded-lg border transition-colors ${themeClasses.input}`}
                    />
                  </div>
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-1 ${themeClasses.text.secondary}`}
                  >
                    {language === "ru"
                      ? "О себе"
                      : language === "en"
                        ? "Bio"
                        : "Өзүм жөнүндө"}
                  </label>
                  <textarea
                    rows={4}
                    className={`w-full px-4 py-2 rounded-lg border transition-colors ${themeClasses.input}`}
                    placeholder={
                      language === "ru"
                        ? "О себе..."
                        : language === "en"
                          ? "About..."
                          : "Өзүм жөнүндө..."
                    }
                    value={editForm.bio}
                    onChange={(e) =>
                      setEditForm({ ...editForm, bio: e.target.value })
                    }
                    disabled={saving}
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    className={`px-4 py-2 rounded-lg border transition-colors ${themeClasses.button.outline}`}
                    onClick={() => setIsEditing(false)}
                    disabled={saving}
                  >
                    {language === "ru"
                      ? "Отмена"
                      : language === "en"
                        ? "Cancel"
                        : "Жокко чыгаруу"}
                  </button>
                  <button
                    className={`px-4 py-2 rounded-lg transition-colors flex items-center ${themeClasses.button.primary} ${
                      saving ? "opacity-75 cursor-not-allowed" : ""
                    }`}
                    onClick={handleSaveProfile}
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <RefreshCw size={16} className="mr-2 animate-spin" />
                        {language === "ru"
                          ? "Сохранение..."
                          : language === "en"
                            ? "Saving..."
                            : "Сакталууда..."}
                      </>
                    ) : (
                      <>
                        <Save size={16} className="mr-2" />
                        {language === "ru"
                          ? "Сохранить"
                          : language === "en"
                            ? "Save"
                            : "Сактоо"}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
