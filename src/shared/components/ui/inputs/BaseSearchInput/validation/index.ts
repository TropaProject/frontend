import { z } from 'zod';

export const searchSchema = z.object({
    query: z.string().min(1, "Введите запрос для поиска").max(50, "Слишком длинный запрос"),
});

export type SearchFormData = z.infer<typeof searchSchema>;