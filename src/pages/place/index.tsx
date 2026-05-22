// pages/place/index.tsx
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import PlacePageDetailsCard from "@/pages/place/ui/PlacePageDetailsCard";
import { PlaceTargetAudience } from "@/pages/place/ui/PlaceTargetAudience";
import { ReviewCard } from "@/shared/components/ui/cards/ReviewCard";
import { ReviewForm } from "@/features/point-review";
import PageWrapper from "@/shared/components/wrappers/PageWrapper";
import { mapPointToAudience, mapPointToFullPlaceDetails } from "@/entities/place/lib/mapPointToFullPlaceDetails";
import { usePointDetail, usePointReviews } from "@/entities/place/hooks/usePointQueries";
import BaseButton from "@/shared/components/ui/buttons/BaseButton";
import { useState } from "react";
import { useFavoritePlacesStore } from "@/entities/place/model/favoritePlacesStore";
import { QueryStateWrapper } from "@/shared/lib/feedback/feedback/QueryStateWrapper";
import { useUserStore } from "@/entities/user/model/store";

const PlacePage = () => {
    const navigate = useNavigate();

    const { id } = useParams<{ id: string }>();
    const [reviewPage] = useState(1);
    const [showReviewForm, setShowReviewForm] = useState(false);

    const { data: point, isLoading, isError, error, refetch } = usePointDetail(id!);
    const { data: reviewsData } = usePointReviews(id!, reviewPage);

    const favoriteIds = useFavoritePlacesStore((s) => s.favoriteIds);
    const toggleFavorite = useFavoritePlacesStore((s) => s.toggleFavorite);
    const fetchFavorites = useFavoritePlacesStore((s) => s.fetchFavorites);

    const isAuth = useUserStore((s) => s.isAuth);

    const isFavorite = favoriteIds.includes(id!);

    useEffect(() => {
        if (isAuth) {
            fetchFavorites();
        }
    }, [fetchFavorites, isAuth]);

    const handleFavoriteToggle = () => {
        if (!isAuth) {
            navigate("/auth");
            return;
        }
        toggleFavorite(id!);
    };

    return (
        <PageWrapper className="pt-30 pb-40 relative px-2.5 desktop:px-10 desktop:pb-10">
            <QueryStateWrapper
                loading={{
                    isLoading,
                    config: { message: "Загрузка места..." }
                }}
                error={{
                    isError,
                    raw: error,
                    config: {
                        fallbackMessage: "Не удалось загрузить информацию о месте",
                        actionLabel: "Повторить",
                        onClick: () => { refetch(); }
                    }
                }}
                empty={{
                    isEmpty: !point,
                    config: { message: "Место не найдено" }
                }}
            >
                {point && (
                    <>
                        <h1 className="hidden">{point.name}</h1>

                        <div className="grid grid-cols-1 tablet:grid-cols-16 tablet:gap-x-6 w-full">
                            <div className="tablet:col-span-11 flex flex-col gap-20 tablet:gap-6 mb-20">
                                <PlacePageDetailsCard
                                    place={mapPointToFullPlaceDetails(point)}
                                    isFavorite={isAuth && isFavorite}
                                    onToggleFavorite={handleFavoriteToggle}
                                />

                                <PlaceTargetAudience
                                    moods={mapPointToAudience(point).moods}
                                    interests={mapPointToAudience(point).interests}
                                />
                            </div>

                            <div className="tablet:col-span-5 flex flex-col gap-6 w-full">
                                <h2 className="text-heading-2xl! desktop:text-heading-lg text-primary">
                                    Голоса с улицы
                                </h2>

                                {showReviewForm ? (
                                    <ReviewForm
                                        pointId={id!}
                                        onSuccess={() => setShowReviewForm(false)}
                                        onCancel={() => setShowReviewForm(false)}
                                    />
                                ) : (
                                    <BaseButton
                                        className="w-full max-w-none"
                                        onClick={() => {
                                            if (!isAuth) {
                                                navigate("/auth");
                                                return;
                                            }
                                            setShowReviewForm(true);
                                        }}
                                    >
                                        + Добавить отзыв
                                    </BaseButton>
                                )}
                                <ul className="grid grid-cols-1 xs:grid-cols-2 tablet:grid-cols-1 gap-2.5">
                                    {(reviewsData?.reviews ?? point.last_reviews).map((review) => (
                                        <ReviewCard
                                            userId={review.user_id}
                                            className="min-w-full max-w-none xs:min-w-0 xs:pl-4 xs:pr-3 sm:pl-6 sm:pr-5"
                                            key={`${review.user_id}-${review.created_at}`}
                                            nickName={review.username}
                                            description={review.comment}
                                            rating={review.rating}
                                            date={new Date(review.created_at).toLocaleDateString("ru-RU")}
                                        />
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </>
                )}
            </QueryStateWrapper>
        </PageWrapper>
    );
};

export default PlacePage;
