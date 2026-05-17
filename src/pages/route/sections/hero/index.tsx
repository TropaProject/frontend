// pages/route/sections/hero/index.tsx
import ClosedEyeIcon from '@/shared/assets/icons/ClosedEyeIcon';
import OpenedEyeIcon from '@/shared/assets/icons/OpenedEyeIcon';
import DownloadIcon from '@/shared/assets/icons/DownloadIcon';
import BaseButton from '@/shared/components/ui/buttons/BaseButton';
import UserAvatarAndNickname from '@/shared/components/ui/avatar/UserAvatarAndNickname';
import type { HTMLAttributes } from 'react';
import FeatherIcon from '@/pages/route/assets/icons/FeatherIcon';
import { BorderWrapper } from '@/shared/components/wrappers/BorderWrapper';
import RouteInfoBorder from '@/pages/route/sections/hero/assets/borders/RouteInfoBorder';
import RouteCardBg from '@/pages/route/sections/hero/assets/backgrounds/RouteCardBg';
import HeroTextCardBorder from '@/pages/route/sections/hero/assets/borders/HeroTextCardBorder';
import SawBorder from '@/shared/assets/borders/SawBorder';
import clsx from 'clsx';
import type { RouteHeroData } from '@/entities/route/lib/mapRouteDetailToUI';
import { Link } from 'react-router-dom';
import { buildYandexRouteUrl } from '@/shared/lib/formatYandexMapsLinks';
import { useCopyPublicRoute } from '@/entities/route/hooks/useRouteQueries';

interface RouteHeroSectionProps extends HTMLAttributes<HTMLElement> {
    data: RouteHeroData;
    routeId: string;
    originalRouteId?: string | null;
    isOwner?: boolean;
    isPublic?: boolean;
    onToggleVisibility?: () => void;
    isTogglingVisibility?: boolean;
    onStart?: () => void;
    onComplete?: () => void;
    onCancel?: () => void;
}

