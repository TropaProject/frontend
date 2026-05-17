// @/shared/components/ui/cards/BaseRewardsCard.tsx
import clsx from "clsx";
import RewardIcon from "@/shared/assets/icons/reward-icon.png";
import RewardsBg from "@/shared/components/ui/cards/BaseRewardsCard/backgrounds/RewardsBg";

interface Reward {
    readonly title: string;
    readonly description: string;
    readonly obtained: boolean;
}

interface BaseRewardsCardProps {
    title: string;
    rewards: readonly Reward[];
    columnsClassName?: string;
    className?: string;
    titleColor?: string;
}

export const BaseRewardsCard = ({
    title,
    rewards,
    columnsClassName = "grid-cols-1 desktop:grid-cols-2",
    className,
    titleColor = 'text-primary'
}: BaseRewardsCardProps) => {
    return (
        <section className={clsx(className, "flex flex-col w-full h-full relative desktop:max-w-max")}>
            <div className="relative z-10 flex flex-col h-full px-6 xs:px-4 lg:px-6 pt-12 pb-6 gap-3">
                <h2 className={clsx(titleColor, "text-heading-md! desktop:text-heading-lg!")}>
                    {title}
                </h2>

                <ul className={clsx("grid gap-4 tablet:gap-2 lg:gap-4", columnsClassName)}>
                    {rewards.map((reward, index) => (
                        <li key={index} className="flex flex-row gap-1 items-center w-full">
                            <img
                                src={RewardIcon}
                                alt="Иконка награды"
                                className={clsx(
                                    "max-w-12.5 desktop:max-w-20",
                                    !reward.obtained && "grayscale opacity-50"
                                )}
                            />
                            <div className="flex flex-col gap-1">
                                <span className="text-secondary text-body-sm desktop:text-body-lg">
                                    {reward.title}
                                </span>
                                <span className="text-body-xs text-secondary/60 desktop:text-body-xs">
                                    {reward.description}
                                </span>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            <RewardsBg
                className="absolute inset-0 z-0 w-full h-full"
                preserveAspectRatio="none"
            />
        </section>
    );
};