import StatsCardSawBorder from "@/pages/user/public-profile/assets/StatsCardSawBorder";
import { BorderWrapper } from "@/shared/components/wrappers/BorderWrapper";
import clsx from "clsx";

interface ProfileStatsCardProps {
    stats: {
        count: number;
        distance: number;
        hours: number;
        minutes: number;
    };
    className?: string;
}

export const ProfileStatsCard = ({ stats, className }: ProfileStatsCardProps) => {
    const statsConfig = [
        {
            label: "Количество",
            value: stats.count,
            unit: "прогулок",
        },
        {
            label: "Пройдено",
            value: stats.distance,
            unit: "км",
        },
        {
            label: "В пути",
            customValue: (
                <>
                    {stats.hours}<span className="text-body-sm font-decoration ml-1 uppercase mr-2">ч</span>
                    {stats.minutes}
                </>
            ),
            unit: "мин",
        },
    ];

    return (
        <section className={clsx("flex flex-col w-full h-full desktop:max-w-max relative px-6 py-8 xs:px-10 tablet:px-12 tablet:py-12", className)}>
            <div className="flex flex-col z-20 gap-5">
                <h2 className="text-primary desktop:text-heading-lg!">статистика</h2>

                <ul className="grid grid-cols-3 desktop:grid-cols-1 gap-4">
                    {statsConfig.map((item, index) => (
                        <li key={index} className="flex flex-col gap-1">
                            <span className="text-5xl font-heading text-primary leading-none">
                                {item.customValue || item.value}
                                <span className="text-body-sm desktop:text-2xl font-decoration ml-1">
                                    {item.unit}
                                </span>
                            </span>
                            <span className="text-body-sm text-secondary/60">
                                {item.label}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>

            <BorderWrapper borderComponent={StatsCardSawBorder} className="z-0" />
        </section>
    );
};