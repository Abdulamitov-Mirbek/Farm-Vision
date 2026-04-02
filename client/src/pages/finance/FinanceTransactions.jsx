// src/pages/finance/FinanceTransactions.jsx
import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  Search, Filter, Download, Plus, Calendar,
  ArrowUpDown, ChevronLeft, ChevronRight,
  Eye, Edit, Trash2, CheckCircle, XCircle,
  Clock, TrendingUp, TrendingDown, FileText,
  Printer, Mail, MoreHorizontal
} from 'lucide-react';
import { Link } from 'react-router-dom';

const FinanceTransactions = () => {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [dateRange, setDateRange] = useState('month');
  const [selectedTransactions, setSelectedTransactions] = useState([]);

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
    },
    input: theme === 'dark'
      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
      : 'bg-white border-gray-300 text-gray-900',
    table: {
      header: theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50',
      row: theme === 'dark' ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50',
    }
  };

  // Переводы
  const translations = {
    title: {
      ru: 'Транзакции',
      en: 'Transactions',
      kg: 'Транзакциялар'
    },
    addTransaction: {
      ru: 'Добавить транзакцию',
      en: 'Add Transaction',
      kg: 'Транзакция кошуу'
    },
    export: {
      ru: 'Экспорт',
      en: 'Export',
      kg: 'Экспорт'
    },
    search: {
      ru: 'Поиск транзакций...',
      en: 'Search transactions...',
      kg: 'Транзакцияларды издөө...'
    },
    filter: {
      ru: 'Фильтр',
      en: 'Filter',
      kg: 'Фильтр'
    },
    all: {
      ru: 'Все',
      en: 'All',
      kg: 'Баары'
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
    date: {
      ru: 'Дата',
      en: 'Date',
      kg: 'Дата'
    },
    description: {
      ru: 'Описание',
      en: 'Description',
      kg: 'Сүрөттөө'
    },
    category: {
      ru: 'Категория',
      en: 'Category',
      kg: 'Категория'
    },
    amount: {
      ru: 'Сумма',
      en: 'Amount',
      kg: 'Сумма'
    },
    status: {
      ru: 'Статус',
      en: 'Status',
      kg: 'Статус'
    },
    actions: {
      ru: 'Действия',
      en: 'Actions',
      kg: 'Аракеттер'
    },
    completed: {
      ru: 'Завершено',
      en: 'Completed',
      kg: 'Аякталган'
    },
    pending: {
      ru: 'В ожидании',
      en: 'Pending',
      kg: 'Күтүүдө'
    },
    cancelled: {
      ru: 'Отменено',
      en: 'Cancelled',
      kg: 'Жокко чыгарылган'
    },
    thisWeek: {
      ru: 'Эта неделя',
      en: 'This week',
      kg: 'Бул апта'
    },
    thisMonth: {
      ru: 'Этот месяц',
      en: 'This month',
      kg: 'Бул ай'
    },
    thisYear: {
      ru: 'Этот год',
      en: 'This year',
      kg: 'Бул жыл'
    },
    custom: {
      ru: 'Свой период',
      en: 'Custom',
      kg: 'Өз мезгили'
    },
    previous: {
      ru: 'Предыдущая',
      en: 'Previous',
      kg: 'Мурунку'
    },
    next: {
      ru: 'Следующая',
      en: 'Next',
      kg: 'Кийинки'
    },
    showing: {
      ru: 'Показано',
      en: 'Showing',
      kg: 'Көрсөтүлдү'
    },
    to: {
      ru: 'по',
      en: 'to',
      kg: 'чейин'
    },
    of: {
      ru: 'из',
      en: 'of',
      kg: 'ичинен'
    },
    results: {
      ru: 'результатов',
      en: 'results',
      kg: 'жыйынтык'
    },
    bulkActions: {
      ru: 'Массовые действия',
      en: 'Bulk Actions',
      kg: 'Көпчүлүк аракеттер'
    },
    selectAll: {
      ru: 'Выбрать все',
      en: 'Select All',
      kg: 'Баарын тандоо'
    },
    delete: {
      ru: 'Удалить',
      en: 'Delete',
      kg: 'Өчүрүү'
    }
  };

  const t = (key) => translations[key]?.[language] || key;

  // Данные транзакций
  const transactions = [
    { 
      id: 1, 
      date: '2026-02-20', 
      description: 'Продажа пшеницы', 
      category: 'Продажи',
      amount: 450000, 
      type: 'income',
      status: 'completed',
      paymentMethod: 'Банковский перевод',
      reference: 'INV-2026-001'
    },
    { 
      id: 2, 
      date: '2026-02-19', 
      description: 'Покупка удобрений', 
      category: 'Материалы',
      amount: 125000, 
      type: 'expense',
      status: 'completed',
      paymentMethod: 'Наличные',
      reference: 'EXP-2026-045'
    },
    { 
      id: 3, 
      date: '2026-02-18', 
      description: 'Зарплата сотрудникам', 
      category: 'Зарплата',
      amount: 350000, 
      type: 'expense',
      status: 'pending',
      paymentMethod: 'Банковский перевод',
      reference: 'SAL-2026-012'
    },
    { 
      id: 4, 
      date: '2026-02-17', 
      description: 'Продажа яблок', 
      category: 'Продажи',
      amount: 280000, 
      type: 'income',
      status: 'completed',
      paymentMethod: 'Карта',
      reference: 'INV-2026-002'
    },
    { 
      id: 5, 
      date: '2026-02-16', 
      description: 'Ремонт техники', 
      category: 'Обслуживание',
      amount: 75000, 
      type: 'expense',
      status: 'completed',
      paymentMethod: 'Наличные',
      reference: 'EXP-2026-046'
    },
    { 
      id: 6, 
      date: '2026-02-15', 
      description: 'Продажа кукурузы', 
      category: 'Продажи',
      amount: 320000, 
      type: 'income',
      status: 'completed',
      paymentMethod: 'Банковский перевод',
      reference: 'INV-2026-003'
    },
    { 
      id: 7, 
      date: '2026-02-14', 
      description: 'Покупка семян', 
      category: 'Материалы',
      amount: 95000, 
      type: 'expense',
      status: 'completed',
      paymentMethod: 'Карта',
      reference: 'EXP-2026-047'
    },
    { 
      id: 8, 
      date: '2026-02-13', 
      description: 'Оплата электричества', 
      category: 'Коммунальные',
      amount: 45000, 
      type: 'expense',
      status: 'completed',
      paymentMethod: 'Автоплатеж',
      reference: 'UTL-2026-008'
    },
  ];

  // Фильтрация транзакций
  const filteredTransactions = transactions.filter(t => {
    if (filterType !== 'all' && t.type !== filterType) return false;
    if (searchQuery) {
      return t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
             t.category.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  // Пагинация
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Выбор всех транзакций
  const toggleSelectAll = () => {
    if (selectedTransactions.length === paginatedTransactions.length) {
      setSelectedTransactions([]);
    } else {
      setSelectedTransactions(paginatedTransactions.map(t => t.id));
    }
  };

  const toggleSelectTransaction = (id) => {
    if (selectedTransactions.includes(id)) {
      setSelectedTransactions(selectedTransactions.filter(tId => tId !== id));
    } else {
      setSelectedTransactions([...selectedTransactions, id]);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(language === 'ru' ? 'ru-RU' : 'en-US');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ru-RU').format(amount) + ' сом';
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'completed':
        return <span className={`px-2 py-1 text-xs font-medium rounded-full ${themeClasses.badge.success}`}>✓ {t('completed')}</span>;
      case 'pending':
        return <span className={`px-2 py-1 text-xs font-medium rounded-full ${themeClasses.badge.warning}`}>⏳ {t('pending')}</span>;
      case 'cancelled':
        return <span className={`px-2 py-1 text-xs font-medium rounded-full ${themeClasses.badge.danger}`}>✗ {t('cancelled')}</span>;
      default:
        return <span className={`px-2 py-1 text-xs font-medium rounded-full ${themeClasses.badge.info}`}>{status}</span>;
    }
  };

  return (
    <div className={`p-6 space-y-6 transition-colors duration-300 ${themeClasses.page}`}>
      {/* Заголовок */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className={`text-2xl font-bold ${themeClasses.text.primary}`}>{t('title')}</h1>
          <p className={`mt-1 ${themeClasses.text.secondary}`}>
            {language === 'ru' ? 'Управление доходами и расходами' :
             language === 'en' ? 'Manage income and expenses' :
             'Кирешелерди жана чыгашаларды башкаруу'}
          </p>
        </div>
        
        <div className="flex items-center gap-3 mt-4 md:mt-0">
          <Link
            to="/finance/transactions/new"
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${themeClasses.button.primary}`}
          >
            <Plus size={18} />
            {t('addTransaction')}
          </Link>
          
          <button className={`p-2 border rounded-lg ${themeClasses.button.secondary}`}>
            <Download size={18} />
          </button>
        </div>
      </div>

      {/* Фильтры и поиск */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('search')}
            className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${themeClasses.input}`}
          />
          <Search size={18} className="absolute left-3 top-3 text-gray-400" />
        </div>
        
        <div className="flex gap-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className={`px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${themeClasses.input}`}
          >
            <option value="all">{t('all')}</option>
            <option value="income">{t('income')}</option>
            <option value="expense">{t('expenses')}</option>
          </select>
          
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className={`px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${themeClasses.input}`}
          >
            <option value="week">{t('thisWeek')}</option>
            <option value="month">{t('thisMonth')}</option>
            <option value="year">{t('thisYear')}</option>
            <option value="custom">{t('custom')}</option>
          </select>
          
          <button className={`p-2 border rounded-lg ${themeClasses.button.secondary}`}>
            <Filter size={18} />
          </button>
          
          <button className={`p-2 border rounded-lg ${themeClasses.button.secondary}`}>
            <Calendar size={18} />
          </button>
        </div>
      </div>

      {/* Массовые действия */}
      {selectedTransactions.length > 0 && (
        <div className={`p-4 rounded-lg border flex items-center justify-between ${themeClasses.card}`}>
          <span className={`text-sm ${themeClasses.text.primary}`}>
            {t('selected')}: {selectedTransactions.length}
          </span>
          <div className="flex gap-2">
            <button className={`px-3 py-1 text-sm rounded-lg border ${themeClasses.button.secondary}`}>
              {t('delete')}
            </button>
            <button className={`px-3 py-1 text-sm rounded-lg border ${themeClasses.button.secondary}`}>
              {t('export')}
            </button>
          </div>
        </div>
      )}

      {/* Таблица транзакций */}
      <div className={`rounded-xl shadow-sm border overflow-hidden ${themeClasses.card}`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={themeClasses.table.header}>
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedTransactions.length === paginatedTransactions.length && paginatedTransactions.length > 0}
                    onChange={toggleSelectAll}
                    className="h-4 w-4 text-green-600 rounded border-gray-300"
                  />
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase ${themeClasses.text.secondary}`}>
                  <div className="flex items-center gap-1 cursor-pointer">
                    {t('date')}
                    <ArrowUpDown size={14} />
                  </div>
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase ${themeClasses.text.secondary}`}>
                  {t('description')}
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase ${themeClasses.text.secondary}`}>
                  {t('category')}
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase ${themeClasses.text.secondary}`}>
                  {t('amount')}
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase ${themeClasses.text.secondary}`}>
                  {t('status')}
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase ${themeClasses.text.secondary}`}>
                  {t('actions')}
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y ${themeClasses.border}`}>
              {paginatedTransactions.map((transaction) => (
                <tr key={transaction.id} className={themeClasses.table.row}>
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedTransactions.includes(transaction.id)}
                      onChange={() => toggleSelectTransaction(transaction.id)}
                      className="h-4 w-4 text-green-600 rounded border-gray-300"
                    />
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${themeClasses.text.secondary}`}>
                    {formatDate(transaction.date)}
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className={`text-sm font-medium ${themeClasses.text.primary}`}>
                        {transaction.description}
                      </p>
                      <p className={`text-xs ${themeClasses.text.muted}`}>
                        {transaction.reference}
                      </p>
                    </div>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${themeClasses.text.secondary}`}>
                    {transaction.category}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(transaction.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button className={`p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-600 ${themeClasses.text.secondary}`}>
                        <Eye size={16} />
                      </button>
                      <button className={`p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-600 ${themeClasses.text.secondary}`}>
                        <Edit size={16} />
                      </button>
                      <button className={`p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-600 text-red-600`}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Пагинация */}
        <div className={`px-6 py-4 border-t flex items-center justify-between ${themeClasses.border}`}>
          <p className={`text-sm ${themeClasses.text.secondary}`}>
            {t('showing')} {(currentPage - 1) * itemsPerPage + 1} {t('to')}{' '}
            {Math.min(currentPage * itemsPerPage, filteredTransactions.length)} {t('of')}{' '}
            {filteredTransactions.length} {t('results')}
          </p>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={`p-2 border rounded-lg ${themeClasses.button.secondary} disabled:opacity-50`}
            >
              <ChevronLeft size={18} />
            </button>
            
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded-lg ${
                  currentPage === i + 1
                    ? 'bg-green-600 text-white'
                    : themeClasses.button.secondary
                }`}
              >
                {i + 1}
              </button>
            ))}
            
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={`p-2 border rounded-lg ${themeClasses.button.secondary} disabled:opacity-50`}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Сводка */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`p-4 rounded-xl border ${themeClasses.card}`}>
          <p className={`text-sm ${themeClasses.text.secondary}`}>Всего доходов</p>
          <p className={`text-xl font-bold text-green-600`}>
            {formatCurrency(transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0))}
          </p>
        </div>
        
        <div className={`p-4 rounded-xl border ${themeClasses.card}`}>
          <p className={`text-sm ${themeClasses.text.secondary}`}>Всего расходов</p>
          <p className={`text-xl font-bold text-red-600`}>
            {formatCurrency(transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0))}
          </p>
        </div>
        
        <div className={`p-4 rounded-xl border ${themeClasses.card}`}>
          <p className={`text-sm ${themeClasses.text.secondary}`}>Баланс</p>
          <p className={`text-xl font-bold text-blue-600`}>
            {formatCurrency(
              transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0) -
              transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FinanceTransactions;