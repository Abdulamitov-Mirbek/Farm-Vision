/**
 * Middleware для обработки ошибок
 */
const errorMiddleware = (err, req, res, next) => {
  console.error('Ошибка:', err.stack);
  
  // Ошибка валидации Mongoose
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(error => ({
      field: error.path,
      message: error.message
    }));
    
    return res.status(400).json({
      success: false,
      message: 'Ошибка валидации данных',
      errors
    });
  }
  
  // Ошибка дублирования уникального поля
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      success: false,
      message: `Значение поля "${field}" уже существует.`
    });
  }
  
  // Ошибка JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Недействительный токен.'
    });
  }
  
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Токен истек.'
    });
  }
  
  // Ошибка CastError (неправильный формат ID)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Некорректный формат данных.'
    });
  }
  
  // Дефолтная ошибка сервера
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Внутренняя ошибка сервера.',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorMiddleware;