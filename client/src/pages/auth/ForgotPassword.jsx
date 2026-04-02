// src/pages/auth/ForgotPassword.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { 
  Mail, 
  ArrowLeft, 
  CheckCircle, 
  AlertCircle, 
  Key, 
  Lock, 
  Eye, 
  EyeOff,
  Send,
  RefreshCw
} from 'lucide-react';
import { authAPI } from '../../services/api/authAPI';

const ForgotPassword = () => {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  // Состояния для форм
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Состояния для процесса
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [step, setStep] = useState('request'); // 'request' или 'reset'
  const [resetToken, setResetToken] = useState('');
  const [countdown, setCountdown] = useState(0);

  // Проверяем наличие токена в URL при загрузке
  useEffect(() => {
    if (token) {
      setResetToken(token);
      setStep('reset');
      verifyToken(token);
    }
  }, [token]);

  // Таймер для повторной отправки
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Классы для темы
  const themeClasses = {
    page: theme === 'dark'
      ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-green-900'
      : 'bg-gradient-to-br from-green-600 to-emerald-600',
    card: theme === 'dark'
      ? 'bg-gray-800 border-gray-700'
      : 'bg-white/90 backdrop-blur-sm border-gray-200',
    input: theme === 'dark'
      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500',
    text: {
      primary: theme === 'dark' ? 'text-white' : 'text-gray-900',
      secondary: theme === 'dark' ? 'text-gray-400' : 'text-gray-600',
    },
  };

  // Проверка валидности токена
  const verifyToken = async (token) => {
    try {
      setLoading(true);
      const response = await authAPI.verifyResetToken(token);
      
      if (response.data && response.data.success) {
        console.log('✅ Токен валиден');
        setSuccess('Токен подтвержден. Введите новый пароль.');
      } else {
        setError('Недействительная или истекшая ссылка для сброса пароля');
        setTimeout(() => {
          setStep('request');
        }, 3000);
      }
    } catch (err) {
      console.error('❌ Ошибка проверки токена:', err);
      setError(err.response?.data?.message || 'Недействительная ссылка для сброса пароля');
      setTimeout(() => {
        setStep('request');
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  // Запрос на сброс пароля
  const handleRequestReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Валидация email
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError('Пожалуйста, введите корректный email адрес');
      setLoading(false);
      return;
    }

    try {
      console.log('📤 Запрос на сброс пароля для:', email);
      
      const response = await authAPI.forgotPassword(email);
      
      if (response.data && response.data.success) {
        setSuccess('Инструкции по восстановлению пароля отправлены на ваш email');
        setCountdown(60); // Запускаем таймер на 60 секунд
        
        // Если сервер возвращает токен (для разработки)
        if (response.data.resetToken) {
          console.log('🔑 Токен для сброса:', response.data.resetToken);
          // Для тестирования можно показать токен
          if (process.env.NODE_ENV === 'development') {
            setSuccess(`Инструкции отправлены. Токен для теста: ${response.data.resetToken}`);
          }
        }
      } else {
        setError(response.data?.message || 'Ошибка при отправке запроса');
      }
      
    } catch (err) {
      console.error('🔴 Ошибка:', err);
      
      // Обработка различных ошибок
      if (err.response?.status === 404) {
        setError('Пользователь с таким email не найден');
      } else if (err.response?.status === 429) {
        setError('Слишком много запросов. Попробуйте позже.');
      } else {
        setError(err.response?.data?.message || 'Ошибка при отправке запроса');
      }
    } finally {
      setLoading(false);
    }
  };

  // Сброс пароля
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Валидация пароля
    if (newPassword.length < 6) {
      setError('Пароль должен содержать минимум 6 символов');
      setLoading(false);
      return;
    }

    if (!/[A-Z]/.test(newPassword)) {
      setError('Пароль должен содержать хотя бы одну заглавную букву');
      setLoading(false);
      return;
    }

    if (!/[0-9]/.test(newPassword)) {
      setError('Пароль должен содержать хотя бы одну цифру');
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Пароли не совпадают');
      setLoading(false);
      return;
    }

    if (!resetToken) {
      setError('Отсутствует токен для сброса пароля');
      setLoading(false);
      return;
    }

    try {
      console.log('📤 Сброс пароля с токеном:', resetToken);
      
      const response = await authAPI.resetPassword(resetToken, newPassword);
      
      if (response.data && response.data.success) {
        setSuccess('Пароль успешно изменен! Перенаправление на страницу входа...');
        
        // Очищаем форму
        setNewPassword('');
        setConfirmPassword('');
        
        // Перенаправляем на страницу входа через 2 секунды
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(response.data?.message || 'Ошибка при сбросе пароля');
      }
      
    } catch (err) {
      console.error('🔴 Ошибка:', err);
      
      if (err.response?.status === 400) {
        setError('Недействительный или истекший токен');
      } else if (err.response?.status === 422) {
        setError('Пароль не соответствует требованиям безопасности');
      } else {
        setError(err.response?.data?.message || 'Ошибка при сбросе пароля');
      }
    } finally {
      setLoading(false);
    }
  };

  // Повторная отправка запроса
  const handleResend = async () => {
    if (countdown > 0) return;
    
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await authAPI.forgotPassword(email);
      
      if (response.data && response.data.success) {
        setSuccess('Инструкции повторно отправлены на ваш email');
        setCountdown(60);
      }
    } catch (err) {
      setError('Ошибка при повторной отправке');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${themeClasses.page}`}>
      <div className="w-full max-w-md">
        {/* Карточка */}
        <div className={`rounded-2xl shadow-2xl border overflow-hidden transition-colors duration-300 ${themeClasses.card}`}>
          {/* Шапка */}
          <div className="p-6 text-center border-b border-gray-200 dark:border-gray-700">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-600 to-green-700 rounded-xl shadow-xl mb-4">
              {step === 'request' ? (
                <Mail size={32} className="text-white" />
              ) : (
                <Key size={32} className="text-white" />
              )}
            </div>
            <h2 className={`text-2xl font-bold ${themeClasses.text.primary}`}>
              Farm Vision
            </h2>
            <p className={`text-sm mt-1 ${themeClasses.text.secondary}`}>
              {step === 'request' 
                ? (language === 'ru' ? 'Восстановление пароля' : 
                   language === 'en' ? 'Password Recovery' : 
                   'Сырсөздү калыбына келтирүү')
                : (language === 'ru' ? 'Сброс пароля' : 
                   language === 'en' ? 'Reset Password' : 
                   'Сырсөздү өзгөртүү')}
            </p>
          </div>

          {/* Форма запроса */}
          {step === 'request' && (
            <div className="p-6">
              <p className={`text-sm text-center mb-6 ${themeClasses.text.secondary}`}>
                {language === 'ru' 
                  ? 'Введите ваш email, и мы отправим инструкции по восстановлению пароля'
                  : language === 'en'
                  ? 'Enter your email and we will send you password recovery instructions'
                  : 'Электрондук почтаңызды жазыңыз, биз сизге сырсөздү калыбына келтирүү инструкциясын жөнөтөбүз'}
              </p>

              {/* Сообщения */}
              {error && (
                <div className={`mb-4 p-3 rounded-lg text-sm flex items-center ${
                  theme === 'dark' 
                    ? 'bg-red-900/30 text-red-300 border border-red-800' 
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                  <AlertCircle size={16} className="mr-2 flex-shrink-0" />
                  {error}
                </div>
              )}

              {success && (
                <div className={`mb-4 p-3 rounded-lg text-sm flex items-center ${
                  theme === 'dark' 
                    ? 'bg-green-900/30 text-green-300 border border-green-800' 
                    : 'bg-green-50 text-green-800 border border-green-200'
                }`}>
                  <CheckCircle size={16} className="mr-2 flex-shrink-0" />
                  {success}
                </div>
              )}

              <form onSubmit={handleRequestReset} className="space-y-4">
                {/* Email */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${themeClasses.text.secondary}`}>
                    {language === 'ru' ? 'Email' : 
                     language === 'en' ? 'Email' : 
                     'Электрондук почта'}
                  </label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${themeClasses.input}`}
                      placeholder="your@email.com"
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Кнопка отправки */}
                <button
                  type="submit"
                  disabled={loading || countdown > 0}
                  className="w-full py-3 px-4 rounded-xl font-medium transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-2 shadow-lg bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>
                        {language === 'ru' ? 'Отправка...' :
                         language === 'en' ? 'Sending...' :
                         'Жөнөтүү...'}
                      </span>
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      <span>
                        {language === 'ru' ? 'Отправить инструкции' :
                         language === 'en' ? 'Send instructions' :
                         'Инструкция жөнөтүү'}
                      </span>
                    </>
                  )}
                </button>

                {/* Кнопка повторной отправки */}
                {countdown > 0 && (
                  <div className="text-center">
                    <button
                      type="button"
                      disabled
                      className="text-sm text-gray-400"
                    >
                      {language === 'ru' 
                        ? `Повторная отправка через ${countdown} сек`
                        : language === 'en'
                        ? `Resend in ${countdown} sec`
                        : `${countdown} секунддан кийин кайра жөнөтүү`}
                    </button>
                  </div>
                )}

                {/* Ссылка назад */}
                <div className="text-center mt-4">
                  <Link
                    to="/login"
                    className="text-sm text-green-600 hover:text-green-700 flex items-center justify-center"
                  >
                    <ArrowLeft size={16} className="mr-1" />
                    {language === 'ru' ? 'Вернуться ко входу' :
                     language === 'en' ? 'Back to login' :
                     'Кирүүгө кайтуу'}
                  </Link>
                </div>
              </form>
            </div>
          )}

          {/* Форма сброса пароля */}
          {step === 'reset' && (
            <div className="p-6">
              <p className={`text-sm text-center mb-6 ${themeClasses.text.secondary}`}>
                {language === 'ru' 
                  ? 'Введите новый пароль'
                  : language === 'en'
                  ? 'Enter your new password'
                  : 'Жаңы сырсөздү жазыңыз'}
              </p>

              {/* Сообщения */}
              {error && (
                <div className={`mb-4 p-3 rounded-lg text-sm flex items-center ${
                  theme === 'dark' 
                    ? 'bg-red-900/30 text-red-300 border border-red-800' 
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                  <AlertCircle size={16} className="mr-2 flex-shrink-0" />
                  {error}
                </div>
              )}

              {success && (
                <div className={`mb-4 p-3 rounded-lg text-sm flex items-center ${
                  theme === 'dark' 
                    ? 'bg-green-900/30 text-green-300 border border-green-800' 
                    : 'bg-green-50 text-green-800 border border-green-200'
                }`}>
                  <CheckCircle size={16} className="mr-2 flex-shrink-0" />
                  {success}
                </div>
              )}

              <form onSubmit={handleResetPassword} className="space-y-4">
                {/* Новый пароль */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${themeClasses.text.secondary}`}>
                    {language === 'ru' ? 'Новый пароль' :
                     language === 'en' ? 'New password' :
                     'Жаңы сырсөз'}
                  </label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      minLength={6}
                      className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${themeClasses.input}`}
                      placeholder={language === 'ru' ? 'Минимум 6 символов' :
                                 language === 'en' ? 'Minimum 6 characters' :
                                 '6 символдон кем эмес'}
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-lg ${
                        theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <p className={`text-xs mt-1 ${themeClasses.text.secondary}`}>
                    {language === 'ru' 
                      ? 'Пароль должен содержать минимум 6 символов, заглавную букву и цифру'
                      : language === 'en'
                      ? 'Password must be at least 6 characters, contain uppercase letter and number'
                      : 'Сырсөз 6 символдон кем эмес, баш тамга жана сан камтышы керек'}
                  </p>
                </div>

                {/* Подтверждение пароля */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${themeClasses.text.secondary}`}>
                    {language === 'ru' ? 'Подтвердите пароль' :
                     language === 'en' ? 'Confirm password' :
                     'Сырсөздү ырастоо'}
                  </label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${themeClasses.input}`}
                      placeholder="••••••••"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-lg ${
                        theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Кнопка сброса */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-xl font-medium transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-2 shadow-lg bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>
                        {language === 'ru' ? 'Сброс...' :
                         language === 'en' ? 'Resetting...' :
                         'Өзгөртүү...'}
                      </span>
                    </>
                  ) : (
                    <>
                      <RefreshCw size={20} />
                      <span>
                        {language === 'ru' ? 'Сбросить пароль' :
                         language === 'en' ? 'Reset password' :
                         'Сырсөздү өзгөртүү'}
                      </span>
                    </>
                  )}
                </button>

                {/* Ссылка назад */}
                <div className="text-center mt-4">
                  <Link
                    to="/login"
                    className="text-sm text-green-600 hover:text-green-700 flex items-center justify-center"
                  >
                    <ArrowLeft size={16} className="mr-1" />
                    {language === 'ru' ? 'Вернуться ко входу' :
                     language === 'en' ? 'Back to login' :
                     'Кирүүгө кайтуу'}
                  </Link>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className={`text-center text-sm mt-6 ${themeClasses.text.secondary}`}>
          © 2024 Farm Vision. {language === 'ru' ? 'Все права защищены' :
                               language === 'en' ? 'All rights reserved' :
                               'Бардык укуктар корголгон'}
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;