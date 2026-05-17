// @/widgets/FilterManager/ui/FilterManager.tsx
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BaseButton from '@/shared/components/ui/buttons/BaseButton';
import clsx from 'clsx';
import { FilterContent } from '@/widgets/FilterManager/ui/FilterContent';

interface Props {
    isOpen: boolean;
    onClose?: () => void;
    type: 'mobile' | 'tablet';
    className?: string;
}

export const FilterManager = ({ isOpen, onClose, type, className }: Props) => {
    const [selected, setSelected] = useState<string[]>([]);

    const toggleOption = (id: string) => {
        setSelected(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    useEffect(() => {
        if (type === 'mobile' && isOpen) {
            const originalStyle = window.getComputedStyle(document.body).overflow;
            document.body.style.overflow = 'hidden';
            return () => {
                document.body.style.overflow = originalStyle;
            };
        }
    }, [isOpen, type]);

    if (type === 'tablet') {
        return (
            <div className={clsx("flex flex-col gap-7.5 py-4", className)}>
                <h2 className="text-heading-md! text-primary px-5 font-bold">
                    Фильтры
                </h2>
                <FilterContent
                    type="tablet"
                    selected={selected}
                    onToggle={toggleOption}
                />

                <div className="px-5">
                    <BaseButton
                        title="Применить"
                        variant="primary"
                        size='lg'
                        className="w-full max-w-32!"
                        onClick={onClose}
                    />
                </div>
            </div>
        );
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="fixed inset-0 z-1000 bg-background flex flex-col pt-30 px-2.5 pb-4 overflow-y-auto"
                >
                    <div className="flex items-center justify-between mb-8 px-2.5">
                        <h2 className="text-heading-2xl! text-secondary">Фильтры</h2>
                    </div>

                    <FilterContent
                        type="mobile"
                        selected={selected}
                        onToggle={toggleOption}
                    />

                    <div className="mt-auto pt-10 px-2.5">
                        <BaseButton
                            title="Применить"
                            variant="primary"
                            size='lg'
                            className="w-full max-w-none"
                            onClick={onClose}
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};