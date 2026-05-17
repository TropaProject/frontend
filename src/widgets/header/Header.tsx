import { useScreenSize } from '@/shared/hooks/useScreenSize';
import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

import UserAvatarAndNickname from '@/shared/components/ui/avatar/UserAvatarAndNickname';
import NavButton from '@/widgets/header/components/NavButton';
import BurgerMenuIcon from '@/widgets/header/assets/BurgerMenuIcon';
import Logo from '@/shared/assets/logos/Logo';
import HeaderBorder from '@/widgets/header/assets/borders/HeaderBorder';
import { BorderWrapper } from '@/shared/components/wrappers/BorderWrapper';
import type { User } from '@/entities/user/model/types';
import HeaderBorderFull from '@/widgets/header/assets/borders/HeaderBorderFull';
import BaseButton from '@/shared/components/ui/buttons/BaseButton';
import LogoutIcon from '@/widgets/header/assets/icons/LogoutIcon';
import UserIcon from '@/widgets/header/assets/icons/UserIcon';
import LoginIcon from '@/widgets/header/assets/icons/LoginIcon';
import { useHeader } from '@/widgets/header/hooks/useHeader';
import { useHeaderLinks } from '@/widgets/header/hooks/useHeaderLinks';
import { DEFAULT_LINKS } from '@/widgets/header/model/navigation';
import { NavListItem } from '@/widgets/header/ui/NavListItem';
import { NavLink } from '@/shared/components/ui/buttons/NavLink';

interface HeaderProps {
    user?: User | null;
    onLogin?: () => void;
    onRegister?: () => void;
    onLogout?: () => void;
    onMenuClick?: () => void;
    className?: string;
}

export function Header({ user, onLogin, onRegister, onLogout, onMenuClick, className }: HeaderProps) {
    const { isMobile, isAboveTablet } = useScreenSize();
    const { pathname } = useLocation();
    const links = useHeaderLinks();
    const { isMenuOpen, handleMenuToggle, closeMenu } = useHeader({ onMenuClick });

    const menuTransition = { duration: 0.4, ease: [0.4, 0, 0.2, 1] as const };

    return (
        <header className={`${className} relative bg-transparent px-0.5 pb-[0.2rem] xs:pb-1.5 tablet:pb-[0.2rem] w-full transition-all duration-300`}>
            <div className={clsx(
                "px-6 lg:min-h-15 flex items-center justify-between w-full bg-secondary z-40 relative rounded-b-3xl transition-all duration-300"
            )}>
                <div className="flex items-center gap-6 overflow-hidden">
                    <Link to='/' className="flex-shrink-0 py-3 lg:order-2 order-1 lg:absolute lg:left-1/2 lg:-translate-x-1/2">
                        <Logo />
                    </Link>

                    {isAboveTablet && (
                        <nav className="flex items-center gap-5 py-2 order-1">
                            {DEFAULT_LINKS.map((route) => {
                                if (route.path.startsWith('/#')) {
                                    return (
                                        <NavLink
                                            key={route.path}
                                            href={route.path}
                                            className="text-body-sm-medium transition-colors text-background"
                                        >
                                            {route.label}
                                        </NavLink>
                                    );
                                }
                                return (
                                    <Link
                                        key={route.path}
                                        to={route.path}
                                        className={clsx(
                                            "text-body-sm-medium transition-colors",
                                            pathname === route.path ? "text-background/70" : "text-background"
                                        )}
                                    >
                                        {route.label}
                                    </Link>
                                );
                            })}
                        </nav>
                    )}
                </div>

                {isAboveTablet && (
                    <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                        {user ? (
                            <>
                                <UserAvatarAndNickname user={user} onClick={() => closeMenu()} />
                                <NavButton onClick={onLogout}>Выйти</NavButton>
                            </>
                        ) : (
                            <>
                                <NavButton onClick={onRegister}>Регистрация</NavButton>
                                <NavButton onClick={onLogin} className="px-4 py-1.5">Войти</NavButton>
                            </>
                        )}
                    </div>
                )}

                {isMobile && (
                    <button type='button' onClick={handleMenuToggle} className="p-2 group z-50">
                        <BurgerMenuIcon className="transition-transform duration-300 group-active:scale-90" />
                    </button>
                )}

                <AnimatePresence>
                    {isMobile && isMenuOpen && (
                        <motion.div
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            transition={menuTransition}
                            className='absolute -bottom-2 z-10 h-6 bg-secondary right-[0.03rem] xs:right-[0.09rem] sm:right-0.75 w-full max-w-[calc(4/7*100%-0.35rem)] xs:max-w-[calc(4/7*100%-0.35rem)] sm:max-w-[calc(4/7*100%-0.5rem)] pointer-events-none'
                        />
                    )}
                </AnimatePresence>

                <BorderWrapper borderComponent={HeaderBorder} className='-top-1 min-h-[calc(100%+0.625rem)] -left-0.5 min-w-[calc(100%+0.25rem)] tablet:min-h-[calc(100%+0.5rem)]' />
            </div>

            <AnimatePresence mode="wait">
                {isMobile && isMenuOpen && (
                    <motion.div
                        key="mobile-menu"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={menuTransition}
                        className={clsx(
                            "right-0 ml-auto -mt-20 pt-20 z-30 flex-col w-4/7 bg-secondary rounded-br-2xl shadow-xl overflow-hidden static flex pointer-events-auto"
                        )}
                    >
                        <div className="flex flex-col justify-between min-h-[60dvh] pt-2 pb-12 gap-4 w-full">
                            <ul className="flex flex-col">
                                {links.map((route, i) => (
                                    <NavListItem
                                        key={route.path}
                                        route={route}
                                        isActive={pathname === route.path}
                                        isLast={i === links.length - 1}
                                        onClick={closeMenu}
                                    />
                                ))}
                            </ul>

                            <div className="flex flex-col w-full gap-2 justify-between px-4">
                                {user ? (
                                    <>
                                        <UserAvatarAndNickname user={user} onClick={() => closeMenu()} />
                                        <BaseButton
                                            onClick={() => { onLogout?.(); closeMenu(); }}
                                            title='Выйти'
                                            variant="tertiary"
                                            className='*:justify-start *:*:gap-1 w-full max-w-none text-body-sm!'
                                            leftIcon={<LogoutIcon className='size-4.5' />}
                                            size='lg'

                                        />
                                    </>
                                ) : (
                                    <>
                                        <BaseButton
                                            onClick={() => { onLogin?.(); closeMenu(); }}
                                            title='Войти'
                                            variant="tertiary"
                                            className='*:justify-start *:*:gap-1 w-full max-w-none text-body-sm!'
                                            leftIcon={<LoginIcon className='size-4.5' />}
                                            size='lg'

                                        />
                                        <BaseButton
                                            onClick={() => { onRegister?.(); closeMenu(); }}
                                            title='Зарегистрироваться'
                                            variant="tertiary"
                                            className='*:justify-start *:*:gap-1 w-full max-w-none text-body-sm!'
                                            leftIcon={<UserIcon className='size-4.5' />}
                                            size='lg'
                                        />
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isMobile && isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <BorderWrapper
                            borderComponent={HeaderBorderFull}
                            className='tablet:hidden text-text inset-0 ml-auto w-full min-h-[calc(100%+1.75rem)] max-w-4/7 xs:max-w-[calc(4/7*100%+0.25rem)] -top-7.5 z-10'
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}