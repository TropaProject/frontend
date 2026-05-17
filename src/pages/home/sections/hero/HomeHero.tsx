import HomeHeroArrowPillar from "@/pages/home/sections/hero/assets/HomeHeroArrowPillar"
import HomeHeroBg from "@/pages/home/sections/hero/assets/HomeHeroBg"
import HomeHeroTree from "@/pages/home/sections/hero/assets/HomeHeroTree"
import HomeHeroDoveThoughts from "@/pages/home/sections/hero/assets/visual/HomeHeroDoveThoughts"
import HomeHeroDove from "@/pages/home/sections/hero/assets/images/home-hero-dove.png"
import LogoFull from "@/shared/assets/logos/LogoFull"
import BaseButton from "@/shared/components/ui/buttons/BaseButton"
import { useNavigate } from "react-router-dom"
import FloatingDove from "@/shared/assets/doves/FloatingDove"
import HomeHeroBenchWithCat from "@/pages/home/sections/hero/assets/visual/HomeHeroBenchWithCat"
import { useRef } from "react"
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

const description = 'Я строю маршруты по городу, чтобы ты не сидел с картами, списками и рекомендациями в соцсетях'

const HomeHero = (props: React.HTMLAttributes<HTMLElement>) => {
    const navigate = useNavigate();
    const sectionRef = useRef<HTMLElement>(null);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end start"]
    });

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    // Параллакс для Голубя (левый слой)
    const doveXScroll = useTransform(smoothProgress, [0, 1], [0, -150]);
    const doveYScroll = useTransform(smoothProgress, [0, 1], [0, -50]);

    // Параллакс для Столба (передний правый слой - двигается сильнее)
    const pillarYScroll = useTransform(smoothProgress, [0, 1], [0, -120]);
    const pillarXScroll = useTransform(smoothProgress, [0, 1], [0, 40]);

    // Параллакс для Лавки (дальний правый слой - двигается лениво)
    const benchYScroll = useTransform(smoothProgress, [0, 1], [0, -30]);
    const benchXScroll = useTransform(smoothProgress, [0, 1], [0, 20]);

    return (
        <section
            ref={sectionRef}
            className={`${props.className} overflow-hidden mx-auto w-full flex flex-col items-center pt-24 sm:pt-24 desktop:pt-36! desktop:pb-68 mb-24 sm:mb-0 relative`}
        >
            {/* Центральный контент */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                className="flex flex-col w-full items-center gap-5 desktop:gap-5 z-50 pb-24 sm:pb-64 pt-48 sm:pt-24 desktop:pb-30! desktop:pt-0!"
            >
                <LogoFull className="max-w-60 tablet:max-w-76 mx-auto" />
                <p className="text-body-sm tablet:text-body-lg desktop:text-body-lg leading-[1.1]! text-text text-center max-w-52 desktop:max-w-76 mt-2">
                    {description}
                </p>
                <BaseButton onClick={() => navigate(`/route/create`)} className="min-w-25 tablet:min-w-34">
                    Погнали!
                </BaseButton>
            </motion.div>

            {/* Слой с Деревом и Голубем */}
            <div className="flex w-full absolute max-w-desktop inset-0 -top-10 desktop:top-0 left-0 mx-auto z-20 pointer-events-none">
                <HomeHeroTree />

                <motion.div
                    initial={{ x: "-100vw", rotate: -10 }}
                    animate={{ x: 0, rotate: 0 }}
                    style={{ x: doveXScroll, y: doveYScroll }}
                    transition={{
                        x: { duration: 1.2, ease: [0.22, 1, 0.36, 1] },
                        rotate: { duration: 1.5, ease: "easeOut" }
                    }}
                    className="z-40 absolute top-2/7 right-0 -left-1 desktop:-left-4 desktop:top-[calc(1/5*100%-0.5rem)]"
                >
                    <FloatingDove
                        thoughts={<HomeHeroDoveThoughts />}
                        thoughtsClassName="absolute left-[calc(1/3*100%-0.5rem)] desktop:left-[calc(1/3*100%+1rem)] -top-3 z-0 -translate-y-1/2 desktop:-top-2"
                        doveClassName="w-full max-w-44 object-contain desktop:max-w-100 z-10"
                        doveSrc={HomeHeroDove}
                    />
                </motion.div>
            </div>

            {/* Лавка с котом — выезжает справа */}
            <motion.div
                initial={{ x: "100%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                style={{ x: benchXScroll, y: benchYScroll }}
                transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="absolute right-0 top-[calc(1/3*100%-1.25rem)] z-40 max-w-48 w-full desktop:max-w-max sm:flex hidden desktop:flex"
            >
                <HomeHeroBenchWithCat />
            </motion.div>

            {/* Столб со стрелками — падает сверху */}
            <motion.div
                initial={{ y: "-120%", rotate: 5 }}
                animate={{ y: 0, rotate: 0 }}
                style={{ x: pillarXScroll, y: pillarYScroll }}
                transition={{
                    y: { duration: 1.2, delay: 0.3, type: "spring", stiffness: 70, damping: 15 },
                    rotate: { duration: 1.5, delay: 0.3 }
                }}
                className="absolute top-1/4 sm:top-1/8 desktop:top-18! max-w-max w-full right-1 z-0 tablet:z-30 tablet:right-10.5 desktop:z-30 desktop:right-10.5"
            >
                <HomeHeroArrowPillar />
            </motion.div>

            <HomeHeroBg className="absolute bottom-0 desktop:-bottom-2 right-0 z-10 object-cover w-full max-h-min pointer-events-none" preserveAspectRatio="none" />
        </section>
    )
}

export default HomeHero