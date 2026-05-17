import * as React from "react";
import clsx from "clsx";


const BaseCardBorder = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => {
  return (
    <>
      <svg
        width={316}
        height={224}
        viewBox="0 0 316 224"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={clsx("hidden desktop:block text-text", className)}
        {...props}
      >
        <rect
          x={0.516958}
          y={0.49369}
          width={307.664}
          height={219.4}
          rx={19.5}
          transform="matrix(0.999928 -0.0120412 0.033989 0.999422 -0.384907 3.48405)"
          stroke="currentColor"
        />
        <path
          d="M19.3634 5.41702L288.099 2.09519C298.962 1.96102 308.024 10.7259 308.249 21.5846L311.941 199.407C312.162 210.082 303.749 218.77 293.07 218.896L23.4729 222.067C12.5774 222.195 3.50565 213.374 3.33221 202.483L0.502435 24.8125C0.333094 14.1789 8.72551 5.54868 19.3634 5.41702Z"
          stroke="currentColor"
        />
      </svg>

      <svg
        width="346"
        height="341"
        viewBox="0 0 346 341"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={clsx("block desktop:hidden text-primary", className)}
        {...props}
      >
        <path opacity="0.88" d="M23.8063 8.38333L316.919 3.36904C327.753 3.18374 336.721 11.8664 336.886 22.7008L341.309 314.29C341.471 324.997 332.967 333.773 322.259 333.947L28.1444 338.73C17.2898 338.906 8.3199 330.185 8.19243 319.33L4.77117 27.974C4.64581 17.2988 13.1311 8.56595 23.8063 8.38333Z" stroke="currentColor" />
        <rect opacity="0.88" x="0.511977" y="0.491361" width="332.087" height="334.439" rx="19.5" transform="matrix(0.999856 -0.0169873 0.0240978 0.99971 3.96089 5.66704)" stroke="currentColor" />
      </svg>
    </>
  );
};

export default BaseCardBorder;