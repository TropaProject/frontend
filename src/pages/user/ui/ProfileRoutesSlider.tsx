// pages/user/ui/ProfileRoutesSlider.tsx
import BaseSlider from "@/shared/components/ui/sliders/BaseSlider";
import clsx from "clsx";
import type { RouteListItem } from "@/shared/api/user/types";
import type { HTMLAttributes } from "react";
import { RouteEntityCardContainer } from "@/entities/route/ui/RouteEntityCardContainer";

type Props = HTMLAttributes<HTMLElement> & {
    className?: string;
    routes: RouteListItem[];
    loading?: boolean;
};

const ProfileRoutesSlider = ({ className, routes, loading = false, ...props }: Props) => {
    return (
        <section className={clsx("flex flex-col w-full items-center gap-5 relative desktop:overflow-hidden", className)} {...props}>
            <BaseSlider
                title="Публичные маршруты"
                items={routes}
                loading={loading}
                loadingMessage="Загрузка маршрутов..."
                showNavigation
                showPagination
                titleClassName="text-secondary text-heading-2xl!"
                buttonBgColor="text-primary"
                arrowColor="text-white"
                slideClassName="min-w-50"
                swiperProps={{
                    spaceBetween: 6,
                    slidesPerView: 1.8,
                    breakpoints: {
                        440: { slidesPerView: 2.2 },
                        640: { slidesPerView: 3.2 },
                        1024: { slidesPerView: 4.2 },
                        1280: { slidesPerView: 3 },
                    },
                }}
                navigationClassName="hidden tablet:flex"
                renderItem={(route) => (
                    <div className="w-full flex h-full">
                        <RouteEntityCardContainer route={route} />
                    </div>
                )}
            />
        </section>
    );
};

export default ProfileRoutesSlider;