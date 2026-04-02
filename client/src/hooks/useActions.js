// src/hooks/useActions.js
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';

export const useActions = () => {
  const navigate = useNavigate();

  const handleAdd = useCallback((type = 'task') => {
    console.log('Adding new:', type);
    switch(type) {
      case 'task':
        navigate('/tasks/new');
        break;
      case 'field':
        navigate('/fields/new');
        break;
      case 'diary':
        navigate('/diary/new');
        break;
      default:
        navigate('/tasks/new');
    }
  }, [navigate]);

  const handleExport = useCallback((type = 'report') => {
    console.log('Exporting:', type);
    // Здесь логика экспорта
    alert('Экспорт начат...');
    // Имитация экспорта
    setTimeout(() => {
      alert('Экспорт завершен!');
    }, 1500);
  }, []);

  const handleSearch = useCallback((query) => {
    console.log('Searching for:', query);
    if (query && query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  }, [navigate]);

  const handleFilter = useCallback(() => {
    console.log('Opening filters');
    // Здесь логика открытия фильтров
  }, []);

  return {
    handleAdd,
    handleExport,
    handleSearch,
    handleFilter
  };
};