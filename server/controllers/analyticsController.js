const Diary = require('../models/Diary');
const Field = require('../models/Field');
const Task = require('../models/Task');

exports.getOverview = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Получаем данные из всех источников
    const [fields, diaryStats, taskStats, weatherData] = await Promise.all([
      Field.find({ userId }).select('name cropType area status currentYield'),
      Diary.aggregate([
        { $match: { userId } },
        { 
          $group: {
            _id: null,
            totalEntries: { $sum: 1 },
            lastWeekEntries: {
              $sum: {
                $cond: [
                  { $gte: ['$date', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)] },
                  1, 0
                ]
              }
            },
            totalCost: { $sum: '$metrics.cost' }
          }
        }
      ]),
      Task.aggregate([
        { $match: { userId } },
        {
          $group: {
            _id: null,
            totalTasks: { $sum: 1 },
            completedTasks: {
              $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
            },
            overdueTasks: {
              $sum: { $cond: [{ $eq: ['$status', 'overdue'] }, 1, 0] }
            }
          }
        }
      ])
    ]);
    
    // Рассчитываем общую статистику
    const totalArea = fields.reduce((sum, field) => sum + field.area, 0);
    const totalYield = fields.reduce((sum, field) => sum + (field.currentYield || 0), 0);
    const activeFields = fields.filter(f => f.status !== 'fallow' && f.status !== 'harvested').length;
    
    const overview = {
      fields: {
        total: fields.length,
        active: activeFields,
        totalArea: Math.round(totalArea * 100) / 100,
        averageYield: fields.length > 0 ? totalYield / fields.length : 0
      },
      diary: diaryStats[0] || { totalEntries: 0, lastWeekEntries: 0, totalCost: 0 },
      tasks: taskStats[0] || { totalTasks: 0, completedTasks: 0, overdueTasks: 0 },
      financial: {
        totalCost: diaryStats[0]?.totalCost || 0,
        // Здесь можно добавить больше финансовых данных
      }
    };
    
    res.json({
      success: true,
      overview,
      generatedAt: new Date()
    });
  } catch (error) {
    console.error('Ошибка получения общей аналитики:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка получения аналитики.'
    });
  }
};

// Другие методы контроллера аналитики...
// Add these functions to your analyticsController.js

