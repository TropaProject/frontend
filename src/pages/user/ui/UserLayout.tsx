import { Outlet, Link, useLocation } from 'react-router-dom';
import PageWrapper from "@/shared/components/wrappers/PageWrapper";
import BgGeoLeft from '@/shared/assets/backgrounds/BgGeoLeft';
import BgGeoRight from '@/shared/assets/backgrounds/BgGeoRight';
import StatsHeroBg from '@/pages/user/stats/assets/backgrounds/StatsHeroBg';
import SettingsHeroBg from '@/pages/user/settings/assets/backgrounds/SettingsHeroBg';
import { BorderWrapper } from '@/shared/components/wrappers/BorderWrapper';
import SidebarLinkBorder from '@/pages/user/assets/borders/SidebarLinkBorder';
import clsx from 'clsx';
import TopSidebarLinkBorder from '@/pages/user/assets/borders/TopSidebarLinkBorder';
import { useScreenSize } from '@/shared/hooks/useScreenSize';
import { FilterManager } from '@/widgets/FilterManager';
import { USER_CABINET_LINKS } from '@/widgets/header/model/navigation';
import FloatingDove from '@/shared/assets/doves/FloatingDove';
import DoveWithGlasses from "@/shared/assets/doves/dove-with-glasses.png"
import { motion } from "framer-motion";
import ProfileRoutesSidebarDoveThoughts from '@/pages/user/routes/assets/visual/ProfileRoutesSidebarDoveThoughts';
import PublicProfileSidebarDoveThoughts from '@/pages/user/public-profile/assets/visual/PublicProfileSidebarDoveThoughts';
import ProfileSidebarDoveThoughts from '@/pages/user/profile/assets/visual/ProfileSidebarDoveThoughts';

export const UserLayout = () => {
    const { pathname } = useLocation();
    const { isAboveTablet } = useScreenSize();

    const isPublicProfile = /^\/user\/[^/]+$/.test(pathname) &&
        !['/user/me', '/user/routes', '/user/stats', '/user/settings', '/user/favourite-places'].includes(pathname);

    const isPrivateProfile = pathname === '/user/me';

    const isMyRoutes = pathname === '/user/routes';
    const isStats = pathname === '/user/stats';

    const shouldShowDove = isMyRoutes || isPublicProfile || isPrivateProfile || isStats;

    const renderBackground = () => {
        switch (pathname) {
            case '/user/stats':
                return <StatsHeroBg className="absolute top-12 tablet:top-8 w-full left-0 tablet:left-auto tablet:right-8 tablet:max-w-max right-0 mx-auto z-0" />;

            case '/user/settings':
                return <SettingsHeroBg className="absolute top-8 w-full left-0 tablet:left-auto tablet:right-8 tablet:max-w-max z-0" />;

            default:
                return (
                    <>
                        <BgGeoLeft className="absolute -left-4 tablet:right-30 tablet:-translate-x-[1] tablet:left-auto tablet:-top-10 -top-6 z-0" />
                        <BgGeoRight className="absolute -right-28 top-0 tablet:-top-10 z-0" />
                    </>
                );
        }
    };

    const isFilterablePage = pathname === '/user/favourite-places';
    const isUserRoutesPage = pathname === '/user/routes'
    return (
        <PageWrapper className="flex-row items-start z-100 px-2.5 tablet:px-10 pb-40 tablet:pt-20 relative overflow-hidden!">
            <aside className={clsx(isUserRoutesPage && 'mb-420 lg:mb-300', "hidden tablet:flex flex-col -mt-0.5 gap-2 w-45 shrink-0 rounded-2xl z-20 relative")}>
                <nav className="flex flex-col -space-y-4">
                    {USER_CABINET_LINKS.map((item, index) => {
                        const Icon = item.icon;

                        return (
                            <div
                                key={item.path}
                                className="transition-colors relative flex"
                            >
                                <Link
                                    to={item.path}
                                    className={clsx(index === 0 ? 'pt-4 pb-5.5' : 'py-5', 'px-5  flex h-full w-full gap-2 items-center text-text text-sm z-50 ')}
                                >
                                    {Icon && <Icon className="size-6" />}
                                    {item.label}
                                </Link>

                                <BorderWrapper className={`${pathname === item.path && index === 0 ? 'opacity-100' : ' opacity-0'} pt-[0.05rem] pr-[0.225rem] z-0`} borderComponent={TopSidebarLinkBorder} />
                                <BorderWrapper className={`${pathname === item.path && index !== 0 ? 'opacity-100' : ' opacity-0'} pr-[0.225rem] -top-2.5 min-h-[110%] z-0`} borderComponent={SidebarLinkBorder} />
                            </div>
                        )
                    })}
                </nav>

                {shouldShowDove && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5, y: 10, x: -100 }}
                        whileInView={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{
                            delay: 0.2,
                            type: "spring",
                            stiffness: 300,
                            damping: 20
                        }}
                        className="mt-56"
                    >
                        <FloatingDove
                            doveSrc={DoveWithGlasses}
                            thoughts={isPublicProfile ? <PublicProfileSidebarDoveThoughts /> : (isPrivateProfile || isStats) ? <ProfileSidebarDoveThoughts /> : <ProfileRoutesSidebarDoveThoughts />}
                            doveClassName='w-full max-w-27 -scale-x-100'
                            thoughtsClassName={isPublicProfile ? '-top-40 -left-8' : '-top-54 -left-10'}
                            className='static!'
                        />
                    </motion.div>
                )}

                {isFilterablePage && (
                    <FilterManager type="tablet" isOpen={true} />
                )}
            </aside>

            <section className={clsx(pathname === USER_CABINET_LINKS[0].path && 'tablet:rounded-tl-none',
                !isUserRoutesPage && 'overflow-hidden',
                "z-10 flex flex-1 tablet:-ml-[0.525rem] desktop:-ml-[0.45rem] tablet:p-6 tablet:pb-8 lg:p-8 lg:pb-10 max-w-screen-lg w-full min-h-96 relative tablet:bg-background tablet:border-2 tablet:border-primary tablet:rounded-3xl"
            )}>
                <div className='pt-30 tablet:pt-0 flex w-full z-10'>
                    <Outlet />
                </div>

                {isAboveTablet && renderBackground()}
            </section>

            {!isAboveTablet && renderBackground()}
        </PageWrapper >
    );
};