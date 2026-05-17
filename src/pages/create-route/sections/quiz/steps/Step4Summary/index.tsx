// pages/create-route/sections/quiz/steps/Step4Summary/index.tsx
import Step4Bg from '@/pages/create-route/sections/quiz/steps/Step4Summary/assets/backgrounds/Step4Bg';
import { Step4Cards } from '@/pages/create-route/sections/quiz/steps/Step4Summary/components/Step4Cards';
import { useScrollToTop } from '@/shared/hooks/useScrollToTop';
import type { HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLElement> {
    className?: string;
    hasDescription?: boolean;
    onCreateRoute?: () => void;
}

export const Step4Summary = ({ className, hasDescription, onCreateRoute, ...props }: Props) => {
    useScrollToTop();

    return (
        <section className={`relative flex flex-col ${className}`} {...props}>
            <div className="w-full flex flex-col z-10 gap-4">
                <h2 className="text-background desktop:text-heading-3xl! desktop:max-w-1/3">
                    Я почти закончил!
                </h2>
                <p className="text-background text-body-lg desktop:max-w-1/3">
                    {hasDescription
                        ? "Ниже сгенерированное описание маршрута. Ты можешь его скорректировать, а можешь согласиться, нажав кнопку «В путь!»"
                        : "Ниже сгенерированное описание маршрута. Ожидайте..."
                    }
                </p>

                <Step4Cards hasDescription={hasDescription} onCreateRoute={onCreateRoute} />
            </div>

            <Step4Bg className="w-full h-full absolute -inset-0" preserveAspectRatio="none" />
        </section>
    );
};