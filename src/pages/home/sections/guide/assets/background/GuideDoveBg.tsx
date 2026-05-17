import clsx from "clsx";
import type { SVGProps } from 'react';

const GuideDoveBg = ({ className, ...props }: SVGProps<SVGSVGElement>) => {
  return (
    <>
      <svg
        className={clsx(className, 'block desktop:hidden')} width={185} height={339} viewBox="0 0 185 339" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M27.0549 283.207C33.9078 310.838 45.6438 339 169.392 339C200.498 323.833 195.158 9.48331 171.495 12.0751C78.2461 22.2886 37.4969 -40.1264 5.15909 47.5785C-12.0278 94.1918 18.7942 161.607 24.063 201.224C28.2376 232.612 20.202 255.576 27.0549 283.207Z" fill="#FFD8DC" />
      </svg>
      <svg
        className={clsx(className, 'hidden desktop:block')}
        width={539} height={513} viewBox="0 0 539 513" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M48.5081 428.5C68.9902 470.348 104.067 513 473.926 513C566.897 490.029 550.936 13.9391 480.213 17.8644C201.509 33.3331 118.469 -60.4966 21.818 72.3344C-29.5503 142.932 23.8183 244.334 39.5659 304.334C52.0429 351.873 28.0261 386.652 48.5081 428.5Z" fill="#FFD8DC" />
      </svg>
    </>
  );
};

export default GuideDoveBg;