import axiosInstance from './axiosConfig';

export const aiAPI = {
  getRecommendations: async (fieldData, weatherData) => {
    // Моковые рекомендации от ИИ
    return new Promise((resolve) => {
      setTimeout(() => {
        const recommendations = [
          {
            id: 1,
            type: 'fertilizer',
            title: 'Рекомендация по удобрениям',
            description: 'На основании анализа почвы рекомендуется внести азотные удобрения в количестве 0g.',
            priority: 'high',
            action: 'Внести удобрения в течение 3 дней',
            estimatedCost: 45000,
            estimatedTime: '100 day',
            confidence: 39
          },
          {
            id: 2,
            type: 'irrigation',
            title: 'Оптимизация полива',
            description: 'Текущий уровень влажности 45%. Рекомендуется увеличить полив на 20% в утренние часы.',
            priority: 'medium',
            action: 'Настроить систему полива',
            estimatedCost: 0,
            estimatedTime: '1 час',
            confidence: 78
          },
          {
            id: 3,
            type: 'pest',
            title: 'Профилактика вредителей',
            description: 'Высокая вероятность появления колорадских жуков. Рекомендуется профилактическая обработка.',
            priority: 'medium',
            action: 'Провести обработку биопрепаратами',
            estimatedCost: 25000,
            estimatedTime: '1 день',
            confidence: 65
          },
          {
            id: 4,
            type: 'harvest',
            title: 'Оптимальное время сбора',
            description: 'Культура достигла оптимальной зрелости. Рекомендуется начать сбор урожая в течение недели.',
            priority: 'high',
            action: 'Подготовить технику к сбору',
            estimatedCost: 0,
            estimatedTime: 'Подготовка 3 дня',
            confidence: 92
          }
        ];

        resolve({
          data: {
            recommendations,
            summary: {
              total: recommendations.length,
              highPriority: recommendations.filter(r => r.priority === 'high').length,
              estimatedTotalCost: recommendations.reduce((sum, r) => sum + r.estimatedCost, 0)
            }
          }
        });
      }, 800);
    });
  },

  analyzeFieldImage: async (imageFile) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            analysis: {
              cropHealth: 78,
              weedPresence: 15,
              diseaseRisk: 8,
              recommendations: [
                'Обнаружены признаки легкого хлороза',
                'Рекомендуется внекорневая подкормка',
                'Уровень сорняков в пределах нормы'
              ]
            }
          }
        });
      }, 1500);
    });
  },

  predictYield: async (fieldId, historicalData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            prediction: {
              estimatedYield: 35.5, // ц/га
              confidence: 82,
              factors: [
                { name: 'Погодные условия', impact: '+8%' },
                { name: 'Качество семян', impact: '+5%' },
                { name: 'Своевременный полив', impact: '+12%' },
                { name: 'Вредители', impact: '-3%' }
              ],
              recommendedActions: [
                'Увеличить полив на 15% в течение 2 недель',
                'Провести дополнительную подкормку'
              ]
            }
          }
        });
      }, 1000);
    });
  },

  getWeatherInsights: async (weatherData, cropType) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            insights: [
              {
                type: 'warning',
                text: 'Ожидается похолодание. Рекомендуется отложить посев на 3 дня.',
                impact: 'medium'
              },
              {
                type: 'opportunity',
                text: 'Благоприятные условия для внесения удобрений.',
                impact: 'high'
              },
              {
                type: 'info',
                text: 'Оптимальная температура для роста культуры.',
                impact: 'low'
              }
            ]
          }
        });
      }, 600);
    });
  }
};