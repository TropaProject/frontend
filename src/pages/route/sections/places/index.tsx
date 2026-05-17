// pages/route/sections/places/index.tsx
import BaseButton from '@/shared/components/ui/buttons/BaseButton';
import clsx from 'clsx';
import { useState, type HTMLAttributes } from 'react';
import type { RoutePointDTO } from '@/shared/api/route/types';
import RoutePlaceDetailsCardContainer from '@/pages/route/sections/places/components/RoutePlaceDetailsCardContainer';
import FoodCategorySlider from '@/pages/route/sections/places/components/FoodCategorySlider';
import { useAddFoodPoint, useFoodForm } from '@/entities/route/hooks/useRouteQueries';
import { mapFoodInterestToActivity } from '@/entities/activity-category/model/lib/mapFoodInterestToActivity';
import { mockFoodInterests } from '@/entities/activity-category/model/mock';
import { EmptyState } from '@/shared/lib/feedback/EmptyState';

interface RoutePlacesSectionProps extends HTMLAttributes<HTMLElement> {
    points: RoutePointDTO[];
    routeId: string;
    createdAt: string
    isOwner: boolean;
    onPointClick?: (pointId: string) => void;
}

export const RoutePlacesSection = ({ points, onPointClick, className, routeId, createdAt, isOwner, ...props }: RoutePlacesSectionProps) => {
    const [openFoodIndex, setOpenFoodIndex] = useState<number | null>(null);
    const [foodErrorIndex, setFoodErrorIndex] = useState<number | null>(null);
    const { data: foodInterests, isError: foodError } = useFoodForm();
    const addFoodPoint = useAddFoodPoint();

    const interests = foodError ? mockFoodInterests : (foodInterests ?? mockFoodInterests);
    const foodCategories = interests.map(mapFoodInterestToActivity);

    const handleRetry = (index: number) => {
        setFoodErrorIndex(null);
        setOpenFoodIndex(index);
    };

    return (
        <section className={clsx('bg-background w-full overflow-hidden', className)} {...props}>
            <div className="flex flex-col gap-4">
                {points.map((point, index) => (
                    <div key={point.id} className="flex flex-col gap-4">
                        <RoutePlaceDetailsCardContainer
                            place={{
                                id: point.id,
                                title: point.name,
                                description: point.description,
                                rating: point.average_rating,
                                reviewsCount: point.reviews_count,
                                image: point.image_url ?? undefined,
                                city: point.city ?? undefined,
                                badgeTypes: point.is_partner ? ['developers_choice'] : undefined,
                                verifiedDate: `Гоша проверил ${createdAt}`,
                            }}
                            onCardClick={onPointClick}
                        />

                        {isOwner && index < points.length && (
                            foodErrorIndex === index ? (
                                <EmptyState
                                    message="Не удалось добавить точку питания"
                                    actionLabel="Назад"
                                    onClick={() => handleRetry(index)}
                                />
                            ) : openFoodIndex === index ? (
                                <div className="flex flex-col gap-4">
                                    <FoodCategorySlider
                                        categories={foodCategories}
                                        onCategoryClick={(category) => {
                                            addFoodPoint.mutate(
                                                {
                                                    route_id: routeId,
                                                    between_index: index + 1,
                                                    interests: [category.id],
                                                },
                                                {
                                                    onSuccess: () => {
                                                        setOpenFoodIndex(null);
                                                        setFoodErrorIndex(null);
                                                    },
                                                    onError: () => {
                                                        setOpenFoodIndex(null);
                                                        setFoodErrorIndex(index);
                                                    },
                                                }
                                            );
                                        }}
                                        className="mt-2"
                                    />

                                    <BaseButton
                                        fullWidth
                                        variant="primary"
                                        onClick={() => setOpenFoodIndex(null)}
                                        disabled={addFoodPoint.isPending}
                                    >
                                        Готово!
                                    </BaseButton>
                                </div>
                            ) : (
                                <BaseButton
                                    fullWidth
                                    variant="secondary"
                                    onClick={() => setOpenFoodIndex(index)}
                                >
                                    + Зайти перекусить
                                </BaseButton>
                            )
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
};