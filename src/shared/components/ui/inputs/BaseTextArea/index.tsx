// @/shared/components/ui/inputs/BaseTextArea/BaseTextArea.tsx
import { type TextareaHTMLAttributes, type Ref } from 'react';
import clsx from 'clsx';
import TextAreaBorder from '@/shared/components/ui/inputs/BaseTextArea/assets/borders/TextAreaBorder';

interface BaseTextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    containerClassName?: string;
    ref?: Ref<HTMLTextAreaElement>;
}

const BaseTextArea = ({
    label,
    error,
    className,
    containerClassName,
    ref,
    ...props
}: BaseTextAreaProps) => {
    return (
        <div className={clsx("relative w-full flex flex-col gap-1", containerClassName)}>
            {label && (
                <span className="text-body-xs text-secondary px-2 italic">
                    {label}
                </span>
            )}

            <div className="relative min-h-50 w-full flex p-4 pt-5">
                <TextAreaBorder
                    preserveAspectRatio='none'
                    className={clsx(
                        "absolute inset-0 w-full h-full pointer-events-none",
                        error ? "text-primary" : "text-secondary"
                    )}
                />

                <textarea
                    ref={ref}
                    className={clsx(
                        "relative z-10 w-full bg-transparent outline-none border-none resize-none",
                        "text-body-xs tablet:text-body-sm leading-[0.8]! text-text placeholder:text-text/80",
                        "scrollbar-hidden",
                        className
                    )}
                    {...props}
                />
            </div>

            {error && (
                <span className="text-[10px] text-primary font-body px-2">
                    {error}
                </span>
            )}
        </div>
    );
};

export default BaseTextArea;