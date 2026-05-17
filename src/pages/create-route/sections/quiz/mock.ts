// mock.ts
import PlaceholderImg from '@/pages/create-route/sections/quiz/steps/Step1General/assets/images/moscow.jpg';

export const MOCK_CARDS = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    title: `Локация ${i + 1}`,
    description: "Короткое описание интересного места в городе",
    image: PlaceholderImg
}));

// Группируем по 5 для Step 3
export const STEP3_GROUPS = [
    MOCK_CARDS.slice(0, 5),
    MOCK_CARDS.slice(5, 10),
    MOCK_CARDS.slice(10, 15),
    MOCK_CARDS.slice(15, 20),
];

// Группа для Step 1
export const STEP1_GROUPS = [MOCK_CARDS.slice(0, 3)];