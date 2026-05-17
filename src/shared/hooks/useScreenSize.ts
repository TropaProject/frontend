// shared/hooks/useScreenSize.ts
import { useState, useEffect } from 'react';

type ScreenSize = {
    isMobile: boolean;
    isTablet: boolean;
    isAboveTablet: boolean;
    isLg: boolean;
    isDesktop: boolean;
    width: number;
    height: number;
};

export const useScreenSize = (): ScreenSize => {
    const [screenSize, setScreenSize] = useState<ScreenSize>({
        isMobile: false,
        isTablet: false,
        isAboveTablet: false,
        isLg: false,
        isDesktop: false,
        width: typeof window !== 'undefined' ? window.innerWidth : 0,
        height: typeof window !== 'undefined' ? window.innerHeight : 0,
    });

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            setScreenSize({
                isMobile: width < 768,
                isTablet: width >= 768 && width < 1280,
                isAboveTablet: width >= 768,
                isLg: width >= 1024 && width < 1280,
                isDesktop: width >= 1280,
                width,
                height: window.innerHeight,
            });
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return screenSize;
};