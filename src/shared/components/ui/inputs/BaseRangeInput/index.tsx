import ProgressBarBorder from "@/shared/components/ui/inputs/BaseProgressBar/assets/ProgressBarBorder";
import ProgressBarFill from "@/shared/components/ui/inputs/BaseProgressBar/assets/ProgressBarFill";
import ThumbIcon from "@/shared/components/ui/inputs/BaseRangeInput/assets/icons/ThumbIcon";
import clsx from "clsx";
import type { ChangeEvent } from "react";

type Props = {
    value: number;
    onChange?: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    className?: string;
};

const BaseRangeInput = ({ value, onChange, min = 0, max = 100, step = 1, className }: Props) => {
    const progress = ((value - min) / (max - min)) * 100;

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        onChange?.(Number(e.target.value));
        console.log(value)
    };

    return (
        <div className={clsx(!onChange && 'pointer-events-none', className, `relative w-full h-6 flex items-center`)}>
            <div className="relative w-full h-2.5">
                <ProgressBarBorder preserveAspectRatio="none" className="absolute inset-0 w-full h-full z-10 text-text pointer-events-none" />

                <div
                    className="absolute inset-0 z-0 overflow-hidden transition-all duration-100"
                    style={{ width: `${progress}%` }}
                >
                    <ProgressBarFill preserveAspectRatio="none" className="w-full h-full object-cover" />
                </div>
            </div>

            <div
                className="absolute z-30 pointer-events-none transition-all duration-100"
                style={{
                    left: `${progress}%`,
                    transform: value === min ? 'translate(-10%, 0)' : 'translate(-50%, 0)'
                }}
            >
                <ThumbIcon />
            </div>

            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={handleChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-40"
            />
        </div>
    );
};

export default BaseRangeInput;