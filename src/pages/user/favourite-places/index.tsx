// pages/user/favourite-places/index.tsx
import { useUserFavouritePlaces } from "@/entities/user/hooks/useUserQueries";
import { Loader } from "@/shared/lib/feedback/Loader";
import { FormError } from "@/shared/lib/feedback/FormError";
import { PlaceEntityCardContainer } from "@/entities/place/ui/PlaceEntityCardContainer";
import BaseButton from "@/shared/components/ui/buttons/BaseButton";
import { EmptyState } from "@/shared/lib/feedback/EmptyState";
import { useState } from "react";
import { FilterManager } from "@/widgets/FilterManager";

const PAGE_SIZE = 6;

const FavouritesGrid = ({ places }: { places: NonNullable<ReturnType<typeof useUserFavouritePlaces>['data']>['places'] }) => (
    <ul className="grid grid-cols-2 sm:grid-cols-3 tablet:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {places.map((place) => (
            <li key={place.id} className="flex h-full">
                <PlaceEntityCardContainer place={place} />
            </li>
        ))}
    </ul>
);

const UserFavouritePlacesPage = () => {
    const { data, isLoading, isError, isFetchingNextPage, hasNextPage, fetchNextPage } =
        useUserFavouritePlaces(PAGE_SIZE);

    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const places = data?.places ?? [];

    if (isLoading) {
        return <Loader message="Загрузка избранного..." className="min-h-80" />;
    }

    if (isError) return <FormError message="Не удалось загрузить избранное" />;

    return (
        <div className="flex flex-col gap-6 w-full animate-in fade-in duration-500">
            <h1 className="text-heading-2xl! text-secondary">
                Тут собраны все твои любимые локации
            </h1>

            <BaseButton
                onClick={() => setIsFilterOpen(true)}
                variant="tertiary"
                borderColor="border-secondary"
                title="Фильтры"
                size="xl"
                className="w-full max-w-none tablet:hidden"
            />

            <FilterManager
                type="mobile"
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
            />


            {places.length > 0 ? (
                <FavouritesGrid places={places} />
            ) : (
                <EmptyState
                    message="У тебя пока нет любимых мест :("
                    className="my-auto"
                />
            )}

            {hasNextPage && (
                <BaseButton
                    onClick={() => fetchNextPage()}
                    loading={isFetchingNextPage}
                    title="Больше локаций"
                    size="md"
                    className="w-full max-w-none desktop:max-w-1/3 desktop:mx-auto"
                />
            )}
        </div>
    );
};

export default UserFavouritePlacesPage;