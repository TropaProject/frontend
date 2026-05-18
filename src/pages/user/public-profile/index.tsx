// pages/user/public-profile/index.tsx
import UserAvatarAndNickname from "@/shared/components/ui/avatar/UserAvatarAndNickname";
import { ProfileStatsCard } from "@/pages/user/public-profile/ui/ProfileStatsCard";
import { ProfileRewardsCard } from "@/pages/user/public-profile/ui/ProfileRewardsCard";
import ProfileFavouriteCity from "@/pages/user/public-profile/ui/ProfileFavouriteCity";
import { useScreenSize } from "@/shared/hooks/useScreenSize";
import ProfileRoutesSlider from "@/pages/user/ui/ProfileRoutesSlider";
import { useNavigate, useParams } from "react-router-dom";
import { useUserById } from "@/entities/user/hooks/useUserQueries";
import { Loader } from "@/shared/lib/feedback/Loader";
import { FormError } from "@/shared/lib/feedback/FormError";
import { useUserStore } from "@/entities/user/model/store";
import { mapPublicUserToUI } from "@/entities/user/lib/mapPublicUserToUI";
import { mapStatisticsToCard } from "@/pages/user/public-profile/lib/mapStatisticsToCard";

const PublicProfilePage = () => {
    const { id } = useParams<{ id: string }>();
    const { isDesktop } = useScreenSize();
    const navigate = useNavigate();

    const { data: userData, isLoading, isError } = useUserById(Number(id));
    const { user: currentUser } = useUserStore();

    if (isLoading) return <Loader />;
    if (isError || !userData) return <FormError message="Пользователь не найден" />;

    if (userData.id === currentUser?.id) {
        navigate("/user/me");
        return null;
    }

    const mappedUserData = mapPublicUserToUI(userData);
    const statsCardData = mapStatisticsToCard(mappedUserData.statistics);

    return (
        <div className="flex w-full flex-col items-start relative sm:max-w-2/3 sm:mx-auto tablet:max-w-none">
            <h1 className="hidden">Профиль пользователя</h1>
            <div className="flex flex-col w-full gap-6 z-10">
                <UserAvatarAndNickname
                    textClasses="font-heading text-heading-sm tablet:text-heading-3xl text-secondary"
                    avatarSize={isDesktop ? "xl" : "lg"}
                    avatarStrokeColor="text-secondary"
                    user={mappedUserData.user}
                    to={`/user/${mappedUserData.user.id}`}
                    className="desktop:gap-4"
                />

                <div className="grid grid-cols-1 lg:grid-cols-16 lg:grid-rows-[auto_auto] desktop:grid-rows-1 gap-5 items-start">
                    <ProfileStatsCard 
                        stats={statsCardData}
                        className="justify-center lg:col-span-7 desktop:col-span-4 lg:row-span-1 desktop:max-h-max" 
                    />

                    <ProfileRewardsCard 
                        className="lg:col-span-9 desktop:col-span-9 lg:row-span-2 xs:pl-5 xs:pr-6 lg:px-0" 
                        columnsClassName="tablet:grid-cols-2 lg:grid-cols-1 desktop:grid-cols-2" 
                    />

                    <ProfileFavouriteCity 
                        cityName={mappedUserData.statistics.favouriteCity}
                        className="lg:col-span-7 desktop:col-span-3 lg:row-span-1" 
                    />
                </div>

                <ProfileRoutesSlider 
                    routes={mappedUserData.publicRoutes}
                    loading={false}
                />
            </div>
        </div>
    );
};

export default PublicProfilePage;