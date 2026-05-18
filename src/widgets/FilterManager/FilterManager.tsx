// @/widgets/FilterManager/ui/FilterManager.tsx
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (type === 'mobile' && isOpen) {
            const scrollY = window.scrollY;
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = '100%';
            return () => {
                const scrollY = parseInt(document.body.style.top || '0') * -1;
                document.body.style.position = '';
                document.body.style.top = '';
                document.body.style.width = '';
                window.scrollTo(0, scrollY);
            };
        }
    }, [isOpen, type]);

    const toggleOption = (id: string) => {
        setSelected(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    if (type === 'tablet') {
        return (
            <div className={clsx("flex flex-col gap-7.5 py-4", className)}>
                <h2 className="text-heading-md! text-primary px-5 font-bold">Фильтры</h2>
                <FilterContent type="tablet" selected={selected} onToggle={toggleOption} />
                <div className="px-5">
                    <BaseButton title="Применить" variant="primary" size='lg' className="w-full max-w-32!" onClick={onClose} />
                </div>
            </div>
        );
    }

    if (!isOpen || !mounted) return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="fixed inset-0 z-[9999] bg-background flex flex-col pt-30 px-2.5 pb-24 overflow-y-auto"
                >
                    <div className="flex items-center justify-between mb-8 px-2.5">
                        <h2 className="text-heading-2xl! text-secondary">Фильтры</h2>
                    </div>

                    <FilterContent type="mobile" selected={selected} onToggle={toggleOption} />

                    <div className="mt-auto pt-2.5 px-2.5 fixed bottom-0 w-full mx-auto left-0 pb-5 z-20 bg-background rounded-t-2xl">
                        <BaseButton title="Применить" variant="primary" size='lg' className="w-full max-w-none" onClick={onClose} />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    );
};