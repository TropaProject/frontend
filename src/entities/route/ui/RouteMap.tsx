// entities/route/ui/RouteMap.tsx
import { YandexMap } from '@/features/yandex-map/ui/YandexMap';
import { type RefObject } from 'react';

type Props = {
    className?: string;
    containerRef: RefObject<HTMLDivElement | null>;
    isMapLoaded: boolean;
    error?: string | null;
};

const RouteMap = ({ className, containerRef, isMapLoaded, error }: Props) => {
    return (
        <div className={`${className} min-h-[453px] flex flex-col w-full`}>
            <div className="relative min-h-[453px] h-full w-full flex">
                <svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 1205 453"
                    className="absolute inset-0 pointer-events-none"
                    preserveAspectRatio="none"
                >
                    <defs>
                        <clipPath id="customClip" clipPathUnits="objectBoundingBox">
                            <path
                                d="M0.978,0.907 C1.002,0.791 0.984,0.771 0.997,0.678 C1.009,0.586 0.974,0.458 0.986,0.374 C0.998,0.291 1.009,0.129 0.986,0.05 C0.957,-0.046 0.878,0.032 0.83,0.032 C0.795,0.032 0.55, -0.011 0.498,0.006 C0.455,0.02 0.271,0.029 0.224,0.029 C0.177,0.029 0.047, -0.035 0.023,0.03 C-0.032,0.183 0.05,0.283 0.023,0.352 C-0.011,0.443 0.003,0.561 0.003,0.762 C0.003,0.87 0.046,0.953 0.116,0.984 C0.153,0.999 0.266,0.984 0.318,0.984 C0.372,0.984 0.415,0.942 0.49,0.942 C0.535,0.942 0.648,0.994 0.762,0.999 C0.861,1.003 0.966,0.966 0.978,0.907Z"
                                transform="scale(0.995, 0.99) translate(0.0025, 0.005)"
                            />
                        </clipPath>
                        <clipPath id="strokeClip" clipPathUnits="objectBoundingBox">
                            <path d="M0.978,0.907 C1.002,0.791 0.984,0.771 0.997,0.678 C1.009,0.586 0.974,0.458 0.986,0.374 C0.998,0.291 1.009,0.129 0.986,0.05 C0.957,-0.046 0.878,0.032 0.83,0.032 C0.795,0.032 0.55, -0.011 0.498,0.006 C0.455,0.02 0.271,0.029 0.224,0.029 C0.177,0.029 0.047, -0.035 0.023,0.03 C-0.032,0.183 0.05,0.283 0.023,0.352 C-0.011,0.443 0.003,0.561 0.003,0.762 C0.003,0.87 0.046,0.953 0.116,0.984 C0.153,0.999 0.266,0.984 0.318,0.984 C0.372,0.984 0.415,0.942 0.49,0.942 C0.535,0.942 0.648,0.994 0.762,0.999 C0.861,1.003 0.966,0.966 0.978,0.907Z" />
                        </clipPath>
                    </defs>
                </svg>

                <div
                    className="absolute inset-0 min-h-[453px]"
                    style={{ clipPath: 'url(#strokeClip)', backgroundColor: '#3A3B70', zIndex: 5 }}
                />

                <div className="absolute inset-0" style={{ clipPath: 'url(#customClip)', zIndex: 10 }}>
                    <YandexMap
                        ref={containerRef}
                        isLoaded={isMapLoaded}
                        error={error}
                        className="w-full h-full"
                    />
                </div>
            </div>
        </div>
    );
};

export default RouteMap;