import { useState } from 'react';
import { routeAreaAPI } from '../services/api';

export const useRouteAreas = () => {
  const [areas, setAreas] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Получить районы для города
  const getAreas = async (cityId) => {
    try {
      setLoading(true);
      setError(null);
      
      const areasData = await routeAreaAPI.getAreas(cityId);
      setAreas(areasData);
      
      return areasData;
    } catch (err) {
      const errorMessage = err.message || 'Ошибка при загрузке районов';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Сброс состояния
  const reset = () => {
    setAreas(null);
    setError(null);
  };

  return {
    // Состояние
    areas,
    loading,
    error,
    
    // Методы
    getAreas,
    reset,
  };
};