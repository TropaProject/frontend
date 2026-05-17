import PageWrapper from '@/shared/components/wrappers/PageWrapper'

const PrivacyPolicyPage = () => {
    return (
        <PageWrapper className="pb-40 items-center overflow-hidden">
            <div className="relative w-full max-w-[940px] mx-auto px-5 tablet:px-7 desktop:px-10 pt-32 pb-20 flex flex-col items-start gap-8">
                <div className="absolute inset-x-0 top-20 mx-auto w-full max-w-[760px] h-[320px] rounded-[3rem] bg-primary/10 blur-3xl pointer-events-none" />
                <div className="relative z-10 w-full">
                    <p className="text-sm uppercase tracking-[0.3em] text-primary font-semibold mb-3">Политика конфиденциальности</p>
                    <h1 className="text-heading-xl tablet:text-heading-4xl desktop:text-heading-5xl text-primary leading-tight">
                        Тропа уважает твою личную информацию и использует её только для удобства прогулки
                    </h1>
                </div>

                <div className="relative z-10 flex flex-col gap-12 w-full text-body-lg text-secondary leading-8">
                    <section className="flex flex-col gap-4 max-w-[75ch]">
                        <h2 className="text-heading-xl text-primary">Какие данные мы собираем</h2>
                        <p>
                            Мы собираем только нужные данные, чтобы помогать создавать маршруты: имя, e-mail, город, предпочтения, история маршрутов и отзывы. Никаких лишних данных не храним.
                        </p>
                    </section>

                    <section className="flex flex-col gap-4 max-w-[75ch]">
                        <h2 className="text-heading-xl text-primary">Зачем это нужно</h2>
                        <p>
                            Данные помогают нам подбирать маршруты, рекомендовать места, сохранять твои отзывы и показывать персональный контент. Если ты зарегистрирован, мы используем данные для управления профилем и истории маршрутов.
                        </p>
                    </section>

                    <section className="flex flex-col gap-4 max-w-[75ch]">
                        <h2 className="text-heading-xl text-primary">Как мы защищаем информацию</h2>
                        <p>
                            Мы используем стандартные методы защиты данных, чтобы никто посторонний не получил доступ к твоей информации. Доступ к ней имеют только сотрудники сервиса и технические партнеры, которые обеспечивают работу сайта.
                        </p>
                    </section>

                    <section className="flex flex-col gap-4 max-w-[75ch]">
                        <h2 className="text-heading-xl text-primary">Cookies и технические данные</h2>
                        <p>
                            Мы можем использовать cookie и техническую информацию браузера для улучшения работы сайта, сохранения настроек и аналитики. Это помогает быстрее загружать страницы и сохранять твой выбор.
                        </p>
                    </section>

                    <section className="flex flex-col gap-4 max-w-[75ch]">
                        <h2 className="text-heading-xl text-primary">Контакты</h2>
                        <p>
                            Если хочешь узнать подробнее или удалить свои данные, напиши нам: info@tropa.com
                        </p>
                    </section>
                </div>
            </div>
        </PageWrapper>
    )
}

export default PrivacyPolicyPage
