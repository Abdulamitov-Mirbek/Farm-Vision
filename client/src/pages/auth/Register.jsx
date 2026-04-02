// src/pages/auth/Register.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import RegistrationForm from '../../components/forms/RegistrationForm';

const Register = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-600 to-emerald-600 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full">
        <RegistrationForm />
      </div>
    </div>
  );
};

export default Register;