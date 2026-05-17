// pages/create-route/sections/quiz/index.tsx
import { Step1General } from "@/pages/create-route/sections/quiz/steps/Step1General";
import { Step2Parameters } from "@/pages/create-route/sections/quiz/steps/Step2Parameters";
import { Step3Activities } from "@/pages/create-route/sections/quiz/steps/Step3Activities";
import { Step4Summary } from "@/pages/create-route/sections/quiz/steps/Step4Summary";
import clsx from "clsx";
import type { CityDTO, InterestDTO, MoodDTO } from "@/shared/api/create-route/types";

interface CreateRouteQuizProps {
    currentStep: number;
    formData: { cities: CityDTO[]; interests: InterestDTO[]; moods: MoodDTO[] };
    hasDescription: boolean;
    onCreateRoute: () => void;
    className?: string;
}

export const CreateRouteQuiz = ({ currentStep, formData, hasDescription, onCreateRoute, className }: CreateRouteQuizProps) => {
    const STEPS_MAP: Record<number, React.ReactNode> = {
        1: <Step1General cities={formData.cities} className="pb-64 desktop:pb-96 gap-10" />,
        2: <Step2Parameters className="pb-64 desktop:pb-96 gap-8 px-2.5 desktop:px-10" />,
        3: <Step3Activities interests={formData.interests} moods={formData.moods} className="gap-8" />,
        4: <Step4Summary hasDescription={hasDescription} onCreateRoute={onCreateRoute} className="pt-20 pb-64 desktop:pb-105 px-2.5 desktop:px-10 gap-10" />,
    };

    return (
        <section className={`w-full flex flex-col min-h-80 ${className}`}>
            <div className={clsx(
                "w-full transition-all duration-300 ease-in-out",
                "*:w-full *:mx-auto *:flex *:flex-col *:relative"
            )}>
                {STEPS_MAP[currentStep] || STEPS_MAP[1]}
            </div>
        </section>
    );
};