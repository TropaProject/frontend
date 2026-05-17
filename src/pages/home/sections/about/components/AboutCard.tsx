import AboutCardBorder from "@/pages/home/sections/about/assets/borders/AboutCardBorder"
import { BorderWrapper } from "@/shared/components/wrappers/BorderWrapper"
import type { HTMLAttributes, ReactNode } from "react"

type Props = HTMLAttributes<HTMLElement> & {
    className?: string
    data: {
        title: ReactNode,
        description: string
    }
}

const AboutCard = ({ className, data }: Props) => {
    const { title, description } = data

    return (
        <div className={`${className} w-full relative px-1 py-0.5 desktop:pl-2 desktop:py-1 max-w-mobile`}>
            <BorderWrapper borderComponent={AboutCardBorder} />

            <div className="w-full h-full flex flex-col gap-2 desktop:gap-4 p-6 sm:pb-3 desktop:py-8 bg-background/88 rounded-2xl ">
                <h3 className="text-primary text-heading-sm! desktop:text-heading-lg! desktop:max-w-4/5 break-words w-full">{title}</h3>
                <p className="text-body-xs text-text desktop:text-body-lg desktop:leading-[1.1]">{description}</p>
            </div>
        </div>
    )
}

export default AboutCard