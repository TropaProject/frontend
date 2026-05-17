import { motion } from 'framer-motion'

import HomeH2 from "@/pages/home/components/HomeH2"
import PopularPlacesTitleParticles from "@/pages/home/sections/popularPlaces/assets/PopularPlacesTitleParticles"
import BaseButton from "@/shared/components/ui/buttons/BaseButton"
import PopularPlacesDove from "@/pages/home/sections/popularPlaces/assets/images/popular-places-dove.png"
import clsx from "clsx"
import PopularPlacesForeground from "@/pages/home/sections/popularPlaces/assets/visual/PopularPlacesForeground"
import PopularPlacesMidground from "@/pages/home/sections/popularPlaces/assets/visual/PopularPlacesMidground"
import PopularPlacesBackground from "@/pages/home/sections/popularPlaces/assets/visual/PopularPlacesBackground"
import FloatingDove from "@/shared/assets/doves/FloatingDove"
import HomePopularPlacesDoveThoughts from "@/pages/home/sections/popularPlaces/assets/visual/HomePopularPlacesDoveThoughts"
import { PlaceEntitySlider } from '@/entities/place/ui/sliders/PlaceEntitySlider'
import { mockPlacesData } from '@/entities/place/model/mock'

const HomePopularPlaces = (props: React.HTMLAttributes<HTMLElement>) => {
    const description = 'Сегодня летал над городом и собрал для тебя самые сочные места'

    return (
        <section className={clsx("flex flex-col items-center relative pb-24 desktop:pb-64 -mb-6 desktop:-mb-48 z-0 desktop:mt-32 w-full", props.className)}>
            <div className="relative grid grid-cols-8 desktop:grid-cols-1 gap-2.5 w-full px-2.5 desktop:px-10 z-20">
                <div className="col-span-6 desktop:col-span-1 w-full flex flex-col desktop:flex-row desktop:justify-between desktop:items-end relative gap-2.5 desktop:pr-0">
                    <div className="flex flex-row w-full">
                        <HomeH2 className="text-secondary relative">
                            Со мной интересно <br />
                            в любое время года

                            <FloatingDove
                                className="hidden desktop:flex w-full max-w-max bottom-0 -right-1/2"
                                thoughts={<HomePopularPlacesDoveThoughts />}
                                thoughtsClassName="w-full max-w-22 z-10 object-contain -right-12 top-0 z-20"
                                doveClassName="z-10 max-w-32 w-full h-full desktop:max-w-60 desktop:-scale-x-100 object-contain "
                                doveSrc={PopularPlacesDove}
                            />
                        </HomeH2>
                    </div>

                    <div className="flex flex-col relative gap-2.5 desktop:gap-5 desktop:*:mr-0!">
                        <p className="text-body-base text-text text-start mt-2.5 mr-6">
                            {description}
                        </p>

                        <div className="flex flex-row gap-1 *:min-h-10 mr-10 desktop:*:flex-1!">
                            <BaseButton className="flex-7/16">Москва</BaseButton>
                            <BaseButton variant="secondary" className="flex-9/16">Санкт-Петербург</BaseButton>
                        </div>
                    </div>

                    <PopularPlacesTitleParticles className="absolute pointer-events-none -translate-y-3/5 desktop:translate-y-0 top-0 desktop:-top-1/2 -left-2.5 desktop:-left-10 w-full h-full max-h-max min-w-max max-w-max z-10" preserveAspectRatio="none" />
                </div>

                <FloatingDove
                    className="w-full bottom-0 -right-5 xs:right-0 desktop:hidden"
                    thoughts={<HomePopularPlacesDoveThoughts />}
                    thoughtsClassName="w-full w-full max-w-22 z-10 object-contain right-8 xs:right-6 -top-1/2"
                    doveClassName="z-10 w-full max-w-32 -right-10 xs:-right-2 -bottom-1"
                    doveSrc={PopularPlacesDove}
                />
            </div>

            <div className="w-full mt-6 overflow-hidden z-20">
                <PlaceEntitySlider
                    className="desktop:max-w-none desktop:w-full pt-4 desktop:pr-12.5 desktop:pl-12.5"
                    rotateSlides
                    places={mockPlacesData}
                    slideClassName="tablet:pt-1 desktop:pt-0 tablet:*:last:rounded-b-2xl desktop:rounded-auto"
                />
            </div>

            <div className="flex w-full h-full pointer-events-none">
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{
                        duration: 1.2,
                        ease: [0.22, 1, 0.36, 1]
                    }}
                    className="w-full absolute -bottom-5 sm:bottom-2 desktop:bottom-64 z-0"
                >
                    <PopularPlacesBackground className="w-full" />
                </motion.div>

                <motion.div
                    initial={{ y: 150, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{
                        duration: 1,
                        delay: 0.2,
                        type: "spring",
                        stiffness: 40,
                        damping: 15
                    }}
                    className="w-full absolute -bottom-16 sm:-bottom-20 desktop:bottom-28 z-0"
                >
                    <PopularPlacesMidground className="w-full" />
                </motion.div>

                <motion.div
                    initial={{ y: 200, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{
                        duration: 0.8,
                        delay: 0.4,
                        type: "spring",
                        stiffness: 50,
                        damping: 12
                    }}
                    className="w-full absolute -bottom-32 sm:-bottom-40 desktop:bottom-0 z-100"
                >
                    <PopularPlacesForeground className="w-full" />
                </motion.div>
            </div>
        </section>
    )
}

export default HomePopularPlaces