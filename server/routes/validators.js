/**
 * Валидаторы для различных типов данных
 */

/**
 * Валидация email
 */
exports.isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Валидация пароля
 */
exports.isValidPassword = (password) => {
  // Минимум 6 символов, хотя бы одна цифра и одна буква
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/;
  return passwordRegex.test(password);
};

/**
 * Валидация номера телефона (русский формат)
 */
exports.isValidPhone = (phone) => {
  const phoneRegex = /^(\+7|8)[\s\-]?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}$/;
  return phoneRegex.test(phone);
};

/**
 * Валидация координат
 */
exports.isValidCoordinates = (lat, lng) => {
  return (
    typeof lat === 'number' && 
    typeof lng === 'number' &&
    lat >= -90 && lat <= 90 &&
    lng >= -180 && lng <= 180
  );
};

/**
 * Валидация даты
 */
exports.isValidDate = (dateString) => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
};

/**
 * Валидация площади (в гектарах)
 */
exports.isValidArea = (area) => {
  return (
    typeof area === 'number' &&
    area > 0 &&
    area <= 10000 // Максимум 10,000 га
  );
};

/**
 * Валидация урожайности (т/га)
 */
exports.isValidYield = (yieldValue) => {
  return (
    typeof yieldValue === 'number' &&
    yieldValue >= 0 &&
    yieldValue <= 100 // Максимум 100 т/га
  );
};

/**
 * Валидация стоимости
 */
exports.isValidCost = (cost) => {
  return (
    typeof cost === 'number' &&
    cost >= 0 &&
    cost <= 100000000 // Максимум 100 миллионов
  );
};

/**
 * Валидация MongoDB ID
 */
exports.isValidObjectId = (id) => {
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  return objectIdRegex.test(id);
};

/**
 * Валидация массива тегов
 */
exports.isValidTags = (tags) => {
  if (!Array.isArray(tags)) return false;
  
  return tags.every(tag => 
    typeof tag === 'string' && 
    tag.trim().length > 0 && 
    tag.trim().length <= 50
  );
};

/**
 * Валидация URL изображения
 */
exports.isValidImageUrl = (url) => {
  try {
    const parsedUrl = new URL(url);
    const validProtocols = ['http:', 'https:'];
    const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    
    return (
      validProtocols.includes(parsedUrl.protocol) &&
      validExtensions.some(ext => parsedUrl.pathname.toLowerCase().endsWith(ext))
    );
  } catch {
    return false;
  }
};

/**
 * Валидация объекта погодных условий
 */
exports.isValidWeatherConditions = (weather) => {
  if (typeof weather !== 'object' || weather === null) return false;
  
  const validFields = ['temperature', 'humidity', 'precipitation', 'windSpeed', 'condition'];
  
  return validFields.some(field => field in weather);
};

/**
 * Валидация метрик активности
 */
exports.isValidActivityMetrics = (metrics) => {
  if (typeof metrics !== 'object' || metrics === null) return true; // Необязательное поле
  
  const validFields = ['area', 'volume', 'quantity', 'duration', 'cost'];
  
  return Object.keys(metrics).every(field => 
    validFields.includes(field) && 
    typeof metrics[field] === 'number' && 
    metrics[field] >= 0
  );
};

/**
 * Валидация настроения
 */
exports.isValidMood = (mood) => {
  const validMoods = ['excellent', 'good', 'normal', 'bad', 'terrible'];
  return validMoods.includes(mood);
};

/**
 * Валидация приоритета
 */
exports.isValidPriority = (priority) => {
  const validPriorities = ['low', 'medium', 'high', 'critical'];
  return validPriorities.includes(priority);
};

/**
 * Валидация статуса
 */
exports.isValidStatus = (status, type = 'task') => {
  const statuses = {
    task: ['pending', 'in_progress', 'completed', 'cancelled', 'overdue'],
    field: ['planning', 'preparation', 'planted', 'growing', 'flowering', 'fruiting', 'harvesting', 'harvested', 'fallow', 'problems'],
    diary: ['draft', 'published', 'archived']
  };
  
  return statuses[type]?.includes(status) || false;
};

/**
 * Валидация типа активности
 */
