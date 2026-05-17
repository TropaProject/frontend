// widgets/header/lib/useHeader.ts
import { useState, useEffect } from 'react';

interface UseHeaderProps {
    onMenuClick?: () => void;
}

export const useHeader = ({ onMenuClick }: UseHeaderProps) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        if (!isMenuOpen) return;

        const handleOutsideClick = (e: MouseEvent) => {
            // Закрываем, если кликнули в левой части экрана (вне меню)
            if (e.clientX < window.innerWidth * 3 / 7) {
                setIsMenuOpen(false);
            }
        };

        window.addEventListener('click', handleOutsideClick);
        return () => window.removeEventListener('click', handleOutsideClick);
    }, [isMenuOpen]);

    const handleMenuToggle = () => {
        if (onMenuClick) {
            onMenuClick();
        } else {
            setIsMenuOpen((prev) => !prev);
        }
    };

    const closeMenu = () => setIsMenuOpen(false);

    return {
        isMenuOpen,
        handleMenuToggle,
        closeMenu,
    };
};