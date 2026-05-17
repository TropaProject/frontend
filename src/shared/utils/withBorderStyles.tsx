// @/shared/utils/withBorderStyles.tsx
import * as React from 'react';
import clsx from 'clsx';

export type BorderComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>;

export const withBorderStyles = (Component: BorderComponent): BorderComponent => {
    const Wrapped = (props: React.SVGProps<SVGSVGElement>) => {
        const { className, ...rest } = props;

        return (
            <Component
                // Эти пропсы теперь будут у каждого бордера автоматически
                className={clsx(
                    'absolute inset-0 w-full h-full pointer-events-none z-0',
                    className
                )}
                preserveAspectRatio="none"
                {...rest}
            />
        );
    };

    Wrapped.displayName = `WithBorderStyles(${Component.displayName || Component.name || 'Component'})`;
    return Wrapped;
};