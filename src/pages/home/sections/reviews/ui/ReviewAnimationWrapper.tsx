// src/pages/home/sections/reviews/ui/ReviewAnimationWrapper.tsx
import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

interface ReviewAnimationWrapperProps {
    children: React.ReactNode;
    index: number;
    className?: string;
}

export const ReviewAnimationWrapper = ({ children, index, className }: ReviewAnimationWrapperProps) => {
    const ref = useRef(null);

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    const seed = (index + 1) * 0.1;
    const rotateDir = index % 2 === 0 ? 1 : -1;

    // Скролл-анимации (без прозрачности)
    const yTransform = useTransform(scrollYProgress, [0, 1], [80 * seed, -80 * seed]);
    const rotateTransform = useTransform(scrollYProgress, [0, 0.75, 1], [4 * rotateDir, 0, -4 * rotateDir]);
    const scaleTransform = useTransform(scrollYProgress, [0, 0.5, 1], [0.98, 1, 0.98]);

    const springY = useSpring(yTransform, { stiffness: 40, damping: 20 });
    const springRotate = useSpring(rotateTransform, { stiffness: 50, damping: 15 });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }} // Только для энтри
            whileInView={{ opacity: 1, y: 0 }} // Прозрачность фиксируется один раз
            viewport={{ once: true, margin: "-20px" }}
            transition={{
                opacity: { duration: 0.8, delay: index * 0.05 },
                y: { duration: 0.6, ease: "easeOut" }
            }}
            style={{
                y: springY, // Параллакс подхватывает после энтри
                rotate: springRotate,
                scale: scaleTransform,
                perspective: 1000
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
};