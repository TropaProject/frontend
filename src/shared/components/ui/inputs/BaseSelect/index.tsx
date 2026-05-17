// shared/components/ui/inputs/BaseSelect/index.tsx
import BaseButton from '@/shared/components/ui/buttons/BaseButton';
import SearchInputButtonBg from '@/shared/components/ui/inputs/BaseSearchInput/assets/backgrounds/SearchInputButtonBg';
import SearchInputButtonIcon from '@/shared/components/ui/inputs/BaseSearchInput/assets/icons/SearchInputButtonIcon';
import BaseSelectBorder from '@/shared/components/ui/inputs/BaseSelect/assets/BaseSelectBorder';
import { BorderWrapper } from '@/shared/components/wrappers/BorderWrapper';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';

export type Option = {
    id: string | number;
    label: string;
    image?: string;
    bgColor?: string;
    textColor?: string;
};

type Props = {
    options: Option[];
    value?: Option;
    onChange: (option: Option) => void;
    placeholder?: string;
    className?: string;
};

const BaseSelect = ({ options, value, onChange, placeholder = "Выберите...", className }: Props) => {
    const panelTransition = { duration: 0.4, ease: [0.4, 0, 0.2, 1] as const };

    return (
        <div className={`w-full ${className}`}>
            <Listbox value={value} onChange={onChange}>
                {({ open }) => (
                    <div className="relative group transition-all duration-300 pb-0.5">
                        <ListboxButton className="flex flex-row items-center justify-between relative z-20 w-full h-16 pl-5 pt-1 pb-1 text-left bg-transparent cursor-pointer focus:outline-none">
                            <span className="block truncate text-text text-body-lg pr-2">
                                {value?.label || placeholder}
                            </span>

                            <BaseButton
                                type="button"
                                variant="primary"
                                className="w-7.5 h-7.5 p-0 my-auto flex items-center justify-center pointer-events-none absolute right-3"
                                customBg={<SearchInputButtonBg className="absolute inset-0 w-full h-full text-primary" />}
                            >
                                <SearchInputButtonIcon
                                    className={`w-5 h-5 z-20 transition-transform duration-300 rotate-90 ${open ? '-scale-x-100' : ''}`}
                                />
                            </BaseButton>
                        </ListboxButton>

                        <AnimatePresence initial={false}>
                            {open && (
                                <ListboxOptions
                                    static
                                    className="relative z-20 w-full overflow-hidden focus:outline-none"
                                >
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={panelTransition}
                                    >
                                        {options.map((option) => (
                                            <ListboxOption
                                                key={option.id}
                                                value={option}
                                                className="relative h-14 w-full cursor-pointer select-none outline-none group/opt last:*:rounded-b-2xl"
                                            >
                                                <div className={`absolute inset-0 overflow-hidden transition-colors ${option.bgColor || 'bg-transparent'}`}>
                                                    {option.image && (
                                                        <img
                                                            src={option.image}
                                                            alt=""
                                                            className="absolute left-0 top-0 bottom-0 w-3/5 h-full object-cover"
                                                        />
                                                    )}

                                                    <div className="absolute inset-0 group-data-[focus]/opt:bg-white/10 transition-colors" />

                                                    <div className="relative h-full flex items-center justify-end">
                                                        <span className={`
                                                            text-body-lg transition-all
                                                            ${option.textColor || 'text-text'}
                                                            group-data-[focus]/opt:translate-x-[-4px]
                                                            px-5
                                                        `}>
                                                            {option.label}
                                                        </span>
                                                    </div>
                                                </div>
                                            </ListboxOption>
                                        ))}
                                    </motion.div>
                                </ListboxOptions>
                            )}
                        </AnimatePresence>

                        <div className="pointer-events-none *:z-20">
                            <AnimatePresence>
                                {!open && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="absolute inset-0 z-10 h-16"
                                    >
                                        <BorderWrapper borderComponent={BaseSelectBorder} className="h-full w-full" />
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
            </Listbox>
        </div>
    );
};

export default BaseSelect;