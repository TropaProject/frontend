// pages/place/ui/PlaceTargetAudience.tsx
import BgGeoRight from "@/shared/assets/backgrounds/BgGeoRight";
import { BaseBadge } from "@/shared/components/ui/badges/BaseBadge";

interface PlaceTargetAudienceProps {
    interests: string[];
    moods: string[];
}

export const PlaceTargetAudience = ({ moods, interests }: PlaceTargetAudienceProps) => {
    const allLabels = [...moods, ...interests];

    if (allLabels.length === 0) return null;

    return (
        <div className="flex flex-col w-full relative">
            <div className="flex flex-col w-full gap-5 z-10">
                <h2 className="text-heading-2xl! desktop:text-heading-lg text-primary">
                    Кому подойдёт
                </h2>
                <div className="flex flex-row gap-2.5 w-full flex-wrap">
                    {allLabels.map((label, index) => (
                        <BaseBadge key={`${label}-${index}`}>
                            {label}
                        </BaseBadge>
                    ))}
                </div>
            </div>
            <BgGeoRight className="absolute z-0 -right-28 -top-20 desktop:hidden" />
        </div>
    );
};