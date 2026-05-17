import BaseButtonBg from '@/shared/components/ui/buttons/BaseButton/assets/backgrounds/BaseButtonBg'
import BaseButtonBorder from '@/shared/components/ui/buttons/BaseButton/assets/borders/BaseButtonBorder'
import type { LinkPropsOptional } from '@/shared/types'
import { Button as HeadlessButton } from '@headlessui/react'
import type { ReactNode, ComponentPropsWithoutRef, ElementType } from 'react'
import clsx from 'clsx'

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary'
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl'

interface CustomButtonProps {
    title?: string
    variant?: ButtonVariant
    fullWidth?: boolean
    loading?: boolean
    disabled?: boolean
    leftIcon?: ReactNode
    rightIcon?: ReactNode
    bgColor?: string
    customBg?: ReactNode
    borderColor?: string
    textColor?: string
    className?: string
    children?: ReactNode
    as?: ElementType

    size?: ButtonSize
}


type CombinedProps = CustomButtonProps &
    Omit<ComponentPropsWithoutRef<'button'>, keyof CustomButtonProps> &
    Omit<LinkPropsOptional, keyof CustomButtonProps>

const bgToTextClass = (bgClass?: string): string => bgClass?.replace(/^bg-/, 'text-') || ''
const borderToTextClass = (borderClass?: string): string => borderClass?.replace(/^border-/, 'text-') || ''

const BaseButton = ({
    as: Component = 'button',
    customBg,
    title,
    variant = 'primary',
    fullWidth = false,
    loading = false,
    disabled = false,
    leftIcon,
    rightIcon,
    bgColor,
    borderColor,
    textColor,
    className,
    children,

    size = 'md',
    ...props
}: CombinedProps) => {

    const heightMap: Record<ButtonSize, string> = {
        sm: 'h-8.5',
        md: 'h-10',
        lg: 'h-12.75',
        xl: 'h-14'
    }

    const sizeClasses = clsx(
        'relative',
        fullWidth ? 'w-full min-w-full' : 'max-w-40 min-w-10',
        heightMap[size],
        'desktop:h-12.75'
    )

    const textClasses = 'text-center font-body font-stretch-condensed font-normal text-xs desktop:text-sm leading-[110%]'

    const defaultColors = {
        primary: { bg: 'bg-primary', border: 'border-primary', text: 'text-background' },
        secondary: { bg: 'bg-background', border: 'border-primary', text: 'text-primary' },
        tertiary: { bg: 'bg-secondary', border: 'border-background', text: 'text-background' }
    }

    const finalBgClass = bgColor || defaultColors[variant].bg
    const finalBorderClass = borderColor || defaultColors[variant].border
    const finalTextClass = textColor || defaultColors[variant].text

    const svgBgClass = bgToTextClass(finalBgClass)
    const svgBorderClass = borderToTextClass(finalBorderClass)

    return (
        <HeadlessButton
            as={Component as ElementType}
            disabled={disabled || loading}
            className={clsx(
                'relative transition-all cursor-pointerduration-300 pt-[0.12rem] pb-[0.07rem] flex items-center justify-center',
                'outline-none hover:scale-97 disabled:opacity-50 disabled:cursor-not-allowed',
                'active:scale-95 transform transition-transform',
                sizeClasses,
                textClasses,
                finalTextClass,
                className
            )}
            {...props}
        >
            <div className='flex flex-row items-center justify-center relative w-full h-full px-3 py-2'>
                <span className="relative ring-offset-2 z-20 flex items-center justify-center gap-3">
                    {loading && (
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                    )}
                    {!!(!loading && leftIcon) && <span className="inline-flex">{leftIcon}</span>}
                    {title && <span>{title}</span>}
                    {children}
                    {!!(!loading && rightIcon) && <span className="inline-flex">{rightIcon}</span>}
                </span>

                {!customBg ? <BaseButtonBg fullWidth={fullWidth} svgBgClass={svgBgClass} /> : customBg}
            </div>

            {!customBg && <BaseButtonBorder fullWidth={fullWidth} svgBorderClass={svgBorderClass} />}
        </HeadlessButton>
    )
}

BaseButton.displayName = 'BaseButton'

export default BaseButton