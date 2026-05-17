import HeartIconEmpty from "@/shared/assets/icons/HeartIconEmpty";
import HeartIconFilled from "@/shared/assets/icons/HeartIconFilled";
import clsx from "clsx";

interface FavoriteButtonProps {
    isFavorite: boolean;
    onToggle: () => void;
    className?: string;
}

export const FavoriteButton = ({ isFavorite, onToggle, className }: FavoriteButtonProps) => {
    return (
        <button
            type="button"
            onClick={onToggle}
            className={clsx(
                "hover:scale-110 transition-transform",
                className
            )}
        >
            {isFavorite ? (
                <HeartIconFilled className="w-6 h-6" />
            ) : (
                <HeartIconEmpty className="w-6 h-6" />
            )}

        </button>
    );
};