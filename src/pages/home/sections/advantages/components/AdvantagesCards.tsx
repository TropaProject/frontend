import { useEffect, useRef } from "react";
import { motion, useInView, useSpring, useTransform, animate, useScroll } from "framer-motion";
import CoolGuysBackground from "@/pages/home/sections/advantages/assets/backgrounds/CoolGuysBackground";
import GeoBackground from "@/pages/home/sections/advantages/assets/backgrounds/GeoBackground";
import RoutesBackground from "@/pages/home/sections/advantages/assets/backgrounds/RoutesBackground";
import CoolGuysIcon from "@/pages/home/sections/advantages/assets/icons/CoolGuysIcon";
import GeoIcon from "@/pages/home/sections/advantages/assets/icons/GeoIcon";
import RoutesIcon from "@/pages/home/sections/advantages/assets/icons/RoutesIcon";

const Counter = ({ value }: { value: string }) => {
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true });
    const numericValue = parseInt(value, 10);

    useEffect(() => {
        if (inView && ref.current) {
            const controls = animate(0, numericValue, {
                duration: 1,
                ease: "circOut",
                onUpdate: (latest) => {
                    if (ref.current) {
                        ref.current.textContent = Math.floor(latest).toString();
                    }
                },
            });
            return () => controls.stop();
        }
    }, [inView, numericValue]);

    return <span ref={ref}>0</span>;
};

const AdvantagesNumbers = () => {
    const containerRef = useRef<HTMLUListElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 150,
        damping: 10,
        restDelta: 0.001
    });

    const yNumbers = useTransform(smoothProgress, [0, 1], [50, -50]);

    const yStickers = useTransform(smoothProgress, [0, 1], [-40, 40]);

    return (
        <ul
            ref={containerRef}
            className="grid grid-cols-7 gap-x-6 grid-rows-10 tablet:flex tablet:flex-row tablet:justify-between w-full py-20 max-w-max sm:gap-16 desktop:gap-0 desktop:max-w-none mx-auto overflow-visible"
        >
            {advantages.map((advantage) => (
                <li
                    key={advantage.id}
                    className="tablet:nth-[2]:order-3 relative w-full max-w-max col-span-4 row-span-4 nth-[2]:row-start-7 nth-[2]:col-span-3 nth-[3]:row-start-5"
                >
                    <motion.div
                        style={{ y: yNumbers }}
                        className="font-heading text-[15.5rem] desktop:text-[27.5rem] text-[#FFD8DC] leading-[0.6] will-change-transform select-none"
                    >
                        <Counter value={advantage.number} />
                    </motion.div>

                    <motion.div
                        style={{ y: yStickers }}
                        className={`absolute ${advantage.position} font-decoration text-white text-sm desktop:text-2xl desktop:leading-6 leading-3.5 will-change-transform z-20`}
                    >
                        <div className="relative p-2 desktop:pl-2.5 desktop:py-2 flex flex-row items-start gap-2">
                            <div className="flex flex-row items-center gap-1 z-10 *:w-full!">
                                {advantage.icon}
                                <span className={`${advantage.textPadding}`}>
                                    {advantage.text} <br /> {advantage.description}
                                </span>
                            </div>
                            {advantage.background}
                        </div>
                    </motion.div>
                </li>
            ))}
        </ul>
    );
};

type Advantage = {
    id: string
    number: string
    icon: React.ReactNode
    background: React.ReactNode
    text: string
    description: string
    position: string
    textPadding?: string
}

const advantages: Advantage[] = [
    {
        id: 'geo',
        number: '5257',
        icon: <GeoIcon className="w-full h-full max-w-7 desktop:min-w-12.5 desktop:max-w-12.5" />,
        background: <GeoBackground className="absolute inset-0 w-full h-full z-0" preserveAspectRatio="none" />,
        text: 'точек на карте',
        textPadding: 'pt-0.5 desktop:py-3 flex-1 desktop:min-w-38',
        description: 'для твоей прогулки',
        position: 'right-0 bottom-1/5 translate-x-1/2'
    },
    {
        id: 'cool-guys',
        number: '347',
        icon: <CoolGuysIcon className="w-full max-w-7 desktop:max-w-12.5!" />,
        background: <CoolGuysBackground className="absolute inset-0 w-full h-full z-0" preserveAspectRatio="none" />,
        text: 'крутых ребят уже',
        textPadding: 'pt-3 pb-1.5 pl-0.5 pr-2 desktop:pt-4 desktop:min-w-38',
        description: 'пользуются тропой',
        position: 'translate-x-1/3 desktop:translate-x-2/5 left-0 -bottom-3',
    },
    {
        id: 'routes',
        number: '1925',
        icon: <RoutesIcon className="min-w-0 max-w-14.5 desktop:max-w-25!" />,
        background: <RoutesBackground className="absolute inset-0 w-full h-full z-0" preserveAspectRatio="none" />,
        text: 'построено',
        textPadding: 'pb-1 pl-0.5 pr-2 desktop:pl-1.5 desktop:pr-3',
        description: 'маршрутов',
        position: 'right-0 -top-2 desktop:-right-8 desktop:-top-5',
    },
];

export default AdvantagesNumbers;