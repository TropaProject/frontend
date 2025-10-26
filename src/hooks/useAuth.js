import { useState } from 'react';
import { authAPI, tokenService, userAPI } from '../services/api';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Загрузка данных пользователя после авторизации
  const loadUserData = async () => {
    try {
      const userProfile = await userAPI.getUserProfile();
      setUser(userProfile);
      return userProfile;
    } catch (err) {
      console.error('Ошибка загрузки данных пользователя:', err);
      // Если не удалось загрузить профиль, устанавливаем базовые данные
      setUser({ email: 'user@example.com' });
    }
  };

  // Вход
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const tokens = await authAPI.login({ email, password });
      tokenService.setTokens(tokens.access, tokens.refresh);
      
      // Загружаем данные пользователя
      await loadUserData();
      
      return tokens;
    } catch (err) {
      const errorMessage = err.message || 'Ошибка входа';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Регистрация
  const register = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const tokens = await authAPI.register({ email, password });
      tokenService.setTokens(tokens.access, tokens.refresh);
      
      // Загружаем данные пользователя
      await loadUserData();
      
      return tokens;
    } catch (err) {
      const errorMessage = err.message || 'Ошибка регистрации';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Выход
  const logout = () => {
    tokenService.removeTokens();
    setUser(null);
    setError(null);
  };

  // Обновление токена
  const refreshToken = async () => {
    try {
      const refreshToken = tokenService.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token');
      }
      
      const response = await authAPI.refreshToken({ refresh: refreshToken });
      tokenService.setTokens(response.data.access, refreshToken);
      
      return response.data.access;
    } catch (err) {
      logout();
      throw err;
    }
  };

  // Проверка авторизации и загрузка данных пользователя
  const checkAuth = async () => {
    const isAuth = tokenService.isAuthenticated();
    if (isAuth && !user) {
      await loadUserData();
    }
    return isAuth;
  };

  // Обновление данных пользователя
  const updateUser = async () => {
    if (tokenService.isAuthenticated()) {
      await loadUserData();
    }
  };

  return {
    // Состояние
    user,
    loading,
    error,
    isAuthenticated: tokenService.isAuthenticated(),
    
    // Методы
    login,
    register,
    logout,
    refreshToken,
    checkAuth,
    updateUser,
  };
};