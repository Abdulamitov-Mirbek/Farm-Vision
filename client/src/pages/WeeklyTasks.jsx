// client/src/pages/WeeklyTasks.jsx
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext'; // ✅ Добавляем тему
import weeklyTaskAPI from '../services/api/weeklyTaskAPI';
import { 
  Calendar, Plus, CheckCircle, Circle, 
  Trash2, RefreshCw, Clock,
  Filter, X
} from 'lucide-react';

import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';

const WeeklyTasks = () => {
  const { language } = useLanguage();
  const { theme } = useTheme(); // ✅ Получаем тему
  const [tasks, setTasks] = useState({});
  const [allTasks, setAllTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0 });
  const [filter, setFilter] = useState('all');

  // Классы для темы
  const themeClasses = {
    page: theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50',
    card: theme === 'dark' 
      ? 'bg-gray-800 border-gray-700' 
      : 'bg-white border-gray-200',
    text: {
      primary: theme === 'dark' ? 'text-white' : 'text-gray-900',
      secondary: theme === 'dark' ? 'text-gray-400' : 'text-gray-600',
      muted: theme === 'dark' ? 'text-gray-500' : 'text-gray-400',
    },
    border: theme === 'dark' ? 'border-gray-700' : 'border-gray-200',
    input: theme === 'dark'
      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
      : 'bg-white border-gray-300 text-gray-900',
    select: theme === 'dark'
      ? 'bg-gray-700 border-gray-600 text-white'
      : 'bg-white border-gray-300 text-gray-900',
    textarea: theme === 'dark'
      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
      : 'bg-white border-gray-300 text-gray-900',
    button: {
      primary: 'bg-green-600 hover:bg-green-700 text-white',
      secondary: theme === 'dark'
        ? 'bg-gray-700 hover:bg-gray-600 text-gray-300 border-gray-600'
        : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300',
      outline: theme === 'dark'
        ? 'border-gray-600 hover:bg-gray-700 text-gray-300'
        : 'border-gray-300 hover:bg-gray-100 text-gray-700',
      danger: 'bg-red-600 hover:bg-red-700 text-white',
    },
    statCard: {
      total: theme === 'dark'
        ? 'bg-blue-900/30 border-blue-800'
        : 'bg-blue-50 border-blue-100',
      completed: theme === 'dark'
        ? 'bg-green-900/30 border-green-800'
        : 'bg-green-50 border-green-100',
      pending: theme === 'dark'
        ? 'bg-yellow-900/30 border-yellow-800'
        : 'bg-yellow-50 border-yellow-100',
      progress: theme === 'dark'
        ? 'bg-purple-900/30 border-purple-800'
        : 'bg-purple-50 border-purple-100',
    },
    statText: {
      total: {
        label: theme === 'dark' ? 'text-blue-400' : 'text-blue-600',
        value: theme === 'dark' ? 'text-blue-300' : 'text-blue-800',
      },
      completed: {
        label: theme === 'dark' ? 'text-green-400' : 'text-green-600',
        value: theme === 'dark' ? 'text-green-300' : 'text-green-800',
      },
      pending: {
        label: theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600',
        value: theme === 'dark' ? 'text-yellow-300' : 'text-yellow-800',
      },
      progress: {
        label: theme === 'dark' ? 'text-purple-400' : 'text-purple-600',
        value: theme === 'dark' ? 'text-purple-300' : 'text-purple-800',
      },
    },
    taskCard: {
      completed: theme === 'dark'
        ? 'bg-green-900/20 border-green-800'
        : 'bg-green-50 border-green-200',
      pending: theme === 'dark'
        ? 'bg-gray-750 border-gray-700'
        : 'bg-white border-gray-200',
    },
    taskText: {
      completed: theme === 'dark'
        ? 'line-through text-gray-500'
        : 'line-through text-gray-500',
      pending: theme === 'dark' ? 'text-white' : 'text-gray-900',
    },
    priority: {
      low: {
        bg: theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100',
        text: theme === 'dark' ? 'text-gray-300' : 'text-gray-600',
      },
      medium: {
        bg: theme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-100',
        text: theme === 'dark' ? 'text-blue-400' : 'text-blue-600',
      },
      high: {
        bg: theme === 'dark' ? 'bg-orange-900/30' : 'bg-orange-100',
        text: theme === 'dark' ? 'text-orange-400' : 'text-orange-600',
      },
      critical: {
        bg: theme === 'dark' ? 'bg-red-900/30' : 'bg-red-100',
        text: theme === 'dark' ? 'text-red-400' : 'text-red-600',
      },
    },
    icon: {
      check: theme === 'dark' ? 'text-green-400' : 'text-green-600',
      circle: theme === 'dark' ? 'text-gray-500' : 'text-gray-400',
      delete: theme === 'dark' ? 'text-red-400 hover:text-red-300' : 'text-red-500 hover:text-red-700',
      clock: theme === 'dark' ? 'text-gray-500' : 'text-gray-500',
    },
    addTaskButton: theme === 'dark'
      ? 'border-green-800 text-green-400 hover:bg-gray-700'
      : 'border-green-300 text-green-600 hover:bg-green-50',
    emptyState: {
      text: theme === 'dark' ? 'text-gray-500' : 'text-gray-400',
    },
    divider: theme === 'dark' ? 'border-gray-700' : 'border-gray-100',
    hover: {
      card: theme === 'dark'
        ? 'hover:bg-gray-750 hover:border-gray-600'
        : 'hover:bg-gray-50 hover:border-gray-300',
    },
    shadow: {
      card: theme === 'dark' 
        ? 'shadow-lg shadow-black/20' 
        : 'shadow-lg shadow-gray-200',
    },
    scrollbar: theme === 'dark'
      ? 'scrollbar-dark'
      : 'scrollbar-light',
    modal: {
      overlay: 'bg-black/50',
      content: theme === 'dark'
        ? 'bg-gray-800 border-gray-700'
        : 'bg-white border-gray-200',
    },
    label: theme === 'dark' ? 'text-gray-300' : 'text-gray-700',
    checkbox: theme === 'dark'
      ? 'bg-gray-700 border-gray-600'
      : 'bg-white border-gray-300',
  };

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dayOfWeek: 1,
    priority: 'medium',
    category: 'other',
    estimatedHours: 1,
    recurring: false,
    tags: []
  });

  // Обновляем отображение при смене языка
  useEffect(() => {
    if (allTasks.length > 0) {
      // Перегруппировываем задачи для нового языка
      const groupedByIndex = {};
      for (let i = 0; i < 7; i++) {
        groupedByIndex[i] = {
          dayIndex: i,
          tasks: allTasks.filter(t => t.dayOfWeek === i)
        };
      }
      
      const tasksByDayName = {};
      daysOfWeek[language].forEach((dayName, index) => {
        tasksByDayName[dayName] = groupedByIndex[index] || {
          dayIndex: index,
          tasks: []
        };
      });
      
      setTasks(tasksByDayName);
    }
  }, [language, allTasks]);

  const daysOfWeek = {
    ru: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
    en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    kg: ['Жекшемби', 'Дүйшөмбү', 'Шейшемби', 'Шаршемби', 'Бейшемби', 'Жума', 'Ишемби']
  };

  const priorities = {
    low: { 
      ru: 'Низкий', 
      en: 'Low', 
      kg: 'Төмөн'
    },
    medium: { 
      ru: 'Средний', 
      en: 'Medium', 
      kg: 'Орто'
    },
    high: { 
      ru: 'Высокий', 
      en: 'High', 
      kg: 'Жогорку'
    },
    critical: { 
      ru: 'Критичный', 
      en: 'Critical', 
      kg: 'Критикалык'
    }
  };

  useEffect(() => {
    loadTasks();
  }, [filter]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const filters = {};
      if (filter !== 'all') filters.status = filter;
      
      console.log('🔍 Отправка запроса с фильтрами:', filters);
      const response = await weeklyTaskAPI.getAll(filters);
      
      console.log('🔥 ПОЛНЫЙ ОТВЕТ:', response);
      
      // Проверяем, есть ли задачи в ответе
      let tasksArray = [];
      
      if (response.allTasks && Array.isArray(response.allTasks)) {
        tasksArray = response.allTasks;
        console.log('📋 Задачи из allTasks:', tasksArray);
      } else if (response.tasks && Array.isArray(response.tasks)) {
        tasksArray = response.tasks;
        console.log('📋 Задачи из tasks:', tasksArray);
      } else if (Array.isArray(response)) {
        tasksArray = response;
        console.log('📋 Задачи из массива:', tasksArray);
      } else if (response.data && Array.isArray(response.data)) {
        tasksArray = response.data;
        console.log('📋 Задачи из data:', tasksArray);
      }
      
      console.log('📊 Всего задач:', tasksArray.length);
      console.log('📊 Детали задач:', tasksArray);
      
      // Сохраняем все задачи
      setAllTasks(tasksArray);
      
      // Группируем задачи по дням недели
      const grouped = {};
      daysOfWeek[language].forEach((day, index) => {
        const dayTasks = tasksArray.filter(t => t.dayOfWeek === index);
        console.log(`📅 ${day} (${index}): ${dayTasks.length} задач`, dayTasks);
        grouped[day] = {
          dayIndex: index,
          tasks: dayTasks
        };
      });
      
      setTasks(grouped);
      
      // Считаем статистику
      const total = tasksArray.length;
      const completed = tasksArray.filter(t => t.status === 'completed').length;
      setStats({ 
        total, 
        completed, 
        pending: total - completed 
      });
      
      console.log('✅ Итоговое состояние:', { grouped, stats: { total, completed } });
      
    } catch (error) {
      console.error('❌ Ошибка загрузки задач:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async () => {
    if (!newTask.title) {
      alert('Введите название задачи');
      return;
    }

    try {
      console.log('📝 Создание задачи:', newTask);
      const response = await weeklyTaskAPI.create(newTask);
      console.log('✅ Задача создана, ответ:', response);
      
      setShowAddModal(false);
      resetForm();
      await loadTasks(); // Перезагружаем задачи
      
    } catch (error) {
      console.error('❌ Ошибка создания задачи:', error);
      alert('Ошибка при создании задачи');
    }
  };

  const handleCompleteTask = async (id) => {
    try {
      await weeklyTaskAPI.complete(id);
      await loadTasks();
    } catch (error) {
      console.error('Ошибка завершения задачи:', error);
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm('Удалить задачу?')) return;
    try {
      await weeklyTaskAPI.delete(id);
      await loadTasks();
    } catch (error) {
      console.error('Ошибка удаления задачи:', error);
    }
  };

  const resetForm = () => {
    setNewTask({
      title: '',
      description: '',
      dayOfWeek: 1,
      priority: 'medium',
      category: 'other',
      estimatedHours: 1,
      recurring: false,
      tags: []
    });
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center h-64 ${themeClasses.page}`}>
        <RefreshCw className={`animate-spin ${
          theme === 'dark' ? 'text-green-400' : 'text-green-600'
        }`} size={40} />
      </div>
    );
  }

  return (
    <div className={`p-6 transition-colors duration-300 ${themeClasses.page}`}>
      <div className="space-y-6">
        {/* Заголовок */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className={`text-2xl font-bold ${themeClasses.text.primary}`}>
              {language === 'ru' ? 'Еженедельные задачи' :
               language === 'en' ? 'Weekly Tasks' :
               'Апталык тапшырмалар'}
            </h1>
            <p className={`mt-1 ${themeClasses.text.secondary}`}>
              {language === 'ru' ? 'Планирование задач на неделю' :
               language === 'en' ? 'Weekly task planning' :
               'Апталык тапшырмаларды пландоо'}
            </p>
          </div>

          <div className="flex items-center space-x-3 mt-4 md:mt-0">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className={`px-3 py-2 rounded-lg border transition-colors ${themeClasses.select}`}
            >
              <option value="all">
                {language === 'ru' ? 'Все задачи' : 
                 language === 'en' ? 'All tasks' : 
                 'Бардык тапшырмалар'}
              </option>
              <option value="pending">
                {language === 'ru' ? 'Активные' : 
                 language === 'en' ? 'Pending' : 
                 'Активдүү'}
              </option>
              <option value="completed">
                {language === 'ru' ? 'Выполненные' : 
                 language === 'en' ? 'Completed' : 
                 'Аткарылган'}
              </option>
            </select>

            <button
              className={`px-4 py-2 rounded-lg flex items-center ${themeClasses.button.primary}`}
              onClick={() => setShowAddModal(true)}
            >
              <Plus size={18} className="mr-2" />
              {language === 'ru' ? 'Новая задача' :
               language === 'en' ? 'New Task' :
               'Жаңы тапшырма'}
            </button>
          </div>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className={`p-4 rounded-xl border ${themeClasses.statCard.total}`}>
            <p className={`text-sm ${themeClasses.statText.total.label}`}>
              {language === 'ru' ? 'Всего задач' : 
               language === 'en' ? 'Total tasks' : 
               'Бардык тапшырмалар'}
            </p>
            <p className={`text-2xl font-bold ${themeClasses.statText.total.value}`}>
              {stats.total}
            </p>
          </div>
          <div className={`p-4 rounded-xl border ${themeClasses.statCard.completed}`}>
            <p className={`text-sm ${themeClasses.statText.completed.label}`}>
              {language === 'ru' ? 'Выполнено' : 
               language === 'en' ? 'Completed' : 
               'Аткарылган'}
            </p>
            <p className={`text-2xl font-bold ${themeClasses.statText.completed.value}`}>
              {stats.completed}
            </p>
          </div>
          <div className={`p-4 rounded-xl border ${themeClasses.statCard.pending}`}>
            <p className={`text-sm ${themeClasses.statText.pending.label}`}>
              {language === 'ru' ? 'В процессе' : 
               language === 'en' ? 'In progress' : 
               'Процессте'}
            </p>
            <p className={`text-2xl font-bold ${themeClasses.statText.pending.value}`}>
              {stats.pending}
            </p>
          </div>
          <div className={`p-4 rounded-xl border ${themeClasses.statCard.progress}`}>
            <p className={`text-sm ${themeClasses.statText.progress.label}`}>
              {language === 'ru' ? 'Прогресс' : 
               language === 'en' ? 'Progress' : 
               'Прогресс'}
            </p>
            <p className={`text-2xl font-bold ${themeClasses.statText.progress.value}`}>
              {stats.total ? Math.round((stats.completed / stats.total) * 100) : 0}%
            </p>
          </div>
        </div>

        {/* Задачи по дням */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {daysOfWeek[language].map((day, index) => {
            const dayTasks = tasks[day]?.tasks || [];
            const completedCount = dayTasks.filter(t => t.status === 'completed').length;
            
            return (
              <div 
                key={index} 
                className={`p-4 rounded-xl border transition-all ${themeClasses.card} ${themeClasses.shadow.card} ${themeClasses.hover.card}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className={`font-semibold ${themeClasses.text.primary}`}>{day}</h3>
                  <span className={`text-sm ${themeClasses.text.muted}`}>
                    {completedCount}/{dayTasks.length}
                  </span>
                </div>

                <div className={`space-y-2 max-h-96 overflow-y-auto ${themeClasses.scrollbar}`}>
                  {dayTasks.length === 0 ? (
                    <p className={`text-sm text-center py-4 ${themeClasses.emptyState.text}`}>
                      {language === 'ru' ? 'Нет задач' : 
                       language === 'en' ? 'No tasks' : 
                       'Тапшырма жок'}
                    </p>
                  ) : (
                    dayTasks.map(task => (
                      <div
                        key={task._id}
                        className={`p-3 rounded-lg border ${
                          task.status === 'completed' 
                            ? themeClasses.taskCard.completed 
                            : themeClasses.taskCard.pending
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleCompleteTask(task._id)}
                                className={`transition-colors ${
                                  task.status === 'completed' 
                                    ? themeClasses.icon.check 
                                    : themeClasses.icon.circle
                                }`}
                              >
                                {task.status === 'completed' ? (
                                  <CheckCircle size={18} />
                                ) : (
                                  <Circle size={18} />
                                )}
                              </button>
                              <span className={`text-sm font-medium ${
                                task.status === 'completed' 
                                  ? themeClasses.taskText.completed 
                                  : themeClasses.taskText.pending
                              }`}>
                                {task.title}
                              </span>
                            </div>
                            
                            {task.description && (
                              <p className={`text-xs mt-1 ml-7 ${themeClasses.text.secondary}`}>
                                {task.description}
                              </p>
                            )}
                            
                            <div className="flex items-center space-x-2 mt-2 ml-7">
                              <span className={`px-2 py-0.5 rounded-full text-xs ${
                                themeClasses.priority[task.priority]?.bg
                              } ${
                                themeClasses.priority[task.priority]?.text
                              }`}>
                                {priorities[task.priority]?.[language] || task.priority}
                              </span>
                              {task.estimatedHours > 0 && (
                                <span className={`text-xs flex items-center ${themeClasses.icon.clock}`}>
                                  <Clock size={12} className="mr-1" />
                                  {task.estimatedHours}ч
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <button
                            onClick={() => handleDeleteTask(task._id)}
                            className={`transition-colors ${themeClasses.icon.delete}`}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <button
                  onClick={() => {
                    setNewTask({ ...newTask, dayOfWeek: index });
                    setShowAddModal(true);
                  }}
                  className={`mt-3 w-full py-2 text-sm border border-dashed rounded-lg transition-colors ${themeClasses.addTaskButton}`}
                >
                  + {language === 'ru' ? 'Добавить задачу' : 
                       language === 'en' ? 'Add task' : 
                       'Тапшырма кошуу'}
                </button>
              </div>
            );
          })}
        </div>

        {/* Модальное окно */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/50" onClick={() => setShowAddModal(false)}></div>
            <div className={`relative w-full max-w-2xl rounded-xl border ${themeClasses.modal.content} p-6`}>
              <h3 className={`text-xl font-semibold mb-4 ${themeClasses.text.primary}`}>
                {language === 'ru' ? 'Новая задача' : 
                 language === 'en' ? 'New Task' : 
                 'Жаңы тапшырма'}
              </h3>
              
              <TaskForm 
                newTask={newTask}
                setNewTask={setNewTask}
                language={language}
                daysOfWeek={daysOfWeek}
                priorities={priorities}
                themeClasses={themeClasses}
              />
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  className={`px-4 py-2 rounded-lg border transition-colors ${themeClasses.button.secondary}`}
                  onClick={() => setShowAddModal(false)}
                >
                  {language === 'ru' ? 'Отмена' : 
                   language === 'en' ? 'Cancel' : 
                   'Жокко чыгаруу'}
                </button>
                <button
                  className={`px-4 py-2 rounded-lg flex items-center ${themeClasses.button.primary}`}
                  onClick={handleCreateTask}
                >
                  <Plus size={18} className="mr-2" />
                  {language === 'ru' ? 'Создать' : 
                   language === 'en' ? 'Create' : 
                   'Түзүү'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Компонент формы для задачи
const TaskForm = ({ newTask, setNewTask, language, daysOfWeek, priorities, themeClasses }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className={`block text-sm font-medium mb-2 ${themeClasses.label}`}>
          {language === 'ru' ? 'Название *' : 
           language === 'en' ? 'Title *' : 
           'Аталышы *'}
        </label>
        <input
          className={`w-full px-4 py-2 rounded-lg border transition-colors ${themeClasses.input}`}
          value={newTask.title}
          onChange={(e) => setNewTask({...newTask, title: e.target.value})}
          placeholder={language === 'ru' ? 'Введите название задачи' : 
                       language === 'en' ? 'Enter task title' : 
                       'Тапшырманын аталышын жазыңыз'}
        />
      </div>

      <div>
        <label className={`block text-sm font-medium mb-2 ${themeClasses.label}`}>
          {language === 'ru' ? 'Описание' : 
           language === 'en' ? 'Description' : 
           'Сүрөттөмө'}
        </label>
        <textarea
          value={newTask.description}
          onChange={(e) => setNewTask({...newTask, description: e.target.value})}
          rows="3"
          className={`w-full px-4 py-2 rounded-lg border transition-colors ${themeClasses.textarea}`}
          placeholder={language === 'ru' ? 'Описание задачи...' : 
                       language === 'en' ? 'Task description...' : 
                       'Тапшырманын сүрөттөмөсү...'}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={`block text-sm font-medium mb-2 ${themeClasses.label}`}>
            {language === 'ru' ? 'День недели' : 
             language === 'en' ? 'Day of week' : 
             'Аптанын күнү'}
          </label>
          <select
            value={newTask.dayOfWeek}
            onChange={(e) => setNewTask({...newTask, dayOfWeek: parseInt(e.target.value)})}
            className={`w-full px-4 py-2 rounded-lg border transition-colors ${themeClasses.select}`}
          >
            {daysOfWeek[language].map((day, index) => (
              <option key={index} value={index}>{day}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${themeClasses.label}`}>
            {language === 'ru' ? 'Приоритет' : 
             language === 'en' ? 'Priority' : 
             'Приоритет'}
          </label>
          <select
            value={newTask.priority}
            onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
            className={`w-full px-4 py-2 rounded-lg border transition-colors ${themeClasses.select}`}
          >
            {Object.keys(priorities).map(key => (
              <option key={key} value={key}>
                {priorities[key][language]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${themeClasses.label}`}>
            {language === 'ru' ? 'Часов' : 
             language === 'en' ? 'Hours' : 
             'Саат'}
          </label>
          <input
            type="number"
            className={`w-full px-4 py-2 rounded-lg border transition-colors ${themeClasses.input}`}
            value={newTask.estimatedHours}
            onChange={(e) => setNewTask({...newTask, estimatedHours: parseFloat(e.target.value)})}
            min="0.5"
            step="0.5"
          />
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${themeClasses.label}`}>
            {language === 'ru' ? 'Категория' : 
             language === 'en' ? 'Category' : 
             'Категория'}
          </label>
          <select
            value={newTask.category}
            onChange={(e) => setNewTask({...newTask, category: e.target.value})}
            className={`w-full px-4 py-2 rounded-lg border transition-colors ${themeClasses.select}`}
          >
            <option value="field">
              {language === 'ru' ? 'Поле' : 
               language === 'en' ? 'Field' : 
               'Талаа'}
            </option>
            <option value="animals">
              {language === 'ru' ? 'Животные' : 
               language === 'en' ? 'Animals' : 
               'Жаныбарлар'}
            </option>
            <option value="equipment">
              {language === 'ru' ? 'Техника' : 
               language === 'en' ? 'Equipment' : 
               'Техника'}
            </option>
            <option value="crops">
              {language === 'ru' ? 'Культуры' : 
               language === 'en' ? 'Crops' : 
               'Өсүмдүктөр'}
            </option>
            <option value="other">
              {language === 'ru' ? 'Другое' : 
               language === 'en' ? 'Other' : 
               'Башка'}
            </option>
          </select>
        </div>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="recurring"
          checked={newTask.recurring}
          onChange={(e) => setNewTask({...newTask, recurring: e.target.checked})}
          className={`h-4 w-4 rounded transition-colors ${themeClasses.checkbox}`}
        />
        <label htmlFor="recurring" className={`ml-2 text-sm ${themeClasses.label}`}>
          {language === 'ru' ? 'Повторяющаяся задача (каждую неделю)' : 
           language === 'en' ? 'Recurring task (every week)' : 
           'Кайталануучу тапшырма (ар апта сайын)'}
        </label>
      </div>
    </div>
  );
};

export default WeeklyTasks;