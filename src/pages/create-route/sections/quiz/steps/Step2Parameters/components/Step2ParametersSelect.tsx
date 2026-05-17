import { time_options } from "@/pages/create-route/sections/quiz/steps/Step2Parameters/lib/constants";
import BaseSelect, { type Option } from "@/shared/components/ui/inputs/BaseSelect";

type Props = {
    timeOfDay?: Option;
    setTimeOfDay: (option: Option) => void;
}


const Step2ParametersSelect = ({ timeOfDay, setTimeOfDay }: Props) => {
    return (
        <div className="flex flex-col w-full">
            <BaseSelect
                options={time_options}
                value={timeOfDay}
                onChange={setTimeOfDay}
                placeholder="Выбери время суток"
            />
        </div>
    );
};

export default Step2ParametersSelect;