exports.isValidActivityType = (type) => {
  const validTypes = [
    'sowing', 'watering', 'fertilizing', 'treatment',
    'harvesting', 'maintenance', 'inspection',
    'planning', 'other'
  ];
  
  return validTypes.includes(type);
};

/**
 * Валидация типа задачи
 */
exports.isValidTaskType = (type) => {
  const validTypes = [
    'sowing', 'watering', 'fertilizing', 'treatment',
    'harvesting', 'maintenance', 'inspection',
    'purchase', 'meeting', 'report', 'other'
  ];
  
  return validTypes.includes(type);
};

/**
 * Валидация типа культуры
 */
exports.isValidCropType = (type) => {
  const validTypes = [
    'wheat', 'corn', 'sunflower', 'barley', 'rye',
    'oat', 'rape', 'soybean', 'potato', 'vegetables',
    'fruits', 'berries', 'other'
  ];
  
  return validTypes.includes(type);
};

/**
 * Валидация типа почвы
 */
exports.isValidSoilType = (type) => {
  const validTypes = ['chernozem', 'loam', 'sandy', 'clay', 'peat', 'other'];
  return validTypes.includes(type);
};

/**
 * Валидация системы полива
 */
exports.isValidIrrigationSystem = (system) => {
  const validSystems = ['drip', 'sprinkler', 'flood', 'none', 'other'];
  return validSystems.includes(system);
};

/**
 * Валидация единиц измерения
 */
exports.isValidUnit = (unit, type = 'area') => {
  const units = {
    area: ['hectare', 'acre'],
    volume: ['liter', 'cubic_meter', 'gallon'],
    weight: ['kilogram', 'ton', 'pound'],
    length: ['meter', 'kilometer', 'mile']
  };
  
  return units[type]?.includes(unit) || false;
};

/**
 * Валидация качества
 */
exports.isValidQuality = (quality) => {
  const validQualities = ['excellent', 'good', 'average', 'poor', 'critical'];
  return validQualities.includes(quality);
};

/**
 * Валидация типа сенсора
 */
exports.isValidSensorType = (type) => {
  const validTypes = ['moisture', 'temperature', 'ph', 'nutrient'];
  return validTypes.includes(type);
};

/**
 * Валидация статуса сенсора
 */
exports.isValidSensorStatus = (status) => {
  const validStatuses = ['active', 'inactive', 'error'];
  return validStatuses.includes(status);
};

/**
 * Валидация шаблона повторения
 */
exports.isValidRecurrencePattern = (pattern) => {
  const validPatterns = ['none', 'daily', 'weekly', 'monthly', 'yearly'];
  return validPatterns.includes(pattern);
};

/**
 * Санкционирование ввода (защита от XSS)
 */
exports.sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
};

/**
 * Валидация и санкционирование объекта
 */
exports.sanitizeObject = (obj, schema) => {
  const sanitized = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (schema[key]) {
      if (typeof value === 'string') {
        sanitized[key] = this.sanitizeInput(value);
      } else if (Array.isArray(value)) {
        sanitized[key] = value.map(item => 
          typeof item === 'string' ? this.sanitizeInput(item) : item
        );
      } else {
        sanitized[key] = value;
      }
    }
  }
  
  return sanitized;
};

/**
 * Проверка обязательных полей
 */
exports.checkRequiredFields = (data, requiredFields) => {
  const missingFields = [];
  
  for (const field of requiredFields) {
    if (data[field] === undefined || data[field] === null || data[field] === '') {
      missingFields.push(field);
    }
  }
  
  return {
    isValid: missingFields.length === 0,
    missingFields
  };
};

/**
 * Форматирование ошибок валидации
 */
exports.formatValidationErrors = (errors) => {
  return errors.map(error => ({
    field: error.path,
    message: error.msg
  }));
};

/**
 * Генерация уникального кода
 */
exports.generateUniqueCode = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return code;
};

/**
 * Проверка разрешения файла
 */
exports.isValidFileExtension = (filename, allowedExtensions) => {
  const extension = filename.split('.').pop().toLowerCase();
  return allowedExtensions.includes(extension);
};

/**
 * Валидация размера файла
 */
exports.isValidFileSize = (size, maxSizeMB) => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return size <= maxSizeBytes;
};