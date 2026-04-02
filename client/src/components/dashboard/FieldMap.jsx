import React, { useState, useEffect } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';

// Моковые данные для демо
const mockFields = [
  {
    id: 1,
    name: 'Северное поле',
    crop: 'Пшеница',
    area: 45.2,
    status: 'growing',
    yield: 35.5,
    coordinates: { lat: 55.7558, lng: 37.6173 },
    soilType: 'Чернозем',
    lastWork: '2024-03-15',
    nextWork: '2024-04-20'
  },
  {
    id: 2,
    name: 'Южное поле',
    crop: 'Кукуруза',
    area: 32.8,
    status: 'sowing',
    yield: 62.3,
    coordinates: { lat: 55.7458, lng: 37.6273 },
    soilType: 'Супесь',
    lastWork: '2024-03-10',
    nextWork: '2024-04-15'
  },
  {
    id: 3,
    name: 'Западное поле',
    crop: 'Подсолнечник',
    area: 28.5,
    status: 'harvesting',
    yield: 18.7,
    coordinates: { lat: 55.7658, lng: 37.6073 },
    soilType: 'Суглинок',
    lastWork: '2024-03-05',
    nextWork: '2024-04-10'
  },
  {
    id: 4,
    name: 'Восточное поле',
    crop: 'Соя',
    area: 38.9,
    status: 'preparation',
    yield: 24.2,
    coordinates: { lat: 55.7358, lng: 37.6373 },
    soilType: 'Песчаная',
    lastWork: '2024-02-28',
    nextWork: '2024-04-05'
  }
];

