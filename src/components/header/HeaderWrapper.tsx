"use client";
import clsx from "clsx";

import { Header } from "./Header";
import { Navbar } from "./Navbar";
import Link from "next/link";
import Image from "next/image";
import { KTIcon, toAbsoluteUrl } from "@/_metronic/helpers";
import { LayoutSetup, useLayout } from "@/layout/core";

export function HeaderWrapper({ increase,decrease ,resetsize}: any) {
  const { config, classes } = useLayout();
  if (config.app?.header?.default?.container === "fluid") {
    LayoutSetup.classes.headerContainer.push("container-fluid");
  } else {
    LayoutSetup.classes.headerContainer.push("container-xxl");
  }
  if (!config.app?.header?.display) {
    return null;
  }

  return (
    <div
      id="kt_app_header"
      className="app-header "
      data-kt-sticky="true"
      data-kt-sticky-activate="{default: true, lg: true}"
      data-kt-sticky-name="app-header-minimize"
      data-kt-sticky-offset='{default: "200px", lg: "0"}'
      data-kt-sticky-animation="false"
    >
      <div
        id="kt_app_header_container"
        className={clsx(
          "app-container dashed-border",
          classes.headerContainer.join(" "),
          config.app?.header?.default?.containerClass
        )}
      >
        {config.app.sidebar?.display && (
          <>
            {config.layoutType !== "dark-header" &&
            config.layoutType !== "light-header" ? (
              <div
                className="d-flex align-items-center  d-lg-none ms-n2 me-2"
                title="Show sidebar menu"
              >
                <div
                  className="btn btn-icon btn-active-color-primary w-35px h-35px"
                  id="kt_app_sidebar_mobile_toggle"
                >
                  <KTIcon iconName="abstract-14" className=" fs-1" />
                </div>
                <div className="d-flex align-items-center flex-grow-1 flex-lg-grow-0">
                  <Link href="/dashboard" className="d-lg-none">
                    <Image
                      width={55}
                      height={55}
                      alt="Logo"
                      src={"/media/logos/logos.png"}
                      // className="h-65px"
                
                    />
                  </Link>
                </div>
              </div>
            ) : null}
          </>
        )}

        {!(
          config.layoutType === "dark-sidebar" ||
          config.layoutType === "light-sidebar"
        ) && (
          <div className="d-flex align-items-center flex-grow-1 flex-lg-grow-0 me-lg-15">
            <Link href="/dashboard">
              {config.layoutType === "dark-header" ? (
                <Image
                  width={100}
                  height={100}
                  alt="Logo"
                  src={toAbsoluteUrl("/media/logos/default-dark.svg")}
                  className="h-20px h-lg-30px app-sidebar-logo-default"
                />
              ) : (
                <>
                  <Image
                    width={100}
                    height={100}
                    alt="Logo"
                    src={toAbsoluteUrl("/media/logos/default.svg")}
                    className="h-20px h-lg-30px app-sidebar-logo-default theme-light-show"
                  />
                  <Image
                    width={100}
                    height={100}
                    alt="Logo"
                    src={toAbsoluteUrl("/media/logos/default-dark.svg")}
                    className="h-20px h-lg-30px app-sidebar-logo-default theme-dark-show"
                  />
                </>
              )}
            </Link>
          </div>
        )}

        <div
          id="kt_app_header_wrapper"
          className="d-flex align-items-stretch justify-content-between flex-lg-grow-1 "
        >
          {config.app.header.default?.content === "menu" &&
            config.app.header.default.menu?.display && (
              <div
                className="app-header-menu app-header-mobile-drawer align-items-stretch d-none d-lg-flex"
                data-kt-drawer="on"
                data-kt-drawer-name="app-header-menu"
                data-kt-drawer-activate="{default: true, lg: false}"
                data-kt-drawer-overlay="true"
                data-kt-drawer-width="225px"
                data-kt-drawer-direction="end"
                data-kt-drawer-toggle="#kt_app_header_menu_toggle"
                data-kt-swapper="true"
                data-kt-swapper-mode="{default: 'append', lg: 'prepend'}"
                data-kt-swapper-parent="{default: '#kt_app_body', lg: '#kt_app_header_wrapper'}"
              >
                <Header />
              </div>
            )}
          <Navbar increase={increase} decrease={decrease} resetsize={resetsize}/>
        </div>
      </div>
    </div>
  );
}
