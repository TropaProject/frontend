import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import BaseInput from "@/shared/components/ui/inputs/BaseInput";
import BaseButton from "@/shared/components/ui/buttons/BaseButton";
import {
    settingsSchema,
    passwordSchema,
    type SettingsSchema,
    type PasswordSchema
} from "@/entities/user/model/validation";

type Props = {
    className?: string;
}

export const SettingsForm = ({ className }: Props) => {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SettingsSchema>({
        resolver: zodResolver(settingsSchema),
        defaultValues: { nickname: '', email: '' }
    });

    const onSubmit = async (data: SettingsSchema) => {
        console.log("Update Profile:", data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={className}>
            <h2 className="text-primary text-heading-md mb-4">Данные профиля</h2>
            <div className="z-20 flex flex-col items-center gap-1 w-full">
                <BaseInput
                    containerClassName="*:first:h-16 *:px-2"

                    {...register("nickname")}
                    placeholder="Никнейм"
                    error={errors.nickname?.message}
                    disabled={isSubmitting}
                />
                <BaseInput
                    containerClassName="*:first:h-16 *:px-2"

                    {...register("email")}
                    placeholder="E-mail"
                    type="email"
                    error={errors.email?.message}
                    disabled={isSubmitting}
                />
                <BaseButton
                    type="submit"
                    size="md"
                    className="min-w-full mt-2"
                    loading={isSubmitting}
                >
                    Сохранить изменения
                </BaseButton>
            </div>
        </form>
    );
};

export const SettingsPasswordForm = ({ className }: Props) => {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<PasswordSchema>({
        resolver: zodResolver(passwordSchema),
    });

    const onSubmit = async (data: PasswordSchema) => {
        console.log("Change Password:", data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={className}>
            <h2 className="text-primary text-heading-md mb-4">Изменить пароль</h2>
            <div className="z-20 flex flex-col items-center gap-1 w-full">
                <BaseInput
                    containerClassName="*:first:h-16 *:px-2"

                    {...register("oldPassword")}
                    placeholder="Старый пароль"
                    type="password"
                    error={errors.oldPassword?.message}
                    disabled={isSubmitting}
                />
                <BaseInput
                    containerClassName="*:first:h-16 *:px-2"

                    {...register("newPassword")}
                    placeholder="Новый пароль"
                    type="password"
                    error={errors.newPassword?.message}
                    disabled={isSubmitting}
                />
                <BaseInput
                    containerClassName="*:first:h-16 *:px-2"

                    {...register("confirmPassword")}
                    placeholder="Повторите новый пароль"
                    type="password"
                    error={errors.confirmPassword?.message}
                    disabled={isSubmitting}
                />
                <BaseButton
                    type="submit"
                    size="md"
                    className="min-w-full mt-2"
                    loading={isSubmitting}
                >
                    Сохранить изменения
                </BaseButton>
            </div>
        </form>
    );
};