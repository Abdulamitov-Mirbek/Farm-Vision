// src/services/aiService.js
import OpenAI from 'openai';

class AIService {
  constructor() {
    this.conversationHistory = [];
    this.apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    
    // DeepSeek API ключ (ваш существующий)
    this.deepseekApiKey = import.meta.env.VITE_DEEPSEEK_API_KEY || 
                          import.meta.env.VITE_GROQ_API_KEY; // На случай если используете тот же ключ
    
    // Groq API ключ (опционально)
    this.groqApiKey = import.meta.env.VITE_GROQ_API_KEY;
    
    // Инициализация DeepSeek (через OpenAI SDK)
    this.hasDeepSeek = !!this.deepseekApiKey;
    if (this.hasDeepSeek) {
      try {
        this.deepseek = new OpenAI({
          apiKey: this.deepseekApiKey,
          baseURL: 'https://api.deepseek.com/v1',
          dangerouslyAllowBrowser: true
        });
        console.log('✅ DeepSeek AI инициализирован');
      } catch (error) {
        console.error('❌ Ошибка инициализации DeepSeek:', error);
        this.hasDeepSeek = false;
      }
    }
    
    // Инициализация Groq (как запасной вариант)
    this.hasGroq = this.groqApiKey && this.groqApiKey.startsWith('gsk_');
    if (this.hasGroq && !this.hasDeepSeek) {
      try {
        // Динамический импорт Groq только если нужен
        import('groq-sdk').then(({ default: Groq }) => {
          this.groq = new Groq({
            apiKey: this.groqApiKey,
            dangerouslyAllowBrowser: true
          });
          console.log('✅ Groq AI инициализирован (запасной вариант)');
        }).catch(err => {
          console.error('❌ Ошибка загрузки Groq:', err);
          this.hasGroq = false;
        });
      } catch (error) {
        console.error('❌ Ошибка инициализации Groq:', error);
        this.hasGroq = false;
      }
    }
    
    if (!this.hasDeepSeek && !this.hasGroq) {
      console.warn('⚠️ API ключ не найден. Будет использован локальный режим.');
    }
    
    console.log('✅ AI Service инициализирован');
  }

