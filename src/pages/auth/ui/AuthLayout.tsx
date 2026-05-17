// src/pages/auth/components/AuthLayout.tsx
import LogoFull from "@/shared/assets/logos/LogoFull"
import PageWrapper from "@/shared/components/wrappers/PageWrapper"

import HeroImgLeft from '@/pages/auth/assets/images/create-route-hero-1.jpg';
import HeroImgLeftDesktop from '@/pages/auth/assets/images/create-route-hero-1-desktop.jpg';
import HeroImgRight from '@/pages/auth/assets/images/create-route-hero-2.jpg';
import HeroImgRightDesktop from '@/pages/auth/assets/images/create-route-hero-2-desktop.jpg';
import HeroBgLeft from "@/pages/auth/assets/backgrounds/HeroBgLeft";
import HeroBgRight from "@/pages/auth/assets/backgrounds/HeroBgRight";
import ArrowIcon from "@/shared/assets/icons/ArrowIcon";
import FloatingDove from "@/shared/assets/doves/FloatingDove";
import AuthHeroDoveThoughts from "@/pages/auth/assets/visual/AuthHeroDoveThoughts";
import DoveSkateboard from "@/pages/auth/assets/images/dove-skateboard.png"
import FoodCart from "@/pages/auth/assets/images/food-cart.svg"
import { useLocation } from "react-router-dom";
import clsx from "clsx";
import { useRef } from "react"
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useScrollToTop } from "@/shared/hooks/useScrollToTop";

