import LogoFull from '@/shared/assets/logos/LogoFull'
import { NavLink } from '@/shared/components/ui/buttons/NavLink'
import SocialLink from '@/shared/components/ui/buttons/SocialLink'
import FooterBg from '@/widgets/footer/assets/FooterBg'
import { motion } from 'framer-motion'

export function Footer({ className }: { className?: string }) {
    const navLinks = [
        { label: 'Преимущества', href: '/#advantages' },
        { label: 'Как это работает', href: '/#guide', className: 'order-3 desktop:order-2' },
        { label: 'Отзывы', href: '/#reviews', className: 'order-5 desktop:order-3' },
        { label: 'FAQ', href: '/faq', className: 'order-2 desktop:order-4' },
        { label: 'Блог', href: '/#blog', className: 'order-4 desktop:order-5' },
    ]

    const legalLinks = [
        { label: 'Политика конфиденциальности', href: '#privacy' },
        { label: 'Юридическая информация', href: '#legal' },
    ]

    return (
        <footer className={className}>
            <div className="relative mx-auto w-full max-w-mobile overflow-hidden -mt-24 pt-24 desktop:pb-68">
                <FooterBg />

                <div className="relative text-text w-max desktop:text-background z-20 mx-auto grid grid-cols-[auto_auto] px-4 mt-10 mb-10 gap-y-10 gap-x-2 xs:gap-x-6 justify-items-start desktop:mt-28 desktop:px-10 desktop:grid-cols-16 desktop:grid-rows-2 desktop:gap-y-6 desktop:gap-x-16">

                    <nav className="order-2 col-span-1 desktop:order-1 desktop:col-span-3 w-full desktop:mt-10">
                        <ul className="grid grid-cols-[auto_auto] gap-x-4 gap-y-3 desktop:grid-cols-1 desktop:justify-items-start">
                            {navLinks.map((link) => (
                                <li
                                    key={link.label}
                                    className={`${link.className} w-max justify-self-start`}
                                >
                                    <NavLink
                                        href={link.href}
                                        className="text-body-sm-medium hover:text-primary transition-colors whitespace-nowrap block text-left"
                                    >
                                        {link.label}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <div className="order-1 col-span-1 flex flex-col gap-4 w-max desktop:order-3 desktop:col-span-3 desktop:col-start-14 desktop:mt-10">
                        <h2 className="hidden desktop:block text-heading-xl!">Контакты</h2>
                        <a href="mailto:info@tropa.com" className="text-body-sm-medium hover:text-primary transition-colors desktop:text-background">
                            info@tropa.com
                        </a>
                        <ul className="flex gap-2">
                            <SocialLink name="vk" bgColor="fill-[#36A1D3]" borderColor="stroke-background" iconColor="text-background" />
                            <SocialLink name="tg" bgColor="fill-[#36A1D3]" borderColor="stroke-background" iconColor="text-background" />
                        </ul>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 1.7, ease: "easeOut" }}
                        className="order-first col-span-2 flex items-center justify-center justify-self-center desktop:order-2 desktop:col-span-10 desktop:col-start-4 desktop:row-span-2"
                    >
                        <LogoFull className="w-full max-w-64 object-contain desktop:max-w-min" />
                    </motion.div>

                    <div className="order-3 col-span-1 text-secondary desktop:text-background flex flex-col justify-end desktop:justify-start gap-3 text-body-sm-medium w-max desktop:order-4 desktop:col-span-3 desktop:row-start-2">
                        <a href='https://julys-design.ru/'>Дизайн сайта</a>
                        <p>© Все права защищены, 2026</p>
                    </div>

                    <nav className="order-4 col-span-1 text-secondary desktop:text-background flex flex-col justify-end desktop:justify-start w-max desktop:order-5 desktop:col-span-3 desktop:col-start-14 desktop:row-start-2">
                        <ul className="flex flex-col gap-3 leading-none">
                            {legalLinks.map((link) => (
                                <li key={link.label}>
                                    <NavLink
                                        href={link.href}
                                        className="text-body-sm-medium hover:text-primary transition-colors"
                                    >
                                        {link.label}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            </div>
        </footer>
    )
}