// @/pages/route/ui/LoadingScreen/index.tsx
import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useScreenSize } from "@/shared/hooks/useScreenSize";
import FloatingDove from "@/shared/assets/doves/FloatingDove";
import DoveWithGlasses from "@/shared/assets/doves/dove-with-glasses.png";
import { RouteLoadingScreenDoveThoughts } from "@/pages/route/ui/LoadingScreen/assets/visual/RouteLoadingScreenDoveThoughts";
import RouteLoadingScreenPath from "@/pages/route/ui/LoadingScreen/assets/visual/RouteLoadingScreenPath";
import RouteLoadingScreenDovePaws from "@/pages/route/ui/LoadingScreen/assets/visual/RouteLoadingScreenDovePaws";
import clsx from "clsx";

const THOUGHTS_POSITIONS: Record<number, string> = {
    1: "-translate-x-7 desktop:translate-x-0 -top-40 desktop:left-21 desktop:-top-3",
    2: "-translate-x-1 desktop:translate-x-0 -top-40 desktop:-right-7 desktop:-top-3",
    3: "-translate-x-7 desktop:translate-x-0 -top-40 desktop:left-21 desktop:-top-3",
    4: "-translate-x-1 desktop:translate-x-0 -top-40 desktop:-right-7 desktop:-top-3",
};

interface LoadingScreenProps {
    onFinished?: () => void;
    isLoading: boolean;
}
const LoadingScreen = ({ onFinished, isLoading }: LoadingScreenProps) => {
    const { isAboveTablet } = useScreenSize();
    const [step, setStep] = useState(1);
    const [pawsFinished, setPawsFinished] = useState(false);
    const [thoughtsFinished, setThoughtsFinished] = useState(false);

    const pawsCount = isAboveTablet ? 22 : 6;
    const totalPawsDuration = useMemo(() => (pawsCount * 150) + 800, [pawsCount]);

    useEffect(() => {
        if (isLoading) {
            setStep(1);
            setPawsFinished(false);
            setThoughtsFinished(false);
        }
    }, [isLoading]);

    // анимация мыслей
    useEffect(() => {
        if (!isLoading) return;

        if (step < 4) {
            const timer = setTimeout(() => setStep(prev => prev + 1), 2000);
            return () => clearTimeout(timer);
        } else if (step === 4 && !thoughtsFinished) {
            const finalTimer = setTimeout(() => setThoughtsFinished(true), 1500);
            return () => clearTimeout(finalTimer);
        }
    }, [step, isLoading, thoughtsFinished]);

    // анимация лапок
    useEffect(() => {
        if (!isLoading) return;

        const timer = setTimeout(() => setPawsFinished(true), totalPawsDuration);
        return () => clearTimeout(timer);
    }, [totalPawsDuration, isLoading]);

    // завершение загрузки
    useEffect(() => {
        if (isLoading && pawsFinished && thoughtsFinished) {
            onFinished?.();
        }
    }, [pawsFinished, thoughtsFinished, isLoading, onFinished]);

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    key="loading-screen"
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="fixed inset-0 flex items-center justify-center flex-col w-full h-full bg-background z-100"
                >
                    <div className="flex flex-col w-full items-center gap-10 max-w-desktop mt-100 desktop:mt-0 px-4 relative">
                        <motion.h2
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center text-[6.875rem]! desktop:text-heading-4xl! text-primary"
                        >
                            Происходит <br className="tablet:hidden block" /> магия
                        </motion.h2>

                        <motion.div
                            animate={{
                                y: [0, -8, 0],
                                scale: [1, 1.02, 1]
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="desktop:static! absolute top-4 -translate-y-1/1 desktop:translate-y-0"
                        >
                            <FloatingDove
                                doveSrc={DoveWithGlasses}
                                doveClassName="max-w-27 -scale-x-100"
                                className="static!"
                                thoughts={
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={step}
                                            className={clsx("absolute z-10", THOUGHTS_POSITIONS[step])}
                                            initial={{ opacity: 0, scale: 0.8, y: 10 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.8, y: 5 }}
                                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                        >
                                            <RouteLoadingScreenDoveThoughts step={step} />
                                        </motion.div>
                                    </AnimatePresence>
                                }
                            />
                        </motion.div>

                        <div className="flex w-full h-18 relative items-center justify-center overflow-hidden">
                            <RouteLoadingScreenPath className="min-w-full h-min absolute z-0" preserveAspectRatio="none" />
                            <div className="z-10 flex flex-row w-full justify-between">
                                {[...Array(pawsCount)].map((_, index) => (
                                    <div
                                        key={index}
                                        className="h-full relative flex"
                                    >
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{
                                                delay: index * 0.35,
                                                type: "spring",
                                                stiffness: 400,
                                                damping: 15
                                            }}
                                            className="z-10"
                                        >
                                            <RouteLoadingScreenDovePaws />
                                        </motion.div>

                                        <motion.div
                                            initial={{ opacity: 0, scale: 0 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{
                                                delay: index * 0.35,
                                            }}
                                            className=" bg-background h-full scale-y-120 scale-x-130 xs:scale-x-200 sm:scale-x-240 tablet:scale-x-120 w-full absolute z-0"
                                        />
                                    </div>
                                ))}

                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default LoadingScreen;