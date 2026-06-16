// entities/route/lib/mapRouteToEntityCard.ts
import type { RouteListItem } from '@/shared/api/user/types';
import type { EntityCardProps } from '@/shared/components/ui/cards/EntityCard/types';
import LoveIcon from '@/shared/components/ui/cards/EntityCard/assets/icons/LoveIcon';
import SunsetIcon from '@/shared/components/ui/cards/EntityCard/assets/icons/SunsetIcon';

const STATUS_LABELS: Record<string, string> = {
    going: 'Активный',
    done: 'Пройден',
    cancelled: 'Отменён',
};

const TAG_LABELS: Record<string, string> = {
    romantic: 'Романтика',
};

const BEST_TIME_LABELS: Record<string, string> = {
    morning: 'Утро',
    afternoon: 'День',
    evening: 'Вечер',
    night: 'Ночь',
    any: 'В любое время',
};

const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins} мин`;
    if (mins === 0) return `${hours} ч`;
    return `${hours} ч ${mins} мин`;
};

const DefaultIcon = LoveIcon({ className: 'size-4.5 text-text' });
const EveningIcon = SunsetIcon({ className: 'size-4.5 text-text' });

export const mapRouteToEntityCard = (route: RouteListItem): EntityCardProps => {
    const tags: EntityCardProps['tags'] = [];

    if (route.tag) {
        const label = TAG_LABELS[route.tag] ?? route.tag;

        tags.push({
            icon: DefaultIcon,
            label,
        });
    }

    if (route.best_visit_time) {
        const label = BEST_TIME_LABELS[route.best_visit_time] ?? route.best_visit_time;
        tags.push({
            icon: EveningIcon,
            label,
        });
    }

    return {
        id: route.route_id,
        title: route.title || 'Без названия',
        description: route.description || STATUS_LABELS[route.status],
        image: route.image ?? '/place.jpg',
        city: route.city ?? undefined,
        price: route.total_cost != null && route.total_cost > 0
            ? `${route.total_cost.toLocaleString('ru-RU')} ₽`
            : route.total_cost === 0 ? 'Бесплатно' : undefined,
        schedule: formatDuration(route.total_duration),
        tags,
    };
};