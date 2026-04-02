// src/routes.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
// ✅ Импортируем MainLayout
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Fields from './pages/Fields';
import DiaryPage from './pages/DiaryPage';
import CalendarPage from './pages/CalendarPage';
import Analytics from './pages/Analytics';
import Reports from './pages/Reports';
import Forecasts from './pages/Forecasts';
import WorkPlan from './pages/WorkPlan';
import Crops from './pages/Crops';  
import Settings from './pages/Settings';
import ProfilePage from './pages/Profile';
import AIPage from './pages/AIPage';
import Animals from './pages/Animals';
import Resources from './pages/Resources';
import TaskForm from './pages/TaskForm';
import Equipment from './pages/Equipment';
import WeeklyTasks from './pages/WeeklyTasks';
import Employees from './pages/Employees';
import Suppliers from './pages/Suppliers';

// ✅ Импорты для страниц финансов
import Finance from './pages/Finance'; // редирект на overview
import FinanceOverview from './pages/finance/FinanceOverview';
import FinanceTransactions from './pages/finance/FinanceTransactions';
import FinanceBudget from './pages/finance/FinanceBudget';
import FinanceReports from './pages/finance/FinanceReports';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Landing from './pages/Landing';
import ForgotPassword from './pages/auth/ForgotPassword';

import { useAuth } from './hooks/useAuth';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/" />;
};

// Компонент для публичных маршрутов (редирект на дашборд если уже авторизован)
const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? <Navigate to="/dashboard" /> : children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* ✅ ПУБЛИЧНЫЕ МАРШРУТЫ (без MainLayout) */}

      <Route path="/forgot-password" element={
        <PublicRoute>
          <ForgotPassword />
          </PublicRoute>
      } /> {/* Добавить */}

      <Route path="/" element={
        <PublicRoute>
          <Landing />
        </PublicRoute>
      } />
      
      <Route path="/login" element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      } />
      
      <Route path="/register" element={
        <PublicRoute>
          <Register />
        </PublicRoute>
      } />
      
      {/* ✅ ПРИВАТНЫЕ МАРШРУТЫ (С MainLayout) */}
      <Route path="/dashboard" element={
        <PrivateRoute>
          <MainLayout>
            <Dashboard />
          </MainLayout>
        </PrivateRoute>
      } />
      
      <Route path="/fields" element={
        <PrivateRoute>
          <MainLayout>
            <Fields />
          </MainLayout>
        </PrivateRoute>
      } />
      
      <Route path="/diary" element={
        <PrivateRoute>
          <MainLayout>
            <DiaryPage />
          </MainLayout>
        </PrivateRoute>
      } />
      
      <Route path="/calendar" element={
        <PrivateRoute>
          <MainLayout>
            <CalendarPage />
          </MainLayout>
        </PrivateRoute>
      } />

      <Route path="/animals" element={
        <PrivateRoute>
          <MainLayout>
            <Animals />
          </MainLayout>
        </PrivateRoute>
      } />

      <Route path="/ai" element={
        <PrivateRoute>
          <MainLayout>
            <AIPage />
          </MainLayout>
        </PrivateRoute>
      } />
      
      <Route path="/analytics" element={
        <PrivateRoute>
          <MainLayout>
            <Analytics />
          </MainLayout>
        </PrivateRoute>
      } />

      <Route path="/reports" element={
        <PrivateRoute>
          <MainLayout>
            <Reports />
          </MainLayout>
        </PrivateRoute>
      } />

      <Route path="/forecasts" element={
        <PrivateRoute>
          <MainLayout>
            <Forecasts />
          </MainLayout>
        </PrivateRoute>
      } />

      <Route path="/work-plan" element={
        <PrivateRoute>
          <MainLayout>
            <WorkPlan />
          </MainLayout>
        </PrivateRoute>
      } />

      <Route path="/employees" element={
        <PrivateRoute>
          <MainLayout>
            <Employees />
          </MainLayout>
        </PrivateRoute>
      } />

      <Route path="/suppliers" element={
        <PrivateRoute>
          <MainLayout>
            <Suppliers />
          </MainLayout>
        </PrivateRoute>
      } />

      <Route path="/crops" element={
        <PrivateRoute>
          <MainLayout>
            <Crops />
          </MainLayout>
        </PrivateRoute>
      } />

      <Route path="/resources" element={
        <PrivateRoute>
          <MainLayout>
            <Resources />
          </MainLayout>
        </PrivateRoute>
      } />

      <Route path="/weekly-tasks" element={
        <PrivateRoute>
          <MainLayout>
            <WeeklyTasks />
          </MainLayout>
        </PrivateRoute>
      } />

      <Route path="/profile" element={
        <PrivateRoute>
          <MainLayout>
            <ProfilePage />
          </MainLayout>
        </PrivateRoute>
      } />
      
      <Route path="/settings" element={
        <PrivateRoute>
          <MainLayout>
            <Settings />
          </MainLayout>
        </PrivateRoute>
      } />

      <Route path="/tasks/new" element={
        <PrivateRoute>
          <MainLayout>
            <TaskForm />
          </MainLayout>
        </PrivateRoute>
      } />

      <Route path="/tasks/:id" element={
        <PrivateRoute>
          <MainLayout>
            <TaskForm />
          </MainLayout>
        </PrivateRoute>
      } />

      <Route path="/equipment" element={
        <PrivateRoute>
          <MainLayout>
            <Equipment />
          </MainLayout>
        </PrivateRoute>
      } />

      {/* ✅ МАРШРУТЫ ДЛЯ ФИНАНСОВ */}
      {/* Главная страница финансов (редирект на overview) */}
      <Route path="/finance" element={
        <PrivateRoute>
          <MainLayout>
            <Finance />
          </MainLayout>
        </PrivateRoute>
      } />
      
      {/* Обзор финансов */}
      <Route path="/finance/overview" element={
        <PrivateRoute>
          <MainLayout>
            <FinanceOverview />
          </MainLayout>
        </PrivateRoute>
      } />
      
      {/* Транзакции */}
      <Route path="/finance/transactions" element={
        <PrivateRoute>
          <MainLayout>
            <FinanceTransactions />
          </MainLayout>
        </PrivateRoute>
      } />
      
      {/* Бюджет */}
      <Route path="/finance/budget" element={
        <PrivateRoute>
          <MainLayout>
            <FinanceBudget />
          </MainLayout>
        </PrivateRoute>
      } />
      
      {/* Отчеты */}
      <Route path="/finance/reports" element={
        <PrivateRoute>
          <MainLayout>
            <FinanceReports />
          </MainLayout>
        </PrivateRoute>
      } />
      
      {/* ✅ 404 - редирект на главную */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;