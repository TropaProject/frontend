import { Link } from 'react-router-dom'
import clsx from 'clsx'
import type { User } from '@/entities/user/model/types'
import type { LinkPropsOptional } from '@/shared/types'
import { UserAvatar } from '@/shared/components/ui/avatar/UserAvatar'
import { formatImageUrl } from '@/shared/lib/formatImageUrl'

type Props = {
    className?: string
    user: User
    avatarStrokeColor?: string
    textClasses?: string
    showName?: boolean
    avatarSize?: 'sm' | 'md' | 'lg' | 'xl',
    onClick?: () => void
} & LinkPropsOptional

const UserAvatarAndNickname = ({
    className,
    user,
    avatarStrokeColor = 'text-primary',
    textClasses = 'text-background',
    showName = true,
    avatarSize = 'md',
    to = "/user/me",
    onClick,
    ...props
}: Props) => {
    return (
        <Link
            to={to}
            onClick={onClick}
            className={clsx('flex items-center gap-2 group transition-all', className)}
            {...props}
        >
            <UserAvatar
                src={formatImageUrl(user.avatar)}
                name={user.username}
                size={avatarSize}
                strokeColor={avatarStrokeColor}
                className="group-hover:scale-105 transition-transform duration-300"
            />

            {showName && (
                <span className={clsx(
                    'text-body-sm transition-colors',
                    textClasses
                )}>
                    {user.username}
                </span>
            )}
        </Link>
    )
}

export default UserAvatarAndNickname