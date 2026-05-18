// pages/user/routes/index.tsx
import AllRoutesHeading from "@/pages/user/routes/assets/visual/AllRoutesHeading";
import BaseButton from "@/shared/components/ui/buttons/BaseButton";
import BaseButtonBorder from "@/shared/components/ui/buttons/BaseButton/assets/borders/BaseButtonBorder";
import { BorderWrapper } from "@/shared/components/wrappers/BorderWrapper";
import { Loader } from "@/shared/lib/feedback/Loader";
import { FormError } from "@/shared/lib/feedback/FormError";
import { RouteEntityCardContainer } from "@/entities/route/ui/RouteEntityCardContainer";
import { RouteEntitySlider } from "@/entities/route/ui/RouteEntitySlider";
import { useUserActiveRoutes, useUserAllRoutes } from "@/entities/user/hooks/useUserQueries";
import { useScreenSize } from "@/shared/hooks/useScreenSize";
import clsx from "clsx";
import { Link } from "react-router-dom";
import type { RouteListItem } from "@/shared/api/user/types";
import { EmptyState } from "@/shared/lib/feedback/EmptyState";
import { FilterManager } from "@/widgets/FilterManager";
import { useState } from "react";

const PAGE_SIZE = 6;

const RoutesGrid = ({ className, routes }: { className?: string; routes: RouteListItem[] }) => (
    <ul className={clsx("grid grid-cols-2 lg:grid-cols-3 gap-2.5", className)}>
        {routes.map((route) => (
            <li key={route.route_id} className="h-full flex">
                <RouteEntityCardContainer route={route} />
            </li>
        ))}
    </ul>
);

const UserRoutesPage = () => {
    const { isAboveTablet } = useScreenSize();
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const {
        data: activeData,
        isLoading: activeLoading,
        isError: activeError,
        hasNextPage: activeHasMore,
        isFetchingNextPage: activeFetching,
        fetchNextPage: activeFetchNext,
    } = useUserActiveRoutes(PAGE_SIZE);

    const {
        data: allData,
        isLoading: allLoading,
        isError: allError,
        hasNextPage: allHasMore,
        isFetchingNextPage: allFetching,
        fetchNextPage: allFetchNext,
    } = useUserAllRoutes(PAGE_SIZE);

    const activeRoutes = activeData?.routes ?? [];
    const allRoutes = allData?.routes ?? [];

    if (activeLoading || allLoading) return <Loader message="Загрузка маршрутов..." className="min-h-80" />;
    if (activeError || allError) return <FormError message="Не удалось загрузить маршруты" />;

    return (
        <div className="flex flex-col gap-6 w-full animate-in fade-in duration-500 sm:max-w-2/3 sm:mx-auto tablet:max-w-none">
            {/* Активные маршруты */}
            <div className="flex flex-col gap-6 desktop:flex-row desktop:justify-between ">
                <h1 className="text-heading-2xl! text-secondary">Активные маршруты</h1>

                <div className="grid grid-cols-3 desktop:flex gap-2.5">
                    <span className="text-5xl font-heading safari-leading-12 text-primary col-span-1 h-full px-5 relative desktop:hidden">
                        {activeData?.totalCount ?? 0}
                        <span className="text-body-sm font-decoration ml-1">маршрутов</span>
                        <BorderWrapper borderComponent={BaseButtonBorder} />
                    </span>
                    <BaseButton
                        as={Link}
                        to="/route/create"
                        variant="primary"
                        borderColor="border-primary"
                        title="Новый маршрут"
                        size="xl"
                        className="w-full max-w-none col-span-2 desktop:min-w-54"
                    />
                </div>
            </div>

            <div className="flex flex-col w-full tablet:min-h-130 gap-6">
                {activeRoutes.length > 0 ? (
                <>
                    {isAboveTablet ? (
                        <>
                            <RoutesGrid routes={activeRoutes} />
                            {activeHasMore && (
                                <BaseButton
                                    onClick={() => activeFetchNext()}
                                    loading={activeFetching}
                                    title="Больше маршрутов"
                                    size="md"
                                    className="w-full max-w-none desktop:max-w-1/3 desktop:mx-auto"
                                />
                            )}
                        </>
                    ) : (
                        <>
                            <RouteEntitySlider
                                routes={activeRoutes}
                                className="flex px-0! h-full"
                                hasMore={activeHasMore}
                                onLoadMore={() => activeFetchNext()}
                                loadMoreLoading={activeFetching}
                                customBreakpoints={{
                                    360: { slidesPerView: 1.8 },
                                    600: { slidesPerView: 3.2 },
                                    640: { slidesPerView: 2.4 },
                                    768: { spaceBetween: 10 },
                                    1280: { slidesPerView: 4, spaceBetween: 20 },
                                }}
                            />
                        </>
                    )}
                </>
            ) : (
                <EmptyState message="У тебя пока нет активных маршрутов :(" className="my-auto" />
            )}
            </div>

            {/* Все маршруты */}
            <div className="w-full flex items-start justify-between relative">
                <h2 className="text-heading-2xl! text-secondary">Все маршруты</h2>
                <AllRoutesHeading pointerEvents="none" />

                <FilterManager type="tablet" isOpen={true} className="hidden! tablet:flex! w-45 shrink-0 absolute -left-6.75 top-0 h-full -translate-x-1/1" />
            </div>

            <BaseButton
                onClick={() => setIsFilterOpen(true)}
                variant="tertiary"
                borderColor="border-secondary"
                title="Фильтры"
                size="xl"
                className="w-full max-w-none flex tablet:hidden!"
            />

            <FilterManager
                type="mobile"
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
            />

            <div className="flex flex-col w-full tablet:min-h-130 gap-6 ">
                {allRoutes.length > 0 ? (
                <>
                    <RoutesGrid className="grid-cols-2" routes={allRoutes} />
                    {allHasMore && (
                        <BaseButton
                            onClick={() => allFetchNext()}
                            loading={allFetching}
                            title="Больше маршрутов"
                            size="md"
                            className="w-full max-w-none desktop:max-w-1/3 desktop:mx-auto"
                        />
                    )}
                </>
            ) : (
                <EmptyState message="Здесь пока ничего нет :(" className="my-auto"/>
            )}
            </div>
        </div>
    );
};

export default UserRoutesPage;