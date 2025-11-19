import { useState, useEffect } from 'react';
import { routeFormAPI } from '../services/api';
import { useRouteGenerate } from './useRouteGenerate';
import { useRouteManagement } from './useRouteManagement';
import { useRouteDescription } from './useRouteDescription';
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
    description: '',
    startPoint: '',
    startArea: '',
    gptDescription: ''
  });

  const { generatedRoute, loading: generating, error: generateError, generateRoute, resetRoute } = useRouteGenerate();
  const { currentRoute, loading: routeLoading, error: routeError, getRoute, cancelRoute, reset: resetManagement } = useRouteManagement();
  const { generatedDescription, loading: descLoading, error: descError, generateDescription, reset: resetDescription } = useRouteDescription();
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

  const setStartPoint = (startPoint) => {
    setFormState(prev => ({ ...prev, startPoint }));
  };

  const setStartArea = (startArea) => {
    setFormState(prev => ({ ...prev, startArea }));
  };

  const setGptDescription = (gptDescription) => {
    setFormState(prev => ({ ...prev, gptDescription }));
  };

  const isValid = Boolean(
    formState.selectedCity && 
    formState.selectedInterests.length > 0 && 
    formState.selectedMood
  );

  const prepareRouteData = () => {
    if (!isValid) return null;

    const routeData = {
      city_id: formState.selectedCity.id,
      time_of_day: formState.localParams.timeOfDay,
      interests: formState.selectedInterests.map(interest => interest.id),
      mood: formState.selectedMood ? [formState.selectedMood.id] : [],
      budget: formState.localParams.budget,
      transport: formState.localParams.transport,
      duration_minutes: getDurationInMinutes(formState.localParams.duration),
      description: formState.description || 'Хочу интересный маршрут'
    };

    if (formState.startPoint) {
      routeData.start_point = formState.startPoint;
    } else if (formState.startArea) {
      routeData.start_area = formState.startArea;
    }

    return routeData;
  };

  const getDurationInMinutes = (duration) => {
    const durations = {
      short: 60,
      medium: 120,
      long: 180
    };
    return durations[duration] || 120;
  };

  const generateRouteDescription = async () => {
    if (!isValid) {
      throw new Error('Заполните все обязательные поля для генерации описания');
    }

    if (!isAuthenticated) {
      throw new Error('Для генерации описания необходимо авторизоваться');
    }

    const routeData = prepareRouteData();
    return await generateDescription(routeData);
  };

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

  const loadRoute = async (routeId) => {
    if (!isAuthenticated) {
      throw new Error('Для просмотра маршрута необходимо авторизоваться');
    }
    return await getRoute(routeId);
  };

  const cancelCurrentRoute = async (routeId, reason = '') => {
    if (!isAuthenticated) {
      throw new Error('Для отмены маршрута необходимо авторизоваться');
    }
    return await cancelRoute(routeId, reason);
  };

  const editRouteStatus = async (routeId, status) => {
    if (!isAuthenticated) {
      throw new Error('Для изменения статуса маршрута необходимо авторизоваться');
    }
    return await cancelRoute(routeId, status);
  };

  const submitFeedback = async (routeId, rating, comment = '') => {
    if (!isAuthenticated) {
      throw new Error('Для отправки отзыва необходимо авторизоваться');
    }
    return await cancelRoute(routeId, rating, comment);
  };

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
      description: '',
      startPoint: '',
      startArea: '',
      gptDescription: ''
    });
    resetRoute();
    resetManagement();
    resetDescription();
  };

  return {
    cities,
    interests,
    moods,
    formState,
    loading,
    error,
    isValid,
    isAuthenticated,
    generatedDescription,
    descLoading,
    descError,
    generatedRoute,
    generating,
    generateError,
    currentRoute,
    routeLoading,
    routeError,
    setSelectedCity,
    setSelectedInterests,
    toggleInterest,
    setSelectedMood,
    setLocalParams,
    setDescription,
    setStartPoint,
    setStartArea,
    setGptDescription,
    resetForm,
    generateRouteDescription,
    submitForm,
    loadRoute,
    cancelCurrentRoute,
    editRouteStatus,
    submitFeedback,
  };
};