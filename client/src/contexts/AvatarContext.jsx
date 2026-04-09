import React, { createContext, useState, useContext, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";

const AvatarContext = createContext();

export const useAvatar = () => {
  const context = useContext(AvatarContext);
  if (!context) {
    throw new Error("useAvatar must be used within AvatarProvider");
  }
  return context;
};

export const AvatarProvider = ({ children }) => {
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth(); // ✅ Получаем текущего пользователя

  // ✅ Загружаем аватар из данных пользователя (с сервера)
  useEffect(() => {
    if (user?.avatar) {
      setAvatar(user.avatar);
      console.log(
        "📸 Аватар загружен для пользователя:",
        user.name || user.username,
      );
    } else {
      setAvatar(null); // ✅ Сбрасываем при выходе или если нет аватара
    }
    setLoading(false);
  }, [user]); // ✅ Зависит от пользователя!

  // Функция для обновления аватара (только в состоянии, не в localStorage!)
  const updateAvatar = (newAvatar) => {
    setAvatar(newAvatar);
    console.log("📸 Аватар обновлен в состоянии");
    // ✅ НЕ сохраняем в глобальный localStorage!
  };

  // Функция для удаления аватара
  const removeAvatar = () => {
    setAvatar(null);
    console.log("📸 Аватар удален из состояния");
  };

  return (
    <AvatarContext.Provider
      value={{
        avatar,
        updateAvatar,
        removeAvatar,
        loading,
      }}
    >
      {children}
    </AvatarContext.Provider>
  );
};
