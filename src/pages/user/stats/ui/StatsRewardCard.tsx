// @/pages/user/stats/ui/StatsRewardCard.tsx
import { BaseRewardsCard } from "@/shared/components/ui/cards/BaseRewardsCard";
import { STATS_REWARDS, type RewardCategory } from "@/entities/reward/model/mock";

interface StatsRewardCardProps {
    category: RewardCategory;
    className?: string;
    columnsClassName?: string;
}

export const StatsRewardCard = ({ category, className, columnsClassName }: StatsRewardCardProps) => {
    const data = STATS_REWARDS[category];

    return (
        <BaseRewardsCard
            title={`Награды ${data.title}`}
            titleColor="text-secondary"
            rewards={data.items}
            className={className}
            columnsClassName={columnsClassName}
        />
    );
};