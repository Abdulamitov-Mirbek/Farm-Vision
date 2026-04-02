const corsOptions = {
  origin: function (origin, callback) {
    // Разрешенные домены
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173',
      'https://agrosuite.ru',
      'https://www.agrosuite.ru'
    ];
    
    // Разрешить запросы без origin (например, от Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Заблокировано политикой CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin'
  ],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400 // 24 часа
};

module.exports = corsOptions;