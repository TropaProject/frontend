export interface FilterOption {
    id: string;
    label: string;
}

export interface FilterSection {
    id: string;
    title: string;
    options: FilterOption[];
}

export const MOCK_FILTERS: FilterSection[] = [
    {
        id: 'interests',
        title: 'Интересы',
        options: [
            { id: 'parks', label: 'Парки' },
            { id: 'water', label: 'Пройтись у воды' },
            { id: 'old_streets', label: 'Старые улочки' },
            { id: 'photos', label: 'Красивые фотки' },
            { id: 'shopping', label: 'Шопинг' },
            { id: 'company', label: 'С компанией' },
        ]
    }
];