const FieldMap = ({ interactive = true }) => {
  const [fields, setFields] = useState(mockFields);
  const [selectedField, setSelectedField] = useState(null);
  const [viewMode, setViewMode] = useState('map'); // 'map' или 'list'

  const getStatusColor = (status) => {
    switch (status) {
      case 'preparation': return 'bg-gray-400';
      case 'sowing': return 'bg-blue-400';
      case 'growing': return 'bg-green-400';
      case 'harvesting': return 'bg-yellow-400';
      case 'fallow': return 'bg-brown-400';
      default: return 'bg-gray-300';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'preparation': return 'Подготовка';
      case 'sowing': return 'Посев';
      case 'growing': return 'Рост';
      case 'harvesting': return 'Сбор урожая';
      case 'fallow': return 'Отдых';
      default: return 'Неизвестно';
    }
  };

  const getCropIcon = (crop) => {
    const icons = {
      'Пшеница': '🌾',
      'Кукуруза': '🌽',
      'Соя': '🥜',
      'Подсолнечник': '🌻',
      'Картофель': '🥔',
      'Овощи': '🥦',
      'Фрукты': '🍎'
    };
    return icons[crop] || '🌱';
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Карта полей</h2>
          <p className="text-sm text-gray-600 mt-1">
            {fields.length} активных полей, {fields.reduce((sum, field) => sum + field.area, 0).toFixed(1)} га
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('map')}
              className={`px-3 py-1.5 rounded text-sm font-medium ${
                viewMode === 'map'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Карта
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded text-sm font-medium ${
                viewMode === 'list'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Список
            </button>
          </div>
          
          <Button size="small" variant="primary">
            + Добавить поле
          </Button>
        </div>
      </div>

      {viewMode === 'map' ? (
        <div className="relative">
          {/* Упрощенная карта для демо */}
          <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl h-96 relative overflow-hidden border border-gray-200">
            {/* Сетка координат */}
            <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
            
            {/* Поля на карте */}
            {fields.map((field) => (
              <button
                key={field.id}
                onClick={() => interactive && setSelectedField(field)}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ${
                  selectedField?.id === field.id
                    ? 'z-20 scale-110'
                    : 'hover:scale-105 hover:z-10'
                }`}
                style={{
                  left: `${30 + Math.random() * 60}%`,
                  top: `${30 + Math.random() * 40}%`
                }}
              >
                <div className="relative">
                  <div className={`w-16 h-16 rounded-full border-4 ${
                    selectedField?.id === field.id ? 'border-white shadow-xl' : 'border-gray-100'
                  } ${getStatusColor(field.status)} flex items-center justify-center`}>
                    <span className="text-2xl">{getCropIcon(field.crop)}</span>
                  </div>
                  
                  {/* Метка */}
                  <div className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 rounded-lg ${
                    selectedField?.id === field.id
                      ? 'bg-gray-900 text-white shadow-lg'
                      : 'bg-white text-gray-900 shadow-md'
                  } whitespace-nowrap`}>
                    <p className="font-medium text-sm">{field.name}</p>
                    <p className="text-xs opacity-75">{field.area} га</p>
                  </div>
                </div>
              </button>
            ))}
            
            {/* Легенда */}
            <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Легенда</h4>
              <div className="space-y-2">
                {[
                  { status: 'preparation', label: 'Подготовка' },
                  { status: 'sowing', label: 'Посев' },
                  { status: 'growing', label: 'Рост' },
                  { status: 'harvesting', label: 'Сбор урожая' },
                  { status: 'fallow', label: 'Отдых' },
                ].map((item) => (
                  <div key={item.status} className="flex items-center">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(item.status)} mr-2`}></div>
                    <span className="text-sm text-gray-700">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Информация о выбранном поле */}
            {selectedField && (
              <div className="absolute top-4 right-4 bg-white rounded-xl shadow-xl p-6 max-w-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{selectedField.name}</h3>
                  <button
                    onClick={() => setSelectedField(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Культура</span>
                    <span className="font-medium text-gray-900">{selectedField.crop}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Площадь</span>
                    <span className="font-medium text-gray-900">{selectedField.area} га</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Статус</span>
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(selectedField.status)} mr-2`}></div>
                      <span className="font-medium text-gray-900">{getStatusText(selectedField.status)}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Прогноз урожая</span>
                    <span className="font-medium text-gray-900">{selectedField.yield} ц/га</span>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex space-x-2">
                      <Button size="small" variant="outline" fullWidth>
                        Подробнее
                      </Button>
                      <Button size="small" variant="primary" fullWidth>
                        Добавить запись
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        // Режим списка
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Поле</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Культура</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Площадь</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Статус</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Урожайность</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Действия</th>
              </tr>
            </thead>
            <tbody>
              {fields.map((field) => (
                <tr key={field.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full ${getStatusColor(field.status)} flex items-center justify-center mr-3`}>
                        <span className="text-lg">{getCropIcon(field.crop)}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{field.name}</p>
                        <p className="text-sm text-gray-500">{field.soilType}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-medium text-gray-900">{field.crop}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-gray-900">{field.area} га</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(field.status)} mr-2`}></div>
                      <span className="text-sm text-gray-700">{getStatusText(field.status)}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-medium text-gray-900">{field.yield} ц/га</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                        Подробнее
                      </button>
                      <button className="text-gray-400 hover:text-gray-600">
                        ⋮
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Сводная информация */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-sm text-gray-600">Общая площадь</p>
            <p className="text-2xl font-bold text-gray-900">
              {fields.reduce((sum, field) => sum + field.area, 0).toFixed(1)} га
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Средняя урожайность</p>
            <p className="text-2xl font-bold text-gray-900">
              {(fields.reduce((sum, field) => sum + field.yield, 0) / fields.length).toFixed(1)} ц/га
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Поля в работе</p>
            <p className="text-2xl font-bold text-gray-900">
              {fields.filter(f => f.status !== 'fallow').length}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Прогноз урожая</p>
            <p className="text-2xl font-bold text-gray-900">
              {fields.reduce((sum, field) => sum + (field.area * field.yield), 0).toFixed(0)} ц
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

// Добавляем стили для сетки
const style = document.createElement('style');
style.textContent = `
  .bg-grid-pattern {
    background-image: 
      linear-gradient(to right, rgba(0,0,0,0.1) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(0,0,0,0.1) 1px, transparent 1px);
    background-size: 20px 20px;
  }
`;
document.head.appendChild(style);

export default FieldMap;