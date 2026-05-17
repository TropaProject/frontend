// features/auth/ui/LoginForm.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import BaseInput from "@/shared/components/ui/inputs/BaseInput";
import BaseButton from "@/shared/components/ui/buttons/BaseButton";
import { loginSchema, type LoginSchema } from "@/features/auth/model/validation";
import { useAuth } from "@/features/auth";
import FormSocialLinks from "@/features/auth/ui/FormSocialLinks";
import { FormError, useFormError } from "@/shared/lib/feedback/FormError";

export const LoginForm = () => {
    const { login } = useAuth();
    const errorMessage = useFormError(login, 'Ошибка входа');

    const { register, handleSubmit, formState: { errors } } = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = (data: LoginSchema) => {
        login.mutate({
            email: data.email.trim(),
            password: data.password.trim()
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="z-20 flex flex-col items-center gap-1 w-full mx-auto px-2.5">

            <FormError message={errorMessage} />

            <div className="flex flex-col w-full desktop:flex-row items-start gap-1 sm:max-w-1/2">
                <BaseInput
                    {...register("email")}
                    placeholder="E-mail"
                    error={errors.email?.message}
                    disabled={login.isPending}
                />
                <BaseInput
                    {...register("password")}
                    type="password"
                    placeholder="Пароль"
                    error={errors.password?.message}
                    disabled={login.isPending}
                />
            </div>

            <FormSocialLinks />

            <BaseButton
                type="submit"
                size="md"
                className="min-w-25 w-full max-w-full sm:max-w-1/2 desktop:max-w-1/4"
                loading={login.isPending}
            >
                Войти
            </BaseButton>
        </form>
    );
};