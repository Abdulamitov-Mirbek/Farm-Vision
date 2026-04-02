export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  // Минимум 8 символов, хотя бы одна цифра и одна буква
  const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
  return re.test(password);
};

export const validatePhone = (phone) => {
  const re = /^[\+]?[0-9]{10,15}$/;
  return re.test(phone.replace(/[\s\-\(\)]/g, ''));
};

export const validateRequired = (value) => {
  return value && value.trim().length > 0;
};

export const validateNumber = (value, min = 0, max = 999999) => {
  const num = parseFloat(value);
  return !isNaN(num) && num >= min && num <= max;
};

export const validateCoordinates = (lat, lng) => {
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
};

export const validateFieldData = (data) => {
  const errors = {};
  
  if (!validateRequired(data.name)) {
    errors.name = 'Название поля обязательно';
  }
  
  if (!validateNumber(data.area, 0.1, 10000)) {
    errors.area = 'Площадь должна быть от 0.1 до 10000 га';
  }
  
  if (!data.cropType) {
    errors.cropType = 'Выберите культуру';
  }
  
  if (!validateRequired(data.soilType)) {
    errors.soilType = 'Тип почвы обязателен';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};