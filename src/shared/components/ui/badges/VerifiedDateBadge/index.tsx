import FootIcon from "@/shared/assets/icons/FootIcon"
import PlaceInfoCheckedBorder from "@/shared/components/ui/badges/VerifiedDateBadge/assets/borders/VerifiedDateBadgeBorder"
import { BorderWrapper } from "@/shared/components/wrappers/BorderWrapper"
import clsx from "clsx"

type Props = {
    className?: string
    verifiedDate: string
    borderColor?: string
    variant?: 'default' | 'primary'
}

const VerifiedDateBadge = ({ className, verifiedDate, variant = 'default', borderColor = "text-text" }: Props) => {
    const isDefault = variant === 'default'
    return (
        <div className={clsx(className, isDefault ? 'absolute right-6 desktop:right-8 top-0.5 desktop:top-1.5' : '', ' z-20 flex w-full max-w-max')}>
            <div className=" relative flex flex-col items-center px-0.5 pb-0.5 w-full">
                <div className={clsx(isDefault ? 'bg-secondary rounded-b-lg text-body-sm desktop:pt-6 desktop:pb-4 px-4' : 'bg-primary rounded-lg text-body-xs w-full px-5', "leading-0 flex items-center justify-center mx-auto gap-2 py-2 text-background")}>
                    <FootIcon className='w-full max-w-3 tablet:max-w-max' />
                    <span>{verifiedDate}</span>
                </div>
                {isDefault && <BorderWrapper className={borderColor} borderComponent={PlaceInfoCheckedBorder} />}
            </div>
        </div>
    )
}

export default VerifiedDateBadge

