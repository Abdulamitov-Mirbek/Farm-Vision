export const formatDate = (dateString, options = {}) => {
  const date = new Date(dateString);
  const defaultOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  };
  
  return date.toLocaleDateString('ru-RU', { ...defaultOptions, ...options });
};

export const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatNumber = (number) => {
  return new Intl.NumberFormat('ru-RU').format(number);
};

export const calculateArea = (points) => {
  // Простой расчет площади для полигона
  if (points.length < 3) return 0;
  
  let area = 0;
  for (let i = 0; i < points.length; i++) {
    const j = (i + 1) % points.length;
    area += points[i].lat * points[j].lng;
    area -= points[j].lat * points[i].lng;
  }
  
  return Math.abs(area / 2) * 10000; // Примерный коэффициент для га
};

export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const getCropIcon = (cropType) => {
  const icons = {
    'Пшеница': '🌾',
    'Кукуруза': '🌽',
    'Соя': '🥜',
    'Подсолнечник': '🌻',
    'Картофель': '🥔',
    'Овощи': '🥦',
    'Фрукты': '🍎'
  };
  
  return icons[cropType] || '🌱';
};

export const calculateYield = (area, cropType, weatherScore = 1) => {
  const baseYield = {
    'Пшеница': 35, // ц/га
    'Кукуруза': 60,
    'Соя': 25,
    'Подсолнечник': 20,
    'Картофель': 200,
    'Овощи': 150,
    'Фрукты': 100
  };
  
  const yieldPerHa = baseYield[cropType] || 30;
  return Math.round(area * yieldPerHa * weatherScore);
};

export const formatTemperature = (tempC) => {
  return `${tempC > 0 ? '+' : ''}${Math.round(tempC)}°C`;
};