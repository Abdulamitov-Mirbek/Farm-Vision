// src/pages/Animals.jsx
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import animalsAPI from '../services/api/animalsAPI';
import { 
  Plus, Search, Filter, MoreVertical, Edit2, Trash2,
  ChevronRight, Download, Calendar, Clock, Users,
  TrendingUp, TrendingDown, Activity, AlertCircle,
  Weight, Syringe, Heart, Thermometer, Droplets, User,
  MapPin, Tag, Info, ChevronLeft, ChevronRight as ChevronRightIcon,
  X, Check, AlertTriangle, RefreshCw,
  Sparkles, Home, Briefcase, DollarSign,
  // Real animal icons
  Cat, Dog, Bird, Fish, Egg, Milk, PawPrint, 
  // Remove PawPrint and replace with specific icons
  // Cow, Sheep, Goat, Horse, Chicken
} from 'lucide-react';

// Custom animal icons using emoji (since Lucide doesn't have all animal icons)
const CowIcon = ({ className }) => <span className={className}>🐄</span>;
const SheepIcon = ({ className }) => <span className={className}>🐑</span>;
const GoatIcon = ({ className }) => <span className={className}>🐐</span>;
const HorseIcon = ({ className }) => <span className={className}>🐎</span>;
const ChickenIcon = ({ className }) => <span className={className}>🐔</span>;

