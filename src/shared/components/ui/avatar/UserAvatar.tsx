import clsx from 'clsx'
import { BorderWrapper } from '@/shared/components/wrappers/BorderWrapper'
import AvatarBorder from '@/shared/components/ui/avatar/assets/borders/AvatarBorder'
import UserIcon from '@/widgets/header/assets/icons/UserIcon'

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl'

interface UserAvatarProps {
    src?: string
    name?: string
    size?: AvatarSize
    strokeColor?: string
    className?: string
    onClick?: () => void
}

export const UserAvatar = ({
    src,
    name,
    size = 'md',
    strokeColor = 'text-primary',
    className,
    onClick
}: UserAvatarProps) => {
    const sizeClasses = {
        sm: 'size-8 max-w-8',
        md: 'size-11 max-w-11',
        lg: 'size-14 max-w-14',
        xl: 'size-33 max-w-33'
    }

    return (
        <div
            onClick={onClick}
            className={clsx('relative flex py-0.5 pl-0.5 flex-shrink-0', className)}
        >
            <div className={clsx(
                sizeClasses[size],
                "rounded-full aspect-square overflow-hidden object-contain relative bg-transparent"
            )}>
                {src ? (
                    <img
                        src={src}
                        alt={name || 'User avatar'}
                        className='w-full h-full'
                    />
                ) : (
                    <UserIcon className={clsx('w-full h-full absolute inset-0 scale-50', strokeColor)} />
                )}

            </div>

            <BorderWrapper borderComponent={AvatarBorder} className={strokeColor} />
        </div>
    )
}