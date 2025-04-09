"use client";
import { FC, ReactNode } from "react";
import clsx from "clsx";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { checkIsActive } from "@/_metronic/helpers";

type Props = {
  to: string;

  icon?: string;
  fontIcon?: string;
  hasArrow?: boolean;
  hasBullet?: boolean;
  children?: ReactNode; // Add children prop
};

const MenuItem: FC<Props> = ({
  to,


  children, // Destructure children
}) => {
  const pathname = usePathname();
  const isActive = checkIsActive(pathname, to);

  return (
    <div className={clsx("menu-item", { "menu-item-active": isActive })}>

      {children && <div className="menu-submenu">{children}</div>} {/* Render children */}
    </div>
  );
};

export { MenuItem };
