import { type HTMLAttributes } from 'react';
import { BorderWrapper } from '@/shared/components/wrappers/BorderWrapper';
import NewCitySawBorder from '@/pages/create-route/sections/quiz/assets/borders/NewCitySawBorder';

import {
    step2_text,
    range_limits,
    getDurationText,
    getRadiusText,
    getBudgetText,
    time_options,
    budget_text
} from '@/pages/create-route/sections/quiz/steps/Step2Parameters/lib/constants';

import Step2ParametersSelect from '@/pages/create-route/sections/quiz/steps/Step2Parameters/components/Step2ParametersSelect';
import Step2RangeField from '@/pages/create-route/sections/quiz/steps/Step2Parameters/components/Step2RangeField';
import DoveWithGlasses from "@/shared/assets/doves/dove-with-glasses.png"
import Step2ParametersDoveThoughts from '@/pages/create-route/sections/quiz/steps/Step2Parameters/assets/visual/Step2ParametersDoveThoughts';
import CreateRouteStepNavigation from '@/features/create-route/ui/CreateRouteStepNavigation';
import { useShallow } from 'zustand/shallow';
import { useCreateRouteStore } from '@/features/create-route/model/store';
import FloatingDove from '@/shared/assets/doves/FloatingDove';
import { useScrollToTop } from '@/shared/hooks/useScrollToTop';

interface Props extends HTMLAttributes<HTMLElement> {
    className?: string;
}

export const Step2Parameters = ({ className, ...props }: Props) => {
    useScrollToTop()

    const { timeOfDayId, duration, radius, budget } = useCreateRouteStore(
        useShallow((state) => ({
            timeOfDayId: state.formData.timeOfDay,
            duration: state.formData.duration,
            radius: state.formData.radius,
            budget: state.formData.budget,
        }))
    );
    const updateFormData = useCreateRouteStore((state) => state.updateFormData);

    const currentTimeOfDay = time_options.find(opt => opt.id === timeOfDayId);

    return (
        <section className={`${className} sm:max-w-2/3 sm:mx-auto tablet:max-w-none `} {...props}>
            <h2 className="text-primary leading-tight desktop:text-heading-3xl!">{step2_text.title}</h2>

            <div className="w-full grid grid-cols-1 tablet:grid-cols-16 tablet:*:first:col-span-6 desktop:*:first:col-span-5 gap-8">

                <Step2ParametersSelect
                    timeOfDay={currentTimeOfDay}
                    setTimeOfDay={(opt) => updateFormData({ timeOfDay: String(opt.id) })}
                />

                <FloatingDove
                    className='z-10 hidden static! tablet:flex col-span-2 col-start-7 desktop:col-start-6 mt-auto'
                    thoughts={<Step2ParametersDoveThoughts />}
                    thoughtsClassName='-left-8 desktop:left-0 -top-16 -translate-y-1/2'
                    doveSrc={DoveWithGlasses}
                    doveClassName='w-full h-full min-w-36 desktop:min-w-48 max-w-48'
                />

                <div className="relative flex flex-col gap-10 py-12 px-12 tablet:px-16 tablet:min-h-74! justify-center overflow-hidden tablet:col-start-10 desktop:col-start-9 tablet:col-span-9">
                    <Step2RangeField
                        {...step2_text.radius}
                        valueText={getRadiusText(radius)}
                        value={radius}
                        onChange={(val) => updateFormData({ radius: val })}
                        {...range_limits.radius}
                    />

                    <Step2RangeField
                        {...step2_text.duration}
                        valueText={getDurationText(duration)}
                        value={duration}
                        onChange={(val) => updateFormData({ duration: val })}
                        {...range_limits.duration}
                    />
                    <BorderWrapper borderComponent={NewCitySawBorder} />
                </div>
            </div>

            <div className="w-full flex flex-col gap-8 pr-20 tablet:pr-0 desktop:mb-20 relative">
                <h2 className="text-h1! font-bold uppercase text-primary leading-tight desktop:text-heading-3xl!">
                    {budget_text.title}
                </h2>
                <Step2RangeField
                    valueText={getBudgetText(budget)}
                    value={budget}
                    onChange={(val) => updateFormData({ budget: val })}
                    {...range_limits.budget}
                    className='desktop:items-end desktop:absolute w-full -bottom-8'
                />

                <FloatingDove
                    className='z-10 -right-4 bottom-1 tablet:hidden block'
                    thoughts={<Step2ParametersDoveThoughts />}
                    thoughtsClassName='right-6 -top-6 -translate-y-1/2'
                    doveSrc={DoveWithGlasses}
                    doveClassName='w-full h-full max-w-22'
                />

            </div>

            <CreateRouteStepNavigation />
        </section>
    );
};