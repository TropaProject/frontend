import clsx from "clsx";
import type { SVGProps } from 'react';

const HeroBgLeft = ({ className, ...props }: SVGProps<SVGSVGElement>) => {
  return (
    <>
      <svg
        className={clsx(className, 'block desktop:hidden')}
        width={150} height={211} viewBox="0 0 150 211" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M139.207 98.7773C150.895 111.712 153.301 134.024 145.391 171.906C140.836 186.961 101.544 182.184 101.544 182.184C83.4831 186.368 0 211 0 211V192.5V0C9.7967 1.51813 16.5443 14.1742 27.955 32.6315C35.8408 45.387 76.1912 36.668 92.6354 57.8035C111.182 81.6413 117.056 74.2637 139.207 98.7773Z" fill="#BFE578" />
      </svg>

      <svg
        className={clsx(className, 'hidden desktop:block')}
        width={445} height={278} viewBox="0 0 445 278" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>

        <path d="M438.999 88.0895C446.414 68.2276 448.5 58.5 432 19.5C422.5 3.99997 373.999 22.0896 258.499 0.589543C224.6 -5.72077 191.499 40.0894 160.499 68.0896C118.439 106.08 0.49913 77.0897 -10.0009 88.0897C-5.3342 103.256 -19.9994 277.327 -13.1994 277.327C-4.69936 277.327 53.1907 272.81 108 257.09C172.5 238.59 164.499 195.102 228.499 179.602C292.499 164.102 331.559 191.599 378.5 141C400.526 117.258 424.999 125.59 438.999 88.0895Z" fill="#BFE578" />
      </svg>

    </>
  );
};

export default HeroBgLeft;