export const RouteHeroSection = ({
    data,
    routeId,
    originalRouteId,
    isOwner = true,
    isPublic = false,
    onToggleVisibility,
    isTogglingVisibility = false,
    onComplete,
    onCancel,
    className,
    onStart,
    ...props
}: RouteHeroSectionProps) => {
    const { mutate: copyPublicRoute, isPending: isCopying } = useCopyPublicRoute();

    const handleCopyRoute = () => {
        if (!routeId) return;
        copyPublicRoute({ route_id: routeId });
    };

    const metrics = [
        { value: data.totalMeters, label: 'Дистанция' },
        { value: data.totalCost, label: 'Бюджет' },
        { value: String(data.pointsCount), label: 'Точки' },
    ];

    const yandexUrl = buildYandexRouteUrl(data.coordinates);

    const statusLabel = data.status === 'going' ? 'Активен' : data.status === 'done' ? 'Пройден' : 'Отменён';


    return (
        <section className={clsx(className)} {...props}>
            <div className="w-full flex flex-col tablet:grid grid-cols-16 gap-6 grid-rows-2 tablet:grid-rows-1">
                <div className="w-full col-span-6 relative flex flex-col gap-6">
                    <FeatherIcon className="desktop:block hidden absolute left-10 -top-7 -translate-1/2 pointer-events-none" />

                    <div className="flex gap-2 order-2 w-full justify-between xs:justify-start tablet:order-1">
                        <BaseButton className="xs:min-w-32 sm:min-w-24 w-full h-12.5!">
                            {statusLabel}
                        </BaseButton>

                        <BaseButton leftIcon={<DownloadIcon />} className="w-full max-w-min h-12.5!" />

                        {isOwner && (
                            <BaseButton
                                leftIcon={isPublic ? <ClosedEyeIcon /> : <OpenedEyeIcon />}
                                className="xs:min-w-28 sm:min-w-24 w-full h-12.5!"
                                onClick={onToggleVisibility}
                                loading={isTogglingVisibility}
                                variant={isPublic ? 'primary' : 'secondary'}
                            >
                                {isPublic ? 'Скрыть' : 'Открыть'}
                            </BaseButton>
                        )}
                    </div>

                    <UserAvatarAndNickname
                        user={data.user}
                        to={`/user/${data.user.id}`}
                        avatarStrokeColor="text-text"
                        textClasses="text-text"
                        className="dekstop:order-2 order-1"
                    />

                    <div className="flex flex-col gap-3 order-3">
                        <h1 className="text-secondary!">{data.title}</h1>
                        <p className="text-xs text-text">
                            Дата создания {data.createdAt}
                            {data.publicUsesCount != null && data.publicUsesCount > 0 && (
                                <> · <span className="font-medium">{data.publicUsesCount}</span> {data.publicUsesCount === 1 ? 'человек' : data.publicUsesCount < 5 ? 'человека' : 'человек'} прошли</>
                            )}
                        </p>
                    </div>
                </div>

                <div className="flex items-center w-full desktop:mx-2 col-span-10 col-start-7 relative p-4 desktop:pr-40 text-text">
                    <BorderWrapper className="z-0" borderComponent={RouteInfoBorder} />
                    <RouteCardBg className="tablet:block hidden absolute -bottom-4 right-8 max-w-80 w-full h-full pointer-events-none z-0" />

                    <div className="p-4 tablet:px-1 lg:px-4 flex flex-col w-full lg:flex-row gap-2.5 tablet:gap-8">
                        <div className="flex flex-row w-full items-center tablet:items-start tablet:flex-col tablet:flex-1/3 gap-4">
                            <div className="flex flex-col tablet:gap-2.5 desktop:pl-8 z-10">
                                <h2 className="text-primary text-heading-sm! desktop:text-heading-lg!">{data.totalDuration}</h2>
                                <p className="font-normal text-body-sm! desktop:text-body-base leading-5 text-text">Длительность</p>
                            </div>

                            <div className="relative flex flex-row gap-4 desktop:gap-0 desktop:flex-col px-6 py-4 tablet:py-6 desktop:p-8 w-full max-w-max font-normal text-body-sm desktop:text-lg leading-5 text-text">
                                <p className="flex flex-col">
                                    <span>{data.walkTime}</span>
                                    <span className="text-body-xs desktop:text-sm">Время пешком</span>
                                </p>
                                <p className="flex flex-col">
                                    <span>{data.visitTime}</span>
                                    <span className="text-body-xs desktop:text-sm">Время на посещение</span>
                                </p>
                                <BorderWrapper borderComponent={SawBorder} />
                            </div>
                        </div>

                        <line className="z-20 border-r border-secondary desktop:block hidden" />

                        <div className="flex flex-col tablet:flex-2/3 desktop:max-w-85 gap-4 tablet:gap-6 desktop:gap-4">
                            <div className='flex flex-col gap-2 desktop:order-1 order-2'>
                                <BaseButton
                                    variant="secondary"
                                    className="max-w-none"
                                    as={Link}
                                    to={yandexUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Открыть в Яндекс.Картах
                                </BaseButton>
                                {!isOwner && (
                                    <BaseButton
                                        variant="primary"
                                        className="max-w-none"
                                        onClick={handleCopyRoute}
                                        loading={isCopying}
                                    >
                                        Скопировать маршрут к себе
                                    </BaseButton>
                                )
                                }
                                {isOwner && originalRouteId && (
                                    <BaseButton
                                        variant="secondary"
                                        className="max-w-none"
                                        as={Link}
                                        to={`/route/${originalRouteId}`}
                                    >
                                        Посмотреть оригинальный маршрут
                                    </BaseButton>
                                )}

                            </div>

                            <ul className="order-1 desktop:order-2 desktop:mt-auto *:bg-background *:rounded-xl *:flex *:flex-col *:p-4 *:relative *:w-full *:max-w-max *:sm:min-w-24 flex flex-row justify-between">
                                {metrics.map((metric, i) => (
                                    <li key={i}>
                                        <span className="text-body-sm desktop:text-lg">{metric.value}</span>
                                        <span className="text-body-xs desktop:text-sm">{metric.label}</span>
                                        <BorderWrapper borderComponent={HeroTextCardBorder} />
                                    </li>
                                ))}
                            </ul>

                            {isOwner && (
                                <div className="order-3 flex flex-row gap-4 *:flex-1 *:max-w-none justify-between">
                                    {data.status === 'done' || data.status === 'cancelled' ? (
                                        <BaseButton variant="primary" onClick={onStart}>Начать</BaseButton>
                                    ) : (
                                        <>
                                            <BaseButton variant="primary" onClick={onComplete}>Завершить</BaseButton>
                                            <BaseButton variant="secondary" onClick={onCancel}>Отменить</BaseButton>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};