const Animals = () => {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedHealth, setSelectedHealth] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(null);
  const [showVaccinationModal, setShowVaccinationModal] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    type: 'cattle',
    breed: '',
    gender: 'female',
    birthDate: '',
    weight: '',
    health: 'good',
    location: '',
    notes: '',
    milk: '',
    pregnant: false,
    dueDate: '',
    wool: '',
    eggsPerWeek: ''
  });

  // Theme classes
  const themeClasses = {
    page: theme === 'dark' ? 'bg-gray-900' : 'bg-gradient-to-br from-gray-50 to-gray-100',
    card: theme === 'dark' 
      ? 'bg-gray-800 border-gray-700' 
      : 'bg-white border-gray-100',
    text: {
      primary: theme === 'dark' ? 'text-white' : 'text-gray-900',
      secondary: theme === 'dark' ? 'text-gray-400' : 'text-gray-600',
      muted: theme === 'dark' ? 'text-gray-500' : 'text-gray-400',
    },
    border: theme === 'dark' ? 'border-gray-700' : 'border-gray-200',
    input: theme === 'dark'
      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
      : 'bg-white border-gray-200 text-gray-900',
    button: {
      primary: 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white',
      secondary: theme === 'dark'
        ? 'bg-gray-700 hover:bg-gray-600 text-gray-300 border-gray-600'
        : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300',
      outline: theme === 'dark'
        ? 'border-gray-600 hover:bg-gray-700 text-gray-300'
        : 'border-gray-200 hover:bg-gray-50 text-gray-600',
    },
    badge: {
      excellent: theme === 'dark'
        ? 'bg-green-900/30 text-green-400 border border-green-800'
        : 'bg-green-100 text-green-800 border border-green-200',
      good: theme === 'dark'
        ? 'bg-blue-900/30 text-blue-400 border border-blue-800'
        : 'bg-blue-100 text-blue-800 border border-blue-200',
      warning: theme === 'dark'
        ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-800'
        : 'bg-yellow-100 text-yellow-800 border border-yellow-200',
      critical: theme === 'dark'
        ? 'bg-red-900/30 text-red-400 border border-red-800'
        : 'bg-red-100 text-red-800 border border-red-200',
    },
    modal: {
      overlay: theme === 'dark' ? 'bg-black/50' : 'bg-black/30',
      content: theme === 'dark' 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-200',
    },
    table: {
      header: theme === 'dark' ? 'bg-gray-800 text-gray-400 border-gray-700' : 'bg-gray-50 text-gray-600 border-gray-200',
      row: theme === 'dark' ? 'hover:bg-gray-700/50 border-gray-700' : 'hover:bg-gray-50 border-gray-100',
      cell: theme === 'dark' ? 'text-gray-300' : 'text-gray-600',
    },
    stat: {
      cattle: theme === 'dark' ? 'bg-amber-900/30 border-amber-800' : 'bg-amber-50 border-amber-200',
      sheep: theme === 'dark' ? 'bg-blue-900/30 border-blue-800' : 'bg-blue-50 border-blue-200',
      goat: theme === 'dark' ? 'bg-emerald-900/30 border-emerald-800' : 'bg-emerald-50 border-emerald-200',
      horse: theme === 'dark' ? 'bg-purple-900/30 border-purple-800' : 'bg-purple-50 border-purple-200',
      poultry: theme === 'dark' ? 'bg-orange-900/30 border-orange-800' : 'bg-orange-50 border-orange-200',
      pregnant: theme === 'dark' ? 'bg-pink-900/30 border-pink-800' : 'bg-pink-50 border-pink-200',
    },
    statText: {
      cattle: theme === 'dark' ? 'text-amber-400' : 'text-amber-900',
      sheep: theme === 'dark' ? 'text-blue-400' : 'text-blue-900',
      goat: theme === 'dark' ? 'text-emerald-400' : 'text-emerald-900',
      horse: theme === 'dark' ? 'text-purple-400' : 'text-purple-900',
      poultry: theme === 'dark' ? 'text-orange-400' : 'text-orange-900',
      pregnant: theme === 'dark' ? 'text-pink-400' : 'text-pink-900',
    }
  };

  // Animal type icons mapping
  const getAnimalIcon = (type, className = "w-5 h-5") => {
    switch(type) {
      case 'cattle':
        return <CowIcon className={className} />;
      case 'sheep':
        return <SheepIcon className={className} />;
      case 'goat':
        return <GoatIcon className={className} />;
      case 'horse':
        return <HorseIcon className={className} />;
      case 'poultry':
        return <ChickenIcon className={className} />;
      default:
        return <span className={className}>🐾</span>;
    }
  };

  const getAnimalIconComponent = (type, size = 20) => {
    switch(type) {
      case 'cattle':
        return <CowIcon className={`w-${size/4} h-${size/4} text-2xl`} />;
      case 'sheep':
        return <SheepIcon className={`w-${size/4} h-${size/4} text-2xl`} />;
      case 'goat':
        return <GoatIcon className={`w-${size/4} h-${size/4} text-2xl`} />;
      case 'horse':
        return <HorseIcon className={`w-${size/4} h-${size/4} text-2xl`} />;
      case 'poultry':
        return <ChickenIcon className={`w-${size/4} h-${size/4} text-2xl`} />;
      default:
        return <span className="text-2xl">🐾</span>;
    }
  };

  // Translations
  const pageText = {
    title: {
      ru: 'Животноводство',
      en: 'Livestock',
      kg: 'Мал чарбасы'
    },
    subtitle: {
      ru: 'Управление поголовьем и здоровьем животных',
      en: 'Manage livestock and animal health',
      kg: 'Малдын санын жана ден соолугун башкаруу'
    },
    searchPlaceholder: {
      ru: '🔍 Поиск по имени...',
      en: '🔍 Search by name...',
      kg: '🔍 Аты боюнча издөө...'
    },
    filterType: {
      all: {
        ru: 'Все типы',
        en: 'All types',
        kg: 'Бардык түрлөр'
      }
    },
    filterHealth: {
      all: {
        ru: 'Все статусы',
        en: 'All health',
        kg: 'Бардык статустар'
      }
    },
    addButton: {
      ru: 'Добавить',
      en: 'Add',
      kg: 'Кошуу'
    },
    stats: {
      total: {
        ru: 'Всего',
        en: 'Total',
        kg: 'Бардыгы'
      },
      cattle: {
        ru: 'КРС',
        en: 'Cattle',
        kg: 'Ири мүйүздүү'
      },
      sheep: {
        ru: 'Овцы',
        en: 'Sheep',
        kg: 'Кой'
      },
      goats: {
        ru: 'Козы',
        en: 'Goats',
        kg: 'Эчки'
      },
      horses: {
        ru: 'Лошади',
        en: 'Horses',
        kg: 'Жылкылар'
      },
      poultry: {
        ru: 'Птица',
        en: 'Poultry',
        kg: 'Куштар'
      },
      pregnant: {
        ru: 'Стельные',
        en: 'Pregnant',
        kg: 'Бооз'
      }
    },
    healthStats: {
      excellent: {
        ru: 'Отлично',
        en: 'Excellent',
        kg: 'Мыкты'
      },
      good: {
        ru: 'Хорошо',
        en: 'Good',
        kg: 'Жакшы'
      },
      warning: {
        ru: 'Внимание',
        en: 'Warning',
        kg: 'Көңүл'
      },
      critical: {
        ru: 'Критично',
        en: 'Critical',
        kg: 'Критикалык'
      }
    },
    productStats: {
      milk: {
        ru: 'Молоко',
        en: 'Milk',
        kg: 'Сүт'
      },
      wool: {
        ru: 'Шерсть',
        en: 'Wool',
        kg: 'Жүн'
      },
      eggs: {
        ru: 'Яйца',
        en: 'Eggs',
        kg: 'Жумуртка'
      }
    },
    reproductionStats: {
      pregnant: {
        ru: 'Стельные',
        en: 'Pregnant',
        kg: 'Бооз'
      },
      waiting: {
        ru: 'Ожидание отела',
        en: 'Waiting for calving',
        kg: 'Төлдөө күтүүдө'
      }
    },
    economyStats: {
      profit: {
        ru: 'Прибыль/мес',
        en: 'Profit/month',
        kg: 'Киреше/ай'
      },
      expenses: {
        ru: 'Расходы',
        en: 'Expenses',
        kg: 'Чыгымдар'
      }
    },
    table: {
      name: {
        ru: 'Имя',
        en: 'Name',
        kg: 'Аты'
      },
      type: {
        ru: 'Тип',
        en: 'Type',
        kg: 'Түрү'
      },
      breed: {
        ru: 'Порода',
        en: 'Breed',
        kg: 'Порода'
      },
      age: {
        ru: 'Возраст',
        en: 'Age',
        kg: 'Жашы'
      },
      weight: {
        ru: 'Вес',
        en: 'Weight',
        kg: 'Салмак'
      },
      health: {
        ru: 'Здоровье',
        en: 'Health',
        kg: 'Ден соолук'
      },
      actions: {
        ru: 'Действия',
        en: 'Actions',
        kg: 'Аракеттер'
      }
    },
    noResults: {
      ru: 'Ничего не найдено',
      en: 'Nothing found',
      kg: 'Эч нерсе табылган жок'
    },
    noAnimals: {
      ru: 'Животные не найдены',
      en: 'No animals found',
      kg: 'Жаныбарлар табылган жок'
    },
    modal: {
      add: {
        ru: 'Добавить животное',
        en: 'Add animal',
        kg: 'Жаныбар кошуу'
      },
      edit: {
        ru: 'Редактировать животное',
        en: 'Edit animal',
        kg: 'Жаныбарды оңдоо'
      },
      details: {
        ru: 'Информация о животном',
        en: 'Animal information',
        kg: 'Жаныбар жөнүндө маалымат'
      },
      vaccination: {
        ru: 'Добавить вакцинацию',
        en: 'Add vaccination',
        kg: 'Вакцинация кошуу'
      },
      confirmDelete: {
        ru: 'Удалить это животное?',
        en: 'Delete this animal?',
        kg: 'Бул жаныбарды өчүрүү?'
      },
      name: {
        ru: 'Имя животного',
        en: 'Animal name',
        kg: 'Жаныбардын аты'
      },
      type: {
        ru: 'Тип животного',
        en: 'Animal type',
        kg: 'Жаныбардын түрү'
      },
      gender: {
        ru: 'Пол',
        en: 'Gender',
        kg: 'Жынысы'
      },
      breed: {
        ru: 'Порода',
        en: 'Breed',
        kg: 'Порода'
      },
      birthDate: {
        ru: 'Дата рождения',
        en: 'Birth date',
        kg: 'Туулган күнү'
      },
      weight: {
        ru: 'Вес (кг)',
        en: 'Weight (kg)',
        kg: 'Салмак (кг)'
      },
      location: {
        ru: 'Местоположение',
        en: 'Location',
        kg: 'Жайгашкан жери'
      },
      notes: {
        ru: 'Заметки',
        en: 'Notes',
        kg: 'Эскертүүлөр'
      },
      female: {
        ru: 'Женский',
        en: 'Female',
        kg: 'Ургаачы'
      },
      male: {
        ru: 'Мужской',
        en: 'Male',
        kg: 'Эркек'
      },
      milk: {
        ru: 'Надой (л/день)',
        en: 'Milk yield (l/day)',
        kg: 'Сүт (л/күн)'
      },
      wool: {
        ru: 'Шерсть (кг/год)',
        en: 'Wool (kg/year)',
        kg: 'Жүн (кг/жыл)'
      },
      eggs: {
        ru: 'Яйца (шт/неделю)',
        en: 'Eggs (pcs/week)',
        kg: 'Жумуртка (шт/апта)'
      },
      pregnant: {
        ru: 'Стельная',
        en: 'Pregnant',
        kg: 'Бооз'
      },
      dueDate: {
        ru: 'Предполагаемый отел',
        en: 'Expected calving',
        kg: 'Күтүлгөн төлдөө'
      },
      cancel: {
        ru: 'Отмена',
        en: 'Cancel',
        kg: 'Жокко чыгаруу'
      },
      next: {
        ru: 'Далее',
        en: 'Next',
        kg: 'Кийинки'
      },
      save: {
        ru: 'Сохранить',
        en: 'Save',
        kg: 'Сактоо'
      },
      update: {
        ru: 'Обновить',
        en: 'Update',
        kg: 'Жаңыртуу'
      }
    },
    buttons: {
      edit: {
        ru: 'Редактировать',
        en: 'Edit',
        kg: 'Оңдоо'
      },
      delete: {
        ru: 'Удалить',
        en: 'Delete',
        kg: 'Өчүрүү'
      },
      vaccinate: {
        ru: 'Вакцинация',
        en: 'Vaccinate',
        kg: 'Вакцинация'
      }
    }
  };

  const animalTypes = [
    { id: 'cattle', label: { ru: 'КРС', en: 'Cattle', kg: 'Ири мүйүздүү' }, color: 'amber', icon: '🐄' },
    { id: 'sheep', label: { ru: 'Овцы', en: 'Sheep', kg: 'Кой' }, color: 'blue', icon: '🐑' },
    { id: 'goat', label: { ru: 'Козы', en: 'Goats', kg: 'Эчки' }, color: 'emerald', icon: '🐐' },
    { id: 'horse', label: { ru: 'Лошади', en: 'Horses', kg: 'Жылкылар' }, color: 'purple', icon: '🐎' },
    { id: 'poultry', label: { ru: 'Птица', en: 'Poultry', kg: 'Куштар' }, color: 'orange', icon: '🐔' }
  ];

  const healthStatuses = [
    { id: 'excellent', label: pageText.healthStats.excellent, color: 'green' },
    { id: 'good', label: pageText.healthStats.good, color: 'blue' },
    { id: 'warning', label: pageText.healthStats.warning, color: 'yellow' },
    { id: 'critical', label: pageText.healthStats.critical, color: 'red' }
  ];

  // Load data
  useEffect(() => {
    loadAnimals();
  }, [selectedType, selectedHealth, searchTerm]);

  const loadAnimals = async () => {
    try {
      setLoading(true);
      const filters = {};
      if (selectedType !== 'all') filters.type = selectedType;
      if (selectedHealth !== 'all') filters.health = selectedHealth;
      if (searchTerm) filters.search = searchTerm;
      
      const response = await animalsAPI.getAll(filters);
      setAnimals(response.animals || []);
    } catch (err) {
      console.error('Ошибка загрузки животных:', err);
      setError('Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  };

  // Stats
  const stats = {
    total: animals.length,
    cattle: animals.filter(a => a.type === 'cattle').length,
    sheep: animals.filter(a => a.type === 'sheep').length,
    goats: animals.filter(a => a.type === 'goat').length,
    poultry: animals.filter(a => a.type === 'poultry').length,
    horses: animals.filter(a => a.type === 'horse').length,
    health: {
      excellent: animals.filter(a => a.health === 'excellent').length,
      good: animals.filter(a => a.health === 'good').length,
      warning: animals.filter(a => a.health === 'warning').length,
      critical: animals.filter(a => a.health === 'critical').length
    },
  };

  const handleAddAnimal = async (formData) => {
    try {
      console.log('📤 Добавление животного:', formData);
      
      const animalData = {
        name: formData.name,
        type: formData.type,
        breed: formData.breed,
        gender: formData.gender,
        birthDate: formData.birthDate || null,
        weight: Number(formData.weight) || 0,
        health: formData.health || 'good',
        location: formData.location,
        notes: formData.notes,
        milk: formData.type === 'cattle' ? Number(formData.milk) || 0 : 0,
        pregnant: formData.type === 'cattle' ? formData.pregnant || false : false,
        dueDate: formData.type === 'cattle' && formData.pregnant ? formData.dueDate : null,
        wool: formData.type === 'sheep' ? Number(formData.wool) || 0 : 0,
        eggsPerWeek: formData.type === 'poultry' ? Number(formData.eggsPerWeek) || 0 : 0
      };

      const response = await animalsAPI.create(animalData);
      setAnimals([...animals, response.animal]);
      setShowAddModal(false);
    } catch (err) {
      console.error('❌ Ошибка:', err);
      alert('Ошибка при добавлении животного');
    }
  };

  const handleEditClick = (animal) => {
    setSelectedAnimal(animal);
    setEditFormData({
      name: animal.name || '',
      type: animal.type || 'cattle',
      breed: animal.breed || '',
      gender: animal.gender || 'female',
      birthDate: animal.birthDate ? animal.birthDate.split('T')[0] : '',
      weight: animal.weight || '',
      health: animal.health || 'good',
      location: animal.location || '',
      notes: animal.notes || '',
      milk: animal.milk || '',
      pregnant: animal.pregnant || false,
      dueDate: animal.dueDate ? animal.dueDate.split('T')[0] : '',
      wool: animal.wool || '',
      eggsPerWeek: animal.eggsPerWeek || ''
    });
    setShowEditModal(true);
  };

  const handleUpdateAnimal = async () => {
    try {
      const animalData = {
        name: editFormData.name,
        type: editFormData.type,
        breed: editFormData.breed,
        gender: editFormData.gender,
        birthDate: editFormData.birthDate || null,
        weight: Number(editFormData.weight) || 0,
        health: editFormData.health || 'good',
        location: editFormData.location,
        notes: editFormData.notes,
        milk: editFormData.type === 'cattle' ? Number(editFormData.milk) || 0 : 0,
        pregnant: editFormData.type === 'cattle' ? editFormData.pregnant || false : false,
        dueDate: editFormData.type === 'cattle' && editFormData.pregnant ? editFormData.dueDate : null,
        wool: editFormData.type === 'sheep' ? Number(editFormData.wool) || 0 : 0,
        eggsPerWeek: editFormData.type === 'poultry' ? Number(editFormData.eggsPerWeek) || 0 : 0
      };

      const response = await animalsAPI.update(selectedAnimal._id, animalData);
      setAnimals(animals.map(a => a._id === selectedAnimal._id ? response.animal : a));
      setShowEditModal(false);
      setSelectedAnimal(null);
    } catch (err) {
      console.error('❌ Ошибка обновления:', err);
      alert('Ошибка при обновлении животного');
    }
  };

  const handleUpdateHealth = async (id, health, notes) => {
    try {
      const response = await animalsAPI.updateHealth(id, { health, notes });
      setAnimals(animals.map(a => a._id === id ? response.animal : a));
    } catch (err) {
      alert('Ошибка при обновлении здоровья');
    }
  };

  const handleAddVaccination = async (id, vaccination) => {
    try {
      const response = await animalsAPI.addVaccination(id, vaccination);
      setAnimals(animals.map(a => a._id === id ? response.animal : a));
      setShowVaccinationModal(null);
    } catch (err) {
      alert('Ошибка при добавлении вакцинации');
    }
  };

  const handleDeleteAnimal = async (id) => {
    if (!window.confirm(pageText.modal.confirmDelete[language])) return;

    try {
      await animalsAPI.delete(id);
      setAnimals(animals.filter(a => a._id !== id));
    } catch (err) {
      alert('Ошибка при удалении животного');
    }
  };

  const getHealthColor = (health) => {
    switch(health) {
      case 'excellent': return themeClasses.badge.excellent;
      case 'good': return themeClasses.badge.good;
      case 'warning': return themeClasses.badge.warning;
      case 'critical': return themeClasses.badge.critical;
      default: return theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800';
    }
  };

  const getHealthIcon = (health) => {
    switch(health) {
      case 'excellent': return <Check size={14} className={theme === 'dark' ? 'text-green-400' : 'text-green-600'} />;
      case 'good': return <Heart size={14} className={theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} />;
      case 'warning': return <AlertTriangle size={14} className={theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'} />;
      case 'critical': return <AlertCircle size={14} className={theme === 'dark' ? 'text-red-400' : 'text-red-600'} />;
      default: return <Info size={14} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} />;
    }
  };

  const getHealthText = (health) => {
    if (!health) return '—';
    return pageText.healthStats[health]?.[language] || health;
  };

  const getTypeName = (type) => {
    const typeObj = animalTypes.find(t => t.id === type);
    return typeObj?.label[language] || type;
  };

  const getTypeColor = (type) => {
    switch(type) {
      case 'cattle': return theme === 'dark' ? 'bg-amber-900/30 border-amber-800' : 'bg-amber-50 border-amber-200';
      case 'sheep': return theme === 'dark' ? 'bg-blue-900/30 border-blue-800' : 'bg-blue-50 border-blue-200';
      case 'goat': return theme === 'dark' ? 'bg-emerald-900/30 border-emerald-800' : 'bg-emerald-50 border-emerald-200';
      case 'horse': return theme === 'dark' ? 'bg-purple-900/30 border-purple-800' : 'bg-purple-50 border-purple-200';
      case 'poultry': return theme === 'dark' ? 'bg-orange-900/30 border-orange-800' : 'bg-orange-50 border-orange-200';
      default: return theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200';
    }
  };

  const getTypeTextColor = (type) => {
    switch(type) {
      case 'cattle': return theme === 'dark' ? 'text-amber-400' : 'text-amber-600';
      case 'sheep': return theme === 'dark' ? 'text-blue-400' : 'text-blue-600';
      case 'goat': return theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600';
      case 'horse': return theme === 'dark' ? 'text-purple-400' : 'text-purple-600';
      case 'poultry': return theme === 'dark' ? 'text-orange-400' : 'text-orange-600';
      default: return theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
    }
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return '—';
    const diff = new Date() - new Date(birthDate);
    const ageDate = new Date(diff);
    const years = Math.abs(ageDate.getUTCFullYear() - 1970);
    const months = Math.abs(ageDate.getUTCMonth());
    return years > 0 ? `${years} ${getYearText(years)}` : `${months} ${getMonthText(months)}`;
  };

  const getYearText = (years) => {
    if (years === 1) return language === 'ru' ? 'год' : language === 'en' ? 'year' : 'жаш';
    if (years > 1 && years < 5) return language === 'ru' ? 'года' : language === 'en' ? 'years' : 'жаш';
    return language === 'ru' ? 'лет' : language === 'en' ? 'years' : 'жаш';
  };

  const getMonthText = (months) => {
    if (months === 1) return language === 'ru' ? 'месяц' : language === 'en' ? 'month' : 'ай';
    return language === 'ru' ? 'месяцев' : language === 'en' ? 'months' : 'ай';
  };

  const filteredAnimals = animals
    .filter(animal => selectedType === 'all' || animal.type === selectedType)
    .filter(animal => selectedHealth === 'all' || animal.health === selectedHealth)
    .filter(animal => 
      animal.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  if (loading) {
    return (
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50'} flex items-center justify-center`}>
        <div className="text-center">
          <div className="relative">
            <div className={`w-20 h-20 border-4 ${theme === 'dark' ? 'border-gray-700 border-t-green-500' : 'border-green-200 border-t-green-600'} rounded-full animate-spin mx-auto`}></div>
            <div className="absolute top-6 left-6 text-2xl animate-pulse">🐄</div>
          </div>
          <p className={`mt-4 font-medium ${themeClasses.text.secondary}`}>
            {language === 'ru' ? 'Загрузка животных...' : 
             language === 'en' ? 'Loading animals...' : 
             'Жаныбарлар жүктөлүүдө...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${themeClasses.page} p-6`}>
      {/* Decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-20 left-10 w-64 h-64 ${theme === 'dark' ? 'bg-green-900/20' : 'bg-green-200'} rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob`}></div>
        <div className={`absolute top-40 right-10 w-64 h-64 ${theme === 'dark' ? 'bg-blue-900/20' : 'bg-blue-200'} rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000`}></div>
        <div className={`absolute bottom-20 left-20 w-64 h-64 ${theme === 'dark' ? 'bg-purple-900/20' : 'bg-purple-200'} rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000`}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg text-2xl">
                🐄
              </div>
              <div>
                <h1 className={`text-3xl font-bold ${themeClasses.text.primary}`}>
                  {pageText.title[language]}
                </h1>
                <p className={themeClasses.text.secondary}>
                  {pageText.subtitle[language]}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder={pageText.searchPlaceholder[language]}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-10 pr-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent w-64 ${themeClasses.input}`}
              />
              <Search size={18} className={`absolute left-3 top-3 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
            </div>

            {/* Filter by type */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className={`px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-green-500 ${themeClasses.input}`}
            >
              <option value="all">{pageText.filterType.all[language]}</option>
              {animalTypes.map(type => (
                <option key={type.id} value={type.id}>{type.icon} {type.label[language]}</option>
              ))}
            </select>

            {/* Filter by health */}
            <select
              value={selectedHealth}
              onChange={(e) => setSelectedHealth(e.target.value)}
              className={`px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-green-500 ${themeClasses.input}`}
            >
              <option value="all">{pageText.filterHealth.all[language]}</option>
              {healthStatuses.map(status => (
                <option key={status.id} value={status.id}>{status.label[language]}</option>
              ))}
            </select>

            {/* Add button */}
            <button
              onClick={() => setShowAddModal(true)}
              className={`px-5 py-2.5 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center gap-2 ${themeClasses.button.primary}`}
            >
              <Plus size={18} />
              <span>{pageText.addButton[language]}</span>
            </button>

            {/* Export */}
            <button className={`px-4 py-2.5 border rounded-xl transition-colors ${themeClasses.button.outline}`}>
              <Download size={18} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} />
            </button>
          </div>
        </div>

        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {/* Всего */}
          <div className={`rounded-xl p-4 shadow-sm border ${themeClasses.card}`}>
            <span className="text-2xl mb-2 block">🐾</span>
            <p className={`text-2xl font-bold ${themeClasses.text.primary}`}>{stats.total}</p>
            <p className={themeClasses.text.secondary}>{pageText.stats.total[language]}</p>
          </div>
          
          {/* КРС */}
          <div className={`rounded-xl p-4 shadow-sm border ${themeClasses.stat.cattle}`}>
            <span className="text-2xl mb-2 block">🐄</span>
            <p className={`text-2xl font-bold ${themeClasses.statText.cattle}`}>{stats.cattle}</p>
            <p className={theme === 'dark' ? 'text-amber-300' : 'text-amber-700'}>{pageText.stats.cattle[language]}</p>
          </div>
          
          {/* Овцы */}
          <div className={`rounded-xl p-4 shadow-sm border ${themeClasses.stat.sheep}`}>
            <span className="text-2xl mb-2 block">🐑</span>
            <p className={`text-2xl font-bold ${themeClasses.statText.sheep}`}>{stats.sheep}</p>
            <p className={theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}>{pageText.stats.sheep[language]}</p>
          </div>
          
          {/* Козы */}
          <div className={`rounded-xl p-4 shadow-sm border ${themeClasses.stat.goat}`}>
            <span className="text-2xl mb-2 block">🐐</span>
            <p className={`text-2xl font-bold ${themeClasses.statText.goat}`}>{stats.goats}</p>
            <p className={theme === 'dark' ? 'text-emerald-300' : 'text-emerald-700'}>{pageText.stats.goats[language]}</p>
          </div>
          
          {/* Лошади */}
          <div className={`rounded-xl p-4 shadow-sm border ${themeClasses.stat.horse}`}>
            <span className="text-2xl mb-2 block">🐎</span>
            <p className={`text-2xl font-bold ${themeClasses.statText.horse}`}>{stats.horses}</p>
            <p className={theme === 'dark' ? 'text-purple-300' : 'text-purple-700'}>{pageText.stats.horses[language]}</p>
          </div>
          
          {/* Птица */}
          <div className={`rounded-xl p-4 shadow-sm border ${themeClasses.stat.poultry}`}>
            <span className="text-2xl mb-2 block">🐔</span>
            <p className={`text-2xl font-bold ${themeClasses.statText.poultry}`}>{stats.poultry}</p>
            <p className={theme === 'dark' ? 'text-orange-300' : 'text-orange-700'}>{pageText.stats.poultry[language]}</p>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className={`rounded-xl p-6 shadow-sm border ${themeClasses.card}`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 ${theme === 'dark' ? 'bg-green-900/30' : 'bg-green-100'} rounded-lg flex items-center justify-center`}>
                <Heart className={`w-5 h-5 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} />
              </div>
              <span className={themeClasses.text.muted}>{pageText.healthStats.excellent[language]}</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className={themeClasses.text.secondary}>{pageText.healthStats.excellent[language]}</span>
                <span className={`font-semibold ${themeClasses.text.primary}`}>{stats.health.excellent}</span>
              </div>
              <div className="flex justify-between">
                <span className={themeClasses.text.secondary}>{pageText.healthStats.good[language]}</span>
                <span className={`font-semibold ${themeClasses.text.primary}`}>{stats.health.good}</span>
              </div>
              <div className="flex justify-between">
                <span className={theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}>{pageText.healthStats.warning[language]}</span>
                <span className={`font-semibold ${themeClasses.text.primary}`}>{stats.health.warning}</span>
              </div>
              <div className="flex justify-between">
                <span className={theme === 'dark' ? 'text-red-400' : 'text-red-600'}>{pageText.healthStats.critical[language]}</span>
                <span className={`font-semibold ${themeClasses.text.primary}`}>{stats.health.critical}</span>
              </div>
            </div>
          </div>

          <div className={`rounded-xl p-6 shadow-sm border ${themeClasses.card}`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 ${theme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-100'} rounded-lg flex items-center justify-center`}>
                <Milk className={`w-5 h-5 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
              </div>
              <span className={themeClasses.text.muted}>{pageText.productStats.milk[language]}</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className={themeClasses.text.secondary}>{pageText.productStats.milk[language]}</span>
                <span className={`font-semibold ${themeClasses.text.primary}`}>{stats.totalMilk} л/день</span>
              </div>
              <div className="flex justify-between">
                <span className={themeClasses.text.secondary}>{pageText.productStats.wool[language]}</span>
                <span className={`font-semibold ${themeClasses.text.primary}`}>{stats.totalWool} кг/год</span>
              </div>
              <div className="flex justify-between">
                <span className={themeClasses.text.secondary}>{pageText.productStats.eggs[language]}</span>
                <span className={`font-semibold ${themeClasses.text.primary}`}>{stats.totalEggs} шт/нед</span>
              </div>
            </div>
          </div>

          <div className={`rounded-xl p-6 shadow-sm border ${themeClasses.card}`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 ${theme === 'dark' ? 'bg-pink-900/30' : 'bg-pink-100'} rounded-lg flex items-center justify-center`}>
                <Calendar className={`w-5 h-5 ${theme === 'dark' ? 'text-pink-400' : 'text-pink-600'}`} />
              </div>
              <span className={themeClasses.text.muted}>{pageText.reproductionStats.pregnant[language]}</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className={themeClasses.text.secondary}>{pageText.reproductionStats.pregnant[language]}</span>
                <span className={`font-semibold ${themeClasses.text.primary}`}>{stats.pregnant}</span>
              </div>
              <div className="flex justify-between">
                <span className={themeClasses.text.secondary}>{pageText.reproductionStats.waiting[language]}</span>
                <span className={`font-semibold ${themeClasses.text.primary}`}>
                  {animals.filter(a => a.pregnant && a.dueDate).length}
                </span>
              </div>
            </div>
          </div>

          <div className={`rounded-xl p-6 shadow-sm border ${themeClasses.card}`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 ${theme === 'dark' ? 'bg-purple-900/30' : 'bg-purple-100'} rounded-lg flex items-center justify-center`}>
                <DollarSign className={`w-5 h-5 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />
              </div>
              <span className={themeClasses.text.muted}>{pageText.economyStats.profit[language]}</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className={themeClasses.text.secondary}>{pageText.economyStats.profit[language]}</span>
                <span className="font-semibold text-green-500">+245 000 сом</span>
              </div>
              <div className="flex justify-between">
                <span className={themeClasses.text.secondary}>{pageText.economyStats.expenses[language]}</span>
                <span className="font-semibold text-red-500">-98 000 сом</span>
              </div>
            </div>
          </div>
        </div>

        {/* Animals Table */}
        <div className={`rounded-xl shadow-sm border overflow-hidden ${themeClasses.card}`}>
          {error && (
            <div className={`p-4 border-b ${theme === 'dark' ? 'bg-red-900/20 border-red-800 text-red-400' : 'bg-red-50 border-red-200 text-red-700'}`}>
              <p>{error}</p>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={`border-b ${themeClasses.table.header}`}>
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    {pageText.table.name[language]}
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    {pageText.table.type[language]}
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    {pageText.table.breed[language]}
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    {pageText.table.age[language]}
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    {pageText.table.weight[language]}
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    {pageText.table.health[language]}
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    {pageText.table.actions[language]}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredAnimals.map((animal) => (
                  <tr 
                    key={animal._id} 
                    className={`cursor-pointer transition-colors ${themeClasses.table.row}`}
                    onClick={() => setShowDetailsModal(animal)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg border ${getTypeColor(animal.type)} text-xl`}>
                          {getAnimalIcon(animal.type, "w-5 h-5")}
                        </div>
                        <div>
                          <p className={`text-sm font-medium ${themeClasses.text.primary}`}>{animal.name}</p>
                          <p className={`text-xs ${themeClasses.text.muted}`}>ID: {animal._id?.slice(-4)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm ${themeClasses.text.secondary}`}>{getTypeName(animal.type)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm ${themeClasses.text.secondary}`}>{animal.breed || '—'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm ${themeClasses.text.secondary}`}>{calculateAge(animal.birthDate)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-medium ${themeClasses.text.primary}`}>{animal.weight} кг</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getHealthColor(animal.health)}`}>
                        {getHealthIcon(animal.health)}
                        {getHealthText(animal.health)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowVaccinationModal(animal);
                          }}
                          className={`p-1 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-blue-900/50' : 'hover:bg-blue-100'}`}
                          title={pageText.buttons.vaccinate[language]}
                        >
                          <Syringe size={16} className={theme === 'dark' ? 'text-blue-400' : 'text-blue-500'} />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditClick(animal);
                          }}
                          className={`p-1 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-green-900/50' : 'hover:bg-green-100'}`}
                          title={pageText.buttons.edit[language]}
                        >
                          <Edit2 size={16} className={theme === 'dark' ? 'text-green-400' : 'text-green-500'} />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteAnimal(animal._id);
                          }}
                          className={`p-1 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-red-900/50' : 'hover:bg-red-100'}`}
                          title={pageText.buttons.delete[language]}
                        >
                          <Trash2 size={16} className={theme === 'dark' ? 'text-red-400' : 'text-red-500'} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredAnimals.length === 0 && !loading && (
            <div className="text-center py-12">
              <span className="text-6xl mb-4 block">🐄</span>
              <p className={themeClasses.text.secondary}>
                {searchTerm ? pageText.noResults[language] : pageText.noAnimals[language]}
              </p>
            </div>
          )}
        </div>

        {/* Modals */}
        {showAddModal && (
          <AddAnimalModal
            onClose={() => setShowAddModal(false)}
            onSave={handleAddAnimal}
            language={language}
            pageText={pageText}
            animalTypes={animalTypes}
            theme={theme}
            themeClasses={themeClasses}
            getAnimalIcon={getAnimalIconComponent}
          />
        )}

        {showEditModal && (
          <EditAnimalModal
            animal={selectedAnimal}
            formData={editFormData}
            setFormData={setEditFormData}
            onClose={() => {
              setShowEditModal(false);
              setSelectedAnimal(null);
            }}
            onSave={handleUpdateAnimal}
            language={language}
            pageText={pageText}
            animalTypes={animalTypes}
            theme={theme}
            themeClasses={themeClasses}
            getAnimalIcon={getAnimalIconComponent}
          />
        )}

        {showDetailsModal && (
          <AnimalDetailsModal
            animal={showDetailsModal}
            onClose={() => setShowDetailsModal(null)}
            onUpdateHealth={handleUpdateHealth}
            language={language}
            pageText={pageText}
            theme={theme}
            themeClasses={themeClasses}
            getAnimalIcon={getAnimalIcon}
          />
        )}

        {showVaccinationModal && (
          <VaccinationModal
            animal={showVaccinationModal}
            onClose={() => setShowVaccinationModal(null)}
            onSave={handleAddVaccination}
            language={language}
            pageText={pageText}
            theme={theme}
            themeClasses={themeClasses}
          />
        )}
      </div>
    </div>
  );
};

// Add Animal Modal Component
const AddAnimalModal = ({ onClose, onSave, language, pageText, animalTypes, theme, themeClasses, getAnimalIcon }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    type: 'cattle',
    breed: '',
    gender: 'female',
    birthDate: '',
    weight: '',
    health: 'good',
    location: '',
    notes: '',
    milk: '',
    pregnant: false,
    dueDate: '',
    wool: '',
    eggsPerWeek: ''
  });

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = () => {
    if (step === 1 && formData.name.trim()) {
      setStep(2);
    } else if (step === 2) {
      onSave(formData);
    }
  };

  return (
    <div className={`fixed inset-0 ${themeClasses.modal.overlay} backdrop-blur-sm flex items-center justify-center z-50 p-4`}>
      <div className={`rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border ${themeClasses.modal.content}`}>
        <div className={`p-6 border-b ${themeClasses.border} sticky top-0 ${themeClasses.modal.content}`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent`}>
              {step === 1 ? pageText.modal.add[language] : pageText.modal.details[language]}
            </h2>
            <button onClick={onClose} className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
              <X size={20} className={themeClasses.text.secondary} />
            </button>
          </div>
          
          {/* Progress */}
          <div className="flex items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
              step >= 1 ? 'bg-green-600 text-white' : theme === 'dark' ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-400'
            }`}>1</div>
            <div className={`flex-1 h-1 rounded-full ${step >= 2 ? 'bg-green-600' : theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
              step >= 2 ? 'bg-green-600 text-white' : theme === 'dark' ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-400'
            }`}>2</div>
          </div>
        </div>

        <div className="p-6">
          {step === 1 ? (
            <div className="space-y-4">
              {/* Animal Type */}
              <div>
                <label className={`block text-sm font-medium mb-3 ${themeClasses.text.secondary}`}>{pageText.modal.type[language]}</label>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                  {animalTypes.map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => handleChange('type', type.id)}
                      className={`p-4 border-2 rounded-xl transition-all ${
                        formData.type === type.id
                          ? `border-${type.color}-500 ${theme === 'dark' ? `bg-${type.color}-900/30` : `bg-${type.color}-50`} scale-105 shadow-lg`
                          : theme === 'dark' 
                            ? 'border-gray-700 hover:border-gray-600 hover:bg-gray-700'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className={`mb-2 flex justify-center text-3xl ${
                        formData.type === type.id ? `text-${type.color}-500` : themeClasses.text.secondary
                      }`}>
                        {type.icon}
                      </div>
                      <span className={`text-sm font-medium ${
                        formData.type === type.id ? `text-${type.color}-500` : themeClasses.text.secondary
                      }`}>{type.label[language]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Animal Name */}
              <div>
                <label className={`block text-sm font-medium mb-1 ${themeClasses.text.secondary}`}>
                  {pageText.modal.name[language]} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder={pageText.modal.name[language]}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 ${themeClasses.input}`}
                  required
                  autoFocus
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Gender */}
              <div>
                <label className={`block text-sm font-medium mb-1 ${themeClasses.text.secondary}`}>{pageText.modal.gender[language]}</label>
                <select
                  value={formData.gender}
                  onChange={(e) => handleChange('gender', e.target.value)}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:border-green-500 ${themeClasses.input}`}
                >
                  <option value="female">{pageText.modal.female[language]}</option>
                  <option value="male">{pageText.modal.male[language]}</option>
                </select>
              </div>

              {/* Breed */}
              <div>
                <label className={`block text-sm font-medium mb-1 ${themeClasses.text.secondary}`}>{pageText.modal.breed[language]}</label>
                <input
                  type="text"
                  value={formData.breed}
                  onChange={(e) => handleChange('breed', e.target.value)}
                  placeholder={pageText.modal.breed[language]}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:border-green-500 ${themeClasses.input}`}
                />
              </div>

              {/* Birth Date and Weight */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${themeClasses.text.secondary}`}>{pageText.modal.birthDate[language]}</label>
                  <input
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => handleChange('birthDate', e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:border-green-500 ${themeClasses.input}`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${themeClasses.text.secondary}`}>{pageText.modal.weight[language]}</label>
                  <input
                    type="number"
                    value={formData.weight}
                    onChange={(e) => handleChange('weight', e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:border-green-500 ${themeClasses.input}`}
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className={`block text-sm font-medium mb-1 ${themeClasses.text.secondary}`}>{pageText.modal.location[language]}</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  placeholder={pageText.modal.location[language]}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:border-green-500 ${themeClasses.input}`}
                />
              </div>

              {/* Cattle-specific fields */}
              {formData.type === 'cattle' && (
                <>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${themeClasses.text.secondary}`}>{pageText.modal.milk[language]}</label>
                    <input
                      type="number"
                      value={formData.milk}
                      onChange={(e) => handleChange('milk', e.target.value)}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:border-green-500 ${themeClasses.input}`}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="pregnant"
                      checked={formData.pregnant}
                      onChange={(e) => handleChange('pregnant', e.target.checked)}
                      className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                    />
                    <label htmlFor="pregnant" className={`text-sm ${themeClasses.text.secondary}`}>{pageText.modal.pregnant[language]}</label>
                  </div>
                  {formData.pregnant && (
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${themeClasses.text.secondary}`}>{pageText.modal.dueDate[language]}</label>
                      <input
                        type="date"
                        value={formData.dueDate}
                        onChange={(e) => handleChange('dueDate', e.target.value)}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:border-green-500 ${themeClasses.input}`}
                      />
                    </div>
                  )}
                </>
              )}

              {/* Sheep-specific fields */}
              {formData.type === 'sheep' && (
                <div>
                  <label className={`block text-sm font-medium mb-1 ${themeClasses.text.secondary}`}>{pageText.modal.wool[language]}</label>
                  <input
                    type="number"
                    value={formData.wool}
                    onChange={(e) => handleChange('wool', e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:border-green-500 ${themeClasses.input}`}
                  />
                </div>
              )}

              {/* Poultry-specific fields */}
              {formData.type === 'poultry' && (
                <div>
                  <label className={`block text-sm font-medium mb-1 ${themeClasses.text.secondary}`}>{pageText.modal.eggs[language]}</label>
                  <input
                    type="number"
                    value={formData.eggsPerWeek}
                    onChange={(e) => handleChange('eggsPerWeek', e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:border-green-500 ${themeClasses.input}`}
                  />
                </div>
              )}

              {/* Notes */}
              <div>
                <label className={`block text-sm font-medium mb-1 ${themeClasses.text.secondary}`}>{pageText.modal.notes[language]}</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  rows="3"
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:border-green-500 ${themeClasses.input}`}
                  placeholder={pageText.modal.notes[language]}
                />
              </div>
            </div>
          )}
        </div>

        <div className={`p-6 border-t ${themeClasses.border} flex justify-end gap-3`}>
          <button
            type="button"
            onClick={onClose}
            className={`px-6 py-3 border-2 rounded-xl font-medium transition-colors ${themeClasses.button.outline}`}
          >
            {pageText.modal.cancel[language]}
          </button>
          {step === 1 ? (
            <button
              onClick={handleSubmit}
              disabled={!formData.name.trim()}
              className={`px-6 py-3 rounded-xl font-medium disabled:opacity-50 ${themeClasses.button.primary}`}
            >
              {pageText.modal.next[language]}
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className={`px-6 py-3 rounded-xl font-medium ${themeClasses.button.primary}`}
            >
              {pageText.modal.save[language]}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Edit Animal Modal Component
const EditAnimalModal = ({ animal, formData, setFormData, onClose, onSave, language, pageText, animalTypes, theme, themeClasses, getAnimalIcon }) => {
  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className={`fixed inset-0 ${themeClasses.modal.overlay} backdrop-blur-sm flex items-center justify-center z-50 p-4`}>
      <div className={`rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border ${themeClasses.modal.content}`}>
        <div className={`p-6 border-b ${themeClasses.border} sticky top-0 ${themeClasses.modal.content}`}>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              {pageText.modal.edit[language]}
            </h2>
            <button onClick={onClose} className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
              <X size={20} className={themeClasses.text.secondary} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {/* Animal Type */}
          <div>
            <label className={`block text-sm font-medium mb-3 ${themeClasses.text.secondary}`}>{pageText.modal.type[language]}</label>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
              {animalTypes.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => handleChange('type', type.id)}
                  className={`p-4 border-2 rounded-xl transition-all ${
                    formData.type === type.id
                      ? `border-${type.color}-500 ${theme === 'dark' ? `bg-${type.color}-900/30` : `bg-${type.color}-50`} scale-105 shadow-lg`
                      : theme === 'dark' 
                        ? 'border-gray-700 hover:border-gray-600 hover:bg-gray-700'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className={`mb-2 flex justify-center text-3xl ${
                    formData.type === type.id ? `text-${type.color}-500` : themeClasses.text.secondary
                  }`}>
                    {type.icon}
                  </div>
                  <span className={`text-sm font-medium ${
                    formData.type === type.id ? `text-${type.color}-500` : themeClasses.text.secondary
                  }`}>{type.label[language]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Animal Name */}
          <div>
            <label className={`block text-sm font-medium mb-1 ${themeClasses.text.secondary}`}>
              {pageText.modal.name[language]} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder={pageText.modal.name[language]}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:border-green-500 ${themeClasses.input}`}
              required
            />
          </div>

          {/* Gender */}
          <div>
            <label className={`block text-sm font-medium mb-1 ${themeClasses.text.secondary}`}>{pageText.modal.gender[language]}</label>
            <select
              value={formData.gender}
              onChange={(e) => handleChange('gender', e.target.value)}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:border-green-500 ${themeClasses.input}`}
            >
              <option value="female">{pageText.modal.female[language]}</option>
              <option value="male">{pageText.modal.male[language]}</option>
            </select>
          </div>

          {/* Breed */}
          <div>
            <label className={`block text-sm font-medium mb-1 ${themeClasses.text.secondary}`}>{pageText.modal.breed[language]}</label>
            <input
              type="text"
              value={formData.breed}
              onChange={(e) => handleChange('breed', e.target.value)}
              placeholder={pageText.modal.breed[language]}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:border-green-500 ${themeClasses.input}`}
            />
          </div>

          {/* Birth Date and Weight */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-1 ${themeClasses.text.secondary}`}>{pageText.modal.birthDate[language]}</label>
              <input
                type="date"
                value={formData.birthDate}
                onChange={(e) => handleChange('birthDate', e.target.value)}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:border-green-500 ${themeClasses.input}`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1 ${themeClasses.text.secondary}`}>{pageText.modal.weight[language]}</label>
              <input
                type="number"
                value={formData.weight}
                onChange={(e) => handleChange('weight', e.target.value)}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:border-green-500 ${themeClasses.input}`}
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className={`block text-sm font-medium mb-1 ${themeClasses.text.secondary}`}>{pageText.modal.location[language]}</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder={pageText.modal.location[language]}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:border-green-500 ${themeClasses.input}`}
            />
          </div>

          {/* Cattle-specific fields */}
          {formData.type === 'cattle' && (
            <>
              <div>
                <label className={`block text-sm font-medium mb-1 ${themeClasses.text.secondary}`}>{pageText.modal.milk[language]}</label>
                <input
                  type="number"
                  value={formData.milk}
                  onChange={(e) => handleChange('milk', e.target.value)}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:border-green-500 ${themeClasses.input}`}
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="edit-pregnant"
                  checked={formData.pregnant}
                  onChange={(e) => handleChange('pregnant', e.target.checked)}
                  className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                />
                <label htmlFor="edit-pregnant" className={`text-sm ${themeClasses.text.secondary}`}>{pageText.modal.pregnant[language]}</label>
              </div>
              {formData.pregnant && (
                <div>
                  <label className={`block text-sm font-medium mb-1 ${themeClasses.text.secondary}`}>{pageText.modal.dueDate[language]}</label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => handleChange('dueDate', e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:border-green-500 ${themeClasses.input}`}
                  />
                </div>
              )}
            </>
          )}

          {/* Sheep-specific fields */}
          {formData.type === 'sheep' && (
            <div>
              <label className={`block text-sm font-medium mb-1 ${themeClasses.text.secondary}`}>{pageText.modal.wool[language]}</label>
              <input
                type="number"
                value={formData.wool}
                onChange={(e) => handleChange('wool', e.target.value)}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:border-green-500 ${themeClasses.input}`}
              />
            </div>
          )}

          {/* Poultry-specific fields */}
          {formData.type === 'poultry' && (
            <div>
              <label className={`block text-sm font-medium mb-1 ${themeClasses.text.secondary}`}>{pageText.modal.eggs[language]}</label>
              <input
                type="number"
                value={formData.eggsPerWeek}
                onChange={(e) => handleChange('eggsPerWeek', e.target.value)}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:border-green-500 ${themeClasses.input}`}
              />
            </div>
          )}

          {/* Notes */}
          <div>
            <label className={`block text-sm font-medium mb-1 ${themeClasses.text.secondary}`}>{pageText.modal.notes[language]}</label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              rows="3"
              className={`w-full px-4 py-3 border-2 rounded-xl focus:border-green-500 ${themeClasses.input}`}
              placeholder={pageText.modal.notes[language]}
            />
          </div>
        </div>

        <div className={`p-6 border-t ${themeClasses.border} flex justify-end gap-3`}>
          <button
            type="button"
            onClick={onClose}
            className={`px-6 py-3 border-2 rounded-xl font-medium transition-colors ${themeClasses.button.outline}`}
          >
            {pageText.modal.cancel[language]}
          </button>
          <button
            onClick={onSave}
            className={`px-6 py-3 rounded-xl font-medium ${themeClasses.button.primary}`}
          >
            {pageText.modal.update[language]}
          </button>
        </div>
      </div>
    </div>
  );
};

// Animal Details Modal Component
const AnimalDetailsModal = ({ animal, onClose, onUpdateHealth, language, pageText, theme, themeClasses, getAnimalIcon }) => {
  const [healthNote, setHealthNote] = useState('');

  const handleHealthChange = (health) => {
    onUpdateHealth(animal._id, health, healthNote);
  };

  const getTypeColor = (type) => {
    switch(type) {
      case 'cattle': return theme === 'dark' ? 'bg-amber-900/30 border-amber-800' : 'bg-amber-50 border-amber-200';
      case 'sheep': return theme === 'dark' ? 'bg-blue-900/30 border-blue-800' : 'bg-blue-50 border-blue-200';
      case 'goat': return theme === 'dark' ? 'bg-emerald-900/30 border-emerald-800' : 'bg-emerald-50 border-emerald-200';
      case 'horse': return theme === 'dark' ? 'bg-purple-900/30 border-purple-800' : 'bg-purple-50 border-purple-200';
      case 'poultry': return theme === 'dark' ? 'bg-orange-900/30 border-orange-800' : 'bg-orange-50 border-orange-200';
      default: return theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200';
    }
  };

  const getTypeName = (type) => {
    const names = {
      cattle: { ru: 'КРС', en: 'Cattle', kg: 'Ири мүйүздүү' },
      sheep: { ru: 'Овцы', en: 'Sheep', kg: 'Кой' },
      goat: { ru: 'Козы', en: 'Goats', kg: 'Эчки' },
      horse: { ru: 'Лошади', en: 'Horses', kg: 'Жылкылар' },
      poultry: { ru: 'Птица', en: 'Poultry', kg: 'Куштар' }
    };
    return names[type]?.[language] || type;
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return '—';
    const diff = new Date() - new Date(birthDate);
    const ageDate = new Date(diff);
    const years = Math.abs(ageDate.getUTCFullYear() - 1970);
    const months = Math.abs(ageDate.getUTCMonth());
    return years > 0 ? `${years} лет` : `${months} мес`;
  };

  return (
    <div className={`fixed inset-0 ${themeClasses.modal.overlay} backdrop-blur-sm flex items-center justify-center z-50 p-4`}>
      <div className={`rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border ${themeClasses.modal.content}`}>
        <div className={`p-6 border-b ${themeClasses.border} flex justify-between items-center sticky top-0 ${themeClasses.modal.content}`}>
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl border ${getTypeColor(animal.type)} text-3xl`}>
              {getAnimalIcon(animal.type, "w-8 h-8")}
            </div>
            <div>
              <h2 className={`text-2xl font-bold ${themeClasses.text.primary}`}>{animal.name}</h2>
              <p className={themeClasses.text.muted}>{getTypeName(animal.type)}</p>
            </div>
          </div>
          <button onClick={onClose} className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
            <X size={20} className={themeClasses.text.secondary} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
              <p className={`text-xs mb-1 ${themeClasses.text.muted}`}>{pageText.modal.gender[language]}</p>
              <p className={`text-lg font-semibold ${themeClasses.text.primary}`}>
                {animal.gender === 'female' ? pageText.modal.female[language] : pageText.modal.male[language]}
              </p>
            </div>
            <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
              <p className={`text-xs mb-1 ${themeClasses.text.muted}`}>{pageText.modal.breed[language]}</p>
              <p className={`text-lg font-semibold ${themeClasses.text.primary}`}>{animal.breed || '—'}</p>
            </div>
            <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
              <p className={`text-xs mb-1 ${themeClasses.text.muted}`}>{pageText.modal.birthDate[language]}</p>
              <p className={`text-lg font-semibold ${themeClasses.text.primary}`}>{calculateAge(animal.birthDate)}</p>
            </div>
            <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
              <p className={`text-xs mb-1 ${themeClasses.text.muted}`}>{pageText.modal.weight[language]}</p>
              <p className={`text-lg font-semibold ${themeClasses.text.primary}`}>{animal.weight} кг</p>
            </div>
            <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
              <p className={`text-xs mb-1 ${themeClasses.text.muted}`}>{pageText.modal.location[language]}</p>
              <p className={`text-lg font-semibold ${themeClasses.text.primary}`}>{animal.location || '—'}</p>
            </div>
            <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
              <p className={`text-xs mb-1 ${themeClasses.text.muted}`}>{pageText.table.health[language]}</p>
              <p className={`text-lg font-semibold ${themeClasses.text.primary}`}>
                {pageText.healthStats[animal.health]?.[language] || animal.health}
              </p>
            </div>
          </div>

          {/* Specific Information */}
          {animal.type === 'cattle' && animal.milk > 0 && (
            <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-50'}`}>
              <p className={`text-xs mb-1 ${themeClasses.text.muted}`}>{pageText.modal.milk[language]}</p>
              <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-blue-400' : 'text-blue-900'}`}>{animal.milk} л/день</p>
            </div>
          )}

          {animal.type === 'sheep' && animal.wool > 0 && (
            <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-purple-900/30' : 'bg-purple-50'}`}>
              <p className={`text-xs mb-1 ${themeClasses.text.muted}`}>{pageText.modal.wool[language]}</p>
              <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-purple-400' : 'text-purple-900'}`}>{animal.wool} кг/год</p>
            </div>
          )}

          {animal.type === 'poultry' && animal.eggsPerWeek > 0 && (
            <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-orange-900/30' : 'bg-orange-50'}`}>
              <p className={`text-xs mb-1 ${themeClasses.text.muted}`}>{pageText.modal.eggs[language]}</p>
              <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-orange-400' : 'text-orange-900'}`}>{animal.eggsPerWeek} шт/неделю</p>
            </div>
          )}

          {animal.pregnant && (
            <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-pink-900/30' : 'bg-pink-50'}`}>
              <p className={`text-xs mb-1 ${themeClasses.text.muted}`}>{pageText.modal.dueDate[language]}</p>
              <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-pink-400' : 'text-pink-900'}`}>
                {animal.dueDate ? new Date(animal.dueDate).toLocaleDateString() : pageText.reproductionStats.waiting[language]}
              </p>
            </div>
          )}

          {/* Vaccinations */}
          {animal.vaccinations?.length > 0 && (
            <div>
              <h3 className={`font-medium mb-3 ${themeClasses.text.primary}`}>{pageText.buttons.vaccinate[language]}</h3>
              <div className="space-y-2">
                {animal.vaccinations.map((vax, i) => (
                  <div key={i} className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                    <p className={`font-medium ${themeClasses.text.primary}`}>{vax.name}</p>
                    <p className={`text-sm ${themeClasses.text.muted}`}>
                      {new Date(vax.date).toLocaleDateString()}
                      {vax.nextDate && ` → ${new Date(vax.nextDate).toLocaleDateString()}`}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {animal.notes && (
            <div>
              <h3 className={`font-medium mb-3 ${themeClasses.text.primary}`}>{pageText.modal.notes[language]}</h3>
              <p className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'} ${themeClasses.text.secondary}`}>{animal.notes}</p>
            </div>
          )}

          {/* Health Update */}
          <div>
            <h3 className={`font-medium mb-3 ${themeClasses.text.primary}`}>{pageText.table.health[language]}</h3>
            <div className="flex gap-2 mb-3">
              <button
                onClick={() => handleHealthChange('excellent')}
                className={`flex-1 py-2 rounded-lg transition-colors ${
                  theme === 'dark' 
                    ? 'bg-green-900/30 text-green-400 hover:bg-green-900/50' 
                    : 'bg-green-100 text-green-800 hover:bg-green-200'
                }`}
              >
                {pageText.healthStats.excellent[language]}
              </button>
              <button
                onClick={() => handleHealthChange('good')}
                className={`flex-1 py-2 rounded-lg transition-colors ${
                  theme === 'dark' 
                    ? 'bg-blue-900/30 text-blue-400 hover:bg-blue-900/50' 
                    : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                }`}
              >
                {pageText.healthStats.good[language]}
              </button>
              <button
                onClick={() => handleHealthChange('warning')}
                className={`flex-1 py-2 rounded-lg transition-colors ${
                  theme === 'dark' 
                    ? 'bg-yellow-900/30 text-yellow-400 hover:bg-yellow-900/50' 
                    : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                }`}
              >
                {pageText.healthStats.warning[language]}
              </button>
              <button
                onClick={() => handleHealthChange('critical')}
                className={`flex-1 py-2 rounded-lg transition-colors ${
                  theme === 'dark' 
                    ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50' 
                    : 'bg-red-100 text-red-800 hover:bg-red-200'
                }`}
              >
                {pageText.healthStats.critical[language]}
              </button>
            </div>
            <textarea
              value={healthNote}
              onChange={(e) => setHealthNote(e.target.value)}
              placeholder={pageText.modal.notes[language]}
              className={`w-full px-4 py-2 border rounded-xl ${themeClasses.input}`}
              rows="2"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Vaccination Modal Component
const VaccinationModal = ({ animal, onClose, onSave, language, pageText, theme, themeClasses }) => {
  const [formData, setFormData] = useState({
    name: '',
    date: new Date().toISOString().split('T')[0],
    nextDate: '',
    notes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(animal._id, formData);
  };

  return (
    <div className={`fixed inset-0 ${themeClasses.modal.overlay} backdrop-blur-sm flex items-center justify-center z-50 p-4`}>
      <div className={`rounded-2xl max-w-md w-full shadow-2xl border ${themeClasses.modal.content}`}>
        <div className={`p-6 border-b ${themeClasses.border} flex justify-between items-center`}>
          <h2 className={`text-xl font-bold ${themeClasses.text.primary}`}>
            {pageText.modal.vaccination[language]} {animal.name}
          </h2>
          <button onClick={onClose} className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
            <X size={20} className={themeClasses.text.secondary} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-1 ${themeClasses.text.secondary}`}>
              {pageText.modal.name[language]}
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className={`w-full px-4 py-2 border-2 rounded-xl focus:border-green-500 ${themeClasses.input}`}
              required
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${themeClasses.text.secondary}`}>
              {pageText.modal.date || 'Дата вакцинации'}
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              className={`w-full px-4 py-2 border-2 rounded-xl focus:border-green-500 ${themeClasses.input}`}
              required
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${themeClasses.text.secondary}`}>
              {pageText.modal.nextDate || 'Следующая вакцинация'}
            </label>
            <input
              type="date"
              value={formData.nextDate}
              onChange={(e) => setFormData({...formData, nextDate: e.target.value})}
              className={`w-full px-4 py-2 border-2 rounded-xl focus:border-green-500 ${themeClasses.input}`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${themeClasses.text.secondary}`}>
              {pageText.modal.notes[language]}
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              rows="3"
              className={`w-full px-4 py-2 border-2 rounded-xl focus:border-green-500 ${themeClasses.input}`}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 border-2 rounded-xl font-medium transition-colors ${themeClasses.button.outline}`}
            >
              {pageText.modal.cancel[language]}
            </button>
            <button
              type="submit"
              className={`px-4 py-2 rounded-xl font-medium ${themeClasses.button.primary}`}
            >
              {pageText.modal.save[language]}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Add animations to your CSS file
const styles = `
  @keyframes blob {
    0% { transform: translate(0px, 0px) scale(1); }
    33% { transform: translate(30px, -50px) scale(1.1); }
    66% { transform: translate(-20px, 20px) scale(0.9); }
    100% { transform: translate(0px, 0px) scale(1); }
  }
  .animate-blob { animation: blob 7s infinite; }
  .animation-delay-2000 { animation-delay: 2s; }
  .animation-delay-4000 { animation-delay: 4s; }
`;

const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default Animals;