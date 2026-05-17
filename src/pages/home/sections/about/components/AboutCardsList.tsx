import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import AboutCard from "@/pages/home/sections/about/components/AboutCard";
import HomeAboutWind from "@/pages/home/sections/about/assets/visual/HomeAboutWind";
import HomeAboutBgDesktop from "@/pages/home/sections/about/assets/images/bg-desktop.jpg";
import { useScreenSize } from "@/shared/hooks/useScreenSize";

const ALL_CARDS_SETS = [
    [
        {
            title: (<span> Это прогулка, <br className="hidden sm:block" /> а не планирование </span>),
            description: 'Зачем сидеть неделю с картами и списками? Просто выходи и гуляй по готовому персональному маршруту!'
        },
        {
            title: (<span> Удобный <br className="hidden sm:block" /> личный кабинет </span>),
            description: 'Все маршруты собраны в одном месте. Прошёл, сохранил, понравилось — вернулся. Ничего не потеряется.'
        },
        {
            title: (<span> Изучай маршруты <br className="hidden sm:block" /> своих друзей </span>),
            description: 'Это не просто сервис. Это практически соцсеть! Смотри, где были другие, делись своими маршрутами и тихо соревнуйся в статистике'
        }
    ],
    [
        {
            title: (<span> Игра, в которой <br className="hidden sm:block" /> ты встаёшь с дивана </span>),
            description: 'Ты играешь в реальной жизни и получаешь награды за то, что вышел из дома'
        },
        {
            title: (<span> Узнай город <br className="hidden sm:block" /> по-новому </span>),
            description: 'Даже если ты тут живёшь сто лет — найдёшь места, куда раньше не доходил.'
        },
        {
            title: (<span> Можно гулять <br className="hidden sm:block" /> без интернета </span>),
            description: 'Паника отменяется, а вот прогулка — нет. Скачай маршрут и гуляй без интернета'
        }
    ]
];
export const AboutCardsList = () => {
    const [setIndex, setSetIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const containerRef = useRef<HTMLUListElement>(null);
    const lastScrollY = useRef(0);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 80,
        damping: 25,
        restDelta: 0.001
    });

    const { isDesktop } = useScreenSize();

    const windX = useTransform(smoothProgress, [0, 0.45, 0.6, 1], ["-100%", "0%", "15%", "20%"]);
    const windOpacity = useTransform(smoothProgress, [0, 0.2, 0.45, 0.55, 1], [0, 1, 1, 0, 0]);
    const windBlur = useTransform(smoothProgress, [0, 0.1, 0.5], ["blur(2px)", "blur(0px)", "blur(0px)"]);
    const windSkew = useTransform(smoothProgress, [0, 0.45, 0.6], [-15, -10, 0]);
    const windScaleX = useTransform(smoothProgress, [0, 0.45, 0.6], [0.8, 1.3, 1]);

    const triggerAnimation = (targetIndex: number) => {
        if (setIndex === targetIndex || isTransitioning) return;
        setIsTransitioning(true);

        setTimeout(() => {
            setSetIndex(targetIndex);
            setIsTransitioning(false);
        }, 600);
    };

    useEffect(() => {
        const handleScroll = () => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            const viewportCenter = window.innerHeight / (isDesktop ? 2.5 : 3);
            const currentScrollY = window.scrollY;
            const isScrollingDown = currentScrollY > lastScrollY.current;

            if (isScrollingDown && rect.top < viewportCenter && setIndex === 0) {
                triggerAnimation(1);
            } else if (!isScrollingDown && rect.top > viewportCenter && setIndex === 1) {
                triggerAnimation(0);
            }
            lastScrollY.current = currentScrollY;
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [setIndex, isTransitioning, triggerAnimation]);

    return (
        <ul
            ref={containerRef}
            className="relative min-h-68 flex flex-col items-start gap-2.5 xs:max-w-3/4 sm:max-w-none sm:grid sm:grid-cols-3 desktop:gap-6 w-full -mt-6 px-2.5 desktop:px-10 perspective-2000"
        >
            <AnimatePresence mode="wait">
                <motion.div
                    key={setIndex}
                    initial={false}
                    className="contents"
                >
                    {ALL_CARDS_SETS[setIndex].map((cardData, index) => (
                        <motion.div
                            key={`${setIndex}-${index}`}
                            initial={{ opacity: 0, y: 20, x: 10, rotate: -3, filter: "blur(8px)" }}
                            animate={{ opacity: 1, y: 0, x: 0, rotate: 0, filter: "blur(0px)" }}
                            exit={{ opacity: 0, y: 16, x: 8, rotate: -6, scale: 0.95, filter: "blur(10px)" }}
                            transition={{
                                duration: 0.4,
                                ease: [0.34, 1.56, 0.64, 1],
                                delay: index * 0.1
                            }}
                            className="z-20"
                        >
                            <AboutCard data={cardData} />
                        </motion.div>
                    ))}
                </motion.div>
            </AnimatePresence>

            <div className="absolute inset-0 pointer-events-none z-30 tablet:overflow-hidden">
                <div className="relative flex w-full h-full items-center">
                    <motion.div
                        style={{ x: windX, opacity: windOpacity, skewX: windSkew, scaleX: windScaleX, filter: windBlur }}
                        className="w-full relative will-change-transform"
                    >
                        <HomeAboutWind className="w-[50%] text-white/30" />
                        <motion.div
                            style={{
                                x: useTransform(smoothProgress, [0, 0.45], ["-10%", "5%"]),
                                opacity: useTransform(smoothProgress, [0, 0.4, 0.55], [0, 0.4, 0])
                            }}
                            className="w-[120%] absolute top-2 left-5 text-white/10 scale-y-75"
                        >
                            <HomeAboutWind />
                            <motion.div
                                style={{
                                    x: useTransform(smoothProgress, [0, 0.7], ["-10%", "5%"]),
                                    opacity: useTransform(smoothProgress, [0, 0.9, 0.55], [0, 0.9, 0])
                                }}
                                className="w-[90%] absolute -top-20 left-4 text-white/10 scale-y-90"
                            >
                                <HomeAboutWind />
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            <img
                src={HomeAboutBgDesktop}
                draggable={false}
                alt="About Background"
                className="z-10 absolute bottom-0 w-full max-w-max object-contain sm:flex hidden pointer-events-none"
            />
        </ul>
    );
};