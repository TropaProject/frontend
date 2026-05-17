import clsx from "clsx";
import type { SVGProps } from 'react';

const GuideContainerBackground = ({ className, ...props }: SVGProps<SVGSVGElement>) => {
  return (
    <>
      <svg
        className={clsx(className, 'block desktop:hidden')} width={360} height={1450} viewBox="0 0 360 1450" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M0.356631 64.0041C87.8647 -73.6547 234.555 53.5877 289.122 53.5877H360V1330.34C360 1531.86 275.527 1411.68 111.133 1438.44C-53.2611 1465.21 0.35663 1282.58 0.35663 1282.58L0.356631 64.0041Z" fill="#7375DC" />
      </svg>

      <svg
        className={clsx(className, 'hidden desktop:block')}
        width={1280} height={914} viewBox="0 0 1280 914" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M0 95.5902C265.848 -51.3263 453.168 -15.9288 867.138 113.918H1281V769.5C1190.62 890.666 706.778 811.788 538.5 828C370.222 844.212 253.482 941.708 0 905.053V95.5902Z" fill="#7375DC" />
      </svg>
    </>
  );
};

export default GuideContainerBackground;