  async sendMessage(message, context = {}) {
    // Приоритет: DeepSeek -> Groq -> Сервер -> Локальный
    if (this.hasDeepSeek) {
      return this.sendMessageToDeepSeek(message, context);
    }
    
    if (this.hasGroq) {
      return this.sendMessageToGroq(message, context);
    }
    
    // Пробуем отправить на сервер
    try {
      console.log('📤 Отправка вопроса на сервер...');
      
      const url = `${this.apiUrl}/ai/chat`;
      const token = localStorage.getItem('auth_token');
      
      const response = await fetch(url, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({ 
          message: message,
          language: context.language || 'ru'
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      this.addToHistory('user', message);
      this.addToHistory('assistant', data.message);
      
      return {
        success: true,
        message: data.message,
        timestamp: data.timestamp || new Date().toISOString()
      };

    } catch (error) {
      console.error('❌ Ошибка:', error.message);
      
      return {
        success: true,
        message: this.getLocalResponse(message, context.language || 'ru'),
        local: true,
        timestamp: new Date().toISOString()
      };
    }
  }

  async sendMessageToDeepSeek(message, context = {}) {
    try {
      const language = context.language || 'ru';
      
      // Строим системный промпт
      const systemPrompt = this.buildSystemPrompt(context);
      
      // Подготавливаем сообщения с историей
      const messages = [
        { role: 'system', content: systemPrompt },
        ...this.conversationHistory.slice(-10).map(msg => ({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content
        })),
        { role: 'user', content: message }
      ];

      const completion = await this.deepseek.chat.completions.create({
        messages: messages,
        model: 'deepseek-chat', // Основная модель DeepSeek
        temperature: 0.7,
        max_tokens: 2048,
        top_p: 0.95,
        frequency_penalty: 0.3,
        presence_penalty: 0.3
      });

      const response = completion.choices[0]?.message?.content || '...';
      
      this.addToHistory('user', message);
      this.addToHistory('assistant', response);
      
      return {
        success: true,
        message: response,
        timestamp: new Date().toISOString(),
        model: 'deepseek-chat',
        usage: completion.usage
      };

    } catch (error) {
      console.error('❌ DeepSeek API Error:', error);
      
      // Пробуем через Groq как запасной вариант
      if (this.hasGroq) {
        console.log('🔄 Пробуем через Groq...');
        return this.sendMessageToGroq(message, context);
      }
      
      return {
        success: true,
        message: this.getLocalResponse(message, context.language || 'ru'),
        local: true,
        timestamp: new Date().toISOString()
      };
    }
  }

  async sendMessageToGroq(message, context = {}) {
    try {
      const language = context.language || 'ru';
      
      const systemPrompt = this.buildSystemPrompt(context);
      
      const messages = [
        { role: 'system', content: systemPrompt },
        ...this.conversationHistory.slice(-5).map(msg => ({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content
        })),
        { role: 'user', content: message }
      ];

      // Выбираем модель Groq
      const model = 'mixtral-8x7b-32768';

      const completion = await this.groq.chat.completions.create({
        messages: messages,
        model: model,
        temperature: 0.7,
        max_tokens: 2048,
      });

      const response = completion.choices[0]?.message?.content || '...';
      
      this.addToHistory('user', message);
      this.addToHistory('assistant', response);
      
      return {
        success: true,
        message: response,
        timestamp: new Date().toISOString(),
        model: 'groq'
      };

    } catch (error) {
      console.error('❌ Groq API Error:', error);
      
      return {
        success: true,
        message: this.getLocalResponse(message, context.language || 'ru'),
        local: true,
        timestamp: new Date().toISOString()
      };
    }
  }

  async analyzeImage(imageFile, options = {}) {
    const language = options.language || 'ru';
    
    // DeepSeek поддерживает анализ изображений через тот же API!
    if (this.hasDeepSeek) {
      return this.analyzeImageWithDeepSeek(imageFile, options);
    }
    
    // Groq Vision как запасной вариант
    if (this.hasGroq) {
      return this.analyzeImageWithGroqVision(imageFile, options);
    }
    
    // Локальный ответ
    return {
      success: true,
      analysis: this.getLocalImageAnalysis(language),
      local: true,
      timestamp: new Date().toISOString()
    };
  }

  async analyzeImageWithDeepSeek(imageFile, options = {}) {
    try {
      const language = options.language || 'ru';
      
      // Конвертируем изображение в base64
      const base64Image = await this.fileToBase64(imageFile);
      
      // Определяем промпт в зависимости от типа анализа
      let promptText;
      if (options.type === 'plant_disease') {
        promptText = this.getPlantDiagnosisPrompt(language);
      } else {
        promptText = language === 'ru'
          ? `Опиши, что ты видишь на этом изображении. Ответь на русском языке подробно.`
          : language === 'en'
          ? `Describe what you see in this image. Answer in English in detail.`
          : `Бул сүрөттө эмне көрүп жатканыңды сүрөттө. Кыргызча толук жооп бер.`;
      }

      // DeepSeek принимает изображения как base64 в тексте
      const completion = await this.deepseek.chat.completions.create({
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: promptText
              },
              {
                type: 'image_url',
                image_url: {
                  url: base64Image
                }
              }
            ]
          }
        ],
        model: 'deepseek-chat', // DeepSeek поддерживает vision
        temperature: 0.5,
        max_tokens: 2048,
      });

      const analysis = completion.choices[0]?.message?.content || '...';
      
      return {
        success: true,
        analysis: analysis,
        timestamp: new Date().toISOString(),
        model: 'deepseek-vision'
      };

    } catch (error) {
      console.error('❌ DeepSeek Vision Error:', error);
      
      // Пробуем через Groq
      if (this.hasGroq) {
        console.log('🔄 Пробуем Groq Vision...');
        return this.analyzeImageWithGroqVision(imageFile, options);
      }
      
      return {
        success: true,
        analysis: this.getLocalImageAnalysis(options.language || 'ru'),
        local: true,
        timestamp: new Date().toISOString()
      };
    }
  }

  async analyzeImageWithGroqVision(imageFile, options = {}) {
    try {
      const language = options.language || 'ru';
      
      const base64Image = await this.fileToBase64(imageFile);
      
      let promptText;
      if (options.type === 'plant_disease') {
        promptText = this.getPlantDiagnosisPrompt(language);
      } else {
        promptText = language === 'ru'
          ? `Опиши, что ты видишь на этом изображении. Ответь на русском языке подробно.`
          : language === 'en'
          ? `Describe what you see in this image. Answer in English in detail.`
          : `Бул сүрөттө эмне көрүп жатканыңды сүрөттө. Кыргызча толук жооп бер.`;
      }

      const completion = await this.groq.chat.completions.create({
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: promptText
              },
              {
                type: 'image_url',
                image_url: {
                  url: base64Image
                }
              }
            ]
          }
        ],
        model: 'llama-3.2-11b-vision-preview',
        temperature: 0.5,
        max_tokens: 1024,
      });

      const analysis = completion.choices[0]?.message?.content || '...';
      
      return {
        success: true,
        analysis: analysis,
        timestamp: new Date().toISOString(),
        model: 'groq-vision'
      };

    } catch (error) {
      console.error('❌ Groq Vision Error:', error);
      
      return {
        success: true,
        analysis: this.getLocalImageAnalysis(options.language || 'ru'),
        local: true,
        timestamp: new Date().toISOString()
      };
    }
  }

  getPlantDiagnosisPrompt(language) {
    const prompts = {
      ru: `Ты - агроном-эксперт с 20-летним опытом. Проанализируй это растение и ответь на русском языке СТРУКТУРИРОВАННО:

🌱 **ОБЩИЙ ОСМОТР:**
- Какая это культура? (если видно)
- Общее состояние растения

🔍 **ПРОБЛЕМЫ:**
- Есть ли признаки болезней? (опиши симптомы)
- Есть ли вредители? (какие именно)
- Какие части растения поражены?

🍃 **СОСТОЯНИЕ ЛИСТЬЕВ:**
- Цвет (нормальный, желтый, коричневый)
- Форма (скрученные, пятна, дыры)
- Тургор (упругость)

💊 **ДИАГНОЗ И ЛЕЧЕНИЕ:**
- Что именно с растением?
- Срочные действия
- Чем обработать (препараты, народные средства)
- Профилактика в будущем

📊 **ПРОГНОЗ:**
- Шансы на выздоровление
- Сроки восстановления

Будь подробным, но конкретным. Используй эмодзи. Если не уверен - скажи честно.`,
      
      en: `You are an agronomist with 20 years of experience. Analyze this plant and answer in English STRUCTURED:

🌱 **GENERAL INSPECTION:**
- What crop is this? (if visible)
- Overall plant condition

🔍 **PROBLEMS:**
- Any disease signs? (describe symptoms)
- Any pests? (which ones)
- Which parts are affected?

🍃 **LEAF CONDITION:**
- Color (normal, yellow, brown)
- Shape (curled, spots, holes)
- Turgor (firmness)

💊 **DIAGNOSIS & TREATMENT:**
- What's wrong with the plant?
- Immediate actions
- Treatment (products, home remedies)
- Future prevention

📊 **PROGNOSIS:**
- Recovery chances
- Recovery time

Be detailed but specific. Use emojis. If unsure - say so honestly.`,
      
      kg: `Сен - 20 жылдык тажрыйбасы бар агроном. Бул өсүмдүктү анализдеп, кыргызча СТРУКТУРАЛУУ жооп бер:

🌱 **ЖАЛПЫ КАРОО:**
- Бул кайсы өсүмдүк? (көрүнсө)
- Өсүмдүктүн жалпы абалы

🔍 **КӨЙГӨЙЛӨР:**
- Оору белгилери барбы? (симптомдорун сүрөттө)
- Зыянкечтер барбы? (кайсылар)
- Өсүмдүктүн кайсы бөлүктөрү жабыркаган?

🍃 **ЖАЛБЫРАКТАРДЫН АБАЛЫ:**
- Түсү (кадимки, сары, күрөң)
- Формасы (ийри, тактар, тешиктер)
- Тургор (бышыктыгы)

💊 **ДИАГНОЗ ЖАНА ДАРЫЛОО:**
- Өсүмдүккө эмне болгон?
- Шашылыш чаралар
- Эмне менен дарылоо керек (препараттар, элдик каражаттар)
- Келечекте алдын алуу

📊 **БОЛЖОЛ:**
- Айыгуу мүмкүнчүлүгү
- Айыгуу мөөнөтү

Толук, бирок конкреттүү бол. Эмодзилерди колдон. Так билбесең - чынын айт.`
    };
    
    return prompts[language] || prompts.ru;
  }

  fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  buildSystemPrompt(context) {
    const { language = 'ru', userData, farmData } = context;
    
    const prompts = {
      ru: `Ты - Farm Culture, AI-ассистент на базе DeepSeek. Отвечай на русском языке.
      
Информация о пользователе:
- Имя: ${userData?.name || 'Фермер'}
- Хозяйство: ${userData?.farmName || 'Farm Vision'}
- Общая площадь: ${farmData?.totalArea || '145.4'} га
- Культуры: ${farmData?.crops || 'пшеница, кукуруза, подсолнечник'}

Ты специализируешься на сельском хозяйстве, но можешь отвечать на любые вопросы.
Отвечай подробно, структурированно и дружелюбно. Используй эмодзи.`,
      
      en: `You are Farm Culture, an AI assistant powered by DeepSeek. Answer in English.
      
User information:
- Name: ${userData?.name || 'Farmer'}
- Farm: ${userData?.farmName || 'Farm Vision'}
- Total area: ${farmData?.totalArea || '145.4'} ha
- Crops: ${farmData?.crops || 'wheat, corn, sunflower'}

You specialize in agriculture but can answer any questions.
Answer in detail, structured, and friendly. Use emojis.`,
      
      kg: `Сен - Farm Culture, DeepSeek негизиндеги AI жардамчы. Кыргызча жооп бер.
      
Колдонуучу жөнүндө маалымат:
- Аты: ${userData?.name || 'Фермер'}
- Чарба: ${userData?.farmName || 'Farm Vision'}
- Жалпы аянт: ${farmData?.totalArea || '145.4'} га
- Өсүмдүктөр: ${farmData?.crops || 'буудай, жүгөрү, күнкарама'}

Сен айыл чарба боюнча адистешкенсиң, бирок каалаган суроолорго жооп бере аласың.
Толук, структуралуу жана достук мамиледе жооп бер. Эмодзилерди колдон.`
    };
    
    return prompts[language] || prompts.ru;
  }

  getLocalImageAnalysis(language = 'ru') {
    const responses = {
      ru: `🔍 **Анализ изображения**

Я не могу проанализировать фото в данный момент.

**Чтобы использовать анализ изображений, нужно:**

1. Получить DeepSeek API ключ
2. Добавить в .env: VITE_DEEPSEEK_API_KEY=ваш_ключ
3. Перезапустить приложение

Или используйте Groq с ключом VITE_GROQ_API_KEY.`,
      
      en: `🔍 **Image analysis**

I cannot analyze photos at the moment.

**To use image analysis:**

1. Get DeepSeek API key
2. Add to .env: VITE_DEEPSEEK_API_KEY=your_key
3. Restart the application

Or use Groq with VITE_GROQ_API_KEY.`,
      
      kg: `🔍 **Сүрөттү анализдөө**

Мен сүрөттү азырынча анализдей албайм.

**Сүрөттөрдү анализдөөнү колдонуу үчүн:**

1. DeepSeek API ачкычын алыңыз
2. .env файлына кошуңуз: VITE_DEEPSEEK_API_KEY=сиздин_ачкыч
3. Колдонмону кайра иштетиңиз

Же Groq колдонуңуз VITE_GROQ_API_KEY менен.`
    };
    
    return responses[language] || responses.ru;
  }

  addToHistory(role, content) {
    this.conversationHistory.push({ role, content, timestamp: new Date() });
    if (this.conversationHistory.length > 50) {
      this.conversationHistory = this.conversationHistory.slice(-50);
    }
  }

  clearHistory() {
    this.conversationHistory = [];
  }

  getHistory() {
    return this.conversationHistory;
  }

  getLocalResponse(message, language = 'ru') {
    const lowerMsg = message.toLowerCase();
    
    if (lowerMsg.includes('привет') || lowerMsg.includes('салам') || lowerMsg.includes('hello')) {
      return language === 'ru' ? '👋 Здравствуйте! Я в локальном режиме.' :
             language === 'en' ? '👋 Hello! I\'m in local mode.' :
             '👋 Салам! Мен жергиликтүү режимде.';
    }
    
    if (lowerMsg.includes('погод') || lowerMsg.includes('weather') || lowerMsg.includes('аба')) {
      return language === 'ru' ? '☀️ Сегодня +18°C, солнечно.' :
             language === 'en' ? '☀️ Today +18°C, sunny.' :
             '☀️ Бүгүн +18°C, күн ачык.';
    }
    
    if (lowerMsg.includes('пшениц') || lowerMsg.includes('wheat') || lowerMsg.includes('буудай')) {
      return language === 'ru' ? '🌾 Пшеницу лучше сеять в апреле.' :
             language === 'en' ? '🌾 Wheat is best sown in April.' :
             '🌾 Буудайды апрелде себүү жакшы.';
    }
    
    return language === 'ru' ? '🌱 Я в локальном режиме. Что хотите узнать?' :
           language === 'en' ? '🌱 I\'m in local mode. What would you like to know?' :
           '🌱 Мен жергиликтүү режимде. Эмне билгиңиз келет?';
  }
}

// ✅ Экспорт по умолчанию
const aiService = new AIService();
export default aiService;