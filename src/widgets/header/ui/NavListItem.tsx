import { NavLink } from '@/shared/components/ui/buttons/NavLink';
import NavLinkBottomLine from '@/widgets/header/assets/borders/NavLinkBottomLine';
import type { NavLinkItem } from '@/widgets/header/model/navigation';
import clsx from 'clsx';
import { Link } from 'react-router-dom';

interface Props {
    route: NavLinkItem;
    isActive: boolean;
    isLast: boolean;
    onClick: () => void;
}

export const NavListItem = ({ route, isActive, isLast, onClick }: Props) => {
    const Icon = route.icon;

    if (route.path.startsWith('/#')) {
        return (
            <li className='flex flex-col w-full'>
                <NavLink
                    href={route.path}
                    onClick={onClick}
                    className={clsx(
                        "text-body-lg px-3 py-3 flex gap-2 items-center w-full transition-colors",
                        isActive ? "text-background/70" : "text-background"
                    )}
                >
                    {Icon && <Icon className="size-6" />}
                    {route.label}
                </NavLink>
                {!isLast && <NavLinkBottomLine className='w-full' preserveAspectRatio='none' />}
            </li>
        );
    }

    return (
        <li className='flex flex-col w-full'>
            <Link
                to={route.path}
                onClick={onClick}
                className={clsx(
                    "text-body-lg px-3 py-3 flex gap-2 items-center w-full transition-colors",
                    isActive ? "text-background/70" : "text-background"
                )}
            >
                {Icon && <Icon className="size-6" />}
                {route.label}
            </Link>
            {!isLast && <NavLinkBottomLine className='w-full' preserveAspectRatio='none' />}
        </li>
    );
};
