// server/services/aiService.js
const axios = require('axios');
const Diary = require('../models/Diary');
const Field = require('../models/Field');
const Task = require('../models/Task');

class AIService {
  constructor() {
    // На сервере process.env работает отлично!
    this.openaiApiKey = process.env.GROQ_API_KEY;
    this.baseUrl = 'https://api.groq.com/openai/v1';
    
    if (!this.openaiApiKey) {
      console.warn('⚠️ GROQ_API_KEY не установлен. AI сервис будет использовать мок-данные.');
    }
  }
  
  /**
   * Получение совета от AI
   */
  async getAdvice(question, context = {}, userId) {
    try {
      // Если нет API ключа, используем мок-данные
      if (!this.openaiApiKey) {
        return this.getMockAdvice(question, context);
      }
      
      // Получаем контекст пользователя
      const userContext = await this.getUserContext(userId);
      
      // Формируем промпт
      const prompt = this.buildAdvicePrompt(question, { ...context, ...userContext });
      
      // Отправляем запрос к OpenAI
      const response = await axios.post(
        `${this.baseUrl}/chat/completions`,
        {
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content: 'Ты опытный агроном с 20-летним стажем. Отвечай подробно и профессионально, но доступным языком. Учитывай климатические условия. Предоставляй конкретные рекомендации с цифрами и сроками.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 1000
        },
        {
          headers: {
            'Authorization': `Bearer ${this.openaiApiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      const advice = response.data.choices[0].message.content;
      
      // Сохраняем запрос в историю
      await this.saveToHistory(userId, {
        type: 'advice',
        question,
        answer: advice,
        context
      });
      
      return {
        success: true,
        answer: advice,
        sources: this.extractSources(advice),
        confidence: 0.9,
        timestamp: new Date()
      };
      
    } catch (error) {
      console.error('Ошибка получения совета от AI:', error.message);
      return this.getMockAdvice(question, context);
    }
  }
  
  /**
   * Диагностика болезни растений
   */
  async diagnosePlant(symptoms, plantType, images = [], userId) {
    try {
      // Если нет API ключа, используем мок-данные
      if (!this.openaiApiKey) {
        return this.getMockDiagnosis(symptoms, plantType);
      }
      
      // Формируем промпт для диагностики
      const prompt = this.buildDiagnosisPrompt(symptoms, plantType, images);
      
      const response = await axios.post(
        `${this.baseUrl}/chat/completions`,
        {
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content: 'Ты эксперт по болезням растений. По описанию симптомов определи возможное заболевание, укажи вероятность, рекомендованное лечение и профилактические меры.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.6,
          max_tokens: 1500
        },
        {
          headers: {
            'Authorization': `Bearer ${this.openaiApiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      const diagnosis = response.data.choices[0].message.content;
      
      // Сохраняем диагностику в историю
      await this.saveToHistory(userId, {
        type: 'diagnosis',
        symptoms,
        plantType,
        diagnosis,
        timestamp: new Date()
      });
      
      return {
        success: true,
        ...this.parseDiagnosisResponse(diagnosis)
      };
      
    } catch (error) {
      console.error('Ошибка диагностики растения:', error.message);
      return this.getMockDiagnosis(symptoms, plantType);
    }
  }
  
  /**
   * Получение ежедневных советов
   */
  async getDailyTips(userId) {
    try {
      // Получаем контекст пользователя
      const context = await this.getUserContext(userId);
      
      // Генерируем советы на основе контекста
      const tips = await this.generateTipsFromContext(context);
      
      return {
        success: true,
        tips,
        generatedAt: new Date(),
        relevantFor: this.getRelevantPeriod()
      };
      
    } catch (error) {
      console.error('Ошибка получения советов:', error.message);
      return this.getMockTips();
    }
  }
  
  /**
   * Получение прогнозов урожайности
   */
  async getPredictions(userId) {
    try {
      const fields = await Field.find({ userId });
      const predictions = [];
      
      for (const field of fields) {
        if (field.cropType && field.plantingDate && field.expectedHarvestDate) {
          const prediction = await this.predictYield(field);
          predictions.push(prediction);
        }
      }
      
      return {
        success: true,
        predictions,
        confidence: this.calculateOverallConfidence(predictions),
        generatedAt: new Date()
      };
      
    } catch (error) {
      console.error('Ошибка получения прогнозов:', error.message);
      return this.getMockPredictions();
    }
  }
  
  /**
   * Получение контекста пользователя
   */
  async getUserContext(userId) {
    try {
      const [fields, recentDiary, activeTasks] = await Promise.all([
        Field.find({ userId }).limit(5),
        Diary.find({ userId }).sort({ date: -1 }).limit(10),
        Task.find({ 
          userId, 
          status: { $in: ['pending', 'in_progress'] }
        }).limit(5)
      ]);
      
      // Получаем текущую дату и сезон
      const now = new Date();
      const season = this.getSeason(now);
      const month = now.getMonth() + 1;
      
      return {
        user: {
          fields: fields.map(f => ({
            name: f.name,
            crop: f.cropType,
            area: f.area,
            status: f.status
          })),
          recentActivities: recentDiary.map(d => ({
            type: d.activityType,
            date: d.date,
            field: d.fieldId?.name
          })),
          activeTasks: activeTasks.map(t => ({
            title: t.title,
            type: t.type,
            priority: t.priority,
            dueDate: t.endDate
          }))
        },
        temporal: {
          season,
          month,
          year: now.getFullYear()
        },
        location: {
          region: 'Центральная Россия',
          climateZone: 'умеренно-континентальный'
        }
      };
    } catch (error) {
      console.error('Ошибка получения контекста пользователя:', error.message);
      return {};
    }
  }
  
  /**
   * Построение промпта для совета
   */
  buildAdvicePrompt(question, context) {
    return `
Контекст пользователя:
- Время года: ${context.temporal?.season || 'неизвестно'}
- Месяц: ${context.temporal?.month || 'неизвестно'}
- Регион: ${context.location?.region || 'неизвестно'}
- Климатическая зона: ${context.location?.climateZone || 'неизвестно'}

Поля пользователя:
${context.user?.fields?.map(f => `- ${f.name}: ${f.crop} (${f.area} га), статус: ${f.status}`).join('\n') || 'Нет данных'}

Последние активности:
${context.user?.recentActivities?.map(a => `- ${a.type} на поле "${a.field}" (${new Date(a.date).toLocaleDateString('ru-RU')})`).join('\n') || 'Нет данных'}

Активные задачи:
${context.user?.activeTasks?.map(t => `- ${t.title} (${t.type}), приоритет: ${t.priority}, срок: ${new Date(t.dueDate).toLocaleDateString('ru-RU')}`).join('\n') || 'Нет данных'}

Вопрос пользователя: ${question}

Пожалуйста, дай подробный ответ с учетом предоставленного контекста. Если нужно, разбей ответ на разделы. Предоставь конкретные рекомендации с цифрами, сроками и, если возможно, расчетами.
    `.trim();
  }
  
  /**
   * Построение промпта для диагностики
   */
  buildDiagnosisPrompt(symptoms, plantType, images) {
    return `
Диагностика болезни растения:

Тип растения: ${plantType}

Описание симптомов:
${symptoms}

${images.length > 0 ? `Есть ${images.length} изображений для анализа.` : 'Изображения не предоставлены.'}

Пожалуйста, определи возможное заболевание по следующим критериям:
1. Наиболее вероятное заболевание (с указанием вероятности в %)
2. Альтернативные возможные заболевания
3. Описание заболевания
4. Причины возникновения
5. Рекомендованное лечение (препараты, дозировки, сроки)
6. Профилактические меры
7. Прогноз развития при своевременном лечении
8. Рекомендации по уходу в период восстановления

Если информации недостаточно для точной диагностики, укажи это и попроси дополнительную информацию.
    `.trim();
  }
  
  /**
   * Генерация советов на основе контекста
   */
  async generateTipsFromContext(context) {
    const tips = [];
    const now = new Date();
    const month = now.getMonth() + 1;
    
    // Общие советы по сезону
    const seasonalTips = this.getSeasonalTips(month, context.location?.region);
    tips.push(...seasonalTips);
    
    // Советы по полям
    if (context.user?.fields) {
      for (const field of context.user.fields) {
        const fieldTips = this.getFieldSpecificTips(field, month);
        tips.push(...fieldTips);
      }
    }
    
    // Советы по задачам
    if (context.user?.activeTasks) {
      const taskTips = this.getTaskTips(context.user.activeTasks);
      tips.push(...taskTips);
    }
    
    // Советы на основе погоды
    const weatherTips = await this.getWeatherBasedTips(context.location?.region);
    tips.push(...weatherTips);
    
    // Ограничиваем количество советов и перемешиваем
    return tips
      .sort(() => Math.random() - 0.5)
      .slice(0, 5);
  }
  
  /**
   * Прогноз урожайности для поля
   */
  async predictYield(field) {
    const plantingDate = new Date(field.plantingDate);
    const expectedDate = new Date(field.expectedHarvestDate);
    const now = new Date();
    
    const totalDays = (expectedDate - plantingDate) / (1000 * 60 * 60 * 24);
    const daysPassed = (now - plantingDate) / (1000 * 60 * 60 * 24);
    const progress = Math.min(100, (daysPassed / totalDays) * 100);
    
    // Базовый прогноз на основе типа культуры
    const baseYield = this.getBaseYieldForCrop(field.cropType);
    
    // Корректировки на основе статуса поля
    let adjustment = 1.0;
    if (field.status === 'problems') adjustment *= 0.7;
    if (field.quality === 'excellent') adjustment *= 1.2;
    if (field.quality === 'good') adjustment *= 1.1;
    if (field.quality === 'poor') adjustment *= 0.8;
    if (field.quality === 'critical') adjustment *= 0.6;
    
    const predictedYield = baseYield * adjustment;
    const confidence = this.calculatePredictionConfidence(field, progress);
    
    return {
      fieldId: field._id,
      fieldName: field.name,
      cropType: field.cropType,
      predictedYield: Math.round(predictedYield * 100) / 100,
      currentYield: field.currentYield || 0,
      progress: Math.round(progress * 10) / 10,
      confidence: Math.round(confidence * 100) / 100,
      factors: {
        cropType: field.cropType,
        fieldStatus: field.status,
        quality: field.quality,
        seasonProgress: progress
      },
      recommendations: this.getYieldRecommendations(field, predictedYield)
    };
  }
  
  /**
   * Получение базовой урожайности для культуры
   */
  getBaseYieldForCrop(cropType) {
    const yields = {
      'wheat': 3.5,      // т/га
      'corn': 6.0,
      'sunflower': 2.5,
      'barley': 3.0,
      'rye': 2.8,
      'oat': 2.5,
      'rape': 2.0,
      'soybean': 2.2,
      'potato': 25.0,
      'vegetables': 15.0,
      'fruits': 10.0,
      'berries': 5.0,
      'other': 3.0
    };
    
    return yields[cropType] || 3.0;
  }
  
  /**
   * Расчет уверенности в прогнозе
   */
  calculatePredictionConfidence(field, progress) {
    let confidence = 0.5; // Базовая уверенность
    
    // Увеличиваем уверенность при наличии данных
    if (field.plantingDate) confidence += 0.1;
    if (field.expectedHarvestDate) confidence += 0.1;
    if (field.soilType) confidence += 0.05;
    if (field.irrigationSystem && field.irrigationSystem !== 'none') confidence += 0.05;
    if (field.currentYield > 0) confidence += 0.1;
    
    // Уверенность зависит от прогресса сезона
    if (progress > 50) confidence += 0.15;
    if (progress > 75) confidence += 0.1;
    
    return Math.min(0.95, confidence);
  }
  
  /**
   * Получение рекомендаций по урожайности
   */
  getYieldRecommendations(field, predictedYield) {
    const recommendations = [];
    const expectedYield = field.expectedYield || this.getBaseYieldForCrop(field.cropType);
    
    if (predictedYield < expectedYield * 0.8) {
      recommendations.push({
        type: 'warning',
        message: `Прогнозируемая урожайность (${predictedYield.toFixed(1)} т/га) ниже ожидаемой (${expectedYield} т/га)`,
        action: 'Рассмотрите возможность дополнительных мер: внесение удобрений, увеличение полива, обработка от вредителей'
      });
    } else if (predictedYield > expectedYield * 1.2) {
      recommendations.push({
        type: 'positive',
        message: `Прогнозируемая урожайность (${predictedYield.toFixed(1)} т/га) выше ожидаемой (${expectedYield} т/га)`,
        action: 'Продолжайте текущую стратегию ухода. Рассмотрите возможность расширения посевов'
      });
    }
    
    return recommendations;
  }
  
  /**
   * Сезонные советы
   */
  getSeasonalTips(month, region) {
    const tips = [];
    
    if (month >= 3 && month <= 5) { // Весна
      tips.push({
        title: 'Весенняя подготовка полей',
        content: 'Проведите боронование и культивацию для подготовки почвы к посеву.',
        priority: 'high',
        category: 'field_preparation'
      });
    }
    
    if (month >= 6 && month <= 8) { // Лето
      tips.push({
        title: 'Контроль влажности почвы',
        content: 'Регулярно проверяйте влажность почвы. Оптимальная влажность для большинства культур: 60-80%.',
        priority: 'medium',
        category: 'irrigation'
      });
    }
    
    if (month >= 9 && month <= 11) { // Осень
      tips.push({
        title: 'Подготовка к зиме',
        content: 'После сбора урожая проведите лущение стерни и внесите органические удобрения.',
        priority: 'high',
        category: 'winter_preparation'
      });
    }
    
    return tips;
  }
  
  /**
   * Советы по конкретному полю
   */
  getFieldSpecificTips(field, month) {
    const tips = [];
    
    if (field.status === 'problems') {
      tips.push({
        title: `Требуется внимание: ${field.name}`,
        content: 'Поле имеет статус "Проблемы". Проведите осмотр и примите меры.',
        priority: 'critical',
        category: 'field_maintenance',
        fieldId: field._id
      });
    }
    
    if (field.cropType === 'wheat' && month === 6) {
      tips.push({
        title: 'Обработка пшеницы',
        content: 'Июнь - время для обработки пшеницы от болезней и вредителей.',
        priority: 'high',
        category: 'treatment',
        fieldId: field._id
      });
    }
    
    return tips;
  }
  
  /**
   * Советы по задачам
   */
  getTaskTips(tasks) {
    const tips = [];
    const now = new Date();
    
    tasks.forEach(task => {
      const dueDate = new Date(task.dueDate);
      const daysUntilDue = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));
      
      if (daysUntilDue <= 3 && task.priority === 'high') {
        tips.push({
          title: `Срочная задача: ${task.title}`,
          content: `Задача должна быть выполнена через ${daysUntilDue} дней. Приоритет: высокий.`,
          priority: 'critical',
          category: 'task_reminder',
          taskId: task._id
        });
      }
    });
    
    return tips;
  }
  
  /**
   * Советы на основе погоды
   */
  async getWeatherBasedTips(region) {
    try {
      return [
        {
          title: 'Проверьте прогноз погоды',
          content: 'Планируйте сельскохозяйственные работы с учетом прогноза погоды на неделю.',
          priority: 'medium',
          category: 'weather'
        }
      ];
    } catch (error) {
      return [];
    }
  }
  
  /**
   * Определение времени года
   */
  getSeason(date) {
    const month = date.getMonth() + 1;
    
    if (month >= 3 && month <= 5) return 'весна';
    if (month >= 6 && month <= 8) return 'лето';
    if (month >= 9 && month <= 11) return 'осень';
    return 'зима';
  }
  
  /**
   * Получение релевантного периода
   */
  getRelevantPeriod() {
    const now = new Date();
    return {
      start: now,
      end: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) // +7 дней
    };
  }
  
  /**
   * Сохранение в историю
   */
  async saveToHistory(userId, data) {
    try {
      console.log('✅ Сохранение в историю AI:', { userId, ...data });
      // Здесь можно добавить сохранение в БД
    } catch (error) {
      console.error('Ошибка сохранения в историю:', error.message);
    }
  }
  
  /**
   * Извлечение источников из ответа
   */
  extractSources(answer) {
    const sources = [];
    
    if (answer.includes('рекомендую') || answer.includes('советую')) {
      sources.push('Рекомендации основаны на общих агрономических принципах');
    }
    
    if (answer.includes('исследования') || answer.includes('исследование')) {
      sources.push('Научные исследования в области сельского хозяйства');
    }
    
    if (answer.includes('опыт') || answer.includes('практика')) {
      sources.push('Практический опыт успешных фермеров');
    }
    
    return sources.length > 0 ? sources : ['Общедоступные агрономические знания'];
  }
  
  /**
   * Парсинг ответа диагностики
   */
  parseDiagnosisResponse(response) {
    const lines = response.split('\n').filter(line => line.trim());
    
    return {
      diagnosis: response,
      parsed: {
        disease: this.extractValue(lines, 'заболевание'),
        probability: this.extractValue(lines, 'вероятность'),
        treatment: this.extractSection(lines, 'лечение'),
        prevention: this.extractSection(lines, 'профилактика')
      }
    };
  }
  
  extractValue(lines, keyword) {
    const line = lines.find(l => l.toLowerCase().includes(keyword));
    return line ? line.split(':').slice(1).join(':').trim() : null;
  }
  
  extractSection(lines, keyword) {
    const startIndex = lines.findIndex(l => l.toLowerCase().includes(keyword));
    if (startIndex === -1) return null;
    
    const section = [];
    for (let i = startIndex + 1; i < lines.length; i++) {
      if (lines[i].trim() && !lines[i].includes(':')) break;
      section.push(lines[i].trim());
    }
    
    return section.join('\n');
  }
  
  /**
   * Расчет общей уверенности прогнозов
   */
  calculateOverallConfidence(predictions) {
    if (predictions.length === 0) return 0;
    
    const totalConfidence = predictions.reduce((sum, p) => sum + p.confidence, 0);
    return totalConfidence / predictions.length;
  }
  
  /**
   * Мок-советы
   */
  getMockAdvice(question, context) {
    const mockResponses = [
      `На основе вашего вопроса "${question.substring(0, 50)}..." и контекста, рекомендую следующее: Проверьте влажность почвы на всех полях, особенно тех, где выращивается пшеница. Оптимальная влажность для текущего сезона - 65-75%.`,
      `Учитывая предоставленную информацию, советую: Внесите азотные удобрения в количестве 150 кг/га на поля с зерновыми культурами. Лучшее время для внесения - утро после небольшого дождя.`,
      `Рекомендация: Проведите профилактическую обработку от грибковых заболеваний. Используйте системные фунгициды согласно инструкции производителя. Обработку лучше проводить в сухую безветренную погоду.`,
      `Совет: Увеличьте частоту полива на 20% в ближайшие 7 дней из-за прогнозируемой жаркой погоды. Поливайте рано утром или поздно вечером для уменьшения испарения.`
    ];
    
    return {
      success: true,
      answer: mockResponses[Math.floor(Math.random() * mockResponses.length)],
      sources: ['База знаний Agro Suite', 'Рекомендации опытных агрономов'],
      confidence: 0.85,
      timestamp: new Date(),
      isMock: true
    };
  }
  
  /**
   * Мок-диагностика
   */
  getMockDiagnosis(symptoms, plantType) {
    return {
      success: true,
      diagnosis: `На основе описания симптомов "${symptoms.substring(0, 100)}..." для растения типа "${plantType}", вероятное заболевание: Мучнистая роса (вероятность 75%).\n\nЛечение: Обработка системными фунгицидами (например, Топаз, Скор).\nПрофилактика: Регулярное проветривание, умеренный полив, удаление пораженных частей.`,
      parsed: {
        disease: 'Мучнистая роса',
        probability: '75%',
        treatment: 'Обработка системными фунгицидами (Топаз, Скор) согласно инструкции',
        prevention: 'Регулярное проветривание, умеренный полив, удаление пораженных частей'
      },
      confidence: 0.8,
      timestamp: new Date(),
      isMock: true
    };
  }
  
  /**
   * Мок-советы
   */
  getMockTips() {
    return {
      success: true,
      tips: [
        {
          title: 'Проверка оборудования',
          content: 'Перед началом сезона проверьте все сельскохозяйственное оборудование на исправность.',
          priority: 'medium',
          category: 'equipment'
        },
        {
          title: 'Запас семян',
          content: 'Убедитесь, что у вас есть достаточный запас семян для планируемых посевов.',
          priority: 'high',
          category: 'seeds'
        }
      ],
      generatedAt: new Date(),
      relevantFor: this.getRelevantPeriod(),
      isMock: true
    };
  }
  
  /**
   * Мок-прогнозы
   */
  getMockPredictions() {
    return {
      success: true,
      predictions: [
        {
          fieldId: 'mock_field_1',
          fieldName: 'Поле №1',
          cropType: 'wheat',
          predictedYield: 3.8,
          currentYield: 0,
          progress: 45,
          confidence: 0.75,
          factors: {
            cropType: 'wheat',
            fieldStatus: 'growing',
            quality: 'good',
            seasonProgress: 45
          }
        }
      ],
      confidence: 0.75,
      generatedAt: new Date(),
      isMock: true
    };
  }
}

module.exports = new AIService();