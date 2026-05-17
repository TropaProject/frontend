// shared/components/ui/sliders/QuizSlider/index.tsx
import { type ReactNode } from 'react';
import clsx from 'clsx';
import BaseSlider from '@/shared/components/ui/sliders/BaseSlider';

export interface QuizCardData {
    id: string | number;
    title?: string;
    description?: string;
    image: string;
}

interface QuizSliderProps {
    title: string;
    description?: string;
    groups: QuizCardData[][];
    renderCard: (card: QuizCardData) => ReactNode;
    className?: string;
    onSlideChange?: (index: number) => void;
    titleClassName?: string;
    descriptionColor?: string;
    arrowColor?: string;
    buttonBgColor?: string;
    showNavigation?: boolean;
    showPagination?: boolean;
}

export const QuizSlider = (props: QuizSliderProps) => {
    return (
        <BaseSlider
            {...props}
            titleClassName={clsx(props.titleClassName)}
            description={props.description}
            items={props.groups}
            showNavigation={props.showNavigation ?? true}
            showPagination={props.showPagination ?? true}
            swiperProps={{
                spaceBetween: 100,
                slidesPerView: 1,
                allowTouchMove: false,
            }}
            className={clsx(props.className)}
            slideClassName="max-w-max"
            renderItem={(group) => (
                <div
                    className={clsx(
                        group.length === 2 && 'grid-rows-2',
                        group.length >= 3 && 'grid-rows-3',
                        "grid grid-flow-col",
                        "w-full overflow-x-auto scrollbar-hidden py-2 gap-4",
                        "xs:grid-cols-2 xs:grid-flow-row xs:grid-rows-none xs:gap-1",
                        "tablet:grid-cols-3 tablet:overflow-x-visible tablet:gap-2",
                        "desktop:grid-cols-3 desktop:gap-6"
                    )}
                >
                    {group.map((card) => (
                        <div
                            key={card.id}
                            className={clsx(
                                "shrink-0 transition-transform active:scale-[0.98]",
                                group.length <= 3 ? "w-full" : "w-[75vw] xs:w-full",
                                "tablet:w-full tablet:h-auto"
                            )}
                        >
                            {props.renderCard(card)}
                        </div>
                    ))}
                </div>
            )}
        />
    );
};