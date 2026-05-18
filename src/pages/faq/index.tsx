// pages/faq/index.tsx
import FaqHeroBg from "@/pages/faq/assets/backgrounds/FaqHeroBg";
import PageWrapper from "@/shared/components/wrappers/PageWrapper";
import Accordion from "@/shared/components/ui/accordions/Accordion";

import FaqDove from "@/pages/faq/assets/visual/faq-dove.png";
import FaqDoveThoughts from "@/pages/faq/assets/visual/FaqDoveThoughts";
import FaqMarquee from "@/pages/faq/assets/visual/FaqMarquee";

const faqData = [
    {
        id: 1,
        question: "Что такое Тропа?",
        answer: "Must have сервис для прогулок по городу. Ты рассказываешь мне какое у тебя настроение, интересы, бюджет и погода, а я за секунды создаю персональный прогулочный маршрут по городу",
    },
    {
        id: 2,
        question: "Это вообще бесплатно?",
        answer: "Прикинь! Офигенный функционал за 0руб. Маршрут собирается бесплатно. Платить за воздух не заставляем — гуляй спокойно.",
    },
    {
        id: 3,
        question: "Я могу пользоваться Тропой зимой?",
        answer: "Ну естеееественно. Я тут круглый год и в курсе всех крутых сезонных развлечений. При построении маршрута я учитываю погоду и время года. Так что можешь не сомневаться, что зимой я помогу создать новогодний вайб, а весной мы может даже зарулим на фестиваль",
    },
    {
        id: 4,
        question: "А если я плохо знаю город? Ты сможешь помочь найти необычные места в городе?",
        answer: "Для этого я тут и есть. Я каждый день пролетаю тысячи мест и самые кайфовые отмечаю бейджем «Городская жемчужина». Если захочешь, мы сможем построить маршрут только из таких мест. Покажу места, куда обычно доходят только местные (и голуби).",
    },
    {
        id: 5,
        question: "Это для туристов или для своих?",
        answer: "Тропа для тех, кто хочет гулять, получая эмоции и новые впечатления. Хоть ты тут живёшь всю жизнь, хоть просто заехал на выходные.",
    },
    {
        id: 6,
        question: "Это ИИ? Он вообще понимает, что делает?",
        answer: "Понимает. Я не гадаю на кофейной гуще. Я смотрю на город, твои интересы и собираю маршрут так, как это сделал бы знакомый, который тут живёт и знает, куда идти. Лишь бы ты гулял без лишней траты времени.",
    },
    {
        id: 7,
        question: "Это только для долгих прогулок?",
        answer: "Нет, не только. Хочешь час — будет час. Полдня зависать по городу? Тоже без проблем. Ты задаёшь настроение, а я создаю атмосферный маршрут.",
    },
    {
        id: 8,
        question: "Нужно ли подключение к интернету?",
        answer: "Не обязательно. Маршрут можно сохранить, взять с собой и гулять даже там, где связь отказывается работать.",
    },
    {
        id: 9,
        question: "А что с погодой?",
        answer: "Не переживай, я подскажу, куда сходить даже если дождь идёт. Гоша знает все тёплые уголки и уютные местечки города.",
    },
];

const FAQPage = () => {
    return (
        <PageWrapper className="pb-40 items-start overflow-x-hidden">
            <div className="px-2.5 desktop:px-10 flex flex-col desktop:flex-row desktop:items-end w-full gap-5 mb-12 desktop:mb-20">
                <div className="flex relative w-full desktop:max-w-max pt-32 desktop:pt-54">
                    <h1 className="text-heading-2xl tablet:text-heading-4xl! desktop:leading-[0.75]! text-primary text-start!">
                        Не тупые вопросы
                    </h1>

                    <FaqDoveThoughts className="desktop:hidden absolute top-13 tablet:top-24 tablet:right-30 z-30 right-21.5" />
                    <img
                        src={FaqDove}
                        className="desktop:hidden absolute bottom-0 right-2.5 w-full max-w-35 tablet:max-w-48 object-cover z-20"
                        alt=""
                    />
                </div>

                <div className="relative w-full overflow-hidden">
                    <div className="flex animate-marquee justify-start -ml-50 gap-2.5">
                        <FaqMarquee className="h-16 tablet:h-26 shrink-0 w-max" />
                        <FaqMarquee className="h-16 tablet:h-26 shrink-0 w-max" />
                        <FaqMarquee className="h-16 tablet:h-26 shrink-0 w-max" />
                        <FaqMarquee className="h-16 tablet:h-26 shrink-0 w-max" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 w-full desktop:grid-cols-16">
                <div className="px-2.5 desktop:px-10 flex flex-col w-full gap-2 z-10 desktop:col-span-10 desktop:mr-3 max-w-200">
                    {faqData.map((item) => (
                        <Accordion key={item.id} number={item.id} title={item.question}>
                            {item.answer}
                        </Accordion>
                    ))}
                </div>

                <div className="hidden desktop:flex desktop:col-span-6">
                    <div className="relative w-full h-full pt-12">
                        <FaqDoveThoughts className="absolute left-0 -top-14 z-30 h-full w-max max-h-30" />
                        <img src={FaqDove} className="object-contain w-full" alt="" />
                    </div>
                </div>
            </div>

            <FaqHeroBg
                className="absolute top-24 desktop:top-8 right-0 left-0 mx-auto max-w-[clamp(360px,100vw,1280px)] w-full pointer-events-none"
                preserveAspectRatio="none"
            />
        </PageWrapper>
    );
};

export default FAQPage;