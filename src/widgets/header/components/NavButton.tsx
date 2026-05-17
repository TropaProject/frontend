// shared/components/ui/NavButton.tsx
import type { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

interface NavButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
}

const NavButton = ({ ref, className, children, ...props }: NavButtonProps & { ref?: React.RefObject<HTMLButtonElement | null> }) => {
    return (
        <button
            type='button'
            ref={ref}
            className={clsx(
                'cursor-pointer text-body-sm-medium! text-background px-2 py-1.5 hover:opacity-90 transition-opacity',
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
};

NavButton.displayName = 'NavButton';

export default NavButton;