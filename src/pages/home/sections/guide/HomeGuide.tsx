import HomeH2 from "@/pages/home/components/HomeH2"
import GuideContainerBackground from "@/pages/home/sections/guide/assets/background/GuideContainerBackground"
import GuideDoveBg from "@/pages/home/sections/guide/assets/background/GuideDoveBg"
import GuideDove from "@/pages/home/sections/guide/assets/images/home-guide-dove.png"
import HomeGuideDashedPath from "@/pages/home/sections/guide/assets/visual/HomeGuideDashedPath"
import HomeGuideDoveThoughts from "@/pages/home/sections/guide/assets/visual/HomeGuideDoveThoughts"
import HomeGuideCards from "@/pages/home/sections/guide/components/HomeGuideCards"
import FloatingDove from "@/shared/assets/doves/FloatingDove"
import { useScreenSize } from "@/shared/hooks/useScreenSize"
import { motion, useScroll, useSpring, useTransform } from "framer-motion"
import { useRef, useState } from "react"

const HomeGuide = (props: React.HTMLAttributes<HTMLElement>) => {
    const description = 'Тропа - это сервис для людей, а не для любителей планировать. Ты отвечаешь на пару вопросов, а я беру на себя всё остальное'
    const sectionRef = useRef<HTMLElement>(null);

    const [isDoveArrived, setIsDoveArrived] = useState(false);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    const { isDesktop, isTablet } = useScreenSize();

    // Определяем границы движения в зависимости от экрана
    // На мобилках (не desktop) голубь должен двигаться в меньшем диапазоне, чтобы не улетать
    const xRange = isDesktop ? [-40, 80] : isTablet ? [-10, 90] : [-5, 50];
    const yRange = isDesktop ? [0, -80] : [0, -40];

    // Один трансформ сразу в конечные координаты
    const doveX = useTransform(smoothProgress, [0, 1], xRange);
    const doveY = useTransform(smoothProgress, [0, 1], yRange);

    return (
        <section
            ref={sectionRef}
            id={props.id}
            className={`${props.className} flex flex-col relative desktop:pt-40 pt-28 sm:py-16 pb-24 desktop:pb-40 z-20`}
        >
            <div className="flex flex-col w-full z-20">
                <GuideDoveBg className="absolute right-0 top-0 z-10 w-full max-w-max desktop:pr-10" />

                <div className="relative flex flex-col w-full z-10 pl-5 desktop:pl-10 mb-8 desktop:mb-12.5">
                    <div className="w-full flex flex-col relative gap-4 desktop:gap-12.5">
                        <HomeH2 className="w-full text-background! max-w-2/5">
                            Как это <br className="block desktop:hidden" /> работает
                        </HomeH2>

                        <p className="text-body-sm desktop:text-body-lg text-background text-start w-full max-w-6/13">
                            {description}
                        </p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isDoveArrived ? 1 : 0 }}
                        className="w-11 h-100 z-50 bg-secondary absolute top-3 right-0 desktop:block hidden"
                    />
                    <motion.div
                        initial={{ x: isDesktop ? 150 : 80, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        viewport={{ once: true, amount: 0.3 }}
                        onAnimationComplete={() => setIsDoveArrived(true)}
                        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute z-40 sm:top-8 desktop:-top-20 right-0 desktop:right-5.5 -top-4"
                    >
                        <motion.div style={{ x: doveX, y: doveY }}>
                            <FloatingDove
                                thoughts={<HomeGuideDoveThoughts />}
                                thoughtsClassName="right-14 desktop:right-50 desktop:-top-4 -top-26 z-30 w-full max-w-max"
                                doveSrc={GuideDove}
                                doveClassName="desktop:w-full h-full max-w-53 desktop:max-w-120"
                                className="static"
                            />
                        </motion.div>
                    </motion.div>
                </div>

                <HomeGuideCards />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.5 }}
                className="w-full h-full absolute inset-0 z-10 desktop:px-10 py-20 desktop:pb-20 desktop:pt-11 pointer-events-none"
            >
                <HomeGuideDashedPath preserveAspectRatio="none" className="w-full h-full" />
            </motion.div>

            <GuideContainerBackground
                preserveAspectRatio="none"
                className="w-full h-full absolute inset-0 z-0"
            />
        </section>
    )
}

export default HomeGuide