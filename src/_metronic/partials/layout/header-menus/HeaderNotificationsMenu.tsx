import React from "react";
import { KTIcon } from "@/_metronic/helpers";

export const defaultAlerts = [
  {
    title: "Project Alice",
    description: "Phase 1 development",
    time: "1 hr",
    icon: "abstract-28",
    state: "primary",
  },
  {
    title: "HR Confidential",
    description: "Confidential staff documents",
    time: "2 hrs",
    icon: "information",
    state: "danger",
  },
  {
    title: "Company HR",
    description: "Corporate staff profiles",
    time: "5 hrs",
    icon: "briefcase",
    state: "warning",
  },
  {
    title: "Project Red",
    description: "New frontend admin theme",
    time: "2 days",
    icon: "abstract-12",
    state: "success",
  },
  {
    title: "Project Breafing",
    description: "Product launch status update",
    time: "21 Jan",
    icon: "colors-square",
    state: "primary",
  },
  {
    title: "Banner Assets",
    description: "Collection of banner images",
    time: "21 Jan",
    icon: "graph-3",
    state: "info",
  },
  {
    title: "Icon Assets",
    description: "Collection of SVG icons",
    time: "20 March",
    icon: "color-swatch",
    state: "warning",
  },
];


const HeaderNotificationsMenu: React.FC = () => {
  const backgroundImageUrl="/media/demo/2600x1200/menu-header-bg.jpg";
  return (
    <div
      className="menu menu-sub menu-sub-dropdown menu-column w-350px w-lg-375px"
      data-kt-menu="true"
    >
      <div
        style={{
          backgroundImage: `url(${backgroundImageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display:'block'
        }}
        className="d-flex flex-column bg rounded-top-3"
      >
        <h3 className="text-white fw-bold px-9 mt-10 mb-6">
          Notifications <span className="fs-8 opacity-75 ms-2">24 reports</span>
        </h3>
      </div>
      <div className="tab-pane d-block">
        <div className="scroll-y mh-325px my-5 px-5">
          {defaultAlerts.map((alert, index) => (
            <div key={`alert${index}`} className="d-flex flex-stack py-5">
              <div className="d-flex align-items-center">
                <div className="symbol symbol-35px me-4">
                  <span className={`symbol-label text-bg-${alert.state}`}>
                    <KTIcon
                      iconName={alert.icon}
                      iconType="duotone"
                      className={`fs-2 text-${alert.state}`}
                    />
                  </span>
                </div>
                <div className="mb-0 me-2">
                  <div className="fs-6 text-hover-primary fw-bolder">
                    {alert.title}
                  </div>
                  <div className="text-gray-800 mt-2 fs-7">
                    {alert.description}
                  </div>
                </div>
              </div>
              <span className="badge badge-light fs-8">{alert.time}</span>
            </div>
          ))}
        </div>
        <div className="text-center border-top py-3">
          <div className="btn btn-color-gray-600 btn-active-color-primary">
            View All{" "}
            <KTIcon
              iconType="duotone"
              iconName="arrow-right"
              className="fs-5"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderNotificationsMenu;
