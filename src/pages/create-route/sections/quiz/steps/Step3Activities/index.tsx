// pages/create-route/sections/quiz/steps/Step3Activities/index.tsx
import type { HTMLAttributes } from 'react';
import Step3ParametersSelect from '@/pages/create-route/sections/quiz/steps/Step3Activities/components/Step3ParametersSelect';
import Step3Slider from '@/pages/create-route/sections/quiz/steps/Step3Activities/components/Step3Slider';
import { useCreateRouteStore } from "@/features/create-route/model/store";
import { MOOD_OPTIONS } from '@/pages/create-route/sections/quiz/steps/Step3Activities/lib/constants';
import { useScrollToTop } from '@/shared/hooks/useScrollToTop';
import type { InterestDTO, MoodDTO } from '@/shared/api/create-route/types';

interface Props extends HTMLAttributes<HTMLElement> {
    className?: string;
    interests: InterestDTO[];
    moods: MoodDTO[];
}

export const Step3Activities = ({ className, interests, moods, ...props }: Props) => {
    useScrollToTop();

    const moodId = useCreateRouteStore((state) => state.formData.mood);
    const updateFormData = useCreateRouteStore((state) => state.updateFormData);

    const currentMood = MOOD_OPTIONS.find(opt => opt.id === moodId);

    return (
        <section className={`${className}`} {...props}>
            <div className="flex flex-col w-full gap-8 px-2.5 tablet:px-10">
                <h2 className="text-primary desktop:text-heading-3xl!">Какое у тебя настроение?</h2>

                <div className="w-full grid grid-cols-1 desktop:grid-cols-16 desktop:*:first:col-span-5 gap-8">
                    <Step3ParametersSelect
                        mood={currentMood}
                        setMood={(opt) => updateFormData({ mood: String(opt.id) })}
                    />
                </div>
            </div>
            <Step3Slider interests={interests} />
        </section>
    );
};