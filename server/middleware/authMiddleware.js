// server/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware для проверки аутентификации пользователя
 * Проверяет наличие и валидность JWT токена
 */
const protect = async (req, res, next) => {
  try {
    let token;
    
    // Проверяем заголовок Authorization
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    // Проверяем наличие токена в cookies (если используется)
    if (!token && req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }
    
    // Если токен не найден
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Доступ запрещен. Токен не предоставлен.'
      });
    }
    
    // Верифицируем токен
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtError) {
      // Обрабатываем разные ошибки JWT
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Токен истек. Пожалуйста, войдите снова.'
        });
      } else if (jwtError.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          message: 'Недействительный токен.'
        });
      } else {
        throw jwtError;
      }
    }
    
    // Проверяем наличие ID в декодированном токене
    if (!decoded || !decoded.id) {
      return res.status(401).json({
        success: false,
        message: 'Недействительный токен: отсутствует ID пользователя.'
      });
    }
    
    // Находим пользователя в базе данных
    const user = await User.findById(decoded.id).select('-password -__v');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Пользователь с таким токеном не найден.'
      });
    }
    
    // Проверяем активен ли пользователь
    if (user.isActive === false) {
      return res.status(403).json({
        success: false,
        message: 'Ваша учетная запись заблокирована. Обратитесь к администратору.'
      });
    }
    
    // Добавляем пользователя в объект запроса
    req.user = user;
    
    // Добавляем userId для удобства
    req.userId = user._id;
    
    // Логируем успешную авторизацию (опционально)
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ Пользователь авторизован: ${user.email} (${user._id})`);
    }
    
    next();
  } catch (error) {
    console.error('❌ Ошибка в middleware аутентификации:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Внутренняя ошибка сервера при проверке аутентификации.'
    });
  }
};

/**
 * Middleware для проверки роли администратора
 */
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Доступ запрещен. Требуются права администратора.'
    });
  }
};

/**
 * Middleware для проверки роли пользователя (не обязательно админ)
 */
const user = (req, res, next) => {
  if (req.user && (req.user.role === 'user' || req.user.role === 'admin')) {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Доступ запрещен. Требуется авторизация.'
    });
  }
};

/**
 * Middleware для проверки владельца ресурса
 * @param {Function} getResourceId - Функция для получения ID ресурса из запроса
 */
const checkOwnership = (getResourceId) => {
  return async (req, res, next) => {
    try {
      const resourceId = getResourceId(req);
      
      if (!resourceId) {
        return res.status(400).json({
          success: false,
          message: 'ID ресурса не указан.'
        });
      }
      
      // Здесь должна быть логика проверки принадлежности ресурса пользователю
      // В зависимости от модели данных
      
      // Пример для ресурса, который имеет поле userId
      const Resource = req.resourceModel; // Должна быть передана модель
      
      if (Resource) {
        const resource = await Resource.findById(resourceId);
        
        if (!resource) {
          return res.status(404).json({
            success: false,
            message: 'Ресурс не найден.'
          });
        }
        
        if (resource.userId && resource.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
          return res.status(403).json({
            success: false,
            message: 'Доступ запрещен. Вы не являетесь владельцем этого ресурса.'
          });
        }
      }
      
      next();
    } catch (error) {
      console.error('❌ Ошибка проверки владельца:', error);
      return res.status(500).json({
        success: false,
        message: 'Ошибка при проверке прав доступа к ресурсу.'
      });
    }
  };
};

/**
 * Middleware для опциональной аутентификации
 * Не требует токена, но если он есть - добавляет пользователя
 */
const optionalAuth = async (req, res, next) => {
  try {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        if (decoded && decoded.id) {
          const user = await User.findById(decoded.id).select('-password');
          if (user) {
            req.user = user;
          }
        }
      } catch (error) {
        // Игнорируем ошибки токена при опциональной аутентификации
        console.log('⚠️ Опциональная аутентификация: недействительный токен');
      }
    }
    
    next();
  } catch (error) {
    console.error('❌ Ошибка в optionalAuth middleware:', error);
    next();
  }
};

/**
 * Middleware для проверки наличия необходимых ролей
 * @param  {...string} roles - Список разрешенных ролей
 */
const hasRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Не авторизован.'
      });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Доступ запрещен. Требуется роль: ${roles.join(' или ')}.`
      });
    }
    
    next();
  };
};

/**
 * Middleware для логирования запросов (только для разработки)
 */
const requestLogger = (req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    const start = Date.now();
    
    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log(`${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`);
    });
  }
  
  next();
};

/**
 * Middleware для проверки CSRF токена (если используется)
 */
const csrfProtection = (req, res, next) => {
  const csrfToken = req.headers['x-csrf-token'];
  const sessionToken = req.session?.csrfToken;
  
  if (!csrfToken || !sessionToken || csrfToken !== sessionToken) {
    return res.status(403).json({
      success: false,
      message: 'Недействительный CSRF токен.'
    });
  }
  
  next();
};

module.exports = {
  protect,
  admin,
  user,
  checkOwnership,
  optionalAuth,
  hasRole,
  requestLogger,
  csrfProtection
};