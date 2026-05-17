// @/shared/components/BorderWrapper.tsx
import * as React from 'react';
import clsx from 'clsx';

interface BorderWrapperProps {
    borderComponent: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    className?: string;
}

export const BorderWrapper = ({
    borderComponent: BorderComponent,
    className
}: BorderWrapperProps) => {
    return (
        <BorderComponent
            className={clsx(
                'absolute inset-0 w-full h-full pointer-events-none z-0',
                className
            )}
            preserveAspectRatio="none"
        />
    );
};