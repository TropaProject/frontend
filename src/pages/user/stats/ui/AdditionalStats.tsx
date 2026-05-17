import WalletIcon from "@/entities/place/ui/PlaceFullDetailsCard/assets/icons/WalletIcon"
import ShellIcon from "@/pages/user/stats/assets/icons/ShellIcon"
import clsx from "clsx"

interface AdditionalStatsData {
    totalCost: number;
    uniquePlaces: number;
}

type Props = {
    className?: string;
    data: AdditionalStatsData;
}

const STATS_TEMPLATE = [
    {
        id: 'spent',
        title: 'Затрачено',
        unit: 'рублей',
        icon: WalletIcon,
    },
    {
        id: 'places',
        title: 'Уникальных мест',
        unit: 'локаций',
        icon: ShellIcon,
    },
] as const;

const AdditionalStats = ({ className, data }: Props) => {
    const values: Record<string, number> = {
        spent: data.totalCost,
        places: data.uniquePlaces,
    };

    return (
        <div className={clsx(className, "flex w-full justify-between tablet:flex-col tablet:gap-8")}>
            {STATS_TEMPLATE.map((item) => {
                const Icon = item.icon;

                return (
                    <div key={item.id} className="flex flex-col gap-0 tablet:gap-4">
                        <div className="text-primary flex items-center tablet:items-start tablet:flex-col lg:flex-row w-full gap-1 tablet:gap-2">
                            <Icon className='w-full h-full max-w-7 tablet:max-w-13.5 max-h-7 tablet:max-h-13.5' />
                            <h3 className="desktop:text-heading-lg!">{item.title}</h3>
                        </div>
                        <span className="text-5xl font-heading text-primary leading-none">
                            {values[item.id].toLocaleString('ru-RU')}
                            <span className="text-body-sm tablet:text-2xl font-decoration ml-1">
                                {item.unit}
                            </span>
                        </span>
                    </div>
                );
            })}
        </div>
    );
};

export default AdditionalStats;