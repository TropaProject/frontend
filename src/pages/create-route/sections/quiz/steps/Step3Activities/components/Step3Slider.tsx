// pages/create-route/sections/quiz/steps/Step3Activities/components/Step3Slider.tsx
import Step3SliderBg from "@/pages/create-route/sections/quiz/steps/Step3Activities/assets/backgrounds/Step3SliderBg";
import clsx from "clsx";
import { QuizSlider } from "@/pages/create-route/sections/quiz/components/QuizSlider";
import CreateRouteStepNavigation from "@/features/create-route/ui/CreateRouteStepNavigation";
import { useMemo, useState } from "react";
import HomeGuideDashedPath from "@/pages/home/sections/guide/assets/visual/HomeGuideDashedPath";
import { useCreateRouteStore } from "@/features/create-route/model/store";
import type { InterestDTO } from "@/shared/api/create-route/types";
import BaseCard from '@/shared/components/ui/cards/BaseCard';
import { buildInterestSlides } from "@/pages/create-route/sections/quiz/steps/Step3Activities/lib/interestSlides";

type SlideSettings = {
    title: string;
    pageBgColor: string;
    pageTextColor: string;
    sliderTitleColor: string;
    sliderDescriptionColor: string;
    sliderArrowColor: string;
    sliderButtonBgColor: string;
    stepNavigationFirstButtonBgColor?: string;
    stepNavigationSecondButtonBgColor?: string;
    stepNavigationSecondButtonBorderColor?: string;
    selectedSlideBorderColor?: string;
};

const SLIDE_CONFIG: Record<number, SlideSettings> = {
    0: {
        title: "Подходящий случай",
        pageBgColor: "text-secondary",
        pageTextColor: "text-background",
        sliderTitleColor: "text-background",
        sliderDescriptionColor: "text-background",
        sliderArrowColor: "text-secondary",
        sliderButtonBgColor: "text-background",
        stepNavigationFirstButtonBgColor: 'bg-secondary',
        selectedSlideBorderColor: 'text-primary!',
    },
    1: {
        title: "С кем гуляем?",
        pageBgColor: "text-light-green",
        pageTextColor: "text-background",
        sliderTitleColor: "text-background",
        sliderDescriptionColor: "text-background",
        sliderArrowColor: "text-light-green",
        sliderButtonBgColor: "text-background",
        stepNavigationFirstButtonBgColor: 'bg-light-green',
        selectedSlideBorderColor: 'text-primary!',
    },
    2: {
        title: "Культурная программа",
        pageBgColor: "text-pink",
        pageTextColor: "text-text",
        sliderTitleColor: "text-text",
        sliderDescriptionColor: "text-text",
        sliderArrowColor: "text-pink",
        sliderButtonBgColor: "text-text",
        stepNavigationFirstButtonBgColor: 'bg-pink',
        selectedSlideBorderColor: 'text-primary!',
    },
    3: {
        title: "Куда тянет?",
        pageBgColor: "text-primary",
        pageTextColor: "text-background",
        sliderTitleColor: "text-background",
        sliderDescriptionColor: "text-background",
        sliderArrowColor: "text-primary",
        sliderButtonBgColor: "text-background",
        stepNavigationFirstButtonBgColor: 'bg-primary',
        stepNavigationSecondButtonBgColor: 'bg-secondary',
        stepNavigationSecondButtonBorderColor: 'text-secondary',
        selectedSlideBorderColor: 'text-secondary!',
    },
};

interface Step3SliderProps {
    interests: InterestDTO[];
    className?: string;
}

const Step3Slider = ({ interests, className }: Step3SliderProps) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const currentConfig = SLIDE_CONFIG[activeIndex] || SLIDE_CONFIG[0];
    const { toggleInterest, formData } = useCreateRouteStore();

    const slides = useMemo(() => buildInterestSlides(interests), [interests]);

    const groups = useMemo(() =>
        slides.map((slide) =>
            slide.interests.map((i) => ({
                id: i.id,
                title: i.label,
                description: i.description,
                image: i.image,
            }))
        ),
        [slides]
    );

    const currentTitle = slides[activeIndex]?.title || currentConfig.title;

    return (
        <div className={clsx(
            "relative flex flex-col gap-8 pt-24 pb-64 desktop:pb-96 pl-2.5 desktop:px-10 transition-colors duration-500 overflow-hidden",
            className
        )}>
            <div className="flex flex-col w-full z-20 gap-5">
                <h2 className={clsx("transition-colors duration-500 text-heading-md! :text-heading-3xl!", currentConfig.pageTextColor)}>
                    Что сегодня тебе интересно?
                </h2>
            </div>

            <QuizSlider
                title={currentTitle}
                description="Если считаешь, что тебе это интересно сегодня, то выбери что-то из категории"
                groups={groups}
                titleClassName={currentConfig.sliderTitleColor}
                descriptionColor={currentConfig.sliderDescriptionColor}
                arrowColor={currentConfig.sliderArrowColor}
                buttonBgColor={currentConfig.sliderButtonBgColor}
                onSlideChange={setActiveIndex}
                className="z-20"
                renderCard={(card) => {
                    const isActive = formData.interests.includes(card.id as string);
                    return (
                        <BaseCard
                            title={card.title}
                            description={card.description}
                            image={card.image}
                            borderColor={isActive ? currentConfig.selectedSlideBorderColor : 'text-text'}
                            className={clsx(
                                isActive && 'drop-shadow-lg tablet:drop-shadow-2xl',
                                "h-full xs:pr-1.5! xs:*:rounded-md xs:*:*:first:rounded-t-md sm:*:*:first:rounded-t-2xl sm:*:rounded-2xl tablet:pr-1! lg:pr-1.5!"
                            )}
                            onClick={() => toggleInterest(card.id as string)}
                        />
                    );
                }}
            />

            <CreateRouteStepNavigation
                className="z-20 pr-2.5 tablet:pr-10"
                firstButtonVariant="tertiary"
                firstButtonBgColor={currentConfig.stepNavigationFirstButtonBgColor}
                secondButtonBgColor={currentConfig.stepNavigationSecondButtonBgColor}
                secondButtonBorderColor={currentConfig.stepNavigationSecondButtonBorderColor}
            />

            <Step3SliderBg
                preserveAspectRatio="none"
                className={clsx(
                    "w-full h-full absolute inset-0 z-0 transition-colors duration-500",
                    currentConfig.pageBgColor
                )}
            />

            <HomeGuideDashedPath preserveAspectRatio="none" className="desktop:block hidden w-full h-full absolute max-h-3/4 top-0 z-10 desktop:px-10 py-20 desktop:pb-20 desktop:pt-11" />
        </div>
    );
};

export default Step3Slider;