"use client";
import { FC } from "react";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { KTIcon } from "@/_metronic/helpers/components/KTIcon";
import { WithChildren, checkIsActive } from "@/_metronic/helpers";
import { useLayout } from "@/layout/core";

type Props = {
  to: string;
  title: string;
  icon?: string;
  fontIcon?: string;
  hasBullet?: boolean;
  onClick?: () => void; // Add this line
};
const SidebarMenuItem: FC<Props & WithChildren> = ({

  to,
  title,
  icon,
  fontIcon,
  hasBullet = false,
  onClick, // Destructure onClick
}) => {
  const pathname = usePathname();
  const isActive = checkIsActive(pathname, to);
  const { config } = useLayout();
  const { app } = config;

  return (
    <div className="menu-item rounded-2 border-0" onClick={onClick}>
      <Link
        className={clsx("menu-link ", {
          active: isActive,
          "text-light": isActive,
        })}
        href={to}
      >
        {hasBullet && (
          <span className="menu-icon">
            {/* Bullet can be added here */}
          </span>
        )}
        {icon && app?.sidebar?.default?.menu?.iconType === "svg" && (
          <span className="menu-icon">
            <KTIcon
              iconName={icon}
              className={clsx("fs-2 text-gray-600 me-2", {
                "text-blue": isActive,
              })}
            />
          </span>
        )}
        {fontIcon && app?.sidebar?.default?.menu?.iconType === "font" && (
          <i className={clsx("bi fs-3", fontIcon)}></i>
        )}
        <div
          className={clsx("menu-title text-light fs-6", {
            "text-light ": isActive,
          })}
        >

          <span style={{whiteSpace:"nowrap"}}>

            {title}
          </span>

        </div>
      </Link>
      {/* {children} */}
    </div>
  );
};

export { SidebarMenuItem };
