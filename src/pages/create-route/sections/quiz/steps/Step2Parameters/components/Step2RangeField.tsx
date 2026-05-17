import { LabeledRangeInput } from "@/shared/components/ui/inputs/LabeledRangeInput";

interface Step2RangeFieldProps {
    className?: string;
    label?: string;
    valueText?: string;
    hintStart?: string;
    hintEnd?: string;
    min?: number;
    max?: number;
    step?: number;
    value: number;
    onChange: (val: number) => void;
}

const Step2RangeField = ({
    hintStart,
    hintEnd,
    ...props
}: Step2RangeFieldProps) => (
    <LabeledRangeInput
        hintStart={hintStart}
        hintEnd={hintEnd}
        {...props}
    />
);

export default Step2RangeField;