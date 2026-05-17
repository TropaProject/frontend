// features/auth/ui/RegisterForm.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import BaseInput from "@/shared/components/ui/inputs/BaseInput";
import BaseButton from "@/shared/components/ui/buttons/BaseButton";
import { registerSchema, type RegisterSchema } from "@/features/auth/model/validation";
import { useAuth } from "@/features/auth";
import FormSocialLinks from "@/features/auth/ui/FormSocialLinks";
import { FormError, useFormError } from "@/shared/lib/feedback/FormError";

export const RegisterForm = () => {
    const { register: authRegister } = useAuth();
    const errorMessage = useFormError(authRegister, 'Ошибка регистрации');

    const {
        register: formRegister,
        handleSubmit,
        formState: { errors }
    } = useForm<RegisterSchema>({
        resolver: zodResolver(registerSchema)
    });

    const onSubmit = (data: RegisterSchema) => {
        authRegister.mutate({
            username: data.username.trim(),
            email: data.email.trim(),
            password: data.password.trim()
        });
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="z-20 flex flex-col items-center gap-1 w-full mx-auto px-2.5"
        >
            <FormError message={errorMessage} />

            <div className="grid w-full grid-cols-1 desktop:grid-cols-2 desktop:gap-2 items-start gap-1 sm:max-w-1/2">
                <BaseInput
                    {...formRegister("username")}
                    placeholder="Никнейм"
                    error={errors.username?.message}
                    disabled={authRegister.isPending}
                />
                <BaseInput
                    {...formRegister("email")}
                    placeholder="E-mail"
                    error={errors.email?.message}
                    disabled={authRegister.isPending}
                />
                <BaseInput
                    {...formRegister("password")}
                    type="password"
                    placeholder="Введите пароль"
                    error={errors.password?.message}
                    maxLength={40}
                    disabled={authRegister.isPending}
                />
                <BaseInput
                    {...formRegister("confirmPassword")}
                    type="password"
                    placeholder="Повторите пароль"
                    error={errors.confirmPassword?.message}
                    maxLength={40}
                    disabled={authRegister.isPending}
                />
            </div>

            <FormSocialLinks />

            <BaseButton
                type="submit"
                className="min-w-25 w-full max-w-full sm:max-w-1/2 desktop:max-w-1/4"
                loading={authRegister.isPending}
            >
                Зарегистрироваться
            </BaseButton>
        </form>
    );
};