import React, { createContext, useState, useContext, useEffect } from 'react';

const AvatarContext = createContext();

export const useAvatar = () => {
  const context = useContext(AvatarContext);
  if (!context) {
    throw new Error('useAvatar must be used within AvatarProvider');
  }
  return context;
};

export const AvatarProvider = ({ children }) => {
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(true);

  // Загружаем аватар из localStorage при старте
  useEffect(() => {
    const loadAvatar = () => {
      try {
        const savedAvatar = localStorage.getItem('userAvatar');
        if (savedAvatar) {
          setAvatar(savedAvatar);
        }
      } catch (error) {
        console.error('Ошибка загрузки аватара:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadAvatar();
  }, []);

  // Функция для обновления аватара
  const updateAvatar = (newAvatar) => {
    try {
      setAvatar(newAvatar);
      localStorage.setItem('userAvatar', newAvatar);
      
      // Вызываем событие для синхронизации между вкладками
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'userAvatar',
        newValue: newAvatar
      }));
      
      console.log('Аватар обновлен и сохранен');
    } catch (error) {
      console.error('Ошибка сохранения аватара:', error);
    }
  };

  // Функция для удаления аватара
  const removeAvatar = () => {
    try {
      setAvatar(null);
      localStorage.removeItem('userAvatar');
      
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'userAvatar',
        newValue: null
      }));
      
      console.log('Аватар удален');
    } catch (error) {
      console.error('Ошибка удаления аватара:', error);
    }
  };

  // Слушаем изменения в localStorage (для синхронизации между вкладками)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'userAvatar') {
        setAvatar(e.newValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <AvatarContext.Provider value={{ 
      avatar, 
      updateAvatar, 
      removeAvatar,
      loading 
    }}>
      {children}
    </AvatarContext.Provider>
  );
};