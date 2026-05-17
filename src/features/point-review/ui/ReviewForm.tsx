// features/point-review/ui/ReviewForm.tsx
import { useState } from "react";
import BaseButton from "@/shared/components/ui/buttons/BaseButton";
import BaseTextArea from "@/shared/components/ui/inputs/BaseTextArea";
import { FormError } from "@/shared/lib/feedback/FormError";
import { useCreateReview } from "@/features/point-review/hooks/useCreateReview";
import { ReviewFormRatingStars } from "@/features/point-review/ui/ReviewFormRatingStars";

interface ReviewFormProps {
    pointId: string;
    onSuccess?: () => void;
    onCancel?: () => void;
}

export const ReviewForm = ({ pointId, onSuccess, onCancel }: ReviewFormProps) => {
    const mutation = useCreateReview(pointId);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");

    const handleSubmit = () => {
        mutation.mutate(
            { rating, comment },
            { onSuccess: () => onSuccess?.() }
        );
    };

    return (
        <div className="flex flex-col gap-4 w-full">
            <FormError message={mutation.error?.message} />

            <ReviewFormRatingStars rating={rating} onRate={setRating} />

            <BaseTextArea
                placeholder="Расскажите о своих впечатлениях..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                disabled={mutation.isPending}
            />

            <div className="flex gap-2 *:flex-1 *:max-w-none">
                <BaseButton variant="secondary" onClick={onCancel} disabled={mutation.isPending}>
                    Отмена
                </BaseButton>
                <BaseButton variant="primary" loading={mutation.isPending} onClick={handleSubmit}>
                    Отправить отзыв
                </BaseButton>
            </div>
        </div>
    );
};