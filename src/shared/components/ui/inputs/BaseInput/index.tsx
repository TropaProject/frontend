import InputBorder from '@/shared/components/ui/inputs/BaseInput/borders/InputBorder';
import { Input, Field, Description } from '@headlessui/react';
import type { InputHTMLAttributes, Ref } from 'react';
import clsx from 'clsx';

interface BaseInputProps extends InputHTMLAttributes<HTMLInputElement> {
    error?: string;
    containerClassName?: string;
    helperText?: string;
    ref?: Ref<HTMLInputElement>;
}

const BaseInput = ({
    error,
    helperText,
    className,
    containerClassName,
    type = 'text',
    ref,
    ...props
}: BaseInputProps) => {
    return (
        <Field className={clsx("relative w-full flex flex-col gap-1", containerClassName)}>
            {/* {label && (
                <Label className="text-body-xs text-secondary px-2 italic">
                    {label}
                </Label>
            )} */}

            <div className="relative w-full flex py-0.5">
                <InputBorder
                    preserveAspectRatio="none"
                    className={clsx(
                        "absolute inset-0 w-full h-full pointer-events-none transition-colors z-10",
                        error ? "text-primary" : "text-secondary"
                    )}
                />
                <div className='relative bg-background w-full justify-center rounded-3xl overflow-hidden flex flex-col h-full min-h-11 desktop:min-h-15 z-0'>
                    <Input
                        ref={ref}
                        type={type}
                        className={clsx(
                            "absolute inset-0 z-10 w-full h-full bg-transparent outline-none border-none px-4",
                            "tablet:text-body-sm! text-text placeholder:text-text/60",
                            "disabled:opacity-50",
                            className
                        )}
                        {...props}
                    />
                </div>
            </div>

            {(error || helperText) && (
                <Description className={clsx(
                    "text-[10px] desktop:text-body-xs font-body px-2",
                    error ? "text-primary" : "text-secondary opacity-70"
                )}>
                    {error || helperText}
                </Description>
            )}
        </Field>
    );
};

export default BaseInput;