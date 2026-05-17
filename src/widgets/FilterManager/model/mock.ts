export interface FilterOption {
    id: string;
    label: string;
}

export interface FilterSection {
    id: string;
    title: string;
    options: FilterOption[];
}

// Константы для переиспользования общих опций (города, интересы, настроение)
const CITIES: FilterOption[] = [
    { id: 'moscow', label: 'Москва' },
    { id: 'spb', label: 'Санкт-Петербург' },
];

const INTERESTS: FilterOption[] = [
    { id: 'parks', label: 'Парки' },
    { id: 'water', label: 'Пройтись у воды' },
    { id: 'old_streets', label: 'Старые улочки' },
    { id: 'photos', label: 'Красивые фотки' },
    { id: 'shopping', label: 'Шопинг' },
    { id: 'with_company', label: 'С компанией' },
    { id: 'with_friend', label: 'С другом' },
    { id: 'with_family', label: 'С семьёй' },
    { id: 'with_partner', label: 'С парой' },
    { id: 'party', label: 'Залететь на движ' },
    { id: 'active', label: 'Провести активный день' },
    { id: 'nature', label: 'Выбраться на природу' },
    { id: 'new_year', label: 'Новогодний вайб' },
    { id: 'autumn', label: 'Красота осени' },
    { id: 'love_day', label: 'День любви' },
    { id: 'gardens', label: 'Цветение и сады' },
    { id: 'street_art', label: 'Уличное искусство' },
    { id: 'modern_art', label: 'Современное искусство' },
    { id: 'modern_arch', label: 'Современная архитектура' },
    { id: 'classic_arch', label: 'Памятники архитектуры' },
    { id: 'museums', label: 'Музеи и выставки' },
    { id: 'history', label: 'Узнать историю города' },
];

const MOODS: FilterOption[] = [
    { id: 'spontaneous', label: 'Спонтанно' },
    { id: 'seeking_party', label: 'Ищу движ' },
    { id: 'adventure', label: 'Приключение' },
    { id: 'romance', label: 'Романтика' },
    { id: 'inspiration', label: 'Вдохновиться' },
    { id: 'relax', label: 'Хочу просто отдохнуть' },
];

// --- ФИЛЬТРЫ МАРШРУТОВ ---
export const ROUTE_FILTERS: FilterSection[] = [
    // {
    //     id: 'favorites',
    //     title: 'Избранные маршруты',
    //     options: [{ id: 'is_favorite', label: 'Показать избранное' }]
    // },
    {
        id: 'city',
        title: 'Город',
        options: CITIES
    },
    {
        id: 'interests',
        title: 'Интересы',
        options: INTERESTS
    },
    {
        id: 'mood',
        title: 'Настроение',
        options: MOODS
    },
    {
        id: 'time_of_day',
        title: 'Время суток',
        options: [
            { id: 'morning', label: 'Утро' },
            { id: 'day', label: 'День' },
            { id: 'evening', label: 'Вечер' },
            { id: 'night', label: 'Ночь' },
        ]
    },
    {
        id: 'status',
        title: 'Статус',
        options: [
            { id: 'active', label: 'Активные' },
            { id: 'completed', label: 'Завершенные' },
            { id: 'cancelled', label: 'Отмененные' },
        ]
    }
];

// --- ФИЛЬТРЫ ЛОКАЦИЙ ---
export const PLACE_FILTERS: FilterSection[] = [
    {
        id: 'city',
        title: 'Город',
        options: CITIES
    },
    {
        id: 'tags',
        title: 'Тэги',
        options: [
            { id: 'dev_choice', label: 'Выбор разработчиков' }
        ]
    },
    {
        id: 'interests',
        title: 'Интересы',
        options: INTERESTS
    },
    {
        id: 'mood',
        title: 'Настроение',
        options: MOODS
    }
];