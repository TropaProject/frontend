import clsx from "clsx";



import { BorderWrapper } from "@/shared/components/wrappers/BorderWrapper";
import VkIcon from "@/shared/components/ui/buttons/SocialLink/assets/icons/VkIcon";
import TgIcon from "@/shared/components/ui/buttons/SocialLink/assets/icons/TgIcon";
import GoogleIcon from "@/shared/components/ui/buttons/SocialLink/assets/icons/GoogleIcon";
import SocialLinkBorder from "@/shared/components/ui/buttons/SocialLink/assets/borders/SocialLinkBorder";

// Словарь иконок для удобного выбора
const icons = {
    vk: VkIcon,
    tg: TgIcon,
    google: GoogleIcon,
} as const;

type SocialName = keyof typeof icons;

interface SocialLinkProps {
    name: SocialName;
    href?: string;
    className?: string;
    iconColor?: string;
    bgColor?: string;
    borderColor?: string;
}

const SocialLink = ({
    name,
    href = "#",
    className,
    iconColor = "text-primary",
    bgColor = "fill-transparent",
    borderColor = "stroke-primary"
}: SocialLinkProps) => {
    const Icon = icons[name];

    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={clsx(
                "relative size-14 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95",
                iconColor,
                className
            )}
            aria-label={name}
        >
            <div className="relative z-10 size-8 flex items-center justify-center">
                <Icon className="w-full h-full" />
            </div>

            <BorderWrapper
                borderComponent={(props) => (
                    <SocialLinkBorder
                        {...props}
                        className={clsx(props.className, bgColor, borderColor)}
                    />
                )}
            />
        </a>
    );
};

export default SocialLink;