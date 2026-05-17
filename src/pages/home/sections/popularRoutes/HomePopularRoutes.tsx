// pages/home/sections/popularRoutes/index.tsx
import HomeH2 from "@/pages/home/components/HomeH2"
import BaseButton from "@/shared/components/ui/buttons/BaseButton"
import PopularRoutesDove from "@/pages/home/sections/popularRoutes/assets/images/popular-routes-dove.png"
import PopularRoutesTopBorder from "@/pages/home/sections/popularRoutes/assets/borders/PopularRoutesTopBorder"
import { mockRoutesData } from "@/entities/route/model/mock"
import FloatingDove from "@/shared/assets/doves/FloatingDove"
import ArrowIcon from "@/shared/assets/icons/ArrowIcon"
import SliderButtonBg from "@/pages/create-route/sections/quiz/assets/backgrounds/SliderButtonBg"
import clsx from "clsx"
import HomePopularRoutesDoveThoughts from "@/pages/home/sections/popularRoutes/assets/visual/HomePopularRoutesDoveThoughts"
import { motion, useScroll, useSpring, useTransform } from "framer-motion"
import HomeAboutFeatherDesktop2 from "@/pages/home/sections/about/assets/visual/HomeAboutFeatherDesktop2"
import { useRef } from "react"
import { RouteEntitySlider } from "@/entities/route/ui/RouteEntitySlider"
import type { EntitySliderRef } from "@/shared/components/ui/sliders/EntitySlider/ui/EntitySlider"
import { useRecommendedRoutes } from "@/entities/user/hooks/useUserQueries"


const HomePopularRoutes = (props: React.HTMLAttributes<HTMLElement>) => {
    const description = 'Смотри сколько маршрутов уже построено и где сейчас гуляют люди'

    const sectionRef = useRef<HTMLElement>(null);
    const sliderRef = useRef<EntitySliderRef>(null);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    const featherX = useTransform(smoothProgress, [0, 1], [-30, 60]);
    const featherY = useTransform(smoothProgress, [0, 1], [0, 70]);
    const featherRotate = useTransform(smoothProgress, [0, 1], [10, -10]);

    const { data: recommendedRoutes, isLoading: recommendedLoading } = useRecommendedRoutes(6);

    return (
        <section ref={sectionRef} className={`${props.className} overflow-hidden flex flex-col w-full max-w-mobile pt-4 lg:pt-12 lg:-mt-12 desktop:px-10 items-start pb-26 relative`}>
            <div className="relative flex flex-col w-full pb-8 desktop:pb-14 px-2.5 desktop:px-0">
                <div className="w-full flex flex-col desktop:grid desktop:grid-cols-16 desktop:items-end gap-2.5 desktop:pr-0 pr-20 z-10">
                    <div className='desktop:flex gap-2.5 hidden desktop:col-span-2'>
                        <BaseButton
                            type="button"
                            onClick={() => sliderRef.current?.slidePrev()}
                            leftIcon={<ArrowIcon className={clsx('rotate-180 transition-colors duration-500 text-background')} />}
                            customBg={
                                <SliderButtonBg className={clsx('absolute inset-0 w-full h-full transition-colors duration-500 text-primary')} preserveAspectRatio='none' />
                            }
                            className='min-w-8 p-0 min-h-8 h-8 w-8 *:p-0 shadow-none border-none'
                        />
                        <BaseButton
                            type="button"
                            onClick={() => sliderRef.current?.slideNext()}
                            leftIcon={<ArrowIcon className={clsx('transition-colors duration-500 text-background')} />}
                            customBg={
                                <SliderButtonBg className={clsx('absolute inset-0 w-full h-full transition-colors duration-500 text-primary')} preserveAspectRatio='none' />
                            }
                            className='min-w-8 p-0 min-h-8 h-8 w-8 *:p-0 shadow-none border-none'
                        />
                    </div>

                    <div className="flex flex-row w-full desktop:col-span-8 desktop:col-start-4">
                        <HomeH2 className="text-secondary relative">
                            Маршруты <br />
                            моих корешей

                            <FloatingDove
                                className="hidden desktop:flex w-full -right-1/2 translate-x-8 z-40 desktop:-bottom-22"
                                thoughts={<HomePopularRoutesDoveThoughts />}
                                thoughtsClassName="w-full max-w-22 z-10 object-contain right-0 -top-14 z-20"
                                doveClassName="z-10 w-full h-full min-h-46 desktop:min-h-76 max-w-44"
                                doveSrc={PopularRoutesDove}
                            />
                        </HomeH2>
                    </div>

                    <div className="flex w-full flex-col relative gap-2.5 desktop:gap-5 desktop:*:mr-0! desktop:col-span-5 desktop:col-start-12">
                        <p className="text-body-base text-text text-start mt-1 mr-6">
                            {description}
                        </p>
                        <div className="flex flex-row gap-1 tablet:gap-3 *:min-h-10 mr-10">
                            <BaseButton className="flex-7/16">Москва</BaseButton>
                            <BaseButton variant="secondary" className="flex-9/16">Санкт-Петербург</BaseButton>
                        </div>

                        <motion.div
                            style={{ x: featherX, y: featherY, rotate: featherRotate }}
                            className="absolute -top-1/1 right-8 -translate-y-6 hidden desktop:flex pointer-events-none opacity-80"
                        >
                            <HomeAboutFeatherDesktop2 />
                        </motion.div>
                    </div>
                </div>

                <FloatingDove
                    className="desktop:hidden h-auto! flex w-full max-w-max -bottom-5.5 right-2.5 z-20"
                    thoughts={<HomePopularRoutesDoveThoughts />}
                    thoughtsClassName="w-full max-w-22 h-full max-h-min z-10 object-contain -left-16 -top-28 z-20"
                    doveClassName="z-10 max-w-26 w-full h-min desktop:max-w-60"
                    doveSrc={PopularRoutesDove}
                />
                <PopularRoutesTopBorder
                    preserveAspectRatio="none"
                    className='absolute mt-auto -bottom-5 left-0 z-0 min-w-[110%] tablet:-bottom-6 w-full tablet:-left-10 h-min pointer-events-none'
                />
            </div>

            <div className="w-full">
                <RouteEntitySlider
                    ref={sliderRef}
                    routes={recommendedRoutes ?? []}
                    loading={recommendedLoading}
                    className="z-10"
                    withClothespins
                />
            </div>
        </section>
    )
}

export default HomePopularRoutes