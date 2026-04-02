// client/src/pages/Settings/Payment.jsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import './Payment.css';

const Payment = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [copied, setCopied] = useState(false);
  
  const cardNumber = '41** **** **** **61';
  const whatsappNumber = '+996777389866';
  
  const [paymentHistory] = useState([
    {
      id: 1,
      date: '01.02.2026',
      amount: '2 990 soms',
      status: 'Оплачено'
    },
    {
      id: 2,
      date: '01.01.2026',
      amount: '2 990 soms',
      status: 'Оплачено'
    }
  ]);

  // ✅ Классы для Tailwind темы (как в Advanced.jsx)
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
    badge: {
      premium: theme === 'dark'
        ? 'bg-purple-900/30 text-purple-400 border border-purple-800'
        : 'bg-purple-100 text-purple-700 border border-purple-200',
      success: theme === 'dark'
        ? 'bg-green-900/30 text-green-400 border border-green-800'
        : 'bg-green-100 text-green-700 border border-green-200',
    },
    button: {
      primary: theme === 'dark'
        ? 'bg-green-600 hover:bg-green-700 text-white'
        : 'bg-green-600 hover:bg-green-700 text-white',
      copy: theme === 'dark'
        ? 'bg-gray-700 hover:bg-gray-600 text-gray-300 border-gray-600'
        : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300',
    },
    table: {
      header: theme === 'dark' ? 'text-gray-400 border-gray-700' : 'text-gray-600 border-gray-200',
      row: theme === 'dark' ? 'border-gray-700 hover:bg-gray-700/50' : 'border-gray-200 hover:bg-gray-50',
      cell: theme === 'dark' ? 'text-gray-300' : 'text-gray-700',
    },
    detailRow: theme === 'dark'
      ? 'border-gray-700 bg-gray-700/20'
      : 'border-gray-200 bg-gray-50',
  };

  const copyCardNumber = () => {
    navigator.clipboard.writeText(cardNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openWhatsApp = () => {
    window.open(`https://wa.me/${whatsappNumber}?text=Здравствуйте!%20Я%20оплатил(а)%20подписку.%20Чек%20прикрепляю.`, '_blank');
  };

  return (
    <div className={`min-h-screen p-6 transition-colors duration-300 ${themeClasses.page}`}>
      <div className="mb-6">
        <h1 className={`text-2xl font-bold mb-2 ${themeClasses.text.primary}`}>
          Оплата и подписка
        </h1>
        <p className={themeClasses.text.secondary}>
          Управление тарифным планом и способами оплаты
        </p>
      </div>

      <div className="space-y-6">
        {/* Текущий тариф */}
        <div className={`p-6 rounded-xl border ${themeClasses.card}`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-xl font-semibold ${themeClasses.text.primary}`}>
              Текущий тариф
            </h2>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${themeClasses.badge.premium}`}>
              Премиум
            </span>
          </div>
          
          <div className="mb-4">
            <span className={`text-3xl font-bold ${themeClasses.text.primary}`}>2 990 som</span>
            <span className={themeClasses.text.secondary}>/месяц</span>
          </div>
          
          <ul className="space-y-2">
            {[
              'Неограниченное количество полей',
              'Прогноз погоды на 14 дней',
              'AI-ассистент',
              'Аналитика и отчеты'
            ].map((feature, index) => (
              <li key={index} className={`flex items-center gap-2 ${themeClasses.text.secondary}`}>
                <span className="text-green-500">✓</span>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Оплата на карту */}
        <div className={`p-6 rounded-xl border ${themeClasses.card}`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-xl font-semibold ${themeClasses.text.primary}`}>
              Оплата на карту
            </h2>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${themeClasses.badge.success}`}>
              Комиссия: 0%
            </span>
          </div>
          
          <div className="space-y-4">
            {/* Номер карты */}
            <div className={`p-4 rounded-lg border flex items-center justify-between ${themeClasses.detailRow}`}>
              <span className={`font-medium ${themeClasses.text.secondary}`}>
                Номер карты:
              </span>
              <div className="flex items-center gap-3">
                <span className={`font-mono text-lg ${themeClasses.text.primary}`}>
                  {cardNumber}
                </span>
                <button 
                  className={`px-3 py-1 rounded-lg border text-sm transition-all ${
                    copied 
                      ? 'bg-green-600 text-white border-green-600' 
                      : themeClasses.button.copy
                  }`}
                  onClick={copyCardNumber}
                >
                  {copied ? '✓ Скопировано' : 'Копировать'}
                </button>
              </div>
            </div>

            {/* Получатель */}
            <div className={`p-4 rounded-lg border flex items-center justify-between ${themeClasses.detailRow}`}>
              <span className={`font-medium ${themeClasses.text.secondary}`}>
                Получатель:
              </span>
              <span className={themeClasses.text.primary}>ИП Mirbek A.</span>
            </div>

            {/* Банк */}
            <div className={`p-4 rounded-lg border flex items-center justify-between ${themeClasses.detailRow}`}>
              <span className={`font-medium ${themeClasses.text.secondary}`}>
                Банк:
              </span>
              <span className={themeClasses.text.primary}>MBANK</span>
            </div>

            {/* Суммы для оплаты */}
            <div className={`p-4 rounded-lg border ${themeClasses.detailRow}`}>
              <p className={`font-medium mb-3 ${themeClasses.text.primary}`}>
                Суммы для оплаты:
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  '2 990 som - 1 месяц',
                  '8 090 som - 3 месяца',
                  '14 990 som - 6 месяцев'
                ].map((amount, index) => (
                  <button 
                    key={index}
                    className={`px-4 py-2 rounded-lg border transition-colors ${
                      theme === 'dark'
                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-300 border-gray-600'
                        : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-200'
                    }`}
                  >
                    {amount}
                  </button>
                ))}
              </div>
            </div>

            {/* Инструкция */}
            <div className={`p-4 rounded-lg border ${themeClasses.detailRow}`}>
              <h4 className={`font-semibold mb-2 ${themeClasses.text.primary}`}>
                📌 Инструкция:
              </h4>
              <ol className={`list-decimal list-inside space-y-1 ${themeClasses.text.secondary}`}>
                <li>Скопируйте номер карты</li>
                <li>Переведите нужную сумму в любом банковском приложении</li>
                <li>Нажмите кнопку "Я оплатил" и отправьте чек</li>
              </ol>
            </div>

            {/* Кнопка WhatsApp */}
            <button
              className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
              onClick={openWhatsApp}
            >
              📱 Я оплатил - отправить чек
            </button>

            <p className={`text-sm text-center ${themeClasses.text.muted}`}>
              ⏱ Подписка активируется в течение 5-10 минут после подтверждения оплаты
            </p>
          </div>
        </div>

        {/* История платежей */}
        <div className={`p-6 rounded-xl border ${themeClasses.card}`}>
          <h2 className={`text-xl font-semibold mb-4 ${themeClasses.text.primary}`}>
            История платежей
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${themeClasses.table.header}`}>
                  <th className="text-left py-3 px-4 font-medium">Дата</th>
                  <th className="text-left py-3 px-4 font-medium">Сумма</th>
                  <th className="text-left py-3 px-4 font-medium">Статус</th>
                  <th className="text-left py-3 px-4 font-medium">Чек</th>
                </tr>
              </thead>
              <tbody>
                {paymentHistory.map((payment) => (
                  <tr 
                    key={payment.id} 
                    className={`border-b transition-colors ${themeClasses.table.row}`}
                  >
                    <td className={`py-3 px-4 ${themeClasses.table.cell}`}>{payment.date}</td>
                    <td className={`py-3 px-4 ${themeClasses.table.cell}`}>{payment.amount}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        theme === 'dark'
                          ? 'bg-green-900/30 text-green-400'
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button className="text-green-600 hover:text-green-700 font-medium">
                        📄 Скачать
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;