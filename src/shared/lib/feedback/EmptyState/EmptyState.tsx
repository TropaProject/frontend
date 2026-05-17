import BaseButton from "@/shared/components/ui/buttons/BaseButton";
import clsx from "clsx";
import { Link } from "react-router-dom";

export const EmptyState = ({ className, message, actionLabel, actionTo, onClick }: { className?: string, message: string; actionLabel?: string; actionTo?: string, onClick?: () => void }) => (
    <div className={clsx(className, "flex flex-col items-center gap-4 py-12 text-center")}>
        <p className="text-text text-body-sm desktop:text-body-lg">{message}</p>
        {(onClick || actionTo) && actionLabel && (
            <BaseButton as={Link} onClick={onClick} to={actionTo} variant="primary" size="xl" className="w-full">
                {actionLabel}
            </BaseButton>
        )}
    </div>
);