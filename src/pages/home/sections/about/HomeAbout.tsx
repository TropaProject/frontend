import { useRef } from "react"
import { motion, useScroll, useSpring, useTransform } from "framer-motion"
import HomeAboutBg from "@/pages/home/sections/about/assets/images/bg.png"
import HomeH2 from "@/pages/home/components/HomeH2"
import AboutRoadLeft from "@/pages/home/sections/about/assets/backgrounds/AboutRoadLeft"
import DoveWithGlasses from "@/shared/assets/doves/dove-with-glasses.png"
import HomeAboutDoveThoughts from "@/pages/home/sections/about/assets/visual/HomeAboutDoveThoughts"
import HomeAboutFeather from "@/pages/home/sections/about/assets/visual/HomeAboutFeather"
import AboutRoadRight from "@/pages/home/sections/about/assets/backgrounds/AboutRoadRight"
import FloatingDove from "@/shared/assets/doves/FloatingDove"
import HomeAboutFeatherDesktop from "@/pages/home/sections/about/assets/visual/HomeAboutFeatherDesktop"
import { AboutCardsList } from "@/pages/home/sections/about/components/AboutCardsList"
import HomeAboutFeatherDesktop2 from "@/pages/home/sections/about/assets/visual/HomeAboutFeatherDesktop2"

const HomeAbout = (props: React.HTMLAttributes<HTMLElement>) => {
    const sectionRef = useRef<HTMLElement>(null);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    const feather1X = useTransform(smoothProgress, [0, 1], [-50, 100]);
    const feather1Y = useTransform(smoothProgress, [0, 1], [-20, 60]);
    const feather1Rotate = useTransform(smoothProgress, [0, 1], [-5, 15]);

    const feather2X = useTransform(smoothProgress, [0, 1], [-30, 60]);
    const feather2Y = useTransform(smoothProgress, [0, 1], [0, 40]);
    const feather2Rotate = useTransform(smoothProgress, [0, 1], [10, -10]);
    return (
        <section
            ref={sectionRef}
            className={`${props.className} flex flex-col w-full items-center relative pb-25 desktop:pb-50`}
        >
            <div className="relative flex flex-col w-full gap-5 pb-52 sm:pb-16 desktop:pb-50 desktop:px-10 z-20">
                <HomeH2 className="z-10 px-2.5 desktop:px-0 lg:max-w-2/3 w-full desktop:max-w-full self-center">
                    <span className="self-start relative">
                        Тропа — <br className="sm:hidden flex" />
                        это не просто сервис.

                        <HomeAboutFeather className="absolute -bottom-1/2 left-4 desktop:hidden flex" />

                        <motion.div
                            style={{ x: feather1X, y: feather1Y, rotate: feather1Rotate }}
                            className="absolute -top-1/1 left-0 hidden desktop:flex pointer-events-none"
                        >
                            <HomeAboutFeatherDesktop />
                        </motion.div>

                        <motion.div
                            style={{ x: feather2X, y: feather2Y, rotate: feather2Rotate }}
                            className="absolute -top-1/1 left-22 -translate-y-2 hidden desktop:flex pointer-events-none opacity-80"
                        >
                            <HomeAboutFeatherDesktop2 />
                        </motion.div>
                    </span>

                    <span className="self-end relative">
                        Это план прогулки, <br className="sm:hidden flex" />
                        собранный под тебя
                    </span>

                    <FloatingDove
                        className="absolute top-0 -translate-y-3 sm:-translate-y-1/2 sm:right-2/13 sm:top-2 desktop:top-5 right-3 desktop:right-33 z-10"
                        thoughts={<HomeAboutDoveThoughts />}
                        thoughtsClassName="absolute right-1/2 -top-18 desktop:-top-13 desktop:translate-y-0 desktop:right-30"
                        doveClassName="w-full max-w-23 desktop:max-w-36"
                        doveSrc={DoveWithGlasses}
                    />
                </HomeH2>

                <img
                    src={HomeAboutBg}
                    draggable={false}
                    alt="About Background"
                    className="absolute bottom-0 z-0 w-full max-w-max object-contain flex sm:hidden"
                />
            </div>

            <AboutCardsList />

            <AboutRoadLeft className="absolute left-0 -bottom-4 desktop:-bottom-94 z-10 pointer-events-none" />
            <AboutRoadRight className="absolute right-0 -bottom-14 xs:bottom-48 sm:-bottom-32 desktop:-bottom-20 z-10 pointer-events-none" />
        </section>
    )
}

export default HomeAbout