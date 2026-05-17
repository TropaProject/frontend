// widgets/header/model/navigation.ts
import GeoIconSimple from '@/entities/place/ui/PlaceFullDetailsCard/assets/icons/GeoIconSimple';
import RoutesIcon from '@/widgets/header/assets/icons/RoutesIcon';
import SettingsIcon from '@/widgets/header/assets/icons/SettingsIcon';
import StatsIcon from '@/widgets/header/assets/icons/StatsIcon';
import UserIcon from '@/widgets/header/assets/icons/UserIcon';

export interface NavLinkItem {
    path: string;
    label: string;
    isHash?: boolean;
    icon?: React.FC<{ className?: string }>;
}

export const DEFAULT_LINKS: NavLinkItem[] = [
    { path: '/#advantages', label: 'Преимущества' },
    { path: '/#guide', label: 'Как это работает?' },
    { path: '/#reviews', label: 'Отзывы' },
    { path: '/faq', label: 'FAQ' },
    { path: '/#blog', label: 'Блог' },
];

export const USER_CABINET_LINKS: NavLinkItem[] = [
    { path: '/user/me', label: 'Моя страница', icon: UserIcon },
    { path: '/user/routes', label: 'Маршруты', icon: RoutesIcon },
    { path: '/user/favourite-places', label: 'Любимые места', icon: GeoIconSimple },
    { path: '/user/stats', label: 'Статистика', icon: StatsIcon },
    { path: '/user/settings', label: 'Настройки', icon: SettingsIcon },
];