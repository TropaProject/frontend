// shared/components/ui/sliders/EntitySlider/EntitySliderItem.tsx
import { motion, useTransform, type MotionValue } from 'framer-motion';
import EntityCard from '@/shared/components/ui/cards/EntityCard';
import PlaceSliderClothespin from '@/entities/place/ui/sliders/assets/icons/PlaceSliderClothespin';
import type { EntityCardProps } from '@/shared/components/ui/cards/EntityCard/types';

const DEFAULT_ROTATES = [-3, 3.5, -6, 5, -3, 3.5, -6, 5, -3, 3.5, -6, 5];

interface EntitySliderItemProps {
    entity: EntityCardProps;
    index: number;
    scrollProgress: MotionValue<number>;
    withClothespins: boolean;
    rotateSlides: boolean;
    canAnimateRepulsion: boolean;
    hoveredIndex: number | null;
    setHoveredIndex: (index: number | null) => void;
    slideClassName?: string;
}

const RepulsionSlide = ({
    entity, index, hoveredIndex, setHoveredIndex, slideClassName, canAnimateRepulsion,
}: Omit<EntitySliderItemProps, 'scrollProgress' | 'withClothespins' | 'rotateSlides'>) => {
    const isHovered = hoveredIndex === index;
    const isSomethingActive = hoveredIndex !== null;
    const baseRotate = DEFAULT_ROTATES[index % DEFAULT_ROTATES.length];
    const repulsionX = (canAnimateRepulsion && !isHovered && isSomethingActive)
        ? (index < hoveredIndex! ? -45 : 45) : 0;

    return (
        <motion.div
            onMouseEnter={() => canAnimateRepulsion && setHoveredIndex(index)}
            onMouseLeave={() => canAnimateRepulsion && setHoveredIndex(null)}
            className="relative py-4 select-none max-w-81.25! w-full desktop:max-w-full h-full"
        >
            <motion.div
                animate={{
                    x: repulsionX,
                    rotate: isHovered ? 0 : baseRotate,
                    y: isHovered ? -20 : 0,
                    scale: isHovered ? 1.05 : 1,
                    zIndex: isHovered ? 100 : 10,
                }}
                transition={{ type: 'spring', stiffness: 150, damping: 20, mass: 0.6 }}
            >
                <EntityCard className={slideClassName} {...entity} />
            </motion.div>
        </motion.div>
    );
};

const RopeSlide = ({
    entity, index, scrollProgress, slideClassName,
}: Omit<EntitySliderItemProps, 'withClothespins' | 'rotateSlides' | 'canAnimateRepulsion' | 'hoveredIndex' | 'setHoveredIndex'>) => {
    const entryX = useTransform(scrollProgress, [0, 0.8], [200 + index * 60, 0]);
    return (
        <motion.div className="relative py-4 select-none max-w-77! w-full desktop:max-w-full h-full" style={{ x: entryX }}>
            <div className="relative">
                <EntityCard className={slideClassName} {...entity} />
                <div className="absolute -top-8 desktop:-top-10 left-1/2 -translate-x-1/2 z-50 pointer-events-none flex justify-center">
                    <PlaceSliderClothespin />
                </div>
            </div>
        </motion.div>
    );
};

const StaticSlide = ({
    entity, slideClassName,
}: Pick<EntitySliderItemProps, 'entity' | 'slideClassName'>) => (
    <div className="flex relative py-4 select-none max-w-77! w-full desktop:max-w-full h-full">
        <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className='w-full h-full flex'
        >
            <EntityCard className={slideClassName} {...entity} />
        </motion.div>
    </div>
);

export const EntitySliderItem = (props: EntitySliderItemProps) => {
    const { rotateSlides, withClothespins } = props;

    if (rotateSlides && !withClothespins) {
        return <RepulsionSlide {...props} />;
    }
    if (!rotateSlides && withClothespins) {
        return <RopeSlide {...props} />;
    }
    return <StaticSlide entity={props.entity} slideClassName={props.slideClassName} />;
};