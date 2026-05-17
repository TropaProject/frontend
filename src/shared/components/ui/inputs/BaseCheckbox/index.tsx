// @/shared/components/ui/inputs/BaseCheckbox/index.tsx
import { Checkbox } from '@headlessui/react';
import clsx from 'clsx';
import { BorderWrapper } from '@/shared/components/wrappers/BorderWrapper';
import CheckIcon from '@/shared/components/ui/inputs/BaseCheckbox/assets/icons/CheckIcon';
import CheckboxBorder from '@/shared/components/ui/inputs/BaseCheckbox/assets/borders/CheckboxBorder';

interface BaseCheckboxProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    className?: string;
    disabled?: boolean;
}

export const BaseCheckbox = ({ checked, onChange, className, disabled }: BaseCheckboxProps) => {
    return (
        <Checkbox
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            className={clsx(
                "relative flex h-3.5 w-3.5 shrink-0 items-center justify-center cursor-pointer focus:outline-none",
                className
            )}
        >
            <CheckIcon
                className={clsx(
                    "left-0.5 bottom-0.25 w-4 h-4 z-10 absolute transition-opacity duration-100",
                    checked ? "opacity-100" : "opacity-0"
                )}
            />

            <BorderWrapper
                borderComponent={CheckboxBorder}
                className="w-full h-full text-secondary"
            />
        </Checkbox>
    );
};