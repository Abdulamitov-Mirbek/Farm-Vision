const jwt = require('jsonwebtoken');

const authConfig = {
  secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
  expiresIn: process.env.JWT_EXPIRE || '7d',
  algorithm: 'HS256',
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000
  }
};

console.log('🔥 authConfig загружен, secret:', authConfig.secret.substring(0, 10) + '...');

// Генерация JWT токена - ИСПРАВЛЕНО!
const generateToken = (userId) => {
  console.log('🔥 generateToken вызван с userId:', userId);
  console.log('🔑 secret:', authConfig.secret.substring(0, 10) + '...');
  
  const token = jwt.sign(
    { 
      id: userId,      // ✅ Добавляем id для middleware
      userId: userId    // оставляем userId для совместимости
    },
    authConfig.secret,
    { expiresIn: authConfig.expiresIn, algorithm: authConfig.algorithm }
  );
  
  console.log('✅ Сгенерированный токен:', token.substring(0, 30) + '...');
  console.log('📏 Длина токена:', token.length);
  console.log('✅ Токен содержит поля: id и userId');
  
  return token;
};

// Верификация JWT токена
const verifyToken = (token) => {
  try {
    return jwt.verify(token, authConfig.secret);
  } catch (error) {
    return null;
  }
};

// Извлечение токена из заголовков
const extractToken = (req) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    return req.headers.authorization.split(' ')[1];
  }
  return null;
};

module.exports = {
  authConfig,
  generateToken,
  verifyToken,
  extractToken
};