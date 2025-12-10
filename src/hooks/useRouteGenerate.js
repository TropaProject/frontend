import { useState } from 'react';
import { routeGenerateAPI } from '../services/api';

// Константы для бюджета
export const BUDGET_CATEGORIES = {
  FREE: 'бесплатно (0-500р)',
  BUDGET: 'бюджетно (500-1500р)',
  MIDDLE: 'средне (1500-3000р)',
  EXPENSIVE: 'дорого (3000-10000р)',
};

// Константы для радиуса
export const RADIUS_OPTIONS = [
  { value: 0.5, label: '500 метров' },
  { value: 1.0, label: '1 километр' },
  { value: 3.0, label: '3 километра' },
];

// Допустимые значения радиуса
const VALID_RADII = [0.5, 1.0, 3.0];

export const useRouteGenerate = () => {
  const [generatedRoute, setGeneratedRoute] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Генерирует маршрут
   * @param {Object} routeData - данные для генерации:
   *   {
   *     city_id: number,
   *     radius_km: number,           // 0.5, 1.0, 3.0
   *     budget: string,              // "бесплатно (0-500р)", "бюджетно (500-1500р)" и т.д.
   *     preferences: Array<string>,  // предпочтения
   *     // ... другие поля
   *   }
   */
  const generateRoute = async (routeData) => {
    try {
      setLoading(true);
      setError(null);

      // Опциональная валидация radius_km
      if (routeData.radius_km && !VALID_RADII.includes(routeData.radius_km)) {
        throw new Error('Некорректное значение радиуса. Допустимые значения: 0.5, 1.0, 3.0');
      }

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

  // Вспомогательная функция для форматирования данных маршрута
  const formatRouteData = (route) => {
    if (!route) return null;
    
    return {
      ...route,
      // Форматирование для отображения в UI
      formatted_distance: route.total_meters ? `${(route.total_meters / 1000).toFixed(1)} км` : null,
      formatted_duration: route.total_duration ? `${route.total_duration} мин` : null,
      formatted_cost: route.total_cost ? `${route.total_cost} ₽` : null,
      formatted_walk_time: route.walk_time ? `${route.walk_time} мин` : null,
      formatted_visit_time: route.visit_time ? `${route.visit_time} мин` : null,
    };
  };

  return {
    // Состояние
    generatedRoute,
    formattedRoute: formatRouteData(generatedRoute),
    loading,
    error,
    
    // Методы
    generateRoute,
    resetRoute,
    
    // Вспомогательные методы
    formatRouteData,
  };
};

// Дополнительный хук для работы с бюджетом (можно вынести в отдельный файл если нужно)
export const useBudgetHelper = () => {
  const getBudgetCategory = (budgetString) => {
    const categories = {
      'бесплатно': BUDGET_CATEGORIES.FREE,
      'бюджетно': BUDGET_CATEGORIES.BUDGET,
      'средне': BUDGET_CATEGORIES.MIDDLE,
      'дорого': BUDGET_CATEGORIES.EXPENSIVE,
    };

    for (const [key, value] of Object.entries(categories)) {
      if (budgetString.includes(key)) {
        return value;
      }
    }
    
    return BUDGET_CATEGORIES.MIDDLE; // значение по умолчанию
  };

  const getBudgetRange = (budgetCategory) => {
    const ranges = {
      [BUDGET_CATEGORIES.FREE]: { min: 0, max: 500 },
      [BUDGET_CATEGORIES.BUDGET]: { min: 500, max: 1500 },
      [BUDGET_CATEGORIES.MIDDLE]: { min: 1500, max: 3000 },
      [BUDGET_CATEGORIES.EXPENSIVE]: { min: 3000, max: 10000 },
    };
    
    return ranges[budgetCategory] || { min: 0, max: 3000 };
  };

  return {
    getBudgetCategory,
    getBudgetRange,
    BUDGET_CATEGORIES,
    RADIUS_OPTIONS,
  };
};