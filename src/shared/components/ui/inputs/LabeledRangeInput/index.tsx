import BaseRangeInput from "@/shared/components/ui/inputs/BaseRangeInput";
import clsx from "clsx";

interface LabeledRangeInputProps {
    className?: string;
    label?: string;
    valueText?: string;
    hintStart?: string;
    hintEnd?: string;
    min?: number;
    max?: number;
    step?: number;
    value: number;
    onChange?: (val: number) => void;
}

export const LabeledRangeInput = ({
    className,
    label,
    valueText,
    hintStart,
    hintEnd,
    min = 1,
    max = 4,
    step = 1,
    value,
    onChange,
}: LabeledRangeInputProps) => (
    <div className={clsx("flex flex-col gap-1 text-secondary", className)}>
        {(label || valueText) && (
            <div className="flex justify-between items-end text-body-sm desktop:text-body-lg">
                {label && <span>{label}</span>}
                {valueText && <span>{valueText}</span>}
            </div>
        )}

        <BaseRangeInput
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={onChange}
        />

        {(hintStart || hintEnd) && (
            <div className="flex w-full justify-between gap-2">
                {hintStart && (
                    <p className="text-body-xs leading-tight max-w-[66%] opacity-60">
                        {hintStart}
                    </p>
                )}
                {hintEnd && (
                    <p className="text-body-xs leading-tight max-w-[66%] opacity-60">
                        {hintEnd}
                    </p>
                )}
            </div>
        )}
    </div>
);