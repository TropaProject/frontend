import clsx from "clsx";
import type { SVGProps } from 'react';

const HomeReviewsSinglePhotoBorder = ({ className, ...props }: SVGProps<SVGSVGElement>) => {
    return (
        <svg
            className={clsx(className, '')}
            width={238} height={232} viewBox="0 0 238 232" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <circle cx="116" cy="116" r="115.5" stroke="#FF3F6C" />
            <circle cx="122" cy="116" r="115.5" stroke="#FF3F6C" />
        </svg>
    );
};

export default HomeReviewsSinglePhotoBorder;