// Get financial analytics (this is the missing one causing the error)
exports.getFinancialAnalytics = async (req, res) => {
    try {
        const { period = 'monthly', startDate, endDate } = req.query;
        
        // Mock financial data
        const financialData = {
            summary: {
                totalRevenue: 125000,
                totalExpenses: 45000,
                netProfit: 80000,
                profitMargin: '64%'
            },
            revenueByMonth: [
                { month: 'Jan', revenue: 10000, expenses: 4000 },
                { month: 'Feb', revenue: 12000, expenses: 4500 },
                { month: 'Mar', revenue: 15000, expenses: 5000 },
                { month: 'Apr', revenue: 18000, expenses: 5500 },
                { month: 'May', revenue: 20000, expenses: 6000 },
                { month: 'Jun', revenue: 22000, expenses: 6500 }
            ],
            expenseBreakdown: [
                { category: 'Seeds & Planting', amount: 12000, percentage: 27 },
                { category: 'Fertilizers', amount: 10000, percentage: 22 },
                { category: 'Labor', amount: 9000, percentage: 20 },
                { category: 'Equipment', amount: 8000, percentage: 18 },
                { category: 'Utilities', amount: 5000, percentage: 11 },
                { category: 'Other', amount: 1000, percentage: 2 }
            ],
            topPerformingCrops: [
                { crop: 'Corn', revenue: 45000, profit: 32000 },
                { crop: 'Wheat', revenue: 40000, profit: 28000 },
                { crop: 'Soybeans', revenue: 30000, profit: 15000 },
                { crop: 'Vegetables', revenue: 10000, profit: 5000 }
            ]
        };
        
        res.json({
            success: true,
            period,
            startDate: startDate || '2024-01-01',
            endDate: endDate || '2024-06-30',
            data: financialData,
            generatedAt: new Date().toISOString(),
            note: 'Mock financial analytics data'
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
};

// Get yield analytics
exports.getYieldAnalytics = async (req, res) => {
    try {
        res.json({
            success: true,
            yield: {
                totalYield: '150 tons',
                averagePerHectare: '5.2 tons',
                byCrop: [
                    { crop: 'Corn', yield: '8.5 tons/ha', area: '10 ha', total: '85 tons' },
                    { crop: 'Wheat', yield: '4.2 tons/ha', area: '15 ha', total: '63 tons' },
                    { crop: 'Soybeans', yield: '2.5 tons/ha', area: '8 ha', total: '20 tons' }
                ],
                byField: [
                    { field: 'North Field', yield: '6.1 tons/ha', crop: 'Corn' },
                    { field: 'South Field', yield: '4.8 tons/ha', crop: 'Wheat' },
                    { field: 'East Field', yield: '5.5 tons/ha', crop: 'Corn' },
                    { field: 'West Field', yield: '3.2 tons/ha', crop: 'Soybeans' }
                ],
                trends: {
                    currentVsPrevious: '+12%',
                    fiveYearAverage: '4.8 tons/ha'
                }
            },
            generatedAt: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
};

// Get field analytics
exports.getFieldAnalytics = async (req, res) => {
    try {
        const { fieldId } = req.params;
        
        res.json({
            success: true,
            fieldId: fieldId || 'all',
            analytics: {
                soilHealth: {
                    score: 8.2,
                    pH: 6.5,
                    organicMatter: '3.2%',
                    nutrients: {
                        nitrogen: 'Medium',
                        phosphorus: 'Low',
                        potassium: 'High'
                    }
                },
                productivity: {
                    currentYield: '6.1 tons/ha',
                    historicalAverage: '5.8 tons/ha',
                    ranking: '2nd of 4 fields'
                },
                waterUsage: {
                    efficiency: 'Good',
                    consumption: '5000 m³',
                    rainfallContribution: '65%'
                },
                recommendations: [
                    'Add phosphorus fertilizer before next planting',
                    'Consider cover cropping to improve soil structure',
                    'Schedule irrigation system maintenance'
                ]
            },
            generatedAt: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
};

// Get crop analytics
exports.getCropAnalytics = async (req, res) => {
    try {
        const { cropType } = req.query;
        
        res.json({
            success: true,
            cropType: cropType || 'all',
            analytics: {
                performance: {
                    averageYield: '5.8 tons/ha',
                    marketPrice: '$210/ton',
                    profitPerHectare: '$850',
                    costOfProduction: '$1250/hectare'
                },
                growthMetrics: {
                    germinationRate: '92%',
                    growthDuration: '120 days',
                    harvestIndex: '0.45'
                },
                challenges: [
                    { issue: 'Pest pressure', severity: 'Medium', impact: 'Reduces yield by 5-10%' },
                    { issue: 'Water stress', severity: 'Low', impact: 'Minimal with current irrigation' },
                    { issue: 'Market volatility', severity: 'High', impact: 'Price fluctuations up to 30%' }
                ],
                bestPractices: [
                    'Plant in well-drained soil with pH 6.0-7.0',
                    'Maintain consistent moisture during critical growth stages',
                    'Implement integrated pest management'
                ]
            },
            generatedAt: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
};

// Get seasonal analytics
exports.getSeasonalAnalytics = async (req, res) => {
    try {
        const { season } = req.query;
        
        res.json({
            success: true,
            season: season || '2024',
            analytics: {
                summary: {
                    totalArea: '45 hectares',
                    totalProduction: '250 tons',
                    totalRevenue: '$125,000',
                    totalProfit: '$75,000'
                },
                seasonalComparison: {
                    previousSeason: {
                        production: '220 tons',
                        revenue: '$110,000',
                        profit: '$65,000'
                    },
                    change: {
                        production: '+13.6%',
                        revenue: '+13.6%',
                        profit: '+15.4%'
                    }
                },
                monthlyPerformance: [
                    { month: 'Jan', activity: 'Planning & Preparation', progress: '100%' },
                    { month: 'Feb', activity: 'Land Preparation', progress: '100%' },
                    { month: 'Mar', activity: 'Planting', progress: '100%' },
                    { month: 'Apr', activity: 'Early Growth', progress: '100%' },
                    { month: 'May', activity: 'Main Growth', progress: '80%' },
                    { month: 'Jun', activity: 'Late Growth', progress: '60%' },
                    { month: 'Jul', activity: 'Harvest Preparation', progress: '40%' },
                    { month: 'Aug', activity: 'Harvest', progress: '20%' }
                ]
            },
            generatedAt: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
};

// Get reports
exports.getReports = async (req, res) => {
    try {
        res.json({
            success: true,
            reports: [
                {
                    id: 'rep_001',
                    title: 'Q1 2024 Financial Report',
                    type: 'financial',
                    createdDate: '2024-03-31',
                    size: '2.4 MB',
                    status: 'completed'
                },
                {
                    id: 'rep_002',
                    title: 'Spring Planting Analysis',
                    type: 'operational',
                    createdDate: '2024-04-15',
                    size: '1.8 MB',
                    status: 'completed'
                },
                {
                    id: 'rep_003',
                    title: 'Soil Health Assessment',
                    type: 'technical',
                    createdDate: '2024-05-20',
                    size: '3.2 MB',
                    status: 'in-progress'
                }
            ],
            totalReports: 3,
            generatedAt: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
};

// Generate report
exports.generateReport = async (req, res) => {
    try {
        const { reportType, startDate, endDate, format = 'pdf' } = req.body;
        
        res.json({
            success: true,
            message: `Report generation started for ${reportType}`,
            reportId: `rep_${Date.now()}`,
            details: {
                type: reportType,
                period: `${startDate} to ${endDate}`,
                format,
                estimatedCompletion: '2 minutes'
            },
            status: 'processing',
            startedAt: new Date().toISOString(),
            downloadUrl: `/api/analytics/reports/rep_${Date.now()}.${format}`
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
};

// Get specific report
exports.getReport = async (req, res) => {
    try {
        const { reportId } = req.params;
        
        res.json({
            success: true,
            reportId,
            report: {
                id: reportId,
                title: 'Financial Report Q2 2024',
                type: 'financial',
                generatedDate: '2024-06-30',
                content: {
                    summary: 'Strong quarter with 15% revenue growth',
                    sections: [
                        'Executive Summary',
                        'Revenue Analysis',
                        'Expense Breakdown',
                        'Profitability Metrics',
                        'Recommendations'
                    ]
                },
                status: 'completed',
                size: '2.1 MB',
                format: 'pdf'
            },
            generatedAt: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
};

// Delete report
exports.deleteReport = async (req, res) => {
    try {
        const { reportId } = req.params;
        
        res.json({
            success: true,
            message: `Report ${reportId} deleted successfully`,
            reportId,
            deletedAt: new Date().toISOString(),
            note: 'Mock deletion - no actual database operation'
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
};

// Export data
exports.exportData = async (req, res) => {
    try {
        const { format = 'csv', dataType } = req.query;
        
        res.json({
            success: true,
            message: `Data export started for ${dataType} in ${format} format`,
            exportId: `exp_${Date.now()}`,
            details: {
                dataType: dataType || 'all',
                format,
                estimatedSize: '4.8 MB',
                estimatedCompletion: '1 minute'
            },
            status: 'processing',
            startedAt: new Date().toISOString(),
            downloadUrl: `/api/analytics/export/exp_${Date.now()}.${format}`
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
};