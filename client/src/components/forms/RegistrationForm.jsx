import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Input, { Select } from '../common/Input';
import Button from '../common/Button';
import Card from '../common/Card';
import { 
  validateEmail, 
  validatePassword, 
  validatePhone,
  validateRequired 
} from '../../utils/validators';

const RegistrationForm = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Шаг 1: Основная информация
    email: '',
    password: '',
    confirmPassword: '',
    
    // Шаг 2: Личная информация
    firstName: '',
    lastName: '',
    phone: '',
    
    // Шаг 3: Информация о ферме
    farmName: '',
    farmType: 'crop', // crop, livestock, mixed
    farmSize: '',
    location: '',
    crops: [],
    
    // Соглашения
    termsAccepted: false,
    newsletter: true
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const farmTypes = [
    { value: 'crop', label: 'Растениеводство' },
    { value: 'livestock', label: 'Животноводство' },
    { value: 'mixed', label: 'Смешанное хозяйство' },
    { value: 'greenhouse', label: 'Тепличное хозяйство' },
    { value: 'organic', label: 'Органическое земледелие' }
  ];

  const cropsOptions = [
    { value: 'wheat', label: 'Пшеница' },
    { value: 'corn', label: 'Кукуруза' },
    { value: 'soy', label: 'Соя' },
    { value: 'sunflower', label: 'Подсолнечник' },
    { value: 'potato', label: 'Картофель' },
    { value: 'vegetables', label: 'Овощи' },
    { value: 'fruits', label: 'Фрукты' },
    { value: 'berries', label: 'Ягоды' },
    { value: 'grapes', label: 'Виноград' },
    { value: 'other', label: 'Другое' }
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Очищаем ошибку при изменении поля
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCropChange = (cropValue) => {
    setFormData(prev => {
      const crops = [...prev.crops];
      const index = crops.indexOf(cropValue);
      
      if (index > -1) {
        crops.splice(index, 1);
      } else {
        crops.push(cropValue);
      }
      
      return { ...prev, crops };
    });
  };

  const validateStep = (stepNumber) => {
    const newErrors = {};
    
    switch (stepNumber) {
      case 1:
        if (!validateEmail(formData.email)) {
          newErrors.email = 'Введите корректный email';
        }
        if (!validatePassword(formData.password)) {
          newErrors.password = 'Пароль должен быть не менее 8 символов и содержать цифры и буквы';
        }
        if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = 'Пароли не совпадают';
        }
        break;
        
      case 2:
        if (!validateRequired(formData.firstName)) {
          newErrors.firstName = 'Имя обязательно';
        }
        if (!validateRequired(formData.lastName)) {
          newErrors.lastName = 'Фамилия обязательна';
        }
        if (formData.phone && !validatePhone(formData.phone)) {
          newErrors.phone = 'Введите корректный номер телефона';
        }
        break;
        
      case 3:
        if (!validateRequired(formData.farmName)) {
          newErrors.farmName = 'Название фермы обязательно';
        }
        if (!validateRequired(formData.farmSize)) {
          newErrors.farmSize = 'Укажите размер фермы';
        }
        if (!validateRequired(formData.location)) {
          newErrors.location = 'Укажите местоположение';
        }
        break;
    }
    
    return newErrors;
  };

  const nextStep = () => {
    const stepErrors = validateStep(step);
    
    if (Object.keys(stepErrors).length === 0) {
      setStep(step + 1);
      setErrors({});
    } else {
      setErrors(stepErrors);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
    setErrors({});
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!formData.termsAccepted) {
    setErrors({ termsAccepted: 'Необходимо принять условия использования' });
    return;
  }
  
  setLoading(true);
  
  try {
    // ✅ Подготовка данных для сервера
    const userData = {
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      email: formData.email,
      password: formData.password,
      phone: formData.phone || '',
      farmName: formData.farmName || '',
      farmType: formData.farmType,
      farmSize: formData.farmSize ? parseFloat(formData.farmSize) : null,
      location: formData.location || '',
    };
    
    console.log('📤 ОТПРАВЛЯЕМЫЕ ДАННЫЕ:', JSON.stringify(userData, null, 2));
    console.log('📤 Типы данных:', {
      username: typeof userData.username,
      email: typeof userData.email,
      password: typeof userData.password,
      phone: typeof userData.phone,
      farmName: typeof userData.farmName
    });
    
    const result = await register(userData);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setErrors({ submit: result.error || 'Ошибка регистрации' });
    }
  } catch (error) {
    console.error('❌ Ошибка:', error);
    if (error.response) {
      console.error('❌ Ответ сервера:', error.response.data);
      console.error('❌ Статус:', error.response.status);
    }
    setErrors({ submit: 'Ошибка при регистрации. Попробуйте позже.' });
  } finally {
    setLoading(false);
  }
};
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Создание аккаунта</h3>
              <p className="text-gray-600">Введите email и пароль для регистрации</p>
            </div>
            
            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="your@email.com"
              required
              startIcon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              }
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input
                  label="Пароль"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                  placeholder="Минимум 8 символов"
                  required
                  endIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  }
                />
                <p className="text-xs text-gray-500 mt-1">
                  Должен содержать цифры и буквы
                </p>
              </div>
              
              <div>
                <Input
                  label="Подтверждение пароля"
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={errors.confirmPassword}
                  placeholder="Повторите пароль"
                  required
                />
              </div>
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Личная информация</h3>
              <p className="text-gray-600">Расскажите немного о себе</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Имя"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                error={errors.firstName}
                placeholder="Иван"
                required
              />
              
              <Input
                label="Фамилия"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                error={errors.lastName}
                placeholder="Иванов"
                required
              />
            </div>
            
            <Input
              label="Телефон"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
              placeholder="+7 (999) 123-45-67"
              startIcon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              }
            />
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Информация о ферме</h3>
              <p className="text-gray-600">Расскажите о вашем сельскохозяйственном предприятии</p>
            </div>
            
            <Input
              label="Название фермы/хозяйства"
              name="farmName"
              value={formData.farmName}
              onChange={handleChange}
              error={errors.farmName}
              placeholder="Агрохолдинг 'Урожай'"
              required
              startIcon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              }
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* ИСПРАВЛЕНО: Убран конфликт между value и defaultValue */}
{/* Вместо <Select ... /> используйте обычный select */}
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">
               Тип хозяйства
               </label>
               <select
               name="farmType"
               value={formData.farmType}
               onChange={handleChange}
               className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
               required
              >
              {farmTypes.map(option => (
              <option key={option.value} value={option.value}>
              {option.label}
             </option>
             ))}
            </select>
            </div>
              
              <Input
                label="Размер хозяйства (га)"
                name="farmSize"
                type="number"
                value={formData.farmSize}
                onChange={handleChange}
                error={errors.farmSize}
                placeholder="100"
                required
                startIcon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              />
            </div>
            
            <Input
              label="Местоположение"
              name="location"
              value={formData.location}
              onChange={handleChange}
              error={errors.location}
              placeholder="Московская область, Раменский район"
              required
              startIcon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              }
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Выращиваемые культуры
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {cropsOptions.map((crop) => (
                  <label
                    key={crop.value}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                      formData.crops.includes(crop.value)
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.crops.includes(crop.value)}
                      onChange={() => handleCropChange(crop.value)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{crop.label}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="space-y-4">
              <label className="flex items-start">
                <input
                  type="checkbox"
                  name="termsAccepted"
                  checked={formData.termsAccepted}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-1"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Я принимаю{' '}
                  <Link to="/terms" className="text-primary-600 hover:text-primary-700">
                    условия использования
                  </Link>
                  {' '}и согласен с{' '}
                  <Link to="/privacy" className="text-primary-600 hover:text-primary-700">
                    политикой конфиденциальности
                  </Link>
                </span>
              </label>
              {errors.termsAccepted && (
                <p className="text-sm text-red-600">{errors.termsAccepted}</p>
              )}
              
              <label className="flex items-start">
                <input
                  type="checkbox"
                  name="newsletter"
                  checked={formData.newsletter}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-1"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Я хочу получать уведомления о новых возможностях и советы по ведению хозяйства
                </span>
              </label>
            </div>
          </div>
        );
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-primary-600 rounded-xl flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl text-white">🌾</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Регистрация</h1>
        <p className="text-gray-600 mt-2">Создайте аккаунт для управления сельским хозяйством</p>
      </div>

      {/* Индикатор шагов */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          {[1, 2, 3].map((stepNumber) => (
            <React.Fragment key={stepNumber}>
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  stepNumber < step
                    ? 'bg-primary-600 text-white'
                    : stepNumber === step
                    ? 'bg-primary-100 text-primary-600 border-2 border-primary-600'
                    : 'bg-gray-100 text-gray-400'
                }`}>
                  {stepNumber < step ? '✓' : stepNumber}
                </div>
                <span className="text-xs mt-2 text-gray-600">
                  {stepNumber === 1 && 'Аккаунт'}
                  {stepNumber === 2 && 'Личные данные'}
                  {stepNumber === 3 && 'Ферма'}
                </span>
              </div>
              
              {stepNumber < 3 && (
                <div className={`flex-1 h-1 mx-4 ${
                  stepNumber < step ? 'bg-primary-600' : 'bg-gray-200'
                }`}></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {errors.submit && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-red-700">{errors.submit}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {renderStep()}
        
        <div className="mt-8 flex justify-between">
          {step > 1 && (
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={loading}
            >
              ← Назад
            </Button>
          )}
          
          {step < 3 ? (
            <Button
              type="button"
              variant="primary"
              onClick={nextStep}
              className={step === 1 ? 'ml-auto' : ''}
            >
              Продолжить →
            </Button>
          ) : (
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              disabled={loading}
              className="ml-auto"
            >
              Зарегистрироваться
            </Button>
          )}
        </div>
      </form>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <p className="text-center text-sm text-gray-600">
          Уже есть аккаунт?{' '}
          <Link to="/login" className="font-medium text-primary-600 hover:text-primary-700">
            Войти
          </Link>
        </p>
      </div>

      <div className="mt-6 p-4 bg-green-50 rounded-lg">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <div>
            <p className="text-sm font-medium text-green-800 mb-1">Безопасность данных</p>
            <p className="text-xs text-green-700">
              Все ваши данные защищены и используются только для улучшения работы системы. 
              Мы никогда не передаем информацию третьим лицам.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default RegistrationForm;