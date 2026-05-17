// shared/lib/feedback/Loader/Loader.tsx

interface LoaderProps {
    message?: string;
    className?: string;
}

export const Loader = ({ message, className = '' }: LoaderProps) => {
    return (
        <div className={`flex flex-col items-center justify-center gap-3 py-8 mx-auto ${className}`}>
            <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
            {message && (
                <p className="text-text/60 text-body-sm desktop:text-body-lg">{message}</p>
            )}
        </div>
    );
};
