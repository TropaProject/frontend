import * as React from "react";

const BurgerMenuIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg width={36} height={23} viewBox="0 0 36 23" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M0.5 3.54717C5 2.38312 13.9 0.148067 15.5 0.547167C17.1 0.946267 22.1667 2.21458 24.5 2.54717H35.5M0.5 11.5472H14.5H26.5L35.5 10.5472M0.5 21.5472L8.5 20.5472L20.5 21.5472H29.5H35.5M0.5 2.54717C5 1.38312 12.9 1.14807 14.5 1.54717C16.1 1.94627 21.1667 3.21458 23.5 3.54717L35.5 1.54717M0.5 10.5472L12.5 9.54717L25.5 12.5472L35.5 11.5472M0.5 20.5472L7.5 19.5472L19.5 20.5472L29.5 21.5472L35.5 20.5472" stroke="#FFFEF8" strokeLinecap="round" />
    </svg>
  );
};

export default BurgerMenuIcon;
