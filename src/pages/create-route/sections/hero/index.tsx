import type { HTMLAttributes } from 'react';

import HeroImgLeft from '@/pages/create-route/sections/hero/assets/images/create-route-hero-1.png';
import HeroImgRight from '@/pages/create-route/sections/hero/assets/images/create-route-hero-2.png';
import BaseProgressBar from '@/shared/components/ui/inputs/BaseProgressBar';

interface CreateRouteHeroProps extends HTMLAttributes<HTMLElement> {
    currentStep: number;
    totalSteps: number;
}

export const CreateRouteHero = ({ currentStep, totalSteps, className, ...props }: CreateRouteHeroProps) => {
    const progress = (currentStep / totalSteps) * 100;

    return (
        <section className={`w-full mx-auto overflow-hidden flex flex-col relative ${className}`} {...props}>
            <div className="w-full flex flex-col">

                <h1 className="z-20 text-heading-2xl! desktop:text-heading-4xl! text-primary text-center py-36 sm:pb-20 sm:pt-28">
                    Строим новый маршрут
                </h1>

                <div className="flex w-full flex-col items-center desktop:items-start gap-2 px-2.5 desktop:px-10 z-10">
                    <p className="font-decoration text-sm desktop:text-2xl text-text font-bold">
                        Шаг {currentStep} из {totalSteps}
                    </p>
                    <BaseProgressBar progress={progress} />
                </div>
            </div>

            <img
                src={HeroImgLeft}
                alt="изоборажение на фоне"
                className='absolute -left-10 bottom-2 desktop:left-0 desktop:bottom-16 w-full object-contain max-w-36 xs:max-w-48 desktop:max-w-60'
            />

            <img
                src={HeroImgRight}
                alt="изоборажение на фоне"
                className='absolute -right-10 desktop:right-0 desktop:bottom-16 bottom-2 w-full object-contain max-w-36 xs:max-w-48 desktop:max-w-60'
            />
        </section>
    );
};