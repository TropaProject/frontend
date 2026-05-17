import { motion } from "framer-motion";

import NotepadBackground from "@/pages/home/sections/advantages/assets/backgrounds/NotepadBackground"
import ComparisonContainerBackground from "@/pages/home/sections/advantages/assets/backgrounds/ComparisonContainerBackground"
import ListCheckIcon from "@/pages/home/sections/advantages/assets/icons/ListCheckIcon"
import CompilationImg1 from "@/pages/home/sections/advantages/assets/images/compilation-1.png"
import CompilationImg2 from "@/pages/home/sections/advantages/assets/images/compilation-2.png"
import TropaImg1 from "@/pages/home/sections/advantages/assets/images/tropa-1.png"
import TropaImg2 from "@/pages/home/sections/advantages/assets/images/tropa-2.png"

import ComparisonDove from "@/pages/home/sections/advantages/assets/images/comparison-dove.png"
import FloatingDove from "@/shared/assets/doves/FloatingDove"
import ComparisonDoveThoughts from "@/pages/home/sections/advantages/assets/visual/ComparisonDoveThoughts"
import HomeAdvantagesPaws from "@/pages/home/sections/advantages/assets/visual/HomeAdvantagesPaws"
import { useRef } from "react";
import ListCrossIcon from "@/pages/home/sections/advantages/assets/icons/ListCrossIcon";


type ComparisonCard = {
    id: string
    title: string
    images: {
        left: string
        right: string
        rightOffset?: string
        topOffset?: string
        topMargin?: string,
    }
    features: string[]
}

const comparisonCards: ComparisonCard[] = [
    {
        id: 'compilations',
        title: 'Подборки мест',
        images: {
            left: CompilationImg1,
            right: CompilationImg2,
            rightOffset: 'left-[43%]',
            topOffset: 'top-4',
        },
        features: [
            'Просто набор точек на карте',
            'Нужно самому понять подходит ли это место',
            'Нет готового маршрута и логистики',
            'Не поняно откуда начать и где закончить',
            'Сложно адаптировать под себя',
        ],
    },
    {
        id: 'tropa',
        title: 'Сервис «ТРОПА»',
        images: {
            left: TropaImg1,
            right: TropaImg2,
            rightOffset: 'left-[43%]',
            topOffset: 'top-3',
            topMargin: 'mt-3',
        },
        features: [
            'Минимум действий',
            'Продуманная логистика',
            'Экономит время и нервы',
            'Маршрут под тебя, а не «для всех»',
            'Атмосфера, а не просто точки на карте',
        ],
    },
]



const ComparisonCard = ({ card }: { card: ComparisonCard }) => {
    return (
        <li className="pl-4 py-6 desktop:pl-6 desktop:pt-12 relative">
            <div className="flex flex-col gap-1 desktop:gap-3 relative z-20">
                <div className={`relative w-full h-28 mt-2 ${card.images.topMargin}`}>
                    <div className="absolute left-0 top-0 w-1/2 h-full z-10">
                        <img
                            src={card.images.left}
                            alt={card.title}
                            className="w-full h-full object-contain"
                        />
                    </div>
                    <div className={`absolute ${card.images.rightOffset} ${card.images.topOffset} w-1/2 h-full z-20`}>
                        <img
                            src={card.images.right}
                            alt={card.title}
                            className="w-full h-full object-contain"
                        />
                    </div>
                </div>

                <h3 className="text-primary text-heading-sm! desktop:text-heading-lg!">
                    {card.title}
                </h3>

                <ul className="flex flex-col desktop:gap-1 desktop:pr-8 pr-4">
                    {card.features.map((feature, idx) => (
                        <li key={idx} className="inline-flex items-center">
                            {card.id === 'tropa' ? (
                                <ListCheckIcon className="size-5.5 desktop:size-7 text-primary flex-shrink-0 pb-0.5" />
                            ) : (
                                <ListCrossIcon className="size-5.5 desktop:size-7 text-primary flex-shrink-0 pb-0.5" />
                            )}
                            <span className="text-text text-body-sm desktop:text-body-lg">{feature}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <NotepadBackground
                className="absolute inset-0 w-full h-full z-0"
                preserveAspectRatio="none"
            />
        </li>
    )
}

const ComparisonCards = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    return (
        <div
            ref={containerRef}
            className="flex flex-col w-full relative pt-16 pb-48 sm:pb-28 sm:px-16 overflow-hidden"
        >
            <ul className="px-6 flex flex-col xs:mx-auto w-full xs:max-w-4/5 sm:max-w-none tablet:*:min-w-90 tablet:flex-row-reverse tablet:justify-between gap-2 z-20">
                {comparisonCards.map((card) => (
                    <ComparisonCard key={card.id} card={card} />
                ))}
            </ul>

            <motion.div
                initial={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
                whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{
                    duration: 1.5,
                    ease: "easeOut",
                    delay: 0.2
                }}
                className="absolute inset-0 z-10 top-6 desktop:top-0 pointer-events-none"
            >
                <HomeAdvantagesPaws className="w-full h-full" />
            </motion.div>

            <ComparisonContainerBackground
                preserveAspectRatio="none"
                className="w-full h-full absolute inset-0 z-0"
            />

            <FloatingDove
                className="w-full max-w-max -right-12 sm:right-0 lg:right-auto bottom-12 sm:bottom-6 desktop:-translate-x-7 sm:self-center z-50"
                thoughts={<ComparisonDoveThoughts />}
                thoughtsClassName="w-full max-w-22 z-20 -top-3 -translate-y-1/1 right-28 desktop:right-auto desktop:translate-y-0 desktop:-top-50 desktop:left-30 mx-auto"
                doveClassName="z-10 w-full max-w-58 desktop:max-w-116"
                doveSrc={ComparisonDove}
            />
        </div>
    )
}

export default ComparisonCards