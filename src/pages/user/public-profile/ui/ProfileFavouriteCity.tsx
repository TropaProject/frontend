import MoscowImg from '@/pages/create-route/sections/hero/assets/images/create-route-hero-2.png';
import SpbImg from '@/pages/auth/assets/images/create-route-hero-2-desktop.jpg';

type Props = {
    className?: string
    cityName?: string | null
}

const ProfileFavouriteCity = ({ className, cityName }: Props) => {
    const cityImage = cityName?.toLowerCase() === 'москва' ? MoscowImg : SpbImg

    return (
        <div className={`${className} ${cityName && 'pb-58'} flex flex-col justify-center items-center relative w-full desktop:max-w-max gap-2 desktop:mt-10`}>
            <h2 className='text-primary desktop:text-heading-lg! text-center z-10'>Любимый город</h2>
            <p className='text-body-sm text-secondary desktop:text-body-lg z-10'>{cityName ?? "Неизвестно"}</p>

            {cityName && (
                <div
                    className='absolute h-full mx-auto bottom-0 desktop:-bottom-10'
                >
                    <img
                        src={cityImage}
                        alt="изоборажение на фоне"
                        className='h-full w-full object-contain scale-70 tablet:scale-90'
                    />
                </div>
            )}
        </div>
    )
}

export default ProfileFavouriteCity
