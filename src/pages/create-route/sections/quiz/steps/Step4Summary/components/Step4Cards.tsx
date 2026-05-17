// pages/create-route/sections/quiz/steps/Step4Summary/components/Step4Cards.tsx
import clsx from 'clsx';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import NotepadBackground from "@/pages/home/sections/advantages/assets/backgrounds/NotepadBackground";
import NotepadSignature from '@/pages/create-route/sections/quiz/steps/Step4Summary/assets/backgrounds/icons/NotepadSignature';
import BaseTextArea from '@/shared/components/ui/inputs/BaseTextArea';
import { useCreateRouteStore } from '@/features/create-route/model/store';
import CreateRouteStepNavigation from '@/features/create-route/ui/CreateRouteStepNavigation';
import FloatingDove from '@/shared/assets/doves/FloatingDove';
import DoveWithGlasses from "@/shared/assets/doves/dove-with-glasses.png";
import Step4SummaryDoveThoughts from '@/pages/create-route/sections/quiz/steps/Step4Summary/assets/visual/Step4SummaryDoveThoughts';
import { Loader } from '@/shared/lib/feedback/Loader/Loader';
import { FormError } from '@/shared/lib/feedback/FormError';
import { formatDescription } from '@/pages/create-route/sections/quiz/steps/Step4Summary/lib/formatDescription';

const schema = z.object({
    comment: z.string().max(500, "Комментарий слишком длинный"),
});

type FormData = z.infer<typeof schema>;

const CHUNK_SIZE = 900;

const splitIntoChunks = (text: string, size: number): string[] => {
    const sentences = text.split(/(?<=[.!?])\s+/);
    const chunks: string[] = [];
    let current = '';

    for (const sentence of sentences) {
        if ((current + sentence).length > size && current.length > 0) {
            chunks.push(current.trim());
            current = sentence;
        } else {
            current += (current ? ' ' : '') + sentence;
        }
    }
    if (current.trim()) chunks.push(current.trim());
    return chunks;
};

const NotepadSheet = ({
    children,
    className,
    hasSignature = false,
}: {
    children: React.ReactNode;
    className?: string;
    hasSignature?: boolean;
}) => (
    <li className={clsx("flex flex-col p-6 pt-12 relative w-full min-h-[100px]", hasSignature ? ' pb-20' : ' pb-8', className)}>
        <div className="relative z-10 w-full h-full flex flex-col">{children}</div>
        {hasSignature && (
            <NotepadSignature className="absolute bottom-5 right-5 w-full h-min desktop:max-w-20 max-w-12 z-20 pointer-events-none" />
        )}
        <NotepadBackground className="w-full h-full absolute inset-0 text-white" preserveAspectRatio="none" />
    </li>
);

interface Step4CardsProps {
    className?: string;
    hasDescription?: boolean;
    onCreateRoute?: () => void;
}

export const Step4Cards = ({ className, hasDescription, onCreateRoute }: Step4CardsProps) => {
    const aiDescription = useCreateRouteStore((s) => s.aiDescription);
    const descriptionError = useCreateRouteStore((s) => s.descriptionError);
    const initialComment = useCreateRouteStore((state) => state.formData.comment);
    const updateFormData = useCreateRouteStore((state) => state.updateFormData);

    const {
        register,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: { comment: initialComment },
    });

    const descriptionChunks = aiDescription ? splitIntoChunks(aiDescription, CHUNK_SIZE) : [];

    const showError = descriptionError && !hasDescription;
    const showLoader = !hasDescription && !descriptionError;

    return (
        <ul className={clsx("flex w-full flex-col tablet:flex-row tablet:justify-between tablet:items-start gap-4 z-10", className)}>
            <div className="flex flex-col w-full gap-4">
                {showLoader && (
                    <NotepadSheet hasSignature className="desktop:min-w-110 desktop:rotate-1">
                        <Loader message="Генерируем описание..." className="py-8" />
                    </NotepadSheet>
                )}

                {showError && (
                    <NotepadSheet hasSignature className="desktop:min-w-110 desktop:rotate-1">
                        <FormError message={descriptionError} className="py-8" />
                    </NotepadSheet>
                )}

                {hasDescription && descriptionChunks.map((chunk, index) => (
                    <NotepadSheet
                        key={index}
                        hasSignature={index === 0}
                        className="desktop:min-w-110 desktop:rotate-1"
                    >
                        <p
                            className="text-text text-body-sm desktop:text-body-lg leading-relaxed whitespace-break-spaces h-full"
                            dangerouslySetInnerHTML={{
                                __html: formatDescription(chunk),
                            }}
                        />
                    </NotepadSheet>
                ))}
            </div>

            <NotepadSheet className="tablet:order-3 desktop:min-w-110 tablet:self-end">
                <div className="flex flex-col gap-3">
                    <h2 className="text-primary text-heading-sm font-bold uppercase leading-tight">
                        Поправить маршрут можно здесь
                    </h2>
                    <p className="text-text text-body-xs desktop:text-body-sm mt-1">
                        Я учту при построении маршрута
                    </p>

                    <BaseTextArea
                        {...register("comment", {
                            onChange: (e) => updateFormData({ comment: e.target.value }),
                        })}
                        placeholder="Расскажи откуда начнём новый маршрут"
                        error={errors.comment?.message}
                    />
                </div>
            </NotepadSheet>

            <div className="flex w-full relative z-20 tablet:order-2 tablet:self-end">
                <CreateRouteStepNavigation
                    firstButtonVariant="tertiary"
                    onCreateRoute={onCreateRoute}
                    hasDescription={hasDescription}
                />

                <FloatingDove
                    className="z-10 top-2 desktop:-top-4 desktop:left-0 desktop:mx-auto -translate-y-1/1 right-0"
                    thoughts={<Step4SummaryDoveThoughts />}
                    thoughtsClassName="left-2 -translate-x-1/1 desktop:translate-x-0 desktop:left-12 desktop:-translate-y-1/1 desktop:top-0"
                    doveSrc={DoveWithGlasses}
                    doveClassName="w-full h-min -scale-x-[1] max-w-17 desktop:max-w-48"
                />
            </div>
        </ul>
    );
};