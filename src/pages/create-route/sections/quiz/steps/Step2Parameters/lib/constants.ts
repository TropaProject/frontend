// pages/create-route/sections/quiz/steps/Step2Parameters/lib/constants.ts
import MorningImg from '@/pages/create-route/sections/quiz/steps/Step2Parameters/assets/images/morning.png';
import DayImg from '@/pages/create-route/sections/quiz/steps/Step2Parameters/assets/images/day.png';
import EveningImg from '@/pages/create-route/sections/quiz/steps/Step2Parameters/assets/images/evening.png';
import NightImg from '@/pages/create-route/sections/quiz/steps/Step2Parameters/assets/images/night.png';
import type { Option } from '@/shared/components/ui/inputs/BaseSelect';

export const time_options: Option[] = [
    {
        id: 'morning',
        label: 'Утро',
        image: MorningImg,
        bgColor: 'bg-[#D1EFF7]',
        textColor: 'text-text'
    },
    {
        id: 'day',
        label: 'День',
        image: DayImg,
        bgColor: 'bg-[#BFE578]',
        textColor: 'text-text'
    },
    {
        id: 'evening',
        label: 'Вечер',
        image: EveningImg,
        bgColor: 'bg-[#7375DC]',
        textColor: 'text-background'
    },
    {
        id: 'night',
        label: 'Ночь',
        image: NightImg,
        bgColor: 'bg-[#3A3B70]',
        textColor: 'text-background'
    },
];

export const step2_text = {
    title: "Когда и сколько гуляем?",
    radius: {
        label: "Радиус прогулки",
        hintStart: "Насколько далеко сегодня ты готов отойти от стартовой точки?",
    },
    duration: {
        label: "Длительность прогулки",
        hintStart: "Время всего маршрута с учётом дороги и посещения локаций",
    }
} as const;

export const range_limits = {
    radius: { min: 1, max: 10, step: 1 },
    duration: { min: 1, max: 4, step: 1 },
    budget: { min: 1, max: 4, step: 1 },
} as const;

export const budget_text = {
    title: "Какой бюджет?",
    options: {
        1: "Держим себя в руках",
        2: "Можно себе позволить",
        3: "Хочу что-то интересное",
        4: "Живём один раз",
    }
} as const;

const radius_labels: Record<number, string> = {
    1: "По месту (0,5 км)",
    2: "Рядом (1 км)",
    3: "Недалеко (1,5 км)",
    4: "Чуть дальше, чем обычно (2 км)",
    5: "Приличная прогулка (2,5 км)",
    6: "Далеко (3 км)",
    7: "Долго и с душой (3,5 км)",
    8: "Марафон по городу (4 км)",
    9: "Уже считается приключением (4,5 км)",
    10: "Целое путешествие (5 км)",
};

export const getBudgetText = (val: number) => {
    return budget_text.options[val as keyof typeof budget_text.options] || "";
};

export const getDurationText = (val: number) => {
    const labels: Record<number, string> = { 1: 'час', 2: 'часа', 3: 'часа', 4: 'часа' };
    return `${val} ${labels[val] || 'часов'}`;
};

export const getRadiusText = (val: number) => {
    return radius_labels[val] || `${val} км`;
};
