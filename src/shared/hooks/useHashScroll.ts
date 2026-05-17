// hooks/useHashScroll.ts
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { scroller } from 'react-scroll';

export const useHashScroll = () => {
    const { hash, pathname } = useLocation();

    useEffect(() => {
        if (pathname !== '/') return;

        if (hash) {
            const sectionId = hash.replace('#', '');
            setTimeout(() => {
                scroller.scrollTo(sectionId, {
                    smooth: true,
                    duration: 500,
                    offset: -80,
                });
            }, 100);
        }
    }, [hash, pathname]);
};
