import { useState } from 'react';
import { routeCancelAPI, routeShowAPI, routeEditStatusAPI, routeFeedbackAPI } from '../services/api';

export const useRouteManagement = () => {
  const [currentRoute, setCurrentRoute] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Получить маршрут по ID
  const getRoute = async (routeId) => {
    try {
      setLoading(true);
      setError(null);
      
      const route = await routeShowAPI.getRoute(routeId);
      setCurrentRoute(route);
      
      return route;
    } catch (err) {
      const errorMessage = err.message || 'Ошибка при загрузке маршрута';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Отменить маршрут
  const cancelRoute = async (routeId, reason = '') => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await routeCancelAPI.cancelRoute(routeId, reason);
      
      // Обновляем текущий маршрут если он загружен
      if (currentRoute && currentRoute.route_id === routeId) {
        setCurrentRoute(prev => ({
          ...prev,
          status: result.status,
          cancel_reason: result.cancel_reason,
          updated_at: result.updated_at
        }));
      }
      
      return result;
    } catch (err) {
      const errorMessage = err.message || 'Ошибка при отмене маршрута';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Изменить статус маршрута
  const editRouteStatus = async (routeId, status) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await routeEditStatusAPI.editRouteStatus(routeId, status);
      
      // Обновляем текущий маршрут если он загружен
      if (currentRoute && currentRoute.route_id === routeId) {
        setCurrentRoute(prev => ({
          ...prev,
          status: result.new_status,
          updated_at: result.updated_at
        }));
      }
      
      return result;
    } catch (err) {
      const errorMessage = err.message || 'Ошибка при изменении статуса маршрута';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Отправить отзыв о маршруте
  const submitFeedback = async (routeId, rating, comment = '') => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await routeFeedbackAPI.submitFeedback(routeId, rating, comment);
      
      return result;
    } catch (err) {
      const errorMessage = err.message || 'Ошибка при отправке отзыва';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Сброс состояния
  const reset = () => {
    setCurrentRoute(null);
    setError(null);
  };

  return {
    // Состояние
    currentRoute,
    loading,
    error,
    
    // Методы
    getRoute,
    cancelRoute,
    editRouteStatus,
    submitFeedback,
    reset,
  };
};