import ProgressBarBorder from "@/shared/components/ui/inputs/BaseProgressBar/assets/ProgressBarBorder";
import ProgressBarFill from "@/shared/components/ui/inputs/BaseProgressBar/assets/ProgressBarFill";

type Props = {
    className?: string;
    progress: number;
};

const BaseProgressBar = ({ className, progress }: Props) => {
    return (
        <div className={`flex flex-col relative w-full h-2.5 ${className}`}>
            <ProgressBarBorder preserveAspectRatio="none" className="absolute inset-0 w-full h-full z-20 text-text" />

            <div
                className="absolute inset-0 z-10 transition-all duration-500 ease-out overflow-hidden"
                style={{ width: `${progress}%` }}
            >
                <ProgressBarFill preserveAspectRatio="none" className="w-full h-full object-cover" />
            </div>
        </div>
    );
};

export default BaseProgressBar;