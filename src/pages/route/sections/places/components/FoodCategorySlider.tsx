// pages/route/sections/places/components/FoodCategorySlider.tsx
import BaseSlider from '@/shared/components/ui/sliders/BaseSlider'
import BaseCard from '@/shared/components/ui/cards/BaseCard'
import type { ActivityCategory } from '@/entities/activity-category/model/types'

interface FoodCategorySliderProps {
    categories: ActivityCategory[]
    className?: string
    onCategoryClick?: (category: ActivityCategory) => void
    hasError?: boolean
    errorMessage?: string
}

export default function FoodCategorySlider({
    categories,
    className,
    onCategoryClick,
    hasError,
    errorMessage,
}: FoodCategorySliderProps) {
    return (
        <div className="relative flex flex-col gap-4">
            {hasError && (
                <p className="text-red-500 text-sm text-center">
                    {errorMessage ?? "Не удалось добавить точку питания"}
                </p>
            )}
            <BaseSlider
                items={categories}
                className={className}
                showPagination
                swiperProps={{
                    spaceBetween: 0,
                    slidesPerView: 'auto',
                }}
                slideClassName="max-w-max h-auto! self-stretch!"
                renderItem={(category) => (
                    <BaseCard
                        title={category.title}
                        description={category.description}
                        image={category.image}
                        onClick={() => onCategoryClick?.(category)}
                        className="max-w-80 h-full"
                    />
                )}
            />
        </div>
    )
}