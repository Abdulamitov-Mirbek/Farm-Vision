// controllers/aiController.js
const aiService = require('../services/aiService');
const OpenAI = require('openai');

// Инициализация DeepSeek (или другого API)
const deepseek = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com/v1'
});

// ===========================================
// СУЩЕСТВУЮЩИЕ ФЕРМЕРСКИЕ ФУНКЦИИ
// ===========================================

exports.getAdvice = async (req, res) => {
  try {
    const { question, context, options } = req.body;
    
    const advice = await aiService.getAdvice(question, context, req.user._id);
    
    res.json({
      success: true,
      ...advice
    });
  } catch (error) {
    console.error('Ошибка получения совета AI:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка получения рекомендаций от AI.'
    });
  }
};

exports.getDailyTips = async (req, res) => {
  try {
    const tips = await aiService.getDailyTips(req.user._id);
    
    res.json({
      success: true,
      ...tips
    });
  } catch (error) {
    console.error('Ошибка получения советов:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка получения ежедневных советов.'
    });
  }
};

// Diagnose plant issues
exports.diagnosePlant = async (req, res) => {
    try {
        console.log('⚠️ AI Service: Using mock data for plant diagnosis');
        
        const { imageUrl, symptoms, plantType } = req.body;
        
        // Mock diagnosis response
        res.json({
            success: true,
            diagnosis: {
                issue: symptoms || 'Nutrient deficiency suspected',
                confidence: 78,
                possibleCauses: [
                    'Nitrogen deficiency',
                    'Overwatering',
                    'Poor soil drainage'
                ],
                recommendations: [
                    'Apply balanced fertilizer',
                    'Reduce watering frequency',
                    'Improve soil aeration'
                ],
                treatment: {
                    immediate: 'Apply liquid fertilizer',
                    shortTerm: 'Adjust watering schedule',
                    longTerm: 'Test soil composition'
                }
            },
            imageAnalyzed: !!imageUrl,
            plantType: plantType || 'Unknown',
            timestamp: new Date().toISOString(),
            note: 'Mock diagnosis - no AI model connected'
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
};

// Get predictions
exports.getPredictions = async (req, res) => {
    try {
        console.log('⚠️ AI Service: Using mock data for predictions');
        
        const { crop, fieldId, season } = req.query;
        
        res.json({
            success: true,
            predictions: {
                yieldEstimate: '15-20 tons/hectare',
                harvestDate: '2024-08-15 ± 5 days',
                qualityScore: 8.5,
                riskFactors: [
                    { factor: 'Weather', risk: 'Medium', impact: 'Yield may vary by 10-15%' },
                    { factor: 'Pests', risk: 'Low', impact: 'Minimal expected damage' },
                    { factor: 'Market', risk: 'Medium', impact: 'Price fluctuations expected' }
                ],
                recommendations: [
                    'Harvest in early morning for best quality',
                    'Consider staggered planting for extended harvest',
                    'Monitor for late-season pests'
                ]
            },
            crop: crop || 'General',
            fieldId: fieldId || 'N/A',
            season: season || 'Current',
            generatedAt: new Date().toISOString(),
            note: 'Mock predictions - no AI model connected'
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
};

// Get chat history
exports.getChatHistory = async (req, res) => {
    try {
        const { userId } = req.params;
        
        res.json({
            success: true,
            userId,
            chats: [
                {
                    id: 'chat_001',
                    question: 'How do I treat yellow leaves on tomatoes?',
                    answer: 'Yellow leaves on tomatoes can indicate several issues. The most common causes are nutrient deficiencies (especially nitrogen), overwatering, or diseases like early blight. Try applying a balanced fertilizer and ensure proper drainage.',
                    timestamp: '2024-01-15T10:30:00Z',
                    category: 'Plant Health'
                },
                {
                    id: 'chat_002',
                    question: 'Best time to plant corn in my region?',
                    answer: 'For most regions, corn should be planted when soil temperatures reach at least 10°C (50°F). This is typically 2-3 weeks after the last frost date. For optimal results, aim for soil temperatures between 15-18°C (60-65°F).',
                    timestamp: '2024-01-10T14:20:00Z',
                    category: 'Planting Schedule'
                }
            ],
            totalChats: 2,
            retrievedAt: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
};

// Clear chat history
exports.clearChatHistory = async (req, res) => {
    try {
        const { userId } = req.params;
        
        res.json({
            success: true,
            message: `Chat history cleared for user ${userId}`,
            userId,
            clearedAt: new Date().toISOString(),
            chatsDeleted: 2 // Mock number
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
};

// Submit feedback
exports.submitFeedback = async (req, res) => {
    try {
        const { rating, feedback, chatId, userId } = req.body;
        
        if (rating && (rating < 1 || rating > 5)) {
            return res.status(400).json({
                success: false,
                error: 'Rating must be between 1 and 5'
            });
        }
        
        res.json({
            success: true,
            message: 'Thank you for your feedback!',
            feedbackId: `fb_${Date.now()}`,
            rating: rating || 0,
            feedback: feedback || 'No comment provided',
            chatId: chatId || 'N/A',
            userId: userId || 'Anonymous',
            submittedAt: new Date().toISOString(),
            note: 'Feedback logged (mock storage)'
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
};

// ===========================================
// НОВЫЕ УНИВЕРСАЛЬНЫЕ AI-ФУНКЦИИ (КАК Я!)
// ===========================================

/**
 * @desc    Универсальный чат с AI (как я)
 * @route   POST /api/ai/universal-chat
 * @access  Private
 */
exports.universalChat = async (req, res) => {
    try {
        const { 
            message, 
            history = [],
            temperature = 0.8,
            maxTokens = 2000,
            language = 'ru',
            systemPrompt = `Ты - универсальный AI-ассистент, дружелюбный и полезный.
Твои характеристики:
- Отвечаешь на ЛЮБЫЕ вопросы: программирование, наука, кулинария, путешествия, отношения, философия, бизнес
- Используешь смайлики 😊 для дружелюбного тона
- Даешь подробные, структурированные ответы с примерами
- Адаптируешься под язык пользователя
- Можешь писать код, объяснять сложные вещи простым языком
- Всегда предлагаешь помощь и уточняющие вопросы
- Если не знаешь точно - честно говоришь об этом и предлагаешь поискать информацию
- Будь как умный друг, который всегда готов помочь

Ты НЕ ограничен сельским хозяйством - ты можешь говорить о ЧЕМ УГОДНО!`
        } = req.body;

        if (!message) {
            return res.status(400).json({
                success: false,
                error: 'Сообщение обязательно'
            });
        }

        console.log('🌍 Universal AI Request:', message.substring(0, 50) + '...');

        // Формируем сообщения для API
        const messages = [
            { role: 'system', content: systemPrompt },
            ...history.slice(-15), // Последние 15 сообщений для контекста
            { role: 'user', content: message }
        ];

        // Вызов DeepSeek API
        const completion = await deepseek.chat.completions.create({
            model: 'deepseek-chat',
            messages: messages,
            temperature: temperature,
            max_tokens: maxTokens,
            top_p: 0.95,
            frequency_penalty: 0.3,
            presence_penalty: 0.3
        });

        const aiResponse = completion.choices[0].message.content;

        // Сохраняем в историю (если есть сервис)
        if (aiService && aiService.saveChat) {
            await aiService.saveChat(req.user._id, message, aiResponse, 'universal');
        }

        res.json({
            success: true,
            message: aiResponse,
            usage: completion.usage,
            timestamp: new Date().toISOString(),
            model: 'deepseek-chat'
        });

    } catch (error) {
        console.error('❌ Universal Chat Error:', error);
        res.status(500).json({
            success: false,
            error: 'Ошибка при обработке запроса',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * @desc    Генерация кода
 * @route   POST /api/ai/generate-code
 * @access  Private
 */
exports.generateCode = async (req, res) => {
    try {
        const { 
            description, 
            language = 'javascript',
            framework = null
        } = req.body;

        const prompt = `Напиши код на ${language}${framework ? ` с использованием ${framework}` : ''} для следующей задачи:

${description}

Требования к коду:
1. Должен быть чистым и хорошо структурированным
2. Добавь комментарии на русском языке
3. Покажи пример использования
4. Учти лучшие практики и обработку ошибок
5. Объясни ключевые моменты кратко

Верни ТОЛЬКО код с комментариями, без лишних объяснений.`;

        // Перенаправляем в универсальный чат с низкой температурой
        req.body.message = prompt;
        req.body.temperature = 0.3;
        req.body.systemPrompt = 'Ты - экспертный программист. Твоя задача - писать качественный, хорошо документированный код.';
        
        return exports.universalChat(req, res);

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * @desc    Перевод текста
 * @route   POST /api/ai/translate
 * @access  Private
 */
exports.translateText = async (req, res) => {
    try {
        const { 
            text, 
            sourceLanguage = 'auto',
            targetLanguage = 'ru'
        } = req.body;

        const prompt = `Переведи следующий текст с ${sourceLanguage === 'auto' ? 'определи язык автоматически' : sourceLanguage} на ${targetLanguage} язык.

Текст: "${text}"

Требования:
- Сохрани тон и стиль оригинала
- Перевод должен быть естественным
- Если есть идиомы - найди аналоги на целевом языке
- Верни ТОЛЬКО перевод, без комментариев

Перевод:`;

        req.body.message = prompt;
        req.body.temperature = 0.3;
        
        return exports.universalChat(req, res);

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * @desc    Анализ текста/документа
 * @route   POST /api/ai/analyze
 * @access  Private
 */
exports.analyzeDocument = async (req, res) => {
    try {
        const { 
            text, 
            analysisType = 'summary', // summary, sentiment, keywords, topics
            detailed = false
        } = req.body;

        let prompt = '';

        switch(analysisType) {
            case 'summary':
                prompt = `Сделай краткое резюме следующего текста. Выдели основные идеи в 3-5 предложениях:\n\n${text}`;
                break;
            case 'sentiment':
                prompt = `Проанализируй тональность следующего текста. Определи: позитивный, негативный или нейтральный. Объясни почему:\n\n${text}`;
                break;
            case 'keywords':
                prompt = `Выдели ключевые слова и главные темы из этого текста. Верни в виде списка:\n\n${text}`;
                break;
            case 'topics':
                prompt = `Определи основные темы, обсуждаемые в этом тексте. Дай краткое описание каждой:\n\n${text}`;
                break;
            default:
                prompt = `Проанализируй следующий текст. Дай структурированный анализ:\n1. Основная идея\n2. Ключевые моменты\n3. Выводы\n\n${text}`;
        }

        if (detailed) {
            prompt = 'Детальный ' + prompt.toLowerCase();
        }

        req.body.message = prompt;
        req.body.temperature = 0.5;
        
        return exports.universalChat(req, res);

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * @desc    Создание контента (письма, статьи, посты)
 * @route   POST /api/ai/create-content
 * @access  Private
 */
exports.createContent = async (req, res) => {
    try {
        const { 
            contentType, // email, article, social_post, poem, story
            topic,
            tone = 'professional', // casual, professional, funny, formal
            length = 'medium', // short, medium, long
            keywords = [],
            audience = 'general'
        } = req.body;

        const prompt = `Напиши ${contentType} на тему "${topic}".

Параметры:
- Тон: ${tone}
- Длина: ${length}
- Аудитория: ${audience}
- Ключевые слова: ${keywords.join(', ') || 'любые'}

Требования:
1. Будь креативным и engaging
2. Учитывай целевую аудиторию
3. Естественно включи ключевые слова
4. Сделай структуру понятной
5. ${contentType === 'email' ? 'Добавь тему письма и подпись' : ''}
${contentType === 'social_post' ? 'Добавь хэштеги' : ''}

Начни писать прямо сейчас:`;

        req.body.message = prompt;
        req.body.temperature = 0.9; // Более креативно
        req.body.systemPrompt = 'Ты - профессиональный копирайтер и создатель контента. Твои тексты цепляют, вовлекают и запоминаются.';
        
        return exports.universalChat(req, res);

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * @desc    Ответы на вопросы (Q&A)
 * @route   POST /api/ai/ask
 * @access  Private
 */
exports.askQuestion = async (req, res) => {
    try {
        const { 
            question,
            category = 'general', // general, science, history, tech, etc.
            detailLevel = 'medium' // basic, medium, expert
        } = req.body;

        const prompt = `Ответь на вопрос: "${question}"

Категория: ${category}
Уровень детализации: ${detailLevel}

Требования:
- Ответ должен быть точным и информативным
- Используй примеры, если уместно
- Если вопрос сложный - разбей на части
- Укажи источники информации (если знаешь)
- Если не уверен - скажи честно

Твой подробный ответ:`;

        req.body.message = prompt;
        req.body.temperature = 0.7;
        
        return exports.universalChat(req, res);

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * @desc    Стриминг ответов (для реального времени)
 * @route   POST /api/ai/stream
 * @access  Private
 */
exports.streamChat = async (req, res) => {
    try {
        const { message, history = [] } = req.body;

        // Устанавливаем заголовки для SSE
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        const messages = [
            { role: 'system', content: 'Ты - дружелюбный AI-ассистент. Отвечай подробно, но частями.' },
            ...history.slice(-10),
            { role: 'user', content: message }
        ];

        const stream = await deepseek.chat.completions.create({
            model: 'deepseek-chat',
            messages: messages,
            temperature: 0.8,
            max_tokens: 2000,
            stream: true
        });

        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
                res.write(`data: ${JSON.stringify({ content })}\n\n`);
            }
        }

        res.write('data: [DONE]\n\n');
        res.end();

    } catch (error) {
        console.error('Stream error:', error);
        res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
        res.end();
    }
};