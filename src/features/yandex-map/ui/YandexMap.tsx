// features/yandex-map/ui/YandexMap.tsx
import { FormError } from '@/shared/lib/feedback/FormError';
interface YandexMapProps {
    isLoaded: boolean;
    error?: string | null;
    className?: string;
    loadingMessage?: string;
}

export const YandexMap = ({ ref, isLoaded, error, className = '', loadingMessage = 'жду достопримечательности' }: YandexMapProps & { ref?: React.RefObject<HTMLDivElement | null> }) => {
    return (
        <div className={`relative w-full h-full ${className}`}>
            {!isLoaded && !error && (
                <div
                    className="absolute inset-0 w-full object-cover h-[453px] bg-text/70 backdrop-blur-[4px] flex flex-col"
                    style={{
                        clipPath: 'url(#customClip)',
                        zIndex: 10,
                    }}
                >
                    <p className="text-heading-xl text-primary m-auto self-center animate-pulse max-w-max">
                        {loadingMessage}
                    </p>
                </div>
            )}

            {error && (
                <div className="absolute inset-0 *:text-heading-xl! text-primary clamp z-10 drop-shadow-2xl flex items-center justify-center bg-text/70 backdrop-blur-[4px] ">
                    <FormError message={error} />
                </div>
            )}

            <div ref={ref} className="w-full h-full absolute inset-0" />
        </div>
    );
};

YandexMap.displayName = 'YandexMap';