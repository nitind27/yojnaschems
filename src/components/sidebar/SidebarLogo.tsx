"use client";
import clsx from "clsx";

import { MutableRefObject, useEffect, useRef } from "react";

import Link from "next/link";
import Image from "next/image";
import { ToggleComponent } from "@/_metronic/assets/ts/components/_ToggleComponent";
import { KTIcon } from "@/_metronic/helpers";
import { useLayout } from "@/layout/core";

type PropsType = {
  sidebarRef: MutableRefObject<HTMLDivElement | null>;
};

const SidebarLogo = (props: PropsType) => {
  const { config } = useLayout();
  const toggleRef = useRef<HTMLDivElement>(null);

  const appSidebarDefaultMinimizeDesktopEnabled =
    config?.app?.sidebar?.default?.minimize?.desktop?.enabled;
  const appSidebarDefaultCollapseDesktopEnabled =
    config?.app?.sidebar?.default?.collapse?.desktop?.enabled;
  const toggleType = appSidebarDefaultCollapseDesktopEnabled
    ? "collapse"
    : appSidebarDefaultMinimizeDesktopEnabled
      ? "minimize"
      : "";
  const toggleState = appSidebarDefaultMinimizeDesktopEnabled ? "active" : "";
  const appSidebarDefaultMinimizeDefault =
    config.app?.sidebar?.default?.minimize?.desktop?.default;

  useEffect(() => {
    setTimeout(() => {
      const toggleObj = ToggleComponent.getInstance(
        toggleRef.current!
      ) as ToggleComponent | null;

      if (toggleObj === null) {
        return;
      }

      // Add a class to prevent sidebar hover effect after toggle click
      toggleObj.on("kt.toggle.change", function () {
        // Set animation state
        props.sidebarRef.current!.classList.add("animating");

        // Wait till animation finishes
        setTimeout(function () {
          // Remove animation state
          props.sidebarRef.current!.classList.remove("animating");
        }, 300);
      });
    }, 600);
  }, [toggleRef, props.sidebarRef]);

  return (
    <div className="app-sidebar-logo bg-light " id="kt_app_sidebar_logo">
      <Link href="/dashboard">
        {config.layoutType === "dark-sidebar" ? (

          //   <Image
          //   width={250}
          //   height={80}
          //   alt="Logo1"
          //   src="/media/logos/clocks horizntal.png"
          //   className="app-sidebar-logo-default"
          // />
          <Image
            width={185}
            height={10}
            alt="Logo5"
            src="/media/logos/clocks horizntal.png"
            className="app-sidebar-logo-default img-fluid"
          />
        ) : (
          <>
            <Image
              width={200}
              height={200}
              alt="Logo2"
              src={"/media/logos/logos.png"}
              className="h-25px app-sidebar-logo-default theme-light-show"
            />
            <Image
              width={200}
              height={200}
              alt="Logo3"
              src={"/media/logos/logos.png"}
              className="h-25px app-sidebar-logo-default theme-dark-show"
            />
          </>
        )}

        <Image
          width={80}
          height={85}
          alt="logo4"
          src={"/media/logos/logos.png"}
          className="app-sidebar-logo-minimize"
        />
      </Link>

      {(appSidebarDefaultMinimizeDesktopEnabled ||
        appSidebarDefaultCollapseDesktopEnabled) && (
          <div
            ref={toggleRef}
            id="kt_app_sidebar_toggle"
            className={clsx(
              "app-sidebar-toggle btn btn-icon btn-shadow btn-sm btn-color-muted h-30px w-30px position-absolute top-50 start-100 translate-middle rotate",
              { active: appSidebarDefaultMinimizeDefault }
            )}
            data-kt-toggle="true"
            data-kt-toggle-state={toggleState}
            data-kt-toggle-target="body"
            data-kt-toggle-name={`app-sidebar-${toggleType}`}
          >
            <KTIcon iconName="double-left" className="fs-2 rotate-180 ms-1 " />
          </div>
        )}
    </div>
  );
};

export { SidebarLogo };
