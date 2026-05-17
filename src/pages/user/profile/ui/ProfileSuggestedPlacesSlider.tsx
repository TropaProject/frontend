// pages/user/profile/ui/ProfileSuggestedPlacesSlider.tsx
import BaseSlider from "@/shared/components/ui/sliders/BaseSlider"
import { PlaceEntityCardContainer } from "@/entities/place/ui/PlaceEntityCardContainer"
import type { FavoritePointDTO } from "@/shared/api/point/types"
import type { HTMLAttributes } from "react"
import clsx from "clsx"

type Props = HTMLAttributes<HTMLElement> & {
    className?: string
    places: FavoritePointDTO[]
    loading?: boolean
}

const ProfileSuggestedPlacesSlider = ({ className, places, loading = false, ...props }: Props) => {
    return (
        <section className={clsx('flex flex-col w-full items-center gap-5 relative desktop:overflow-hidden', className)} {...props}>
            <BaseSlider
                title="Вайбовые места в любимом городе"
                items={places}
                loading={loading}
                loadingMessage="Загрузка мест..."
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
                        1280: { slidesPerView: 3 }
                    }
                }}
                navigationClassName="hidden tablet:flex"
                renderItem={(place) => (
                    <div className="w-full h-full flex">
                        <PlaceEntityCardContainer place={place} />
                    </div>
                )}
            />
        </section>
    )
}

export default ProfileSuggestedPlacesSlider