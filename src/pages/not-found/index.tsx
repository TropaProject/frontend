import { useNavigate } from 'react-router-dom'
import BaseButton from '@/shared/components/ui/buttons/BaseButton'
import PageWrapper from '@/shared/components/wrappers/PageWrapper'

const NotFoundPage = () => {
    const navigate = useNavigate()

    return (
        <PageWrapper className="pb-40 items-center overflow-hidden">
            <div className="relative w-full max-w-[900px] mx-auto px-5 tablet:px-7 desktop:px-10 pt-32 pb-20 flex flex-col items-center text-center gap-6">
                <div className="absolute inset-x-0 top-14 mx-auto w-full max-w-[720px] h-[360px] rounded-[3rem] bg-primary/10 blur-3xl pointer-events-none" />

                <div className="relative z-10 w-full max-w-[40rem]">
                    <p className="text-[clamp(3.5rem,12vw,7rem)] font-black leading-none text-primary">404</p>
                    <h1 className="text-heading-3xl tablet:text-heading-4xl desktop:text-heading-5xl text-primary mt-4 leading-tight">
                        Кажется, этой тропы не существует
                    </h1>
                    <p className="mt-4 text-body-lg text-secondary max-w-[36rem] mx-auto leading-7">
                        Мы не нашли страницу по этому пути. Вернись на главную и выбери новое приключение
                    </p>
                </div>

                <div className="relative z-10 flex flex-col items-center gap-3 mt-8">
                    <BaseButton onClick={() => navigate('/')} className="min-w-[220px] px-1" size="lg">
                        На главную
                    </BaseButton>
                    <span className="text-xs text-secondary/70">Если хочешь, попробуй другой маршрут</span>
                </div>
            </div>
        </PageWrapper>
    )
}

export default NotFoundPage
