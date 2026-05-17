// shared/components/ui/NavLink.tsx
import type { ReactNode } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { scroller } from 'react-scroll';

interface NavLinkProps {
    href: string;
    children: ReactNode;
    className?: string;
    onClick?: () => void;
}

export const NavLink = ({ href, children, className, onClick }: NavLinkProps) => {
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (href.startsWith('/#')) {
            e.preventDefault();
            const sectionId = href.replace('/#', '');

            if (pathname !== '/') {
                navigate('/#' + sectionId);
                setTimeout(() => {
                    scroller.scrollTo(sectionId, {
                        smooth: true,
                        duration: 500,
                        offset: -80,
                    });
                }, 100);
            } else {
                scroller.scrollTo(sectionId, {
                    smooth: true,
                    duration: 500,
                    offset: -80,
                });
            }
            onClick?.();
        } else if (href.startsWith('#')) {
            e.preventDefault();
            const sectionId = href.replace('#', '');
            scroller.scrollTo(sectionId, {
                smooth: true,
                duration: 500,
                offset: -80,
            });
            onClick?.();
        } else {
            onClick?.();
        }
    };

    const toPath = href.startsWith('/#') ? '/' : href;

    return (
        <Link to={toPath} onClick={handleClick} className={className}>
            {children}
        </Link>
    );
};