import { useEffect } from 'react';
import { useAuth } from './useAuth';

export const useProtectedRoute = (redirectUrl = '/login') => {
  const { isAuthenticated, checkAuth } = useAuth();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return {
    isAuthenticated,
    redirectUrl,
  };
};