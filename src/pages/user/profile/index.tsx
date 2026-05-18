// pages/user/profile/UserProfilePage.tsx
import UserAvatarAndNickname from "@/shared/components/ui/avatar/UserAvatarAndNickname";
import { ProfileRewardsCard } from "@/pages/user/public-profile/ui/ProfileRewardsCard";
import ProfileRoutesSlider from "@/pages/user/ui/ProfileRoutesSlider";
import BaseButton from "@/shared/components/ui/buttons/BaseButton";
import { Link } from "react-router-dom";
import { useScreenSize } from "@/shared/hooks/useScreenSize";
import ProfileSuggestedPlacesSlider from "@/pages/user/profile/ui/ProfileSuggestedPlacesSlider";
import ProfileSuggestedRoutesSlider from "@/pages/user/profile/ui/ProfileSuggestedRoutesSlider";
import { ProfileStatsCardDetailed } from "@/pages/user/profile/ui/ProfileStatsCardDetailed";
import VerifiedDateBadge from "@/shared/components/ui/badges/VerifiedDateBadge";
import { FormError } from "@/shared/lib/feedback/FormError";
import { useUserProfile, useUserStatistics, useRecommendedRoutes, useUserPublicRoutes } from "@/entities/user/hooks/useUserQueries";
import { Loader } from "@/shared/lib/feedback/Loader";
import { mockPlacesData } from "@/entities/place/model/mock";

const UserProfilePage = () => {
    const { isLg, isDesktop } = useScreenSize();

    const { data: user, isLoading: userLoading, isError: userError } = useUserProfile();
    const { data: stats, isLoading: statsLoading } = useUserStatistics();
    const { data: userPublicRoutesData, isLoading: userPublicRoutesLoading } = useUserPublicRoutes();
    const { data: recommendedRoutes, isLoading: recommendedLoading } = useRecommendedRoutes();

    const userPublicRoutes = userPublicRoutesData?.routes ?? [];
    const recommended = recommendedRoutes ?? [];

    if (userLoading || statsLoading || userPublicRoutesLoading) return <Loader />;

    if (userError || !user) {
        return <FormError message="Не удалось загрузить профиль" />;
    }

    return (
        <div className="flex flex-col w-full items-start relative gap-6 sm:max-w-2/3 sm:mx-auto tablet:max-w-none">
            <h1 className="hidden">Ваш профиль</h1>

            <VerifiedDateBadge
                verifiedDate={`Знакомы с ${new Date(user.date_joined).toLocaleDateString('ru-RU')}`}
                className="hidden tablet:block -top-8.5! right-0! *:*:first:pt-3 desktop:*:*:first:py-3!"
                borderColor="text-primary"
            />

            <div className="desktop:px-0 flex flex-col w-full gap-6 z-10">
                <UserAvatarAndNickname
                    textClasses="font-heading text-heading-sm tablet:text-heading-3xl text-secondary"
                    avatarSize={isLg || isDesktop ? "xl" : "lg"}
                    avatarStrokeColor="text-secondary"
                    user={user}
                    className="desktop:gap-4"
                />

                <BaseButton
                    as={Link}
                    to="/route/create"
                    title="Новый маршрут"
                    className="w-full max-w-none desktop:absolute desktop:max-w-44 desktop:right-0 desktop:top-10"
                />

                <div className="grid grid-cols-1 lg:grid-cols-9 desktop:grid-rows-1 gap-5 items-start">
                    {stats && (
                        <ProfileStatsCardDetailed
                            stats={stats}
                            className="justify-center lg:col-span-4 px-10 xs:px-14! sm:px-12! tablet:px-16! lg:px-12!"
                        />
                    )}

                    <div className="flex w-full h-full px-2.5 xs:px-0 desktop:px-0 lg:col-span-5">
                        <ProfileRewardsCard
                            rewardsCount={4}
                            className="xs:pl-3 xs:pr-6 px-4! [&_h2]:mb-4"
                            columnsClassName="grid-cols-1 tablet:grid-cols-2"
                        />
                    </div>
                </div>

                <ProfileRoutesSlider routes={userPublicRoutes} loading={userPublicRoutesLoading} />
            </div>

            <ProfileSuggestedPlacesSlider places={mockPlacesData} />
            <ProfileSuggestedRoutesSlider
                routes={recommended}
                loading={recommendedLoading}
            />
        </div>
    );
};

export default UserProfilePage;
