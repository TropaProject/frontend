import { useState } from 'react';
import { routeGenerateAPI } from '../services/api';

export const useRouteGenerate = () => {
  const [generatedRoute, setGeneratedRoute] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Генерирует маршрут
   * @param {Object} routeData - данные для генерации
   */
  const generateRoute = async (routeData) => {
    try {
      setLoading(true);
      setError(null);
      
      const route = await routeGenerateAPI.generateRoute(routeData);
      setGeneratedRoute(route);
      
      return route;
    } catch (err) {
      const errorMessage = err.message || 'Ошибка при генерации маршрута';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Сброс состояния
  const resetRoute = () => {
    setGeneratedRoute(null);
    setError(null);
  };

  return {
    // Состояние
    generatedRoute,
    loading,
    error,
    
    // Методы
    generateRoute,
    resetRoute,
  };
};