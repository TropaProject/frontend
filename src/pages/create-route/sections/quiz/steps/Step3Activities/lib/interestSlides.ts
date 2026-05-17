// features/create-route/lib/interestSlides.ts
import type { InterestDTO } from "@/shared/api/create-route/types";

// Изображения для каждого слайда (заглушки)
import CaseSlideImg from '@/pages/create-route/sections/quiz/steps/Step3Activities/assets/images/slides/case.jpg';
import WithWhomSlideImg from '@/pages/create-route/sections/quiz/steps/Step3Activities/assets/images/slides/with-whom.jpg';
import CultureSlideImg from '@/pages/create-route/sections/quiz/steps/Step3Activities/assets/images/slides/culture.jpg';
import WhereSlideImg from '@/pages/create-route/sections/quiz/steps/Step3Activities/assets/images/slides/where.jpg';

// Каждому ID интереса — своё изображение (заглушка слайда)
const INTEREST_IMAGES: Record<string, string> = {
    active_day: CaseSlideImg,
    nature_trip: CaseSlideImg,
    new_year: CaseSlideImg,
    spring_blossom: CaseSlideImg,
    holiday_valentine: CaseSlideImg,
    autumn: CaseSlideImg,

    group: WithWhomSlideImg,
    friend: WithWhomSlideImg,
    family: WithWhomSlideImg,
    couple: WithWhomSlideImg,
    events: WithWhomSlideImg,

    street_art: CultureSlideImg,
    modern_architecture: CultureSlideImg,
    monuments: CultureSlideImg,
    museums: CultureSlideImg,
    modern: CultureSlideImg,
    historical: CultureSlideImg,

    embankments: WhereSlideImg,
    photo_spots: WhereSlideImg,
    old_streets: WhereSlideImg,
    shopping: WhereSlideImg,
    parks: WhereSlideImg,
};

// Распределение ВСЕХ серверных ID по 4 слайдам из макета
const SLIDE_INDEX: Record<string, number> = {
    // Слайд 0: «Подходящий случай»
    active_day: 0,
    nature_trip: 0,
    new_year: 0,
    spring_blossom: 0,
    holiday_valentine: 0,
    autumn: 0,

    // Слайд 1: «С кем гуляем?»
    group: 1,
    friend: 1,
    family: 1,
    couple: 1,
    events: 1,

    // Слайд 2: «Культурная программа»
    street_art: 2,
    modern_architecture: 2,
    monuments: 2,
    museums: 2,
    modern: 2,
    historical: 2,

    // Слайд 3: «Куда тянет?»
    embankments: 3,
    photo_spots: 3,
    old_streets: 3,
    shopping: 3,
    parks: 3,
};

const SLIDE_TITLES: Record<number, string> = {
    0: "Подходящий случай",
    1: "С кем гуляем?",
    2: "Культурная программа",
    3: "Куда тянет?",
};

export interface InterestSlideItem extends InterestDTO {
    image: string;
}

export interface InterestSlide {
    title: string;
    interests: InterestSlideItem[];
}

export const buildInterestSlides = (interests: InterestDTO[]): InterestSlide[] => {
    const slidesMap: Record<number, InterestSlideItem[]> = {
        0: [],
        1: [],
        2: [],
        3: [],
    };

    for (const interest of interests) {
        const idx = SLIDE_INDEX[interest.id];
        if (idx === undefined) continue;

        slidesMap[idx].push({
            ...interest,
            image: INTEREST_IMAGES[interest.id] || WhereSlideImg,
        });
    }

    return Object.entries(slidesMap)
        .filter(([, items]) => items.length > 0)
        .map(([idx, items]) => ({
            title: SLIDE_TITLES[Number(idx)],
            interests: items,
        }));
};