// entities/activity-category/lib/mapFoodInterestToActivity.ts
import type { FoodInterestDTO } from "@/shared/api/route/types";
import type { ActivityCategory } from "@/entities/activity-category/model/types";
import SliderImage from '@/pages/route/assets/images/place-slider-img.jpg';

export const mapFoodInterestToActivity = (interest: FoodInterestDTO): ActivityCategory => ({
    id: interest.id,
    title: interest.label,
    description: interest.description,
    image: SliderImage,
});