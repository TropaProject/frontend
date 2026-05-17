// @/entities/filter/ui/FilterCheckbox.tsx
import { Field, Label } from '@headlessui/react';
import clsx from "clsx";
import { BaseCheckbox } from "@/shared/components/ui/inputs/BaseCheckbox";

interface Props {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    className?: string;
}

export const FilterCheckbox = ({ label, checked, onChange, className }: Props) => {
    return (
        <Field className={clsx("flex items-center gap-1 cursor-pointer", className)}>
            <BaseCheckbox
                checked={checked}
                onChange={onChange}
            />
            <Label className="text-text text-body-sm leading-none cursor-pointer select-none">
                {label}
            </Label>
        </Field>
    );
};