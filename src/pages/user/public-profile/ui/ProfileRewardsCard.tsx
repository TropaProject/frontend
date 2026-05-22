import { BaseRewardsCard } from "@/shared/components/ui/cards/BaseRewardsCard";

const mockRewards = [
    { title: "Первый выход из берлоги", description: "Первый маршрут", obtained: true },
    { title: "Скромняга", description: "Первый отзыв на маршрут", obtained: true },
    { title: "Высказался", description: "Первый отзыв на посещённое место", obtained: true },
    { title: "Открытие года", description: "Первое посещение места с пометкой «Выбор разработчиков»", obtained: true },
    { title: "Высказался", description: "Первый отзыв на посещённое место", obtained: true },
    { title: "Открытие года", description: "Первое посещение места с пометкой «Выбор разработчиков»", obtained: true },
];

export const ProfileRewardsCard = ({ 
    className, 
    columnsClassName, 
    rewardsCount = 6,
    useMockData = false 
}: { 
    className?: string, 
    columnsClassName?: string, 
    rewardsCount?: number,
    useMockData?: boolean 
}) => {
    const realRewards: typeof mockRewards = [];
    
    const rewards = useMockData ? mockRewards.slice(0, rewardsCount) : realRewards;
    
    if (rewards.length === 0) {
        return (
            <BaseRewardsCard
                title="Последние награды"
                rewards={[]}
                className={className}
                columnsClassName={columnsClassName}
                emptyMessage="Пока нет наград"
            />
        );
    }
    
    return (
        <BaseRewardsCard
            title="Последние награды"
            rewards={rewards}
            className={className}
            columnsClassName={columnsClassName}
        />
    );
};