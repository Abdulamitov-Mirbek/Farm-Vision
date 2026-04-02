// server/routes/huggingface-proxy.js
const express = require('express');
const router = express.Router();
const Groq = require('groq-sdk');
const axios = require('axios'); // Добавлено в начало

// ========== ДИАГНОСТИКА GROQ ==========
console.log('\n========== ДИАГНОСТИКА GROQ ==========');
console.log('GROQ_API_KEY существует?', !!process.env.GROQ_API_KEY);
console.log('Первые символы ключа:', process.env.GROQ_API_KEY ? process.env.GROQ_API_KEY.substring(0, 10) + '...' : 'не найден');
console.log('Тип ключа:', typeof process.env.GROQ_API_KEY);
console.log('=======================================\n');

// Инициализация Groq (только если есть ключ)
let groq;
if (process.env.GROQ_API_KEY) {
  try {
    groq = new Groq({
      apiKey: process.env.GROQ_API_KEY
    });
    console.log('✅ Groq SDK инициализирован');
  } catch (error) {
    console.error('❌ Ошибка инициализации Groq SDK:', error.message);
  }
} else {
  console.log('⚠️ Groq SDK не инициализирован (нет ключа)');
}

// POST запрос для чата с Groq
router.post('/chat', async (req, res) => {
  try {
    console.log('\n✅ Получен POST запрос:');
    console.log('Тело запроса:', req.body);
    
    const { message, language = 'ru' } = req.body;
    
    // Проверяем наличие ключа
    if (!process.env.GROQ_API_KEY) {
      console.log('❌ Ключ не найден в .env');
      return res.json({
        success: true,
        message: getLocalResponse(message, language),
        local: true,
        timestamp: new Date().toISOString()
      });
    }
    
    console.log('🔑 Ключ найден, отправляю запрос к Groq...');
    
    // Используем актуальную модель
    const model = 'llama-3.3-70b-versatile'; // ✅ РАБОЧАЯ МОДЕЛЬ!
    
    // Системный промпт на нужном языке
    const systemPrompts = {
        ru: 'Ты - Farm Culture, полезный AI-ассистент, специализирующийся на сельском хозяйстве, но способный отвечать на любые вопросы. Отвечай дружелюбно и подробно.',
        en: 'You are Farm Culture, a helpful AI assistant specializing in agriculture but capable of answering any questions. Answer friendly and in detail.',
        kg: 'Сен - Farm Culture, пайдалуу AI-жардамчы, айыл чарбага адистешкен, бирок каалаган суроолорго жооп бере аласың. Достук мамиледе жана толук жооп бер.'
        };
    
    // Отправляем запрос к Groq API
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: model,
        messages: [
          { 
            role: 'system', 
            content: systemPrompts[language] || systemPrompts.ru
          },
          { 
            role: 'user', 
            content: message 
          }
        ],
        temperature: 0.8,
        max_tokens: 2048,
        top_p: 0.95
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 15000 // 15 секунд таймаут
      }
    );
    
    console.log('✅ УСПЕХ! Статус ответа:', response.status);
    console.log('Ответ от Groq получен, длина:', response.data.choices[0].message.content.length);
    
    // Возвращаем ответ клиенту
    res.json({
      success: true,
      message: response.data.choices[0].message.content,
      model: model,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.log('\n❌ ОШИБКА ПРИ ЗАПРОСЕ К GROQ:');
    
    if (error.response) {
      // Ошибка от самого API
      console.log('Статус ошибки:', error.response.status);
      console.log('Данные ошибки:', JSON.stringify(error.response.data, null, 2));
      
      // Если модель устарела, предложим обновить
      if (error.response.data?.error?.code === 'model_decommissioned') {
        console.log('⚠️ Модель устарела, используйте: llama-3.3-70b-versatile');
      }
    } else if (error.request) {
      // Запрос был отправлен, но ответ не получен
      console.log('Нет ответа от сервера Groq');
      console.log('Ошибка:', error.message);
    } else {
      // Ошибка при настройке запроса
      console.log('Ошибка при настройке запроса:', error.message);
    }
    
    // Возвращаем локальный ответ
    res.json({
      success: true,
      message: getLocalResponse(req.body.message, req.body.language),
      local: true,
      timestamp: new Date().toISOString()
    });
  }
});

// Локальные ответы (запасной вариант)
function getLocalResponse(message, language = 'ru') {
  const lowerMsg = message.toLowerCase();
  
  const responses = {
    ru: {
      hello: '👋 Привет! Я FarmAI. Сейчас я в локальном режиме, но могу ответить на вопросы о сельском хозяйстве. Что вас интересует?',
      weather: '☀️ Сегодня хорошая погода для работы в поле!',
      agriculture: '🌾 Я могу помочь с посевом, поливом, удобрениями и болезнями растений.',
      default: '🌱 Я в локальном режиме. Спросите о посеве, поливе, удобрениях или болезнях растений.'
    },
    en: {
      hello: '👋 Hi! I\'m FarmAI. I\'m in local mode, but I can answer agriculture questions. What interests you?',
      weather: '☀️ Good weather for field work today!',
      agriculture: '🌾 I can help with sowing, irrigation, fertilizers and plant diseases.',
      default: '🌱 I\'m in local mode. Ask about sowing, irrigation, fertilizers or plant diseases.'
    },
    kg: {
      hello: '👋 Салам! Мен FarmAI. Жергиликтүү режимде, бирок айыл чарба суроолоруна жооп бере алам. Эмне кызыктырат?',
      weather: '☀️ Бүгүн талаа иштерине ыңгайлуу аба ырайы!',
      agriculture: '🌾 Мен себүү, сугаруу, жер семирткичтер жана өсүмдүк оорулары боюнча жардам бере алам.',
      default: '🌱 Мен жергиликтүү режимде. Себүү, сугаруу, жер семирткичтер же өсүмдүк оорулары жөнүндө сураңыз.'
    }
  };
  
  const r = responses[language] || responses.ru;
  
  if (lowerMsg.includes('привет') || lowerMsg.includes('hello') || lowerMsg.includes('салам')) {
    return r.hello;
  }
  if (lowerMsg.includes('погод') || lowerMsg.includes('weather') || lowerMsg.includes('аба')) {
    return r.weather;
  }
  if (lowerMsg.includes('чем') || lowerMsg.includes('what can') || lowerMsg.includes('эмне')) {
    return r.agriculture;
  }
  
  return r.default;
}

// GET запрос для проверки
router.get('/chat', (req, res) => {
  res.json({
    success: true,
    message: '✅ Используйте POST для отправки сообщений. FarmAI готов к работе!',
    models: ['llama-3.3-70b-versatile'],
    groqKeyPresent: !!process.env.GROQ_API_KEY,
    timestamp: new Date().toISOString()
  });
});

// Тестовый маршрут
router.get('/test', (req, res) => {
  res.json({ 
    success: true, 
    message: '✅ Сервер FarmAI работает!',
    groqKeyPresent: !!process.env.GROQ_API_KEY,
    timestamp: new Date().toISOString()
  });
});

module.exports = router;