import * as React from "react";

const SearchInputButtonBg = (props: React.SVGProps<SVGSVGElement>) => {
    return (
        <svg width={45} height={48} viewBox="0 0 45 48" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path d="M2.69577 45.3121C2.32499 44.9742 1.62148 41.3703 1.13226 37.3031C-1.5281 15.1935 0.48655 3.32402 7.31438 0.866298C12.3193 -0.934228 40.9714 0.310324 43.0354 2.41878C44.6595 4.0796 44.9598 7.02773 44.8118 19.9265C44.785 22.2787 44.8555 28.2562 44.9668 33.2102C45.1389 40.8385 44.699 42.6305 42.0978 44.9115C39.312 47.3549 37.358 47.5274 21.197 46.7647C11.3916 46.3014 3.06656 45.6485 2.69577 45.3121Z" fill="#FF3F6C" />
        </svg>
    );
};

export default SearchInputButtonBg;
