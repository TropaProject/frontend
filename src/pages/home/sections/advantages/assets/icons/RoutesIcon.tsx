import * as React from "react";
import RoutesIconImg from "@/pages/home/sections/advantages/assets/images/routes-icon.png";
import clsx from "clsx";


const RoutesIcon = (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    return (
        <img src={RoutesIconImg} alt="Routes Icon" className={clsx("w-full h-full", props.className)} {...props} />
    );
};

export default RoutesIcon;
