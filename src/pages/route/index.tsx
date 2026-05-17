// pages/route/ui/RouteDetailsPage.tsx
import { useParams } from "react-router-dom";
import { RouteHeroSection } from "@/pages/route/sections/hero";
import { RouteMapSection } from "@/pages/route/sections/map";
import { RoutePlacesSection } from "@/pages/route/sections/places";
import PageWrapper from "@/shared/components/wrappers/PageWrapper";
import { useRouteDetail, useEditRouteStatus, useRouteVisibility } from "@/entities/route/hooks/useRouteQueries";
import { mapRouteDetailToHero } from "@/entities/route/lib/mapRouteDetailToUI";
import { QueryStateWrapper } from "@/shared/lib/feedback/feedback/QueryStateWrapper";
import { useUserStore } from '@/entities/user/model/store';

const RouteDetailsPage = () => {
    const { id } = useParams<{ id: string }>();

    const { data: route, isLoading, isError, error, refetch } = useRouteDetail(id!);
    const editStatus = useEditRouteStatus();
    const visibility = useRouteVisibility();

    const { user: currentUser } = useUserStore();

    const isOwner = currentUser?.id === route?.author?.id

    return (
        <PageWrapper className="px-2.5 tablet:px-10 mb-20 sm:max-w-2/3 sm:mx-auto tablet:max-w-none relative">
            <QueryStateWrapper
                loading={{
                    isLoading,
                    config: { message: "Загрузка маршрута..." }
                }}
                error={{
                    isError,
                    raw: error,
                    config: {
                        fallbackMessage: "Не удалось загрузить маршрут",
                        onClick: () => { refetch(); }
                    }
                }}
                empty={{
                    isEmpty: !route,
                    config: { message: "Маршрут не найден" }
                }}
            >
                {route && (() => {
                    const mappedData = mapRouteDetailToHero(route);
                    return (
                        <div className="flex flex-col w-full">
                            <RouteHeroSection
                                originalRouteId={route.original_route_id}
                                routeId={route.route_id}
                                data={mappedData}
                                isOwner={route.is_owner}
                                isPublic={route.is_public}
                                onToggleVisibility={() =>
                                    visibility.mutate({
                                        route_id: route.route_id,
                                        is_public: !route.is_public,
                                    })
                                }
                                isTogglingVisibility={visibility.isPending}
                                onStart={() => editStatus.mutate({ route_id: route.route_id, status: "going" })}
                                onComplete={() => editStatus.mutate({ route_id: route.route_id, status: "done" })}
                                onCancel={() => editStatus.mutate({ route_id: route.route_id, status: "cancelled" })}
                                className="py-10 desktop:mt-10 mt-4 desktop:mb-6"
                            />

                            <RouteMapSection points={mappedData.coordinates} />

                            <RoutePlacesSection
                                createdAt={mappedData.createdAt}
                                routeId={route.route_id}
                                points={route.points}
                                isOwner={isOwner}
                                className="py-12 md:py-16"
                            />
                        </div>
                    );
                })()}
            </QueryStateWrapper>
        </PageWrapper>
    );
};
export default RouteDetailsPage;