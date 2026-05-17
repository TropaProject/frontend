// features/create-route/ui/CreateRouteStepNavigation.tsx
import { useCreateRouteStore } from "@/features/create-route/model/store";
import BaseButton, { type ButtonVariant } from "@/shared/components/ui/buttons/BaseButton";

interface Props {
    className?: string;
    firstButtonVariant?: ButtonVariant;
    firstButtonBgColor?: string;
    secondButtonBgColor?: string;
    secondButtonBorderColor?: string;
    onCreateRoute?: () => void;
    hasDescription?: boolean;
}

const CreateRouteStepNavigation = ({
    className,
    firstButtonVariant = 'secondary',
    firstButtonBgColor,
    secondButtonBgColor,
    secondButtonBorderColor,
    onCreateRoute,
    hasDescription,
}: Props) => {
    const currentStep = useCreateRouteStore((state) => state.currentStep);
    const totalSteps = useCreateRouteStore((state) => state.totalSteps);
    const nextStep = useCreateRouteStore((state) => state.nextStep);
    const prevStep = useCreateRouteStore((state) => state.prevStep);
    const isStepValid = useCreateRouteStore((state) => state.isStepValid);

    const isFirstStep = currentStep === 1;
    const isLastStep = currentStep === totalSteps;
    const isValid = isStepValid(currentStep);

    const handleNext = () => {
        if (!isLastStep) {
            nextStep();
            return;
        }
        if (hasDescription) {
            onCreateRoute?.();
        }
    };

    return (
        <div className={`flex items-center *:h-13 *:w-full *:max-w-1/2 sm:*:max-w-33.5 *:flex-1 justify-center gap-4 w-full ${className}`}>
            {!isFirstStep && (
                <BaseButton
                    variant={firstButtonVariant}
                    onClick={prevStep}
                    title="Предыдущий шаг"
                    bgColor={firstButtonBgColor}
                />
            )}
            <BaseButton
                variant="primary"
                onClick={handleNext}
                title={isLastStep ? "В путь!" : "Следующий шаг"}
                className={isFirstStep ? "max-w-33.5!" : ""}
                bgColor={secondButtonBgColor}
                borderColor={secondButtonBorderColor}
                disabled={!isValid || (isLastStep && !hasDescription)}
            />
        </div>
    );
};

export default CreateRouteStepNavigation;