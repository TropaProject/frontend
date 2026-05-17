import BuildingIcon from '@/shared/components/ui/badges/CityBadge/assets/BuildingIcon'
import clsx from 'clsx'

export const CityBadge = ({ className, city }: { className?: string, city: string }) => (
    <div className={clsx('absolute left-3 top-3 z-20', className)}>
        <div className='relative flex flex-row bg-primary px-4 py-2 text-background text-body-xs rounded-sm'>
            <BuildingIcon className='absolute left-1.5 top-0.5 -translate-1/2' />
            {city}
        </div>
    </div>
)