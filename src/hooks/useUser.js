import { useState } from 'react';
import { userAPI } from '../services/api';

export const useUser = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [userRoutes, setUserRoutes] = useState([]);
  const [userStatistics, setUserStatistics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Получить профиль пользователя
  const getUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const profile = await userAPI.getUserProfile();
      setUserProfile(profile);
      
      return profile;
    } catch (err) {
      const errorMessage = err.message || 'Ошибка при загрузке профиля';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Получить список маршрутов пользователя
  const getUserRoutes = async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const routes = await userAPI.getUserRoutes(params);
      setUserRoutes(routes);
      
      return routes;
    } catch (err) {
      const errorMessage = err.message || 'Ошибка при загрузке маршрутов';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Получить статистику пользователя
  const getUserStatistics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const statistics = await userAPI.getUserStatistics();
      setUserStatistics(statistics);
      
      return statistics;
    } catch (err) {
      const errorMessage = err.message || 'Ошибка при загрузке статистики';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Загрузка всех данных пользователя
  const loadUserData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [profile, routes, statistics] = await Promise.all([
        getUserProfile(),
        getUserRoutes(),
        getUserStatistics()
      ]);
      
      return { profile, routes, statistics };
    } catch (err) {
      const errorMessage = err.message || 'Ошибка при загрузке данных пользователя';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Обновить список маршрутов с фильтрацией
  const updateUserRoutes = async (filters = {}) => {
    return await getUserRoutes(filters);
  };

  // Сброс состояния
  const reset = () => {
    setUserProfile(null);
    setUserRoutes([]);
    setUserStatistics(null);
    setError(null);
  };

  return {
    // Данные
    userProfile,
    userRoutes,
    userStatistics,
    
    // Состояние
    loading,
    error,
    
    // Методы
    getUserProfile,
    getUserRoutes,
    getUserStatistics,
    loadUserData,
    updateUserRoutes,
    reset,
  };
};