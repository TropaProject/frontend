import * as React from "react";
import CoolGuysIconImg from "@/pages/home/sections/advantages/assets/images/cool-guys-icon.png";
import clsx from "clsx";


const CoolGuysIcon = (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    return (
        <img src={CoolGuysIconImg} alt="Routes Icon" className={clsx("w-full h-full max-w-7", props.className)} {...props} />
    );
};

export default CoolGuysIcon;
