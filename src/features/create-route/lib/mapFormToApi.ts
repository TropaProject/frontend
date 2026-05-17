// features/create-route/lib/mapFormToApi.ts
import { BUDGET_MAP, TRANSPORT_DEFAULT } from "@/features/create-route/lib/constants";
import type { RouteFormData } from "@/features/create-route/model/store";
import type {
    GenerateDescriptionRequest,
    GenerateRouteRequest,
} from "@/shared/api/create-route/types";

export const mapFormToDescriptionRequest = (
    form: RouteFormData,
    coordinates: { lat: number; lng: number }
): GenerateDescriptionRequest => ({
    city_id: form.cityId!,
    interests: form.interests,
    mood: form.mood ? [form.mood] : [],
    time_of_day: form.timeOfDay!,
    duration_minutes: form.duration * 60,
    budget: BUDGET_MAP[form.budget] || "comfort",
    transport: TRANSPORT_DEFAULT,
    start_point: `${coordinates.lat}, ${coordinates.lng}`,
    description: form.comment || undefined,
});

export const mapFormToRouteRequest = (
    form: RouteFormData,
    coordinates: { lat: number; lng: number },
    gptDescription: string
): GenerateRouteRequest => ({
    city_id: form.cityId!,
    time_of_day: form.timeOfDay!,
    interests: form.interests,
    mood: form.mood ? [form.mood] : [],
    budget: BUDGET_MAP[form.budget] || "comfort",
    transport: TRANSPORT_DEFAULT,
    duration_minutes: form.duration * 60,
    start_point: `${coordinates.lat}, ${coordinates.lng}`,
    radius_km: form.radius,
    gpt_description: gptDescription,
    description: form.comment || undefined,
});