
import SocialLink from "@/shared/components/ui/buttons/SocialLink"
import clsx from "clsx"

type Props = {
    className?: string
}

const FormSocialLinks = ({ className }: Props) => {
    return (
        <ul className={clsx(className, "flex my-2 gap-2 *:hover:scale-97 *:transition-transform *:duration-300")}>
            <li>
                <SocialLink
                    name="vk"
                    bgColor="fill-background"
                    borderColor="stroke-primary"
                    iconColor="text-primary"
                />
            </li>
            <li>
                <SocialLink
                    bgColor="fill-background"
                    borderColor="stroke-primary"
                    iconColor="text-primary"
                    name="google"
                />
            </li>
        </ul>
    )
}

export default FormSocialLinks