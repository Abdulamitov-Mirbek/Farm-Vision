import React, { useState, useEffect } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import Input from '../common/Input';
import { diaryAPI } from '../../services/api/diaryAPI';
import { formatDateTime } from '../../utils/helpers';
import { DIARY_CATEGORIES } from '../../utils/constants';

const Diary = ({ limit = 5, showAddButton = true }) => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [newEntry, setNewEntry] = useState({
    title: '',
    description: '',
    category: 'work'
  });

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    setLoading(true);
    try {
      const response = await diaryAPI.getEntries();
      setEntries(response.data.entries);
    } catch (error) {
      console.error('Error fetching diary entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEntry = async () => {
    if (!newEntry.title.trim() || !newEntry.description.trim()) {
      alert('Пожалуйста, заполните заголовок и описание');
      return;
    }

    try {
      const response = await diaryAPI.createEntry(newEntry);
      setEntries([response.data.entry, ...entries]);
      setNewEntry({ title: '', description: '', category: 'work' });
    } catch (error) {
      console.error('Error creating diary entry:', error);
    }
  };

  const getCategoryInfo = (categoryId) => {
    return DIARY_CATEGORIES.find(cat => cat.id === categoryId) || DIARY_CATEGORIES[0];
  };

  const displayedEntries = showAll ? entries : entries.slice(0, limit);

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Рабочий дневник</h2>
          <p className="text-sm text-gray-600 mt-1">
            Последние записи о работах на полях
          </p>
        </div>
        
        {showAddButton && (
          <Button variant="primary" size="small">
            + Новая запись
          </Button>
        )}
      </div>

      {/* Форма добавления новой записи */}
      {showAddButton && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Добавить запись</h3>
          <div className="space-y-3">
            <Input
              placeholder="Заголовок записи"
              value={newEntry.title}
              onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
            />
            
            <textarea
              placeholder="Описание работ, наблюдений..."
              value={newEntry.description}
              onChange={(e) => setNewEntry({ ...newEntry, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all duration-200"
              rows="3"
            />
            
            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                {DIARY_CATEGORIES.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setNewEntry({ ...newEntry, category: category.id })}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      newEntry.category === category.id
                        ? `${category.color} text-white`
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category.icon} {category.name}
                  </button>
                ))}
              </div>
              
              <Button onClick={handleAddEntry}>
                Сохранить
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Список записей */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(limit)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-3"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      ) : entries.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-3">📝</div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">Записей пока нет</h3>
          <p className="text-gray-600">Добавьте первую запись о работах на полях</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {displayedEntries.map((entry) => {
              const category = getCategoryInfo(entry.category);
              
              return (
                <div
                  key={entry.id}
                  className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center">
                      <div className={`${category.color} text-white w-8 h-8 rounded-lg flex items-center justify-center mr-3`}>
                        <span className="text-sm">{category.icon}</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{entry.title}</h4>
                        <p className="text-sm text-gray-500">
                          {entry.fieldName && (
                            <>
                              Поле: <span className="font-medium">{entry.fieldName}</span> • 
                            </>
                          )}
                          {formatDateTime(entry.date)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {entry.cost > 0 && (
                        <span className="text-sm font-medium text-gray-900">
                          {entry.cost.toLocaleString()} ₽
                        </span>
                      )}
                      <button className="text-gray-400 hover:text-gray-600">
                        ⋮
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-3">{entry.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      {entry.tags?.map((tag, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      {entry.hours > 0 && (
                        <span>⏱️ {entry.hours} ч</span>
                      )}
                      {entry.workers > 0 && (
                        <span>👨‍🌾 {entry.workers} чел</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Кнопка показать все/скрыть */}
          {entries.length > limit && (
            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
              <Button
                variant="outline"
                onClick={() => setShowAll(!showAll)}
              >
                {showAll ? 'Скрыть' : `Показать все записи (${entries.length})`}
              </Button>
            </div>
          )}
        </>
      )}

      {/* Статистика */}
      {entries.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Статистика за месяц</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-600 mb-1">Всего записей</p>
              <p className="text-2xl font-bold text-gray-900">{entries.length}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-600 mb-1">Отработано часов</p>
              <p className="text-2xl font-bold text-gray-900">
                {entries.reduce((sum, entry) => sum + entry.hours, 0)}
              </p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm text-yellow-600 mb-1">Общие расходы</p>
              <p className="text-2xl font-bold text-gray-900">
                {entries.reduce((sum, entry) => sum + entry.cost, 0).toLocaleString()} ₽
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-purple-600 mb-1">Среднее в день</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(entries.length / 30)} зап.
              </p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default Diary;