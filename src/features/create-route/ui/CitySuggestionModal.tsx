import { useForm } from "react-hook-form";
import { BaseModal } from "@/shared/components/ui/modals/BaseModal/BaseModal";
import BaseInput from "@/shared/components/ui/inputs/BaseInput";
import BaseTextArea from "@/shared/components/ui/inputs/BaseTextArea";
import BaseButton from "@/shared/components/ui/buttons/BaseButton";
import { FormError } from "@/shared/lib/feedback/FormError";
import { useCitySuggestion } from "@/entities/route/hooks/useRouteQueries";

interface CitySuggestionModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface CitySuggestionFormValues {
    name: string;
    comment: string;
}

export const CitySuggestionModal = ({ isOpen, onClose }: CitySuggestionModalProps) => {
    const suggestionMutation = useCitySuggestion();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CitySuggestionFormValues>({
        defaultValues: {
            name: "",
            comment: "",
        },
    });

    const onSubmit = (data: CitySuggestionFormValues) => {
        suggestionMutation.mutate(
            {
                name: data.name.trim(),
                country: "Россия",
                comment: data.comment.trim(),
            },
            {
                onSuccess: () => {
                    reset();
                    onClose();
                },
            }
        );
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    return (
        <BaseModal isOpen={isOpen} onClose={handleClose} className="max-w-[min(100%,_560px)] p-5 sm:p-8" backdropClassName="bg-black/20">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full">
                <div className="flex flex-col gap-2">
                    <h2 className="text-heading-sm text-primary">Расскажи какой город должен стать следующим</h2>
                    <BaseInput
                        {...register("name", { required: "Укажи город" })}
                        placeholder="Например: Ростов - на - Дону"
                        error={errors.name?.message}
                        disabled={suggestionMutation.isPending}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <h2 className="text-heading-sm text-primary">Почему ты хочешь, чтобы в сервисе появился этот город?</h2>
                    <BaseTextArea
                        {...register("comment", { required: "Напиши причину" })}
                        placeholder="Например: я давно живу в этом городе и хожу в одни и те же места"
                        className="min-h-[140px]"
                        disabled={suggestionMutation.isPending}
                    />
                </div>

                <FormError message={suggestionMutation.error ? String(suggestionMutation.error?.message ?? "Не удалось отправить заявку") : undefined} />

                <BaseButton type="submit" variant="secondary" className="mx-auto w-full sm:w-[260px]" loading={suggestionMutation.isPending}>
                    Предложить город
                </BaseButton>
            </form>
        </BaseModal>
    );
};
