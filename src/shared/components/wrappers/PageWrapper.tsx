import type { ReactNode, HTMLAttributes } from "react"

type Props = HTMLAttributes<HTMLElement> & {
    children: ReactNode
}

const PageWrapper = ({ className, children, ...props }: Props) => {
    return (
        <main
            className={`${className} desktop:min-h-auto flex flex-col items-center overflow-hidden tablet:overflow-visible max-w-mobile mobile:max-w-[clamp(360px,100vw,1280px)] w-full mx-auto`}
            {...props}
        >
            {children}
        </main>
    )
}

export default PageWrapper