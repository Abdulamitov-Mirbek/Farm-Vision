// src/pages/Settings/Security.jsx
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext'; // ✅ Добавляем тему
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import api from '../../services/api';
import './Security.css';

const Security = () => {
  const { language } = useLanguage();
  const { theme } = useTheme(); // ✅ Получаем тему
  const [activeTab, setActiveTab] = useState('password');
  const [loading, setLoading] = useState(false);
  
  // Состояния для 2FA
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [smsEnabled, setSmsEnabled] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showRecoveryCodes, setShowRecoveryCodes] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [twoFactorToken, setTwoFactorToken] = useState('');
  const [recoveryCodes, setRecoveryCodes] = useState([]);
  
  // Форма смены пароля
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Форма удаления аккаунта
  const [deleteData, setDeleteData] = useState({
    confirmation: '',
    password: ''
  });
  
  // Данные с сервера
  const [sessions, setSessions] = useState([]);
  const [loginHistory, setLoginHistory] = useState([]);
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'private',
    showContactInfo: false,
    anonymousData: true,
    personalizedAds: false
  });
  
  const [securityScore, setSecurityScore] = useState({
    score: 65,
    level: 'Средний',
    issues: []
  });

  // Классы для темы
  const themeClasses = {
    page: theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50',
    card: theme === 'dark' 
      ? 'bg-gray-800 border-gray-700' 
      : 'bg-white border-gray-200',
    text: {
      primary: theme === 'dark' ? 'text-white' : 'text-gray-900',
      secondary: theme === 'dark' ? 'text-gray-400' : 'text-gray-600',
      muted: theme === 'dark' ? 'text-gray-500' : 'text-gray-400',
    },
    border: theme === 'dark' ? 'border-gray-700' : 'border-gray-200',
    input: theme === 'dark'
      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
      : 'bg-white border-gray-300 text-gray-900',
    button: {
      primary: 'bg-green-600 hover:bg-green-700 text-white',
      secondary: theme === 'dark'
        ? 'bg-gray-700 hover:bg-gray-600 text-gray-300 border-gray-600'
        : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300',
      outline: theme === 'dark'
        ? 'border-gray-600 hover:bg-gray-700 text-gray-300'
        : 'border-gray-300 hover:bg-gray-100 text-gray-700',
      danger: 'bg-red-600 hover:bg-red-700 text-white',
    },
    nav: {
      item: theme === 'dark'
        ? 'text-gray-300 hover:bg-gray-700'
        : 'text-gray-700 hover:bg-gray-100',
      active: theme === 'dark'
        ? 'bg-gray-700 text-green-400 border-l-4 border-green-400'
        : 'bg-green-50 text-green-700 border-l-4 border-green-600',
      badge: {
        warning: theme === 'dark' ? 'bg-yellow-900/30 text-yellow-400' : 'bg-yellow-100 text-yellow-700',
        success: theme === 'dark' ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700',
      }
    },
    score: {
      circle: theme === 'dark' ? '#4b5563' : '#e2e8f0',
      fill: '#2d5a27',
      text: theme === 'dark' ? '#f3f4f6' : '#1e293b',
    },
    session: {
      current: theme === 'dark'
        ? 'border-green-800 bg-green-900/20'
        : 'border-green-200 bg-green-50',
      normal: theme === 'dark'
        ? 'border-gray-700 hover:bg-gray-700'
        : 'border-gray-100 hover:bg-gray-50',
    },
    toggle: {
      bg: theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300',
      checked: 'bg-green-600',
    },
    deleteCard: theme === 'dark'
      ? 'border-red-900 bg-red-900/10'
      : 'border-red-200 bg-red-50',
  };

  // Загружаем данные при монтировании
  useEffect(() => {
    fetchSecurityData();
  }, []);

  // ============ ФУНКЦИИ ЗАГРУЗКИ ДАННЫХ ============
  const fetchSecurityData = async () => {
    setLoading(true);
    try {
      // Загружаем все данные параллельно
      const [
        sessionsData,
        historyData,
        privacyData,
        twoFactorStatus,
        scoreData
      ] = await Promise.all([
        api.get('/auth/sessions').then(res => res.data),
        api.get('/auth/login-history').then(res => res.data),
        api.get('/auth/privacy').then(res => res.data),
        api.get('/auth/2fa/status').then(res => res.data),
        api.get('/auth/security-score').then(res => res.data)
      ]);

      setSessions(sessionsData || []);
      setLoginHistory(historyData || []);
      setPrivacySettings(privacyData || {});
      setTwoFactorEnabled(twoFactorStatus?.enabled || false);
      setSmsEnabled(twoFactorStatus?.smsEnabled || false);
      setBiometricEnabled(twoFactorStatus?.biometricEnabled || false);
      setSecurityScore(scoreData || { score: 65, level: 'Средний', issues: [] });
    } catch (error) {
      console.error('Error fetching security data:', error);
    } finally {
      setLoading(false);
    }
  };

  // ============ СМЕНА ПАРОЛЯ ============
  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('❌ Пароли не совпадают');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      alert('❌ Пароль должен быть не менее 6 символов');
      return;
    }
    
    try {
      setLoading(true);
      await api.post('/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      alert('✅ Пароль успешно изменен!');
      setShowPasswordForm(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      alert('❌ Ошибка при смене пароля');
    } finally {
      setLoading(false);
    }
  };

  // ============ 2FA ============
  const handleEnable2FA = async () => {
    try {
      setLoading(true);
      const response = await api.post('/auth/2fa/generate');
      setQrCode(response.data.qrCode);
      setShowRecoveryCodes(true);
    } catch (error) {
      console.error('Enable 2FA error:', error);
      alert('❌ Ошибка при включении 2FA');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify2FA = async () => {
    if (!twoFactorToken) {
      alert('❌ Введите код из приложения');
      return;
    }
    
    try {
      setLoading(true);
      const response = await api.post('/auth/2fa/enable', { token: twoFactorToken });
      setTwoFactorEnabled(true);
      setRecoveryCodes(response.data.recoveryCodes || []);
      alert('✅ 2FA успешно включена! Сохраните резервные коды.');
      setTwoFactorToken('');
    } catch (error) {
      alert('❌ Неверный код');
    } finally {
      setLoading(false);
    }
  };

  const handleDisable2FA = async () => {
    if (window.confirm('Вы уверены? Это снизит безопасность вашего аккаунта.')) {
      try {
        setLoading(true);
        await api.post('/auth/2fa/disable');
        setTwoFactorEnabled(false);
        setShowRecoveryCodes(false);
        setQrCode('');
        alert('✅ 2FA отключена');
      } catch (error) {
        alert('❌ Ошибка при отключении 2FA');
      } finally {
        setLoading(false);
      }
    }
  };

  // ============ СЕССИИ ============
  const handleTerminateSession = async (sessionId) => {
    try {
      setLoading(true);
      await api.delete(`/auth/sessions/${sessionId}`);
      const updated = await api.get('/auth/sessions');
      setSessions(updated.data);
    } catch (error) {
      alert('❌ Ошибка при завершении сессии');
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutAllDevices = async () => {
    if (window.confirm('Вы выйдете из всех устройств. Продолжить?')) {
      try {
        setLoading(true);
        await api.delete('/auth/sessions');
        alert('✅ Все сессии завершены');
        const updated = await api.get('/auth/sessions');
        setSessions(updated.data);
      } catch (error) {
        alert('❌ Ошибка при завершении сессий');
      } finally {
        setLoading(false);
      }
    }
  };

  // ============ ПРИВАТНОСТЬ ============
  const handleUpdatePrivacy = async () => {
    try {
      setLoading(true);
      await api.put('/auth/privacy', privacySettings);
      alert('✅ Настройки сохранены');
    } catch (error) {
      alert('❌ Ошибка при сохранении');
    } finally {
      setLoading(false);
    }
  };

  // ============ УДАЛЕНИЕ АККАУНТА ============
  const handleDeleteAccount = async () => {
    if (deleteData.confirmation !== 'DELETE') {
      alert('❌ Введите DELETE для подтверждения');
      return;
    }
    
    try {
      setLoading(true);
      await api.delete('/auth/user', {
        data: {
          confirmation: deleteData.confirmation,
          password: deleteData.password
        }
      });
      alert('✅ Аккаунт успешно удален');
      localStorage.removeItem('token');
      window.location.href = '/login';
    } catch (error) {
      alert('❌ Ошибка при удалении аккаунта');
    } finally {
      setLoading(false);
    }
  };

  // ============ ВСПОМОГАТЕЛЬНЫЕ ============
  const copyRecoveryCode = (code) => {
    navigator.clipboard.writeText(code);
    alert('✅ Код скопирован!');
  };

  const downloadRecoveryCodes = () => {
    const text = recoveryCodes.join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'farmvision-recovery-codes.txt';
    a.click();
  };

  // Переводы
  const pageText = {
    title: { ru: 'Безопасность', en: 'Security', kg: 'Коопсуздук' },
    description: { ru: 'Защитите свой аккаунт и управляйте безопасностью', en: 'Protect your account and manage security', kg: 'Аккаунтуңузду коргоңуз жана коопсуздукту башкарыңыз' },
    securityLevel: { ru: 'Уровень защиты', en: 'Security Level', kg: 'Коргоо деңгээли' },
    issues: { ru: 'проблем', en: 'issues', kg: 'көйгөй' },
    securityCenter: { ru: 'Центр безопасности', en: 'Security Center', kg: 'Коопсуздук борбору' },
    tabs: {
      password: { ru: 'Пароль и вход', en: 'Password & Login', kg: 'Пароль жана кирүү' },
      twoFA: { ru: 'Двухфакторная защита', en: 'Two-Factor Auth', kg: 'Эки факторлуу коргоо' },
      sessions: { ru: 'Активные сессии', en: 'Active Sessions', kg: 'Активдүү сессиялар' },
      history: { ru: 'История входов', en: 'Login History', kg: 'Кирүү тарыхы' },
      privacy: { ru: 'Конфиденциальность', en: 'Privacy', kg: 'Купуялык' },
      delete: { ru: 'Удаление аккаунта', en: 'Delete Account', kg: 'Аккаунтту өчүрүү' }
    },
    status: {
      active: { ru: 'Активно', en: 'Active', kg: 'Активдүү' },
      inactive: { ru: 'Не активно', en: 'Inactive', kg: 'Активдүү эмес' },
      current: { ru: 'Текущее', en: 'Current', kg: 'Учурдагы' },
      success: { ru: 'Успешно', en: 'Success', kg: 'Ийгиликтүү' },
      failed: { ru: 'Не удалось', en: 'Failed', kg: 'Ийгиликсиз' }
    }
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${themeClasses.page}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className={themeClasses.text.secondary}>Загрузка настроек безопасности...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-6 transition-colors duration-300 ${themeClasses.page}`}>
      {/* Хедер */}
      <div className="flex flex-col md:flex-row justify-between items-start mb-6">
        <div>
          <h1 className={`text-2xl font-bold mb-2 ${themeClasses.text.primary}`}>
            {pageText.title[language]}
          </h1>
          <p className={themeClasses.text.secondary}>
            {pageText.description[language]}
          </p>
        </div>
        
        {/* Скор безопасности */}
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <div className="relative w-20 h-20">
            <svg width="80" height="80" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="36" fill="none" stroke={themeClasses.score.circle} strokeWidth="8" />
              <circle 
                cx="40" cy="40" r="36" 
                fill="none" 
                stroke={themeClasses.score.fill} 
                strokeWidth="8" 
                strokeDasharray="226.2" 
                strokeDashoffset={226.2 - (226.2 * securityScore.score / 100)} 
                strokeLinecap="round"
                transform="rotate(-90 40 40)"
              />
              <text x="40" y="45" textAnchor="middle" fill={themeClasses.score.text} fontSize="20" fontWeight="bold">
                {securityScore.score}%
              </text>
            </svg>
          </div>
          <div>
            <p className={themeClasses.text.secondary}>{pageText.securityLevel[language]}</p>
            <p className={`text-lg font-semibold ${themeClasses.text.primary}`}>{securityScore.level}</p>
            {securityScore.issues?.length > 0 && (
              <p className="text-sm text-yellow-600">⚠️ {securityScore.issues.length} {pageText.issues[language]}</p>
            )}
          </div>
        </div>
      </div>

      {/* Основной контент */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Левая навигация */}
        <div className="lg:w-64">
          <div className={`p-4 rounded-xl border ${themeClasses.card}`}>
            <div className="flex items-center gap-2 mb-4 pb-2 border-b">
              <span className="text-2xl">🛡️</span>
              <h3 className={`font-semibold ${themeClasses.text.primary}`}>{pageText.securityCenter[language]}</h3>
            </div>
            <nav className="space-y-1">
              <button 
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  activeTab === 'password' 
                    ? themeClasses.nav.active 
                    : themeClasses.nav.item
                }`}
                onClick={() => setActiveTab('password')}
              >
                <span>🔐</span>
                <span className="flex-1 text-left">{pageText.tabs.password[language]}</span>
              </button>
              
              <button 
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  activeTab === '2fa' 
                    ? themeClasses.nav.active 
                    : themeClasses.nav.item
                }`}
                onClick={() => setActiveTab('2fa')}
              >
                <span>📱</span>
                <span className="flex-1 text-left">{pageText.tabs.twoFA[language]}</span>
                {!twoFactorEnabled && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${themeClasses.nav.badge.warning}`}>
                    {pageText.status.inactive[language]}
                  </span>
                )}
                {twoFactorEnabled && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${themeClasses.nav.badge.success}`}>
                    {pageText.status.active[language]}
                  </span>
                )}
              </button>
              
              <button 
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  activeTab === 'sessions' 
                    ? themeClasses.nav.active 
                    : themeClasses.nav.item
                }`}
                onClick={() => setActiveTab('sessions')}
              >
                <span>💻</span>
                <span className="flex-1 text-left">{pageText.tabs.sessions[language]}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${themeClasses.text.muted}`}>
                  {sessions.length}
                </span>
              </button>
              
              <button 
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  activeTab === 'history' 
                    ? themeClasses.nav.active 
                    : themeClasses.nav.item
                }`}
                onClick={() => setActiveTab('history')}
              >
                <span>📋</span>
                <span className="flex-1 text-left">{pageText.tabs.history[language]}</span>
              </button>
              
              <button 
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  activeTab === 'privacy' 
                    ? themeClasses.nav.active 
                    : themeClasses.nav.item
                }`}
                onClick={() => setActiveTab('privacy')}
              >
                <span>👁️</span>
                <span className="flex-1 text-left">{pageText.tabs.privacy[language]}</span>
              </button>
              
              <button 
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20`}
                onClick={() => setActiveTab('delete')}
              >
                <span>⚠️</span>
                <span className="flex-1 text-left">{pageText.tabs.delete[language]}</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Правый контент */}
        <div className="flex-1">
          {/* ПАРОЛЬ И ВХОД */}
          {activeTab === 'password' && (
            <div className={`p-6 rounded-xl border ${themeClasses.card}`}>
              <h2 className={`text-xl font-semibold mb-4 ${themeClasses.text.primary}`}>
                {pageText.tabs.password[language]}
              </h2>
              
              {!showPasswordForm ? (
                <div className="flex items-center justify-between">
                  <p className={themeClasses.text.primary}>••••••••••••</p>
                  <button 
                    onClick={() => setShowPasswordForm(true)}
                    className={`px-4 py-2 rounded-lg border ${themeClasses.button.outline}`}
                  >
                    Изменить пароль
                  </button>
                </div>
              ) : (
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <Input
                    type="password"
                    label="Текущий пароль"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                    className={themeClasses.input}
                    required
                  />
                  <Input
                    type="password"
                    label="Новый пароль"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                    className={themeClasses.input}
                    required
                  />
                  <Input
                    type="password"
                    label="Подтвердите пароль"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                    className={themeClasses.input}
                    required
                  />
                  <div className="flex gap-2">
                    <button type="submit" className={`px-4 py-2 rounded-lg ${themeClasses.button.primary}`}>
                      Сохранить
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setShowPasswordForm(false)}
                      className={`px-4 py-2 rounded-lg border ${themeClasses.button.outline}`}
                    >
                      Отмена
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* 2FA */}
          {activeTab === '2fa' && (
            <div className={`p-6 rounded-xl border ${themeClasses.card}`}>
              <h2 className={`text-xl font-semibold mb-4 ${themeClasses.text.primary}`}>
                {pageText.tabs.twoFA[language]}
              </h2>
              
              {!twoFactorEnabled ? (
                <>
                  {!showRecoveryCodes ? (
                    <>
                      <p className={`mb-4 ${themeClasses.text.secondary}`}>
                        Добавьте дополнительный уровень защиты вашего аккаунта
                      </p>
                      <button 
                        onClick={handleEnable2FA}
                        className={`px-4 py-2 rounded-lg ${themeClasses.button.primary}`}
                      >
                        Включить 2FA
                      </button>
                    </>
                  ) : (
                    <div className="space-y-6">
                      {qrCode && (
                        <div>
                          <h3 className={`font-medium mb-2 ${themeClasses.text.primary}`}>
                            1. Отсканируйте QR код
                          </h3>
                          <img src={qrCode} alt="2FA QR Code" className="mb-2" />
                          <p className={`text-sm ${themeClasses.text.secondary}`}>
                            Используйте Google Authenticator или аналогичное приложение
                          </p>
                        </div>
                      )}
                      
                      <div>
                        <h3 className={`font-medium mb-2 ${themeClasses.text.primary}`}>
                          2. Введите код из приложения
                        </h3>
                        <Input
                          value={twoFactorToken}
                          onChange={(e) => setTwoFactorToken(e.target.value)}
                          placeholder="000000"
                          className={themeClasses.input}
                        />
                        <button 
                          onClick={handleVerify2FA}
                          className={`mt-2 px-4 py-2 rounded-lg ${themeClasses.button.primary}`}
                        >
                          Подтвердить
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full ${themeClasses.nav.badge.success}`}>
                      ✅ 2FA включена
                    </span>
                    <button 
                      onClick={handleDisable2FA}
                      className={`px-4 py-2 rounded-lg border ${themeClasses.button.outline}`}
                    >
                      Отключить 2FA
                    </button>
                  </div>
                  
                  {recoveryCodes.length > 0 && (
                    <div>
                      <h3 className={`font-medium mb-2 ${themeClasses.text.primary}`}>
                        Резервные коды
                      </h3>
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        {recoveryCodes.map((code, index) => (
                          <div key={index} className={`flex items-center justify-between p-2 rounded border ${themeClasses.input}`}>
                            <code className="font-mono text-sm">{code}</code>
                            <button onClick={() => copyRecoveryCode(code)} className="text-gray-500 hover:text-gray-700">
                              📋
                            </button>
                          </div>
                        ))}
                      </div>
                      <button 
                        onClick={downloadRecoveryCodes}
                        className={`px-4 py-2 rounded-lg border ${themeClasses.button.outline}`}
                      >
                        Скачать коды
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* АКТИВНЫЕ СЕССИИ */}
          {activeTab === 'sessions' && (
            <div className={`p-6 rounded-xl border ${themeClasses.card}`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className={`text-xl font-semibold ${themeClasses.text.primary}`}>
                  {pageText.tabs.sessions[language]}
                </h2>
                <button 
                  onClick={handleLogoutAllDevices}
                  className={`px-4 py-2 rounded-lg border ${themeClasses.button.outline}`}
                >
                  Выйти из всех
                </button>
              </div>
              
              <div className="space-y-3">
                {sessions.map(session => (
                  <div 
                    key={session.id} 
                    className={`p-4 rounded-lg border ${
                      session.current ? themeClasses.session.current : themeClasses.session.normal
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={themeClasses.text.primary}>{session.device}</span>
                          {session.current && (
                            <span className={`text-xs px-2 py-0.5 rounded-full ${themeClasses.nav.badge.success}`}>
                              {pageText.status.current[language]}
                            </span>
                          )}
                        </div>
                        <div className="flex gap-3 text-sm">
                          <span className={themeClasses.text.muted}>📍 {session.location}</span>
                          <span className={themeClasses.text.muted}>⏱️ {session.lastActive}</span>
                        </div>
                      </div>
                      {!session.current && (
                        <button 
                          onClick={() => handleTerminateSession(session.id)}
                          className={`px-3 py-1 rounded-lg text-sm ${themeClasses.button.danger}`}
                        >
                          Завершить
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ИСТОРИЯ ВХОДОВ */}
          {activeTab === 'history' && (
            <div className={`p-6 rounded-xl border ${themeClasses.card}`}>
              <h2 className={`text-xl font-semibold mb-4 ${themeClasses.text.primary}`}>
                {pageText.tabs.history[language]}
              </h2>
              <div className="space-y-3">
                {loginHistory.map((login, index) => (
                  <div key={index} className={`p-3 rounded-lg border ${themeClasses.border}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={themeClasses.text.primary}>
                          {login.date} {login.time}
                        </p>
                        <p className={`text-sm ${themeClasses.text.muted}`}>
                          {login.device} • {login.location}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        login.status === 'success' 
                          ? themeClasses.nav.badge.success 
                          : themeClasses.nav.badge.warning
                      }`}>
                        {login.status === 'success' ? pageText.status.success[language] : pageText.status.failed[language]}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* КОНФИДЕНЦИАЛЬНОСТЬ */}
          {activeTab === 'privacy' && (
            <div className={`p-6 rounded-xl border ${themeClasses.card}`}>
              <h2 className={`text-xl font-semibold mb-4 ${themeClasses.text.primary}`}>
                {pageText.tabs.privacy[language]}
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b">
                  <div>
                    <h4 className={`font-medium ${themeClasses.text.primary}`}>Видимость профиля</h4>
                    <p className={`text-sm ${themeClasses.text.secondary}`}>
                      Кто может видеть вашу информацию
                    </p>
                  </div>
                  <select 
                    value={privacySettings.profileVisibility}
                    onChange={(e) => setPrivacySettings({...privacySettings, profileVisibility: e.target.value})}
                    className={`px-3 py-2 rounded-lg border ${themeClasses.input}`}
                  >
                    <option value="private">Только я</option>
                    <option value="farmers">Сотрудники</option>
                    <option value="public">Все</option>
                  </select>
                </div>
                
                <div className="flex items-center justify-between py-3 border-b">
                  <div>
                    <h4 className={`font-medium ${themeClasses.text.primary}`}>Показывать контактную информацию</h4>
                    <p className={`text-sm ${themeClasses.text.secondary}`}>
                      Телефон и email в профиле
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={privacySettings.showContactInfo}
                      onChange={(e) => setPrivacySettings({...privacySettings, showContactInfo: e.target.checked})}
                    />
                    <div className={`w-11 h-6 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${themeClasses.toggle.bg} peer-checked:bg-green-600`}></div>
                  </label>
                </div>
                
                <button 
                  onClick={handleUpdatePrivacy}
                  className={`px-4 py-2 rounded-lg ${themeClasses.button.primary}`}
                >
                  Сохранить настройки
                </button>
              </div>
            </div>
          )}

          {/* УДАЛЕНИЕ АККАУНТА */}
          {activeTab === 'delete' && (
            <div className={`p-6 rounded-xl border ${themeClasses.deleteCard}`}>
              <h2 className={`text-xl font-semibold mb-2 text-red-600`}>
                {pageText.tabs.delete[language]}
              </h2>
              <p className="text-red-600 mb-4">
                Это действие нельзя отменить. Все данные будут безвозвратно удалены.
              </p>
              
              <div className="space-y-4">
                <Input
                  type="password"
                  placeholder="Введите пароль"
                  value={deleteData.password}
                  onChange={(e) => setDeleteData({...deleteData, password: e.target.value})}
                  className={themeClasses.input}
                />
                <Input
                  placeholder="Введите DELETE для подтверждения"
                  value={deleteData.confirmation}
                  onChange={(e) => setDeleteData({...deleteData, confirmation: e.target.value})}
                  className={themeClasses.input}
                />
                
                <button 
                  onClick={handleDeleteAccount}
                  className={`px-4 py-2 rounded-lg ${themeClasses.button.danger}`}
                >
                  Удалить аккаунт
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Security;