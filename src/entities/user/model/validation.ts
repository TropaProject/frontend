// src\entities\user\model\validation.ts

import { z } from "zod";

export const settingsSchema = z.object({
    nickname: z.string().min(3, "Минимум 3 символа"),
    email: z.string().email("Невалидный e-mail"),
});

export const passwordSchema = z.object({
    oldPassword: z.string().min(1, "Введите старый пароль"),
    newPassword: z.string().min(6, "Минимум 6 символов"),
    confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
});

export type SettingsSchema = z.infer<typeof settingsSchema>;
export type PasswordSchema = z.infer<typeof passwordSchema>;