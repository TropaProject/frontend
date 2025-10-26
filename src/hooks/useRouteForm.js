import { useState, useEffect } from 'react';
import { routeFormAPI } from '../services/api';
import { useRouteGenerate } from './useRouteGenerate';
import { useRouteManagement } from './useRouteManagement';
import { useAuth } from './useAuth';

export const useRouteForm = () => {
  const [cities, setCities] = useState([]);
  const [interests, setInterests] = useState([]);
  const [moods, setMoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formState, setFormState] = useState({
    selectedCity: null,
    selectedInterests: [],
    selectedMood: null,
    localParams: {
      budget: 'comfort',
      timeOfDay: 'afternoon',
      duration: 'medium',
      transport: 'walking'
    },
    description: ''
  });

  // Используем хуки для генерации, управления маршрутами и авторизации
  const { generatedRoute, loading: generating, error: generateError, generateRoute, resetRoute } = useRouteGenerate();
  const { currentRoute, loading: routeLoading, error: routeError, getRoute, cancelRoute, reset: resetManagement } = useRouteManagement();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const loadFormData = async () => {
      try {
        setLoading(true);
        const formData = await routeFormAPI.getFormData();
        
        setCities(formData.cities);
        setInterests(formData.interests);
        setMoods(formData.moods);
        setError(null);
      } catch (err) {
        setError(err.message || 'Неизвестная ошибка');
      } finally {
        setLoading(false);
      }
    };

    loadFormData();
  }, []);

  // Методы для обновления состояния формы
  const setSelectedCity = (city) => {
    setFormState(prev => ({ ...prev, selectedCity: city }));
  };

  const setSelectedInterests = (interests) => {
    setFormState(prev => ({ ...prev, selectedInterests: interests }));
  };

  const toggleInterest = (interest) => {
    setFormState(prev => {
      const isSelected = prev.selectedInterests.some(i => i.id === interest.id);
      if (isSelected) {
        return {
          ...prev,
          selectedInterests: prev.selectedInterests.filter(i => i.id !== interest.id)
        };
      } else {
        return {
          ...prev,
          selectedInterests: [...prev.selectedInterests, interest]
        };
      }
    });
  };

  const setSelectedMood = (mood) => {
    setFormState(prev => ({ ...prev, selectedMood: mood }));
  };

  const setLocalParams = (params) => {
    setFormState(prev => ({
      ...prev,
      localParams: { ...prev.localParams, ...params }
    }));
  };

  const setDescription = (description) => {
    setFormState(prev => ({ ...prev, description }));
  };

  // Валидация формы
  const isValid = Boolean(
    formState.selectedCity && 
    formState.selectedInterests.length > 0 && 
    formState.selectedMood
  );

  // Преобразование данных формы в формат для API
  const prepareRouteData = () => {
    if (!isValid) return null;

    return {
      city_id: formState.selectedCity.id,
      time_of_day: formState.localParams.timeOfDay,
      interests: formState.selectedInterests.map(interest => interest.id),
      mood: formState.selectedMood ? [formState.selectedMood.id] : [],
      budget: formState.localParams.budget,
      transport: formState.localParams.transport,
      duration_minutes: getDurationInMinutes(formState.localParams.duration),
      description: formState.description || 'Хочу интересный маршрут'
    };
  };

  // Конвертация длительности в минуты
  const getDurationInMinutes = (duration) => {
    const durations = {
      short: 60,
      medium: 120,
      long: 180
    };
    return durations[duration] || 120;
  };

  // Отправка формы для генерации маршрута
  const submitForm = async () => {
    if (!isValid) {
      throw new Error('Заполните все обязательные поля');
    }

    if (!isAuthenticated) {
      throw new Error('Для генерации маршрута необходимо авторизоваться');
    }

    const routeData = prepareRouteData();
    return await generateRoute(routeData);
  };

  // Загрузить маршрут по ID
  const loadRoute = async (routeId) => {
    if (!isAuthenticated) {
      throw new Error('Для просмотра маршрута необходимо авторизоваться');
    }
    return await getRoute(routeId);
  };

  // Отменить маршрут
  const cancelCurrentRoute = async (routeId, reason = '') => {
    if (!isAuthenticated) {
      throw new Error('Для отмены маршрута необходимо авторизоваться');
    }
    return await cancelRoute(routeId, reason);
  };

  // Сброс формы
  const resetForm = () => {
    setFormState({
      selectedCity: null,
      selectedInterests: [],
      selectedMood: null,
      localParams: {
        budget: 'comfort',
        timeOfDay: 'afternoon',
        duration: 'medium',
        transport: 'walking'
      },
      description: ''
    });
    resetRoute();
    resetManagement();
  };

  return {
    // Данные формы
    cities,
    interests,
    moods,
    formState,
    
    // Состояние загрузки/ошибок формы
    loading,
    error,
    isValid,
    
    // Авторизация
    isAuthenticated,
    
    // Состояние генерации маршрута
    generatedRoute,
    generating,
    generateError,
    
    // Состояние управления маршрутами
    currentRoute,
    routeLoading,
    routeError,
    
    // Методы формы
    setSelectedCity,
    setSelectedInterests,
    toggleInterest,
    setSelectedMood,
    setLocalParams,
    setDescription,
    resetForm,
    
    // Методы генерации
    submitForm,
    
    // Методы управления маршрутами
    loadRoute,
    cancelCurrentRoute,
  };
};