// shared/lib/feedback/FormError/useFormError.ts
import { useMemo } from 'react';
import type { AxiosError } from 'axios';

interface MutationState {
    isError: boolean;
    error: Error | null;
}

interface DrfErrorResponse {
    errors?: Record<string, string[]>;
}

export const useFormError = (
    mutation: MutationState,
    fallback: string = 'Произошла ошибка'
): string | null => {
    return useMemo(() => {
        if (!mutation.isError || !mutation.error) return null;

        const axiosError = mutation.error as AxiosError<DrfErrorResponse>;
        const serverErrors = axiosError?.response?.data?.errors;

        if (serverErrors && typeof serverErrors === 'object') {
            return Object.values(serverErrors).flat().join('. ');
        }

        return mutation.error.message || fallback;
    }, [mutation.isError, mutation.error, fallback]);
};