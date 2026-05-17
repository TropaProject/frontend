// pages/user/profile/ui/ProfileSuggestedRoutesSlider.tsx
import BaseSlider from "@/shared/components/ui/sliders/BaseSlider"
import clsx from "clsx"
import type { HTMLAttributes } from "react"
import { RouteEntityCardContainer } from "@/entities/route/ui/RouteEntityCardContainer"
import type { PublicRouteDTO } from "@/shared/api/route/types"

type Props = HTMLAttributes<HTMLElement> & {
    className?: string
    routes: PublicRouteDTO[]
    loading?: boolean
}

const ProfileSuggestedRoutesSlider = ({ className, routes, loading = false, ...props }: Props) => {

    return (
        <section className={clsx('flex flex-col w-full items-center gap-5 relative desktop:overflow-hidden', className)} {...props}>
            <BaseSlider
                title="Маршруты, которые ты оценишь"
                items={routes}
                loading={loading}
                loadingMessage="Загрузка маршрутов..."
                showNavigation={true}
                showPagination={true}
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
                        1280: { slidesPerView: 3 }
                    }
                }}
                navigationClassName="hidden tablet:flex"
                renderItem={(route) => (
                    <div className="w-full h-full flex">
                        <RouteEntityCardContainer route={route} />
                    </div>
                )}
            />
        </section>
    )
}

export default ProfileSuggestedRoutesSlider