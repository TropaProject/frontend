import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { type ReactNode } from 'react';

import BaseButton from '@/shared/components/ui/buttons/BaseButton';
import SearchInputButtonBg from '@/shared/components/ui/inputs/BaseSearchInput/assets/backgrounds/SearchInputButtonBg';
import SearchInputButtonIcon from '@/shared/components/ui/inputs/BaseSearchInput/assets/icons/SearchInputButtonIcon';
import { BorderWrapper } from '@/shared/components/wrappers/BorderWrapper';
import AccordionBorder from '@/shared/components/ui/accordions/assets/borders/AccordionBorder';

type Props = {
    number?: string | number;
    title: string;
    children: ReactNode;
    className?: string;
    defaultOpen?: boolean;
    contentInnerPadding?: string;
    contentClassName?: string;
    titleColor?: string;
};
const Accordion = ({ number, title, children, className, defaultOpen = false, contentInnerPadding, contentClassName, titleColor = 'text-text ' }: Props) => {
    const panelTransition = { duration: 0.4, ease: [0.4, 0, 0.2, 1] as const };

    return (
        <div className={clsx("w-full", className)}>
            <Disclosure defaultOpen={defaultOpen}>
                {({ open }) => (
                    <div className="relative group pb-1">
                        <DisclosureButton className="flex flex-row items-center justify-between relative z-20 w-full h-20 pl-5 text-left bg-transparent cursor-pointer focus:outline-none overflow-hidden">
                            <div className="flex items-center gap-2 max-w-[85%] h-full py-2">
                                {!!number && (
                                    <span className="text-primary text-heading-sm shrink-0 leading-none">{number}.</span>
                                )}
                                <span className={clsx(titleColor, "text-body-lg line-clamp-2")}>
                                    {title}
                                </span>
                            </div>

                            <BaseButton
                                type="button"
                                variant="primary"
                                className="w-7.5 h-7.5 p-0 my-auto flex items-center justify-center pointer-events-none absolute right-3"
                                customBg={<SearchInputButtonBg className="absolute inset-0 w-full h-full text-primary" />}
                            >
                                <SearchInputButtonIcon
                                    className={clsx(
                                        "w-5 h-5 z-20 transition-transform duration-300 rotate-90",
                                        open && "-scale-x-100"
                                    )}
                                />
                            </BaseButton>
                        </DisclosureButton>

                        <AnimatePresence initial={false}>
                            {open && (
                                <DisclosurePanel
                                    static
                                    className={clsx(contentClassName, "relative z-20 w-full overflow-hidden focus:outline-none")}
                                >
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={panelTransition}
                                    >
                                        <div className={clsx(contentInnerPadding, "pr-5 pl-10.5 pb-6")}>
                                            <div className="text-text text-body-xs sm:text-body-sm">
                                                {children}
                                            </div>
                                        </div>
                                    </motion.div>
                                </DisclosurePanel>
                            )}
                        </AnimatePresence>

                        <div className="absolute inset-0 pointer-events-none">
                            <AnimatePresence>
                                {!open && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="absolute inset-0 z-10 h-20"
                                    >
                                        <BorderWrapper borderComponent={AccordionBorder} className="h-full w-full" />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <AnimatePresence>
                                {open && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="absolute inset-0 z-10"
                                    >
                                        <div className="absolute inset-0 border-2 border-secondary rounded-3xl rotate-[-0.1deg] mt-0.5" />
                                        <div className="absolute inset-0 border border-secondary rounded-3xl ml-0.5 -scale-y-100 rotate-[-0.25deg]" />
                                        <div className="absolute inset-0 border border-secondary rounded-3xl" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="absolute inset-0 bg-background rounded-lg -z-10" />
                    </div>
                )}
            </Disclosure>
        </div>
    );
};


export default Accordion;