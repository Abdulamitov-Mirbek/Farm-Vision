// client/src/pages/Settings/Integrations.jsx
import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import './Integrations.css';

const Integrations = () => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('available');
  const [searchTerm, setSearchTerm] = useState('');

  const [integrations, setIntegrations] = useState({
    weather: { connected: true, name: 'OpenWeatherMap', status: 'active', lastSync: '5 мин назад' },
    maps: { connected: true, name: 'Google Maps', status: 'active', lastSync: '2 часа назад' },
    telegram: { connected: false, name: 'Telegram Bot', status: 'inactive' },
    whatsapp: { connected: false, name: 'WhatsApp Business', status: 'inactive' },
    '1c': { connected: false, name: '1С Бухгалтерия', status: 'inactive' },
    bank: { connected: false, name: 'Банк.kg', status: 'inactive' }
  });

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
      : 'bg-white border-gray-200 text-gray-900',
    button: {
      primary: 'bg-green-600 hover:bg-green-700 text-white',
      outline: theme === 'dark'
        ? 'border-gray-600 hover:bg-gray-700 text-gray-300'
        : 'border-gray-200 hover:bg-gray-50 text-gray-700',
      secondary: theme === 'dark'
        ? 'bg-gray-700 hover:bg-gray-600 text-gray-300 border-gray-600'
        : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300',
      danger: theme === 'dark'
        ? 'bg-red-600 hover:bg-red-700 text-white'
        : 'bg-red-600 hover:bg-red-700 text-white',
    },
    badge: {
      popular: theme === 'dark'
        ? 'bg-purple-900/30 text-purple-400 border border-purple-800'
        : 'bg-purple-100 text-purple-700 border border-purple-200',
      active: theme === 'dark'
        ? 'bg-green-900/30 text-green-400 border border-green-800'
        : 'bg-green-100 text-green-700 border border-green-200',
      development: theme === 'dark'
        ? 'bg-blue-900/30 text-blue-400 border border-blue-800'
        : 'bg-blue-100 text-blue-700 border border-blue-200',
      soon: theme === 'dark'
        ? 'bg-orange-900/30 text-orange-400 border border-orange-800'
        : 'bg-orange-100 text-orange-700 border border-orange-200',
    },
    tab: {
      active: theme === 'dark'
        ? 'bg-gray-700 text-green-400 border-b-2 border-green-400'
        : 'bg-white text-green-600 border-b-2 border-green-600',
      inactive: theme === 'dark'
        ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700'
        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100',
    },
  };

  const availableIntegrations = [ /* ... ваш массив ... */ ];

  const connectedIntegrations = [
    {
      id: 'weather',
      name: 'OpenWeatherMap',
      icon: '🌤️',
      description: 'Прогноз погоды, температура, осадки',
      status: 'active',
      lastSync: '5 минут назад',
      apiKey: '••••••••••••••••'
    },
    {
      id: 'maps',
      name: 'Google Maps',
      icon: '🗺️',
      description: 'Карты полей, спутниковые снимки',
      status: 'active',
      lastSync: '2 часа назад',
      apiKey: '••••••••••••••••'
    }
  ];

  const handleConnect = (id) => {
    setIntegrations(prev => ({
      ...prev,
      [id]: { ...prev[id], connected: true, status: 'active', lastSync: 'только что' }
    }));
  };

  const handleDisconnect = (id) => {
    if (window.confirm(`Отключить интеграцию ${integrations[id]?.name || id}?`)) {
      setIntegrations(prev => ({
        ...prev,
        [id]: { ...prev[id], connected: false, status: 'inactive' }
      }));
    }
  };

  const filteredIntegrations = availableIntegrations.filter(
    i => i.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
         i.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`min-h-screen p-6 transition-colors duration-300 ${themeClasses.page}`}>
      <div className="mb-6">
        <h1 className={`text-2xl font-bold mb-2 ${themeClasses.text.primary}`}>
          Интеграции
        </h1>
        <p className={themeClasses.text.secondary}>
          Подключите внешние сервисы для расширения возможностей Farm Vision
        </p>
      </div>

      {/* Табы */}
      <div className="flex gap-2 mb-6 border-b pb-2">
        <button 
          className={`px-4 py-2 rounded-t-lg transition-colors ${
            activeTab === 'available' 
              ? themeClasses.tab.active 
              : themeClasses.tab.inactive
          }`}
          onClick={() => setActiveTab('available')}
        >
          📦 Доступные интеграции
        </button>
        <button 
          className={`px-4 py-2 rounded-t-lg transition-colors ${
            activeTab === 'connected' 
              ? themeClasses.tab.active 
              : themeClasses.tab.inactive
          }`}
          onClick={() => setActiveTab('connected')}
        >
          🔌 Подключенные ({connectedIntegrations.length + Object.values(integrations).filter(i => i.connected).length})
        </button>
        <button 
          className={`px-4 py-2 rounded-t-lg transition-colors ${
            activeTab === 'marketplace' 
              ? themeClasses.tab.active 
              : themeClasses.tab.inactive
          }`}
          onClick={() => setActiveTab('marketplace')}
        >
          🛒 Маркетплейс
        </button>
      </div>

      {/* Поиск */}
      {activeTab === 'available' && (
        <div className="mb-6">
          <input
            type="text"
            placeholder="🔍 Поиск интеграций..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full max-w-md px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${themeClasses.input}`}
          />
        </div>
      )}

      {/* Контент */}
      <div className="space-y-8">
        {activeTab === 'available' && (
          <>
            {/* Популярные */}
            <div>
              <h2 className={`text-xl font-semibold mb-4 ${themeClasses.text.primary}`}>
                ⭐ Популярные
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredIntegrations
                  .filter(i => i.popular)
                  .map(integration => (
                    <div key={integration.id} className={`p-6 border rounded-xl transition-all hover:shadow-lg ${themeClasses.card}`}>
                      <div className="flex flex-col h-full">
                        <div className="flex items-start justify-between mb-4">
                          <span className="text-4xl">{integration.icon}</span>
                          <span className={`px-2 py-1 text-xs rounded-full ${themeClasses.badge.popular}`}>
                            🔥 Популярное
                          </span>
                        </div>
                        <div className="flex-1">
                          <h3 className={`text-lg font-semibold mb-2 ${themeClasses.text.primary}`}>
                            {integration.name}
                          </h3>
                          <p className={`text-sm mb-4 ${themeClasses.text.secondary}`}>
                            {integration.description}
                          </p>
                        </div>
                        <button 
                          className={`w-full py-2 rounded-lg transition-colors ${themeClasses.button.primary}`}
                          onClick={() => handleConnect(integration.id)}
                        >
                          Подключить
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Остальные категории аналогично... */}
          </>
        )}

        {activeTab === 'connected' && (
          <div className="space-y-8">
            {/* Активные интеграции */}
            <div>
              <h2 className={`text-xl font-semibold mb-4 ${themeClasses.text.primary}`}>
                ✅ Активные интеграции
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {connectedIntegrations.map(integration => (
                  <div key={integration.id} className={`p-6 border rounded-xl ${themeClasses.card}`}>
                    <div className="flex flex-col h-full">
                      <div className="flex items-start justify-between mb-4">
                        <span className="text-4xl">{integration.icon}</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${themeClasses.badge.active}`}>
                          ● Работает
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className={`text-lg font-semibold mb-2 ${themeClasses.text.primary}`}>
                          {integration.name}
                        </h3>
                        <p className={`text-sm mb-3 ${themeClasses.text.secondary}`}>
                          {integration.description}
                        </p>
                        <div className="space-y-1 mb-4">
                          <p className={`text-xs ${themeClasses.text.muted}`}>
                            ⏱ Последняя синхронизация: {integration.lastSync}
                          </p>
                          <p className={`text-xs ${themeClasses.text.muted}`}>
                            🔑 API Key: {integration.apiKey}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className={`flex-1 py-2 rounded-lg transition-colors ${themeClasses.button.outline}`}>
                          ⚙️ Настроить
                        </button>
                        <button 
                          className={`flex-1 py-2 rounded-lg transition-colors ${themeClasses.button.danger}`}
                          onClick={() => handleDisconnect(integration.id)}
                        >
                          Отключить
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'marketplace' && (
          <div className="space-y-8">
            {/* Баннер */}
            <div className={`p-6 border rounded-xl ${themeClasses.card}`}>
              <div className="flex items-center gap-6">
                <span className="text-5xl">🛍️</span>
                <div className="flex-1">
                  <h2 className={`text-xl font-semibold mb-2 ${themeClasses.text.primary}`}>
                    Farm Vision Marketplace
                  </h2>
                  <p className={themeClasses.text.secondary}>
                    Скоро здесь появятся платные интеграции от партнеров
                  </p>
                </div>
                <button className={`px-6 py-2 rounded-lg opacity-50 cursor-not-allowed ${themeClasses.button.primary}`} disabled>
                  Скоро
                </button>
              </div>
            </div>

            {/* Карточки маркетплейса */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: '📡', name: 'Спутниковый мониторинг', desc: 'NDVI, анализ вегетации', price: '$29/мес', badge: 'Pre-order' },
                { icon: '🤖', name: 'AI Агроном', desc: 'Распознавание болезней', price: '$49/мес', badge: 'Beta' },
                { icon: '🚜', name: 'John Deere API', desc: 'Интеграция с техникой', price: '$99/мес', badge: '2026' }
              ].map((item, idx) => (
                <div key={idx} className={`p-6 border rounded-xl text-center ${themeClasses.card}`}>
                  <span className={`inline-block px-2 py-1 text-xs rounded-full mb-4 ${themeClasses.badge.soon}`}>
                    {item.badge}
                  </span>
                  <div className="text-5xl mb-4">{item.icon}</div>
                  <h3 className={`text-lg font-semibold mb-2 ${themeClasses.text.primary}`}>
                    {item.name}
                  </h3>
                  <p className={`text-sm mb-4 ${themeClasses.text.secondary}`}>
                    {item.desc}
                  </p>
                  <div className={`text-xl font-bold mb-4 ${themeClasses.text.primary}`}>
                    {item.price}
                  </div>
                  <button className={`w-full py-2 rounded-lg opacity-50 cursor-not-allowed ${themeClasses.button.outline}`} disabled>
                    Скоро
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Integrations;