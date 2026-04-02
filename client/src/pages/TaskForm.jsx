// src/pages/TaskForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import tasksAPI from '../services/api/tasksAPI';
import fieldsAPI from '../services/api/fieldsAPI';
import { Calendar, Clock, Users, DollarSign, Tag, ArrowLeft, Save } from 'lucide-react';

const TaskForm = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'sowing',
    priority: 'medium',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 7*24*60*60*1000).toISOString().split('T')[0],
    fieldId: '',
    assignedTo: '',
    estimatedCost: '',
    notes: ''
  });

  // Типы задач
  const taskTypes = [
    { id: 'sowing', name: { ru: 'Посев', en: 'Sowing', kg: 'Себүү' }, icon: '🌱' },
    { id: 'watering', name: { ru: 'Полив', en: 'Watering', kg: 'Сугаруу' }, icon: '💧' },
    { id: 'fertilizing', name: { ru: 'Удобрение', en: 'Fertilizing', kg: 'Жерсемирткич' }, icon: '🧪' },
    { id: 'treatment', name: { ru: 'Обработка', en: 'Treatment', kg: 'Дарылоо' }, icon: '🔬' },
    { id: 'harvesting', name: { ru: 'Уборка', en: 'Harvesting', kg: 'Жыйноо' }, icon: '🌾' },
    { id: 'maintenance', name: { ru: 'Обслуживание', en: 'Maintenance', kg: 'Тейлөө' }, icon: '🔧' },
    { id: 'other', name: { ru: 'Другое', en: 'Other', kg: 'Башка' }, icon: '📝' }
  ];

  // Приоритеты
  const priorities = [
    { id: 'low', name: { ru: 'Низкий', en: 'Low', kg: 'Төмөн' }, color: 'bg-green-100 text-green-800' },
    { id: 'medium', name: { ru: 'Средний', en: 'Medium', kg: 'Орточо' }, color: 'bg-yellow-100 text-yellow-800' },
    { id: 'high', name: { ru: 'Высокий', en: 'High', kg: 'Жогорку' }, color: 'bg-orange-100 text-orange-800' },
    { id: 'critical', name: { ru: 'Критичный', en: 'Critical', kg: 'Критикалык' }, color: 'bg-red-100 text-red-800' }
  ];

  useEffect(() => {
    loadFields();
    if (isEditing) {
      loadTask();
    }
  }, []);

  const loadFields = async () => {
    try {
      const response = await fieldsAPI.getAll();
      setFields(response.fields || []);
    } catch (error) {
      console.error('Ошибка загрузки полей:', error);
    }
  };

  const loadTask = async () => {
    try {
      setLoading(true);
      const response = await tasksAPI.getOne(id);
      const task = response.task;
      setFormData({
        title: task.title || '',
        description: task.description || '',
        type: task.type || 'sowing',
        priority: task.priority || 'medium',
        startDate: task.startDate ? task.startDate.split('T')[0] : '',
        endDate: task.endDate ? task.endDate.split('T')[0] : '',
        fieldId: task.fieldId || '',
        assignedTo: task.assignedTo || '',
        estimatedCost: task.estimatedCost || '',
        notes: task.notes || ''
      });
    } catch (error) {
      console.error('Ошибка загрузки задачи:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // TaskForm.jsx - функция handleSubmit
   const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!formData.title.trim()) {
    alert('Введите название задачи');
    return;
  }

  try {
    setLoading(true);
    
    // ✅ Подготавливаем данные с правильной структурой
    const taskData = {
      title: formData.title,
      description: formData.description || '',
      type: formData.type,
      priority: formData.priority,
      startDate: formData.startDate,
      endDate: formData.endDate,
      fieldId: formData.fieldId || null,
      assignedTo: formData.assignedTo || null,
      estimatedCost: formData.estimatedCost ? Number(formData.estimatedCost) : 0,
      notes: formData.notes || '',
      status: 'pending'
    };

    console.log('📤 Отправка задачи:', taskData);

    if (isEditing) {
      await tasksAPI.update(id, taskData);
      alert('Задача обновлена!');
    } else {
      await tasksAPI.create(taskData);
      alert('Задача создана!');
    }
    
    navigate('/tasks');
  } catch (error) {
    console.error('❌ Ошибка сохранения:', error.response?.data || error.message);
    alert('Ошибка при сохранении задачи: ' + (error.response?.data?.message || error.message));
  } finally {
    setLoading(false);
  }
};

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Заголовок */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/tasks')}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditing 
              ? (language === 'ru' ? 'Редактировать задачу' : 
                 language === 'en' ? 'Edit Task' : 
                 'Милдетти өзгөртүү')
              : (language === 'ru' ? 'Новая задача' : 
                 language === 'en' ? 'New Task' : 
                 'Жаңы милдет')}
          </h1>
        </div>
      </div>

      {/* Форма */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
        {/* Название */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {language === 'ru' ? 'Название' : language === 'en' ? 'Title' : 'Аталышы'} *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder={language === 'ru' ? 'Введите название задачи' : 
                        language === 'en' ? 'Enter task title' : 
                        'Милдеттин аталышын жазыңыз'}
            required
          />
        </div>

        {/* Тип и приоритет */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'ru' ? 'Тип' : language === 'en' ? 'Type' : 'Түрү'}
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500"
            >
              {taskTypes.map(type => (
                <option key={type.id} value={type.id}>
                  {type.icon} {type.name[language]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'ru' ? 'Приоритет' : language === 'en' ? 'Priority' : 'Маанилүүлүк'}
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500"
            >
              {priorities.map(p => (
                <option key={p.id} value={p.id}>{p.name[language]}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Даты */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'ru' ? 'Дата начала' : language === 'en' ? 'Start Date' : 'Башталуу датасы'}
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'ru' ? 'Дата окончания' : language === 'en' ? 'End Date' : 'Бүтүү датасы'}
            </label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        {/* Поле */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {language === 'ru' ? 'Поле' : language === 'en' ? 'Field' : 'Талаа'}
          </label>
          <select
            name="fieldId"
            value={formData.fieldId}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500"
          >
            <option value="">
              {language === 'ru' ? 'Без поля' : language === 'en' ? 'No field' : 'Талаа жок'}
            </option>
            {fields.map(field => (
              <option key={field._id} value={field._id}>{field.name}</option>
            ))}
          </select>
        </div>

        {/* Описание */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {language === 'ru' ? 'Описание' : language === 'en' ? 'Description' : 'Сүрөттөмө'}
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500"
            placeholder={language === 'ru' ? 'Подробное описание задачи...' : 
                        language === 'en' ? 'Detailed description...' : 
                        'Толук сүрөттөмө...'}
          />
        </div>

        {/* Дополнительные поля */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'ru' ? 'Стоимость' : language === 'en' ? 'Cost' : 'Баасы'}
            </label>
            <input
              type="number"
              name="estimatedCost"
              value={formData.estimatedCost}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'ru' ? 'Исполнитель' : language === 'en' ? 'Assigned to' : 'Аткаруучу'}
            </label>
            <input
              type="text"
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder={language === 'ru' ? 'Имя сотрудника' : 
                          language === 'en' ? 'Employee name' : 
                          'Кызматкердин аты'}
            />
          </div>
        </div>

        {/* Заметки */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {language === 'ru' ? 'Заметки' : language === 'en' ? 'Notes' : 'Эскертүүлөр'}
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="3"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500"
            placeholder={language === 'ru' ? 'Дополнительные заметки...' : 
                        language === 'en' ? 'Additional notes...' : 
                        'Кошумча эскертүүлөр...'}
          />
        </div>

        {/* Кнопки */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={() => navigate('/tasks')}
            className="px-6 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            {language === 'ru' ? 'Отмена' : language === 'en' ? 'Cancel' : 'Жокко чыгаруу'}
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center"
          >
            <Save size={18} className="mr-2" />
            {loading 
              ? (language === 'ru' ? 'Сохранение...' : language === 'en' ? 'Saving...' : 'Сакталууда...')
              : (language === 'ru' ? 'Сохранить' : language === 'en' ? 'Save' : 'Сактоо')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;