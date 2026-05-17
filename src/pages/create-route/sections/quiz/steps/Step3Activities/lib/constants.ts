
import SpontaneousImg from '@/pages/create-route/sections/quiz/steps/Step3Activities/assets/images/spontaneous.png';
import ActiveImg from '@/pages/create-route/sections/quiz/steps/Step3Activities/assets/images/active.png';
import AdventureImg from '@/pages/create-route/sections/quiz/steps/Step3Activities/assets/images/adventure.png';
import RomanceImg from '@/pages/create-route/sections/quiz/steps/Step3Activities/assets/images/romance.png';
import InspirationImg from '@/pages/create-route/sections/quiz/steps/Step3Activities/assets/images/inspiration.png';
import RelaxImg from '@/pages/create-route/sections/quiz/steps/Step3Activities/assets/images/relax.png';
import type { Option } from '@/shared/components/ui/inputs/BaseSelect';

export const MOOD_OPTIONS: Option[] = [
    {
        id: 'spontaneous',
        label: 'Спонтанно',
        image: SpontaneousImg,
        bgColor: 'bg-background',
        textColor: 'text-text',
    },
    {
        id: 'romantic',
        label: 'Романтика',
        image: RomanceImg,
        bgColor: 'bg-background',
        textColor: 'text-text',
    },
    {
        id: 'party',
        label: 'Ищу движ',
        image: ActiveImg,
        bgColor: 'bg-background',
        textColor: 'text-text',
    },
    {
        id: 'inspiration',
        label: 'Вдохновиться',
        image: InspirationImg,
        bgColor: 'bg-background',
        textColor: 'text-text',
    },
    {
        id: 'explore',
        label: 'Приключение',
        image: AdventureImg,
        bgColor: 'bg-background',
        textColor: 'text-text',
    },
    {
        id: 'chill',
        label: 'Хочу просто отдохнуть',
        image: RelaxImg,
        bgColor: 'bg-background',
        textColor: 'text-text',
    },
];