interface AuthLayoutProps {
    children: React.ReactNode
    subtitle?: string
}
export const AuthLayout = ({ children, subtitle }: AuthLayoutProps) => {
    useScrollToTop()
    const description = 'Я строю маршруты по городу, чтобы ты не сидел с картами, списками и рекомендациями в соцсетях'
    const { pathname } = useLocation();
    const isAuthPage = pathname === '/auth'

    const sectionRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end start"]
    });

    const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

    // Параллакс только для клякс
    const bgLeftY = useTransform(smoothProgress, [0, 1], [-10, -60]);
    const bgRightY = useTransform(smoothProgress, [0, 1], [-10, -40]);

    // Параллакс для персонажей (чтобы не пропадали, а чуть смещались)
    const doveScrollX = useTransform(smoothProgress, [0, 1], [0, -50]);
    const cartScrollX = useTransform(smoothProgress, [0, 1], [0, 50]);

    return (
        <PageWrapper className="-mb-24 xs:-mb-32 sm:mb-0">
            <section ref={sectionRef} className="overflow-hidden mx-auto w-full flex gap-5 flex-col items-center pt-32 pb-18 desktop:pb-0 relative">

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="flex flex-col w-full items-center gap-5 z-50"
                >
                    <div className="relative flex flex-col items-center">
                        <LogoFull className="max-w-60 sm:max-w-76 mx-auto" />
                        {subtitle && (
                            <h1 className="text-secondary text-heading-md absolute top-0 -translate-y-4/3 mx-auto">{subtitle}</h1>
                        )}
                    </div>
                    <p className="text-body-sm sm:text-body-lg text-text text-center max-w-52 sm:max-w-72 mt-3">
                        {description}
                    </p>
                </motion.div>

                <div className="flex flex-col w-full relative z-10">
                    <div className={clsx(isAuthPage ? 'flex' : 'tablet:flex hidden', 'w-full absolute top-0 h-full')}>
                        <div className="flex relative w-full max-h-max">
                            {/* ЛЕВАЯ ЧАСТЬ */}
                            <div className="pointer-events-none flex flex-col absolute h-full w-full left-0 z-20 bottom-0 sm:-top-6 desktop:-top-20">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 1, duration: 0.5 }}
                                    className={clsx(isAuthPage ? 'flex' : 'hidden', 'relative items-start flex-col justify-start self-end desktop:max-w-4/5 w-full h-full')}
                                >
                                    <div className="flex desktop:flex-col-reverse flex-col items-end gap-1 desktop:gap-6 z-20 text-center text-body-xs sm:text-body-lg text-text ml-2.5">
                                        <ArrowIcon className="text-primary -scale-y-100 w-full desktop:max-w-18 desktop:scale-y-100 desktop:rotate-30 h-max max-w-7 -rotate-12" />
                                        <p className="desktop:pr-12">Жми «Войти», <br /> если ты уже с нами</p>
                                    </div>
                                </motion.div>

                                <motion.div
                                    initial={{ x: "-100%", opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    style={{ x: doveScrollX }}
                                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                                    className="top-14 -left-12 tablet:-left-20 sm:top-16 desktop:-top-46 desktop:mb-auto absolute"
                                >
                                    <FloatingDove
                                        thoughts={<AuthHeroDoveThoughts />}
                                        thoughtsClassName="bottom-14 z-30 -right-21 sm:bottom-12 desktop:top-0 tablet:-translate-y-30 tablet:-right-16 tablet:translate-x-1/2"
                                        doveSrc={DoveSkateboard}
                                        doveClassName="w-full max-w-42 z-20 tablet:max-w-72 desktop:max-w-90 sm:max-w-64"
                                        className="static!"
                                    />
                                </motion.div>
                            </div>

                            {/* ПРАВАЯ ЧАСТЬ */}
                            <div className="pointer-events-none flex flex-col absolute h-full w-full right-0 z-10 top-0 sm:-top-6 desktop:-top-22">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 1.1, duration: 0.5 }}
                                    className="relative desktop:ml-10 flex items-end flex-col justify-start desktop:max-w-4/5 w-full h-full"
                                >
                                    <div className={clsx(isAuthPage ? 'flex' : 'hidden', "flex flex-col items-center desktop:items-start gap-1 z-20 text-center text-body-xs sm:text-body-lg text-background mr-2.5")}>
                                        <p className="desktop:pl-8">Жми <br className="desktop:hidden block" /> «Зарегистрироваться», <br /> если решил впервые <br /> встать с дивана</p>
                                        <ArrowIcon className="-scale-x-100 desktop:max-w-18 desktop:scale-y-100 desktop:-rotate-30 h-max -rotate-12 mr-6 w-full max-w-7 desktop:text-primary" />
                                    </div>
                                </motion.div>

                                <motion.img
                                    initial={{ x: "100%", opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    style={{ x: cartScrollX }}
                                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                                    src={FoodCart}
                                    className="absolute top-18 right-2.5 desktop:top-0 desktop:my-auto desktop:right-0 desktop:bottom-0 w-full max-w-22 sm:max-w-36 sm:top-24 sm:right-20 desktop:max-w-64 desktop:-scale-x-100 object-cover z-20"
                                />
                            </div>
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        className="z-20"
                    >
                        {children}
                    </motion.div>

                    {/* Анимированные кляксы */}
                    <motion.div style={{ y: bgLeftY }} className="z-0 absolute left-0 -top-18 sm:-top-26 desktop:-top-32">
                        <HeroBgLeft className="sm:min-w-72 sm:min-h-90 desktop:min-h-64" preserveAspectRatio="none" />
                    </motion.div>
                    <motion.div style={{ y: bgRightY }} className="z-0 absolute -right-4 desktop:right-0 -top-18 sm:-top-26 desktop:-top-40 translate-y-6">
                        <HeroBgRight className="sm:min-w-72 sm:min-h-90 desktop:min-h-60" preserveAspectRatio="none" />
                    </motion.div>
                </div>

                {/* Статичные картинки */}
                <picture className="absolute left-0 top-4 desktop:-top-8 z-0">
                    <source media="(min-width: 1280px)" srcSet={HeroImgLeftDesktop} />
                    <img src={HeroImgLeft} alt="изображение на фоне" className="w-full object-contain max-w-36 xs:max-w-48 sm:max-w-64 desktop:max-w-110" />
                </picture>

                <picture className="absolute right-0 top-4 desktop:-top-6 z-0">
                    <source media="(min-width: 1280px)" srcSet={HeroImgRightDesktop} />
                    <img src={HeroImgRight} alt="изображение на фоне" className="w-full object-contain max-w-36 xs:max-w-48 sm:max-w-64 desktop:max-w-96" />
                </picture>
            </section>
        </PageWrapper>
    )
}