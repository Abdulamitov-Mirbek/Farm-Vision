/**
 * Утилиты для работы с датами
 */

/**
 * Форматирование даты в русском формате
 */
exports.formatDate = (date, options = {}) => {
  const defaultOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  };
  
  return new Date(date).toLocaleDateString('ru-RU', { ...defaultOptions, ...options });
};

/**
 * Форматирование даты и времени
 */
exports.formatDateTime = (date) => {
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Получение начала дня
 */
exports.getStartOfDay = (date = new Date()) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

/**
 * Получение конца дня
 */
exports.getEndOfDay = (date = new Date()) => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
};

/**
 * Получение начала недели (понедельник)
 */
exports.getStartOfWeek = (date = new Date()) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
};

/**
 * Получение конца недели (воскресенье)
 */
exports.getEndOfWeek = (date = new Date()) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() + (day === 0 ? 0 : 7 - day);
  d.setDate(diff);
  d.setHours(23, 59, 59, 999);
  return d;
};

/**
 * Получение начала месяца
 */
exports.getStartOfMonth = (date = new Date()) => {
  const d = new Date(date);
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d;
};

/**
 * Получение конца месяца
 */
exports.getEndOfMonth = (date = new Date()) => {
  const d = new Date(date);
  d.setMonth(d.getMonth() + 1);
  d.setDate(0);
  d.setHours(23, 59, 59, 999);
  return d;
};

/**
 * Добавление дней к дате
 */
exports.addDays = (date, days) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

/**
 * Добавление месяцев к дате
 */
exports.addMonths = (date, months) => {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
};

/**
 * Разница между датами в днях
 */
exports.daysDifference = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2 - d1);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Проверка, является ли дата сегодняшним днем
 */
exports.isToday = (date) => {
  const today = new Date();
  const checkDate = new Date(date);
  
  return (
    checkDate.getDate() === today.getDate() &&
    checkDate.getMonth() === today.getMonth() &&
    checkDate.getFullYear() === today.getFullYear()
  );
};

/**
 * Проверка, является ли дата вчерашним днем
 */
exports.isYesterday = (date) => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  const checkDate = new Date(date);
  
  return (
    checkDate.getDate() === yesterday.getDate() &&
    checkDate.getMonth() === yesterday.getMonth() &&
    checkDate.getFullYear() === yesterday.getFullYear()
  );
};

/**
 * Проверка, находится ли дата в прошлом
 */
exports.isPastDate = (date) => {
  const checkDate = new Date(date);
  const today = new Date();
  return checkDate < today;
};

/**
 * Проверка, находится ли дата в будущем
 */
exports.isFutureDate = (date) => {
  const checkDate = new Date(date);
  const today = new Date();
  return checkDate > today;
};

/**
 * Получение названия дня недели
 */
exports.getDayName = (date, format = 'long') => {
  const days = {
    long: ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'],
    short: ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб']
  };
  
  const dayIndex = new Date(date).getDay();
  return days[format][dayIndex];
};

/**
 * Получение названия месяца
 */
exports.getMonthName = (date, format = 'long') => {
  const months = {
    long: [
      'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
      'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
    ],
    short: [
      'янв', 'фев', 'мар', 'апр', 'мая', 'июн',
      'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'
    ],
    nominative: [
      'январь', 'февраль', 'март', 'апрель', 'май', 'июнь',
      'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'
    ]
  };
  
  const monthIndex = new Date(date).getMonth();
  return months[format][monthIndex];
};

/**
 * Получение сезона по дате
 */
exports.getSeason = (date) => {
  const month = new Date(date).getMonth() + 1;
  
  if (month >= 3 && month <= 5) return 'весна';
  if (month >= 6 && month <= 8) return 'лето';
  if (month >= 9 && month <= 11) return 'осень';
  return 'зима';
};

/**
 * Получение квартала
 */
exports.getQuarter = (date) => {
  const month = new Date(date).getMonth() + 1;
  return Math.ceil(month / 3);
};

/**
 * Форматирование продолжительности
 */
exports.formatDuration = (minutes) => {
  if (minutes < 60) {
    return `${minutes} мин`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours} ч`;
  }
  
  return `${hours} ч ${remainingMinutes} мин`;
};

/**
 * Получение возрастной группы по дате посадки
 */
exports.getCropAgeGroup = (plantingDate) => {
  if (!plantingDate) return 'неизвестно';
  
  const ageInDays = this.daysDifference(plantingDate, new Date());
  
  if (ageInDays < 30) return 'молодая';
  if (ageInDays < 90) return 'среднего возраста';
  if (ageInDays < 180) return 'зрелая';
  return 'старая';
};

/**
 * Генерация диапазона дат
 */
exports.generateDateRange = (startDate, endDate, interval = 'day') => {
  const dates = [];
  let currentDate = new Date(startDate);
  const end = new Date(endDate);
  
  while (currentDate <= end) {
    dates.push(new Date(currentDate));
    
    switch (interval) {
      case 'day':
        currentDate.setDate(currentDate.getDate() + 1);
        break;
      case 'week':
        currentDate.setDate(currentDate.getDate() + 7);
        break;
      case 'month':
        currentDate.setMonth(currentDate.getMonth() + 1);
        break;
      default:
        currentDate.setDate(currentDate.getDate() + 1);
    }
  }
  
  return dates;
};

/**
 * Проверка рабочего дня
 */
exports.isWorkingDay = (date) => {
  const day = new Date(date).getDay();
  return day !== 0 && day !== 6; // не воскресенье и не суббота
};

/**
 * Получение следующего рабочего дня
 */
exports.getNextWorkingDay = (date = new Date()) => {
  let nextDay = new Date(date);
  
  do {
    nextDay.setDate(nextDay.getDate() + 1);
  } while (!this.isWorkingDay(nextDay));
  
  return nextDay;
};

/**
 * Форматирование относительного времени
 */
exports.formatRelativeTime = (date) => {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now - past;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return 'только что';
  if (diffMins < 60) return `${diffMins} минут назад`;
  if (diffHours < 24) return `${diffHours} часов назад`;
  if (diffDays === 1) return 'вчера';
  if (diffDays < 7) return `${diffDays} дней назад`;
  
  return this.formatDate(date);
};

/**
 * Валидация даты ISO
 */
exports.isValidISODate = (dateString) => {
  if (!dateString) return false;
  
  try {
    const date = new Date(dateString);
    return date.toISOString() === dateString;
  } catch {
    return false;
  }
};

/**
 * Конвертация в локальное время
 */
exports.toLocalTime = (date, timezone = 'Europe/Moscow') => {
  try {
    return new Date(date).toLocaleString('ru-RU', { timeZone: timezone });
  } catch {
    return new Date(date).toLocaleString('ru-RU');
  }
};