"use client";
import React from "react";
import clsx from "clsx";
import { checkIsActive, KTIcon, WithChildren } from "@/_metronic/helpers";
import { usePathname } from "next/navigation";
import { useLayout } from "@/layout/core";

type Props = {
  to: string;
  title: string;
  icon?: string;
  fontIcon?: string;
  hasBullet?: boolean;
  isOpen?: boolean;
  onToggle?: () => void;
};

const SidebarMenuItemWithSub: React.FC<Props & WithChildren> = ({
  children,
  to,
  title,
  icon,
  fontIcon,
  hasBullet,
  isOpen = false,
  onToggle,
}) => {
  const pathname = usePathname();
  const isActive = checkIsActive(pathname, to);
  const { config } = useLayout();
  const { app } = config;

  const handleToggle = () => {
    if (onToggle) {
      onToggle();
    }
  };

  return (
    <div
      className={clsx("menu-item", { "here show": isActive }, "menu-accordion", {
        "hover show": isOpen,

      })}


      data-kt-menu-trigger="click"
      onClick={handleToggle}
    >
      <span className="menu-link">
        {hasBullet && (
          <span className="menu-bullet">
            <span className="bullet bullet-dot"></span>
          </span>
        )}

        {icon && app?.sidebar?.default?.menu?.iconType === "svg" && (
          <span className="menu-icon">
            {" "}
            <KTIcon
              iconName={icon}
              className={clsx("fs-2 text-gray-600  me-2", {
                "text-blue": isActive,
              })}
            />
          </span>
        )}
        {fontIcon && app?.sidebar?.default?.menu?.iconType === "font" && (
          <i className={clsx("bi fs-3", fontIcon)}></i>
        )}
        <span className="menu-title text-light">{title}</span>
        <span className="menu-arrow"></span>
      </span>
      <div
        className={clsx("menu-sub menu-sub-accordion", {
          "menu-active-bg": isActive,
          "show": isOpen,

        })}
      >
        {children}
      </div>
    </div>
  );
};

export { SidebarMenuItemWithSub };
