// features/point-favorite/ui/FavoriteNoteForm.tsx
import { useState } from "react";
import BaseButton from "@/shared/components/ui/buttons/BaseButton";
import BaseTextArea from "@/shared/components/ui/inputs/BaseTextArea";
import { useUpdateFavoriteNote } from "@/features/point-favourite/hooks/useUpdateFavoriteNote";

interface FavoriteNoteFormProps {
    pointId: string;
    initialNote: string;
    onSaved?: () => void;
    onCancel?: () => void;
}

export const FavoriteNoteForm = ({ pointId, initialNote, onSaved, onCancel }: FavoriteNoteFormProps) => {
    const mutation = useUpdateFavoriteNote(pointId);
    const [note, setNote] = useState(initialNote);

    const handleSave = () => {
        mutation.mutate({ note }, { onSuccess: () => onSaved?.() });
    };

    return (
        <div className="flex flex-col gap-3 w-full">
            <BaseTextArea
                label="Заметка"
                placeholder="Хочу посетить весной..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                disabled={mutation.isPending}
            />
            <div className="flex gap-2">
                <BaseButton variant="secondary" size="sm" onClick={onCancel} disabled={mutation.isPending}>
                    Отмена
                </BaseButton>
                <BaseButton variant="primary" size="sm" loading={mutation.isPending} onClick={handleSave}>
                    Сохранить
                </BaseButton>
            </div>
        </div>
    );
};