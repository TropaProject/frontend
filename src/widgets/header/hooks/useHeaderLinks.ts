// widgets/header/lib/useHeaderLinks.ts
import { useLocation } from 'react-router-dom';
import { useScreenSize } from '@/shared/hooks/useScreenSize';
import { DEFAULT_LINKS, USER_CABINET_LINKS, type NavLinkItem } from '@/widgets/header/model/navigation';

export const useHeaderLinks = () => {
    const { pathname } = useLocation();
    const { isMobile } = useScreenSize();

    // Проверяем: начинается с /user, но НЕ /user/:id (где id - цифры или UUID)
    // Регулярка проверяет, что после /user/ идет me, routes и т.д., а не просто id
    const isUserCabinet = pathname.startsWith('/user') &&
        !/^\/user\/\d+$/.test(pathname) &&
        pathname !== '/user';

    const mobileLinks: NavLinkItem[] = isUserCabinet ? USER_CABINET_LINKS : DEFAULT_LINKS;
    const desktopLinks: NavLinkItem[] = DEFAULT_LINKS;

    return isMobile ? mobileLinks : desktopLinks;
};