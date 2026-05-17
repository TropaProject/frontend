import { MOOD_OPTIONS } from "@/pages/create-route/sections/quiz/steps/Step3Activities/lib/constants";
import BaseSelect, { type Option } from "@/shared/components/ui/inputs/BaseSelect";

type Props = {
    mood?: Option;
    setMood: (option: Option) => void;
}

const Step3ParametersSelect = ({ mood, setMood }: Props) => {
    return (
        <div className="flex flex-col w-full">
            <BaseSelect
                options={MOOD_OPTIONS}
                value={mood}
                onChange={setMood}
                placeholder="Выбери настроение"
            />
        </div>
    );
};

export default Step3ParametersSelect;