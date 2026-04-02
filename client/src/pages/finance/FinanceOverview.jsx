// src/pages/finance/FinanceOverview.jsx
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  DollarSign, TrendingUp, TrendingDown, Calendar,
  Download, Filter, Plus, CreditCard, Landmark,
  Wallet, PiggyBank, Receipt, ArrowUpRight, ArrowDownRight,
  MoreHorizontal, ChevronDown, FileText, BarChart3,
  PieChart, LineChart, Coins, Percent, Clock,
  CheckCircle, AlertCircle, RefreshCw, Search,
  ArrowRight, Eye
} from 'lucide-react';
import { Link } from 'react-router-dom';

const FinanceOverview = () => {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const [period, setPeriod] = useState('month');
  const [loading, setLoading] = useState(false);

  const themeClasses = {
    page: theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50',
    card: theme === 'dark' 
      ? 'bg-gray-800 border-gray-700' 
      : 'bg-white border-gray-100',
    text: {
      primary: theme === 'dark' ? 'text-white' : 'text-gray-900',
      secondary: theme === 'dark' ? 'text-gray-400' : 'text-gray-600',
      muted: theme === 'dark' ? 'text-gray-500' : 'text-gray-400',
    },
    button: {
      primary: 'bg-green-600 hover:bg-green-700 text-white',
      secondary: theme === 'dark'
        ? 'border-gray-700 hover:bg-gray-700 text-gray-300'
        : 'border-gray-200 hover:bg-gray-50 text-gray-600',
    },
    border: theme === 'dark' ? 'border-gray-700' : 'border-gray-200',
    badge: {
      success: theme === 'dark' ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700',
      warning: theme === 'dark' ? 'bg-yellow-900/30 text-yellow-400' : 'bg-yellow-100 text-yellow-700',
      danger: theme === 'dark' ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-700',
      info: theme === 'dark' ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-700',
    }
  };

  // Переводы
  const translations = {
    title: {
      ru: 'Обзор финансов',
      en: 'Finance Overview',
      kg: 'Каржы обзору'
    },
    income: {
      ru: 'Доходы',
      en: 'Income',
      kg: 'Киреше'
    },
    expenses: {
      ru: 'Расходы',
      en: 'Expenses',
      kg: 'Чыгаша'
    },
    profit: {
      ru: 'Прибыль',
      en: 'Profit',
      kg: 'Киреше'
    },
    transactions: {
      ru: 'Последние транзакции',
      en: 'Recent Transactions',
      kg: 'Акыркы транзакциялар'
    },
    allTransactions: {
      ru: 'Все транзакции',
      en: 'All Transactions',
      kg: 'Бардык транзакциялар'
    },
    budget: {
      ru: 'Бюджет',
      en: 'Budget',
      kg: 'Бюджет'
    },
    reports: {
      ru: 'Отчеты',
      en: 'Reports',
      kg: 'Отчеттор'
    },
    view: {
      ru: 'Просмотр',
      en: 'View',
      kg: 'Көрүү'
    },
    period: {
      ru: 'Период',
      en: 'Period',
      kg: 'Мезгил'
    },
    week: {
      ru: 'Неделя',
      en: 'Week',
      kg: 'Апта'
    },
    month: {
      ru: 'Месяц',
      en: 'Month',
      kg: 'Ай'
    },
    quarter: {
      ru: 'Квартал',
      en: 'Quarter',
      kg: 'Квартал'
    },
    year: {
      ru: 'Год',
      en: 'Year',
      kg: 'Жыл'
    },
    totalIncome: {
      ru: 'Общий доход',
      en: 'Total Income',
      kg: 'Жалпы киреше'
    },
    totalExpenses: {
      ru: 'Общие расходы',
      en: 'Total Expenses',
      kg: 'Жалпы чыгаша'
    },
    netProfit: {
      ru: 'Чистая прибыль',
      en: 'Net Profit',
      kg: 'Таза киреше'
    },
    taxes: {
      ru: 'Налоги',
      en: 'Taxes',
      kg: 'Салыктар'
    }
  };

  const t = (key) => translations[key]?.[language] || key;

  // Статистика
  const stats = [
    {
      title: t('totalIncome'),
      value: '2,456,789',
      change: '+12.5%',
      trend: 'up',
      icon: TrendingUp,
      color: 'green',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      textColor: 'text-green-600 dark:text-green-400'
    },
    {
      title: t('totalExpenses'),
      value: '1,234,567',
      change: '+5.2%',
      trend: 'up',
      icon: TrendingDown,
      color: 'red',
      bgColor: 'bg-red-100 dark:bg-red-900/30',
      textColor: 'text-red-600 dark:text-red-400'
    },
    {
      title: t('netProfit'),
      value: '1,222,222',
      change: '+18.3%',
      trend: 'up',
      icon: DollarSign,
      color: 'blue',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      textColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      title: t('taxes'),
      value: '98,765',
      change: '-2.1%',
      trend: 'down',
      icon: Percent,
      color: 'purple',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
      textColor: 'text-purple-600 dark:text-purple-400'
    }
  ];

  // Последние транзакции
  const recentTransactions = [
    { id: 1, date: '20.02.2026', description: 'Продажа пшеницы', category: 'Доход', amount: '+450,000', type: 'income', status: 'completed' },
    { id: 2, date: '19.02.2026', description: 'Покупка удобрений', category: 'Расход', amount: '-125,000', type: 'expense', status: 'completed' },
    { id: 3, date: '18.02.2026', description: 'Зарплата сотрудникам', category: 'Расход', amount: '-350,000', type: 'expense', status: 'pending' },
    { id: 4, date: '17.02.2026', description: 'Продажа яблок', category: 'Доход', amount: '+280,000', type: 'income', status: 'completed' },
    { id: 5, date: '16.02.2026', description: 'Ремонт техники', category: 'Расход', amount: '-75,000', type: 'expense', status: 'completed' },
  ];

  // Быстрые действия
  const quickActions = [
    { title: 'Добавить доход', icon: TrendingUp, color: 'green', link: '/finance/transactions?type=income' },
    { title: 'Добавить расход', icon: TrendingDown, color: 'red', link: '/finance/transactions?type=expense' },
    { title: 'Создать отчет', icon: FileText, color: 'blue', link: '/finance/reports/new' },
    { title: 'Планировать бюджет', icon: Calendar, color: 'purple', link: '/finance/budget/plan' },
  ];

  return (
    <div className={`p-6 space-y-6 transition-colors duration-300 ${themeClasses.page}`}>
      {/* Заголовок */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className={`text-2xl font-bold ${themeClasses.text.primary}`}>{t('title')}</h1>
          <p className={`mt-1 ${themeClasses.text.secondary}`}>
            {language === 'ru' ? 'Управление финансами вашего хозяйства' :
             language === 'en' ? 'Manage your farm finances' :
             'Чарбаңыздын каржысын башкаруу'}
          </p>
        </div>
        
        <div className="flex items-center gap-3 mt-4 md:mt-0">
          <div className={`flex items-center rounded-lg border p-1 ${themeClasses.card}`}>
            {['week', 'month', 'quarter', 'year'].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  period === p
                    ? 'bg-green-600 text-white'
                    : themeClasses.text.secondary + ' hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {t(p)}
              </button>
            ))}
          </div>
          
          <button className={`p-2 border rounded-lg ${themeClasses.button.secondary}`}>
            <Download size={18} />
          </button>
        </div>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className={`p-6 rounded-xl shadow-sm border ${themeClasses.card}`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
              </div>
              <span className={`text-sm font-medium px-2 py-1 rounded ${stat.bgColor} ${stat.textColor}`}>
                {stat.change}
              </span>
            </div>
            <p className={`text-sm ${themeClasses.text.secondary}`}>{stat.title}</p>
            <p className={`text-2xl font-bold ${themeClasses.text.primary}`}>{stat.value} сом</p>
          </div>
        ))}
      </div>

      {/* Быстрые действия */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickActions.map((action, idx) => (
          <Link
            key={idx}
            to={action.link}
            className={`p-4 rounded-xl border hover:shadow-md transition-all ${themeClasses.card}`}
          >
            <div className={`p-2 rounded-lg w-fit mb-3 bg-${action.color}-100 dark:bg-${action.color}-900/30`}>
              <action.icon className={`w-5 h-5 text-${action.color}-600 dark:text-${action.color}-400`} />
            </div>
            <p className={`text-sm font-medium ${themeClasses.text.primary}`}>{action.title}</p>
          </Link>
        ))}
      </div>

      {/* Последние транзакции */}
      <div className={`rounded-xl shadow-sm border ${themeClasses.card}`}>
        <div className={`p-6 border-b flex justify-between items-center ${themeClasses.border}`}>
          <h2 className={`text-lg font-semibold ${themeClasses.text.primary}`}>{t('transactions')}</h2>
          <Link
            to="/finance/transactions"
            className={`text-sm flex items-center gap-1 ${themeClasses.text.secondary} hover:text-green-600`}
          >
            {t('allTransactions')}
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}>
              <tr>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase ${themeClasses.text.secondary}`}>Дата</th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase ${themeClasses.text.secondary}`}>Описание</th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase ${themeClasses.text.secondary}`}>Категория</th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase ${themeClasses.text.secondary}`}>Сумма</th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase ${themeClasses.text.secondary}`}>Статус</th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase ${themeClasses.text.secondary}`}>Действия</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${themeClasses.border}`}>
              {recentTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${themeClasses.text.secondary}`}>
                    {transaction.date}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${themeClasses.text.primary}`}>
                    {transaction.description}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${themeClasses.text.secondary}`}>
                    {transaction.category}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.amount} сом
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      transaction.status === 'completed'
                        ? themeClasses.badge.success
                        : themeClasses.badge.warning
                    }`}>
                      {transaction.status === 'completed' ? 'Завершено' : 'В обработке'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button className={`p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-600 ${themeClasses.text.secondary}`}>
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Бюджет и отчеты */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Текущий бюджет */}
        <div className={`p-6 rounded-xl shadow-sm border ${themeClasses.card}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`font-semibold ${themeClasses.text.primary}`}>{t('budget')}</h3>
            <Link
              to="/finance/budget"
              className={`text-xs flex items-center gap-1 ${themeClasses.text.secondary} hover:text-green-600`}
            >
              {t('view')}
              <ArrowRight size={12} />
            </Link>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className={themeClasses.text.secondary}>Запланировано</span>
                <span className={`font-medium ${themeClasses.text.primary}`}>3,500,000 сом</span>
              </div>
              <div className="flex justify-between text-sm mb-1">
                <span className={themeClasses.text.secondary}>Потрачено</span>
                <span className="font-medium text-red-600">1,850,000 сом</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '53%' }}></div>
              </div>
              <p className={`text-xs mt-2 ${themeClasses.text.muted}`}>53% от бюджета</p>
            </div>
          </div>
        </div>

        {/* Последние отчеты */}
        <div className={`p-6 rounded-xl shadow-sm border ${themeClasses.card}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`font-semibold ${themeClasses.text.primary}`}>{t('reports')}</h3>
            <Link
              to="/finance/reports"
              className={`text-xs flex items-center gap-1 ${themeClasses.text.secondary} hover:text-green-600`}
            >
              {t('view')}
              <ArrowRight size={12} />
            </Link>
          </div>
          
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                <div className="flex items-center gap-3">
                  <FileText size={16} className={themeClasses.text.secondary} />
                  <div>
                    <p className={`text-sm font-medium ${themeClasses.text.primary}`}>
                      Отчет за {i === 1 ? 'февраль' : i === 2 ? 'январь' : 'декабрь'}
                    </p>
                    <p className={`text-xs ${themeClasses.text.muted}`}>2026</p>
                  </div>
                </div>
                <button className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600`}>
                  <Download size={14} className={themeClasses.text.secondary} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceOverview;