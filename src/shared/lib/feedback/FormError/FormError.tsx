interface FormErrorProps {
    message?: string | null;
    className?: string;
}

export const FormError = ({ message, className = '' }: FormErrorProps) => {
    if (!message) return null;

    return (
        <p className={`text-red-500 text-sm text-center mx-auto ${className}`}>
            {message}
        </p>
    );
};