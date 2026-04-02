// src/components/forms/LoginForm.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  LogIn, 
  Shield, 
  HardHat, 
  Eye, 
  EyeOff,
  UserPlus,
  Key
} from 'lucide-react';

const LoginForm = () => {
  const { theme } = useTheme();
  const { login } = useAuth();
  const navigate = useNavigate();

  // Состояния
  const [userType, setUserType] = useState('worker');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Классы для темы
  const themeClasses = {
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

  // Данные для демо-входа
  const users = {
    admin: {
      email: 'admin@farm.kg',
      password: 'Admin123456',
      role: 'admin'
    },
    worker: {
      email: 'fresh@example.com',
      password: 'Admin123456',
      role: 'worker'
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('🔵 Вход в систему');
      console.log('📧 Email:', email);
      console.log('👤 Выбранная роль:', userType);
      
      // Проверка соответствия роли
      if (email === users.admin.email && userType !== 'admin') {
        setError('Этот email принадлежит администратору. Пожалуйста, выберите роль "Администратор".');
        setLoading(false);
        return;
      }
      
      if (email === users.worker.email && userType !== 'worker') {
        setError('Этот email принадлежит работнику. Пожалуйста, выберите роль "Работник".');
        setLoading(false);
        return;
      }
      
      const result = await login(email, password, userType);
      
      if (result && result.success) {
        console.log('🎉 Успешный вход!');
        const user = result.user;
        user.role = userType;
        localStorage.setItem('agri_user', JSON.stringify(user));
        window.location.href = '/dashboard';
      } else {
        setError(result?.error || 'Ошибка входа');
      }
      
    } catch (err) {
      console.error('🔴 Ошибка:', err);
      setError('Неверный email или пароль');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoData = (type) => {
    setUserType(type);
    setEmail(users[type].email);
    setPassword(users[type].password);
  };

  return (
    <div className={`rounded-2xl shadow-2xl border overflow-hidden transition-colors duration-300 ${themeClasses.card}`}>
      {/* Шапка */}
      <div className="p-6 text-center border-b border-gray-200 dark:border-gray-700">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-600 to-green-700 rounded-xl shadow-xl mb-4">
          <LogIn size={32} className="text-white" />
        </div>
        <h2 className={`text-2xl font-bold ${themeClasses.text.primary}`}>
          Farm Vision
        </h2>
        <p className={`text-sm mt-1 ${themeClasses.text.secondary}`}>
          Вход в систему
        </p>
      </div>

      {/* ДВЕ КНОПКИ */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <p className={`text-sm text-center mb-4 ${themeClasses.text.secondary}`}>
          Выберите роль
        </p>
        
        <div className="grid grid-cols-2 gap-4">
          {/* Админ */}
          <button
            type="button"
            onClick={() => fillDemoData('admin')}
            className={`p-4 rounded-xl border-2 transition-all transform hover:scale-105 ${
              userType === 'admin'
                ? 'border-purple-500 bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg'
                : theme === 'dark'
                ? 'border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Shield size={28} className="mx-auto mb-2" />
            <span className="block font-bold">АДМИНИСТРАТОР</span>
            <span className="text-xs opacity-80">admin@farm.kg</span>
          </button>

          {/* Работник */}
          <button
            type="button"
            onClick={() => fillDemoData('worker')}
            className={`p-4 rounded-xl border-2 transition-all transform hover:scale-105 ${
              userType === 'worker'
                ? 'border-green-500 bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg'
                : theme === 'dark'
                ? 'border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <HardHat size={28} className="mx-auto mb-2" />
            <span className="block font-bold">РАБОТНИК</span>
            <span className="text-xs opacity-80">fresh@example.com</span>
          </button>
        </div>
      </div>

      {/* Форма входа */}
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Ошибка */}
          {error && (
            <div className={`p-3 rounded-lg text-sm ${
              theme === 'dark' 
                ? 'bg-red-900/30 text-red-300 border border-red-800' 
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {error}
            </div>
          )}

          {/* Email */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${themeClasses.text.secondary}`}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${themeClasses.input}`}
              placeholder="your@email.com"
            />
          </div>

          {/* Пароль */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${themeClasses.text.secondary}`}>
              Пароль
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors pr-12 ${themeClasses.input}`}
                placeholder="••••••••"
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
          </div>

          {/* Забыли пароль */}
          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-sm text-green-600 hover:text-green-700"
            >
              Забыли пароль?
            </Link>
          </div>

          {/* Кнопка входа */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-xl font-medium transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-2 shadow-lg ${
              userType === 'admin' 
                ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800' 
                : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800'
            } text-white`}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Вход...</span>
              </>
            ) : (
              <>
                <LogIn size={20} />
                <span>Войти</span>
              </>
            )}
          </button>

          {/* Ссылка на регистрацию */}
          <div className="text-center mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className={`text-sm ${themeClasses.text.secondary}`}>
              Нет аккаунта?{' '}
              <Link
                to="/register"
                className="text-green-600 hover:text-green-700 font-medium"
              >
                Зарегистрироваться
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;