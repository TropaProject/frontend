import type { ReactNode } from "react"

type Props = {
    className?: string
    children: ReactNode
}

const HomeH2 = ({ className, children }: Props) => {
    return (
        <h2 className={`${className} text-secondary text-heading-2xl! leading-[0.9]! desktop:text-heading-4xl! flex flex-col`}>
            {children}
        </h2>
    )
}

export default HomeH2

