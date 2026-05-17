import * as React from "react";

const SliderButtonBg = (props: React.SVGProps<SVGSVGElement>) => {
    return (
        <svg width={32} height={30} viewBox="0 0 32 30" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path d="M1.22954 1.79719C1.45358 1.55 3.84339 1.08099 6.54042 0.754849C21.2015 -1.01874 29.0724 0.32437 30.7021 4.87629C31.8961 8.21293 31.0708 27.3145 29.6726 28.6905C28.5713 29.7732 26.6164 29.9734 18.063 29.8747C16.5032 29.8569 12.5395 29.9039 9.25447 29.9781C4.19601 30.0928 3.00772 29.7996 1.49519 28.0654C-0.125105 26.2082 -0.239488 24.9055 0.266264 14.1315C0.573497 7.59448 1.00644 2.04439 1.22954 1.79719Z" fill="currentColor" />
        </svg>
    );
};

export default SliderButtonBg;
