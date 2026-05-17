import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import HomeH2 from "@/pages/home/components/HomeH2"
import BannerBg from "@/pages/home/sections/banner/assets/backgrounds/BannerBg"
import BannerBgGrass from "@/pages/home/sections/banner/assets/backgrounds/BannerBgGrass"
import HomeBannerChickenMid from "@/pages/home/sections/banner/assets/visual/HomeBannerChickenMid"
import HomeBannerChickensLeft from "@/pages/home/sections/banner/assets/visual/HomeBannerChickensLeft"
import HomeBannerChickensRight from "@/pages/home/sections/banner/assets/visual/HomeBannerChickensRight"
import BaseButton from "@/shared/components/ui/buttons/BaseButton"

const HomeBanner = (props: React.HTMLAttributes<HTMLElement>) => {
    const description = 'Я бесплатно соберу прогулку, которая попадёт в самое сердечко'
    const sectionRef = useRef(null);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end start"]
    });

    const leftChickenY = useTransform(scrollYProgress, [0, 1], [0, 80]);
    const rightChickenY = useTransform(scrollYProgress, [0, 1], [0, 100]);
    const chickensScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

    const grassY = useTransform(scrollYProgress, [0, 1], [0, -80]);

    return (
        <section
            ref={sectionRef}
            className={`${props.className} w-full mx-auto flex flex-col items-center pb-26 px-2.5 relative z-30 overflow-hidden`}
        >
            <div className="relative flex flex-col w-full px-8 pt-14 pb-46 tablet:px-10 tablet:pt-12 xs:pb-36 desktop:px-22 desktop:pt-20 desktop:pb-54 mobile:max-w-[clamp(360px,70vw,1280px)] tablet:max-w-150 desktop:max-w-230">
                <div className="flex flex-col w-full items-center gap-3 desktop:gap-5 z-10">
                    <HomeH2 className="w-full text-primary! xs:hidden">
                        Залетай в нашу <br /> стаю и гуляй
                        <span className="text-end">по маршрутам,</span>
                        которые я уже <br /> проверил
                    </HomeH2>

                    <HomeH2 className="w-full text-primary! xs:flex hidden">
                        Залетай в нашу стаю <br />
                        <span className="text-end"> и гуляй по маршрутам,</span>
                        которые я уже проверил
                    </HomeH2>
                    <p className="text-body-sm desktop:text-body-lg text-text text-center max-w-48 desktop:max-w-none mt-1">
                        {description}
                    </p>

                    <BaseButton className="min-w-full desktop:min-w-0 w-full desktop:max-w-34.5 desktop:mt-1" >
                        Я с вами!
                    </BaseButton>
                </div>
                <BannerBg
                    className='absolute inset-0 mx-auto w-full h-full pointer-events-none object-cover'
                    preserveAspectRatio="none"
                />
            </div>

            <div className="flex flex-col w-full relative h-full max-h-max pb-44 desktop:pb-72">
                {/* Трава теперь анимированная */}
                <motion.div
                    style={{ y: grassY }}
                    className="absolute -left-2.5 -top-5 desktop:-top-0.5 min-w-[120%] desktop:min-w-full w-full h-full max-h-min pointer-events-none z-0"
                >
                    <BannerBgGrass
                        className='w-full h-full object-cover'
                        preserveAspectRatio="none"
                    />
                </motion.div>

                {/* Средняя: плавно появляется и стоит на месте */}
                <motion.div
                    initial={{ y: 20, opacity: 0, scale: 0.9 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.3, ease: "backOut" }}
                    className="absolute w-full max-w-20 desktop:max-w-32 desktop:translate-x-2 desktop:top-0 mx-auto inset-x-0 h-min -top-5 translate-x-1 -translate-y-1/2 z-10"
                >
                    <HomeBannerChickenMid />
                </motion.div>

                {/* Левые: летят вверх */}
                <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    style={{ y: leftChickenY, scale: chickensScale }}
                    className="absolute w-full max-w-40.5 desktop:max-w-120 desktop:bottom-40 -left-5 h-min bottom-14 z-20"
                >
                    <HomeBannerChickensLeft />
                </motion.div>

                {/* Правые: летят вверх быстрее */}
                <motion.div
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 1, delay: 0.6 }}
                    style={{ y: rightChickenY, scale: chickensScale }}
                    className="absolute w-full max-w-42 desktop:max-w-115 desktop:bottom-40 -right-2.5 h-min bottom-14 z-20"
                >
                    <HomeBannerChickensRight />
                </motion.div>
            </div>
        </section>
    )
}

export default HomeBanner