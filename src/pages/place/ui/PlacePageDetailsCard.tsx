// pages/place/ui/PlacePageDetailsCard.tsx
import type { FullPlaceDetails } from "@/entities/place/model/types";
import PlaceFullDetailsCard from "@/entities/place/ui/PlaceFullDetailsCard";

interface PlacePageDetailsCardProps {
    place: FullPlaceDetails;
    isFavorite?: boolean;
    onToggleFavorite?: () => void;
}

export default function PlacePageDetailsCard({ place, isFavorite, onToggleFavorite }: PlacePageDetailsCardProps) {
    return (
        <div className="flex flex-col gap-6 w-full">
            <PlaceFullDetailsCard
                key={place.id}
                {...place}
                isFavorite={isFavorite}
                onToggleFavorite={onToggleFavorite}
            />
        </div>
    );
}