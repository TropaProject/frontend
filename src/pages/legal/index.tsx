import PageWrapper from '@/shared/components/wrappers/PageWrapper'

const LegalPage = () => {
    return (
        <PageWrapper className="pb-40 items-center overflow-hidden">
            <div className="relative w-full max-w-[940px] mx-auto px-5 tablet:px-7 desktop:px-10 pt-32 pb-20 flex flex-col items-start gap-8">
                <div className="absolute inset-x-0 top-20 mx-auto w-full max-w-[760px] h-[320px] rounded-[3rem] bg-background/10 blur-3xl pointer-events-none" />
                <div className="relative z-10 w-full">
                    <p className="text-sm uppercase tracking-[0.3em] text-primary font-semibold mb-3">Юридическая информация</p>
                    <h1 className="text-heading-xl tablet:text-heading-4xl desktop:text-heading-5xl text-primary leading-tight">
                        Правила и условия использования сервиса &laquo;Тропа&raquo;
                    </h1>
                </div>

                <div className="relative z-10 flex flex-col gap-12 w-full text-body-lg text-secondary leading-8">
                    <section className="flex flex-col gap-4 max-w-[75ch]">
                        <h2 className="text-heading-xl text-primary">Общее</h2>
                        <p>
                            Сервис «Тропа» предоставляет платформу для создания прогулочных маршрутов по городу. Используя сайт, ты принимаешь условия и правила, описанные в этой странице.
                        </p>
                    </section>

                    <section className="flex flex-col gap-4 max-w-[75ch]">
                        <h2 className="text-heading-xl text-primary">Авторские права</h2>
                        <p>
                            Контент сайта, логотипы и текстовые материалы принадлежат сервису «Тропа» или его партнерам. Копирование без разрешения запрещено.
                        </p>
                    </section>

                    <section className="flex flex-col gap-4 max-w-[75ch]">
                        <h2 className="text-heading-xl text-primary">Ограничение ответственности</h2>
                        <p>
                            Мы стараемся предоставлять актуальную информацию о местах и маршрутах, но не несем ответственности за изменения в работе заведений, погодные условия или личные предпочтения. Все рекомендации носят информативный характер.
                        </p>
                    </section>

                    <section className="flex flex-col gap-4 max-w-[75ch]">
                        <h2 className="text-heading-xl text-primary">Использование сервиса</h2>
                        <p>
                            Запрещено использовать «Тропу» для публикации незаконного контента, спама или действий, нарушающих права третьих лиц. За нарушение правил доступ к сервису может быть ограничен.
                        </p>
                    </section>

                    <section className="flex flex-col gap-4 max-w-[75ch]">
                        <h2 className="text-heading-xl text-primary">Контакты</h2>
                        <p>
                            Если у тебя есть юридические вопросы, отправь письмо на info@tropa.com
                        </p>
                    </section>
                </div>
            </div>
        </PageWrapper>
    )
}

export default LegalPage
