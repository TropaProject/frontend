// pages/create-route/sections/quiz/steps/Step1General/index.tsx
import BaseCard from '@/shared/components/ui/cards/BaseCard';
import { useMemo, type HTMLAttributes } from 'react';
import type { CityDTO } from '@/shared/api/create-route/types';
import MoscowImg from '@/pages/create-route/sections/quiz/steps/Step1General/assets/images/moscow.jpg';
import SpbImg from '@/pages/create-route/sections/quiz/steps/Step1General/assets/images/spb.jpg';
import NewCityImg from '@/pages/create-route/sections/quiz/steps/Step1General/assets/images/new-city.jpg';
import PlusIcon from '@/pages/create-route/sections/quiz/assets/icons/PlusIcon';
import CreateRouteStepNavigation from '@/features/create-route/ui/CreateRouteStepNavigation';
import { useScrollToTop } from '@/shared/hooks/useScrollToTop';
import { useCreateRouteStore } from '@/features/create-route/model/store';
import { QuizSlider } from '@/pages/create-route/sections/quiz/components/QuizSlider';
import { Step1MapSection } from '@/pages/create-route/sections/quiz/steps/Step1General/ui/Step1MapSection';

interface Props extends HTMLAttributes<HTMLElement> {
    cities: CityDTO[];
    className?: string;
}

const CITY_IMAGES: Record<string, string> = {
    moscow: MoscowImg,
    petersburg: SpbImg,
};

export const Step1General = ({ cities, className, ...props }: Props) => {
    useScrollToTop();
    const { updateFormData, formData } = useCreateRouteStore();
    const selectedCityId = formData.cityId;

    const cityCards = useMemo(() => [
        ...cities.map((city) => ({
            id: city.id,
            title: city.name,
            description: city.description,
            image: CITY_IMAGES[city.id] || MoscowImg,
        })),
        {
            id: 'suggest_new',
            title: '',
            description: '',
            image: NewCityImg,
        },
    ], [cities]);

    return (
        <section className={`${className}`} {...props}>
            <div className="px-2.5 desktop:px-10">
                <QuizSlider
                    title="С чего начнем?"
                    groups={[cityCards]}
                    showNavigation
                    showPagination
                    titleClassName="text-primary"
                    renderCard={(card) => {
                        if (card.id === 'suggest_new') {
                            return (
                                <BaseCard
                                    image={NewCityImg}
                                    className="xs:pr-1.5! cursor-pointer xs:*:rounded-md xs:*:*:first:rounded-t-md sm:*:*:first:rounded-t-2xl sm:*:rounded-2xl tablet:pr-1! lg:pr-1.5!
                                    *:bg-[linear-gradient(178.05deg,_rgba(255,255,255,0)_21.2%,_rgba(255,255,255,0.8)_83.81%)]"
                                    borderColor="text-text"
                                    borderType="combined"
                                >
                                    <div className="z-100! absolute bottom-0 w-full pb-5 px-5 flex flex-row items-end justify-between">
                                        <h3 className="text-primary leading-[0.9]!">
                                            Расскажи какой город <br />
                                            должен стать следующим
                                        </h3>
                                        <PlusIcon />
                                    </div>
                                </BaseCard>
                            );
                        }
                        return (
                            <BaseCard
                                title={card.title}
                                description={card.description}
                                image={card.image}
                                borderColor={selectedCityId === card.id ? 'text-primary!' : 'text-text'}
                                className="h-full xs:pr-1.5! xs:*:rounded-md xs:*:*:first:rounded-t-md sm:*:*:first:rounded-t-2xl sm:*:rounded-2xl tablet:pr-1! lg:pr-1.5!"
                                onClick={() => {
                                    updateFormData({
                                        cityId: card.id as string,
                                    });
                                }}
                            />
                        );
                    }}
                />
            </div>

            <Step1MapSection />

            <CreateRouteStepNavigation />
        </section>
    );
};