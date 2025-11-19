import { useState } from 'react';
import { routeDescriptionAPI } from '../services/api';

export const useRouteDescription = () => {
  const [generatedDescription, setGeneratedDescription] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateDescription = async (routeData) => {
    try {
      setLoading(true);
      setError(null);
      
      const description = await routeDescriptionAPI.generateDescription(routeData);
      setGeneratedDescription(description);
      
      return description;
    } catch (err) {
      const errorMessage = err.message || 'Ошибка при генерации описания';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setGeneratedDescription(null);
    setError(null);
  };

  return {
    generatedDescription,
    loading,
    error,
    generateDescription,
    reset,
  };
};