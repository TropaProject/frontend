import { motion } from "framer-motion";
import clsx from "clsx";
import type { ReactNode } from "react";
import DefaultDove from "@/shared/assets/doves/dove-with-glasses.png";

interface FloatingDoveProps {
    thoughts: ReactNode;
    className?: string;
    doveClassName?: string;
    thoughtsClassName?: string;
    doveSrc?: string;
    children?: ReactNode;
}

const FloatingDove = ({
    thoughts,
    className,
    doveClassName,
    thoughtsClassName,
    doveSrc = DefaultDove,
    children
}: FloatingDoveProps) => {
    return (
        <div draggable={false} className={clsx("pointer-events-none absolute flex flex-col w-full max-w-max", className)}>
            <div className="relative flex flex-col h-full">
                <motion.div
                    initial={{ opacity: 0, scale: 0.5, y: 10, x: -10 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{
                        delay: 0.3,
                        type: "spring",
                        stiffness: 260,
                        damping: 20
                    }}
                    className={clsx("absolute object-contain", thoughtsClassName)}
                >
                    {thoughts}
                </motion.div>

                <img
                    src={doveSrc}
                    alt="Mascot"
                    className={clsx("object-contain", doveClassName)}
                />

                {children}
            </div>
        </div>
    );
};
export default FloatingDove;