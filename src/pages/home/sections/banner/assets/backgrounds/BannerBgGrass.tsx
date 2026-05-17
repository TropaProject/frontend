import clsx from "clsx";
import type { SVGProps } from 'react';

const BannerBgGrass = ({ className, ...props }: SVGProps<SVGSVGElement>) => {
    return (
        <>
            <svg
                className={clsx(className, 'block desktop:hidden')}
                width={360} height={179} viewBox="0 0 360 179" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
                <g clip-path="url(#clip0_7387_16321)">
                    <path d="M223.75 0.00625949C223.75 0.00625949 404.598 6.59476 373.377 126.479C358.066 185.275 341.388 179.661 205.051 178.122C-75.0023 174.96 9.90784 174.384 -7 101.536V25.6524C87.178 -1.0878 141.952 0.00625949 223.75 0.00625949Z" fill="#BFE578" />
                </g>
                <defs>
                    <clipPath id="clip0_7387_16321">
                        <rect width="360" height="179" fill="white" />
                    </clipPath>
                </defs>
            </svg>
            <svg
                className={clsx(className, 'hidden desktop:block')}
                width={1199} height={287} viewBox="0 0 1199 287" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
                <path d="M597.824 0C1120.67 5.77113e-05 1224.62 66.6965 1193.39 237.32C1178.07 321 868.289 258.145 579.119 253.5C298.976 249 24.1193 341 7.20598 237.32C-15.3808 32 10.4063 124.147 152.619 66.6965C246.828 28.6389 390.027 -2.29363e-05 597.824 0Z" fill="#BFE578" />
            </svg>
        </>
    );
};

export default BannerBgGrass;