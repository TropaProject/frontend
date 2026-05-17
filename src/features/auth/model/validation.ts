import * as z from "zod";

const emailSchema = z.string().trim().min(1, "Введите E-mail").email("Некорректный e-mail");
const passwordSchema = z.string().min(6, "Пароль должен быть от 6 до 40 символов").max(40, "Пароль должен быть от 6 до 40 символов");

export const loginSchema = z.object({
    email: emailSchema,
    password: z.string().min(1, "Введите пароль"),
});

export const registerSchema = z.object({
    username: z.string().min(2, "Никнейм слишком короткий").max(20, "Никнейм слишком длинный"),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Повторите пароль"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
});

export type LoginSchema = z.infer<typeof loginSchema>;
export type RegisterSchema = z.infer<typeof registerSchema>;