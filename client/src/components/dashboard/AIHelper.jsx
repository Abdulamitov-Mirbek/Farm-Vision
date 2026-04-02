import React, { useState } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import { aiAPI } from '../../services/api/aiAPI';

const AIHelper = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      text: 'Привет! Я ваш AI-помощник в сельском хозяйстве. Чем могу помочь?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);

  const quickActions = [
    {
      id: 1,
      title: 'Рекомендации по удобрениям',
      description: 'Получить рекомендации по внесению удобрений',
      icon: '🧪',
      query: 'Какие удобрения нужно внести сейчас на поле с пшеницей?'
    },
    {
      id: 2,
      title: 'Прогноз урожая',
      description: 'Оценить прогноз урожайности',
      icon: '📊',
      query: 'Сделай прогноз урожайности пшеницы на текущий сезон'
    },
    {
      id: 3,
      title: 'Проблемы с растениями',
      description: 'Диагностировать проблемы с растениями',
      icon: '🔍',
      query: 'Листья пшеницы желтеют, что делать?'
    },
    {
      id: 4,
      title: 'План работ',
      description: 'Составить план работ на неделю',
      icon: '📋',
      query: 'Составь план работ на полях на следующую неделю'
    }
  ];

  const sendMessage = async (text) => {
    if (!text.trim()) return;

    // Добавляем сообщение пользователя
    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      text: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Имитация ответа AI
      setTimeout(() => {
        const responses = [
          "На основании анализа данных ваших полей, рекомендую увеличить полив на 15% в утренние часы. Температурные условия благоприятны для роста культур.",
          "Ваши поля находятся в хорошем состоянии. Рекомендую провести профилактическую обработку от вредителей в течение 3-5 дней.",
          "По данным метеопрогноза, на следующей неделе ожидается дождь. Рекомендую отложить внесение удобрений до улучшения погоды.",
          "Урожайность пшеницы на поле №3 может быть увеличена на 8-12% при своевременной подкормке азотными удобрениями.",
          "Обнаружены признаки недостатка влаги на южном поле. Рекомендую увеличить поливную норму на 20%."
        ];

        const aiResponse = {
          id: messages.length + 2,
          type: 'ai',
          text: responses[Math.floor(Math.random() * responses.length)],
          timestamp: new Date(),
          recommendations: [
            "Проверьте уровень влажности почвы",
            "Запланируйте подкормку на следующую неделю",
            "Подготовьте отчет по затратам"
          ]
        };

        setMessages(prev => [...prev, aiResponse]);
        setLoading(false);
      }, 1000);

    } catch (error) {
      console.error('Error sending message:', error);
      setLoading(false);
    }
  };

  const handleQuickAction = (query) => {
    setShowQuickActions(false);
    sendMessage(query);
  };

  const clearChat = () => {
    setMessages([{
      id: 1,
      type: 'ai',
      text: 'Привет! Я ваш AI-помощник в сельском хозяйстве. Чем могу помочь?',
      timestamp: new Date()
    }]);
    setShowQuickActions(true);
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">AI-Помощник</h2>
          <p className="text-sm text-gray-600 mt-1">
            Получайте рекомендации по ведению сельского хозяйства
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="small" onClick={clearChat}>
            Очистить чат
          </Button>
        </div>
      </div>

      {/* Чат */}
      <div className="h-96 overflow-y-auto mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
        {showQuickActions ? (
          <div>
            <div className="text-center mb-6">
              <div className="text-5xl mb-3">🤖</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">AI-Ассистент для фермера</h3>
              <p className="text-gray-600">Задайте вопрос или выберите быстрый запрос</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {quickActions.map(action => (
                <button
                  key={action.id}
                  onClick={() => handleQuickAction(action.query)}
                  className="p-4 bg-white border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-sm transition-all duration-200 text-left"
                >
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-3">{action.icon}</span>
                    <h4 className="font-medium text-gray-900">{action.title}</h4>
                  </div>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-3/4 rounded-2xl p-4 ${
                    message.type === 'user'
                      ? 'bg-primary-600 text-white rounded-tr-none'
                      : 'bg-white border border-gray-200 rounded-tl-none'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  
                  {message.recommendations && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-xs font-medium text-gray-700 mb-2">Рекомендации:</p>
                      <ul className="space-y-1">
                        {message.recommendations.map((rec, index) => (
                          <li key={index} className="text-xs text-gray-600 flex items-center">
                            <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className={`text-xs mt-2 ${
                    message.type === 'user' ? 'text-primary-200' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString('ru-RU', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-none p-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse delay-150"></div>
                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse delay-300"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Форма ввода */}
      <div className="flex space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage(input)}
          placeholder="Задайте вопрос AI-помощнику..."
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all duration-200"
          disabled={loading}
        />
        
        <Button
          onClick={() => sendMessage(input)}
          disabled={loading || !input.trim()}
          className="px-6"
        >
          {loading ? '...' : 'Отправить'}
        </Button>
      </div>

      {/* Примеры запросов */}
      <div className="mt-4">
        <p className="text-sm text-gray-600 mb-2">Примеры запросов:</p>
        <div className="flex flex-wrap gap-2">
          {[
            "Когда лучше сажать кукурузу?",
            "Как бороться с сорняками?",
            "Расчет затрат на удобрения",
            "Оптимальный график полива"
          ].map((example, index) => (
            <button
              key={index}
              onClick={() => {
                setInput(example);
                setShowQuickActions(false);
              }}
              className="text-xs px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
            >
              {example}
            </button>
          ))}
        </div>
      </div>

      {/* Статистика AI */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary-600">92%</p>
            <p className="text-xs text-gray-600">Точность рекомендаций</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-primary-600">24/7</p>
            <p className="text-xs text-gray-600">Доступность помощника</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-primary-600">15+</p>
            <p className="text-xs text-gray-600">Специализаций</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AIHelper;