import clsx from "clsx";
import type { SVGProps } from 'react';

const AboutRoadLeft = ({ className, ...props }: SVGProps<SVGSVGElement>) => {
  return (
    <>
      <svg
        className={clsx(className, 'block desktop:hidden')}
        width={157} height={408} viewBox="0 0 157 408" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M-267.182 372.566C-170.949 320.032 112.761 387.42 124.381 343.725C148.153 254.332 -9.12504 244.585 4.62395 192.882C16.1144 149.672 76.3448 149.614 49.7399 86.057C23.1351 22.5005 -145.996 25.1765 -191.438 35.958C-236.881 46.7395 -300.573 36.753 -300.573 36.753" stroke="#EFEFF3" stroke-width="60" />
        <path d="M-267.182 372.566C-170.949 320.032 112.761 387.42 124.381 343.725C148.153 254.332 -9.12504 244.585 4.62395 192.882C16.1144 149.672 76.3448 149.614 49.7399 86.057C23.1351 22.5005 -145.996 25.1765 -191.438 35.958C-236.881 46.7395 -300.573 36.753 -300.573 36.753" stroke="#FFFEF8" stroke-width="2" stroke-dasharray="50 50" />
      </svg>

      <svg
        className={clsx(className, 'hidden desktop:block')}
        width={454} height={624} viewBox="0 0 454 624" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <g clip-path="url(#clip0_1_1902)">
          <path d="M-94.5217 456.571C1.71095 404.038 285.422 471.425 297.041 427.731C320.813 338.337 163.535 328.591 177.284 276.888C188.775 233.678 249.005 233.619 222.4 170.063C195.795 106.506 26.6644 109.182 -18.778 119.964C-64.2204 130.745 -127.912 120.759 -127.912 120.759" stroke="#EFEFF3" stroke-width="99" />
          <path d="M-94.5217 456.571C1.71095 404.038 285.422 471.425 297.041 427.731C320.813 338.337 163.535 328.591 177.284 276.888C188.775 233.678 249.005 233.619 222.4 170.063C195.795 106.506 26.6644 109.182 -18.778 119.964C-64.2204 130.745 -127.912 120.759 -127.912 120.759" stroke="#FFFEF8" stroke-width="3" stroke-dasharray="50 50" />
        </g>
        <defs>
          <clipPath id="clip0_1_1902">
            <rect width="530" height="504" fill="white" transform="matrix(-0.966414 -0.25699 -0.25699 0.966414 453.723 136.205)" />
          </clipPath>
        </defs>
      </svg>

    </>
  );
};

export default AboutRoadLeft;