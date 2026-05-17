import * as React from "react";

const VerifiedDateBadgeBorder = ({ className, ...props }: React.SVGProps<SVGSVGElement> & { className?: string }) => {
    return (
        <>
            <svg
                className={`${className} desktop:block hidden`}
                width={169} height={68} viewBox="0 0 169 68" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
                <path d="M167.174 0.5C168.553 22.6038 168.786 36.5389 167.706 57.2861C167.441 62.3824 163.115 66.3139 158.002 66.1846C100.939 64.741 65.8089 64.6971 11.8682 66.1484C6.51366 66.2925 2.07934 61.996 2.0791 56.6426V0.5H167.174Z" stroke="currentColor" />
                <path d="M167.148 0.5C166.82 30.5663 166.787 47.056 166.868 56.21C166.917 61.7517 162.41 66.4895 156.888 66.5459C70.7977 67.4216 26.7319 67.8829 9.79883 67.0986C5.74848 66.911 2.74059 63.7522 2.34277 59.6602C0.236573 37.9955 -0.219919 23.8237 1.79102 0.5H167.148Z" stroke="currentColor" />
            </svg>

            <svg
                className={`${className} desktop:hidden block`}
                width={141} height={34} viewBox="0 0 141 34" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
                <path d="M138.696 0.5C139.657 9.83162 139.93 16.2424 139.435 24.3262C139.135 29.2106 134.927 32.8995 130 32.8252C83.8828 32.1291 54.9786 32.1047 11.4834 32.7979C6.17134 32.8823 1.81058 28.6029 1.81055 23.292V0.5H138.696Z" stroke="currentColor" />
                <path d="M138.646 0.5C138.468 10.3165 138.397 17.2176 138.388 22.085C138.377 27.8637 133.469 33.0028 127.717 33.0381C60.107 33.4524 24.3125 33.6728 9.50293 33.334C5.36919 33.2394 2.047 30.218 1.46875 26.1113C0.230232 17.3152 0.103299 10.6499 1.54199 0.5H138.646Z" stroke="currentColor" />
            </svg>

        </>
    );
};

export default VerifiedDateBadgeBorder;
