// src/pages/auth/Login.jsx
import React from 'react';
import LoginForm from '../../components/forms/LoginForm';
import { useTheme } from '../../contexts/ThemeContext';

const Login = () => {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen flex items-center justify-center ${
      theme === 'dark'
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-green-900'
        : 'bg-gradient-to-br from-green-600 to-emerald-600'
    } py-12 px-4 transition-colors duration-300`}>
      <div className="max-w-md w-full">
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;