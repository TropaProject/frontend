// shared/components/ui/modals/BaseModal/BaseModal.tsx
import { BorderWrapper } from '@/shared/components/wrappers/BorderWrapper';
import EntityCardBorder from '@/shared/assets/borders/EntityCardBorder';
import { Dialog, DialogPanel, DialogBackdrop, Transition } from '@headlessui/react';
import { Fragment, type ReactNode } from 'react';

interface BaseModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
    className?: string;
    backdropClassName?: string;
}

export const BaseModal = ({ isOpen, onClose, children, className = '', backdropClassName = 'bg-text/15' }: BaseModalProps) => {
    return (
        <Transition show={isOpen} as={Fragment}>
            <Dialog onClose={onClose} className="relative z-100">
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <DialogBackdrop className={`fixed inset-0 ${backdropClassName}`} />
                </Transition.Child>

                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95 translate-y-4"
                        enterTo="opacity-100 scale-100 translate-y-0"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100 translate-y-0"
                        leaveTo="opacity-0 scale-95 translate-y-4"
                    >
                        <DialogPanel className={`w-full max-w-120 rounded-2xl relative p-8 bg-background shadow-xl ${className}`}>
                            <button
                                type="button"
                                onClick={onClose}
                                className="absolute top-4 right-4 hover:text-secondary/60 text-text transition-colors text-body-sm leading-none w-8 h-8 flex items-center justify-center"
                                aria-label="Закрыть"
                            >
                                ✕
                            </button>

                            {children}

                            <BorderWrapper borderComponent={EntityCardBorder} className="scale-101 text-text" />
                        </DialogPanel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
};