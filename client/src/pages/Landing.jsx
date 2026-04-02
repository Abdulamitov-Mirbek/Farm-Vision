// src/pages/Landing.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../contexts/ThemeContext'; // ✅ Добавляем тему
import ThemeToggle from '../components/common/ThemeToggle'; // ✅ Добавляем кнопку темы
import { 
  Sprout, 
  Tractor, 
  Cloud, 
  Calendar, 
  BarChart3, 
  Users, 
  Shield, 
  ChevronRight,
  Check,
  ArrowRight,
  Menu,
  X,
  Mail,
  Phone,
  MapPin,
  Sparkles,
  Wheat,
  Droplets,
  Rocket,
  Target,
  TrendingUp,
  Globe2,
  Award,
  Zap,
  Clock,
  Smartphone,
  Laptop,
  Infinity,
  Crown,
  Leaf,
  Sun,
  Wind,
  Factory,
  Coins,
  LineChart
} from 'lucide-react';

const Landing = () => {
  const { language, setLanguage } = useLanguage();
  const { user } = useAuth();
  const { theme } = useTheme(); // ✅ Получаем тему
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const features = [
    {
      icon: <Sprout className="w-6 h-6" />,
      title: { ru: 'Управление полями', en: 'Field Management', kg: 'Талааларды башкаруу' },
      description: { ru: 'Детальный учет всех полей и культур в реальном времени', en: 'Real-time management of all fields and crops', kg: 'Бардык талааларды жана өсүмдүктөрдү реалдуу убакытта башкаруу' }
    },
    {
      icon: <Tractor className="w-6 h-6" />,
      title: { ru: 'Учет техники', en: 'Equipment Tracking', kg: 'Техниканы эсепке алуу' },
      description: { ru: 'Контроль за техническим состоянием и обслуживанием', en: 'Monitor equipment condition and maintenance', kg: 'Техниканын абалын жана тейлөөсүн көзөмөлдөө' }
    },
    {
      icon: <Cloud className="w-6 h-6" />,
      title: { ru: 'Прогноз погоды', en: 'Weather Forecast', kg: 'Аба ырайы божомолу' },
      description: { ru: 'Точный прогноз для планирования полевых работ', en: 'Accurate forecast for field work planning', kg: 'Талаа иштерин пландаштыруу үчүн так божомол' }
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: { ru: 'Аналитика', en: 'Analytics', kg: 'Аналитика' },
      description: { ru: 'Отчеты по урожайности, расходам и прибыли', en: 'Reports on yields, expenses and profits', kg: 'Түшүмдүүлүк, чыгымдар жана киреше боюнча отчеттор' }
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: { ru: 'Планирование', en: 'Planning', kg: 'Пландоо' },
      description: { ru: 'Создание задач и планов работ', en: 'Create tasks and work plans', kg: 'Тапшырмаларды жана иш пландарын түзүү' }
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: { ru: 'Управление персоналом', en: 'Staff Management', kg: 'Кызматкерлерди башкаруу' },
      description: { ru: 'Учет сотрудников и распределение задач', en: 'Employee tracking and task assignment', kg: 'Кызматкерлерди эсепке алуу жана тапшырмаларды бөлүштүрүү' }
    }
  ];

  const faqItems = [
    {
      q: { ru: 'Можно ли попробовать бесплатно?', en: 'Can I try for free?', kg: 'Акысыз сынап көрсө болобу?' },
      a: { ru: 'Да, у нас есть бесплатный тариф "Старт" с базовыми функциями.', en: 'Yes, we have a free "Start" plan with basic features.', kg: 'Ооба, бизде "Старт" акысыз тариф бар.' }
    },
    {
      q: { ru: 'Какие языки поддерживаются?', en: 'What languages are supported?', kg: 'Кандай тилдер колдоого алынат?' },
      a: { ru: 'Русский, английский и кыргызский языки.', en: 'Russian, English and Kyrgyz.', kg: 'Орус, англис жана кыргыз тилдери.' }
    },
    {
      q: { ru: 'Есть ли мобильное приложение?', en: 'Is there a mobile app?', kg: 'Мобилдик тиркеме барбы?' },
      a: { ru: 'Да, скоро будет доступно для iOS и Android.', en: 'Yes, coming soon for iOS and Android.', kg: 'Ооба, жакында iOS жана Android үчүн.' }
    }
  ];

  // Классы для темной/светлой темы
  const themeClasses = {
    body: theme === 'dark' ? 'bg-gray-900' : 'bg-white',
    nav: {
      bg: isScrolled 
        ? theme === 'dark' 
          ? 'bg-gray-900/80 backdrop-blur-xl border-gray-800' 
          : 'bg-white/80 backdrop-blur-xl border-gray-200'
        : 'bg-transparent',
      text: isScrolled
        ? theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
        : 'text-white',
      textHover: isScrolled
        ? theme === 'dark' ? 'hover:text-white' : 'hover:text-green-600'
        : 'hover:text-white',
    },
    features: {
      section: theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50',
      card: theme === 'dark' 
        ? 'bg-gray-900 border-gray-700 hover:bg-gray-800' 
        : 'bg-white border-gray-100 hover:bg-white',
      title: theme === 'dark' ? 'text-white' : 'text-gray-900',
      description: theme === 'dark' ? 'text-gray-400' : 'text-gray-600',
      icon: theme === 'dark' ? 'text-green-400' : 'text-green-600',
    },
    faq: {
      section: theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50',
      card: theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-100',
      question: theme === 'dark' ? 'text-white' : 'text-gray-900',
      answer: theme === 'dark' ? 'text-gray-400' : 'text-gray-600',
    },
    contact: {
      section: theme === 'dark' ? 'bg-gray-900' : 'bg-white',
      card: theme === 'dark'
        ? 'bg-gray-800 border-gray-700'
        : 'bg-gradient-to-br from-green-50 to-emerald-50',
      title: theme === 'dark' ? 'text-white' : 'text-gray-900',
      text: theme === 'dark' ? 'text-gray-400' : 'text-gray-600',
      input: theme === 'dark'
        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
        : 'bg-white border-gray-200 text-gray-900',
    },
    footer: {
      bg: theme === 'dark' ? 'bg-gray-950' : 'bg-gray-900',
      text: 'text-white',
      textMuted: theme === 'dark' ? 'text-gray-400' : 'text-gray-400',
      border: theme === 'dark' ? 'border-gray-800' : 'border-gray-800',
    },
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${themeClasses.body}`}>
      {/* Навигация */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        isScrolled ? 'shadow-lg py-3' : 'py-5'
      } ${themeClasses.nav.bg}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          {/* Логотип PNG + текст FARM VISION */}
          <Link to="/" className="flex items-center space-x-3 hover:opacity-90 transition-opacity">
            <img 
              src="/src/assets/images/logo.png" 
              alt="Farm Vision" 
              className="h-14 w-auto rounded-full" 
            />
            <div className="flex flex-col">
              <span className={`font-bold text-sm leading-tight ${
                isScrolled 
                  ? theme === 'dark' ? 'text-amber-400' : 'text-amber-800'
                  : 'text-amber-800'
              }`}>FARM</span>
              <span className={`font-bold text-sm leading-tight ${
                isScrolled 
                  ? theme === 'dark' ? 'text-sky-400' : 'text-sky-500'
                  : 'text-sky-500'
              }`}>VISION</span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {['features', 'faq', 'contact'].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item)}
                className={`text-sm font-medium transition-colors ${themeClasses.nav.text} ${themeClasses.nav.textHover}`}
              >
                {item === 'features' && (language === 'ru' ? 'Возможности' : language === 'en' ? 'Features' : 'Мүмкүнчүлүктөр')}
                {item === 'faq' && (language === 'ru' ? 'Вопросы' : language === 'en' ? 'FAQ' : 'Суроолор')}
                {item === 'contact' && (language === 'ru' ? 'Контакты' : language === 'en' ? 'Contact' : 'Байланыш')}
              </button>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Кнопка переключения темы */}
            <ThemeToggle />

            <div className={`flex items-center space-x-1 rounded-lg p-1 ${
              isScrolled 
                ? theme === 'dark' ? 'bg-gray-800' : 'bg-white/10'
                : 'bg-white/10'
            }`}>
              <button
                onClick={() => setLanguage('ru')}
                className={`px-3 py-1 rounded-md text-sm transition-all ${
                  language === 'ru'
                    ? isScrolled && theme === 'dark'
                      ? 'bg-green-600 text-white'
                      : 'bg-white text-green-600 shadow-md'
                    : isScrolled && theme === 'dark'
                      ? 'text-gray-400 hover:bg-gray-700'
                      : 'text-white hover:bg-white/20'
                }`}
              >
                RU
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 rounded-md text-sm transition-all ${
                  language === 'en'
                    ? isScrolled && theme === 'dark'
                      ? 'bg-green-600 text-white'
                      : 'bg-white text-green-600 shadow-md'
                    : isScrolled && theme === 'dark'
                      ? 'text-gray-400 hover:bg-gray-700'
                      : 'text-white hover:bg-white/20'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('kg')}
                className={`px-3 py-1 rounded-md text-sm transition-all ${
                  language === 'kg'
                    ? isScrolled && theme === 'dark'
                      ? 'bg-green-600 text-white'
                      : 'bg-white text-green-600 shadow-md'
                    : isScrolled && theme === 'dark'
                      ? 'text-gray-400 hover:bg-gray-700'
                      : 'text-white hover:bg-white/20'
                }`}
              >
                KG
              </button>
            </div>

            <Link
              to="/login"
              className={`px-4 py-2 text-sm font-medium transition-colors ${themeClasses.nav.text} ${themeClasses.nav.textHover}`}
            >
              {language === 'ru' ? 'Войти' : language === 'en' ? 'Login' : 'Кирүү'}
            </Link>
            
            <Link
              to="/register"
              className="px-5 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-medium rounded-xl hover:shadow-lg hover:scale-105 transition-all"
            >
              {language === 'ru' ? 'Регистрация' : language === 'en' ? 'Sign Up' : 'Катталуу'}
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`md:hidden p-2 ${isScrolled ? 'text-gray-700' : 'text-white'}`}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className={`md:hidden border-t py-4 px-6 ${
            theme === 'dark' 
              ? 'bg-gray-900 border-gray-800' 
              : 'bg-white border-gray-100'
          }`}>
            <div className="flex flex-col space-y-3">
              {['features', 'faq', 'contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item)}
                  className={`text-left py-2 ${
                    theme === 'dark' 
                      ? 'text-gray-300 hover:text-green-400' 
                      : 'text-gray-700 hover:text-green-600'
                  }`}
                >
                  {item === 'features' && (language === 'ru' ? 'Возможности' : language === 'en' ? 'Features' : 'Мүмкүнчүлүктөр')}
                  {item === 'faq' && (language === 'ru' ? 'Вопросы' : language === 'en' ? 'FAQ' : 'Суроолор')}
                  {item === 'contact' && (language === 'ru' ? 'Контакты' : language === 'en' ? 'Contact' : 'Байланыш')}
                </button>
              ))}
              <div className="flex items-center justify-between pt-4 mt-2 border-t border-gray-200">
                <ThemeToggle />
                <div className="flex space-x-2">
                  <button
                    onClick={() => setLanguage('ru')}
                    className={`px-2 py-1 text-xs rounded ${
                      language === 'ru' ? 'bg-green-600 text-white' : ''
                    }`}
                  >
                    RU
                  </button>
                  <button
                    onClick={() => setLanguage('en')}
                    className={`px-2 py-1 text-xs rounded ${
                      language === 'en' ? 'bg-green-600 text-white' : ''
                    }`}
                  >
                    EN
                  </button>
                  <button
                    onClick={() => setLanguage('kg')}
                    className={`px-2 py-1 text-xs rounded ${
                      language === 'kg' ? 'bg-green-600 text-white' : ''
                    }`}
                  >
                    KG
                  </button>
                </div>
              </div>
              <div className="border-t pt-4 mt-2">
                <Link to="/login" className="block py-2 text-gray-700">Войти</Link>
                <Link to="/register" className="block py-2 text-green-600 font-medium">Регистрация</Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section - остается с градиентом, не меняется */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-yellow-400/10 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-8 border border-white/30">
              <Sparkles className="w-4 h-4 mr-2" />
              {language === 'ru' ? '✨ Умное сельское хозяйство' : 
               language === 'en' ? '✨ Smart Agriculture' : 
               '✨ Акылдуу айыл чарба'}
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              {language === 'ru' ? 'Управляйте фермой' : 
               language === 'en' ? 'Manage Your Farm' : 
               'Фермаңызды башкарыңыз'}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">
                {language === 'ru' ? 'с умом' : 
                 language === 'en' ? 'with Intelligence' : 
                 'акылдуу'}
              </span>
            </h1>
            
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
              {language === 'ru' ? 'Платформа Farm Vision помогает автоматизировать учет, планировать работы и увеличивать урожайность.' :
               language === 'en' ? 'Farm Vision platform helps automate accounting, plan work and increase yields.' :
               'Farm Vision платформасы эсептөөнү автоматташтырууга, иштерди пландаштырууга жана түшүмдүүлүктү жогорулатууга жардам берет.'}
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                to="/register"
                className="group px-8 py-4 bg-white text-green-600 rounded-xl hover:shadow-2xl hover:scale-105 transition-all text-lg font-medium flex items-center"
              >
                {language === 'ru' ? 'Начать бесплатно' : 
                 language === 'en' ? 'Start Free' : 
                 'Акысыз баштоо'}
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button
                onClick={() => scrollToSection('features')}
                className="px-8 py-4 border-2 border-white/50 text-white rounded-xl hover:bg-white/10 transition-all text-lg font-medium backdrop-blur-sm"
              >
                {language === 'ru' ? 'Узнать больше' : 
                 language === 'en' ? 'Learn More' : 
                 'Көбүрөөк билүү'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className={`py-24 px-6 transition-colors duration-300 ${themeClasses.features.section}`}>
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${themeClasses.features.title}`}>
              {language === 'ru' ? 'Все возможности в одном месте' : 
               language === 'en' ? 'All features in one place' : 
               'Бардык мүмкүнчүлүктөр бир жерде'}
            </h2>
            <p className={`text-xl max-w-2xl mx-auto ${themeClasses.features.description}`}>
              {language === 'ru' ? 'Современные инструменты для эффективного ведения сельского хозяйства' :
               language === 'en' ? 'Modern tools for efficient farming' :
               'Натыйжалуу айыл чарбасы үчүн заманбап куралдар'}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <div 
                key={idx} 
                className={`group p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all hover:-translate-y-2 border ${themeClasses.features.card}`}
              >
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${
                  theme === 'dark' 
                    ? 'bg-gray-800 text-green-400' 
                    : 'bg-gradient-to-br from-green-100 to-green-50 text-green-600'
                }`}>
                  {feature.icon}
                </div>
                <h3 className={`text-xl font-semibold mb-2 ${themeClasses.features.title}`}>
                  {feature.title[language]}
                </h3>
                <p className={themeClasses.features.description}>
                  {feature.description[language]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className={`py-24 px-6 transition-colors duration-300 ${themeClasses.faq.section}`}>
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-16">
            <h2 className={`text-4xl font-bold mb-4 ${themeClasses.faq.question}`}>
              {language === 'ru' ? 'Часто задаваемые вопросы' : 
               language === 'en' ? 'Frequently Asked Questions' : 
               'Көп берилүүчү суроолор'}
            </h2>
          </div>

          <div className="space-y-4">
            {faqItems.map((item, idx) => (
              <div key={idx} className={`rounded-2xl shadow-sm overflow-hidden border ${themeClasses.faq.card}`}>
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className={`w-full flex justify-between items-center p-6 text-left transition-colors ${
                    theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-50'
                  }`}
                >
                  <span className={`font-semibold ${themeClasses.faq.question}`}>{item.q[language]}</span>
                  <ChevronRight className={`w-5 h-5 transition-transform ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  } ${activeFaq === idx ? 'rotate-90' : ''}`} />
                </button>
                {activeFaq === idx && (
                  <div className={`px-6 pb-6 ${themeClasses.faq.answer}`}>
                    {item.a[language]}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className={`py-24 px-6 transition-colors duration-300 ${themeClasses.contact.section}`}>
        <div className="container mx-auto max-w-4xl">
          <div className={`rounded-3xl p-12 shadow-xl transition-colors duration-300 ${themeClasses.contact.card}`}>
            <div className="text-center mb-12">
              <h2 className={`text-4xl font-bold mb-4 ${themeClasses.contact.title}`}>
                {language === 'ru' ? 'Свяжитесь с нами' : 
                 language === 'en' ? 'Contact Us' : 
                 'Биз менен байланышыңыз'}
              </h2>
              <p className={themeClasses.contact.text}>
                {language === 'ru' ? 'Мы всегда готовы помочь и ответить на ваши вопросы' :
                 language === 'en' ? 'We are always ready to help and answer your questions' :
                 'Биз ар дайым жардам берүүгө жана суроолоруңузга жооп берүүгө даярбыз'}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-green-100'
                  }`}>
                    <Phone className={theme === 'dark' ? 'w-6 h-6 text-green-400' : 'w-6 h-6 text-green-600'} />
                  </div>
                  <div>
                    <p className={`text-sm ${themeClasses.contact.text}`}>Телефон</p>
                    <p className={`font-semibold ${themeClasses.contact.title}`}>+996 (555) 123-456</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-green-100'
                  }`}>
                    <Mail className={theme === 'dark' ? 'w-6 h-6 text-green-400' : 'w-6 h-6 text-green-600'} />
                  </div>
                  <div>
                    <p className={`text-sm ${themeClasses.contact.text}`}>Email</p>
                    <p className={`font-semibold ${themeClasses.contact.title}`}>info@farmvision.kg</p>
                  </div>
                </div>
              </div>

              <form className="space-y-4">
                <input
                  type="text"
                  placeholder={language === 'ru' ? 'Ваше имя' : language === 'en' ? 'Your name' : 'Сиздин атыңыз'}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${themeClasses.contact.input}`}
                />
                <input
                  type="email"
                  placeholder={language === 'ru' ? 'Ваш Email' : language === 'en' ? 'Your Email' : 'Сиздин Email'}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${themeClasses.contact.input}`}
                />
                <textarea
                  rows="4"
                  placeholder={language === 'ru' ? 'Ваше сообщение' : language === 'en' ? 'Your message' : 'Сиздин билдирүүңүз'}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${themeClasses.contact.input}`}
                />
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:shadow-lg transition-all font-semibold"
                >
                  {language === 'ru' ? 'Отправить сообщение' : 
                   language === 'en' ? 'Send message' : 
                   'Билдирүү жөнөтүү'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-12 px-6 transition-colors duration-300 ${themeClasses.footer.bg}`}>
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <img 
                src="/src/assets/images/logo.png" 
                alt="Farm Vision" 
                className="h-10 w-10 rounded-full brightness-0 invert" 
              />
              <div className="flex flex-col">
                <span className={`font-bold text-sm leading-tight ${
                  theme === 'dark' ? 'text-amber-400' : 'text-white'
                }`}>FARM</span>
                <span className={`font-bold text-sm leading-tight ${
                  theme === 'dark' ? 'text-sky-400' : 'text-green-400'
                }`}>VISION</span>
              </div>
            </div>
            
            <div className="flex space-x-6">
              <a href="#" className={`transition-colors ${themeClasses.footer.textMuted} hover:text-white`}>
                {language === 'ru' ? 'Политика' : language === 'en' ? 'Privacy' : 'Купуялык'}
              </a>
              <a href="#" className={`transition-colors ${themeClasses.footer.textMuted} hover:text-white`}>
                {language === 'ru' ? 'Условия' : language === 'en' ? 'Terms' : 'Шарттар'}
              </a>
              <a href="#" className={`transition-colors ${themeClasses.footer.textMuted} hover:text-white`}>
                {language === 'ru' ? 'Контакты' : language === 'en' ? 'Contact' : 'Байланыш'}
              </a>
            </div>
          </div>
          
          <div className={`border-t mt-8 pt-8 text-center ${themeClasses.footer.border}`}>
            <p className={themeClasses.footer.textMuted}>
              © 2026 FarmVision. {language === 'ru' ? 'Все права защищены.' : 
               language === 'en' ? 'All rights reserved.' : 
               'Бардык укуктар корголгон.'}
            </p>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        .animate-pulse {
          animation: pulse 4s ease-in-out infinite;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
};

export default Landing;