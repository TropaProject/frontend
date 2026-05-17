// @/widgets/FilterManager/ui/FilterContent.tsx
import Accordion from "@/shared/components/ui/accordions/Accordion";
import { ROUTE_FILTERS } from "@/widgets/FilterManager/model/mock";
import { FilterCheckbox } from "@/widgets/FilterManager/ui/FilterCheckbox";

interface FilterContentProps {
    type: 'mobile' | 'tablet';
    selected: string[];
    onToggle: (id: string) => void;
}

export const FilterContent = ({ type, selected, onToggle }: FilterContentProps) => {
    if (type === 'tablet') {
        return (
            <div className="flex flex-col gap-4">
                {ROUTE_FILTERS.map((section) => (
                    <div key={section.id} className="flex flex-col gap-3">
                        <h4 className="text-body-lg! text-primary font-medium px-5">
                            {section.title}
                        </h4>
                        <div className="flex flex-col gap-2 px-5">
                            {section.options.map((option) => (
                                <FilterCheckbox
                                    key={option.id}
                                    label={option.label}
                                    checked={selected.includes(option.id)}
                                    onChange={() => onToggle(option.id)}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full gap-2">
            {ROUTE_FILTERS.map((section, index) => (
                <Accordion
                    key={section.id}
                    title={section.title}
                    defaultOpen={index === 0}
                    contentInnerPadding="px-5.5! pb-2!"
                    titleColor="text-primary"
                >
                    <div className="flex flex-col gap-2 pt-2 pb-4">
                        {section.options.map((option) => (
                            <FilterCheckbox
                                key={option.id}
                                label={option.label}
                                checked={selected.includes(option.id)}
                                onChange={() => onToggle(option.id)}
                            />
                        ))}
                    </div>
                </Accordion>
            ))}
        </div>
    );
};