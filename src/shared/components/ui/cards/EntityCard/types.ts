// shared/components/ui/cards/EntityCard/types.ts
import type { ReactNode } from 'react';
import type { ButtonVariant } from '@/shared/components/ui/buttons/BaseButton';

export interface EntityCardProps {
    id: string;
    title: string;
    description: string;
    image?: string;
    city?: string;

    // Время/график — строка с иконкой часов
    schedule?: string;

    // Цена — уже отформатированная строка ("1 200 ₽", "Бесплатно")
    price?: string;

    // Рейтинг
    rating?: number;
    reviewsCount?: string; // "15 отзывов" или "Без оценок"

    // Теги — готовые React-элементы
    tags?: Array<{ icon: ReactNode; label: string }>;

    // Кнопка
    button?: EntityCardButtonProps;
    border?: EntityCardBorderProps;

    className?: string
}

export interface EntityCardButtonProps {
    variant: ButtonVariant;
    title: string;
    onClick?: () => void;
    to?: string;
    className?: string;
}

export interface EntityCardBorderProps {
    color?: string;
    variant?: 'mobileSmall' | 'default';
}