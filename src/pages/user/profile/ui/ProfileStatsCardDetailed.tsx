import StatsCardDetailedSawBorder from "@/pages/user/public-profile/assets/StatsCardDetailedSawBorder";
import AdditionalStats from "@/pages/user/stats/ui/AdditionalStats";
import { BorderWrapper } from "@/shared/components/wrappers/BorderWrapper";
import type { UserStatistics } from "@/shared/api/user/types";
import clsx from "clsx";
import { LabeledRangeInput } from "@/shared/components/ui/inputs/LabeledRangeInput";

interface ProfileStatsCardDetailedProps {
    stats: UserStatistics;
    className?: string;
    showAdditionalStats?: boolean;
}

export const ProfileStatsCardDetailed = ({ stats, className, showAdditionalStats }: ProfileStatsCardDetailedProps) => {
    const hours = Math.floor(stats.total_duration_minutes / 60);
    const minutes = stats.total_duration_minutes % 60;
    const progressPercent = stats.total_routes > 0
        ? Math.round((stats.completed_routes / stats.total_routes) * 100)
        : 0;

    return (
        <section className={clsx("flex flex-col w-full justify-start h-full relative px-6 py-10 xs:px-10 xs:py-14 tablet:p-12", className)}>
            <div className="flex flex-col z-20 gap-3 tablet:gap-5">
                <h2 className="text-primary desktop:text-heading-lg!">Общая статистика</h2>

                <ul className="grid grid-cols-3 gap-4">
                    <li className="flex flex-col gap-1">
                        <span className="text-5xl font-heading text-primary leading-none">
                            {stats.total_routes}
                            <span className="text-body-sm desktop:text-2xl font-decoration ml-1">прогулок</span>
                        </span>
                        <span className="text-body-sm text-secondary/60">Количество</span>
                    </li>
                    <li className="flex flex-col gap-1">
                        <span className="text-5xl font-heading text-primary leading-none">
                            {stats.total_distance_km}
                            <span className="text-body-sm desktop:text-2xl font-decoration ml-1">км</span>
                        </span>
                        <span className="text-body-sm text-secondary/60">Пройдено</span>
                    </li>
                    <li className="flex flex-col gap-1">
                        <span className="text-5xl font-heading text-primary leading-none">
                            {hours}
                            <span className="text-body-sm font-decoration ml-1 uppercase mr-2">ч</span>
                            {minutes}
                            <span className="text-body-sm desktop:text-2xl font-decoration ml-1">мин</span>
                        </span>
                        <span className="text-body-sm text-secondary/60">В пути</span>
                    </li>
                </ul>

                <LabeledRangeInput
                    label="Прогресс"
                    valueText={`${progressPercent}%`}
                    value={stats.completed_routes}
                    min={0}
                    max={stats.total_routes}
                    hintStart={`${stats.active_routes} активных`}
                    hintEnd={`из ${stats.total_routes}`}
                />

                {showAdditionalStats && (
                    <AdditionalStats
                        className="flex tablet:hidden col-span-3 tablet:col-span-2 lg:col-span-3 pb-2"
                        data={{
                            totalCost: stats.total_cost,
                            uniquePlaces: stats.unique_places,
                        }}
                    />
                )}
            </div>

            <BorderWrapper borderComponent={StatsCardDetailedSawBorder} className="z-0" />
        </section>
    );
};