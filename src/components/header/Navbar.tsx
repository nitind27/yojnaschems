"use client";
import clsx from "clsx";
import { HeaderUserMenu, ThemeModeSwitcher } from "@/_metronic/partials";
import { KTIcon, toAbsoluteUrl } from "@/_metronic/helpers";
import HeaderNotificationsMenu from "@/_metronic/partials/layout/header-menus/HeaderNotificationsMenu";
import Image from "next/image";
import { useLayout } from "@/layout/core";
import LocalSwitcher from "../LanguageSwitcher/local-switcher";

const itemClass = "ms-1 ms-md-4";
const btnClass = "btn btn-icon btn-active-light-primary btn-custom";
const userAvatarClass = "symbol-35px";
const btnIconClass = "fs-1";

const Navbar = ({ increase, decrease, resetsize }: any) => {
  const { config } = useLayout();

  return (
    <div className="app-navbar flex-shrink-0" >
      <div className={clsx("app-navbar-item", itemClass)}>
        {/* Dropdown for small screens */}
        <div className="d-md-none">
          <div className="btn-group">
            <button
              className="btn btn-outline-secondary btn-sm dropdown-toggle"
              type="button"
              id="dropdownMenuButton"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Actions
            </button>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
              <li>
                <button className="dropdown-item" onClick={increase}>+A</button>
              </li>
              <li>
                <button className="dropdown-item" onClick={decrease}>-A</button>
              </li>
              <li>
                <button className="dropdown-item" onClick={resetsize}>A</button>
              </li>
            </ul>
          </div>
        </div>

        {/* Buttons for larger screens */}
        <div className="d-none d-md-flex">
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={increase}
          >
            +A
          </button>
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={decrease}
          >
            -A
          </button>
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={resetsize}
          >
            A
          </button>
        </div>

        <LocalSwitcher />


        <HeaderNotificationsMenu />
      </div>

      <div className={clsx("app-navbar-item", itemClass)}>
        <ThemeModeSwitcher
          toggleBtnClass={clsx("btn-active-light-primary btn-custom")}
        />
      </div>

      <div className={clsx("app-navbar-item", itemClass)}>
        <div
          className={clsx("cursor-pointer symbol", userAvatarClass)}
          data-kt-menu-trigger="{default: 'click'}"
          data-kt-menu-attach="parent"
          data-kt-menu-placement="bottom-end"
        >
          <Image
            src={"/media/images/avtar.jpg"}
            alt="Profile"
            width={100}
            height={100}
          />
        </div>
        <HeaderUserMenu />
      </div>
    </div>
  );
};

export { Navbar };