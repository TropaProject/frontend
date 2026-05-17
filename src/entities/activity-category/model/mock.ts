// entities/activity-category/model/mock.ts
import type { FoodInterestDTO } from "@/shared/api/route/types";

export const mockFoodInterests: FoodInterestDTO[] = [
    {
        id: "bars",
        label: "Выпить в баре",
        description: "Бары, коктейли, вечеринки, музыка, общение, ночная жизнь, алкогольные напитки."
    },
    {
        id: "coffee",
        label: "Зайти в кафешку",
        description: "Кофейни, ароматный кофе, десерты, уютная атмосфера, отдых, встречи, разговоры."
    },
    {
        id: "fine_dining",
        label: "Сходить в хороший ресторан",
        description: "Элегантные рестораны, изысканная кухня, дегустации, романтические ужины, гастрономический опыт."
    },
    {
        id: "food",
        label: "Вкусно поесть",
        description: "Еда, рестораны, кафе, вкусные блюда, гастрономия, кулинарные впечатления."
    },
    {
        id: "sweet",
        label: "Десерты",
        description: "Кондитерские, сладости, пирожные, мороженое, кафе, удовольствие от еды."
    },
    {
        id: "unusual_food",
        label: "Необычная еда",
        description: "Экзотические блюда, необычные вкусы, гастрономические открытия, рестораны, кулинарные эксперименты."
    },
];