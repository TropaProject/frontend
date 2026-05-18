// @/entities/reward/model/mock.ts

export const STATS_REWARDS = {
    ROUTES: {
        title: "За маршруты",
        items: [
            { title: "Первый выход из берлоги", description: "Первый маршрут", obtained: true },
            { title: "Подозрительная активность", description: "Третий маршрут", obtained: false },
            { title: "Мои сородичи уже узнают тебя", description: "Десятый маршрут", obtained: false },
        ]
    },
    DEVELOPER_CHOICE: {
        title: "За посещение локаций «Выбор разработчиков»",
        items: [
            { title: "Открытие года", description: "Первое посещение", obtained: true },
            { title: "Узнал секреты города", description: "5 локаций", obtained: false },
            { title: "Нашёл скрытые локации", description: "10 локаций", obtained: false },
            { title: "Видел больше, чем простые смертные", description: "20 локаций", obtained: false },
            { title: "Видел больше, чем простые смертные", description: "50 локаций", obtained: false },
            { title: "Вхожу в элиту тех, кто знает всё", description: "100 локаций", obtained: false },
        ]
    },
    ROUTE_REVIEWS: {
        title: "За отзывы на маршруты",
        items: [
            { title: "Скромняга", description: "Первый отзыв на маршрут", obtained: true },
            { title: "Знаток города", description: "Опубликовано 10 отзывов", obtained: false },
            { title: "Репортёр", description: "Опубликовано 50 отзывов", obtained: false },
            { title: "Помощник разработчиков", description: "Опубликовано 100 отзывов", obtained: false },
        ]
    },
    PHOTO_REVIEWS: {
        title: "За фотоотзывы на Локации",
        items: [
            { title: "Пруфы прилагаются", description: "Первый отзыв на маршрут", obtained: true },
            { title: "Сфоткал — значит был", description: "Опубликовано 10 отзывов", obtained: false },
            { title: "Легенда отзывов", description: "Опубликовано 50 отзывов", obtained: false },
            { title: "Неоспоримый авторитет", description: "Опубликовано 100 отзывов", obtained: false },
        ]
    },
    PLACE_REVIEWS: {
        title: "За отзывы на Локации",
        items: [
            { title: "Высказался", description: "Первый отзыв на локацию", obtained: true },
            { title: "Есть что сказать", description: "Опубликовано 10 отзывов", obtained: false },
            { title: "Комментатор по жизни", description: "Опубликовано 50 отзывов", obtained: false },
            { title: "Лидер мнений", description: "Опубликовано 100 отзывов", obtained: false },
        ]
    }
} as const;

export type RewardCategory = keyof typeof STATS_REWARDS;