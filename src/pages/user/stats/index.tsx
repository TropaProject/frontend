// pages/user/stats/index.tsx
import { ProfileStatsCardDetailed } from "@/pages/user/profile/ui/ProfileStatsCardDetailed";
import ProfileFavouriteCity from "@/pages/user/public-profile/ui/ProfileFavouriteCity";
import AdditionalStats from "@/pages/user/stats/ui/AdditionalStats";
import { StatsRewardCard } from "@/pages/user/stats/ui/StatsRewardCard";
import { useUserStatistics } from "@/entities/user/hooks/useUserQueries";
import { Loader } from "@/shared/lib/feedback/Loader";
import { FormError } from "@/shared/lib/feedback/FormError";

const UserStatsPage = () => {
    const { data: stats, isLoading, isError } = useUserStatistics();

    if (isLoading) return <Loader message="Загрузка статистики..." className="min-h-80" />;
    if (isError || !stats) return <FormError message="Не удалось загрузить статистику" />;

    return (
        <div className="flex flex-col gap-6 w-full animate-in fade-in duration-500">
            <h1 className="text-h2 text-secondary">Прогресс за всё время</h1>

            <div className="grid grid-cols-1 tablet:grid-cols-9 w-full gap-6 tablet:gap-2 lg:gap-6">
                <ProfileStatsCardDetailed
                    showAdditionalStats
                    stats={stats}
                    className="px-10 xs:px-14! sm:px-18! tablet:px-10! tablet:justify-center lg:px-12! tablet:col-span-5 lg:col-span-4"
                />

                <AdditionalStats
                    className="hidden tablet:flex tablet:col-span-2 lg:col-span-3 py-6"
                    data={{
                        totalCost: stats.total_cost,
                        uniquePlaces: stats.unique_places,
                    }}
                />

                <ProfileFavouriteCity
                    cityName={stats.favourite_city}
                    className="py-6 col-span-1 tablet:col-span-2 max-h-max pb-48 -mb-2 desktop:mt-0! desktop:pb-54 [&_img]:-bottom-10 desktop:[&_img]:min-w-90"
                />
            </div>

            <div className="flex flex-col w-full gap-4">
                <h2 className="text-heading-2xl! text-secondary mb-4">
                    Полученные награды
                </h2>
                <div className="grid grid-cols-1 xs:grid-cols-2 tablet:grid-cols-8 *:tablet:col-span-4 lg:grid-cols-9 *:lg:col-span-3 *:lg:max-w-max! gap-4 w-full">
                    <StatsRewardCard category="ROUTES" columnsClassName="grid-cols-1" />
                    <StatsRewardCard category="DEVELOPER_CHOICE" className="desktop:col-span-6!" />
                    <StatsRewardCard category="ROUTE_REVIEWS" columnsClassName="grid-cols-1" />
                    <StatsRewardCard category="PHOTO_REVIEWS" columnsClassName="grid-cols-1" />
                    <StatsRewardCard category="PLACE_REVIEWS" columnsClassName="grid-cols-1" />
                </div>
            </div>
        </div>
    );
};

export default UserStatsPage;