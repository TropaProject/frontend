import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Токен будет автоматически добавляться к запросам
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Интерцептор для автоматического обновления токена
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Если ошибка 401 и это не запрос обновления токена
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await authAPI.refreshToken({ refresh: refreshToken });
          const newAccessToken = response.data.access;
          
          localStorage.setItem('access_token', newAccessToken);
          
          // Повторяем оригинальный запрос с новым токеном
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Если не удалось обновить токен - разлогиниваем
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    // Обработка других ошибок
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error(error.message || 'Произошла ошибка');
    }
  }
);

// API для авторизации
export const authAPI = {
  async login(credentials) {
    const response = await api.post('/api/auth/login', credentials);
    if (response.data.status !== 'success') {
      throw new Error('Invalid response format');
    }
    return response.data.data;
  },

  async register(userData) {
    const response = await api.post('/api/auth/register', userData);
    if (response.data.status !== 'success') {
      throw new Error('Invalid response format');
    }
    return response.data.data;
  },

  async refreshToken(tokenData) {
    const response = await api.post('/api/auth/refresh', tokenData);
    if (response.data.status !== 'success') {
      throw new Error('Invalid response format');
    }
    return response.data;
  },
};

// API для работы с пользователем
export const userAPI = {
  async getUserProfile() {
    const response = await api.get('/api/user');
    if (response.data.status !== 'success') {
      throw new Error('Invalid response format');
    }
    return response.data.data;
  },

  async getUserRoutes(params = {}) {
    const response = await api.get('/api/user/list', { params });
    if (response.data.status !== 'success') {
      throw new Error('Invalid response format');
    }
    return response.data.data;
  },

  async getUserStatistics() {
    const response = await api.get('/api/user/statistic');
    if (response.data.status !== 'success') {
      throw new Error('Invalid response format');
    }
    return response.data.data;
  },
};

// API для работы с маршрутами
export const routeFormAPI = {
  async getFormData() {
    const response = await api.get('/api/route/form');
    if (response.data.status !== 'success') {
      throw new Error('Invalid response format');
    }
    return response.data.data;
  },
};

export const routeGenerateAPI = {
  async generateRoute(routeData) {
    const response = await api.post('/api/route/generate', routeData);
    if (response.data.status !== 'success') {
      throw new Error('Invalid response format');
    }
    return response.data.data;
  },
};

export const routeCancelAPI = {
  async cancelRoute(routeId, reason = '') {
    const response = await api.post('/api/route/cancel', {
      route_id: routeId,
      reason: reason
    });
    if (response.data.status !== 'success') {
      throw new Error('Invalid response format');
    }
    return response.data.data;
  },
};

export const routeShowAPI = {
  async getRoute(routeId) {
    const response = await api.get(`/api/route/show/${routeId}`);
    if (response.data.status !== 'success') {
      throw new Error('Invalid response format');
    }
    return response.data.data;
  },
};

// Новые API ручки
export const routeAreaAPI = {
  async getAreas(cityId) {
    const response = await api.get('/api/route/area', {
      params: { city_id: cityId }
    });
    if (response.data.status !== 'success') {
      throw new Error('Invalid response format');
    }
    return response.data.data;
  },
};

export const routeEditStatusAPI = {
  async editRouteStatus(routeId, status) {
    const response = await api.post('/api/route/edit-status', {
      route_id: routeId,
      status: status
    });
    if (response.data.status !== 'success') {
      throw new Error('Invalid response format');
    }
    return response.data.data;
  },
};

export const routeFeedbackAPI = {
  async submitFeedback(routeId, rating, comment = '') {
    const response = await api.post('/api/route/feedback', {
      route_id: routeId,
      rating: rating,
      comment: comment
    });
    if (response.data.status !== 'success') {
      throw new Error('Invalid response format');
    }
    return response.data.data;
  },
};

// Вспомогательные функции для работы с токенами
export const tokenService = {
  setTokens(access, refresh) {
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
  },

  getAccessToken() {
    return localStorage.getItem('access_token');
  },

  getRefreshToken() {
    return localStorage.getItem('refresh_token');
  },

  removeTokens() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },

  isAuthenticated() {
    return !!localStorage.getItem('access_token');
  },
};

export default api;