// @/pages/home/sections/guide/components/HomeGuideCards.tsx

import { motion } from "framer-motion";
import BaseCard from "@/shared/components/ui/cards/BaseCard";
import HomeGuideCard1 from "@/pages/home/sections/guide/assets/images/home-guide-card (1).png";
import HomeGuideCard2 from "@/pages/home/sections/guide/assets/images/home-guide-card (2).png";
import HomeGuideCard3 from "@/pages/home/sections/guide/assets/images/home-guide-card (3).png";
import HomeGuideCard4 from "@/pages/home/sections/guide/assets/images/home-guide-card (4).png";
import HomeGuideCard5 from "@/pages/home/sections/guide/assets/images/home-guide-card (5).png";

const GUIDE_STEPS = [
    { title: "Шаг 1", description: "Ты регистрируешься", image: HomeGuideCard1 },
    { title: "Шаг 2", description: "В Личном кабинете жмёшь на кнопку «Новый маршрут»", image: HomeGuideCard2 },
    { title: "Шаг 3", description: "Выбираешь точку старта, настроение, бюджет, время суток и т.д.", image: HomeGuideCard3 },
    { title: "Шаг 4", description: "Я стараюсь изо всех сил и строю для тебя идеальный маршрут", image: HomeGuideCard4 },
    { title: "Шаг 5", description: "Готово! Ты идёшь гулять, а я, пожалуй, отдыхать", image: HomeGuideCard5 }
];

export default function HomeGuideCards() {
    return (
        <div className="grid grid-cols-3 lg:grid-cols-5 lg:*:col-span-1! gap-y-3 desktop:gap-x-5 w-full px-2.5 desktop:px-10 z-60 perspective-2000">
            {GUIDE_STEPS.map((step, index) => {
                return (
                    <motion.div
                        key={index}
                        initial={{
                            opacity: 0,
                            y: 40,
                            rotateY: index % 2 === 0 ? -15 : 15, // Чередуем наклон для "живости"
                            scale: 0.9
                        }}
                        whileInView={{
                            opacity: 1,
                            y: 0,
                            rotateY: 0,
                            scale: 1
                        }}
                        viewport={{
                            once: true, // Появляется один раз при скролле
                            amount: 0.2, // Сработает, когда 20% карточки в кадре
                            margin: "0px 0px -50px 0px"
                        }}
                        transition={{
                            duration: 0.8,
                            ease: [0.16, 1, 0.3, 1], // Плавный вылет (Out-Expo)
                            delay: index * 0.1 // Лесенка появления
                        }}
                        // Легкий интерактив при наведении (отличается от About)
                        whileHover={{
                            y: -8,
                            transition: { duration: 0.3 }
                        }}
                        className="col-span-2 even:col-start-2 odd:col-start-1"
                    >
                        <BaseCard
                            title={step.title}
                            description={step.description}
                            image={step.image}
                            borderColor="text-primary!"
                            borderType={index === 2 ? 'saw' : 'default'}
                        />
                    </motion.div>
                );
            })}
        </div>
    );
}