import clsx from "clsx";
import type { SVGProps } from 'react';

const AboutCardBorder = ({ className, ...props }: SVGProps<SVGSVGElement>) => {
    return (
        <>
            <svg
                className={clsx(className, 'block desktop:hidden')}
                width={339} height={142} viewBox="0 0 339 142" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
                <rect opacity={0.88} x={0.461374} y={0.432434} width={331.114} height={139.004} rx={19.5637} transform="matrix(0.999975 -0.00709742 0.0576047 0.99834 -0.607906 2.21884)" stroke="#3A3B70" strokeWidth={0.87251} />
                <path opacity={0.88} d="M18.9283 3.57674L311.056 1.45758C322.021 1.3782 331.353 10.3107 331.741 21.2576L335.221 119.395C335.598 130.025 327.382 138.586 316.735 138.659L23.7992 140.681C12.7741 140.757 3.41704 131.726 3.11702 120.721L0.443683 22.6816C0.155936 12.118 8.34587 3.65351 18.9283 3.57674Z" stroke="#3A3B70" strokeWidth={0.87251} />
            </svg>
            <svg
                className={clsx(className, 'hidden desktop:block')}
                width={391} height={251} viewBox="0 0 391 251" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
                <rect opacity="0.88" x="0.518505" y="0.494137" width="376.295" height="246.005" rx="19.5" transform="matrix(0.999939 -0.0110388 0.0370718 0.999313 4.48757 4.17086)" stroke="#3A3B70" />
                <path opacity="0.88" d="M24.2207 6.3284L361.594 2.52178C372.465 2.39911 381.56 11.1857 381.807 22.0515L386.461 226.144C386.704 236.808 378.322 245.473 367.652 245.588L29.1995 249.221C18.2917 249.338 9.18513 240.49 8.99387 229.588L5.41991 25.6705C5.23376 15.0502 13.5945 6.44846 24.2207 6.3284Z" stroke="#3A3B70" />
            </svg>
        </>
    );
};

export default AboutCardBorder;