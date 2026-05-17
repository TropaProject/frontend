import clsx from 'clsx'

interface BaseBadgeProps {
    children: React.ReactNode
    className?: string
}

export const BaseBadge = ({ children, className }: BaseBadgeProps) => {
    return (
        <div className={clsx(
            "rounded-lg h-10 px-6 bg-secondary text-body-xs text-background flex items-center max-w-max",
            className
        )}>
            {children}
        </div>
    )
}