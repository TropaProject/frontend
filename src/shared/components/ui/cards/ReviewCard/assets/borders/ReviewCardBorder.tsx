import * as React from "react";

const ReviewCardBorder = (props: React.SVGProps<SVGSVGElement>) => {
    return (
        <svg width={346} height={341} viewBox="0 0 346 341" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path opacity={0.88} d="M23.8063 8.38333L316.919 3.36904C327.753 3.18374 336.721 11.8664 336.886 22.7008L341.309 314.29C341.471 324.997 332.967 333.773 322.259 333.947L28.1444 338.73C17.2898 338.906 8.3199 330.185 8.19243 319.33L4.77117 27.974C4.64581 17.2988 13.1311 8.56595 23.8063 8.38333Z" stroke="currentColor" />
            <rect opacity={0.88} x={0.511977} y={0.491361} width={332.087} height={334.439} rx={19.5} transform="matrix(0.999856 -0.0169873 0.0240978 0.99971 3.96089 5.66704)" stroke="currentColor" />
        </svg>
    );
};

export default ReviewCardBorder;
